export interface ActionStep {
  id: string;
  title: string;
  task: string;
  type: 'financial' | 'product' | 'team' | 'market';
  isComplete: boolean;
  fix: string;
}

export const generateActionSteps = (redFlags: string[]): ActionStep[] => {
  if (!redFlags || redFlags.length === 0) return [];

  return redFlags.map((flag, index) => {
    const lowerFlag = flag.toLowerCase();
    const id = `task_${index}_${Date.now()}`;

    // Financial heuristics
    if (lowerFlag.includes('cac') || lowerFlag.includes('ltv') || lowerFlag.includes('acquisition') || lowerFlag.includes('margin')) {
      return {
        id,
        title: 'Optimize Unit Economics',
        task: flag,
        type: 'financial',
        isComplete: false,
        fix: 'Review your marketing spend efficiency. Shift budget to high-converting organic channels or refine ICP targeting to lower CAC and elevate LTV:CAC above 3:1.',
      };
    }

    if (lowerFlag.includes('burn') || lowerFlag.includes('runway') || lowerFlag.includes('spend')) {
      return {
        id,
        title: 'Extend Capital Runway',
        task: flag,
        type: 'financial',
        isComplete: false,
        fix: 'Audit fixed operational overhead and non-essential SaaS tools. Extend runway past 18 months by pacing non-critical hires until hitting the next milestone.',
      };
    }

    // Team heuristics
    if (lowerFlag.includes('technical') || lowerFlag.includes('cto') || lowerFlag.includes('team') || lowerFlag.includes('founder')) {
      return {
        id,
        title: 'Strengthen Founding Team',
        task: flag,
        type: 'team',
        isComplete: false,
        fix: 'A strong technical/domain core is critical. If full-time hiring is constrained, bring on a fractional CTO or advisory partner with equity alignment.',
      };
    }

    // Market heuristics
    if (lowerFlag.includes('market') || lowerFlag.includes('tam') || lowerFlag.includes('competition') || lowerFlag.includes('competitors')) {
      return {
        id,
        title: 'Defend Market Positioning',
        task: flag,
        type: 'market',
        isComplete: false,
        fix: 'Focus on a concentrated beachhead segment where your value proposition is 10x faster or cheaper before expanding into the wider TAM.',
      };
    }

    // Product heuristics
    if (lowerFlag.includes('product') || lowerFlag.includes('pmf') || lowerFlag.includes('retention') || lowerFlag.includes('churn')) {
      return {
        id,
        title: 'Accelerate Product-Market Fit',
        task: flag,
        type: 'product',
        isComplete: false,
        fix: 'Conduct 15 deep user discovery interviews with churned or inactive users to remove onboarding friction and reinforce the primary activation loop.',
      };
    }

    // Discrepancy heuristics
    if (lowerFlag.includes('mismatch') || lowerFlag.includes('discrepancy') || lowerFlag.includes('inconsistent')) {
      return {
        id,
        title: 'Resolve Data Inconsistencies',
        task: flag,
        type: 'market',
        isComplete: false,
        fix: 'Audit your pitch deck, cap table, and financial model to ensure all historical figures, shares, and forward projections align 100% across materials.',
      };
    }

    // Generic fallback
    return {
      id,
      title: 'Address Critical Risk Factor',
      task: flag,
      type: 'market',
      isComplete: false,
      fix: 'Review this risk area with your advisory board and outline a concrete 30-day de-risking sprint before investor diligence begins.',
    };
  });
};
