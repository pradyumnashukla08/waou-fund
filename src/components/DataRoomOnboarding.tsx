import React, { useState, useCallback, useEffect } from 'react';
import {
  Upload, FileText, CheckCircle2, AlertCircle, ArrowRight,
  Sparkles, Loader2, X, Eye, FileSpreadsheet, Presentation
} from 'lucide-react';
import { UserRole, UploadedFile, ExtractedStartupData } from '../types/user';
import { CLOUD_CONFIG } from '../config/cloud';
import { liveAiService } from '../services/liveAiService';

interface DataRoomOnboardingProps {
  userName: string;
  role: UserRole;
  onComplete: (data: ExtractedStartupData) => void;
  onSkip: () => void;
}

type AnalysisPhase = 'upload' | 'analyzing' | 'results' | 'error';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const FILE_ICONS: Record<string, React.ReactNode> = {
  'application/pdf': <FileText size={24} color="#EF4444" />,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': <Presentation size={24} color="#F97316" />,
  'application/vnd.ms-powerpoint': <Presentation size={24} color="#F97316" />,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <FileSpreadsheet size={24} color="#10B981" />,
  default: <FileText size={24} color="#6366F1" />,
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const DataRoomOnboarding: React.FC<DataRoomOnboardingProps> = ({ userName, role, onComplete, onSkip }) => {
  const [phase, setPhase] = useState<AnalysisPhase>(() => {
    try {
      return (sessionStorage.getItem('waou_onboard_phase') as AnalysisPhase) || 'upload';
    } catch {
      return 'upload';
    }
  });
  const [files, setFiles] = useState<UploadedFile[]>(() => {
    try {
      const saved = sessionStorage.getItem('waou_onboard_files');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [dragOver, setDragOver] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ExtractedStartupData | null>(() => {
    try {
      const saved = sessionStorage.getItem('waou_onboard_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('');
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Synchronize onboarding draft so accidental page refresh never drops uploaded files or analysis
  useEffect(() => {
    try {
      sessionStorage.setItem('waou_onboard_phase', phase);
      sessionStorage.setItem('waou_onboard_files', JSON.stringify(files));
      if (analysisResult) {
        sessionStorage.setItem('waou_onboard_result', JSON.stringify(analysisResult));
      } else {
        sessionStorage.removeItem('waou_onboard_result');
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [phase, files, analysisResult]);

  const clearOnboardingDraft = () => {
    try {
      sessionStorage.removeItem('waou_onboard_phase');
      sessionStorage.removeItem('waou_onboard_files');
      sessionStorage.removeItem('waou_onboard_result');
    } catch {}
  };

  const addFiles = useCallback((newFiles: FileList) => {
    const added: UploadedFile[] = Array.from(newFiles).map(f => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: f.name,
      size: f.size,
      type: f.type,
      uploadedAt: new Date().toISOString(),
      status: 'uploaded',
    }));
    setFiles(prev => [...prev, ...added]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  const runAnalysis = async () => {
    if (files.length === 0) return;
    setPhase('analyzing');
    setAnalysisError(null);

    const steps = [
      'Scanning document structure…',
      'Extracting financial metrics…',
      'Analyzing market positioning…',
      'Running fundability engine…',
      'Generating institutional report…',
    ];

    for (let i = 0; i < steps.length; i++) {
      setAnalysisStep(steps[i]);
      setAnalysisProgress(Math.round(((i + 1) / steps.length) * 100));
      await new Promise(r => setTimeout(r, 400 + Math.random() * 200));
    }

    try {
      const result = await liveAiService.extractDocumentsIntelligence(files);
      setAnalysisResult(result);
      setPhase('results');
    } catch (err: any) {
      console.warn('Document extraction error:', err);
      setAnalysisError(err.message || 'AI document extraction service is currently unavailable.');
      setPhase('error');
    }
  };

  const readyScore = analysisResult?.fundingReadiness ?? 0;
  const scoreColor = readyScore >= 75 ? '#10B981' : readyScore >= 55 ? '#F59E0B' : '#EF4444';
  const scoreLabel = readyScore >= 75 ? 'Institutional Ready' : readyScore >= 55 ? 'Needs Strengthening' : 'Early Stage';

  return (
    <div 
      className="dataroom-page-container"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 50%, #F0FDF4 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: '680px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#EFF6FF', color: '#2563EB', padding: '6px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
          <Sparkles size={13} />
          {phase === 'upload' ? 'Step 3 of 3 — Virtual Data Room' : phase === 'analyzing' ? 'AI Document Analysis' : '✓ Analysis Complete'}
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, color: '#0F172A', marginBottom: '0.6rem' }}>
          {phase === 'upload' && `Welcome, ${userName.split(' ')[0]}! Upload Your Documents`}
          {phase === 'analyzing' && 'AI Is Reading Your Documents…'}
          {phase === 'results' && 'Your Funding Readiness Report'}
        </h1>
        <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.6 }}>
          {phase === 'upload' && 'Upload your pitch deck, financial model, or business plan. Our AI will extract key data and auto-fill your founder profile.'}
          {phase === 'analyzing' && 'Our institutional-grade AI is analyzing your documents across 48 fundraising vectors…'}
          {phase === 'results' && 'Based on your uploaded documents, here\'s your preliminary funding readiness assessment.'}
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: phase === 'results' ? '900px' : '640px' }}>

        {/* ── UPLOAD PHASE ── */}
        {phase === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Drop Zone */}
            <div
              className="dataroom-dropzone"
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              style={{
                backgroundColor: dragOver ? '#EFF6FF' : '#FFFFFF',
                border: `2px dashed ${dragOver ? '#2563EB' : '#CBD5E1'}`,
                borderRadius: '20px',
                padding: '3.5rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: dragOver ? '0 0 0 4px rgba(37,99,235,0.1)' : 'none',
              }}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                multiple
                accept=".pdf,.pptx,.ppt,.xlsx,.xls,.docx,.doc,.txt"
                style={{ display: 'none' }}
                onChange={e => e.target.files && addFiles(e.target.files)}
              />
              <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Upload size={30} color="#2563EB" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
                Drag & drop your documents
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '0.75rem' }}>
                Pitch deck, financial model, business plan, cap table
              </p>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                PDF, PPTX, XLSX, DOCX — Max 50MB each
              </span>
            </div>

            {/* Document Type Suggestions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {[
                { icon: '📊', label: 'Pitch Deck', desc: 'PPTX or PDF', badge: 'High Priority' },
                { icon: '💹', label: 'Financial Model', desc: 'Excel / Google Sheets', badge: 'High Priority' },
                { icon: '📃', label: 'Business Plan', desc: 'PDF or DOCX', badge: 'Recommended' },
                { icon: '📋', label: 'Cap Table', desc: 'Excel or PDF', badge: 'Optional' },
              ].map(item => (
                <div key={item.label} style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                }}>
                  <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A' }}>{item.label}</span>
                  <span style={{ fontSize: '0.76rem', color: '#94A3B8' }}>{item.desc}</span>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: item.badge === 'High Priority' ? '#2563EB' : item.badge === 'Recommended' ? '#10B981' : '#94A3B8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}>{item.badge}</span>
                </div>
              ))}
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{files.length} document(s) ready</span>
                  <CheckCircle2 size={16} color="#10B981" />
                </div>
                {files.map(file => (
                  <div key={file.id} style={{
                    padding: '0.85rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    borderBottom: '1px solid #F1F5F9',
                  }}>
                    <div style={{ flexShrink: 0 }}>
                      {FILE_ICONS[file.type] || FILE_ICONS.default}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{formatFileSize(file.size)}</div>
                    </div>
                    <button onClick={() => removeFile(file.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px', borderRadius: '6px' }}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={runAnalysis}
                disabled={files.length === 0}
                style={{
                  flex: 1,
                  padding: '0.9rem',
                  borderRadius: '12px',
                  background: files.length > 0 ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : '#E2E8F0',
                  color: files.length > 0 ? '#FFFFFF' : '#94A3B8',
                  fontWeight: 800,
                  fontSize: '0.96rem',
                  border: 'none',
                  cursor: files.length > 0 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: files.length > 0 ? '0 8px 20px rgba(37,99,235,0.25)' : 'none',
                }}
              >
                <Sparkles size={17} />
                <span>Analyze Documents with AI</span>
              </button>
              <button
                onClick={() => {
                  clearOnboardingDraft();
                  onSkip();
                }}
                style={{
                  padding: '0.9rem 1.5rem',
                  borderRadius: '12px',
                  border: '1.5px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  color: '#64748B',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* ── ANALYZING PHASE ── */}
        {phase === 'analyzing' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 60px rgba(0,0,0,0.07)',
            padding: '3rem 2.5rem',
            textAlign: 'center',
          }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 2rem auto' }}>
              <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="52" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - analysisProgress / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>{analysisProgress}%</span>
              </div>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              {analysisStep || 'Initializing AI Engine…'}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '2rem' }}>
              Analyzing {files.length} document(s) across 48 institutional fundraising vectors
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
              {[
                { label: 'Document parsing & OCR', done: analysisProgress >= 20 },
                { label: 'Financial metric extraction', done: analysisProgress >= 40 },
                { label: 'Market opportunity analysis', done: analysisProgress >= 60 },
                { label: 'Fundability vector scoring', done: analysisProgress >= 80 },
                { label: 'Institutional readiness report', done: analysisProgress >= 100 },
              ].map(item => (
                <div key={item.label} style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: item.done ? '#F0FDF4' : '#F8FAFC',
                  border: `1px solid ${item.done ? '#BBF7D0' : '#E2E8F0'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  fontSize: '0.88rem',
                  color: item.done ? '#15803D' : '#64748B',
                  fontWeight: item.done ? 600 : 500,
                }}>
                  {item.done ? <CheckCircle2 size={16} color="#10B981" /> : <Loader2 size={16} color="#94A3B8" style={{ animation: 'spin 1s linear infinite' }} />}
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESULTS PHASE ── */}
        {phase === 'results' && analysisResult && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Score Hero */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: '1.5rem',
              alignItems: 'center',
              boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
            }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.3rem' }}>
                  {analysisResult.companyName}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1rem' }}>{analysisResult.tagline}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {[analysisResult.stage, analysisResult.sector, analysisResult.location].filter(Boolean).map(tag => (
                    <span key={tag} style={{ padding: '4px 12px', borderRadius: '999px', backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: '0.78rem', fontWeight: 700 }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{readyScore}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: scoreColor, marginTop: '2px' }}>/ 100</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginTop: '4px' }}>Fundability Score</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: scoreColor, marginTop: '2px', padding: '2px 10px', borderRadius: '999px', backgroundColor: scoreColor + '15' }}>{scoreLabel}</div>
              </div>
            </div>

            {/* Score Breakdown */}
            {analysisResult.fundingReadinessBreakdown && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '1.75rem',
              }}>
                <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem' }}>📊 Score Breakdown by Fundraising Vector</h4>
                {Object.entries({
                  'Team & Execution': analysisResult.fundingReadinessBreakdown.teamScore,
                  'Market Opportunity': analysisResult.fundingReadinessBreakdown.marketScore,
                  'Traction & Metrics': analysisResult.fundingReadinessBreakdown.tractionScore,
                  'Financial Health': analysisResult.fundingReadinessBreakdown.financialScore,
                  'Product & Moat': analysisResult.fundingReadinessBreakdown.productScore,
                }).map(([label, score]) => (
                  <div key={label} style={{ marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155' }}>{label}</span>
                      <span style={{ fontSize: '0.84rem', fontWeight: 800, color: score >= 70 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444' }}>{score}/100</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${score}%`,
                        borderRadius: '999px',
                        background: score >= 70 ? 'linear-gradient(90deg, #10B981, #059669)' : score >= 50 ? 'linear-gradient(90deg, #F59E0B, #D97706)' : 'linear-gradient(90deg, #EF4444, #DC2626)',
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Two Column: Strengths & Red Flags */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1rem' }}>
              {/* Strengths */}
              <div style={{ backgroundColor: '#F0FDF4', borderRadius: '16px', border: '1px solid #BBF7D0', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#15803D', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} /> Detected Strengths
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(analysisResult.strengths?.length ? analysisResult.strengths : ['Upload more documents for strength analysis']).map((s, i) => (
                    <li key={i} style={{ fontSize: '0.82rem', color: '#166534', lineHeight: 1.5 }}>• {s}</li>
                  ))}
                </ul>
              </div>

              {/* Red Flags */}
              <div style={{ backgroundColor: '#FFF7ED', borderRadius: '16px', border: '1px solid #FED7AA', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#C2410C', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={15} /> Flags to Address
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(analysisResult.redFlags?.length ? analysisResult.redFlags : ['No critical flags detected — continue building data room']).map((f, i) => (
                    <li key={i} style={{ fontSize: '0.82rem', color: '#9A3412', lineHeight: 1.5 }}>• {f}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Extracted Fields Preview */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={16} color="#2563EB" /> Auto-Filled Profile Fields
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '0.75rem' }}>
                {[
                  { label: 'Company', value: analysisResult.companyName },
                  { label: 'Funding Stage', value: analysisResult.stage },
                  { label: 'Sector', value: analysisResult.sector },
                  { label: 'Target Ask', value: analysisResult.askAmount },
                  { label: 'MRR', value: analysisResult.mrr },
                  { label: 'ARR', value: analysisResult.arr },
                  { label: 'TAM', value: analysisResult.tam },
                  { label: 'SAM', value: analysisResult.sam },
                  { label: 'Team Size', value: analysisResult.teamSize ? `${analysisResult.teamSize} people` : undefined },
                  { label: 'Founded', value: analysisResult.foundedYear },
                ].filter(f => f.value && f.value !== 'Not detected').map(field => (
                  <div key={field.label} style={{ padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{field.label}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>{field.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Investor Recommendation */}
            <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Recommendation</span>
              <p style={{ fontSize: '0.92rem', color: '#1E40AF', marginTop: '0.35rem', lineHeight: 1.6 }}>
                {analysisResult.investorRecommendation}
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                clearOnboardingDraft();
                if (analysisResult) onComplete(analysisResult);
              }}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
              }}
            >
              <span>Open My Founder Studio</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* ── ERROR STATE: SERVICE UNAVAILABLE ─────────────────────── */}
        {phase === 'error' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #FCA5A5',
            padding: '2.5rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.07)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DC2626',
            }}>
              <AlertCircle size={32} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.4rem' }}>
                AI Document Intelligence Notice
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#64748B', maxWidth: '500px', lineHeight: 1.5, margin: '0 auto' }}>
                {analysisError}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
              <button
                onClick={runAnalysis}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Retry Analysis
              </button>

              <button
                onClick={() => setPhase('upload')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer',
                }}
              >
                Change Files
              </button>

              <button
                onClick={() => {
                  clearOnboardingDraft();
                  onSkip();
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  backgroundColor: 'transparent',
                  color: '#64748B',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Continue to Manual Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
