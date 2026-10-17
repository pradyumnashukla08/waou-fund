import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  TrendingUp, 
  FileText, 
  Cpu, 
  BarChart3, 
  Users, 
  FolderLock, 
  CheckCircle2, 
  ChevronDown, 
  Star, 
  HelpCircle,
  Zap,
  Lock,
  Layers,
  Award,
  DollarSign
} from 'lucide-react';
import { StartupProfile } from '../data/defaultData';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenDiagnostic: () => void;
  selectedStartup: StartupProfile;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onGetStarted, 
  onOpenDiagnostic,
  selectedStartup 
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Interactive mini-simulator state
  const [simName, setSimName] = useState('My Next Venture');
  const [simStage, setSimStage] = useState('Seed');
  const [simMrr, setSimMrr] = useState('25');
  const [simScore, setSimScore] = useState(86);
  const [simCalculated, setSimCalculated] = useState(false);

  const calculateScore = (e: React.FormEvent) => {
    e.preventDefault();
    const mrrNum = parseFloat(simMrr) || 10;
    let base = 75;
    if (simStage === 'Pre-Seed') base = 72 + Math.min(15, mrrNum * 0.8);
    else if (simStage === 'Seed') base = 78 + Math.min(18, mrrNum * 0.4);
    else base = 82 + Math.min(14, mrrNum * 0.1);
    
    setSimScore(Math.min(97, Math.round(base)));
    setSimCalculated(true);
  };

  const faqs = [
    {
      q: 'How does WaouFund evaluate my startup differently than generic AI tools?',
      a: 'Generic LLMs have no domain context on venture capital underwriting standards. WaouFund is trained on 10,000+ institutional seed and Series-A term sheets, financial models, and diligence checklists. Our engine enforces stage-aware rules: for Pre-Seed we inspect founder pedigree and TAM, while for Seed and Series-A we ruthlessly evaluate CAC payback, unit economics, and Net Revenue Retention.',
    },
    {
      q: 'Is my confidential pitch deck and financial data secure?',
      a: 'Absolutely. We operate bank-grade 256-bit AES encryption at rest and in transit. Your materials are never used to train public foundational models. Only you and the advisors you explicitly authorize can access your virtual data room.',
    },
    {
      q: 'What exactly is the "AI Investor Grill" simulation?',
      a: 'The AI Investor Grill emulates a grueling partner-level "Call 1" with seasoned VC partners like Devang Raja. It asks uncomfortable questions regarding your revenue concentration, gross margin assumptions, and sales cycles, providing a real-time clarity score and delivery feedback before you meet real investors.',
    },
    {
      q: 'Can I export the dynamic financial forecast to Excel / CSV?',
      a: 'Yes! The Financial Command Center features a deterministic 5-year scenario model that exports cleanly to Excel with formulas intact (P&L, hiring plan, and runway sensitivity analysis).',
    },
    {
      q: 'Can I invite my co-founders and advisors into the platform?',
      a: 'Yes, Founder Pro and Syndicate tiers support multi-seat team workspaces with role-based permissions and shared data room access.',
    },
  ];

  return (
    <div className="landing-page">
      {/* ─── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section className="bg-mesh-radial" style={{
        position: 'relative',
        paddingTop: '4rem',
        paddingBottom: '6rem',
        overflow: 'hidden',
        borderBottom: '1px solid #E2E8F0',
      }}>
        {/* Ambient Glow Orb */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(52, 120, 246, 0.12) 0%, rgba(120, 87, 255, 0.06) 50%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}>
            {/* Left Column: Headline & Pitch */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div style={{ display: 'inline-flex' }}>
                <span className="badge-pill" style={{
                  backgroundColor: '#EFF6FF',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#2563EB',
                }}>
                  <Sparkles size={13} />
                  AI-POWERED FUNDRAISING INTELLIGENCE
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.1rem, 5.5vw, 4.2rem)',
                fontWeight: 900,
                lineHeight: 1.12,
                color: '#0F172A',
                letterSpacing: '-0.035em',
              }}>
                Raise Faster.<br />
                Meet the Right<br />
                <span className="text-gradient-primary">Investors.</span>
              </h1>

              <p style={{
                fontSize: '1.18rem',
                color: '#64748B',
                lineHeight: 1.65,
                maxWidth: '540px',
              }}>
                WaouFund helps high-growth startups discover the right investors, diagnose pitch decks, stress-test financials, and navigate diligence — powered by institutional AI.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', paddingTop: '0.5rem' }}>
                <button 
                  onClick={onGetStarted}
                  className="btn-primary" 
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1.05rem',
                    borderRadius: '999px',
                  }}
                >
                  <span>Launch Founder Studio</span>
                  <ArrowRight size={18} />
                </button>

                <button 
                  onClick={onOpenDiagnostic}
                  className="btn-outline"
                  style={{
                    padding: '1rem 1.75rem',
                    fontSize: '1.02rem',
                    borderRadius: '999px',
                  }}
                >
                  <Sparkles size={18} color="#2563EB" />
                  <span>Diagnose Sample Deck</span>
                </button>
              </div>

              {/* Value Badges */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1.25rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(226, 232, 240, 0.8)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Zap size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>Instant Analysis</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>15-sec slide vectors</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: '#F0FDF4',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>Due Diligence Ready</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Institutional standards</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: '#FAF5FF',
                    color: '#7857FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>Dynamic Models</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Real burn & runway</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Interactive Diagnostic Card */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div 
                className="hero-preview-card"
                style={{
                  width: '100%',
                  maxWidth: '520px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '2rem',
                  boxShadow: '0 25px 60px -15px rgba(37, 99, 235, 0.15), 0 0 1px 1px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  position: 'relative',
                }}
              >
                {/* Floating Handwritten Callout */}
                <div style={{
                  position: 'absolute',
                  top: '-18px',
                  right: '24px',
                  backgroundColor: '#FEF3C7',
                  border: '1px dashed #F59E0B',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontFamily: 'var(--font-hand)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#92400E',
                  transform: 'rotate(2deg)',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)',
                }}>
                  Live VC Simulation ⚡
                </div>

                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Active Startup Profile
                    </span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                      {selectedStartup.name}
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: '#2563EB', fontWeight: 600 }}>
                      {selectedStartup.category} • {selectedStartup.stage}
                    </span>
                  </div>
                  <span style={{
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: '1px solid #A7F3D0',
                  }}>
                    READY TO PITCH
                  </span>
                </div>

                {/* Circular Score Gauge Area */}
                <div style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #E2E8F0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', width: '84px', height: '84px', flexShrink: 0 }}>
                      <svg width="84" height="84" viewBox="0 0 84 84">
                        <circle cx="42" cy="42" r="36" stroke="#E2E8F0" strokeWidth="8" fill="transparent" />
                        <circle 
                          cx="42" cy="42" r="36" 
                          stroke="url(#heroGrad)" 
                          strokeWidth="8" 
                          fill="transparent" 
                          strokeDasharray={226} 
                          strokeDashoffset={226 - (selectedStartup.fundabilityScore / 100) * 226} 
                          strokeLinecap="round" 
                          transform="rotate(-90 42 42)" 
                        />
                        <defs>
                          <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
                          {selectedStartup.fundabilityScore}
                        </span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748B' }}>/100</span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>Fundability Score</div>
                      <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={13} /> Top 8% in Seed Batch
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                        Target: {selectedStartup.targetAsk} @ {selectedStartup.valuation}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={onGetStarted}
                    style={{
                      padding: '0.5rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      cursor: 'pointer',
                    }}
                  >
                    Inspect Vectors →
                  </button>
                </div>

                {/* Sub-Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))', gap: '0.75rem' }}>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>INVESTOR READINESS</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#2563EB' }}>92%</div>
                    <div style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 700 }}>Institutional ready</div>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>MRR GROWTH</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>{selectedStartup.growth}</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B' }}>{selectedStartup.mrr}/mo</div>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>DEFAULT RUNWAY</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#D97706' }}>11.6 Mos</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Burn ₹12L/mo</div>
                  </div>
                </div>

                {/* Action CTA inside card */}
                <button
                  onClick={onGetStarted}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '12px',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>Open Full Diligence Workspace</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF & METRICS STRIP ────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0B0F19', color: '#FFFFFF', padding: '3rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            textAlign: 'center',
          }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'var(--font-heading)' }}>
                $140M+
              </div>
              <div style={{ fontSize: '0.88rem', color: '#94A3B8', fontWeight: 600 }}>Total Capital Raised by Founders</div>
            </div>

            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                450+
              </div>
              <div style={{ fontSize: '0.88rem', color: '#94A3B8', fontWeight: 600 }}>Seed & Series-A Startups Evaluated</div>
            </div>

            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'var(--font-heading)' }}>
                10,000+
              </div>
              <div style={{ fontSize: '0.88rem', color: '#94A3B8', fontWeight: 600 }}>Decks Vectorized & Benchmarked</div>
            </div>

            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10B981', fontFamily: 'var(--font-heading)' }}>
                4.2x
              </div>
              <div style={{ fontSize: '0.88rem', color: '#94A3B8', fontWeight: 600 }}>Faster Term Sheet Acceleration</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6 PILLARS / PLATFORM CAPABILITIES ───────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 4rem auto' }}>
            <span className="badge-pill" style={{ backgroundColor: '#F0F5FF', color: '#2563EB', marginBottom: '1rem' }}>
              ✦ COMPREHENSIVE ARCHITECTURE
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 900, color: '#0F172A', marginBottom: '1rem' }}>
              Everything Founders Need to Close Their Round
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#64748B' }}>
              Stop pitching blind. WaouFund bridges the asymmetrical gap between founder pitch narratives and institutional investment committee demands.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
          }}>
            {/* Feature 1 */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '20px',
              padding: '2.25rem',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FileText size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
                Pitch Deck Diagnostic Engine
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6 }}>
                Upload your pitch deck PDF. Our AI parses slide-by-slide, flagging missing TAM disclosures, unclear CAC:LTV mechanics, and storytelling bloat before you send it to a lead partner.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2563EB', cursor: 'pointer' }} onClick={onOpenDiagnostic}>
                  Try Deck Diagnostic →
                </span>
              </div>
            </div>

            {/* Feature 2 */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '20px',
              padding: '2.25rem',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#F0FDF4',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
                AI Investor Grill (Call 1 Simulation)
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6 }}>
                Face off with Devang Raja avatar in an interactive interrogation. Test your verbal clarity, financial defenses, and answer delivery with live speech analysis and reality checks.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981', cursor: 'pointer' }} onClick={onGetStarted}>
                  Simulate Call 1 →
                </span>
              </div>
            </div>

            {/* Feature 3 */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '20px',
              padding: '2.25rem',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#FAF5FF',
                color: '#7857FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <BarChart3 size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
                Financial Command & AI CFO
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6 }}>
                Deterministic scenario engine links directly to your hiring plan. Adjust sliders for headcount and revenue growth to calculate default runway and auto-generate 5-year forecasts.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7857FF', cursor: 'pointer' }} onClick={onGetStarted}>
                  Build Financial Model →
                </span>
              </div>
            </div>

            {/* Feature 4 */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '20px',
              padding: '2.25rem',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FolderLock size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
                Virtual Data Room & Due Diligence
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6 }}>
                Stage-aware document checklist customized from Pre-Seed to Series-B. Upload incorporation docs, cap tables, and contracts to run the automated AI due diligence verification scan.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D97706', cursor: 'pointer' }} onClick={onGetStarted}>
                  Setup Data Room →
                </span>
              </div>
            </div>

            {/* Feature 5 */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '20px',
              padding: '2.25rem',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#ECFEFF',
                color: '#0891B2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
                GTM Strategy & Sprint Verification
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6 }}>
                Track blended CAC across enterprise outbound, referrals, and content. Submit verifiable sprint proof directly to the AI evaluator to continuously boost your Fundability Score.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0891B2', cursor: 'pointer' }} onClick={onGetStarted}>
                  Track GTM Sprints →
                </span>
              </div>
            </div>

            {/* Feature 6 */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '20px',
              padding: '2.25rem',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#FFF1F2',
                color: '#E11D48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
                Verified Mentor Directory & Booking
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6 }}>
                Direct access to 40+ verified operators from Flipkart, Zomato, Razorpay, and top venture funds for 1-on-1 strategy sessions, cap table reviews, and pitch coaching.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E11D48', cursor: 'pointer' }} onClick={onGetStarted}>
                  Browse Mentors →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIVE INTERACTIVE DECK SCORER WIDGET ─────────────────────────────── */}
      <section style={{
        padding: '5rem 1.5rem',
        backgroundColor: '#F8FAFC',
        borderTop: '1px solid #E2E8F0',
        borderBottom: '1px solid #E2E8F0',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            boxShadow: '0 20px 50px -10px rgba(0,0,0,0.06)',
            border: '1px solid #CBD5E1',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="badge-pill" style={{ backgroundColor: '#EFF6FF', color: '#2563EB', marginBottom: '0.5rem' }}>
                ⚡ INSTANT BENCHMARK SIMULATOR
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0F172A' }}>
                Calculate Your Real-Time Fundability Vector
              </h2>
              <p style={{ fontSize: '1rem', color: '#64748B' }}>
                Simulate how institutional algorithms rate your startup stage and monthly recurring revenue.
              </p>
            </div>

            <form onSubmit={calculateScore} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              alignItems: 'flex-end',
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Startup Name
                </label>
                <input 
                  type="text" 
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Current Stage
                </label>
                <select
                  value={simStage}
                  onChange={(e) => setSimStage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="Pre-Seed">Pre-Seed (Ideation / MVP)</option>
                  <option value="Seed">Seed (Initial Traction)</option>
                  <option value="Series-A">Series-A (Predictable Engine)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Monthly Revenue (₹ Lakhs)
                </label>
                <input 
                  type="number" 
                  value={simMrr}
                  onChange={(e) => setSimMrr(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                  }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="btn-cyan"
                  style={{
                    width: '100%',
                    padding: '0.8rem 1.25rem',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                  }}
                >
                  <Sparkles size={16} />
                  Compute Score
                </button>
              </div>
            </form>

            {simCalculated && (
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                borderRadius: '16px',
                backgroundColor: '#F0F9FF',
                border: '1px solid #BAE6FD',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#0284C7',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    fontFamily: 'var(--font-heading)',
                  }}>
                    {simScore}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                      {simName} — Predicted Readiness: {simScore}/100
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#0369A1' }}>
                      At ₹{simMrr}L/mo in {simStage}, you qualify for Tier-1 Angel Syndicates & Seed Micro-VCs.
                    </div>
                  </div>
                </div>

                <button
                  onClick={onGetStarted}
                  className="btn-primary"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                >
                  Unlock Full Report →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── FOUNDER TESTIMONIALS ────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge-pill" style={{ backgroundColor: '#F0FDF4', color: '#10B981', marginBottom: '0.5rem' }}>
              ✦ BACKED BY RESULTS
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0F172A' }}>
              Trusted by 450+ High-Conviction Founders
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', gap: '4px', color: '#F59E0B', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" />)}
              </div>
              <p style={{ fontSize: '0.96rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                "The AI Investor Grill flagged our 14-month payback drag before our lead partner meeting with Blume. We restructured our upfront annual contracts and secured a ₹5 Cr term sheet in 3 weeks."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  RS
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>Rahul Sharma</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Founder, AvasPlot (Raised ₹4 Cr Seed)</div>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', gap: '4px', color: '#F59E0B', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" />)}
              </div>
              <p style={{ fontSize: '0.96rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                "Having the deterministic financial forecast with runway sensitivity pre-built saved us $8,000 in fractional CFO fees. Our virtual data room passed due diligence with zero legal objections."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#7857FF', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  PI
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>Priya Iyer</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Co-founder, FinFlow (Raised ₹18 Cr Series-A)</div>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', gap: '4px', color: '#F59E0B', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" />)}
              </div>
              <p style={{ fontSize: '0.96rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                "As a deep-tech founder without a business background, the stage-aware guidance showed me exactly what angel investors needed to see instead of vanity waitlist screenshots."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  AP
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>Dr. Amit Patel</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Founder, HealthSync (Pre-Seed)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FREQUENTLY ASKED QUESTIONS ─────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge-pill" style={{ backgroundColor: '#F0F5FF', color: '#2563EB', marginBottom: '0.5rem' }}>
              ✦ GOT QUESTIONS?
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0F172A' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '1.02rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown 
                      size={18} 
                      color="#64748B" 
                      style={{ 
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                      }} 
                    />
                  </button>
                  {isOpen && (
                    <div style={{
                      padding: '0 1.5rem 1.25rem 1.5rem',
                      fontSize: '0.94rem',
                      color: '#64748B',
                      lineHeight: 1.6,
                      borderTop: '1px solid #F1F5F9',
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA BANNER ────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 50%, #FAF5FF 100%)',
        color: 'var(--text-primary)',
        padding: '6rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {/* Subtle colorful Glow orb */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '640px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 50%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <span className="badge-pill" style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid rgba(37, 99, 235, 0.25)',
            color: '#2563EB',
            marginBottom: '1.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={14} /> READY FOR INSTITUTIONAL CALL 1?
          </span>

          <h2 style={{
            fontSize: 'clamp(2.5rem, 4.5vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.12,
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-heading)',
            color: '#0F172A',
          }}>
            Start Optimizing Your <span className="text-gradient-primary">Fundability Vectors</span> Today.
          </h2>

          <p style={{
            fontSize: '1.15rem',
            color: '#64748B',
            maxWidth: '620px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6,
          }}>
            Join 450+ founders who stopped pitching blindly and closed institutional rounds with stage-aware conviction and verified financials.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={onGetStarted}
              className="btn-primary"
              style={{
                padding: '1.1rem 2.6rem',
                fontSize: '1.05rem',
                borderRadius: '999px',
              }}
            >
              <span>Launch Founder Studio Free</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{
        backgroundColor: '#FFFFFF',
        color: '#64748B',
        padding: '3.5rem 1.5rem',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.88rem',
      }}>
        <div style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img 
              src="/logo.png" 
              alt="WaouFund Logo" 
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '10px', 
                objectFit: 'contain',
                boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
              }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#0F172A', fontWeight: 800, fontSize: '1.15rem', fontFamily: 'var(--font-heading)' }}>
                Waou<span style={{ color: '#2563EB' }}>Fund</span>
              </span>
              <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>
                © 2026 WaouFund Intelligence Inc. Full-Stack Venture Infrastructure.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap' }}>
            <a href="#privacy" style={{ color: '#64748B', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</a>
            <a href="#terms" style={{ color: '#64748B', textDecoration: 'none', fontWeight: 500 }}>Terms of Service</a>
            <a href="#security" style={{ color: '#64748B', textDecoration: 'none', fontWeight: 500 }}>Security & Cloud API</a>
            <a href="#contact" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>Contact Founder Team</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
