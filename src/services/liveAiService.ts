// Live AI Service for WaouFund Full-Stack Platform
// Securely routed through backend AI endpoints (/api/ai/*)
// Authenticated via Firebase ID tokens with strict, honest error handling
// Zero client-side API keys; NO synthetic/misleading fallback generation

import { ClarityVerdict } from '../types';
import { StartupProfile } from '../data/defaultData';
import { ExtractedStartupData, UploadedFile } from '../types/user';
import { apiClient, formatUserFacingError } from './apiClient';

export const liveAiService = {
  /**
   * Real-time Ask AI Advisor
   * Founder asks any question about their fundraising, metrics, runway, or pitch
   * Handled by backend route POST /api/ai/chat
   * Throws a sanitized user-facing Error if the backend service cannot be reached.
   */
  async askAI(question: string, startupContext: StartupProfile): Promise<string> {
    try {
      const response = await apiClient.post<{ success: boolean; answer: string }>('/ai/chat', {
        question,
        startupContext,
      });

      if (response && response.success && response.answer) {
        return response.answer.trim();
      }
      throw new Error('AI engine returned an empty response.');
    } catch (err: unknown) {
      console.warn('[liveAiService] Backend /ai/chat request failed:', err);
      throw new Error(formatUserFacingError(err));
    }
  },

  /**
   * Real AI Field Generator (Sparkle Assist)
   * Generates crisp pitches, TAM/SAM/SOM, and distribution moats
   * Handled by backend route POST /api/ai/generate-field
   * Throws a sanitized user-facing Error if the service is unavailable.
   */
  async generateField(fieldLabel: string, context: any, instruction?: string): Promise<string> {
    try {
      const response = await apiClient.post<{ success: boolean; result: string }>('/ai/generate-field', {
        fieldLabel,
        context,
        instruction,
      });

      if (response && response.success && response.result) {
        return response.result.trim().replace(/^"|"$/g, '');
      }
      throw new Error('AI engine did not return a value for this field.');
    } catch (err: unknown) {
      console.warn('[liveAiService] Backend /ai/generate-field request failed:', err);
      throw new Error(formatUserFacingError(err));
    }
  },

  /**
   * Real AI Document & Data Room Intelligence
   * Extracts parameters from uploaded pitch decks and financial spreadsheets
   * Handled by backend route POST /api/ai/extract-documents
   * Throws a sanitized user-facing Error if the extraction service fails.
   */
  async extractDocumentsIntelligence(files: UploadedFile[]): Promise<ExtractedStartupData> {
    try {
      const filePayload = files.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type || 'application/pdf',
      }));

      const response = await apiClient.post<{ success: boolean; data: ExtractedStartupData }>('/ai/extract-documents', {
        files: filePayload,
      });

      if (response && response.success && response.data?.companyName) {
        return response.data;
      }
      throw new Error('Document extraction pipeline could not parse document structure.');
    } catch (err: unknown) {
      console.warn('[liveAiService] Backend /ai/extract-documents request failed:', err);
      throw new Error(formatUserFacingError(err));
    }
  },

  /**
   * Real AI Investor Grill Interrogation
   * Analyzes founder answers in real time and provides genuine VC critique
   * Handled by backend route POST /api/ai/evaluate-grill
   * Throws a sanitized user-facing Error if the evaluation service fails.
   */
  async evaluateInvestorAnswer(
    qaPairs: { question: string; answer: string }[],
    startupContext?: StartupProfile
  ): Promise<ClarityVerdict> {
    try {
      const response = await apiClient.post<{ success: boolean; verdict: ClarityVerdict }>('/ai/evaluate-grill', {
        qaPairs,
        startupContext,
      });

      if (response && response.success && response.verdict?.clarity_score) {
        return response.verdict;
      }
      throw new Error('Investor interrogation evaluator did not return a valid verdict score.');
    } catch (err: unknown) {
      console.warn('[liveAiService] Backend /ai/evaluate-grill request failed:', err);
      throw new Error(formatUserFacingError(err));
    }
  },
};
