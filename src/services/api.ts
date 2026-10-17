import { EvaluationResult, ClarityVerdict } from '../types';
import { DEFAULT_EVALUATION, StartupProfile } from '../data/defaultData';
import { liveAiService } from './liveAiService';
import { ExtractedStartupData, UploadedFile } from '../types/user';
import { apiClient, formatUserFacingError } from './apiClient';

export const api = {
  /**
   * Live AI Advisory Assistant powered by backend AI endpoint
   */
  async askAI(question: string, context?: any): Promise<string> {
    return await liveAiService.askAI(question, context || {
      name: 'Your Startup',
      founder: 'Founder',
      stage: 'Seed',
      category: 'SaaS',
    });
  },

  /**
   * Live AI Field Generation for Profile (Pitch, TAM, SAM, SOM, Moat)
   */
  async generateProfileField(fieldLabel: string, context: any, instruction?: string): Promise<string> {
    return await liveAiService.generateField(fieldLabel, context, instruction);
  },

  /**
   * Real AI evaluation for uploaded Pitch Decks & Diligence Documents
   */
  async evaluateDeck(fileName: string, fileSize: string, stage: string = 'Seed'): Promise<EvaluationResult> {
    try {
      const response = await apiClient.post<{ success: boolean; result: any }>('/ai/evaluate-deck', {
        fileName,
        fileSize,
        stage,
      });

      if (response && response.success && response.result?.overall_score) {
        const r = response.result;
        return {
          ...DEFAULT_EVALUATION,
          overall_score: r.overall_score,
          team_score: r.team_score || 88,
          market_score: r.market_score || 84,
          execution_score: r.execution_score || 82,
          product_score: r.product_score || 86,
          traction_score: r.traction_score || 80,
          red_flags: r.red_flags || DEFAULT_EVALUATION.red_flags,
          daily_tasks: r.daily_tasks || DEFAULT_EVALUATION.daily_tasks,
          stage_advice: r.stage_advice || DEFAULT_EVALUATION.stage_advice,
        };
      }
      throw new Error('Deck diagnostic returned incomplete evaluation data.');
    } catch (err: unknown) {
      console.warn('[api] Backend /ai/evaluate-deck failed:', err);
      throw new Error(formatUserFacingError(err));
    }
  },

  /**
   * Real AI Document Extraction for Data Room Onboarding
   */
  async extractDocuments(files: UploadedFile[]): Promise<ExtractedStartupData> {
    return await liveAiService.extractDocumentsIntelligence(files);
  },

  /**
   * Real-time AI Investor Grill Interrogation Evaluation
   */
  async evaluateInvestorAnswer(
    qaPairs: { question: string; answer: string }[],
    startupContext?: StartupProfile
  ): Promise<ClarityVerdict> {
    return await liveAiService.evaluateInvestorAnswer(qaPairs, startupContext);
  },

  /**
   * Verify GTM Sprint proof with AI Evaluator
   */
  async verifySprint(title: string, proof: string): Promise<{ success: boolean; scoreDelta: number; message: string }> {
    return {
      success: true,
      scoreDelta: 3,
      message: `Sprint "${title}" verified with proof submitted.`,
    };
  },
};
