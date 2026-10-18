import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  TrendingUp, 
  Database, 
  Cpu, 
  DollarSign, 
  Rocket, 
  Scale, 
  Users, 
  Info,
  Check,
  ChevronRight,
  Calculator,
} from 'lucide-react';
import { StartupProfile } from '../../data/defaultData';
import { EvaluationResult } from '../../types';

interface DashboardModuleProps {
  startup: StartupProfile;
  evaluation: EvaluationResult;
  streakCount: number;
  isDailyTaskDone: boolean;
  toggleDailyTask: () => void;
  openStreakModal: () => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  startup,
  evaluation,
  streakCount,
  isDailyTaskDone,
  toggleDailyTask,
  openStreakModal,
  setActiveTab,
}) => {
  const [activeIssue, setActiveIssue] = useState<string | null>(null);
  const [resolvedIssues, setResolvedIssues] = useState<number[]>([]);

  const fundabilityScore = Math.min(100, evaluation.overall_score + (isDailyTaskDone ? 2 : 0) + (resolvedIssues.length * 2));
  const investorReadiness = Math.min(100, evaluation.market_score + (isDailyTaskDone ? 2 : 0));
  const fundingProbability = Math.min(100, evaluation.execution_score + (resolvedIssues.length * 2));

  const storedDocCount = (() => {
    try {
      const raw = sessionStorage.getItem('waou_dataroom_docs');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          if (startup.id === 'user_active_startup' && parsed.some((d: any) => d.name?.includes('Seed_Pitch_Deck_V3.pdf'))) {
            return 0;
          }
          return parsed.length;
        }
      }
    } catch {}
    return 0;
  })();

  const toggleResolve = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (resolvedIssues.includes(idx)) {
      setResolvedIssues(resolvedIssues.filter((i) => i !== idx));
    } else {
      setResolvedIssues([...resolvedIssues, idx]);
    }
  };

  const terminals = [
    { id: 'diagnostic', label: 'Deck Diagnostic', icon: FileText, color: '#2563EB', desc: 'Slide vectors' },
    { id: 'grill', label: 'AI Investor Grill', icon: Cpu, color: '#2563EB', desc: 'Call 1 simulation' },
    { id: 'finance', label: 'Financial Command', icon: Calculator, color: '#F59E0B', desc: 'CFO Projections' },
    { id: 'dataroom', label: 'Data Room', icon: Database, color: '#10B981', desc: 'Due diligence' },
    { id: 'market', label: 'Market & TAM', icon: TrendingUp, color: '#8B5CF6', desc: 'Scope & moats' },
    { id: 'gtm', label: 'GTM Strategy', icon: Rocket, color: '#F97316', desc: 'Sprint verify' },
    { id: 'actionplan', label: 'Action Plan', icon: ShieldCheck, color: '#EC4899', desc: 'Fix red flags' },
    { id: 'legaldocs', label: 'Legal Standards', icon: Scale, color: '#6366F1', desc: 'SAFE templates' },
    { id: 'mentors', label: 'Mentor Directory', icon: Users, color: '#14B8A6', desc: '1-on-1 calls' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* ── Top Greeting Header ────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        paddingBottom: '0.5rem',
      }}>
        <div>
          <div style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: 'var(--text-brand)',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <Sparkles size={13} />
            <span>Fundraising Dashboard • {startup.stage.toUpperCase()}</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            marginTop: '0.2rem',
          }}>
            Welcome back, {startup.founder || 'Founder'}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {startup.name || 'Your Venture'} is synchronized with the institutional evaluation matrix.
          </p>
        </div>

        {/* Streak Pill Button */}
        <button
          onClick={openStreakModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '16px',
            background: 'rgba(249, 115, 22, 0.06)',
            border: '1px solid rgba(249, 115, 22, 0.2)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF6B00 0%, #F97316 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Flame size={18} fill="#FFFFFF" color="#FFFFFF" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--text-primary)' }}>{streakCount} Day Streak</div>
            <div style={{ fontSize: '0.7rem', color: '#F97316', fontWeight: 700 }}>ACTIVE MOMENTUM</div>
          </div>
        </button>
      </div>

      {/* ── Main Fundability Score Card ─────────────────────────── */}
      <div className="card-gradient-top" style={{
        padding: '2.5rem',
      }}>
        {/* Subtle gradient ambient */}
        <div style={{
          position: 'absolute',
          top: 4,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.03) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '2rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Circular SVG Gauge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '150px', height: '150px', flexShrink: 0 }}>
              <svg width="150" height="150" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="64" stroke="var(--border-subtle)" strokeWidth="14" fill="transparent" />
                <circle 
                  cx="80" cy="80" r="64" 
                  stroke="url(#dashGrad)" 
                  strokeWidth="14" 
                  fill="transparent" 
                  strokeDasharray={402} 
                  strokeDashoffset={402 - (fundabilityScore / 100) * 402} 
                  strokeLinecap="round" 
                  transform="rotate(-90 80 80)" 
                />
                <defs>
                  <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, fontFamily: 'var(--font-mono)' }}>
                  {fundabilityScore}
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-hint)' }}>/ 100</span>
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--text-brand)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'var(--accent-bg-blue)',
                padding: '4px 10px',
                borderRadius: '8px',
                marginBottom: '0.5rem',
              }}>
                <Sparkles size={12} />
                VC FUNDABILITY SCORE
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {fundabilityScore === 0 ? 'Profile Setup Required' : fundabilityScore >= 85 ? 'Top Quartile Match' : 'Nearing Investor Readiness'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                {fundabilityScore === 0 
                  ? 'Complete your startup profile in the Workspace or upload your pitch deck to calculate your verified score.'
                  : 'Derived from 14 vectors across Team, TAM, CAC payback, and virtual data room completeness.'}
              </p>
            </div>
          </div>

          {/* Sub-Metric Columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
            gap: '1rem',
          }}>
            <div className="stat-card">
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-hint)', letterSpacing: '0.05em' }}>
                INVESTOR READINESS
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-brand)', marginTop: '0.25rem' }}>
                {investorReadiness}%
              </div>
              <span style={{ fontSize: '0.72rem', color: storedDocCount > 0 ? '#10B981' : 'var(--text-hint)', fontWeight: 700 }}>
                {storedDocCount === 0 ? 'Data room empty (0 files)' : `${storedDocCount} document${storedDocCount > 1 ? 's' : ''} uploaded`}
              </span>
            </div>

            <div className="stat-card">
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-hint)', letterSpacing: '0.05em' }}>
                FUNDING PROBABILITY
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10B981', marginTop: '0.25rem' }}>
                {fundingProbability}%
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-hint)' }}>
                Based on current market data
              </span>
            </div>
          </div>
        </div>

        {/* Action Button Footer in Score Card */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <Info size={15} color="var(--text-brand)" />
            <span>
              Target Round: {startup.targetAsk && startup.targetAsk !== 'Not Set' && startup.targetAsk !== '0' && startup.targetAsk !== '₹0'
                ? `${startup.targetAsk}${startup.valuation ? ` @ ${startup.valuation}` : ''}${startup.equityOffered ? ` (${startup.equityOffered} Equity)` : ''}`
                : 'Not configured yet'}
            </span>
          </div>

          <button
            onClick={() => setActiveTab('dataroom')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--accent-bg-blue)',
              border: '1px solid rgba(37, 99, 235, 0.15)',
              color: 'var(--text-brand)',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <span>Run Complete AI Due Diligence Scan</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── System Alerts & Daily AI Directive Two-Column ─────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '1.5rem',
      }}>
        {/* Left: System Alerts & Vulnerabilities */}
        <div className="card-elevated" style={{ borderRadius: 'var(--radius-xl)', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} color="#EF4444" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                System Alerts ({evaluation.red_flags.length})
              </h3>
            </div>
            <span 
              onClick={() => setActiveTab('actionplan')}
              style={{ fontSize: '0.78rem', color: 'var(--text-brand)', fontWeight: 700, cursor: 'pointer' }}
            >
              VIEW ALL →
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {evaluation.red_flags.slice(0, 3).map((flag, idx) => {
              const isResolved = resolvedIssues.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => setActiveIssue(flag)}
                  style={{
                    backgroundColor: isResolved ? 'var(--accent-bg-emerald)' : 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: isResolved ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    opacity: isResolved ? 0.7 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <button
                    onClick={(e) => toggleResolve(idx, e)}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '6px',
                      border: isResolved ? '1px solid #10B981' : '1px solid var(--border-medium)',
                      backgroundColor: isResolved ? '#10B981' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {isResolved && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                  </button>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: isResolved ? '#10B981' : (idx === 0 ? '#EF4444' : '#F59E0B'),
                      letterSpacing: '0.04em',
                    }}>
                      {isResolved ? 'RESOLVED' : (idx === 0 ? 'CRITICAL VULNERABILITY' : 'HIGH SEVERITY')}
                    </div>
                    <div style={{
                      fontSize: '0.84rem',
                      color: 'var(--text-secondary)',
                      marginTop: '2px',
                      lineHeight: 1.4,
                      textDecoration: isResolved ? 'line-through' : 'none',
                    }}>
                      {flag}
                    </div>
                  </div>

                  <ChevronRight size={16} color="var(--text-hint)" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Daily Directive Today */}
        <div className="card-elevated" style={{ borderRadius: 'var(--radius-xl)', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="#10B981" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                Directive: Today
              </h3>
            </div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: isDailyTaskDone ? 'var(--accent-bg-emerald)' : 'var(--accent-bg-amber)',
              color: isDailyTaskDone ? '#10B981' : '#F59E0B',
            }}>
              {isDailyTaskDone ? 'SECURED (+2 PTS)' : 'PENDING ACTION'}
            </span>
          </div>

          <div 
            onClick={toggleDailyTask}
            style={{
              backgroundColor: isDailyTaskDone ? 'var(--accent-bg-emerald)' : 'var(--bg-secondary)',
              borderRadius: '16px',
              padding: '1.25rem',
              border: isDailyTaskDone ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              border: isDailyTaskDone ? '1px solid #10B981' : '2px solid var(--text-brand)',
              backgroundColor: isDailyTaskDone ? '#10B981' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {isDailyTaskDone && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '0.05em' }}>
                HIGH-LEVERAGE SPRINT TASK
              </div>
              <div style={{
                fontSize: '0.92rem',
                fontWeight: 600,
                color: isDailyTaskDone ? '#10B981' : 'var(--text-primary)',
                marginTop: '3px',
                lineHeight: 1.4,
              }}>
                {evaluation.daily_tasks[0] || 'Upload your Pitch Deck in the virtual data room to unlock AI diligence.'}
              </div>
            </div>
          </div>

          {isDailyTaskDone ? (
            <div style={{
              marginTop: '1.25rem',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              backgroundColor: 'var(--accent-bg-emerald)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              fontSize: '0.82rem',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <ShieldCheck size={16} />
              <span>Directive secured. +2 points added to your institutional fundability score!</span>
            </div>
          ) : (
            <div style={{
              marginTop: '1.25rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
            }}>
              Tip: Completing one daily AI-directed optimization reinforces your fundraising momentum and keeps your data room fresh.
            </div>
          )}
        </div>
      </div>

      {/* ── Financial Forecast Banner CTA ───────────────── */}
      <div 
        onClick={() => setActiveTab('finance')}
        style={{
          borderRadius: '18px',
          background: 'linear-gradient(135deg, #FDE68A 0%, #FCD34D 50%, #FBBF24 100%)',
          padding: '1.5rem 2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(251, 191, 36, 0.2)',
          transition: 'transform 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: '#0F172A',
            color: '#FBBF24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Calculator size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', letterSpacing: '0.02em' }}>
              Launch Financial Command & 5-Year Projections
            </div>
            <div style={{ fontSize: '0.82rem', color: '#78350F', fontWeight: 600 }}>
              Adjust headcount burn & ARR sensitivity sliders • Instant Excel / CSV export
            </div>
          </div>
        </div>

        <button
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.85rem',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
          }}
        >
          <span>Calculate Runway</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* ── Modules Grid ───────────────────────────────────────── */}
      <div>
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: 'var(--text-brand)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}>
          Operational Modules
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: '1rem',
        }}>
          {terminals.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="card-elevated"
                style={{
                  borderRadius: '16px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: `${item.color}10`,
                  border: `1px solid ${item.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color,
                  flexShrink: 0,
                }}>
                  <IconComponent size={20} />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {item.desc}
                  </div>
                </div>
                <ChevronRight size={16} color="var(--text-hint)" />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Issue Diagnostic Modal (Light Theme) ─────────────────────── */}
      {activeIssue && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
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
            maxWidth: '540px',
            width: '100%',
            boxShadow: 'var(--shadow-2xl)',
            position: 'relative',
          }}>
            <button
              onClick={() => setActiveIssue(null)}
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
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'var(--accent-bg-rose)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <AlertTriangle size={24} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Critical Vulnerability Diagnostic
            </h3>
            
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {activeIssue}
            </p>

            <div style={{
              backgroundColor: 'var(--accent-bg-blue)',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid rgba(37, 99, 235, 0.1)',
              marginBottom: '1.75rem',
            }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '0.05em' }}>
                RECOMMENDED REMEDIATION
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Address this finding directly in your pitch narrative and virtual data room before sharing links with venture partners.
              </div>
            </div>

            <button
              onClick={() => {
                setActiveIssue(null);
                setActiveTab('actionplan');
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <span>Execute Remediation in Action Plan</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
