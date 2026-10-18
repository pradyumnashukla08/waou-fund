// Cloud Configuration for WaouFund Full-Stack Venture Infrastructure
// Sourced from pitchy backend & Google Cloud / Render deployment

export const CLOUD_CONFIG = {
  // Live Cloud API endpoints (Google Cloud / Firebase Functions)
  PRIMARY_API_URL: 'https://api-45dvc4s67a-uc.a.run.app/api',
  FALLBACK_API_URL: 'https://api-45dvc4s67a-uc.a.run.app',
  
  // Health endpoints
  HEALTH_URL: 'https://api-45dvc4s67a-uc.a.run.app/health',
  ROOT_URL: 'https://api-45dvc4s67a-uc.a.run.app',

  // Firebase Cloud Project
  FIREBASE: {
    PROJECT_ID: 'project-f62f4191-7560-45ab-8f3',
    STORAGE_BUCKET: 'project-f62f4191-7560-45ab-8f3.firebasestorage.app',
    AUTH_DOMAIN: 'project-f62f4191-7560-45ab-8f3.firebaseapp.com',
    API_KEY: 'AIzaSyDDTRLxCkDEY9VD9_Cqwosk03uKt-e1G-E',
    APP_ID: '1:204151638622:android:34f80b97e8f78b52da02cf',
  },

  // Supabase Infrastructure
  SUPABASE: {
    URL: 'https://mhctayqmowvmxteskftp.supabase.co',
    ANON_KEY: 'sb_publishable_I1fQVw-CKjF6pE-4j95ILQ_0_kog93n',
  },

  // AI Pipeline
  AI_ENGINES: [
    { name: 'Gemini 3.5 Flash / Pro', role: 'Institutional Deck & Diligence Analysis' },
    { name: 'Gemini 3.8 Flash', role: 'Real-time AI Investor Grill & Advisory' },
    { name: 'Venture Deterministic Engine', role: 'Financial Command & Unit Economics Audit' },
  ],
};
