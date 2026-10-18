import React, { useState } from 'react';
import { 
  TrendingUp, 
  PieChart, 
  Users, 
  DollarSign, 
  ShieldCheck, 
  ArrowUpRight, 
  Sparkles, 
  Target,
  BarChart2,
  Layers
} from 'lucide-react';
import { StartupProfile } from '../../data/defaultData';
import { EvaluationResult } from '../../types';

interface MarketTractionModuleProps {
  startup: StartupProfile;
  evaluation: EvaluationResult;
}

export const MarketTractionModule: React.FC<MarketTractionModuleProps> = ({ startup, evaluation }) => {
  const ml = evaluation.market_landscape;
  const tm = evaluation.traction_metrics;

  const [activeTab, setActiveTab] = useState<'market' | 'traction'>('market');
  const revenuePoints = (tm.historical_revenue_6m && tm.historical_revenue_6m.length > 0)
    ? tm.historical_revenue_6m
    : (startup.id !== 'user_active_startup' ? [28, 33, 37, 42, 46, 50] : []);

  const tamDisplay = startup.tam || (ml.tam !== 'Not defined' ? ml.tam : 'Not Set');
  const samDisplay = startup.sam || (ml.sam !== 'Not defined' ? ml.sam : 'Not Set');
  const somDisplay = startup.som || (ml.som !== 'Not defined' ? ml.som : 'Not Set');

  const tamDesc = startup.category 
    ? `Total addressable universe for ${startup.category}.` 
    : 'Total addressable industry universe.';
  const samDesc = startup.location 
    ? `Serviceable segment reachable across ${startup.location} and expansion regions.` 
    : 'Serviceable geographic and customer segment.';
  const somDesc = startup.targetAsk 
    ? `Realistic 24-36 month target capture funded by ${startup.targetAsk} round.` 
    : 'Initial beachhead target capture.';

  // SVG Line Chart math
  const maxVal = revenuePoints.length > 0 ? Math.max(...revenuePoints) : 100;
  const minVal = revenuePoints.length > 0 ? Math.min(...revenuePoints) : 0;
  const range = maxVal - minVal || 1;
  const chartWidth = 560;
  const chartHeight = 160;
  const stepX = revenuePoints.length > 1 ? chartWidth / (revenuePoints.length - 1) : chartWidth;

  const pointsString = revenuePoints
    .map((val, i) => {
      const x = i * stepX;
      const y = chartHeight - ((val - minVal) / range) * (chartHeight - 40) - 20;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#A855F7',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <TrendingUp size={14} />
            <span>MARKET SCOPE & TRACTION INTELLIGENCE</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.2rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            marginTop: '0.2rem',
          }}>
            Market Vectors & Traction Curves
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            TAM/SAM/SOM concentric modeling, verified competitor vulnerabilities, and 6-month historical MRR expansion.
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'inline-flex',
          backgroundColor: 'var(--bg-secondary)',
          padding: '4px',
          borderRadius: '999px',
          border: '1px solid var(--border-subtle)',
        }}>
          <button
            onClick={() => setActiveTab('market')}
            style={{
              padding: '0.45rem 1.25rem',
              borderRadius: '999px',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              backgroundColor: activeTab === 'market' ? 'var(--color-brand-600)' : 'transparent',
              color: activeTab === 'market' ? '#FFFFFF' : 'var(--text-muted)',
            }}
          >
            Market & TAM
          </button>
          <button
            onClick={() => setActiveTab('traction')}
            style={{
              padding: '0.45rem 1.25rem',
              borderRadius: '999px',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              backgroundColor: activeTab === 'traction' ? '#0891B2' : 'transparent',
              color: activeTab === 'traction' ? '#FFFFFF' : 'var(--text-muted)',
            }}
          >
            Traction Curves
          </button>
        </div>
      </div>

      {/* ── TAB 1: MARKET & TAM ────────────────────────────────────────── */}
      {activeTab === 'market' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Concentric Circle Visual & Stat Grid */}
          <div className="card-elevated" style={{
            borderRadius: '20px',
            padding: '2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
          }}>
            {/* Concentric Circles Visualization */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '260px', height: '260px' }}>
                {/* TAM Outer */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '2px solid rgba(168, 85, 247, 0.4)',
                  backgroundColor: 'rgba(168, 85, 247, 0.08)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingTop: '12px',
                }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#7E22CE' }}>
                    TAM: {tamDisplay}
                  </span>
                </div>

                {/* SAM Middle */}
                <div style={{
                  position: 'absolute',
                  inset: '30px',
                  borderRadius: '50%',
                  border: '2px solid rgba(56, 189, 248, 0.5)',
                  backgroundColor: 'var(--accent-bg-blue)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingTop: '12px',
                }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-brand)' }}>
                    SAM: {samDisplay}
                  </span>
                </div>

                {/* SOM Core */}
                <div style={{
                  position: 'absolute',
                  inset: '65px',
                  borderRadius: '50%',
                  border: '2px solid #10B981',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.18)',
                }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#059669' }}>
                    SOM (CORE)
                  </span>
                  <span style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {somDisplay}
                  </span>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>Beachhead target</span>
                </div>
              </div>
            </div>

            {/* Explanation & Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid rgba(168, 85, 247, 0.2)',
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7E22CE' }}>TOTAL ADDRESSABLE MARKET (TAM)</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>{tamDisplay}</div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {tamDesc}
                </p>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid rgba(37, 99, 235, 0.15)',
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-brand)' }}>SERVICEABLE ADDRESSABLE MARKET (SAM)</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>{samDisplay}</div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {samDesc}
                </p>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669' }}>SERVICEABLE OBTAINABLE MARKET (SOM)</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>{somDisplay}</div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {somDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Competitor Weakness Matrix */}
          <div className="card-elevated" style={{ borderRadius: '20px', padding: '1.75rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
              COMPETITIVE LANDSCAPE & UNFAIR ADVANTAGES
            </div>

            {ml.competitors.length === 0 ? (
              <div style={{
                padding: '2rem 1.5rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '14px',
                border: '1px dashed var(--border-subtle)',
                color: 'var(--text-hint)',
                fontSize: '0.85rem',
              }}>
                No competitors benchmarked yet. Add competitor URLs and defensibility moats in Profile & 1-Pager or upload your deck to analyze market moats.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {ml.competitors.map((comp, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: '14px',
                      padding: '1.25rem',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      {comp.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#EF4444', letterSpacing: '0.05em' }}>
                      COMPETITOR WEAKNESS:
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.5 }}>
                      {comp.weakness}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: TRACTION CURVES ─────────────────────────────────────── */}
      {activeTab === 'traction' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Historical 6-Month Revenue Curve */}
          <div className="card-elevated" style={{ borderRadius: '20px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563EB', letterSpacing: '0.08em' }}>
                  MONTHLY RECURRING REVENUE (₹ LAKHS)
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  6-Month Verified Expansion Trend
                </h3>
              </div>
              <div style={{
                backgroundColor: revenuePoints.length > 0 ? 'var(--accent-bg-emerald)' : 'var(--bg-secondary)',
                color: revenuePoints.length > 0 ? '#10B981' : 'var(--text-hint)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.85rem',
              }}>
                {startup.momGrowth && startup.momGrowth !== '0' 
                  ? `+${startup.momGrowth}% MoM COMPOUND` 
                  : (revenuePoints.length > 0 ? '+18% MoM COMPOUND' : 'Pending MRR Data')}
              </div>
            </div>

            {/* SVG Chart or Empty State */}
            {revenuePoints.length === 0 ? (
              <div style={{
                padding: '3rem 1.5rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px',
                border: '1px dashed var(--border-subtle)',
                color: 'var(--text-hint)',
                fontSize: '0.86rem',
              }}>
                No historical MRR expansion points logged yet. Enter your MRR and growth rate in Profile & 1-Pager to visualize your 6-month growth curve.
              </div>
            ) : (
              <div style={{ width: '100%', overflowX: 'auto', padding: '1rem 0' }}>
                <svg width="100%" height="180" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon 
                    points={`0,${chartHeight} ${pointsString} ${chartWidth},${chartHeight}`} 
                    fill="url(#areaGrad)" 
                  />
                  <polyline 
                    fill="none" 
                    stroke="#06B6D4" 
                    strokeWidth="3.5" 
                    points={pointsString} 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  {revenuePoints.map((val, i) => {
                    const x = i * stepX;
                    const y = chartHeight - ((val - minVal) / range) * (chartHeight - 40) - 20;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
                        <text x={x} y={y - 12} textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontWeight="800">
                          ₹{val}L
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-hint)', marginTop: '0.5rem' }}>
                  <span>Month 1</span>
                  <span>Month 2</span>
                  <span>Month 3</span>
                  <span>Month 4</span>
                  <span>Month 5</span>
                  <span>Current</span>
                </div>
              </div>
            )}
          </div>

          {/* Core Health Metrics Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            <div className="card-elevated" style={{ borderRadius: '16px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>WAITLIST REACH</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-brand)', marginTop: '0.25rem' }}>
                {startup.waitlistCount ? Number(startup.waitlistCount).toLocaleString() : (tm.waitlist_count ? tm.waitlist_count.toLocaleString() : 'Not Set')}
              </div>
              <span style={{ fontSize: '0.72rem', color: tm.waitlist_growth ? '#10B981' : 'var(--text-hint)', fontWeight: 700 }}>
                {tm.waitlist_growth ? `+${tm.waitlist_growth}% MoM` : 'Pending tracking'}
              </span>
            </div>

            <div className="card-elevated" style={{ borderRadius: '16px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>BETA ENTERPRISES</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10B981', marginTop: '0.25rem' }}>
                {startup.userTraction || (tm.beta_users ? `${tm.beta_users} Accounts` : 'Not Set')}
              </div>
              <span style={{ fontSize: '0.72rem', color: tm.beta_conversion_growth ? '#059669' : 'var(--text-hint)', fontWeight: 700 }}>
                {tm.beta_conversion_growth ? `+${tm.beta_conversion_growth}% conversion` : 'Pending tracking'}
              </span>
            </div>

            <div className="card-elevated" style={{ borderRadius: '16px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>NET REVENUE RETENTION</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#D97706', marginTop: '0.25rem' }}>
                {startup.nrr ? `${startup.nrr}%` : (tm.nrr ? `${tm.nrr}%` : 'Not Set')}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: 700 }}>
                {tm.nrr >= 100 ? 'Top decile SaaS' : 'Benchmark > 100%'}
              </span>
            </div>

            <div className="card-elevated" style={{ borderRadius: '16px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>BURN MULTIPLE</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#EC4899', marginTop: '0.25rem' }}>
                {tm.burn_multiple ? `${tm.burn_multiple}x` : 'Not Set'}
              </div>
              <span style={{ fontSize: '0.72rem', color: tm.burn_multiple > 0 ? '#10B981' : 'var(--text-hint)' }}>
                {tm.burn_multiple > 0 ? 'Capital efficient' : 'Pending model'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
