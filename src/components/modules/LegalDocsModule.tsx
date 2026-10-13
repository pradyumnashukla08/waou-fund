import React, { useState } from 'react';
import { 
  Scale, 
  ChevronDown, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { LEGAL_STANDARDS } from '../../data/defaultData';

export const LegalDocsModule: React.FC = () => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const handleDownloadTemplate = (title: string) => {
    const textContent = `WAOUFUND LEGAL STANDARDS TEMPLATE\n=================================\nDocument: ${title}\nJurisdiction: Universal (US / India / Singapore)\nStatus: Institutional VC Standard Compliant\n\n1. VALUATION & CONVERSION TERMS\nPost-money valuation cap applies strictly to equity rounds exceeding ₹25,00,000.\n\n2. GOVERNANCE & OBSERVER RIGHTS\nObserver rights granted only to lead syndicates exceeding ₹50,00,000 allocation.\n\n3. FOUNDER VESTING\n4-Year standard vesting schedule with 12-month cliff.`;
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_Standard_Template.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#6366F1',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <Scale size={14} />
          <span>LEGAL STANDARDS & FOUNDER PROTECTION LOCKER</span>
        </div>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.2rem)',
          fontWeight: 900,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-heading)',
          marginTop: '0.2rem',
        }}>
          Legal Standards & Term Sheets
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Deconstruct investor term sheets, prevent predatory liquidation preferences, and download clean YC-standard Post-Money SAFE agreements.
        </p>
      </div>

      {/* ── Accordion List ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {LEGAL_STANDARDS.map((std, idx) => {
          const isOpen = expandedIdx === idx;
          return (
            <div
              key={idx}
              className="card-elevated"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                onClick={() => setExpandedIdx(isOpen ? null : idx)}
                style={{
                  padding: '1.25rem 1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    color: '#818CF8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <FileText size={18} />
                  </div>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {std.title}
                  </span>
                </div>

                <ChevronDown 
                  size={18} 
                  color="var(--text-hint)" 
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} 
                />
              </div>

              {isOpen && (
                <div style={{
                  padding: '0 1.75rem 1.75rem 1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  paddingTop: '1.25rem',
                }}>
                  {/* The Standard Box */}
                  <div style={{
                    backgroundColor: 'var(--accent-bg-emerald)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10B981', letterSpacing: '0.06em' }}>
                      THE INSTITUTIONAL STANDARD:
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                      {std.standard}
                    </p>
                  </div>

                  {/* Red Flags Box */}
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#EF4444', letterSpacing: '0.06em' }}>
                      PREDATORY RED FLAGS TO REJECT:
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#F87171', marginTop: '4px', lineHeight: 1.5 }}>
                      {std.flags}
                    </p>
                  </div>

                  {/* Download Template button */}
                  <div>
                    <button
                      onClick={() => handleDownloadTemplate(std.title)}
                      className="btn-cyan"
                      style={{ padding: '0.6rem 1.25rem', fontSize: '0.84rem' }}
                    >
                      <Download size={14} />
                      <span>{std.actionLabel}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
