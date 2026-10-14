import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Mail, Lock, User, Sparkles } from 'lucide-react';
import { UserRole } from '../types/user';

interface AuthScreenProps {
  onComplete: (email: string, name: string, role: UserRole) => void;
}

const ROLE_OPTIONS: { id: UserRole; label: string; icon: string; description: string; tagline: string }[] = [
  {
    id: 'founder',
    label: 'Founder',
    icon: '🚀',
    description: 'Building & fundraising',
    tagline: 'Get your startup investment-ready with AI-powered diligence, deck diagnostics, and a virtual data room.',
  },
  {
    id: 'angel',
    label: 'Angel Investor',
    icon: '😇',
    description: 'Investing as an individual',
    tagline: 'Discover and evaluate high-conviction deals with institutional-grade startup scoring.',
  },
  {
    id: 'vc',
    label: 'VC / Fund',
    icon: '🏦',
    description: 'Managing a fund',
    tagline: 'Streamline deal flow, run automated diligence, and benchmark portfolio companies.',
  },
];

type Step = 'login' | 'role';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; name?: string; password?: string }>({});

  const validateLogin = () => {
    const errs: typeof errors = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Valid email required';
    if (isSignup && (!name || name.trim().length < 2)) errs.name = 'Full name required';
    if (!password || password.length < 6) errs.password = 'Min 6 characters required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    // Simulate auth delay
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setStep('role');
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setName('Founder User');
    setEmail('founder@example.com');
    setLoading(false);
    setStep('role');
  };

  const handleRoleSubmit = () => {
    if (!role) return;
    onComplete(email, name || 'Founder', role);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 40%, #F0F9FF 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient orbs */}
      <div style={{ position: 'absolute', top: '-120px', left: '-120px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-120px', right: '-120px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: step === 'role' ? '760px' : '440px',
        transition: 'max-width 0.35s ease',
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <img src="/logo.png" alt="WaouFund" style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} />
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>
              Waou<span style={{ color: '#2563EB' }}>Fund</span>
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 500 }}>AI-Powered Fundraising Intelligence</p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 20px 60px rgba(0,0,0,0.07)',
          overflow: 'hidden',
        }}>
          {step === 'login' && (
            <div style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.4rem' }}>
                {isSignup ? 'Create your account' : 'Welcome back'}
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#64748B', marginBottom: '2rem' }}>
                {isSignup ? 'Start your fundraising intelligence journey today.' : 'Sign in to your WaouFund workspace.'}
              </p>

              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: '1.5px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  fontSize: '0.94rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  marginBottom: '1.5rem',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
                <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>OR</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
              </div>

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {isSignup && (
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                      <input
                        type="text"
                        value={name}
                        onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                        placeholder="Rahul Sharma"
                        style={{
                          width: '100%',
                          padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                          borderRadius: '10px',
                          border: `1.5px solid ${errors.name ? '#EF4444' : '#E2E8F0'}`,
                          fontSize: '0.94rem',
                          color: '#0F172A',
                          outline: 'none',
                          boxSizing: 'border-box',
                          backgroundColor: '#F8FAFC',
                        }}
                      />
                    </div>
                    {errors.name && <p style={{ fontSize: '0.78rem', color: '#EF4444', marginTop: '4px' }}>{errors.name}</p>}
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none', zIndex: 2 }} />
                    <input
                      id="auth-email-input"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                      placeholder="you@startup.com"
                      style={{
                        display: 'block',
                        width: '100%',
                        height: '46px',
                        minHeight: '46px',
                        padding: '0.75rem 0.75rem 0.75rem 2.6rem',
                        borderRadius: '10px',
                        border: `1.5px solid ${errors.email ? '#EF4444' : '#E2E8F0'}`,
                        fontSize: '0.94rem',
                        color: '#0F172A',
                        outline: 'none',
                        boxSizing: 'border-box',
                        backgroundColor: '#F8FAFC',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                      }}
                    />
                  </div>
                  {errors.email && <p style={{ fontSize: '0.78rem', color: '#EF4444', marginTop: '4px' }}>{errors.email}</p>}
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                      placeholder="Min 6 characters"
                      style={{
                        width: '100%',
                        padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                        borderRadius: '10px',
                        border: `1.5px solid ${errors.password ? '#EF4444' : '#E2E8F0'}`,
                        fontSize: '0.94rem',
                        color: '#0F172A',
                        outline: 'none',
                        boxSizing: 'border-box',
                        backgroundColor: '#F8FAFC',
                      }}
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0 }}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p style={{ fontSize: '0.78rem', color: '#EF4444', marginTop: '4px' }}>{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.96rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                    boxShadow: '0 8px 20px rgba(37,99,235,0.3)',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? (
                    <span>Verifying…</span>
                  ) : (
                    <>
                      <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#64748B' }}>
                {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                <button
                  onClick={() => { setIsSignup(v => !v); setErrors({}); }}
                  style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}
                >
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          )}

          {step === 'role' && (
            <div style={{ padding: '2.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#EFF6FF', color: '#2563EB', padding: '6px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  <Sparkles size={14} />
                  Step 2 of 3 — Role Selection
                </div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.4rem' }}>
                  What best describes you?
                </h2>
                <p style={{ fontSize: '0.92rem', color: '#64748B' }}>
                  We'll customize your WaouFund experience based on your role.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {ROLE_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setRole(opt.id)}
                    style={{
                      padding: '1.5rem 1.25rem',
                      borderRadius: '16px',
                      border: `2px solid ${role === opt.id ? '#2563EB' : '#E2E8F0'}`,
                      backgroundColor: role === opt.id ? '#EFF6FF' : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.18s ease',
                      boxShadow: role === opt.id ? '0 4px 16px rgba(37,99,235,0.15)' : 'none',
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{opt.icon}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: role === opt.id ? '#1D4ED8' : '#0F172A', marginBottom: '0.3rem' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: role === opt.id ? '#3B82F6' : '#64748B', fontWeight: 500 }}>
                      {opt.description}
                    </div>
                  </button>
                ))}
              </div>

              {role && (
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: '#F0F9FF',
                  border: '1px solid #BAE6FD',
                  marginBottom: '1.5rem',
                  fontSize: '0.88rem',
                  color: '#0369A1',
                  lineHeight: 1.5,
                }}>
                  <strong>✦ {ROLE_OPTIONS.find(o => o.id === role)?.label}:</strong>{' '}
                  {ROLE_OPTIONS.find(o => o.id === role)?.tagline}
                </div>
              )}

              <button
                onClick={handleRoleSubmit}
                disabled={!role}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: '12px',
                  background: role ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : '#E2E8F0',
                  color: role ? '#FFFFFF' : '#94A3B8',
                  fontWeight: 800,
                  fontSize: '0.96rem',
                  border: 'none',
                  cursor: role ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: role ? '0 8px 20px rgba(37,99,235,0.25)' : 'none',
                }}
              >
                <span>Continue to Data Room</span>
                <ArrowRight size={17} />
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.78rem', color: '#94A3B8' }}>
          Bank-grade 256-bit AES encryption · Your data is never used to train AI models · SOC2 Compliant
        </p>
      </div>
    </div>
  );
};
