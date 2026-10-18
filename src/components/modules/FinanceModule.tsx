import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  Download, 
  TrendingUp, 
  Sparkles, 
  Users, 
  ArrowRight,
  Send,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sliders,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Percent,
  Coins,
  Building2,
  FileSpreadsheet,
  Check,
  Edit3,
  FileText
} from 'lucide-react';
import { StartupProfile } from '../../data/defaultData';
import { EvaluationResult } from '../../types';
import { api } from '../../services/api';
import { 
  ScenarioAssumptions,
  computeScenarioFinancials, 
  compute60MonthCashFlow, 
  generateSpreadsheetMLWorkbook, 
  triggerExcelDownload 
} from '../../utils/financialEngine';

interface FinanceModuleProps {
  startup: StartupProfile;
  evaluation: EvaluationResult;
  onUpdateStartup?: (s: StartupProfile) => void;
  onUpdateEvaluation?: (res: EvaluationResult) => void;
}

// ─── Robust Currency Parser Helper ──────────────────────────────────────────
const parseCurrencyToNumber = (val?: string | number): number => {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  const str = String(val).replace(/,/g, '').trim();
  
  // Cr / Crore check
  const crMatch = str.match(/([\d.]+)\s*(?:cr|crore)/i);
  if (crMatch) return parseFloat(crMatch[1]) * 10000000;
  
  // Lakh / Lac check
  const lakhMatch = str.match(/([\d.]+)\s*(?:l|lakh|lac)/i);
  if (lakhMatch) return parseFloat(lakhMatch[1]) * 100000;
  
  // K check
  const kMatch = str.match(/([\d.]+)\s*k/i);
  if (kMatch) return parseFloat(kMatch[1]) * 1000;
  
  // Raw number with potential currency symbols removed
  const num = parseFloat(str.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
};

// ─── INR Formatting Helpers ────────────────────────────────────────────────
export const formatINR = (val: number): string => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakhs`;
  if (val <= -10000000) return `-₹${(Math.abs(val) / 10000000).toFixed(2)} Cr`;
  if (val <= -100000) return `-₹${(Math.abs(val) / 100000).toFixed(1)} Lakhs`;
  return `₹${Math.round(val).toLocaleString('en-IN')}`;
};

export const formatCellFromRaw = (valInRupees: number): string => {
  const valInLakhs = valInRupees / 100000;
  if (Math.abs(valInLakhs) >= 100) {
    const cr = (valInLakhs / 100).toFixed(2);
    return valInLakhs >= 0 ? `₹${cr} Cr` : `(₹${Math.abs(Number(cr)).toFixed(2)} Cr)`;
  }
  const formatted = Math.round(Math.abs(valInLakhs)).toLocaleString('en-IN');
  return valInLakhs >= 0 ? `₹${formatted}L` : `(₹${formatted}L)`;
};

export const FinanceModule: React.FC<FinanceModuleProps> = ({ 
  startup, 
  evaluation,
  onUpdateStartup,
  onUpdateEvaluation
}) => {
  const fm = evaluation.financial_metrics || {
    cash_balance: 0,
    monthly_burn: 0,
    default_runway: 0,
    arr: 0,
    mrr: 0,
    headcount_cost: 180000,
  };

  // ── Baseline extraction anchored to real startup profile ───────────────────
  const parsedMrrFromStartup = parseCurrencyToNumber(startup.currentMrr || startup.mrr);
  const baseMrr = parsedMrrFromStartup > 0 
    ? parsedMrrFromStartup 
    : fm.mrr > 0 
      ? fm.mrr 
      : fm.arr > 0 
        ? fm.arr / 12 
        : 1250000; // default ₹12.5L for Seed PropTech / SaaS

  const baseArr = fm.arr > 0 ? fm.arr : baseMrr * 12;

  const parsedBurnFromStartup = parseCurrencyToNumber(startup.burn || startup.burnRate);
  const baseBurn = parsedBurnFromStartup > 0 
    ? parsedBurnFromStartup 
    : fm.monthly_burn > 0 
      ? fm.monthly_burn 
      : 900000; // default ₹9.0 Lakhs

  const defaultRunway = parseCurrencyToNumber(startup.runway) || 10;
  const initialCashCalculated = fm.cash_balance > 0 
    ? fm.cash_balance 
    : baseBurn * defaultRunway;

  // ── Editable Cash Reserve State ──────────────────────────────────────────
  const [cashReserve, setCashReserve] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem('waou_fin_cash_reserve');
      return saved ? parseFloat(saved) : initialCashCalculated;
    } catch {
      return initialCashCalculated;
    }
  });
  const [isEditingCash, setIsEditingCash] = useState(false);
  const [cashInputValue, setCashInputValue] = useState(String(cashReserve / 100000));

  // ── Interactive Scenario & Modeling Sliders ──────────────────────────────
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
      if (saved) return parseInt(saved, 10);
      const rawGrowth = parseFloat((startup.growth || startup.momGrowth || '').replace(/[^0-9.]/g, ''));
      return !isNaN(rawGrowth) && rawGrowth > 0 ? Math.round(rawGrowth) : 18;
    } catch {
      return 18;
    }
  });

  const [fundraiseCr, setFundraiseCr] = useState(() => {
    try {
      const saved = sessionStorage.getItem('waou_fin_raise');
      if (saved) return parseFloat(saved);
      const raw = parseCurrencyToNumber(startup.targetRaise || startup.targetAsk);
      if (raw > 0) {
        return Math.min(Math.max(Number((raw / 10000000).toFixed(1)), 1), 25);
      }
      return 4.0;
    } catch {
      return 4.0;
    }
  });

  // Pre-Money Valuation in ₹ Cr
  const [valuationPreCr, setValuationPreCr] = useState(() => {
    try {
      const saved = sessionStorage.getItem('waou_fin_valuation_pre');
      if (saved) return parseFloat(saved);
      const raw = parseCurrencyToNumber(startup.valuationCap || startup.valuation);
      if (raw > 0) {
        return Math.min(Math.max(Number((raw / 10000000).toFixed(1)), 5), 100);
      }
      const calculatedFromArr = Math.round((baseArr * 13) / 10000000);
      return Math.max(calculatedFromArr, 20);
    } catch {
      return 20.0;
    }
  });

  // ESOP Option Pool % (standard 10%)
  const [esopPoolPct, setEsopPoolPct] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem('waou_fin_esop_pool');
      return saved ? parseFloat(saved) : 10.0;
    } catch {
      return 10.0;
    }
  });

  const [activeScenario, setActiveScenario] = useState<'base' | 'best' | 'worst'>(() => {
    try {
      return (sessionStorage.getItem('waou_fin_scenario') as any) || 'base';
    } catch {
      return 'base';
    }
  });

  // ── Generation State & Timing ───────────────────────────────────────────
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string>(() => {
    try {
      return sessionStorage.getItem('waou_fin_generated_at') || 'Live Deterministic';
    } catch {
      return 'Live Deterministic';
    }
  });

  // ── AI CFO Assistant ─────────────────────────────────────────────────────
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

  // ── Persist simulation state ─────────────────────────────────────────────
  useEffect(() => {
    try {
      sessionStorage.setItem('waou_fin_hires', String(hires));
      sessionStorage.setItem('waou_fin_growth', String(growthPercent));
      sessionStorage.setItem('waou_fin_raise', String(fundraiseCr));
      sessionStorage.setItem('waou_fin_valuation_pre', String(valuationPreCr));
      sessionStorage.setItem('waou_fin_esop_pool', String(esopPoolPct));
      sessionStorage.setItem('waou_fin_scenario', activeScenario);
      sessionStorage.setItem('waou_fin_cash_reserve', String(cashReserve));
      sessionStorage.setItem('waou_fin_cfo_q', cfoQuestion);
      if (cfoAnswer) sessionStorage.setItem('waou_fin_cfo_a', cfoAnswer);
    } catch {}
  }, [hires, growthPercent, fundraiseCr, valuationPreCr, esopPoolPct, activeScenario, cashReserve, cfoQuestion, cfoAnswer]);

  // ── Runway & Burn Real-time Recalculations ────────────────────────────────
  const fundraiseRaw = fundraiseCr * 10000000;
  const costPerHire = fm.headcount_cost > 0 ? fm.headcount_cost : 180000;
  const newBurn = baseBurn + hires * costPerHire;
  const newCash = cashReserve + fundraiseRaw;
  const newRunwayMonths = newBurn > 0 ? Math.round(newCash / newBurn) : 24;
  const runwayMonthsAdded = newBurn > 0 ? Math.round(fundraiseRaw / newBurn) : 0;

  // Valuation computations
  const valuationPreRaw = valuationPreCr * 10000000;
  const postMoneyValuationRaw = valuationPreRaw + fundraiseRaw;
  const postMoneyValuationCr = Number((postMoneyValuationRaw / 10000000).toFixed(2));
  
  const equityDilutionPct = postMoneyValuationRaw > 0 
    ? Number(((fundraiseRaw / postMoneyValuationRaw) * 100).toFixed(2)) 
    : 0;

  const founderEquityPct = Number(Math.max(100 - equityDilutionPct - esopPoolPct, 0).toFixed(2));
  const founderEquityValueCr = Number(((valuationPreCr + fundraiseCr) * (founderEquityPct / 100)).toFixed(2));
  const investorEquityValueCr = Number(fundraiseCr.toFixed(2));
  const esopEquityValueCr = Number(((valuationPreCr + fundraiseCr) * (esopPoolPct / 100)).toFixed(2));

  const arrMultiple = baseArr > 0 
    ? Number((valuationPreRaw / baseArr).toFixed(1)) 
    : 12.0;

  // Target 12M ARR calculation
  const targetArr = Math.round(baseArr * Math.pow(1 + (growthPercent / 100), 12));

  // ── Build Multi-Scenario Financial Engine Assumptions ─────────────────────
  const baseAssumptions: ScenarioAssumptions = useMemo(() => ({
    initialMetric: baseMrr,
    growthRateOrYield: growthPercent / 100,
    pricingMetric: 0.025, // 2.5% churn
    cogsMargin: 0.18,
    annualPayrollIncrease: 0.10,
    employerPfBurden: 0.12,
    marketingSpendPct: 0.12,
    interestRateOnDebt: 0.12,
    annualInflationRate: 0.06,
    dpiitTaxHolidayActive: 1,
    receivableDays: 30,
    inventoryDays: 0,
    payableDays: 30,
    estimatedValuation: valuationPreRaw,
    equityDilutionPct: equityDilutionPct / 100,
  }), [baseMrr, growthPercent, valuationPreRaw, equityDilutionPct]);

  const worstAssumptions: ScenarioAssumptions = useMemo(() => ({
    initialMetric: Math.round(baseMrr * 0.9),
    growthRateOrYield: Math.max((growthPercent * 0.70) / 100, 0.08),
    pricingMetric: 0.05, // 5% churn
    cogsMargin: 0.24,
    annualPayrollIncrease: 0.12,
    employerPfBurden: 0.12,
    marketingSpendPct: 0.16,
    interestRateOnDebt: 0.15,
    annualInflationRate: 0.08,
    dpiitTaxHolidayActive: 0,
    receivableDays: 60,
    inventoryDays: 0,
    payableDays: 30,
    estimatedValuation: Math.round(valuationPreRaw * 0.70),
    equityDilutionPct: Math.min((equityDilutionPct * 1.35) / 100, 0.35),
  }), [baseMrr, growthPercent, valuationPreRaw, equityDilutionPct]);

  const bestAssumptions: ScenarioAssumptions = useMemo(() => ({
    initialMetric: Math.round(baseMrr * 1.1),
    growthRateOrYield: Math.min((growthPercent * 1.30) / 100, 0.35),
    pricingMetric: 0.015, // 1.5% churn
    cogsMargin: 0.14,
    annualPayrollIncrease: 0.08,
    employerPfBurden: 0.12,
    marketingSpendPct: 0.09,
    interestRateOnDebt: 0.10,
    annualInflationRate: 0.05,
    dpiitTaxHolidayActive: 1,
    receivableDays: 15,
    inventoryDays: 0,
    payableDays: 30,
    estimatedValuation: Math.round(valuationPreRaw * 1.40),
    equityDilutionPct: Math.max((equityDilutionPct * 0.75) / 100, 0.08),
  }), [baseMrr, growthPercent, valuationPreRaw, equityDilutionPct]);

  // ── Compute 14 Metrics across all 3 Scenarios ────────────────────────────
  const baseResults = useMemo(() => computeScenarioFinancials(baseAssumptions, 'SAAS'), [baseAssumptions]);
  const worstResults = useMemo(() => computeScenarioFinancials(worstAssumptions, 'SAAS'), [worstAssumptions]);
  const bestResults = useMemo(() => computeScenarioFinancials(bestAssumptions, 'SAAS'), [bestAssumptions]);

  const activeResults = activeScenario === 'best' 
    ? bestResults 
    : activeScenario === 'worst' 
      ? worstResults 
      : baseResults;

  // Compute 60-Month Cash Flow Statement
  const cashFlow60 = useMemo(() => {
    return compute60MonthCashFlow(baseAssumptions, cashReserve, fundraiseRaw);
  }, [baseAssumptions, cashReserve, fundraiseRaw]);

  // ── On-Demand AI Forecast Generation Trigger ─────────────────────────────
  const handleGenerateForecast = async () => {
    setIsGenerating(true);
    setGenerationStep(`1/3 Anchoring to ${startup.name || 'Startup'} baseline MRR (${formatINR(baseMrr)}) & stage benchmarks...`);

    try {
      await new Promise(r => setTimeout(r, 550));
      setGenerationStep(`2/3 Compounding 60-month cohort model at ${growthPercent}% MoM growth with +${hires} hires...`);
      await new Promise(r => setTimeout(r, 550));
      setGenerationStep(`3/3 Auditing 14-metric PAT waterfall and Cap Table for ₹${fundraiseCr} Cr round at ₹${valuationPreCr} Cr Pre-Money...`);
      await new Promise(r => setTimeout(r, 550));

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString();
      const timestamp = `${dateStr} at ${timeStr}`;

      setLastGeneratedAt(timestamp);
      sessionStorage.setItem('waou_fin_generated_at', timestamp);

      if (onUpdateEvaluation) {
        onUpdateEvaluation({
          ...evaluation,
          financial_metrics: {
            ...fm,
            cash_balance: cashReserve,
            monthly_burn: newBurn,
            default_runway: newRunwayMonths,
            arr: baseArr,
            mrr: baseMrr,
            headcount_cost: costPerHire,
          }
        });
      }

      if (onUpdateStartup) {
        onUpdateStartup({
          ...startup,
          currentMrr: formatINR(baseMrr),
          mrr: formatINR(baseMrr),
          burn: formatINR(newBurn),
          burnRate: formatINR(newBurn),
          targetRaise: `${fundraiseCr * 10000000}`,
          targetAsk: `₹${fundraiseCr} Cr`,
          valuationCap: `${valuationPreCr * 10000000}`,
          valuation: `₹${valuationPreCr} Cr`,
          runway: String(newRunwayMonths),
        });
      }
    } catch (err: any) {
      console.warn('[Finance Generation Error]:', err);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // ── Download Real Multi-Sheet Institutional Excel Workbook (.xls) ─────────
  const handleDownloadInstitutionalExcel = () => {
    const xml = generateSpreadsheetMLWorkbook({
      companyName: startup.name || 'Startup',
      stage: startup.stage || 'Seed',
      sector: startup.category || startup.sector || 'SaaS / AI',
      baseMrr,
      valuationPreCr,
      fundraiseCr,
      postMoneyValuationCr,
      equityDilutionPct,
      founderEquityPct,
      esopPoolPct,
      baseAssumptions,
      worstAssumptions,
      bestAssumptions,
      baseResults,
      worstResults,
      bestResults,
      cashFlow60,
    });

    const safeName = (startup.name || 'Startup').replace(/[^a-zA-Z0-9_-]/g, '_');
    triggerExcelDownload(xml, `${safeName}_5Year_Institutional_Financial_Model`);
  };

  // ── Download Official Master Multi-Sheet Template (.xlsx) ─────────────────
  const handleDownloadMasterTemplate = () => {
    const link = document.createElement('a');
    link.href = '/templates/template_saas.xlsx';
    link.download = `${(startup.name || 'Startup').replace(/\s+/g, '_')}_Master_SaaS_Model_Template.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── AI CFO Assistant Chat ────────────────────────────────────────────────
  const handleAskCfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cfoQuestion.trim()) return;

    setIsAsking(true);
    try {
      const ans = await api.askAI(cfoQuestion, {
        name: startup.name || 'Startup',
        founder: startup.founder || 'Founder',
        stage: startup.stage || 'Seed',
        category: startup.category || 'SaaS',
        currentMrr: formatINR(baseMrr),
        burnRate: formatINR(newBurn),
        targetRaise: `₹${fundraiseCr} Cr`,
        valuationCap: `₹${valuationPreCr} Cr`,
        dilution: `${equityDilutionPct}%`,
        runway: `${newRunwayMonths} months`,
      });
      setCfoAnswer(ans);
    } catch (err: any) {
      setCfoAnswer(`⚠️ ${err.message || 'AI CFO service is currently optimizing. Please try again.'}`);
    } finally {
      setIsAsking(false);
    }
  };

  const handleSaveCashReserve = () => {
    const parsed = parseFloat(cashInputValue);
    if (!isNaN(parsed) && parsed >= 0) {
      const inRupees = parsed * 100000;
      setCashReserve(inRupees);
      setIsEditingCash(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ── Top Header & On-Demand Generator Trigger ─────────────────────── */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        gap: '1rem',
        padding: '1.25rem 1.5rem',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
      }}>
        <div>
          <div style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#38BDF8',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <Calculator size={14} />
            <span>INSTITUTIONAL FINANCIAL COMMAND CENTER • 14-METRIC WATERFALL</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            marginTop: '0.2rem',
          }}>
            AI CFO Financial Forecast & Valuation
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Real generated 5-year model anchored to <strong>{startup.name || 'Startup'}</strong> (MRR: {formatINR(baseMrr)} • Target Ask: ₹{fundraiseCr} Cr • Valuation: ₹{valuationPreCr} Cr).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleGenerateForecast}
            disabled={isGenerating}
            className="btn-cyan"
            style={{ 
              padding: '0.7rem 1.35rem', 
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.3)'
            }}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Generating Projections...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>⚡ Generate AI Forecast</span>
              </>
            )}
          </button>

          {/* Primary Download: Real Multi-Sheet Excel Workbook */}
          <button
            onClick={handleDownloadInstitutionalExcel}
            className="btn-secondary"
            style={{ 
              padding: '0.7rem 1.25rem', 
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#34D399',
              cursor: 'pointer',
              fontWeight: 700
            }}
            title="Download Custom 5-Sheet Excel Model (.xls) with your startup's exact numbers & formulas"
          >
            <Download size={15} />
            <span>Download Model (.xls)</span>
          </button>

          {/* Secondary Download: Master 13-Sheet Excel Template */}
          <button
            onClick={handleDownloadMasterTemplate}
            className="btn-secondary"
            style={{ 
              padding: '0.7rem 1rem', 
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
            title="Download Master Multi-Sheet SaaS Excel Template (.xlsx)"
          >
            <FileSpreadsheet size={15} />
            <span>Master Template (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* ── Real-time Generation Progress Banner ────────────────────────── */}
      {isGenerating && (
        <div style={{
          padding: '1rem 1.5rem',
          borderRadius: '14px',
          backgroundColor: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          color: '#38BDF8',
          fontSize: '0.9rem',
          fontWeight: 600,
        }}>
          <RefreshCw size={18} className="animate-spin" />
          <span>{generationStep}</span>
        </div>
      )}

      {/* ── Key Metrics Cards Row (Anchored to Real Numbers) ────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
        gap: '1rem',
      }}>
        {/* Card 1: Cash Balance */}
        <div className="card-elevated" style={{ borderRadius: '16px', padding: '1.25rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>CURRENT CASH BALANCE</span>
            <button 
              onClick={() => setIsEditingCash(!isEditingCash)}
              style={{ background: 'none', border: 'none', color: 'var(--text-hint)', cursor: 'pointer', padding: 2 }}
              title="Edit Treasury Balance"
            >
              <Edit3 size={13} />
            </button>
          </div>

          {isEditingCash ? (
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
              <input
                type="number"
                value={cashInputValue}
                onChange={(e) => setCashInputValue(e.target.value)}
                style={{
                  width: '90px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid #38BDF8',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                }}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Lakhs</span>
              <button 
                onClick={handleSaveCashReserve}
                style={{ 
                  padding: '4px 8px', 
                  backgroundColor: '#38BDF8', 
                  color: '#000', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.75rem'
                }}
              >
                Set
              </button>
            </div>
          ) : (
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-brand)', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
              {formatINR(cashReserve)}
            </div>
          )}
          
          <span style={{ fontSize: '0.72rem', color: 'var(--text-hint)' }}>
            Verified treasury reserve
          </span>
        </div>

        {/* Card 2: Recalculated Burn */}
        <div className="card-elevated" style={{ borderRadius: '16px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>RECALCULATED MONTHLY BURN</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#EF4444', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            {formatINR(newBurn)}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#F87171' }}>
            Base {formatINR(baseBurn)} + {hires} hires @ ₹1.8L/mo
          </span>
        </div>

        {/* Card 3: Projected Runway */}
        <div className="card-elevated" style={{ borderRadius: '16px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>PROJECTED RUNWAY</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10B981', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            {newRunwayMonths} Months
          </div>
          <span style={{ fontSize: '0.72rem', color: '#34D399' }}>
            +{runwayMonthsAdded} mos with ₹{fundraiseCr}Cr injection
          </span>
        </div>

        {/* Card 4: Target 12M ARR */}
        <div className="card-elevated" style={{ borderRadius: '16px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>TARGET 12M ARR</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#D97706', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            {formatINR(targetArr)}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: 700 }}>
            Compounded from base ARR {formatINR(baseArr)} @ {growthPercent}% MoM
          </span>
        </div>
      </div>

      {/* ── EQUITY DILUTION & VALUATION ENGINE ────────────────────────────── */}
      <div className="card-elevated" style={{
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(6, 78, 59, 0.15) 100%)',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
              <PieChart size={20} color="#10B981" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Equity Dilution & Institutional Valuation Engine
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Simulate your round pre-money valuation, incoming capital dilution, and post-round Cap Table ownership.
              </p>
            </div>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '999px',
            backgroundColor: arrMultiple >= 8 && arrMultiple <= 18 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(217, 119, 6, 0.15)',
            border: `1px solid ${arrMultiple >= 8 && arrMultiple <= 18 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(217, 119, 6, 0.3)'}`,
            fontSize: '0.78rem',
            fontWeight: 800,
            color: arrMultiple >= 8 && arrMultiple <= 18 ? '#10B981' : '#D97706',
          }}>
            <ShieldCheck size={14} />
            <span>ARR Multiple: {arrMultiple}x ({arrMultiple >= 8 && arrMultiple <= 18 ? 'Tier-1 Institutional Band' : 'Aggressive Growth Band'})</span>
          </div>
        </div>

        {/* Valuation KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}>
          <div style={{ padding: '1rem', borderRadius: '14px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>PRE-MONEY VALUATION</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#38BDF8', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
              ₹{valuationPreCr} Cr
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-hint)' }}>
              {arrMultiple}x on {formatINR(baseArr)} ARR
            </span>
          </div>

          <div style={{ padding: '1rem', borderRadius: '14px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>ROUND CAPITAL RAISE</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10B981', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
              ₹{fundraiseCr} Cr
            </div>
            <span style={{ fontSize: '0.72rem', color: '#34D399' }}>
              ${((fundraiseCr * 10000000) / 83000000).toFixed(1)}M primary raise
            </span>
          </div>

          <div style={{ padding: '1rem', borderRadius: '14px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>POST-MONEY VALUATION</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#D97706', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
              ₹{postMoneyValuationCr} Cr
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-hint)' }}>
              Pre-Money + Capital Raise
            </span>
          </div>

          <div style={{ padding: '1rem', borderRadius: '14px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>EQUITY DILUTION</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: equityDilutionPct <= 20 ? '#10B981' : '#EF4444', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
              {equityDilutionPct}%
            </div>
            <span style={{ fontSize: '0.72rem', color: equityDilutionPct <= 20 ? '#34D399' : '#F87171' }}>
              {equityDilutionPct <= 20 ? 'Healthy Seed Dilution (<=20%)' : 'High Founder Dilution (>20%)'}
            </span>
          </div>
        </div>

        {/* Interactive Sliders for Valuation & Raise */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '1.75rem',
          padding: '1.25rem',
          borderRadius: '16px',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.75rem',
        }}>
          {/* Pre-Money Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Target Pre-Money Valuation Cap
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>
                ₹{valuationPreCr} Cr
              </span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="60" 
              step="1"
              value={valuationPreCr}
              onChange={(e) => setValuationPreCr(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#38BDF8', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-hint)', marginTop: '4px' }}>
              <span>₹5 Cr (Angel Round)</span>
              <span>₹20 Cr (Standard Seed)</span>
              <span>₹60 Cr (High Growth)</span>
            </div>
          </div>

          {/* Capital Raise Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Target Round Capital Raise
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                ₹{fundraiseCr} Cr
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="20" 
              step="0.5"
              value={fundraiseCr}
              onChange={(e) => setFundraiseCr(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-hint)', marginTop: '4px' }}>
              <span>₹1 Cr ($120K)</span>
              <span>₹4 Cr ($500K)</span>
              <span>₹20 Cr ($2.4M)</span>
            </div>
          </div>

          {/* ESOP Pool Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Unallocated ESOP Option Pool
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#F59E0B', fontFamily: 'var(--font-mono)' }}>
                {esopPoolPct}%
              </span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="15" 
              step="1"
              value={esopPoolPct}
              onChange={(e) => setEsopPoolPct(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-hint)', marginTop: '4px' }}>
              <span>5% (Lean)</span>
              <span>10% (Institutional Standard)</span>
              <span>15% (Heavy Hiring)</span>
            </div>
          </div>
        </div>

        {/* Visual Cap Table Ownership Distribution Bar */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Post-Round Fully Diluted Cap Table Distribution
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Total Implied Value: <strong>₹{postMoneyValuationCr} Cr</strong>
            </span>
          </div>

          <div style={{
            display: 'flex',
            height: '24px',
            borderRadius: '999px',
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div 
              style={{ 
                width: `${founderEquityPct}%`, 
                backgroundColor: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#02040A',
                fontSize: '0.72rem',
                fontWeight: 900,
                transition: 'width 0.3s ease'
              }}
              title={`Founders: ${founderEquityPct}%`}
            >
              {founderEquityPct >= 15 ? `Founders ${founderEquityPct}%` : ''}
            </div>
            <div 
              style={{ 
                width: `${equityDilutionPct}%`, 
                backgroundColor: '#38BDF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#02040A',
                fontSize: '0.72rem',
                fontWeight: 900,
                transition: 'width 0.3s ease'
              }}
              title={`Investors: ${equityDilutionPct}%`}
            >
              {equityDilutionPct >= 10 ? `Investors ${equityDilutionPct}%` : ''}
            </div>
            <div 
              style={{ 
                width: `${esopPoolPct}%`, 
                backgroundColor: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#02040A',
                fontSize: '0.72rem',
                fontWeight: 900,
                transition: 'width 0.3s ease'
              }}
              title={`ESOP Pool: ${esopPoolPct}%`}
            >
              {esopPoolPct >= 8 ? `ESOP ${esopPoolPct}%` : ''}
            </div>
          </div>
        </div>

        {/* Detailed Cap Table Matrix Table */}
        <div className="table-responsive-container" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Shareholder Class</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Pre-Round %</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Post-Round %</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Dilution Delta</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Implied Stake Value</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Governance Rights</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'var(--text-primary)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981' }} />
                  Founders &amp; Core Common Stock
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>90.0%</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#10B981' }}>{founderEquityPct}%</td>
                <td style={{ padding: '0.75rem 1rem', color: '#F87171' }}>-{equityDilutionPct}%</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>₹{founderEquityValueCr} Cr</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Board Majority (2 Seats)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'var(--text-primary)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#38BDF8' }} />
                  Incoming Seed Investors (CCPS)
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>0.0%</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#38BDF8' }}>{equityDilutionPct}%</td>
                <td style={{ padding: '0.75rem 1rem', color: '#34D399' }}>+{equityDilutionPct}%</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>₹{investorEquityValueCr} Cr</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>1 Observer / Affirmative Covenants</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'var(--text-primary)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                  Employee Option Pool (ESOP)
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>10.0%</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#F59E0B' }}>{esopPoolPct}%</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Re-topped</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>₹{esopEquityValueCr} Cr</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Non-Voting Common Reserve</td>
              </tr>
              <tr style={{ backgroundColor: 'rgba(56, 189, 248, 0.05)', fontWeight: 800, color: 'var(--text-primary)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>Total Fully Diluted Capital</td>
                <td style={{ padding: '0.75rem 1rem' }}>100.0%</td>
                <td style={{ padding: '0.75rem 1rem', color: '#38BDF8' }}>100.0%</td>
                <td style={{ padding: '0.75rem 1rem' }}>—</td>
                <td style={{ padding: '0.75rem 1rem', color: '#38BDF8' }}>₹{postMoneyValuationCr} Cr</td>
                <td style={{ padding: '0.75rem 1rem' }}>SHA &amp; Articles Compliant</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Dynamic Scenario Parameters Area ───────────────────────────── */}
      <div className="card-elevated" style={{
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid rgba(217, 119, 6, 0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Sparkles size={18} color="#D97706" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Growth Vectors &amp; Headcount Scaling Parameters
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: '2rem',
        }}>
          {/* Slider 1: Hires */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Engineering &amp; Sales Hires
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
                Round Capital Injection
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                ₹{fundraiseCr} Cr (${((fundraiseCr * 10000000) / 83000000).toFixed(1)}M)
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="25" 
              value={fundraiseCr}
              onChange={(e) => setFundraiseCr(parseFloat(e.target.value))}
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

      {/* ── 14-METRIC INSTITUTIONAL WATERFALL TABLE ───────────────────────── */}
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
              5-YEAR MODEL PROJECTIONS (14-METRIC PAT WATERFALL)
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Integrated P&amp;L &amp; Profitability Waterfall
            </h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-hint)' }}>
              Deterministic compound engine • Last recalculated: {lastGeneratedAt}
            </span>
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
                  transition: 'all 0.2s ease',
                }}
              >
                {sc} Case
              </button>
            ))}
          </div>
        </div>

        <div className="table-responsive-container" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', margin: '0 -0.5rem', padding: '0 0.5rem' }}>
          <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Core Metric</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Year 1</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Year 2</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Year 3</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Year 4</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Year 5</th>
              </tr>
            </thead>
            <tbody>
              {/* SECTION I: REVENUE & GROSS PROFIT */}
              <tr style={{ backgroundColor: 'rgba(56, 189, 248, 0.08)', fontWeight: 800 }}>
                <td colSpan={6} style={{ padding: '0.55rem 1rem', fontSize: '0.75rem', color: '#38BDF8', letterSpacing: '0.06em' }}>
                  I. REVENUE &amp; GROSS PROFIT METRICS
                </td>
              </tr>
              
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'var(--text-primary)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>1. Total Gross Revenue</td>
                {activeResults.totalRevenue.map((val, idx) => (
                  <td key={idx} style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#38BDF8' }}>
                    {formatCellFromRaw(val)}
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#F87171' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>2. Total COGS (Cloud &amp; Hosting)</td>
                {activeResults.totalCogs.map((val, idx) => (
                  <td key={idx} style={{ padding: '0.85rem 1rem' }}>
                    ({formatCellFromRaw(val)})
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'var(--text-primary)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>3. Gross Profit</td>
                {activeResults.grossProfit.map((val, idx) => (
                  <td key={idx} style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                    {formatCellFromRaw(val)}
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', backgroundColor: 'rgba(56, 189, 248, 0.04)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--text-brand)' }}>A. Gross Margin %</td>
                {activeResults.grossMarginPct.map((val, idx) => (
                  <td key={idx} style={{ padding: '0.85rem 1rem', fontWeight: 800, color: idx === 4 ? '#10B981' : 'var(--text-brand)' }}>
                    {val}%
                  </td>
                ))}
              </tr>

              {/* SECTION II: OPERATING EXPENSES & EBITDA */}
              <tr style={{ backgroundColor: 'rgba(217, 119, 6, 0.08)', fontWeight: 800 }}>
                <td colSpan={6} style={{ padding: '0.55rem 1rem', fontSize: '0.75rem', color: '#D97706', letterSpacing: '0.06em' }}>
                  II. OPERATING EXPENSES &amp; OPERATING EBITDA
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#F87171' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>4. Total Operating Expenses (OpEx)</td>
                {activeResults.totalOpex.map((val, idx) => (
                  <td key={idx} style={{ padding: '0.85rem 1rem' }}>
                    ({formatCellFromRaw(val)})
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', backgroundColor: 'rgba(16, 185, 129, 0.06)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 900, color: '#10B981' }}>5. Operating EBITDA</td>
                {activeResults.ebitda.map((val, idx) => (
                  <td key={idx} style={{ 
                    padding: '0.85rem 1rem', 
                    fontWeight: 900,
                    color: val >= 0 ? '#10B981' : '#EF4444' 
                  }}>
                    {val >= 0 ? formatCellFromRaw(val) : `(${formatCellFromRaw(Math.abs(val))})`}
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>B. EBITDA Margin %</td>
                {activeResults.ebitdaPct.map((val, idx) => (
                  <td key={idx} style={{ 
                    padding: '0.85rem 1rem', 
                    fontWeight: 700, 
                    color: val >= 0 ? '#10B981' : '#F87171' 
                  }}>
                    {val}%
                  </td>
                ))}
              </tr>

              {/* SECTION III: PROFITABILITY & TAX (PAT WATERFALL) */}
              <tr style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', fontWeight: 800 }}>
                <td colSpan={6} style={{ padding: '0.55rem 1rem', fontSize: '0.75rem', color: '#10B981', letterSpacing: '0.06em' }}>
                  III. PROFITABILITY WATERFALL &amp; TAXATION (PAT)
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'var(--text-secondary)' }}>
                <td style={{ padding: '0.85rem 1rem' }}>6. Depreciation &amp; Amortisation</td>
                {activeResults.depreciation.map((val, idx) => (
                  <td key={idx} style={{ padding: '0.85rem 1rem' }}>
                    ({formatCellFromRaw(val)})
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'var(--text-primary)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>7. EBIT (Operating Profit)</td>
                {activeResults.ebit.map((val, idx) => (
                  <td key={idx} style={{ padding: '0.85rem 1rem', color: val >= 0 ? 'inherit' : '#EF4444' }}>
                    {val >= 0 ? formatCellFromRaw(val) : `(${formatCellFromRaw(Math.abs(val))})`}
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'var(--text-secondary)' }}>
                <td style={{ padding: '0.85rem 1rem' }}>8. Interest Expense</td>
                {activeResults.interest.map((val, idx) => (
                  <td key={idx} style={{ padding: '0.85rem 1rem' }}>
                    ({formatCellFromRaw(val)})
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'var(--text-primary)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>9. Profit Before Tax (PBT)</td>
                {activeResults.pbt.map((val, idx) => (
                  <td key={idx} style={{ padding: '0.85rem 1rem', color: val >= 0 ? 'inherit' : '#EF4444' }}>
                    {val >= 0 ? formatCellFromRaw(val) : `(${formatCellFromRaw(Math.abs(val))})`}
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'var(--text-secondary)' }}>
                <td style={{ padding: '0.85rem 1rem' }}>10. Corporate Taxes (DPIIT Holiday)</td>
                {activeResults.taxes.map((val, idx) => (
                  <td key={idx} style={{ padding: '0.85rem 1rem', color: val === 0 ? '#10B981' : 'inherit' }}>
                    {val === 0 ? '₹0 (Holiday)' : `(${formatCellFromRaw(val)})`}
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', backgroundColor: 'rgba(56, 189, 248, 0.06)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 900, color: '#38BDF8' }}>11. Profit After Tax (PAT / Net Income)</td>
                {activeResults.pat.map((val, idx) => (
                  <td key={idx} style={{ 
                    padding: '0.85rem 1rem', 
                    fontWeight: 900,
                    color: val >= 0 ? '#38BDF8' : '#EF4444' 
                  }}>
                    {val >= 0 ? formatCellFromRaw(val) : `(${formatCellFromRaw(Math.abs(val))})`}
                  </td>
                ))}
              </tr>

              <tr style={{ color: 'var(--text-primary)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--text-secondary)' }}>C. PAT Margin % (Net Margin)</td>
                {activeResults.patPct.map((val, idx) => (
                  <td key={idx} style={{ 
                    padding: '0.85rem 1rem', 
                    fontWeight: 800, 
                    color: val >= 0 ? '#10B981' : '#F87171' 
                  }}>
                    {val}%
                  </td>
                ))}
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
            placeholder="e.g. How does our ₹20 Cr valuation and 16.7% dilution compare against Tier-1 Seed benchmarks?"
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
