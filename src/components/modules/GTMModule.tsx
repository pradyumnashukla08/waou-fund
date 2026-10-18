import React, { useState } from 'react';
import { 
  Rocket, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Send, 
  Clock, 
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { StartupProfile } from '../../data/defaultData';
import { EvaluationResult, GTMExperiment } from '../../types';
import { api } from '../../services/api';

interface GTMModuleProps {
  startup: StartupProfile;
  evaluation: EvaluationResult;
}

export const GTMModule: React.FC<GTMModuleProps> = ({ startup, evaluation }) => {
  const gtm = evaluation.gtm_strategy;

  const [experiments, setExperiments] = useState<GTMExperiment[]>(gtm.experiments);
  const [selectedExp, setSelectedExp] = useState<GTMExperiment | null>(null);
  const [proofText, setProofText] = useState(() => {
    try {
      return sessionStorage.getItem('waou_gtm_proof') || '';
    } catch {
      return '';
    }
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  React.useEffect(() => {
    try {
      sessionStorage.setItem('waou_gtm_proof', proofText);
    } catch {}
  }, [proofText]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExp || !proofText.trim()) return;

    setIsVerifying(true);
    const res = await api.verifySprint(selectedExp.title, proofText);
    setVerifyMessage(res.message);
    setIsVerifying(false);

    // Mark experiment completed
    setExperiments(
      experiments.map((item) =>
        item.title === selectedExp.title ? { ...item, status: 'Completed' } : item
      )
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#F97316',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <Rocket size={14} />
          <span>GO-TO-MARKET VECTOR & EXPERIMENTAL RUNWAYS</span>
        </div>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.2rem)',
          fontWeight: 900,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-heading)',
          marginTop: '0.2rem',
        }}>
          GTM Strategy & Sprints
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Evaluate blended CAC across channels, validate unit economics payback periods, and submit sprint proof to earn algorithmic fundability bonuses.
        </p>
      </div>

      {/* ── Key GTM Economics Strip ─────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
      }}>
        <div className="card-elevated" style={{ borderRadius: '16px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>BLENDED CAC</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-brand)', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            {gtm.blended_cac > 0 ? `₹${gtm.blended_cac.toLocaleString()}` : 'Not Set'}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-hint)' }}>Per enterprise account</span>
        </div>

        <div className="card-elevated" style={{ borderRadius: '16px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>ESTIMATED LTV</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10B981', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            {gtm.ltv > 0 ? `₹${gtm.ltv.toLocaleString()}` : 'Not Set'}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#34D399' }}>36-month net retention</span>
        </div>

        <div className="card-elevated" style={{ borderRadius: '16px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>LTV : CAC RATIO</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#D97706', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            {gtm.ltv_cac_ratio > 0 ? `${gtm.ltv_cac_ratio.toFixed(1)}x` : 'Not Set'}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: 700 }}>Benchmark &gt; 3.0x</span>
        </div>

        <div className="card-elevated" style={{ borderRadius: '16px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>PAYBACK DURATION</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#EF4444', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            {gtm.payback_period > 0 ? `${gtm.payback_period} Mos` : 'Not Set'}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#F87171' }}>Target &lt; 9 months</span>
        </div>
      </div>

      {/* ── Channel Efficiency Grid ────────────────────────────────────── */}
      <div className="card-elevated" style={{ borderRadius: '20px', padding: '2rem' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
          ACTIVE CUSTOMER ACQUISITION CHANNELS
        </div>

        {gtm.channels.length === 0 ? (
          <div style={{
            padding: '2rem 1.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '14px',
            border: '1px dashed var(--border-subtle)',
            color: 'var(--text-hint)',
            fontSize: '0.85rem',
          }}>
            No customer acquisition channels mapped yet. Complete your GTM strategy or upload your pitch deck to benchmark your CAC across channels.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {gtm.channels.map((ch, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {ch.name}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: ch.status === 'Scaling' ? 'rgba(16, 185, 129, 0.15)' : ch.status === 'Testing' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: ch.status === 'Scaling' ? '#059669' : ch.status === 'Testing' ? '#0284C7' : '#DC2626',
                  }}>
                    {ch.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  ₹{ch.cac.toLocaleString()} <span style={{ fontSize: '0.74rem', color: 'var(--text-hint)' }}>CAC</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Active Sprints & Proof Verification ────────────────────────── */}
      <div className="card-elevated" style={{ borderRadius: '20px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '0.08em' }}>
              DISTRIBUTION EXPERIMENTS & SPRINTS
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              Active Growth Loops
            </h3>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Submit proof of completion to earn Fundability Score bonuses
          </span>
        </div>

        {experiments.length === 0 ? (
          <div style={{
            padding: '2rem 1.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '14px',
            border: '1px dashed var(--border-subtle)',
            color: 'var(--text-hint)',
            fontSize: '0.85rem',
          }}>
            No growth sprint experiments active. Upload your deck or complete your profile to generate custom GTM sprint tasks.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {experiments.map((exp, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '14px',
                padding: '1.25rem',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {exp.title}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: exp.status === 'Completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: exp.status === 'Completed' ? '#10B981' : '#F59E0B',
                  }}>
                    {exp.status.toUpperCase()}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '600px' }}>
                  {exp.description}
                </p>
              </div>

              {exp.status !== 'Completed' ? (
                <button
                  onClick={() => {
                    setSelectedExp(exp);
                    setProofText('');
                    setVerifyMessage(null);
                  }}
                  className="btn-cyan"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                >
                  <span>Submit Proof (+3 Pts)</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <span style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={16} /> Verified by AI
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>

      {/* ── Sprint Verification Modal ──────────────────────────────────── */}
      {selectedExp && (
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
            border: '1px solid rgba(37, 99, 235, 0.2)',
            padding: '2.5rem',
            maxWidth: '540px',
            width: '100%',
            boxShadow: 'var(--shadow-2xl)',
            position: 'relative',
          }}>
            <button
              onClick={() => setSelectedExp(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '1.4rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Verify Sprint: {selectedExp.title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Provide qualitative metrics, conversion proof, or partner links for automated AI verification.
            </p>

            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <textarea
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                placeholder="e.g. Launched JLL co-branded CRE yield report generating 340 enterprise downloads and 12 inbound pilot calls..."
                rows={4}
                required
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                }}
              />

              {verifyMessage && (
                <div style={{
                  padding: '0.85rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--accent-bg-emerald)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  fontSize: '0.84rem',
                  color: '#34D399',
                }}>
                  {verifyMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying || !proofText.trim()}
                className="btn-cyan"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {isVerifying ? 'Evaluating with AI...' : 'Submit Sprint Proof to AI Evaluator'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
