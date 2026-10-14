import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  ShieldCheck, 
  ArrowRight,
  Check,
} from 'lucide-react';
import { MOCK_STARTUPS, DEFAULT_EVALUATION, StartupProfile } from './data/defaultData';
import { EvaluationResult } from './types';
import { UserRole, ExtractedStartupData } from './types/user';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { FounderApp } from './components/FounderApp';
import { AuthScreen } from './components/AuthScreen';
import { DataRoomOnboarding } from './components/DataRoomOnboarding';

// ─── App view states ────────────────────────────────────────────────
type AppView = 'landing' | 'auth' | 'dataroom' | 'app';

// ─── Real User Startup & Persistence Helpers ────────────────────────
const getInitialUser = () => {
  try {
    const saved = localStorage.getItem('@waoufund_active_user');
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};

const getInitialStartup = (user: any): StartupProfile => {
  try {
    const saved = localStorage.getItem('@waoufund_active_startup');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.name) return parsed;
    }
  } catch {}

  const founderName = user?.name || 'Founder';
  const founderEmail = user?.email || 'founder@startup.com';
  const company = user?.name ? `${user.name}'s Venture` : 'My Venture';

  return {
    id: 'user_active_startup',
    name: company,
    tagline: 'Autonomous AI enterprise infrastructure accelerating fundraising and diligence workflows.',
    category: 'B2B SaaS / Enterprise AI',
    stage: 'Seed',
    founder: founderName,
    location: 'Bengaluru, India',
    website: 'https://myventure.ai',
    targetAsk: '₹3.5 Cr ($450K)',
    valuation: '₹24.0 Cr ($3.0M)',
    equityOffered: '14.6%',
    mrr: '₹24,00,000',
    burn: '₹7,50,000',
    growth: '+22% MoM',
    fundabilityScore: 82,
    fullName: founderName,
    role: 'CEO & Co-Founder',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80',
    linkedinUrl: '',
    email: founderEmail,
    pedigree: 'First-Time Founder',
    team: [],
    companyName: company,
    websiteUrl: 'https://myventure.ai',
    companyType: 'Private Limited',
    isRegistered: true,
    registrationNo: '29ABCDE1234F1Z5',
    sector: 'SaaS',
    pitch: 'Autonomous AI enterprise infrastructure accelerating fundraising and diligence workflows.',
    currency: '₹ (INR)',
    tam: '38000000000',
    sam: '7800000000',
    som: '1100000000',
    competitor1: 'https://pitchbook.com',
    competitor2: 'https://carta.com',
    competitor3: '',
    distributionMoat: 'Proprietary institutional intelligence graph and direct API integration with data rooms.',
    targetRaise: '35000000',
    valuationCap: '240000000',
    capitalCommitted: '7500000',
    currentMrr: '2400000',
    userTraction: '14 Active Enterprise Pilots',
    momGrowth: '22',
    grossMargin: '84',
    cac: '75000',
    waitlistCount: '340',
    betaConversion: '24',
    productStatus: 'Functional MVP',
    problemValidation: 'Founders spend 400+ hours manually preparing models and navigating investor diligence.',
    teamCapability: 'Technical and business operators with prior scaling experience in venture-backed teams.',
    runway: '14',
    verifiedArr: '28800000',
    churnRate: '1.4',
    nrr: '121',
    ltvcacRatio: '4:1',
    cacPayback: '6',
    burnRate: '750000',
    execSales: false,
    execEng: true,
    execMarketing: false,
    annualRevenue: '28800000',
    expansionVectors: ['New Product Lines'],
    cSuiteComplete: false,
    marketShare: '8',
  };
};

export default function App() {
  const initialUser = getInitialUser();
  const [userName, setUserName] = useState<string>(initialUser?.name || '');
  const [userEmail, setUserEmail] = useState<string>(initialUser?.email || '');
  const [userRole, setUserRole] = useState<UserRole>(initialUser?.role || 'founder');

  const [currentView, setCurrentView] = useState<AppView>(initialUser ? 'app' : 'landing');
  const [activeAppTab, setActiveAppTab] = useState<string>('dashboard');

  const [selectedStartup, setSelectedStartup] = useState<StartupProfile>(() => getInitialStartup(initialUser));
  const [allStartups, setAllStartups] = useState<StartupProfile[]>(() => {
    const active = getInitialStartup(initialUser);
    return [active, ...MOCK_STARTUPS.filter(s => s.id !== active.id)];
  });
  const [evaluation, setEvaluation] = useState<EvaluationResult>(DEFAULT_EVALUATION);

  // Gamification & Streak state
  const [streakCount, setStreakCount] = useState<number>(5);
  const [isDailyTaskDone, setIsDailyTaskDone] = useState<boolean>(false);
  const [showStreakModal, setShowStreakModal] = useState<boolean>(false);
  const [showDailyTaskModal, setShowDailyTaskModal] = useState<boolean>(false);

  const toggleDailyTask = () => {
    if (!isDailyTaskDone) {
      setIsDailyTaskDone(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      setIsDailyTaskDone(false);
    }
  };

  const handleUpdateStartup = (updated: StartupProfile) => {
    setSelectedStartup(updated);
    setAllStartups(prev => prev.map((s) => (s.id === updated.id ? updated : s)));
    try {
      localStorage.setItem('@waoufund_active_startup', JSON.stringify(updated));
    } catch {}
  };

  const handleUpdateEvaluation = (res: EvaluationResult) => {
    setEvaluation(res);
  };

  // ─── Auth completion: real user logged in and selected role ───────
  const handleAuthComplete = (email: string, name: string, role: UserRole) => {
    setUserEmail(email);
    setUserName(name);
    setUserRole(role);

    try {
      localStorage.setItem('@waoufund_active_user', JSON.stringify({ email, name, role }));
    } catch {}

    // Synchronize startup with the real founder's name and email
    setSelectedStartup(prev => {
      const updated: StartupProfile = {
        ...prev,
        founder: name,
        fullName: name,
        email: email,
        name: prev.name.includes('AvasPlot') ? `${name}'s Venture` : prev.name,
        companyName: prev.companyName?.includes('AvasPlot') ? `${name}'s Venture` : prev.companyName,
      };
      setAllStartups(all => [updated, ...MOCK_STARTUPS]);
      try {
        localStorage.setItem('@waoufund_active_startup', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (role === 'founder') {
      setCurrentView('dataroom');
    } else {
      setCurrentView('app');
      setActiveAppTab('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Data room analysis completed: auto-fill real startup profile ──
  const handleDataRoomComplete = (extractedData: ExtractedStartupData) => {
    const merged: StartupProfile = {
      ...selectedStartup,
      name: extractedData.companyName || selectedStartup.name,
      companyName: extractedData.companyName || selectedStartup.companyName,
      tagline: extractedData.tagline || selectedStartup.tagline,
      pitch: extractedData.tagline || selectedStartup.pitch,
      stage: (extractedData.stage as StartupProfile['stage']) || selectedStartup.stage,
      category: extractedData.sector || selectedStartup.category,
      sector: extractedData.sector || selectedStartup.sector,
      targetAsk: extractedData.askAmount || selectedStartup.targetAsk,
      mrr: extractedData.mrr || selectedStartup.mrr,
      tam: extractedData.tam || selectedStartup.tam,
      sam: extractedData.sam || selectedStartup.sam,
      som: extractedData.som || selectedStartup.som,
      fundabilityScore: extractedData.fundingReadiness || selectedStartup.fundabilityScore,
    };

    setSelectedStartup(merged);
    setAllStartups(prev => [merged, ...MOCK_STARTUPS]);
    try {
      localStorage.setItem('@waoufund_active_startup', JSON.stringify(merged));
    } catch {}

    if (extractedData.fundingReadinessBreakdown) {
      const bd = extractedData.fundingReadinessBreakdown;
      setEvaluation(prev => ({
        ...prev,
        overall_score: extractedData.fundingReadiness || prev.overall_score,
        team_score: bd.teamScore * 10,
        market_score: bd.marketScore * 10,
        execution_score: bd.tractionScore * 10,
        product_score: bd.productScore * 10,
        traction_score: bd.financialScore * 10,
        red_flags: extractedData.redFlags || prev.red_flags,
        stage_advice: extractedData.investorRecommendation || prev.stage_advice,
      }));
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setCurrentView('app');
    setActiveAppTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSkipDataRoom = () => {
    setCurrentView('app');
    setActiveAppTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Sign Out / Reset session ────────────────────────────────────
  const handleSignOut = () => {
    try {
      localStorage.removeItem('@waoufund_active_user');
      localStorage.removeItem('@waoufund_active_startup');
    } catch {}
    setUserName('');
    setUserEmail('');
    setUserRole('founder');
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="waoufund-app" style={{ minHeight: '100vh' }}>

      {/* ── Full-page Auth & Onboarding views (no Navbar) ─────────── */}
      {currentView === 'auth' && (
        <AuthScreen
          onComplete={handleAuthComplete}
        />
      )}

      {currentView === 'dataroom' && (
        <DataRoomOnboarding
          userName={userName}
          role={userRole}
          onComplete={handleDataRoomComplete}
          onSkip={handleSkipDataRoom}
        />
      )}

      {/* ── Main views with Navbar ─────────────────────────────────── */}
      {(currentView === 'landing' || currentView === 'app') && (
        <>
          {/* ── Top Sticky Header Navigation ───────────────────────── */}
          <Navbar 
            currentView={currentView === 'landing' ? 'landing' : 'app'}
            setCurrentView={(v) => {
              if (v === 'landing') setCurrentView('landing');
              else setCurrentView('app');
            }}
            selectedStartup={selectedStartup}
            setSelectedStartup={(s) => {
              setSelectedStartup(s);
              if (s.id === 'finflow') {
                setEvaluation({
                  ...DEFAULT_EVALUATION,
                  overall_score: 94,
                  team_score: 95,
                  market_score: 96,
                  financial_metrics: {
                    ...DEFAULT_EVALUATION.financial_metrics,
                    arr: 250000000,
                    mrr: 25000000,
                    cash_balance: 45000000,
                  },
                });
              } else if (s.id === 'healthsync') {
                setEvaluation({
                  ...DEFAULT_EVALUATION,
                  overall_score: 74,
                  team_score: 80,
                  market_score: 76,
                  financial_metrics: {
                    ...DEFAULT_EVALUATION.financial_metrics,
                    arr: 10000000,
                    mrr: 850000,
                    cash_balance: 3500000,
                  },
                });
              } else {
                setEvaluation(DEFAULT_EVALUATION);
              }
            }}
            allStartups={allStartups}
            streakCount={streakCount}
            openStreakModal={() => setShowStreakModal(true)}
            openDailyTaskModal={() => setShowDailyTaskModal(true)}
            isDailyTaskDone={isDailyTaskDone}
            activeAppTab={activeAppTab}
            setActiveAppTab={setActiveAppTab}
            onSignIn={() => setCurrentView('auth')}
            onSignOut={handleSignOut}
            isLoggedIn={!!userName}
            userName={userName}
            userEmail={userEmail}
          />

          {/* ── Main View Switcher: Landing vs Founder Studio OS ─── */}
          {currentView === 'landing' ? (
            <LandingPage 
              onGetStarted={() => {
                setCurrentView('auth');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDiagnostic={() => {
                setCurrentView('auth');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              selectedStartup={selectedStartup}
            />
          ) : (
            <FounderApp 
              startup={selectedStartup}
              onUpdateStartup={handleUpdateStartup}
              evaluation={evaluation}
              onUpdateEvaluation={handleUpdateEvaluation}
              streakCount={streakCount}
              openStreakModal={() => setShowStreakModal(true)}
              isDailyTaskDone={isDailyTaskDone}
              toggleDailyTask={toggleDailyTask}
              activeTab={activeAppTab}
              setActiveTab={(tab) => {
                setActiveAppTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSignOut={handleSignOut}
            />
          )}
        </>
      )}

      {/* ── STREAK MODAL ──────────────────────────────────────────── */}
      {showStreakModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 110,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid var(--border-subtle)',
            padding: '2.5rem',
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            boxShadow: 'var(--shadow-2xl)',
            position: 'relative',
          }}>
            <button
              onClick={() => setShowStreakModal(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6B00 0%, #F97316 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              boxShadow: '0 8px 24px rgba(249, 115, 22, 0.3)',
            }}>
              <Flame size={44} fill="#FFFFFF" />
            </div>

            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {streakCount} Day Momentum Streak!
            </h3>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>
              You've actively engaged your fundraising operating system {streakCount} days in a row. Consistent data room updates signal extreme founder execution velocity to top-tier institutional funds.
            </p>

            <div style={{
              margin: '1.5rem 0',
              padding: '1rem',
              borderRadius: '14px',
              backgroundColor: 'rgba(249, 115, 22, 0.06)',
              border: '1px solid rgba(249, 115, 22, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#F97316' }}>STREAK BONUS APPLIED</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>+2.5% VECTORS</span>
            </div>

            <button
              onClick={() => setShowStreakModal(false)}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              Maintain Daily Execution
            </button>
          </div>
        </div>
      )}

      {/* ── DAILY TASK MODAL ──────────────────────────────────────── */}
      {showDailyTaskModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 110,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid var(--border-subtle)',
            padding: '2.5rem',
            maxWidth: '520px',
            width: '100%',
            boxShadow: 'var(--shadow-2xl)',
            position: 'relative',
          }}>
            <button
              onClick={() => setShowDailyTaskModal(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              backgroundColor: isDailyTaskDone ? 'var(--accent-bg-emerald)' : 'var(--accent-bg-blue)',
              color: isDailyTaskDone ? '#10B981' : '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <ShieldCheck size={28} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              Today's High-Leverage AI Directive
            </h3>

            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: 1.6 }}>
              "{evaluation.daily_tasks[0]}"
            </p>

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: isDailyTaskDone ? 'var(--accent-bg-emerald)' : 'var(--bg-secondary)',
              border: isDailyTaskDone ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-hint)', fontWeight: 800 }}>STATUS:</span>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: isDailyTaskDone ? '#10B981' : '#F59E0B' }}>
                  {isDailyTaskDone ? 'DIRECTIVE COMPLETED (+2 PTS)' : 'PENDING FOUNDER ACTION'}
                </div>
              </div>

              <button
                onClick={toggleDailyTask}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: isDailyTaskDone ? 'rgba(239, 68, 68, 0.08)' : '#10B981',
                  border: isDailyTaskDone ? '1px solid rgba(239, 68, 68, 0.2)' : 'none',
                  color: isDailyTaskDone ? '#EF4444' : '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                {isDailyTaskDone ? 'Mark Incomplete' : 'Complete Task'}
              </button>
            </div>

            <button
              onClick={() => {
                setShowDailyTaskModal(false);
                setCurrentView('app');
                setActiveAppTab('actionplan');
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '1.25rem' }}
            >
              <span>View Full Action Plan</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
