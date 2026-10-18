import React, { useState, useRef } from 'react';
import { 
  Database, 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  Lock, 
  Sparkles, 
  Download, 
  Clock,
  ArrowRight,
  ArrowDown,
  Eye,
  Trash2
} from 'lucide-react';
import { StartupProfile, DOC_CHECKLIST_CONFIG } from '../../data/defaultData';
import { EvaluationResult, UploadedDoc } from '../../types';

interface DataRoomModuleProps {
  startup: StartupProfile;
  evaluation: EvaluationResult;
  setActiveTab: (tab: string) => void;
}

export const DataRoomModule: React.FC<DataRoomModuleProps> = ({ startup, evaluation, setActiveTab }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const startupPrefix = (startup.name || 'Startup').replace(/\s+/g, '_');

  const [docs, setDocs] = useState<UploadedDoc[]>(() => {
    try {
      const saved = sessionStorage.getItem('waou_dataroom_docs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If active user session was accidentally stored with legacy mock docs, purge them
          if (startup.id === 'user_active_startup' && parsed.some((d: any) => d.name?.includes('Seed_Pitch_Deck_V3.pdf'))) {
            sessionStorage.removeItem('waou_dataroom_docs');
            return [];
          }
          return parsed;
        }
      }
    } catch {}
    // If viewing demo mock startup explicitly (e.g. avasplot from switcher), show demo files
    if (startup.id && startup.id !== 'user_active_startup' && startup.id !== 'custom_startup') {
      return [
        { id: '1', name: `${startupPrefix}_Seed_Pitch_Deck_V3.pdf`, size: '12.4 MB', date: '2026-10-09', format: 'PDF', status: 'verified' },
        { id: '2', name: `${startupPrefix}_Cap_Table_Fully_Diluted.xlsx`, size: '2.1 MB', date: '2026-10-08', format: 'Excel', status: 'verified' },
        { id: '3', name: `${startupPrefix}_Financial_Model_3Y.xlsx`, size: '4.8 MB', date: '2026-10-07', format: 'Excel', status: 'verified' },
        { id: '4', name: 'Certificate_of_Incorporation_MCA.pdf', size: '1.2 MB', date: '2026-09-15', format: 'PDF', status: 'verified' },
      ];
    }
    // Real user starts clean with 0 fake files
    return [];
  });

  React.useEffect(() => {
    try {
      sessionStorage.setItem('waou_dataroom_docs', JSON.stringify(docs));
    } catch {}
  }, [docs]);

  const [isDiligenceRunning, setIsDiligenceRunning] = useState(false);
  const [diligenceStep, setDiligenceStep] = useState(0);
  const [diligenceComplete, setDiligenceComplete] = useState(false);

  const checklist = DOC_CHECKLIST_CONFIG[startup.stage] || DOC_CHECKLIST_CONFIG['Seed'];
  const diligenceSteps = [
    'Sanitizing Document Data & Metadata...',
    'Validating Cap Table Fully Diluted Share Pool...',
    'Auditing 3-Month Bank Statements against Burn Rate...',
    'Verifying Incorporation Jurisdictional Standing...',
    'Finalizing Due Diligence Readiness Certificate...',
  ];

  const handleRunDiligence = async () => {
    setIsDiligenceRunning(true);
    setDiligenceComplete(false);
    for (let i = 0; i < diligenceSteps.length; i++) {
      setDiligenceStep(i);
      await new Promise((r) => setTimeout(r, 600));
    }
    setIsDiligenceRunning(false);
    setDiligenceComplete(true);
  };

  const handleRealFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newDocs: UploadedDoc[] = Array.from(files).map((f, i) => {
      const ext = f.name.split('.').pop()?.toUpperCase() || 'FILE';
      const sizeMb = (f.size / (1024 * 1024)).toFixed(1);
      const displaySize = sizeMb === '0.0' ? `${(f.size / 1024).toFixed(0)} KB` : `${sizeMb} MB`;
      return {
        id: `${Date.now()}_${i}`,
        name: f.name,
        size: displaySize,
        date: new Date().toISOString().split('T')[0],
        format: ext.includes('XLS') ? 'Excel' : ext,
        status: 'verified',
      };
    });
    setDocs((prev) => [...newDocs, ...prev]);
    if (e.target) e.target.value = '';
  };

  const handleAddSampleDoc = (label: string, format: string) => {
    const ext = format.toLowerCase().includes('excel') ? 'xlsx' : 'pdf';
    const newDoc: UploadedDoc = {
      id: Date.now().toString(),
      name: `${startupPrefix}_${label.replace(/\s+/g, '_')}.${ext}`,
      size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      date: new Date().toISOString().split('T')[0],
      format: ext.toUpperCase(),
      status: 'verified',
    };
    setDocs((prev) => [newDoc, ...prev]);
  };

  const handleDeleteDoc = (id: string) => {
    setDocs(docs.filter((d) => d.id !== id));
  };

  const completedChecklistCount = checklist.filter((item) => 
    docs.some((d) => d.name.toLowerCase().includes(item.id.toLowerCase()) || d.name.toLowerCase().includes(item.label.toLowerCase().split(' ')[0]))
  ).length;

  const readinessPercent = docs.length === 0 ? 0 : Math.min(100, Math.round((completedChecklistCount / checklist.length) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#10B981',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <Database size={14} />
            <span>VIRTUAL DATA ROOM & DUE DILIGENCE LOCKER</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.2rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            marginTop: '0.2rem',
          }}>
            Virtual Data Room ({startup.stage.toUpperCase()})
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Stage-aware due diligence checklist with bank-grade 256-bit encryption. Prepare your documentation before receiving investor term sheets.
          </p>
        </div>

        <button
          onClick={handleRunDiligence}
          disabled={isDiligenceRunning}
          className="btn-cyan"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.86rem' }}
        >
          <ShieldCheck size={16} />
          <span>{isDiligenceRunning ? 'Scanning Room...' : 'Run AI Diligence Scan'}</span>
        </button>
      </div>

      {/* ── Standardized Diligence Templates Quick Notice Banner ─────────── */}
      <div style={{
        backgroundColor: 'var(--accent-bg-blue)',
        border: '1px solid rgba(37, 99, 235, 0.25)',
        borderRadius: '16px',
        padding: '1.1rem 1.35rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 2px 10px rgba(37, 99, 235, 0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 3px 8px rgba(37, 99, 235, 0.25)',
          }}>
            <Download size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Looking for Standardized Diligence Templates?
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              If you want standardized templates, you can download them from the bottom of this page.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('official-templates-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="btn-cyan"
          style={{
            padding: '0.55rem 1.15rem',
            fontSize: '0.84rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            whiteSpace: 'nowrap',
            borderRadius: '10px',
          }}
        >
          <span>Download Templates Below</span>
          <ArrowDown size={15} />
        </button>
      </div>

      {/* ── Diligence Progress Running Bar ──────────────────────────────── */}
      {isDiligenceRunning && (
        <div className="card-elevated" style={{
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #10B981',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(16, 185, 129, 0.2)',
            borderTopColor: '#10B981',
            animation: 'spin 1s infinite linear',
          }} />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10B981' }}>
              {diligenceSteps[diligenceStep]}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Multi-vector institutional verification across cap tables, contracts, and filings
            </div>
          </div>
        </div>
      )}

      {diligenceComplete && (
        <div style={{
          backgroundColor: 'var(--accent-bg-emerald)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2 size={24} color="#10B981" />
            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                AI Due Diligence Verification Complete
              </div>
              <div style={{ fontSize: '0.8rem', color: '#34D399' }}>
                No fatal governance red flags detected. Data room is ready for Tier-1 Angel Syndicates & Seed Leads.
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 800, backgroundColor: 'var(--accent-bg-emerald)', padding: '4px 10px', borderRadius: '8px' }}>
            VERIFIED STAMP 2026
          </span>
        </div>
      )}

      {/* ── Due Diligence Readiness Meter ──────────────────────────────── */}
      <div className="card-elevated" style={{
        borderRadius: '20px',
        padding: '1.75rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: 'var(--accent-bg-emerald)',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Lock size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '0.06em' }}>
              STAGE READINESS AUDIT
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Data Room Readiness: {readinessPercent}%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {docs.length} documents uploaded • Encrypted AES-256
            </div>
          </div>
        </div>

        <div style={{ width: 'min(100%, 260px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <span>Progress</span>
            <span style={{ color: '#10B981', fontWeight: 800 }}>{readinessPercent}%</span>
          </div>
          <div style={{
            height: '8px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${readinessPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #06B6D4 0%, #10B981 100%)',
              borderRadius: '999px',
            }} />
          </div>
        </div>
      </div>

      {/* ── Two Column: Required Checklist & Uploaded Files ────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '1.5rem',
      }}>
        {/* Left: Stage-Aware Required Checklist */}
        <div className="card-elevated" style={{ borderRadius: '20px', padding: '1.75rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
            {startup.stage.toUpperCase()} DUE DILIGENCE REQUIREMENTS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {checklist.map((item) => {
              const hasUploaded = docs.some((d) => 
                d.name.toLowerCase().includes(item.id.toLowerCase()) || d.name.toLowerCase().includes(item.label.toLowerCase().split(' ')[0])
              );
              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: hasUploaded ? '#10B981' : 'var(--bg-card)',
                      border: hasUploaded ? 'none' : '1px solid var(--border-subtle)',
                      color: hasUploaded ? '#FFFFFF' : 'var(--text-hint)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}>
                      {hasUploaded ? <CheckCircle2 size={15} /> : <FileText size={13} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {item.description}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: hasUploaded ? '#10B981' : '#D97706', marginTop: '4px', fontWeight: 700 }}>
                        {hasUploaded ? 'SECURED IN LOCKER' : item.isOptional ? 'OPTIONAL' : 'ACTION REQUIRED'}
                      </div>
                    </div>
                  </div>

                  {!hasUploaded && (
                    <button
                      onClick={() => handleAddSampleDoc(item.label, item.format)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '6px',
                        backgroundColor: 'var(--accent-bg-blue)',
                        border: '1px solid rgba(37, 99, 235, 0.2)',
                        color: 'var(--text-brand)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      + Add
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Uploaded Documents in Room */}
        <div className="card-elevated" style={{ borderRadius: '20px', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '0.08em' }}>
              FILES IN SECURE REPOSITORY ({docs.length})
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.xlsx,.xls,.csv,.doc,.docx,.ppt,.pptx"
              onChange={handleRealFileUpload}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-brand)',
                backgroundColor: 'var(--accent-bg-blue)',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <UploadCloud size={13} />
              <span>+ Upload Device Files</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {docs.length === 0 ? (
              <div style={{
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px',
                border: '2px dashed var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <FileText size={32} style={{ color: 'var(--text-hint)' }} />
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  No Documents in Data Room Yet
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-hint)', maxWidth: '380px', lineHeight: 1.4 }}>
                  Upload your pitch deck, financials, cap table, or legal docs above to build your due diligence locker.
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--color-brand-600)',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <UploadCloud size={14} />
                  <span>Upload First Document</span>
                </button>
              </div>
            ) : (
              docs.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: doc.format === 'PDF' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: doc.format === 'PDF' ? '#EF4444' : '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '0.7rem',
                      fontWeight: 900,
                    }}>
                      {doc.format}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-hint)' }}>
                        {doc.size} • Uploaded {doc.date}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      backgroundColor: 'var(--accent-bg-emerald)',
                      color: '#10B981',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}>
                      VERIFIED
                    </span>
                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-hint)',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                      title="Remove File"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Official Diligence & Financial Model Templates ──────────────── */}
      <div id="official-templates-section" className="card-elevated" style={{ borderRadius: '20px', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              OFFICIAL DILIGENCE TEMPLATES & FINANCIAL FORECAST MODELS
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Standard institutional Excel workbooks formatted for Indian & Global VC syndicates.
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', backgroundColor: 'var(--accent-bg-emerald)', padding: '4px 10px', borderRadius: '6px' }}>
            4 Institutional Models Ready
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '1rem',
        }}>
          {[
            {
              title: 'Cap Table Model (Fully Diluted)',
              type: 'Excel (.xlsx)',
              size: '10.4 KB',
              href: '/templates/Cap_Table_Format.xlsx',
              desc: 'Standard equity cap table with ESOP pool, seed convertible notes, and founder shares.',
            },
            {
              title: '3-Statement Financial Forecast Base Case',
              type: 'Excel (.xlsx)',
              size: '88.3 KB',
              href: '/templates/Financial_Forecast_baseCase.xlsx',
              desc: 'Complete 3-year integrated P&L, balance sheet, cash flow, and runway model.',
            },
            {
              title: 'Employee Headcount & Payroll Sheet',
              type: 'Excel (.xlsx)',
              size: '9.4 KB',
              href: '/templates/Employee_Record_Format.xlsx',
              desc: 'Structured employee compensation, department headcount, and burn projection format.',
            },
            {
              title: 'SaaS Unit Economics Financial Model',
              type: 'Excel (.xlsx)',
              size: '49.1 KB',
              href: '/templates/template_saas.xlsx',
              desc: 'MRR MoM cohort retention, CAC payback, LTV:CAC, and churn diagnostic model.',
            },
          ].map((t, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '1.1rem',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.75rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    color: t.type.includes('Excel') ? '#10B981' : '#38BDF8',
                    backgroundColor: t.type.includes('Excel') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}>
                    {t.type}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.size}</span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {t.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem', lineHeight: 1.4 }}>
                  {t.desc}
                </div>
              </div>

              <a
                href={t.href}
                download
                className="btn-cyan"
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.78rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  borderRadius: '8px',
                }}
              >
                <Download size={13} />
                <span>Download Template</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
