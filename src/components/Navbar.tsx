import React from 'react';
import { 
  Sparkles, 
  Flame, 
  LayoutDashboard, 
  Globe, 
  ChevronDown, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { StartupProfile } from '../data/defaultData';

interface NavbarProps {
  currentView: 'landing' | 'app';
  setCurrentView: (view: 'landing' | 'app') => void;
  selectedStartup: StartupProfile;
  setSelectedStartup: (s: StartupProfile) => void;
  allStartups: StartupProfile[];
  streakCount: number;
  openStreakModal: () => void;
  openDailyTaskModal: () => void;
  isDailyTaskDone: boolean;
  activeAppTab: string;
  setActiveAppTab: (tab: string) => void;
  // Auth props
  onSignIn?: () => void;
  isLoggedIn?: boolean;
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  selectedStartup,
  setSelectedStartup,
  allStartups,
  streakCount,
  openStreakModal,
  openDailyTaskModal,
  isDailyTaskDone,
  setActiveAppTab,
  onSignIn,
  isLoggedIn,
  userName,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div 
            onClick={() => setCurrentView('landing')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.18)',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              flexShrink: 0,
            }}>
              <img 
                src="/logo.png" 
                alt="WaouFund Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ 
                fontSize: '1.45rem', 
                fontWeight: 900, 
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)'
              }}>
                Waou<span style={{ color: '#2563EB' }}>Fund</span>
              </span>
              <span style={{ 
                fontSize: '0.68rem', 
                fontWeight: 700, 
                letterSpacing: '0.08em', 
                textTransform: 'uppercase',
                color: 'var(--text-muted)' 
              }}>
                AI Fundraising Intelligence
              </span>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-secondary)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
          }}>
            <button
              onClick={() => setCurrentView('landing')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: currentView === 'landing' ? '#FFFFFF' : 'transparent',
                color: currentView === 'landing' ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: currentView === 'landing' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <Globe size={14} color={currentView === 'landing' ? '#2563EB' : 'currentColor'} />
              Overview & Tour
            </button>
            <button
              onClick={() => setCurrentView('app')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: currentView === 'app' ? '#FFFFFF' : 'transparent',
                color: currentView === 'app' ? 'var(--text-brand)' : 'var(--text-muted)',
                boxShadow: currentView === 'app' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <LayoutDashboard size={14} color={currentView === 'app' ? '#2563EB' : 'currentColor'} />
              Founder Studio
              <span style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
                color: '#FFFFFF',
                fontSize: '0.62rem',
                padding: '1px 6px',
                borderRadius: '8px',
                fontWeight: 800,
              }}>
                PRO
              </span>
            </button>
          </div>
        </div>

        {/* Right Nav Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Active Startup Picker (Dropdown) */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-xs)',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 6px rgba(16, 185, 129, 0.5)',
              }} />
              <span>{selectedStartup.name}</span>
              <span style={{ 
                fontSize: '0.7rem', 
                color: 'var(--text-brand)', 
                backgroundColor: 'var(--accent-bg-blue)', 
                padding: '2px 6px', 
                borderRadius: '6px',
                fontWeight: 700,
              }}>
                {selectedStartup.stage}
              </span>
              <ChevronDown size={14} color="var(--text-hint)" />
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '280px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-xl)',
                padding: '0.5rem',
                zIndex: 60,
              }}>
                <div style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 800, 
                  color: 'var(--text-hint)', 
                  padding: '0.5rem 0.75rem', 
                  letterSpacing: '0.06em', 
                  textTransform: 'uppercase' 
                }}>
                  Switch Startup
                </div>
                {allStartups.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedStartup(s);
                      setDropdownOpen(false);
                    }}
                    style={{
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      backgroundColor: selectedStartup.id === s.id ? 'var(--accent-bg-blue)' : 'transparent',
                      color: 'var(--text-primary)',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{s.name}</span>
                      <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>{s.fundabilityScore}/100</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{s.category} • {s.stage}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Cloud Status */}
          <div 
            title="Full-Stack Backend Live: Render & Cloud Run API"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.42rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#15803D',
            }}
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#22C55E',
              boxShadow: '0 0 8px rgba(34, 197, 94, 0.8)',
            }} />
            <span>Cloud API: Live</span>
          </div>

          {/* Daily Streak Fire Badge */}
          <button
            onClick={openStreakModal}
            title="Daily Active Streak"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #FF6B00 0%, #F97316 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.82rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
              transition: 'transform 0.2s ease',
            }}
          >
            <Flame size={15} fill="#FFFFFF" />
            <span>{streakCount}d</span>
          </button>

          {/* Daily Directive Task Pill */}
          <button
            onClick={openDailyTaskModal}
            title="Today's AI Directive"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isDailyTaskDone ? 'var(--accent-bg-emerald)' : 'var(--accent-bg-blue)',
              border: isDailyTaskDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(37, 99, 235, 0.15)',
              color: isDailyTaskDone ? '#10B981' : '#2563EB',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            <ShieldCheck size={14} color={isDailyTaskDone ? '#10B981' : '#2563EB'} />
            <span>{isDailyTaskDone ? 'Done' : 'Daily Task'}</span>
          </button>

          {/* Main Action CTA */}
          {currentView === 'landing' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {!isLoggedIn && (
                <button
                  onClick={onSignIn}
                  style={{
                    padding: '0.5rem 1.1rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1.5px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#334155',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                  }}
                >
                  Sign In
                </button>
              )}
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    setCurrentView('app');
                  } else {
                    onSignIn?.();
                  }
                }}
                className="btn-primary"
                style={{
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.88rem',
                }}
              >
                <span>{isLoggedIn ? 'Launch Studio' : 'Get Started Free'}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {isLoggedIn && userName && (
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  flexShrink: 0,
                  title: userName,
                }}>
                  {userName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
              )}
              <button
                onClick={() => {
                  setActiveAppTab('diagnostic');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
                }}
              >
                <Sparkles size={14} />
                <span>Diagnose Deck</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
