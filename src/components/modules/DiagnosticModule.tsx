import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  Info,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { EvaluationResult } from '../../types';
import { StartupProfile } from '../../data/defaultData';
import { api } from '../../services/api';

interface DiagnosticModuleProps {
  startup?: StartupProfile;
  evaluation: EvaluationResult;
  onUpdateEvaluation: (res: EvaluationResult) => void;
  setActiveTab: (tab: string) => void;
}

export const DiagnosticModule: React.FC<DiagnosticModuleProps> = ({
  startup,
  evaluation,
  onUpdateEvaluation,
  setActiveTab,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const defaultDeckName = startup?.pitchDeckUrl 
    ? (startup.pitchDeckUrl.split('/').pop() || `${startup.name.replace(/\s+/g, '_')}_Pitch_Deck.pdf`)
    : `${startup?.name ? startup.name.replace(/\s+/g, '_') : 'My_Startup'}_Pitch_Deck.pdf`;
  const [activeFileName, setActiveFileName] = useState(defaultDeckName);
  const [selectedFinding, setSelectedFinding] = useState<number | null>(null);

  const scanSteps = [
    'Vectorizing Slide Geometry & Text Nodes...',
    'Parsing Problem-Solution Narrative Arc...',
    'Benchmarking Unit Economics against 10,000 Decks...',
    'Consulting AI Investment Committee...',
    'Synthesizing Diagnostic Verdict...',
  ];

  const handleSimulateScan = async (fileName = defaultDeckName, fileSize = '8.4 MB') => {
    setIsScanning(true);
    setActiveFileName(fileName);
    setScanStep(0);

    for (let i = 0; i < scanSteps.length; i++) {
      setScanStep(i);
      await new Promise((r) => setTimeout(r, 600));
    }

    const updated = await api.evaluateDeck(fileName, fileSize);
    onUpdateEvaluation(updated);
    setIsScanning(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      handleSimulateScan(file.name, sizeMb);
    }
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 82) return 'A';
    if (score >= 74) return 'B+';
    if (score >= 65) return 'B';
    return 'C';
  };

  const findings = evaluation.red_flags.map((flag, idx) => ({
    id: idx + 1,
    title: idx === 0 ? 'CRITICAL NARRATIVE VULNERABILITY' : 'BENCHMARK GAP IDENTIFIED',
    severity: idx === 0 ? 'CRITICAL' : 'WARNING',
    color: idx === 0 ? '#EF4444' : '#F59E0B',
    desc: flag,
    fix: 'Address this finding directly in your pitch narrative and appendix slide model.',
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: 'var(--text-brand)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <Sparkles size={14} />
          <span>DECK DIAGNOSTIC TERMINAL</span>
        </div>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.2rem)',
          fontWeight: 900,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-heading)',
          marginTop: '0.2rem',
        }}>
          Pitch Deck Diagnostic Engine
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Our AI engine parses your deck against 10,000+ funded seed presentations, identifying narrative bloat, missing financial bridges, and unit economic vulnerabilities.
        </p>
      </div>

      {/* ── File Upload / Scan Trigger Bar ────────────────────────────── */}
      <div className="card-elevated" style={{
        borderRadius: '20px',
        padding: '2rem',
        border: '2px dashed rgba(56, 189, 248, 0.3)',
        textAlign: 'center',
        position: 'relative',
      }}>
        {isScanning ? (
          <div style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '4px solid rgba(56, 189, 248, 0.2)',
              borderTopColor: '#38BDF8',
              animation: 'spin 1s infinite linear',
            }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-brand)' }}>
                {scanSteps[scanStep]}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Analyzing "{activeFileName}" with Stage Matrix
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: 'var(--accent-bg-blue)',
              color: 'var(--text-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <UploadCloud size={32} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Active Document: <span style={{ color: 'var(--text-brand)' }}>{activeFileName}</span>
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Drag and drop your updated pitch deck PDF (max 25MB) or run diagnostic on preset samples.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
              <label 
                className="btn-cyan"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.86rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <UploadCloud size={15} />
                <span>Upload New Deck File</span>
                <input 
                  type="file" 
                  accept=".pdf,.pptx,.ppt" 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                />
              </label>

              <button
                onClick={() => handleSimulateScan(activeFileName, '12.4 MB')}
                className="btn-outline"
                style={{
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.86rem',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  borderColor: 'rgba(226, 232, 240, 0.8)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <RefreshCw size={14} />
                <span>Re-Analyze {startup?.name ? `${startup.name} Deck` : 'Current Deck'}</span>
              </button>

              <button
                onClick={() => handleSimulateScan('FinFlow_SeriesA_Growth_Deck.pdf', '18.2 MB')}
                className="btn-outline"
                style={{
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.86rem',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  borderColor: 'rgba(226, 232, 240, 0.8)',
                }}
              >
                <span>Benchmark: FinFlow Series-A</span>
              </button>

              <button
                onClick={() => handleSimulateScan('HealthSync_PreSeed_Deck.pdf', '6.8 MB')}
                className="btn-outline"
                style={{
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.86rem',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  borderColor: 'rgba(226, 232, 240, 0.8)',
                }}
              >
                <span>Benchmark: HealthSync Pre-Seed</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Diagnostic Scores Overview Card ───────────────────────────── */}
      <div className="card-elevated" style={{
        borderRadius: '20px',
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'center',
      }}>
        {/* Left: Overall Readiness & Grade */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <div style={{
            width: '88px',
            height: '88px',
            borderRadius: '22px',
            background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(6, 182, 212, 0.4)',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
              {getGrade(evaluation.overall_score)}
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase' }}>GRADE</span>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '0.06em' }}>
              OVERALL AI READINESS SCORE
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
              {evaluation.overall_score} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} />
              {evaluation.overall_score >= 85 ? 'Strong Seed Match (Top Decile)' : 'Meets Baseline Seed Standards'}
            </div>
          </div>
        </div>

        {/* Right: Vectorized Dimensions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
        }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>TEAM PEDIGREE</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-brand)' }}>{evaluation.team_score}/100</div>
            <span style={{ fontSize: '0.68rem', color: '#10B981' }}>Ex-Flipkart / Founders</span>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>MARKET / TAM</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FACC15' }}>{evaluation.market_score}/100</div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>₹48,000 Cr TAM</span>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>UNIT ECONOMICS</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#EC4899' }}>{evaluation.execution_score}/100</div>
            <span style={{ fontSize: '0.68rem', color: '#F59E0B' }}>Payback 13.8 mos</span>
          </div>
        </div>
      </div>

      {/* ── Slide-by-Slide AI Diagnostic Findings ─────────────────────── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            IDENTIFIED SLIDE VULNERABILITIES & AI FEEDBACK
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Click on any finding to inspect slide remediation
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {findings.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedFinding(selectedFinding === item.id ? null : item.id)}
              className="card-elevated"
              style={{
                borderRadius: '16px',
                padding: '1.5rem',
                borderLeft: `4px solid ${item.color}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: `${item.color}20`,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: item.color }}>
                        {item.severity}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-hint)' }}>•</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-brand)', fontWeight: 700 }}>
                        Slide Vector #{item.id}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>

                <button
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-brand)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  {selectedFinding === item.id ? 'Collapse' : 'Inspect Fix →'}
                </button>
              </div>

              {selectedFinding === item.id && (
                <div style={{
                  marginTop: '1.25rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}>
                  <div style={{
                    backgroundColor: 'rgba(6, 182, 212, 0.08)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                  }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '0.05em' }}>
                      RECOMMENDED SLIDE MODIFICATION
                    </span>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                      {item.fix}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('actionplan');
                      }}
                      className="btn-cyan"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                    >
                      <span>Add to Action Plan</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('grill');
                      }}
                      className="btn-outline"
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.8rem',
                        backgroundColor: 'transparent',
                        color: 'var(--text-primary)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      <span>Practice Defense in AI Grill</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
