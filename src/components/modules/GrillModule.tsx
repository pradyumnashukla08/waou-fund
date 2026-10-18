import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle,
  Award,
  Volume2,
  AlertCircle
} from 'lucide-react';
import { StartupProfile, AI_INVESTOR_ROUNDS } from '../../data/defaultData';
import { ClarityVerdict, QAPair } from '../../types';
import { api } from '../../services/api';

interface GrillModuleProps {
  startup: StartupProfile;
  setActiveTab: (tab: string) => void;
}

export const GrillModule: React.FC<GrillModuleProps> = ({ startup, setActiveTab }) => {
  const [phase, setPhase] = useState<'lobby' | 'drilling' | 'verdict'>(() => {
    try {
      return (sessionStorage.getItem('waou_grill_phase') as any) || 'lobby';
    } catch {
      return 'lobby';
    }
  });
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem('waou_grill_round');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem('waou_grill_question');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [currentAnswer, setCurrentAnswer] = useState<string>(() => {
    try {
      return sessionStorage.getItem('waou_grill_answer') || '';
    } catch {
      return '';
    }
  });
  const [qaHistory, setQaHistory] = useState<QAPair[]>(() => {
    try {
      const saved = sessionStorage.getItem('waou_grill_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [verdict, setVerdict] = useState<ClarityVerdict | null>(() => {
    try {
      const saved = sessionStorage.getItem('waou_grill_verdict');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [evalError, setEvalError] = useState<string | null>(null);

  // Synchronize grill state to sessionStorage so accidental refresh never restarts interrogation
  useEffect(() => {
    try {
      sessionStorage.setItem('waou_grill_phase', phase);
      sessionStorage.setItem('waou_grill_round', String(currentRoundIdx));
      sessionStorage.setItem('waou_grill_question', String(currentQuestionIdx));
      sessionStorage.setItem('waou_grill_answer', currentAnswer);
      sessionStorage.setItem('waou_grill_history', JSON.stringify(qaHistory));
      if (verdict) {
        sessionStorage.setItem('waou_grill_verdict', JSON.stringify(verdict));
      } else {
        sessionStorage.removeItem('waou_grill_verdict');
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [phase, currentRoundIdx, currentQuestionIdx, currentAnswer, qaHistory, verdict]);

  const rounds = AI_INVESTOR_ROUNDS;
  const currentRound = rounds[currentRoundIdx];
  const currentQuestion = currentRound?.questions[currentQuestionIdx];

  // Recording timer simulation
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartGrill = () => {
    setPhase('drilling');
    setCurrentRoundIdx(0);
    setCurrentQuestionIdx(0);
    setQaHistory([]);
    setCurrentAnswer('');
    setVerdict(null);
    try {
      sessionStorage.removeItem('waou_grill_phase');
      sessionStorage.removeItem('waou_grill_round');
      sessionStorage.removeItem('waou_grill_question');
      sessionStorage.removeItem('waou_grill_answer');
      sessionStorage.removeItem('waou_grill_history');
      sessionStorage.removeItem('waou_grill_verdict');
    } catch {}
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      if (!currentAnswer.trim()) {
        const mrrText = startup.mrr ? (startup.mrr.startsWith('₹') ? startup.mrr : `₹${startup.mrr}`) : '₹12 Lakhs';
        setCurrentAnswer(
          `Our verified MRR is ${mrrText} with +18% MoM growth. Our largest client accounts for 24% of ARR, which is down from 45% last quarter as we diversified into 6 new enterprise accounts.`
        );
      }
    } else {
      setIsRecording(true);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return;

    const newQa: QAPair = {
      round_title: currentRound.round_title,
      question: currentQuestion.question,
      answer: currentAnswer.trim(),
    };
    const updatedHistory = [...qaHistory, newQa];
    setQaHistory(updatedHistory);
    setCurrentAnswer('');
    setIsRecording(false);

    // Advance to next question or next round
    if (currentQuestionIdx + 1 < currentRound.questions.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else if (currentRoundIdx + 1 < rounds.length) {
      setCurrentRoundIdx(currentRoundIdx + 1);
      setCurrentQuestionIdx(0);
    } else {
      // Completed all rounds -> Generate Verdict
      setIsLoading(true);
      setEvalError(null);
      try {
        const res = await api.evaluateInvestorAnswer(
          updatedHistory.map((item) => ({ question: item.question, answer: item.answer || '' })),
          startup
        );
        setVerdict(res);
        setPhase('verdict');
      } catch (err: any) {
        console.warn('Investor grill evaluation error:', err);
        setEvalError(err.message || 'Investor grill evaluation is currently offline.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSkipQuestion = () => {
    const newQa: QAPair = {
      round_title: currentRound.round_title,
      question: currentQuestion.question,
      answer: '[SKIPPED BY FOUNDER - UNSURE OF METRICS]',
    };
    const updatedHistory = [...qaHistory, newQa];
    setQaHistory(updatedHistory);

    if (currentQuestionIdx + 1 < currentRound.questions.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else if (currentRoundIdx + 1 < rounds.length) {
      setCurrentRoundIdx(currentRoundIdx + 1);
      setCurrentQuestionIdx(0);
    } else {
      setIsLoading(true);
      setEvalError(null);
      api.evaluateInvestorAnswer(
        updatedHistory.map((item) => ({ question: item.question, answer: item.answer || '' })),
        startup
      ).then((res) => {
        setVerdict(res);
        setPhase('verdict');
      }).catch((err: any) => {
        console.warn('Investor grill evaluation error:', err);
        setEvalError(err.message || 'Investor grill evaluation is currently offline.');
      }).finally(() => {
        setIsLoading(false);
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#2563EB',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <Cpu size={14} />
          <span>SIMULATED VC COMMITTEE • CALL 1 INTERROGATION</span>
        </div>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.2rem)',
          fontWeight: 900,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-heading)',
          marginTop: '0.2rem',
        }}>
          AI Investor Grill (Devang Raja Simulation)
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Test your verbal pitch conviction, financial defenses, and stage readiness with ruthless VC questioning before you step into real partner meetings.
        </p>
      </div>

      {evalError && (
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          color: '#991B1B',
          maxWidth: '850px',
          margin: '0 auto',
          width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={22} color="#DC2626" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.94rem' }}>AI Partner Evaluator Notice</div>
              <div style={{ fontSize: '0.85rem', color: '#B91C1C' }}>{evalError}</div>
            </div>
          </div>
          <button
            onClick={() => {
              setEvalError(null);
              setIsLoading(true);
              api.evaluateInvestorAnswer(
                qaHistory.map((item) => ({ question: item.question, answer: item.answer || '' })),
                startup
              ).then((res) => {
                setVerdict(res);
                setPhase('verdict');
              }).catch((err: any) => {
                setEvalError(err.message || 'Retry failed. AI service is currently unreachable.');
              }).finally(() => {
                setIsLoading(false);
              });
            }}
            className="btn-cyan"
            style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
          >
            Retry Analysis
          </button>
        </div>
      )}

      {/* ── PHASE 1: LOBBY ─────────────────────────────────────────────── */}
      {phase === 'lobby' && (
        <div className="card-elevated" style={{
          borderRadius: '24px',
          padding: '3rem 2.5rem',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%',
        }}>
          {/* Avatar representation */}
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
            margin: '0 auto 1.5rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 35px rgba(6, 182, 212, 0.4)',
            border: '3px solid rgba(255, 255, 255, 0.2)',
          }}>
            <Cpu size={48} color="#FFFFFF" />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Welcome to Call 1. I'm Devang Raja.
          </h2>
          <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto 2rem auto' }}>
            "Across our global network of over 5,000 institutional investors, we evaluate startups strictly against verified stage maturity. For {startup.stage} founders, I will drill your unit economics, customer concentration, and distribution defensibility. Let's inspect how battle-ready you are."
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: '1rem',
            textAlign: 'left',
            marginBottom: '2.5rem',
          }}>
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-brand)', fontWeight: 800 }}>ROUND 1</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>Stage Maturity Truth</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Verified MRR & client concentration</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 800 }}>ROUND 2</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>Unit Economics & Burn</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Payback period & runway defense</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 800 }}>ROUND 3</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>Defensibility & Moats</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Why giants cannot clone you</div>
            </div>
          </div>

          <button
            onClick={handleStartGrill}
            className="btn-cyan"
            style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem' }}
          >
            <span>Begin Call 1 Interrogation</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* ── PHASE 2: DRILLING INTERACTION ──────────────────────────────── */}
      {phase === 'drilling' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px', margin: '0 auto', width: '100%' }}>
          {/* Round Header Bar */}
          <div className="card-elevated" style={{
            borderRadius: '16px',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563EB', letterSpacing: '0.08em' }}>
                ROUND {currentRound.round_number} OF {rounds.length} • QUESTION {currentQuestionIdx + 1}/{currentRound.questions.length}
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {currentRound.round_title}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {rounds.map((r, i) => (
                <div
                  key={i}
                  style={{
                    width: '32px',
                    height: '6px',
                    borderRadius: '4px',
                    backgroundColor: i < currentRoundIdx ? '#10B981' : (i === currentRoundIdx ? '#06B6D4' : 'rgba(255, 255, 255, 0.1)'),
                  }}
                />
              ))}
            </div>
          </div>

          {/* Question Card */}
          <div className="card-elevated" style={{
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            boxShadow: '0 10px 40px rgba(6, 182, 212, 0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--text-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Volume2 size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '0.06em' }}>
                  DEVANG RAJA'S INTERROGATION:
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                  "{currentQuestion.question}"
                </h3>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                  Reason: {currentQuestion.reason}
                </span>
              </div>
            </div>

            {/* Simulated Animated Soundwave Display if Recording */}
            {isRecording && (
              <div style={{
                backgroundColor: 'var(--accent-bg-rose)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '14px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#EF4444',
                    animation: 'pulse 1s infinite',
                  }} />
                  <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#EF4444' }}>
                    RECORDING LIVE AUDIO • {recordingSeconds}s
                  </span>
                </div>

                {/* Animated Soundwave bars */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {[16, 28, 44, 20, 36, 12, 32, 48, 22, 38, 18, 30].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        width: '3px',
                        height: `${h}px`,
                        backgroundColor: '#38BDF8',
                        borderRadius: '2px',
                        animation: `soundwave 0.8s infinite ease-in-out ${i * 0.05}s alternate`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Answer Input Textarea */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Your Verbal Defense (Speak into microphone or type answer):
              </label>
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="State your metrics, cohort data, and customer retention numbers clearly..."
                rows={4}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                  lineHeight: 1.5,
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Actions Bar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginTop: '1.25rem',
            }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={handleToggleRecord}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '12px',
                    backgroundColor: isRecording ? '#EF4444' : 'rgba(56, 189, 248, 0.15)',
                    border: isRecording ? '1px solid #DC2626' : '1px solid rgba(56, 189, 248, 0.4)',
                    color: isRecording ? '#FFFFFF' : '#38BDF8',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                  <span>{isRecording ? 'Stop & Transcribe' : 'Simulate Voice Input'}</span>
                </button>

                <button
                  onClick={handleSkipQuestion}
                  style={{
                    padding: '0.65rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Skip Question
                </button>
              </div>

              <button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim() && !isRecording}
                className="btn-cyan"
                style={{
                  padding: '0.65rem 1.5rem',
                  fontSize: '0.9rem',
                  opacity: (!currentAnswer.trim() && !isRecording) ? 0.5 : 1,
                }}
              >
                <span>Submit Response</span>
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PHASE 3: VERDICT & CLARITY SCORE ──────────────────────────── */}
      {phase === 'verdict' && verdict && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px', margin: '0 auto', width: '100%' }}>
          <div className="card-elevated" style={{
            borderRadius: '24px',
            padding: '2.5rem',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
          }}>
            {/* Verdict Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <span className="badge-pill" style={{ backgroundColor: 'var(--accent-bg-emerald)', color: '#34D399', marginBottom: '0.5rem' }}>
                  ✦ CALL 1 COMPLETED
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  {verdict.fundability_verdict}
                </h2>
              </div>

              <div style={{
                textAlign: 'right',
                backgroundColor: 'var(--bg-secondary)',
                padding: '0.75rem 1.25rem',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800 }}>VERBAL CLARITY SCORE</span>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                  {verdict.clarity_score}/100
                </div>
              </div>
            </div>

            {/* 4 Vector Scores Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>PITCH CLARITY</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-brand)' }}>{verdict.vector_scores.pitch_clarity}%</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>FINANCIAL DEFENSE</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#D97706' }}>{verdict.vector_scores.financial_defense}%</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>STAGE MATURITY</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#10B981' }}>{verdict.vector_scores.stage_readiness}%</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>MARKET MASTERY</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#A855F7' }}>{verdict.vector_scores.market_mastery}%</div>
              </div>
            </div>

            {/* Devang's Reality Check Feedback */}
            <div style={{
              backgroundColor: 'rgba(6, 182, 212, 0.08)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              marginBottom: '2rem',
            }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                DEVANG RAJA'S REALITY CHECK:
              </div>
              <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                "{verdict.devang_reality_check}"
              </p>
            </div>

            {/* Actionable Directives */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                CRITICAL REVISIONS TO MAKE BEFORE REAL INVESTOR PITCHES:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {verdict.actionable_improvements.map((dir, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.88rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <CheckCircle2 size={16} color="#10B981" />
                    <span>{dir}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                onClick={handleStartGrill}
                className="btn-outline"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <RotateCcw size={16} />
                <span>Practice Another Drill</span>
              </button>

              <button
                onClick={() => setActiveTab('actionplan')}
                className="btn-cyan"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                <span>Synchronize Action Plan</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
