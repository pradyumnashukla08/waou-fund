export type FundingStage = 'Pre-Seed' | 'Seed' | 'Series-A' | 'Series-B';

export interface FinancialMetrics {
  cash_balance: number;
  monthly_burn: number;
  default_runway: number;
  arr: number;
  mrr: number;
  headcount_cost: number;
}

export interface GTMChannel {
  name: string;
  status: 'Scaling' | 'Testing' | 'Saturated';
  cac: number;
}

export interface GTMExperiment {
  title: string;
  description: string;
  status: 'Active' | 'Upcoming' | 'Completed';
}

export interface GTMStrategy {
  blended_cac: number;
  ltv: number;
  payback_period: number;
  ltv_cac_ratio: number;
  ltv_cac_growth?: number;
  channels: GTMChannel[];
  experiments: GTMExperiment[];
}

export interface ForecastYears {
  year1: number;
  year2: number;
  year3: number;
  year4: number;
  year5: number;
}

export interface FinancialForecast {
  revenue: Record<string, ForecastYears>;
  cogs: Record<string, ForecastYears>;
  opex: Record<string, ForecastYears>;
}

export interface Competitor {
  name: string;
  weakness: string;
}

export interface MarketLandscape {
  tam: string;
  sam: string;
  som: string;
  competitors: Competitor[];
}

export interface TractionMetrics {
  waitlist_count: number;
  waitlist_growth?: number;
  beta_users: number;
  beta_conversion_growth?: number;
  arr?: number;
  arr_mom_growth?: number;
  nrr: number;
  nrr_growth?: number;
  burn_multiple: number;
  burn_growth?: number;
  historical_revenue_6m: number[];
}

export interface InterviewQuestion {
  question: string;
  reason: string;
}

export interface EvaluationResult {
  overall_score: number;
  team_score: number;
  market_score: number;
  execution_score: number;
  product_score: number;
  traction_score: number;
  red_flags: string[];
  daily_tasks: string[];
  stage_advice: string;
  questions: InterviewQuestion[];
  financial_metrics: FinancialMetrics;
  gtm_strategy: GTMStrategy;
  financial_forecast: FinancialForecast;
  traction_metrics: TractionMetrics;
  market_landscape: MarketLandscape;
  id?: string;
  startup_id?: string;
  created_at?: string;
}

export interface ActionStep {
  id: string;
  title: string;
  task: string;
  type: 'financial' | 'product' | 'team' | 'market';
  isComplete: boolean;
  fix: string;
}

export interface UploadedDoc {
  id: string;
  name: string;
  size: string;
  date: string;
  format: string;
  status: 'verified' | 'analyzing' | 'needs_update';
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  sessions: number;
  tags: string[];
  bio: string;
  rate: string;
}

export interface AIInvestorQuestion {
  id: string;
  question: string;
  reason: string;
}

export interface AIInvestorRound {
  round_number: number;
  round_title: string;
  description: string;
  questions: AIInvestorQuestion[];
}

export interface QAPair {
  round_title: string;
  question: string;
  answer?: string;
}

export interface ClarityVerdict {
  clarity_score: number;
  vector_scores: {
    pitch_clarity: number;
    financial_defense: number;
    stage_readiness: number;
    market_mastery: number;
  };
  fundability_verdict: string;
  devang_reality_check: string;
  actionable_improvements: string[];
}
