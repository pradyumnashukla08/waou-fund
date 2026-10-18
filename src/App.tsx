import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  ShieldCheck, 
  ArrowRight,
} from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import { apiClient } from './services/apiClient';
import { MOCK_STARTUPS, DEFAULT_EVALUATION, INITIAL_USER_EVALUATION, StartupProfile } from './data/defaultData';
import { EvaluationResult } from './types';
import { UserRole, ExtractedStartupData } from './types/user';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { FounderApp } from './components/FounderApp';
import { AuthScreen } from './components/AuthScreen';
import { DataRoomOnboarding } from './components/DataRoomOnboarding';
import { updatePageSeo } from './utils/seo';

// ─── App view states ────────────────────────────────────────────────
type AppView = 'landing' | 'auth' | 'dataroom' | 'app';

// ─── Helper to build a completely clean starter profile for a real founder ──────────
const getInitialStartup = (user?: { name?: string; email?: string } | null): StartupProfile => {
  const founderName = user?.name || '';
  const founderEmail = user?.email || '';
  const company = user?.name ? `${user.name}'s Venture` : 'My Venture';

  return {
    id: 'user_active_startup',
    name: company,
    tagline: '',
    category: '',
    stage: 'Seed',
    founder: founderName,
    location: '',
    website: '',
    targetAsk: '',
    valuation: '',
    equityOffered: '',
    mrr: '',
    burn: '',
    growth: '',
    fundabilityScore: 0,
    fullName: founderName,
    role: 'CEO & Co-Founder',
    profileImage: '',
    linkedinUrl: '',
    email: founderEmail,
    pedigree: '',
    team: [],
    companyName: company,
    websiteUrl: '',
    companyType: '',
    isRegistered: false,
    registrationNo: '',
    sector: '',
    pitch: '',
    currency: '₹ (INR)',
    tam: '',
    sam: '',
    som: '',
    competitor1: '',
    competitor2: '',
    competitor3: '',
    distributionMoat: '',
    targetRaise: '',
    valuationCap: '',
    capitalCommitted: '',
    currentMrr: '',
    userTraction: '',
    momGrowth: '',
    grossMargin: '',
    cac: '',
    waitlistCount: '',
    betaConversion: '',
    productStatus: '',
    problemValidation: '',
    teamCapability: '',
    runway: '',
    verifiedArr: '',
    churnRate: '',
    nrr: '',
    ltvcacRatio: '',
    cacPayback: '',
    burnRate: '',
    execSales: false,
    execEng: false,
    execMarketing: false,
    annualRevenue: '',
    expansionVectors: [],
    cSuiteComplete: false,
    marketShare: '',
  };
};

const sanitizeStartupDraft = (startup: StartupProfile): StartupProfile => {
  const isLegacyMockAsk = startup.targetAsk === '₹2.0 Cr ($250K)' || startup.targetAsk === '₹4 Cr';
  const isLegacyMockVal = startup.valuation === '₹15.0 Cr ($1.8M)';
  const isLegacyMockScore = startup.fundabilityScore === 60 || startup.fundabilityScore === 85;
  const isLegacyMockRaise = startup.targetRaise === '20000000';
  const isLegacyMockCap = startup.valuationCap === '150000000';
  const isLegacyMockCategory = startup.category === 'B2B SaaS / Enterprise AI' && !startup.pitch;
  const isLegacyMockLocation = startup.location === 'Bengaluru, India' && !startup.website;
  const isLegacyMockPedigree = startup.pedigree === 'First-Time Founder' && (!startup.team || startup.team.length === 0);

  return {
    ...startup,
    targetAsk: isLegacyMockAsk ? '' : startup.targetAsk,
    valuation: isLegacyMockVal ? '' : startup.valuation,
    equityOffered: isLegacyMockAsk ? '' : startup.equityOffered,
    fundabilityScore: isLegacyMockScore ? 0 : startup.fundabilityScore,
    targetRaise: isLegacyMockRaise ? '' : startup.targetRaise,
    valuationCap: isLegacyMockCap ? '' : startup.valuationCap,
    category: isLegacyMockCategory ? '' : startup.category,
    location: isLegacyMockLocation ? '' : startup.location,
    pedigree: isLegacyMockPedigree ? '' : startup.pedigree,
    productStatus: startup.productStatus === 'MVP in Development' && !startup.problemValidation ? '' : startup.productStatus,
    runway: startup.runway === '12' && (!startup.currentMrr || startup.currentMrr === '0') ? '' : startup.runway,
  };
};

export default function App() {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<UserRole>('founder');

  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const viewParam = params.get('view');
        const tabParam = params.get('tab');
        if (viewParam === 'auth') return 'auth';
        if (viewParam === 'dataroom') return 'dataroom';
        if (viewParam === 'diagnostic' || tabParam) return 'app';
      }
      const saved = sessionStorage.getItem('waou_current_view') as AppView;
      return (saved === 'app' || saved === 'dataroom' || saved === 'auth') ? saved : 'landing';
    } catch {
      return 'landing';
    }
  });

  const [activeAppTab, setActiveAppTab] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        const viewParam = params.get('view');
        if (tabParam) return tabParam;
        if (viewParam === 'diagnostic') return 'diagnostic';
      }
      return sessionStorage.getItem('waou_active_tab') || 'dashboard';
    } catch {
      return 'dashboard';
    }
  });

  // Keep non-sensitive UI routing states synchronized with session storage
  useEffect(() => {
    try {
      sessionStorage.setItem('waou_current_view', currentView);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [currentView]);

  useEffect(() => {
    try {
      sessionStorage.setItem('waou_active_tab', activeAppTab);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [activeAppTab]);

  // Synchronize dynamic SEO metadata, Open Graph, and canonical URLs on every route transition
  useEffect(() => {
    updatePageSeo(currentView, activeAppTab);
  }, [currentView, activeAppTab]);

  const [selectedStartup, setSelectedStartup] = useState<StartupProfile>(() => {
    try {
      const draft = sessionStorage.getItem('waou_selected_startup_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.id === 'user_active_startup') {
          return sanitizeStartupDraft(parsed);
        }
        return parsed;
      }
    } catch {}
    return getInitialStartup(null);
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('waou_selected_startup_draft', JSON.stringify(selectedStartup));
    } catch {}
  }, [selectedStartup]);

  const [allStartups, setAllStartups] = useState<StartupProfile[]>(() => {
    const active = getInitialStartup(null);
    return [active, ...MOCK_STARTUPS.filter(s => s.id !== active.id)];
  });

  const [evaluation, setEvaluation] = useState<EvaluationResult>(() => {
    try {
      const saved = sessionStorage.getItem('waou_user_evaluation');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_USER_EVALUATION;
  });

  // Switch evaluation automatically between real active startup and benchmark sample startups
  useEffect(() => {
    if (selectedStartup.id === 'avasplot') {
      setEvaluation(DEFAULT_EVALUATION);
    } else if (selectedStartup.id === 'user_active_startup') {
      try {
        const saved = sessionStorage.getItem('waou_user_evaluation');
        if (saved) {
          setEvaluation(JSON.parse(saved));
        } else {
          setEvaluation(INITIAL_USER_EVALUATION);
        }
      } catch {
        setEvaluation(INITIAL_USER_EVALUATION);
      }
    }
  }, [selectedStartup.id]);

  // Gamification & Streak state (starts at 1 for genuine new users)
  const [streakCount, setStreakCount] = useState<number>(1);
  const [isDailyTaskDone, setIsDailyTaskDone] = useState<boolean>(false);
  const [showStreakModal, setShowStreakModal] = useState<boolean>(false);
  const [showDailyTaskModal, setShowDailyTaskModal] = useState<boolean>(false);

  // ─── Firebase Auth Session Observer ──────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Founder';
        const email = firebaseUser.email || '';
        setUserName(name);
        setUserEmail(email);

        // Fetch user's server-authoritative startup profile
        try {
          const res = await apiClient.get<{ success: boolean; profile: StartupProfile | null }>('/startup/profile');
          if (res && res.success && res.profile) {
            let userProfile = res.profile;
            // Clean out legacy mock data if this user was accidentally seeded with mock text
            const isMockPitch = userProfile.pitch?.includes('AI spatial intelligence') ||
                                userProfile.pitch?.includes('Autonomous AI enterprise');
            const isMockFounder = userProfile.founder === 'Rahul Sharma' && name !== 'Rahul Sharma';
            
            if (isMockPitch || isMockFounder) {
              userProfile = {
                ...userProfile,
                founder: name,
                fullName: name,
                email: email,
                name: (userProfile.name?.includes('AvasPlot') || userProfile.name === 'My Venture') ? `${name}'s Venture` : userProfile.name,
                companyName: (userProfile.companyName?.includes('AvasPlot') || userProfile.companyName === 'My Venture') ? `${name}'s Venture` : userProfile.companyName,
                pitch: isMockPitch ? '' : userProfile.pitch,
                tagline: isMockPitch ? '' : userProfile.tagline,
                team: userProfile.team?.some(m => m.name === 'Kavita Sundaram') ? [] : (userProfile.team || []),
                competitor1: userProfile.competitor1?.includes('costar.com') || userProfile.competitor1?.includes('pitchbook.com') ? '' : userProfile.competitor1,
                competitor2: userProfile.competitor2?.includes('cherre.com') || userProfile.competitor2?.includes('carta.com') ? '' : userProfile.competitor2,
                competitor3: userProfile.competitor3?.includes('reonomy.com') ? '' : userProfile.competitor3,
              };
              // Persist cleaned profile
              apiClient.put('/startup/profile', userProfile).catch(() => {});
            }

            setSelectedStartup(userProfile);
            setAllStartups([userProfile, ...MOCK_STARTUPS.filter(s => s.id !== userProfile.id)]);
          } else {
            // First time login: seed default clean profile for this user
            const fresh = getInitialStartup({ name, email });
            setSelectedStartup(fresh);
            setAllStartups([fresh, ...MOCK_STARTUPS.filter(s => s.id !== fresh.id)]);
            apiClient.put('/startup/profile', fresh).catch(err => {
              console.warn('[App] Initial profile sync warning:', err);
            });
          }
        } catch (err) {
          console.warn('[App] Could not load profile from backend, using session state:', err);
        }
      } else {
        setUserName('');
        setUserEmail('');
        // If unauthenticated, redirect away from protected views back to landing
        setCurrentView(prev => (prev === 'app' || prev === 'dataroom' ? 'landing' : prev));
      }
    });

    return () => unsubscribe();
  }, []);

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

    // Persist to server if authenticated
    if (auth.currentUser) {
      apiClient.put('/startup/profile', updated).catch(err => {
        console.warn('[App] Failed to persist startup update to backend:', err);
      });
    }
  };

  const handleUpdateEvaluation = (res: EvaluationResult) => {
    setEvaluation(res);
    try {
      if (selectedStartup.id === 'user_active_startup') {
        sessionStorage.setItem('waou_user_evaluation', JSON.stringify(res));
      }
    } catch {}
  };

  // ─── Auth completion: genuine user authenticated with role ─────────
  const handleAuthComplete = (email: string, name: string, role: UserRole) => {
    setUserEmail(email);
    setUserName(name);
    setUserRole(role);

    // Clear stale drafts from prior session / other users
    try {
      sessionStorage.removeItem('waou_profile_draft_user_active_startup');
      sessionStorage.removeItem('waou_profile_draft_avasplot');
      sessionStorage.removeItem('waou_selected_startup_draft');
    } catch {}

    // Synchronize startup with the real founder's name and email
    setSelectedStartup(prev => {
      const updated: StartupProfile = {
        ...prev,
        founder: name,
        fullName: name,
        email: email,
        name: (prev.name.includes('AvasPlot') || prev.name === 'My Venture') ? `${name}'s Venture` : prev.name,
        companyName: (prev.companyName?.includes('AvasPlot') || prev.companyName === 'My Venture') ? `${name}'s Venture` : prev.companyName,
        pitch: prev.pitch?.includes('AI spatial intelligence') || prev.pitch?.includes('Autonomous AI enterprise') ? '' : prev.pitch,
        tagline: prev.tagline?.includes('AI spatial intelligence') || prev.tagline?.includes('Autonomous AI enterprise') ? '' : prev.tagline,
        team: prev.team?.some(m => m.name === 'Kavita Sundaram') ? [] : (prev.team || []),
      };
      setAllStartups([updated, ...MOCK_STARTUPS]);

      // Save to server
      if (auth.currentUser) {
        apiClient.put('/startup/profile', updated).catch(err => {
          console.warn('[App] Profile persist on auth complete error:', err);
        });
      }

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
    setAllStartups([merged, ...MOCK_STARTUPS]);

    // Persist to server
    if (auth.currentUser) {
      apiClient.put('/startup/profile', merged).catch(err => {
        console.warn('[App] Profile persist on dataroom complete error:', err);
      });
    }

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

  // ─── Sign Out / Reset session via Firebase Auth ──────────────────
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('[App] SignOut error:', err);
    }
    try {
      sessionStorage.removeItem('waou_current_view');
      sessionStorage.removeItem('waou_active_tab');
      sessionStorage.removeItem('waou_selected_startup_draft');
      sessionStorage.removeItem('waou_profile_draft_user_active_startup');
      sessionStorage.removeItem('waou_profile_draft_avasplot');
      sessionStorage.removeItem('waou_user_evaluation');
      sessionStorage.removeItem('waou_dataroom_docs');
    } catch {
      // Ignore storage errors in restricted contexts
    }
    setUserName('');
    setUserEmail('');
    setUserRole('founder');
    setSelectedStartup(getInitialStartup(null));
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
                if (userName) {
                  setCurrentView('app');
                } else {
                  setCurrentView('auth');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDiagnostic={() => {
                if (userName) {
                  setCurrentView('app');
                  setActiveAppTab('diagnostic');
                } else {
                  setCurrentView('auth');
                }
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
