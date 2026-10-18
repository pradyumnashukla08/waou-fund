import express, { type Request, type Response } from 'express';
import { storage } from '../config/firebase.ts';

const router = express.Router();

// Google Cloud Storage bucket for project-f62f4191-7560-45ab-8f3
const BUCKET_NAME = process.env.GCP_STORAGE_BUCKET || 'project-f62f4191-7560-45ab-8f3';

/**
 * POST /api/storage/upload
 * Direct cloud upload endpoint storing files into gs://project-f62f4191-7560-45ab-8f3
 */
router.post('/upload', async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileName, fileBase64, contentType, requirementId, stage, folder } = req.body;

    if (!fileName || !fileBase64) {
      res.status(400).json({ error: 'fileName and fileBase64 are required' });
      return;
    }

    // Clean filename for cloud storage
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const targetFolder = folder || (requirementId?.includes('pitch') || cleanFileName.toLowerCase().includes('pitch') ? 'pitches' : 'data_room');
    const storagePath = `${targetFolder}/${cleanFileName}`;

    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(storagePath);

    // Decode base64 payload
    const fileBuffer = Buffer.from(fileBase64, 'base64');

    await file.save(fileBuffer, {
      contentType: contentType || 'application/octet-stream',
      resumable: false,
      metadata: {
        cacheControl: 'public, max-age=31536000',
        metadata: {
          originalName: fileName,
          requirementId: requirementId || 'general',
          stage: stage || 'Seed',
          uploadedAt: new Date().toISOString(),
          source: 'WaouFund Virtual Data Room',
        },
      },
    });

    // Make file accessible or construct public URL
    let downloadUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${storagePath}`;
    try {
      await file.makePublic();
      downloadUrl = file.publicUrl();
    } catch {
      // Uniform bucket-level access fallback
      downloadUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${storagePath}`;
    }

    const sizeMb = (fileBuffer.length / (1024 * 1024)).toFixed(1);
    const displaySize = sizeMb === '0.0' ? `${(fileBuffer.length / 1024).toFixed(0)} KB` : `${sizeMb} MB`;

    console.log(`✅ [GCS Upload Success]: Stored ${fileName} in gs://${BUCKET_NAME}/${storagePath} (${displaySize})`);

    res.status(200).json({
      success: true,
      message: 'File successfully stored in Google Cloud Storage',
      fileName,
      storagePath,
      gcsUri: `gs://${BUCKET_NAME}/${storagePath}`,
      downloadUrl,
      sizeBytes: fileBuffer.length,
      displaySize,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Storage Upload Error]:', error.message || error);
    res.status(500).json({
      error: 'Failed to upload document to Google Cloud Storage',
      details: error.message || error,
    });
  }
});

/**
 * GET /api/storage/files
 * List all objects currently stored in gs://project-f62f4191-7560-45ab-8f3
 */
router.get('/files', async (req: Request, res: Response): Promise<void> => {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const [files] = await bucket.getFiles({ maxResults: 100 });

    const fileList = files.map((f) => {
      const sizeBytes = Number(f.metadata.size || 0);
      const sizeMb = (sizeBytes / (1024 * 1024)).toFixed(1);
      const displaySize = sizeMb === '0.0' ? `${(sizeBytes / 1024).toFixed(0)} KB` : `${sizeMb} MB`;

      return {
        name: f.name,
        sizeBytes,
        displaySize,
        updated: f.metadata.updated,
        contentType: f.metadata.contentType,
        gcsUri: `gs://${BUCKET_NAME}/${f.name}`,
        downloadUrl: `https://storage.googleapis.com/${BUCKET_NAME}/${f.name}`,
      };
    });

    res.status(200).json({
      success: true,
      bucket: BUCKET_NAME,
      gcsPrefix: `gs://${BUCKET_NAME}`,
      count: fileList.length,
      files: fileList,
    });
  } catch (error: any) {
    console.error('[Storage List Error]:', error.message || error);
    res.status(500).json({
      error: 'Failed to retrieve storage bucket files',
      details: error.message || error,
    });
  }
});

export default router;
