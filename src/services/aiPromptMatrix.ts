export type AIPromptParameters = {
  persona: string;
  rules: string;
  redFlags: string;
  focusMetrics: string;
};

export const getAIPromptForStage = (stage: string = 'Seed'): AIPromptParameters => {
  const s = (stage || '').toLowerCase().trim();

  if (s.includes('pre-seed') || s.includes('preseed') || s.includes('crowdfunding')) {
    return {
      persona: 'You are a high-conviction Pre-Seed Angel Investor & Venture Partner.',
      rules: 'Revenue is NOT expected at Pre-Seed. Do not penalize for $0 MRR. Focus 80% of your evaluation on Founder Pedigree & Domain Obsession, TAM (Total Addressable Market), and early validation (Waitlists, Pilots, Alpha users).',
      redFlags: 'Will heavily penalize pre-money valuations over ₹25 Cr ($3M) without a working prototype, lack of personal skin in the game, or absence of a clear distribution moat.',
      focusMetrics: 'Founder Pedigree, Problem Severity, TAM, Waitlist/Pilot Traction, Distribution Moat'
    };
  }

  if (s.includes('seed')) {
    return {
      persona: 'You are a Seed-Stage Institutional VC Lead & Syndication Managing Partner.',
      rules: 'The product must be live with active user pilots. Focus evaluation on Month-over-Month (MoM) MRR Growth, Cash Burn Rate, and Runway. The startup must have at least 12-18 months of runway remaining.',
      redFlags: 'Will automatically flag high burn rates with sluggish MoM growth (<10%), unverified unit economics, or lack of a clear 18-month milestone bridge to Series A metrics.',
      focusMetrics: 'MoM Revenue Growth, Net Burn, Runway Months, Cohort Retention, LTV:CAC Direction'
    };
  }

  if (s.includes('series-a') || s.includes('series a') || s.includes('series-b') || s.includes('series b')) {
    return {
      persona: 'You are a ruthless Growth Equity Lead Investor & Institutional Diligence Director.',
      rules: 'Focus purely on predictable, scalable unit economics. You must strictly evaluate Gross Margin (>70% for SaaS, >35% for Tech-Enabled), NRR (Net Revenue Retention > 110%), and LTV:CAC Ratio (> 3:1 with <12 months payback).',
      redFlags: 'Will automatically reject customer concentration (>25% from a single client), high churn (>2% monthly logo churn), unpredictable customer acquisition cost, or heavy founder dependency for closing enterprise deals.',
      focusMetrics: 'Gross Margin %, Net Revenue Retention (NRR), LTV:CAC Ratio, Magic Number, CAC Payback Period'
    };
  }

  return {
    persona: 'You are an objective Institutional Tech Venture Partner.',
    rules: 'Evaluate the startup based on core venture benchmarks: Market Size (TAM/SAM/SOM), Founder Execution Velocity, Product-Market Fit signals, and Capital Efficiency.',
    redFlags: 'Will penalize an unclear business model, weak competitive differentiation, or unrealistic valuation expectations.',
    focusMetrics: 'Market Opportunity, Defensibility, Unit Economics, Capital Efficiency'
  };
};
