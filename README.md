# WaouFund — Full-Stack Production Architecture

Self-contained, production-grade repository combining the React 19 frontend and Express 5 AI backend in a single workspace.

---

## 📁 Repository Architecture

```
waou-fund/
├── public/                     # Static assets & favicon
│   └── _headers                # Production security headers (CSP, HSTS, X-Frame)
├── src/                        # Frontend Application (React 19 + TypeScript + Vite)
│   ├── assets/                 # SVGs, icons, illustrations
│   ├── components/             # Reusable UI & Core Screens
│   │   ├── modules/            # Domain Modules (Finance, Grill, Diagnostics, etc.)
│   │   │   ├── ActionPlanModule.tsx
│   │   │   ├── DashboardModule.tsx
│   │   │   ├── DataRoomModule.tsx
│   │   │   ├── DiagnosticModule.tsx
│   │   │   ├── FinanceModule.tsx
│   │   │   ├── GTMModule.tsx
│   │   │   ├── GrillModule.tsx
│   │   │   ├── LegalDocsModule.tsx
│   │   │   ├── MarketTractionModule.tsx
│   │   │   ├── MentorsModule.tsx
│   │   │   ├── ProfileTeaserModule.tsx
│   │   │   ├── WorkspaceModule.tsx
│   │   │   └── index.ts
│   │   ├── AuthScreen.tsx      # Firebase Auth login/signup modal
│   │   ├── DataRoomOnboarding.tsx
│   │   ├── FounderApp.tsx      # Founder dashboard main shell
│   │   ├── LandingPage.tsx     # Public landing page
│   │   ├── Navbar.tsx          # Top navigation bar
│   │   └── index.ts            # Barrel export
│   ├── config/                 # Frontend configs
│   │   ├── cloud.ts            # API base URL & deployment config
│   │   └── firebase.ts         # Firebase Web SDK initialization
│   ├── data/                   # Initial / static state data
│   ├── services/               # API clients & cloud connectors
│   │   ├── api.ts              # High-level API endpoints
│   │   ├── apiClient.ts        # Authenticated fetch wrapper with Bearer token injection
│   │   ├── cloudService.ts     # Cloud data persistence
│   │   ├── liveAiService.ts    # Secure AI gateway connector (no synthetic fallbacks)
│   │   └── index.ts            # Barrel export
│   ├── types/                  # TypeScript interface definitions
│   │   ├── index.ts
│   │   └── user.ts
│   ├── App.css
│   ├── App.tsx                 # Root application component & routing
│   ├── index.css               # Global Tailwind / design tokens
│   └── main.tsx                # Entry point
│
├── backend/                    # Backend API (Express 5 + TypeScript + Firebase Admin)
│   ├── src/
│   │   ├── config/             # Firebase Admin & Gemini AI configuration
│   │   │   ├── ai.ts
│   │   │   └── firebase.ts
│   │   ├── controllers/        # Request handlers
│   │   │   ├── aiController.ts
│   │   │   └── profileController.ts
│   │   ├── domain/             # Business logic & valuation engines
│   │   │   └── valuation/      # DCF, Scorecard, Berkus, Venture Capital engines
│   │   ├── middleware/         # Security middlewares
│   │   │   ├── auth.ts         # Firebase ID token validation & UID binding
│   │   │   ├── errorHandler.ts # Error sanitization (no leaked stack traces)
│   │   │   └── rateLimiter.ts  # Per-UID rate limiting
│   │   ├── modules/            # Enterprise domain micro-modules
│   │   │   ├── ai/             # AI prompting & moderation
│   │   │   ├── document/       # Pitch deck & legal document extraction
│   │   │   ├── founder/        # Founder profile management
│   │   │   ├── funding/        # Deal room & round structuring
│   │   │   └── identity/       # RBAC & authorization
│   │   ├── routes/             # Express routes
│   │   │   ├── ai.ts           # /api/ai endpoints
│   │   │   ├── evaluate.ts     # Valuation & readiness evaluation
│   │   │   ├── generate.ts     # Content generation
│   │   │   └── profile.ts      # Founder profile CRUD
│   │   ├── services/           # External service wrappers
│   │   │   ├── documentParser.ts
│   │   │   ├── geminiService.ts
│   │   │   └── provenance/     # Provenance verification & anti-hallucination tests
│   │   ├── validators/         # Zod request payload schemas
│   │   │   └── schemas.ts
│   │   └── index.ts            # Server entry point
│   ├── Dockerfile              # Container deployment
│   ├── package.json            # Backend dependencies
│   ├── test-all.mjs            # Automated test runner (169 passing unit/integration tests)
│   └── tsconfig.json           # Backend TypeScript config
│
├── package.json                # Root package with unified scripts
├── tsconfig.json               # Root TypeScript project references
└── vite.config.ts              # Vite bundling config
```

---

## 🚀 Quick Start Commands

Run all commands directly from the `waou-fund` root folder:

### Development
```bash
# Start frontend dev server (Vite on http://localhost:5173)
npm run dev

# Start backend dev server (Express on http://localhost:8080)
npm run dev:backend
```

### Production Build
```bash
# Build frontend only
npm run build

# Build backend only
npm run build:backend

# Build both frontend and backend for production
npm run build:all
```

### Automated Testing
```bash
# Run all 169 backend unit, integration, and security tests
npm run test:backend
```

---

## 🔒 Security Standards

1. **Zero Client Secrets**: No Gemini API keys or service account credentials exist in frontend code or bundles.
2. **Server-Enforced User Identity**: Startup profiles and data mutations strictly overwrite client-supplied IDs with the cryptographic `req.userId` verified by Firebase Admin.
3. **Per-UID Rate Limiting**: Abuse prevention isolates traffic per authenticated user account.
4. **Sanitized Error Responses**: Internal stack traces and database paths are never leaked to clients.
5. **No Synthetic AI Fallbacks**: Errors return clear, truthful status messages instead of fabricated AI text.
