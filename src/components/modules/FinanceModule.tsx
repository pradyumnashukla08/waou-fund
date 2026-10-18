import React, { useState } from 'react';
import { 
  Calculator, 
  Download, 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  Sparkles, 
  Users, 
  ArrowRight,
  Info,
  Calendar,
  Layers,
  Send
} from 'lucide-react';
import { StartupProfile } from '../../data/defaultData';
import { EvaluationResult } from '../../types';
import { api } from '../../services/api';

interface FinanceModuleProps {
  startup: StartupProfile;
  evaluation: EvaluationResult;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({ startup, evaluation }) => {
  const fm = evaluation.financial_metrics;

  // Dynamic Scenario Engine Sliders with draft restoration
  const [hires, setHires] = useState(() => {
    try {
      const saved = sessionStorage.getItem('waou_fin_hires');
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });
  const [growthPercent, setGrowthPercent] = useState(() => {
    try {
      const saved = sessionStorage.getItem('waou_fin_growth');
      return saved ? parseInt(saved, 10) : 18;
    } catch {
      return 18;
    }
  });
  const [fundraiseCr, setFundraiseCr] = useState(() => {
    try {
      const saved = sessionStorage.getItem('waou_fin_raise');
      if (saved) return parseInt(saved, 10);
      const raw = parseFloat((startup.targetRaise || '').replace(/[^0-9.]/g, ''));
      if (!isNaN(raw) && raw > 0) {
        const inCr = raw >= 1000000 ? raw / 10000000 : raw;
        return Math.min(Math.max(Math.round(inCr), 1), 20);
      }
      return startup.id === 'user_active_startup' ? 2 : 4;
    } catch {
      return 2;
    }
  });
  const [activeScenario, setActiveScenario] = useState<'base' | 'best' | 'worst'>(() => {
    try {
      return (sessionStorage.getItem('waou_fin_scenario') as any) || 'base';
    } catch {
      return 'base';
    }
  });

  // AI CFO Chat
  const [cfoQuestion, setCfoQuestion] = useState(() => {
    try {
      return sessionStorage.getItem('waou_fin_cfo_q') || '';
    } catch {
      return '';
    }
  });
  const [cfoAnswer, setCfoAnswer] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('waou_fin_cfo_a') || null;
    } catch {
      return null;
    }
  });
  const [isAsking, setIsAsking] = useState(false);

  // Synchronize financial simulation parameters
  React.useEffect(() => {
    try {
      sessionStorage.setItem('waou_fin_hires', String(hires));
      sessionStorage.setItem('waou_fin_growth', String(growthPercent));
      sessionStorage.setItem('waou_fin_raise', String(fundraiseCr));
      sessionStorage.setItem('waou_fin_scenario', activeScenario);
      sessionStorage.setItem('waou_fin_cfo_q', cfoQuestion);
      if (cfoAnswer) sessionStorage.setItem('waou_fin_cfo_a', cfoAnswer);
    } catch {}
  }, [hires, growthPercent, fundraiseCr, activeScenario, cfoQuestion, cfoAnswer]);

  // Calculations
  const fundraiseRaw = fundraiseCr * 10000000;
  const newBurn = fm.monthly_burn + hires * fm.headcount_cost;
  const newCash = fm.cash_balance + fundraiseRaw;
  const newRunwayMonths = newBurn > 0 ? Math.round(newCash / newBurn) : 12;
  const runwayDelta = newRunwayMonths - fm.default_runway;

  const currentArr = fm.arr;
  const multiplier = activeScenario === 'best' ? 1.25 : activeScenario === 'worst' ? 0.75 : 1.0;
  const targetArr = Math.round(currentArr * Math.pow(1 + (growthPercent * multiplier) / 100, 12));

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakhs`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const handleExportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Category,Year 1,Year 2,Year 3,Year 4,Year 5
SaaS Subscriptions,${(600 * multiplier).toFixed(0)},${(1450 * multiplier).toFixed(0)},${(3200 * multiplier).toFixed(0)},${(6800 * multiplier).toFixed(0)},${(12500 * multiplier).toFixed(0)}
Enterprise Integrations,${(150 * multiplier).toFixed(0)},${(420 * multiplier).toFixed(0)},${(980 * multiplier).toFixed(0)},${(2100 * multiplier).toFixed(0)},${(4200 * multiplier).toFixed(0)}
Cloud Infrastructure,${(110 * multiplier).toFixed(0)},${(240 * multiplier).toFixed(0)},${(480 * multiplier).toFixed(0)},${(950 * multiplier).toFixed(0)},${(1650 * multiplier).toFixed(0)}
R&D Engineering,${(280 * multiplier).toFixed(0)},${(580 * multiplier).toFixed(0)},${(1100 * multiplier).toFixed(0)},${(2100 * multiplier).toFixed(0)},${(3600 * multiplier).toFixed(0)}
Sales & Outbound,${(190 * multiplier).toFixed(0)},${(440 * multiplier).toFixed(0)},${(950 * multiplier).toFixed(0)},${(1900 * multiplier).toFixed(0)},${(3200 * multiplier).toFixed(0)}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${(startup.name || 'Startup').replace(/\s+/g, '_')}_5Year_Financial_Model.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAskCfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cfoQuestion.trim()) return;

    setIsAsking(true);
    try {
      const ans = await api.askAI(cfoQuestion, evaluation);
      setCfoAnswer(ans);
    } catch (err: any) {
      setCfoAnswer(`⚠️ ${err.message || 'AI CFO service is currently unavailable. Please try again.'}`);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#D97706',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <Calculator size={14} />
            <span>FINANCIAL COMMAND CENTER • DETERMINISTIC SCENARIO ENGINE</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.2rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            marginTop: '0.2rem',
          }}>
            AI CFO Financial Forecast
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Adjust headcount additions, monthly growth rates, and capital injections to recalculate burn rate and runway in real time.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn-cyan"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.86rem' }}
        >
          <Download size={15} />
          <span>Export 5-Year Model (CSV)</span>
        </button>
      </div>

      {/* ── Key Metrics Cards Row ───────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
      }}>
        <div className="card-elevated" style={{ borderRadius: '16px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>CURRENT CASH BALANCE</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-brand)', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            {formatINR(fm.cash_balance)}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-hint)' }}>
            {fm.cash_balance > 0 ? 'Verified reserves' : 'Not configured'}
          </span>
        </div>

        <div className="card-elevated" style={{ borderRadius: '16px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>RECALCULATED MONTHLY BURN</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#EF4444', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            {formatINR(newBurn)}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#F87171' }}>+{hires} hires @ ₹1.8L/mo</span>
        </div>

        <div className="card-elevated" style={{ borderRadius: '16px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>PROJECTED RUNWAY</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10B981', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            {newRunwayMonths} Months
          </div>
          <span style={{ fontSize: '0.72rem', color: '#34D399' }}>
            {runwayDelta !== 0 ? `${runwayDelta > 0 ? '+' : ''}${runwayDelta} mos with ₹${fundraiseCr}Cr raise` : `Based on ₹${fundraiseCr}Cr model`}
          </span>
        </div>

        <div className="card-elevated" style={{ borderRadius: '16px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>TARGET 12M ARR</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#D97706', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            {formatINR(targetArr)}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: 700 }}>At {growthPercent}% MoM growth</span>
        </div>
      </div>

      {/* ── Interactive Scenario Sliders Area ──────────────────────────── */}
      <div className="card-elevated" style={{
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid rgba(217, 119, 6, 0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Sparkles size={18} color="#D97706" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Live Scenario Parameters & Headcount Modeling
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
        }}>
          {/* Slider 1: Hires */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Engineering & Sales Hires
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-brand)', fontFamily: 'var(--font-mono)' }}>
                +{hires} hires
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="25" 
              value={hires}
              onChange={(e) => setHires(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#38BDF8', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-hint)', marginTop: '4px' }}>
              <span>0 (Freeze)</span>
              <span>12</span>
              <span>25 (Aggressive)</span>
            </div>
          </div>

          {/* Slider 2: Growth % */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Monthly ARR Growth Rate
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#D97706', fontFamily: 'var(--font-mono)' }}>
                +{growthPercent}% MoM
              </span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="40" 
              value={growthPercent}
              onChange={(e) => setGrowthPercent(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#D97706', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-hint)', marginTop: '4px' }}>
              <span>5% (Conservative)</span>
              <span>20%</span>
              <span>40% (Blitzscale)</span>
            </div>
          </div>

          {/* Slider 3: Proposed Raise */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Seed Capital Injection
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                ₹{fundraiseCr} Cr ($500K)
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="25" 
              value={fundraiseCr}
              onChange={(e) => setFundraiseCr(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-hint)', marginTop: '4px' }}>
              <span>₹1 Cr</span>
              <span>₹12 Cr</span>
              <span>₹25 Cr</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5-Year Projections Table ───────────────────────────────────── */}
      <div className="card-elevated" style={{ borderRadius: '20px', padding: '2rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '0.08em' }}>
              5-YEAR MODEL PROJECTIONS (₹ LAKHS)
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Integrated P&L Forecast
            </h3>
          </div>

          {/* Case switchers */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-secondary)',
            padding: '3px',
            borderRadius: '999px',
            border: '1px solid var(--border-subtle)',
          }}>
            {(['worst', 'base', 'best'] as const).map((sc) => (
              <button
                key={sc}
                onClick={() => setActiveScenario(sc)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '999px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  backgroundColor: activeScenario === sc ? '#38BDF8' : 'transparent',
                  color: activeScenario === sc ? '#02040A' : '#94A3B8',
                }}
              >
                {sc} Case
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Line Item</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Year 1</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Year 2</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Year 3</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Year 4</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Year 5</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'var(--text-primary)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>SaaS Recurring ARR</td>
                <td style={{ padding: '0.85rem 1rem' }}>₹{(600 * multiplier).toFixed(0)}L</td>
                <td style={{ padding: '0.85rem 1rem' }}>₹{(1450 * multiplier).toFixed(0)}L</td>
                <td style={{ padding: '0.85rem 1rem' }}>₹{(3200 * multiplier).toFixed(0)}L</td>
                <td style={{ padding: '0.85rem 1rem' }}>₹{(6800 * multiplier).toFixed(0)}L</td>
                <td style={{ padding: '0.85rem 1rem', color: '#10B981', fontWeight: 800 }}>₹{(12500 * multiplier).toFixed(0)}L</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'var(--text-primary)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Enterprise API Contracts</td>
                <td style={{ padding: '0.85rem 1rem' }}>₹{(150 * multiplier).toFixed(0)}L</td>
                <td style={{ padding: '0.85rem 1rem' }}>₹{(420 * multiplier).toFixed(0)}L</td>
                <td style={{ padding: '0.85rem 1rem' }}>₹{(980 * multiplier).toFixed(0)}L</td>
                <td style={{ padding: '0.85rem 1rem' }}>₹{(2100 * multiplier).toFixed(0)}L</td>
                <td style={{ padding: '0.85rem 1rem' }}>₹{(4200 * multiplier).toFixed(0)}L</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#F87171' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Infrastructure & COGS</td>
                <td style={{ padding: '0.85rem 1rem' }}>(₹{(155 * multiplier).toFixed(0)}L)</td>
                <td style={{ padding: '0.85rem 1rem' }}>(₹{(335 * multiplier).toFixed(0)}L)</td>
                <td style={{ padding: '0.85rem 1rem' }}>(₹{(670 * multiplier).toFixed(0)}L)</td>
                <td style={{ padding: '0.85rem 1rem' }}>(₹{(1330 * multiplier).toFixed(0)}L)</td>
                <td style={{ padding: '0.85rem 1rem' }}>(₹{(2330 * multiplier).toFixed(0)}L)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'var(--text-primary)', backgroundColor: 'rgba(56, 189, 248, 0.04)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--text-brand)' }}>Gross Margin %</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>79.3%</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>82.1%</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>84.0%</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>85.1%</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#10B981' }}>86.0%</td>
              </tr>
              <tr style={{ color: 'var(--text-primary)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>R&D & Outbound OpEx</td>
                <td style={{ padding: '0.85rem 1rem' }}>₹{(535 * multiplier).toFixed(0)}L</td>
                <td style={{ padding: '0.85rem 1rem' }}>₹{(1140 * multiplier).toFixed(0)}L</td>
                <td style={{ padding: '0.85rem 1rem' }}>₹{(2260 * multiplier).toFixed(0)}L</td>
                <td style={{ padding: '0.85rem 1rem' }}>₹{(4380 * multiplier).toFixed(0)}L</td>
                <td style={{ padding: '0.85rem 1rem' }}>₹{(7420 * multiplier).toFixed(0)}L</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Ask AI CFO Instant Query Assistant ─────────────────────────── */}
      <div className="card-elevated" style={{ borderRadius: '20px', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={18} color="#2563EB" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Ask AI CFO Co-Pilot
          </h3>
        </div>

        <form onSubmit={handleAskCfo} style={{ display: 'flex', gap: '0.75rem' }}>
          <input 
            type="text"
            value={cfoQuestion}
            onChange={(e) => setCfoQuestion(e.target.value)}
            placeholder="e.g. How does our ₹12L burn compare against Tier-1 Seed SaaS benchmarks?"
            style={{
              flex: 1,
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
            }}
          />
          <button
            type="submit"
            disabled={isAsking || !cfoQuestion.trim()}
            className="btn-cyan"
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.88rem' }}
          >
            {isAsking ? 'Analyzing...' : 'Ask CFO'}
            <Send size={15} />
          </button>
        </form>

        {cfoAnswer && (
          <div style={{
            marginTop: '1.25rem',
            padding: '1.25rem',
            borderRadius: '14px',
            backgroundColor: 'var(--accent-bg-blue)',
            border: '1px solid rgba(37, 99, 235, 0.15)',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
              AI CFO DIRECTIVE:
            </div>
            {cfoAnswer}
          </div>
        )}
      </div>
    </div>
  );
};
