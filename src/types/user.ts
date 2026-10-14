// User & Auth types for WaouFund real user flow

export type UserRole = 'founder' | 'angel' | 'vc';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  // Onboarding progress
  onboardingStep: 'role' | 'documents' | 'profile' | 'analysis' | 'complete';
}

export interface DocumentAnalysis {
  documentName: string;
  documentType: 'pitch_deck' | 'financial_model' | 'business_plan' | 'other';
  extractedData: ExtractedStartupData;
  confidence: number; // 0-100
  analysisStatus: 'pending' | 'analyzing' | 'complete' | 'error';
}

export interface ExtractedStartupData {
  companyName?: string;
  tagline?: string;
  stage?: string;
  sector?: string;
  askAmount?: string;
  mrr?: string;
  arr?: string;
  teamSize?: number;
  foundedYear?: string;
  location?: string;
  businessModel?: string;
  revenueModel?: string;
  targetMarket?: string;
  tam?: string;
  sam?: string;
  som?: string;
  keyMetrics?: string[];
  redFlags?: string[];
  strengths?: string[];
  fundingReadiness?: number; // 0-100
  fundingReadinessBreakdown?: {
    teamScore: number;
    marketScore: number;
    tractionScore: number;
    financialScore: number;
    productScore: number;
  };
  summary?: string;
  investorRecommendation?: string;
}

export interface OnboardingState {
  user: UserProfile | null;
  documents: UploadedFile[];
  analysis: DocumentAnalysis | null;
  profileData: ExtractedStartupData;
  isAnalyzing: boolean;
  analysisComplete: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  status: 'uploading' | 'uploaded' | 'analyzing' | 'analyzed' | 'error';
  preview?: string;
}
