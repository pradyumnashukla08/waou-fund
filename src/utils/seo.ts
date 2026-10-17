/**
 * WaouFund Dynamic SEO & Metadata Manager
 * Implements Google & Next.js-grade dynamic metadata, canonical URLs,
 * and OpenGraph tag management for single-page and deep-linked views.
 */

export interface SeoMetadata {
  title: string;
  description: string;
  path: string;
  keywords?: string;
}

export const SEO_ROUTES: Record<string, SeoMetadata> = {
  landing: {
    title: 'WaouFund — AI-Powered Fundraising Intelligence for Founders',
    description: 'WaouFund helps startups discover the right investors, diagnose pitch decks, stress-test financials, and navigate due diligence with institutional-grade AI.',
    path: '/',
  },
  auth: {
    title: 'Sign In / Register | WaouFund Secure Founder Portal',
    description: 'Access your secure venture data room and institutional fundraising workspace on WaouFund.',
    path: '/?view=auth',
  },
  dataroom: {
    title: 'Virtual Data Room & Due Diligence Checklist | WaouFund',
    description: 'Stage-aware document checklist customized from Pre-Seed to Series-B with automated AI compliance verification.',
    path: '/?view=dataroom',
  },
  dashboard: {
    title: 'Founder Command Dashboard | WaouFund',
    description: 'Real-time fundability score, investor readiness metrics, and daily actionable venture directives.',
    path: '/?tab=dashboard',
  },
  workspace: {
    title: 'Readiness Hub & Fundability Matrix | WaouFund',
    description: 'Track investor readiness across team pedigree, traction, financial models, and due diligence checklists.',
    path: '/?tab=workspace',
  },
  diagnostic: {
    title: 'Pitch Deck Diagnostic Engine | WaouFund AI',
    description: 'Upload your pitch deck to receive slide-by-slide AI analysis, TAM verification, and venture committee grading.',
    path: '/?tab=diagnostic',
  },
  grill: {
    title: 'AI Investor Grill (Call 1 Interrogation) | WaouFund',
    description: 'Simulate high-stakes VC meetings with Devang Raja avatar. Test your financial defenses and pitch conviction.',
    path: '/?tab=grill',
  },
  finance: {
    title: 'Financial Command & 5-Year AI CFO Forecasting | WaouFund',
    description: 'Deterministic scenario modeling, headcount sensitivity, and instant exportable CSV/Excel P&L models.',
    path: '/?tab=finance',
  },
  market: {
    title: 'Market TAM & Traction Intelligence | WaouFund',
    description: 'Calculate bottom-up TAM/SAM/SOM, defensible market moats, and enterprise traction benchmarks.',
    path: '/?tab=market',
  },
  gtm: {
    title: 'GTM Strategy & Sprint Verification | WaouFund',
    description: 'Track blended CAC, payback periods, and verify execution milestones with automated proof analysis.',
    path: '/?tab=gtm',
  },
  actionplan: {
    title: 'Fundraising Remediation & Action Plan | WaouFund',
    description: 'Systematic action plan resolving investor red flags before partner meetings.',
    path: '/?tab=actionplan',
  },
  legaldocs: {
    title: 'Legal Standards & SAFE Term Sheet Templates | WaouFund',
    description: 'Standard YC post-money SAFE agreements, term sheet templates, and cap table models for founders.',
    path: '/?tab=legaldocs',
  },
  mentors: {
    title: 'Verified Venture Mentor & Operator Directory | WaouFund',
    description: 'Connect 1-on-1 with verified tech operators, angels, and syndicate leads for strategy coaching.',
    path: '/?tab=mentors',
  },
  profile: {
    title: 'Founder Dossier & Investor 1-Pager | WaouFund',
    description: 'Generate institutional 1-page investment teasers and clean founder profiles ready for angels.',
    path: '/?tab=profile',
  },
};

/**
 * Updates document.title, meta tags, and canonical links dynamically based on current navigation state.
 */
export function updatePageSeo(view: string, tab?: string) {
  let config = SEO_ROUTES[view];
  if (view === 'app' && tab && SEO_ROUTES[tab]) {
    config = SEO_ROUTES[tab];
  } else if (!config) {
    config = SEO_ROUTES.landing;
  }

  // 1. Update Document Title
  if (document.title !== config.title) {
    document.title = config.title;
  }

  // 2. Update Meta Description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', config.description);
  }

  // 3. Update OpenGraph Tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', config.title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', config.description);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', `https://waoufund.com${config.path}`);

  // 4. Update Twitter Tags
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', config.title);

  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', config.description);

  // 5. Update Canonical Tag
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute('href', `https://waoufund.com${config.path}`);
  }

  // 6. Seamless browser URL sync for deep-linking
  if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
    const currentQuery = window.location.search;
    const targetQuery = config.path === '/' ? '' : config.path.replace('/', '');
    if (currentQuery !== targetQuery) {
      const targetUrl = targetQuery ? `/${targetQuery}` : '/';
      window.history.replaceState({}, '', targetUrl);
    }
  }
}
