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

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [activeAppTab, setActiveAppTab] = useState<string>('dashboard');
  const [allStartups, setAllStartups] = useState<StartupProfile[]>(MOCK_STARTUPS);
  const [selectedStartup, setSelectedStartup] = useState<StartupProfile>(MOCK_STARTUPS[0]);
  const [evaluation, setEvaluation] = useState<EvaluationResult>(DEFAULT_EVALUATION);

  // Auth / Onboarding state
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('founder');

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
    setAllStartups(allStartups.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleUpdateEvaluation = (res: EvaluationResult) => {
    setEvaluation(res);
  };

  // ─── Auth completion: user logged in and selected role ────────────
  const handleAuthComplete = (email: string, name: string, role: UserRole) => {
    setUserEmail(email);
    setUserName(name);
    setUserRole(role);
    if (role === 'founder') {
      setCurrentView('dataroom');
    } else {
      // Angel & VC go directly to founder app for now
      setCurrentView('app');
      setActiveAppTab('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Data room analysis completed: auto-fill startup profile ─────
  const handleDataRoomComplete = (extractedData: ExtractedStartupData) => {
    // Merge extracted data into the selected startup profile
    const merged: StartupProfile = {
      ...selectedStartup,
      name: extractedData.companyName || selectedStartup.name,
      tagline: extractedData.tagline || selectedStartup.tagline,
      stage: (extractedData.stage as StartupProfile['stage']) || selectedStartup.stage,
      category: extractedData.sector || selectedStartup.category,
      targetAsk: extractedData.askAmount || selectedStartup.targetAsk,
      mrr: extractedData.mrr || selectedStartup.mrr,
      fundabilityScore: extractedData.fundingReadiness || selectedStartup.fundabilityScore,
    };
    setSelectedStartup(merged);
    setAllStartups(prev => prev.map(s => s.id === merged.id ? merged : s));

    // Merge fundability breakdown into evaluation
    if (extractedData.fundingReadinessBreakdown) {
      const bd = extractedData.fundingReadinessBreakdown;
      setEvaluation(prev => ({
        ...prev,
        overall_score: extractedData.fundingReadiness || prev.overall_score,
        team_score: bd.teamScore,
        market_score: bd.marketScore,
        execution_score: bd.tractionScore,
        product_score: bd.productScore,
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
            isLoggedIn={!!userName}
            userName={userName}
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
