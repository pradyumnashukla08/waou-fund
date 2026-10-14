import { EvaluationResult, Mentor, FundingStage, AIInvestorRound } from '../types';

export interface TeamMember {
  name: string;
  role: string;
  linkedin: string;
}

export interface StartupProfile {
  id: string;
  name: string;
  tagline: string;
  category: string;
  stage: FundingStage;
  founder: string;
  location: string;
  website: string;
  targetAsk: string;
  valuation: string;
  equityOffered: string;
  mrr: string;
  burn: string;
  growth: string;
  fundabilityScore: number;

  // 1. Founder Identity
  fullName?: string;
  role?: string;
  profileImage?: string;
  linkedinUrl?: string;
  email?: string;
  pedigree?: string;
  team?: TeamMember[];

  // 2. Startup Core & Compliance
  companyName?: string;
  websiteUrl?: string;
  pitchDeckUrl?: string;
  companyType?: string;
  isRegistered?: boolean;
  registrationNo?: string;
  sector?: string;
  pitch?: string;
  currency?: string;

  // 3. Market & Competitors
  tam?: string;
  sam?: string;
  som?: string;
  competitor1?: string;
  competitor2?: string;
  competitor3?: string;
  distributionMoat?: string;

  // 4. The Fundraising Ask
  targetRaise?: string;
  valuationCap?: string;
  capitalCommitted?: string;

  // 5. Dynamic Traction Metrics
  // Pre-Seed
  waitlistCount?: string;
  betaConversion?: string;
  productStatus?: string;
  problemValidation?: string;
  teamCapability?: string;
  runway?: string;

  // Seed
  currentMrr?: string;
  userTraction?: string;
  momGrowth?: string;
  grossMargin?: string;
  cac?: string;

  // Series-A
  verifiedArr?: string;
  churnRate?: string;
  nrr?: string;
  ltvcacRatio?: string;
  cacPayback?: string;
  burnRate?: string;
  execSales?: boolean;
  execEng?: boolean;
  execMarketing?: boolean;

  // Series-B
  annualRevenue?: string;
  expansionVectors?: string[];
  cSuiteComplete?: boolean;
  marketShare?: string;
}

export const MOCK_STARTUPS: StartupProfile[] = [
  {
    id: 'avasplot',
    name: 'AvasPlot',
    tagline: 'AI-Powered Spatial Intelligence & Commercial Asset Valuation Platform',
    category: 'B2B SaaS / PropTech',
    stage: 'Seed',
    founder: 'Rahul Sharma',
    location: 'Bengaluru, India',
    website: 'https://avasplot.ai',
    targetAsk: '₹4.0 Cr ($500K)',
    valuation: '₹28.0 Cr ($3.5M)',
    equityOffered: '14.2%',
    mrr: '₹50,00,000',
    burn: '₹12,00,000',
    growth: '+18% MoM',
    fundabilityScore: 88,
    fullName: 'Rahul Sharma',
    role: 'CEO & Co-Founder',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com/in/rahulsharma-avasplot',
    email: 'rahul@avasplot.ai',
    pedigree: 'Second-Time Founder (Ex-Flipkart Data Science)',
    team: [
      { name: 'Kavita Sundaram', role: 'CTO (Ex-Google Brain, IIT Madras)', linkedin: 'https://linkedin.com/in/kavita-sundaram' },
      { name: 'Aditya Sen', role: 'Head of Growth (Ex-Razorpay)', linkedin: 'https://linkedin.com/in/aditya-sen' }
    ],
    companyName: 'AvasPlot Technologies Inc.',
    websiteUrl: 'https://avasplot.ai',
    companyType: 'Private Limited',
    isRegistered: true,
    registrationNo: '29ABCDE1234F1Z5',
    sector: 'SaaS',
    pitch: 'AI spatial intelligence platform enabling institutional REITs to evaluate commercial asset yields with 98% accuracy in 12 minutes.',
    currency: '₹ (INR)',
    tam: '42000000000',
    sam: '8500000000',
    som: '1200000000',
    competitor1: 'https://costar.com',
    competitor2: 'https://cherre.com',
    competitor3: 'https://reonomy.com',
    distributionMoat: 'Proprietary spatial graph of 1.4M commercial parcels and direct API integration with Indian municipal land registries.',
    targetRaise: '40000000',
    valuationCap: '280000000',
    capitalCommitted: '18000000',
    currentMrr: '5000000',
    userTraction: '18 Enterprise Clients',
    momGrowth: '18',
    grossMargin: '82',
    cac: '85000',
    waitlistCount: '450',
    betaConversion: '28',
    productStatus: 'Functional MVP',
    problemValidation: 'Commercial real estate underwriting takes 6 weeks of manual surveyor appraisals resulting in 18% pricing variance.',
    teamCapability: 'Founders have 14+ years combined in enterprise GIS, spatial computer vision, and institutional REIT debt underwriting.',
    runway: '14',
    verifiedArr: '60000000',
    churnRate: '1.2',
    nrr: '124',
    ltvcacRatio: '>4:1',
    cacPayback: '5',
    burnRate: '1200000',
    execSales: true,
    execEng: true,
    execMarketing: false,
    annualRevenue: '60000000',
    expansionVectors: ['International Expansion', 'New Product Lines'],
    cSuiteComplete: true,
    marketShare: '12',
  },
  {
    id: 'finflow',
    name: 'FinFlow',
    tagline: 'Automated Treasury & Cross-Border Liquidity Engine for Emerging Exporters',
    category: 'Fintech / B2B Payments',
    stage: 'Series-A',
    founder: 'Priya Iyer',
    location: 'Mumbai, India',
    website: 'https://finflow.finance',
    targetAsk: '₹18.0 Cr ($2.2M)',
    valuation: '₹95.0 Cr ($11.5M)',
    equityOffered: '18.9%',
    mrr: '₹2,50,00,000',
    burn: '₹65,00,000',
    growth: '+24% MoM',
    fundabilityScore: 94,
  },
  {
    id: 'healthsync',
    name: 'HealthSync',
    tagline: 'Point-of-Care Predictive Oncology Biomarkers using Smartphone Spectroscopy',
    category: 'Healthtech / DeepTech',
    stage: 'Pre-Seed',
    founder: 'Dr. Amit Patel',
    location: 'New Delhi, India',
    website: 'https://healthsync.bio',
    targetAsk: '₹1.5 Cr ($180K)',
    valuation: '₹12.0 Cr ($1.4M)',
    equityOffered: '12.5%',
    mrr: '₹8,50,000',
    burn: '₹4,20,000',
    growth: '+12% MoM',
    fundabilityScore: 74,
  },
];

export const DEFAULT_EVALUATION: EvaluationResult = {
  overall_score: 88,
  team_score: 92,
  market_score: 86,
  execution_score: 84,
  product_score: 90,
  traction_score: 85,
  red_flags: [
    'Unit Economic Gap: CAC payback period is currently 13.8 months across paid acquisition channels (benchmark is < 9 months).',
    'Customer Concentration: Top 3 enterprise commercial real estate clients account for 61% of recurring ARR.',
    'Conversion Funnel Drag: Onboarding trial-to-paid conversion plateaued at 4.2% due to complex GIS data upload steps.',
    'Runway Sensitivity: Current net burn allows 11.6 months of operations without the proposed ₹4 Cr Seed extension.',
  ],
  daily_tasks: [
    'Run scenario analysis reducing paid channel spend by 20% in favor of outbound SDR loops.',
    'Embed automated spatial sample demo on landing page to cut trial onboarding friction by 40%.',
    'Structure clean 15% ESOP pool addendum to present to lead seed term-sheet partners.',
  ],
  stage_advice:
    'For Seed stage institutional fundraising, Tier-1 funds expect demonstrable repeatability in client acquisition. Your high Net Revenue Retention (118%) is your strongest moat; showcase that enterprise expansion mitigates initial sales cycle length.',
  questions: [
    {
      question: 'How will you reduce enterprise sales cycle from 90 days to under 45 days as you scale from 3 to 15 cities?',
      reason: 'Validates scalability of sales motion beyond founder-led networks.',
    },
    {
      question: 'What happens to gross margins if Google Maps & satellite API provider hikes geospatial API costs by 30%?',
      reason: 'Tests infrastructure resilience and proprietary spatial processing advantage.',
    },
    {
      question: 'Why did you cap this seed round at ₹4 Cr instead of ₹8 Cr given aggressive expansion plans?',
      reason: 'Evaluates capital efficiency and founder valuation discipline.',
    },
  ],
  financial_metrics: {
    cash_balance: 14000000, // ₹1.4 Cr
    monthly_burn: 1200000,  // ₹12 Lakhs
    default_runway: 12,     // 11.6 -> ~12 mos
    arr: 60000000,          // ₹6.0 Cr
    mrr: 5000000,           // ₹50 Lakhs
    headcount_cost: 180000, // ₹1.8 Lakhs / hire
  },
  gtm_strategy: {
    blended_cac: 84000,
    ltv: 420000,
    payback_period: 13.8,
    ltv_cac_ratio: 5.0,
    ltv_cac_growth: 18,
    channels: [
      { name: 'Direct Enterprise Outbound (SDRs)', status: 'Scaling', cac: 92000 },
      { name: 'Industry Broker Partnerships & APIs', status: 'Scaling', cac: 48000 },
      { name: 'LinkedIn Thought Leadership & Whitepapers', status: 'Testing', cac: 68000 },
      { name: 'Google Search Ads & Retargeting', status: 'Saturated', cac: 145000 },
    ],
    experiments: [
      {
        title: 'Tier-1 CRE Brokerage Co-Marketing',
        description: 'Publish quarterly City Yield Index co-branded with JLL/CBRE to capture organic inbound leads.',
        status: 'Active',
      },
      {
        title: 'Interactive 3D Valuation Widget',
        description: 'Embed free 3-property evaluation tool on landing page to capture high-intent developer emails.',
        status: 'Active',
      },
      {
        title: 'Reverse Outbound Targeting PE Funds',
        description: 'Direct pitch to acquisition heads at private equity real estate funds managing >₹500Cr AUM.',
        status: 'Upcoming',
      },
    ],
  },
  financial_forecast: {
    revenue: {
      'SaaS Subscriptions': { year1: 600, year2: 1450, year3: 3200, year4: 6800, year5: 12500 },
      'Enterprise API Integration': { year1: 150, year2: 420, year3: 980, year4: 2100, year5: 4200 },
    },
    cogs: {
      'Cloud & Geospatial Infrastructure': { year1: 110, year2: 240, year3: 480, year4: 950, year5: 1650 },
      'Third-party Data Providers': { year1: 45, year2: 95, year3: 190, year4: 380, year5: 680 },
    },
    opex: {
      'R&D / Engineering Salaries': { year1: 280, year2: 580, year3: 1100, year4: 2100, year5: 3600 },
      'Sales & Marketing Outbound': { year1: 190, year2: 440, year3: 950, year4: 1900, year5: 3200 },
      'G&A, Legal & Cloud Tools': { year1: 65, year2: 120, year3: 210, year4: 380, year5: 620 },
    },
  },
  traction_metrics: {
    waitlist_count: 3420,
    waitlist_growth: 32,
    beta_users: 184,
    beta_conversion_growth: 14,
    arr: 60000000,
    arr_mom_growth: 18,
    nrr: 118,
    nrr_growth: 6,
    burn_multiple: 1.35,
    burn_growth: -12,
    historical_revenue_6m: [28, 33, 37, 42, 46, 50],
  },
  market_landscape: {
    tam: '₹48,000 Cr ($6.0B)',
    sam: '₹8,500 Cr ($1.1B)',
    som: '₹1,200 Cr ($150M)',
    competitors: [
      {
        name: 'Legacy Manual Appraisers',
        weakness: 'Slow turnaround (14-21 days per asset) and subjective estimates lacking algorithmic validation.',
      },
      {
        name: 'US Spatial Giants (Costar / Altus)',
        weakness: 'Zero localized regulatory compliance or municipal land record OCR integration for India & APAC.',
      },
      {
        name: 'Generic Real Estate Portals (99acres / Magicbricks)',
        weakness: 'Built for B2C classified rentals, not institutional underwriting, DCF models, or yield analysis.',
      },
    ],
  },
};

export const MOCK_MENTORS: Mentor[] = [
  {
    id: '1',
    name: 'Ankit Sharma',
    role: 'Ex-VP Growth, Flipkart',
    company: 'Venture Partner @ Stellaris',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    sessions: 142,
    tags: ['GTM Strategy', 'B2B Scaling', 'Enterprise Funnels'],
    bio: 'Built Flipkart enterprise supply chain systems from 0 to $2B GMV. Mentored 35+ funded Indian founders.',
    rate: 'Free for Platform Founders',
  },
  {
    id: '2',
    name: 'Neha Singh',
    role: 'Ex-Director of Product, Zomato',
    company: 'Angel Investor & Advisor',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    rating: 5.0,
    sessions: 98,
    tags: ['Product-Market Fit', 'Retention Loops', 'UI/UX Design'],
    bio: 'Product veteran specializing in turning complex multi-stakeholder workflows into intuitive consumer-grade products.',
    rate: 'Free for Platform Founders',
  },
  {
    id: '3',
    name: 'Varun Mayya',
    role: 'Serial Founder & AI Researcher',
    company: 'Founder, Avalon Labs',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    sessions: 210,
    tags: ['Fundraising Narrative', 'AI Architecture', 'Viral Distribution'],
    bio: 'Raised institutional capital from Sequoia & Bessemer. Passionate about helping deeptech founders articulate unfair moats.',
    rate: 'Free for Platform Founders',
  },
  {
    id: '4',
    name: 'Shruti Patel',
    role: 'Ex-Fintech Lead, Razorpay',
    company: 'Partner, Blume Ventures',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    sessions: 76,
    tags: ['Unit Economics', 'Cap Table Architecture', 'Fintech Compliance'],
    bio: 'Audited over 400 financial models. Knows exactly what investment committees red-flag during financial due diligence.',
    rate: 'Free for Platform Founders',
  },
  {
    id: '5',
    name: 'Kunal Bahl',
    role: 'Serial Entrepreneur & LP',
    company: 'Titan Capital',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    rating: 5.0,
    sessions: 185,
    tags: ['Seed to Series A', 'Board Management', 'Founder Resilience'],
    bio: 'Backed 250+ startups across consumer tech, SaaS, and infrastructure. Direct, no-fluff strategic advice.',
    rate: 'Free for Platform Founders',
  },
  {
    id: '6',
    name: 'Rohan Desai',
    role: 'Founding CTO, Postman Alum',
    company: 'Tech Fellow',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    sessions: 64,
    tags: ['Tech Stack', 'SOC2 / ISO Security', 'Engineering Hiring'],
    bio: 'Helps early-stage technical founders pass rigorous enterprise vendor security diligence without hiring expensive consultants.',
    rate: 'Free for Platform Founders',
  },
];

export const DOC_CHECKLIST_CONFIG: Record<
  FundingStage,
  { id: string; label: string; format: string; subLabel: string; icon: string; description: string; isOptional?: boolean }[]
> = {
  'Pre-Seed': [
    {
      id: 'pitch_deck',
      label: 'Pitch Deck',
      format: 'PDF',
      subLabel: 'PDF • Max 25MB • 10-15 slides',
      icon: 'FileText',
      description: 'Slide deck highlighting Problem, Solution, Team pedigree, initial traction/waitlist, and The Ask.',
    },
    {
      id: 'inc_docs',
      label: 'Incorporation Documents',
      format: 'PDF / Image',
      subLabel: 'COI / GSTIN / CIN (Optional)',
      icon: 'ShieldCheck',
      description: 'Official corporate registration proof showing registered entity name and jurisdiction.',
      isOptional: true,
    },
    {
      id: 'basic_cap',
      label: 'Founders Cap Table',
      format: 'Excel / CSV',
      subLabel: 'Equity ownership breakdown',
      icon: 'PieChart',
      description: 'Clear list of co-founder shares, unallocated ESOP pool, and any initial angel SAFE notes.',
      isOptional: true,
    },
    {
      id: 'spend_plan',
      label: '12-Month Spend Plan',
      format: 'Excel / CSV',
      subLabel: 'Use of funds allocation',
      icon: 'DollarSign',
      description: 'Itemized forecast showing how the pre-seed round will carry the team to initial PMF.',
      isOptional: true,
    },
  ],
  'Seed': [
    {
      id: 'pitch_deck',
      label: 'Seed Pitch Deck',
      format: 'PDF',
      subLabel: 'PDF • 15-18 slides',
      icon: 'FileText',
      description: 'Full pitch narrative emphasizing PMF indicators, unit economics, MoM MRR growth, and competitive moat.',
    },
    {
      id: 'fin_model',
      label: 'Dynamic Financial Model',
      format: 'Excel / CSV',
      subLabel: '3-Year P&L & Cash Burn',
      icon: 'Calculator',
      description: 'Full revenue build, hiring forecast, headcount economics, and default runway sensitivity calculations.',
    },
    {
      id: 'bank_stmts',
      label: 'Bank Statements (Past 3 Mos)',
      format: 'PDF',
      subLabel: 'Cash burn verification',
      icon: 'CreditCard',
      description: 'Official bank statements substantiating claimed monthly burn rate and runway reserves.',
      isOptional: true,
    },
    {
      id: 'std_cap',
      label: 'Standard Cap Table (Fully Diluted)',
      format: 'Excel',
      subLabel: 'ESOP, SAFEs, Notes',
      icon: 'PieChart',
      description: 'Formal cap table including SAFE note valuation caps, discounts, and options pool.',
    },
    {
      id: 'cust_cohort',
      label: 'Customer Retention Cohorts',
      format: 'Excel / CSV',
      subLabel: 'MoM retention by cohort',
      icon: 'Users',
      description: 'Cohort analysis demonstrating negative churn or stabilized logo retention curves.',
      isOptional: true,
    },
  ],
  'Series-A': [
    {
      id: 'pitch_deck',
      label: 'Series-A Growth Deck',
      format: 'PDF',
      subLabel: 'Metrics & GTM expansion',
      icon: 'FileText',
      description: 'Data-rich narrative illustrating scalable GTM engine, market domination, and unit economics efficiency.',
    },
    {
      id: 'three_stmt',
      label: '3-Statement Financial Model',
      format: 'Excel',
      subLabel: 'Integrated P&L, Balance Sheet, Cash Flow',
      icon: 'BarChart3',
      description: 'Institutional-grade forecast with historic actuals vs dynamic projected years.',
    },
    {
      id: 'audited_fin',
      label: 'Historical Audited Financials',
      format: 'PDF',
      subLabel: 'Past 1-2 fiscal years',
      icon: 'Award',
      description: 'Statutory audited accounts certified by a registered chartered accountant or CPA.',
    },
    {
      id: 'cac_ltv',
      label: 'Channel-Level CAC & LTV Audit',
      format: 'Excel',
      subLabel: 'Blended vs Paid payback curves',
      icon: 'TrendingUp',
      description: 'Granular acquisition breakdown proving marketing scalability without diminishing returns.',
    },
  ],
  'Series-B': [
    {
      id: 'pitch_deck',
      label: 'Market Dominance Deck',
      format: 'PDF',
      subLabel: 'Category leadership thesis',
      icon: 'FileText',
      description: 'Strategic roadmap for geographic expansion, M&A strategy, and international distribution.',
    },
    {
      id: 'bva_sheet',
      label: 'Budget vs. Actuals (BvA) 24M',
      format: 'Excel',
      subLabel: 'Historical predictability audit',
      icon: 'CheckSquare',
      description: 'Detailed analysis proving management forecast accuracy over the preceding 8 quarters.',
    },
    {
      id: 'mat_contracts',
      label: 'Material Client Contracts',
      format: 'PDF Bundle',
      subLabel: 'Top 10 enterprise agreements',
      icon: 'FileCheck',
      description: 'Redacted MSAs, SLA terms, and multi-year contract renewals for core enterprise accounts.',
    },
  ],
};

export const LEGAL_STANDARDS = [
  {
    title: 'SAFE vs Convertible Note Standard',
    standard: 'Y Combinator Post-Money SAFE is universally preferred in Tier-1 seed rounds. Sets clean valuation cap without early debt covenants or maturity dates that threaten founder solvency.',
    flags: 'Avoid convertible notes carrying >8% compounding interest, onerous liquidation preferences (>1x), or board observer mandates attached to small checks (<₹25L).',
    actionLabel: 'Download Free Post-Money SAFE Template (India / US)',
  },
  {
    title: 'Founder Vesting & Reverse Dilution',
    standard: 'Standard 4-year vesting schedule with a 1-year cliff. Protects remaining founders if one co-founder departs prematurely within the first 12 months.',
    flags: 'Unvested founder equity (100% upfront) is an automatic red-flag for institutional VCs. Any departing founder could leave with 40%+ of the business.',
    actionLabel: 'Inspect Standard Founder Vesting Agreement',
  },
  {
    title: 'ESOP Pool Creation Timing',
    standard: 'Create an unallocated 10%–12% ESOP pool as part of the post-money capitalization. This pool should be dedicated exclusively to future key engineering and sales hires.',
    flags: 'Do not allow investors to force a 20% Pre-Money ESOP pool shuffle, which artificially depresses the true effective valuation by up to 25%.',
    actionLabel: 'Review ESOP Allocation Calculator',
  },
  {
    title: 'Information Rights & Board Seat Protocols',
    standard: 'Lead institutional investor (writing >50% of the round) typically gets 1 Board Seat or Observer Seat. Other angels receive quarterly operational updates.',
    flags: 'Granting board seats or affirmative veto rights to angel syndicates or individual micro-investors writing <₹50L checks will choke corporate agility.',
    actionLabel: 'Download Clean Term Sheet Template',
  },
];

export const AI_INVESTOR_ROUNDS: AIInvestorRound[] = [
  {
    round_number: 1,
    round_title: 'Stage Maturity & Traction Truth',
    description: 'Devang Raja inspects whether your operational claims match verified stage benchmarks.',
    questions: [
      {
        id: 'q1',
        question: 'What is your current verified monthly recurring revenue, and what percentage of that comes from your single largest client?',
        reason: 'Checks for single-point-of-failure risk and revenue concentration.',
      },
      {
        id: 'q2',
        question: 'Walk me through your exact organic versus paid acquisition split over the last 90 days. Where are users actually coming from?',
        reason: 'Verifies whether you have a true distribution moat or are simply buying vanity growth.',
      },
    ],
  },
  {
    round_number: 2,
    round_title: 'Unit Economics & Capital Discipline',
    description: 'Interrogates your burn rate, CAC payback, and runway assumptions.',
    questions: [
      {
        id: 'q3',
        question: 'If this fundraise takes 5 months instead of 2 to close, exactly what operational costs will you cut tomorrow to extend runway to 18 months?',
        reason: 'Evaluates founder operational resilience and emergency capital stewardship.',
      },
      {
        id: 'q4',
        question: 'Your gross margin is reported at 78%. Does that include all customer success, onboarding, and server inference costs, or only raw cloud hosting?',
        reason: 'Catches artificial gross margin inflation common in early AI SaaS decks.',
      },
    ],
  },
  {
    round_number: 3,
    round_title: 'Defensibility & The Unfair Advantage',
    description: 'Drills into competitive response, IP barriers, and why giants cannot clone you in 60 days.',
    questions: [
      {
        id: 'q5',
        question: 'If Microsoft or Google launches this exact feature inside their existing enterprise suite next Tuesday for free, why do your clients keep paying you?',
        reason: 'Tests depth of workflow integration, proprietary data loops, and client switching costs.',
      },
    ],
  },
];
