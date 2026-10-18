import React, { useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  LayoutDashboard, 
  Globe, 
  ChevronDown, 
  ShieldCheck, 
  ArrowRight,
  LogOut,
  Menu,
  X,
  User,
  Briefcase,
  FileText,
  Cpu,
  Calculator,
  Database,
  TrendingUp,
  Rocket,
  Scale,
  Users
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
  onSignIn?: () => void;
  onSignOut?: () => void;
  isLoggedIn?: boolean;
  userName?: string;
  userEmail?: string;
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
  activeAppTab,
  setActiveAppTab,
  onSignIn,
  onSignOut,
  isLoggedIn,
  userName,
  userEmail,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [mobileMenuOpen]);

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
              <span className="hide-on-mobile" style={{ 
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
          <div className="hide-on-mobile" style={{
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
          <div className="hide-on-mobile" style={{ position: 'relative' }}>
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
                  Ventures & Reference Benchmarks
                </div>
                {allStartups.map((s, idx) => (
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
                      borderLeft: idx === 0 ? '3px solid #2563EB' : '3px solid transparent',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {s.name}
                        {idx === 0 && (
                          <span style={{ fontSize: '0.62rem', backgroundColor: '#EFF6FF', color: '#2563EB', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>
                            YOURS
                          </span>
                        )}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: s.fundabilityScore ? '#10B981' : 'var(--text-hint)', fontWeight: 700 }}>
                        {s.fundabilityScore ? `${s.fundabilityScore}/100` : 'Not Scored'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {idx === 0 ? 'Active Production Dossier' : `Sample Benchmark • ${s.stage}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
            className="hide-on-mobile"
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
            <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {!isLoggedIn ? (
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
              ) : (
                onSignOut && (
                  <button
                    onClick={onSignOut}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1.5px solid #FEE2E2',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </button>
                )
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
            <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {isLoggedIn && userName && (
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      flexShrink: 0,
                      border: '2px solid #FFFFFF',
                      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                      cursor: 'pointer',
                    }}
                    title={userName}
                  >
                    {userName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                  </button>

                  {userMenuOpen && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '220px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-xl)',
                      padding: '0.75rem',
                      zIndex: 70,
                    }}>
                      <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #F1F5F9', marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>{userName}</div>
                        {userEmail && <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{userEmail}</div>}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          onSignOut?.();
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.5rem 0.6rem',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#EF4444',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Sign Out / Switch User
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isLoggedIn && onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  title="Sign out of your session"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.48rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1.5px solid #FEE2E2',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEE2E2';
                    e.currentTarget.style.borderColor = '#FCA5A5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEF2F2';
                    e.currentTarget.style.borderColor = '#FEE2E2';
                  }}
                >
                  <LogOut size={13} />
                  <span>Log Out</span>
                </button>
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

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="show-on-mobile"
            style={{
              width: '44px',
              height: '44px',
              minWidth: '44px',
              minHeight: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ─────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Waou<span style={{ color: '#2563EB' }}>Fund</span></span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Navigation Drawer"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  width: '44px',
                  height: '44px',
                  minWidth: '44px',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile Info if Logged In */}
            {isLoggedIn && (
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '0.75rem 0.85rem',
                marginBottom: '1rem',
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-hint)', textTransform: 'uppercase', marginBottom: '2px' }}>
                  Authenticated Founder
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{userName || 'Founder'}</div>
                {userEmail && <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{userEmail}</div>}
              </div>
            )}

            {/* Navigation Mode Switcher */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => {
                  setCurrentView('landing');
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.75rem 1rem',
                  minHeight: '44px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: currentView === 'landing' ? 'var(--accent-bg-blue)' : '#FFFFFF',
                  color: currentView === 'landing' ? 'var(--text-brand)' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Globe size={18} />
                <span>Overview & Product Tour</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isLoggedIn) {
                    setCurrentView('app');
                  } else {
                    onSignIn?.();
                  }
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.75rem 1rem',
                  minHeight: '44px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: currentView === 'app' ? 'var(--accent-bg-blue)' : '#FFFFFF',
                  color: currentView === 'app' ? 'var(--text-brand)' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <LayoutDashboard size={18} />
                <span>Founder Studio Workspace</span>
                <span style={{
                  marginLeft: 'auto',
                  background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
                  color: '#FFFFFF',
                  fontSize: '0.62rem',
                  padding: '1px 6px',
                  borderRadius: '6px',
                  fontWeight: 800,
                }}>
                  PRO
                </span>
              </button>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button
                type="button"
                onClick={() => {
                  setActiveAppTab('diagnostic');
                  setCurrentView('app');
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-cyan"
                style={{ width: '100%', padding: '0.7rem 1rem', fontSize: '0.88rem', minHeight: '44px' }}
              >
                <Sparkles size={16} />
                <span>Diagnose Pitch Deck</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  openDailyTaskModal();
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.7rem 1rem',
                  minHeight: '44px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isDailyTaskDone ? 'var(--accent-bg-emerald)' : 'var(--accent-bg-blue)',
                  border: isDailyTaskDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(37, 99, 235, 0.2)',
                  color: isDailyTaskDone ? '#10B981' : '#2563EB',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                }}
              >
                <ShieldCheck size={16} />
                <span>{isDailyTaskDone ? 'Daily Directive: Completed' : 'Open Daily AI Directive'}</span>
              </button>
            </div>

            {/* If in app mode, render full modular workspace directory */}
            {currentView === 'app' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: 'var(--text-hint)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}>
                  <Sparkles size={11} color="var(--text-brand)" />
                  Studio Modules
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'HOT' },
                    { id: 'workspace', label: 'Readiness Hub', icon: Briefcase },
                    { id: 'diagnostic', label: 'Deck Diagnostic', icon: FileText, badge: 'AI' },
                    { id: 'grill', label: 'AI Investor Grill', icon: Cpu, badge: 'CALL 1' },
                    { id: 'finance', label: 'Financial Command', icon: Calculator },
                    { id: 'dataroom', label: 'Virtual Data Room', icon: Database },
                    { id: 'market', label: 'Market & Traction', icon: TrendingUp },
                    { id: 'gtm', label: 'GTM Strategy', icon: Rocket },
                    { id: 'actionplan', label: 'Action Plan', icon: ShieldCheck },
                    { id: 'legaldocs', label: 'Legal Standards', icon: Scale },
                    { id: 'mentors', label: 'Mentor Directory', icon: Users },
                    { id: 'profile', label: 'Profile & 1-Pager', icon: User },
                  ].map((m) => {
                    const ModIcon = m.icon;
                    const isModActive = activeAppTab === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setActiveAppTab(m.id);
                          setMobileMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 0.75rem',
                          minHeight: '44px',
                          borderRadius: '8px',
                          border: isModActive ? '1px solid rgba(37, 99, 235, 0.2)' : 'none',
                          backgroundColor: isModActive ? 'var(--accent-bg-blue)' : 'transparent',
                          color: isModActive ? 'var(--text-brand)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: 'var(--font-sans)',
                          width: '100%',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <ModIcon size={16} color={isModActive ? 'var(--text-brand)' : 'var(--text-muted)'} />
                          <span style={{ fontSize: '0.85rem', fontWeight: isModActive ? 800 : 500 }}>
                            {m.label}
                          </span>
                        </div>
                        {m.badge && (
                          <span style={{
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            padding: '1px 5px',
                            borderRadius: '4px',
                            backgroundColor: isModActive ? 'var(--color-brand-600)' : 'var(--bg-secondary)',
                            color: isModActive ? '#FFFFFF' : 'var(--text-hint)',
                          }}>
                            {m.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active Venture Picker in Drawer */}
            <div style={{ marginBottom: 'auto' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-hint)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Select Active Dossier
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {allStartups.map((s, idx) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedStartup(s);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      padding: '0.65rem 0.75rem',
                      minHeight: '44px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: selectedStartup.id === s.id ? 'var(--accent-bg-blue)' : 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      borderLeft: idx === 0 ? '3px solid #2563EB' : '3px solid transparent',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700 }}>{s.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.stage}</div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: s.fundabilityScore ? '#10B981' : 'var(--text-hint)', fontWeight: 700 }}>
                      {s.fundabilityScore ? `${s.fundabilityScore}/100` : 'Not Scored'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', marginTop: '1.25rem' }}>
              {!isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    onSignIn?.();
                    setMobileMenuOpen(false);
                  }}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', minHeight: '44px' }}
                >
                  <span>Sign In to Account</span>
                  <ArrowRight size={15} />
                </button>
              ) : (
                onSignOut && (
                  <button
                    type="button"
                    onClick={() => {
                      onSignOut();
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.7rem',
                      minHeight: '44px',
                      borderRadius: 'var(--radius-full)',
                      border: '1.5px solid #FEE2E2',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
