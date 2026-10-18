import React from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  PieChart, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  DollarSign, 
  Building,
  Sparkles
} from 'lucide-react';
import { StartupProfile } from '../../data/defaultData';
import { EvaluationResult } from '../../types';

interface WorkspaceModuleProps {
  startup: StartupProfile;
  evaluation: EvaluationResult;
  setActiveTab: (tab: string) => void;
}

export const WorkspaceModule: React.FC<WorkspaceModuleProps> = ({ startup, evaluation, setActiveTab }) => {
  // Real dynamic checks based on actual user data
  const hasCompany = Boolean(
    (startup.companyName || startup.name) && 
    startup.pitch && 
    startup.pitch.trim().length > 10
  );

  const hasProduct = Boolean(
    startup.productStatus && 
    startup.problemValidation && 
    startup.problemValidation.trim().length > 10
  );

  const hasTeam = Boolean(
    (startup.team && startup.team.length > 0) || 
    (startup.linkedinUrl && startup.linkedinUrl.trim().length > 10 && startup.fullName)
  );

  const hasFundraising = Boolean(
    startup.targetRaise && 
    startup.targetRaise !== '0' && 
    startup.targetRaise !== '' && 
    startup.valuationCap && 
    startup.valuationCap !== '0' &&
    startup.valuationCap !== ''
  );

  const hasMarket = Boolean(
    startup.tam && 
    startup.tam !== '0' && 
    startup.tam !== '' && 
    startup.tam !== 'Not defined' &&
    startup.sam && 
    startup.sam !== '0' &&
    startup.sam !== 'Not defined'
  );

  const hasTraction = Boolean(
    startup.currentMrr && 
    startup.currentMrr !== '0' && 
    startup.currentMrr !== '' && 
    startup.momGrowth && 
    startup.momGrowth !== '0'
  );

  const hasDataRoom = Boolean(
    (() => {
      try {
        if (sessionStorage.getItem('waou_dataroom_verified') === 'true') return true;
        const raw = sessionStorage.getItem('waou_dataroom_docs');
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) return false;
        if (startup.id === 'user_active_startup' && parsed.some((d: any) => d.name?.includes('Seed_Pitch_Deck_V3.pdf'))) {
          return false;
        }
        return parsed.length > 0;
      } catch {
        return false;
      }
    })()
  );

  const coreProfile = [
    { id: '1', title: 'Company Overview & Elevator Pitch', status: hasCompany ? 'done' : 'pending', route: 'profile', icon: Building },
    { id: '2', title: `Product & Core Architecture (${startup.category || 'Tech'})`, status: hasProduct ? 'done' : 'pending', route: 'diagnostic', icon: Layers },
    { id: '4', title: 'Founding Team Pedigree & Equity Split', status: hasTeam ? 'done' : 'pending', route: 'profile', icon: Users },
    { id: '7', title: 'Fundraising Goal & Use of Funds', status: hasFundraising ? 'done' : 'pending', route: 'finance', icon: DollarSign },
  ];

  const marketMetrics = [
    { id: '3', title: 'Market Opportunity & Concentric TAM', status: hasMarket ? 'done' : 'pending', route: 'market', icon: PieChart },
    { id: '5', title: 'Traction & 6-Month MRR Expansion', status: hasTraction ? 'done' : 'pending', route: 'market', icon: TrendingUp },
  ];

  const aiVerification = [
    { id: '6', title: 'Virtual Data Room & AI Diligence Scan', status: hasDataRoom ? 'done' : 'pending', route: 'dataroom', icon: ShieldCheck },
  ];

  const allItems = [...coreProfile, ...marketMetrics, ...aiVerification];
  const completedCount = allItems.filter((i) => i.status === 'done').length;
  const progressPercent = Math.round((completedCount / allItems.length) * 100);

  let readinessLevel = 'Level 1: Profile Incomplete';
  if (progressPercent >= 100) readinessLevel = 'Level 3: Investor Ready';
  else if (progressPercent >= 50) readinessLevel = 'Level 2: Data Room Build';

  const renderGroup = (title: string, items: typeof coreProfile) => {
    const cardCompleted = items.filter((i) => i.status === 'done').length;
    const cardProgress = Math.round((cardCompleted / items.length) * 100);

    return (
      <div className="card-elevated" style={{ borderRadius: '20px', padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: cardProgress === 100 ? '#10B981' : 'var(--text-hint)' }}>
            {cardProgress}% COMPLETE
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((item) => {
            const IconComp = item.icon;
            const isDone = item.status === 'done';
            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.route)}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: isDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.12)',
                    color: isDone ? '#10B981' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <IconComp size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: isDone ? '#10B981' : '#D97706', fontWeight: 800 }}>
                      {isDone ? 'COMPLETED' : 'ACTION REQUIRED'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.76rem', color: isDone ? 'var(--text-muted)' : 'var(--text-brand)', fontWeight: isDone ? 500 : 700 }}>
                    {isDone ? 'Inspect' : 'Complete Step'}
                  </span>
                  <ArrowRight size={14} color={isDone ? 'var(--text-hint)' : 'var(--text-brand)'} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
          <Briefcase size={14} />
          <span>STARTUP PROFILE & READINESS CHECKLIST</span>
        </div>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.2rem)',
          fontWeight: 900,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-heading)',
          marginTop: '0.2rem',
        }}>
          Workspace Readiness Hub
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Track end-to-end investor readiness across your core narrative, market sizing, financial projections, and due diligence assets.
        </p>
      </div>

      {/* Progress Bar Card */}
      <div className="card-elevated" style={{
        borderRadius: '20px',
        padding: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
      }}>
        <div>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: '8px',
            backgroundColor: 'var(--accent-bg-amber)',
            color: '#F59E0B',
          }}>
            {readinessLevel}
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
            Overall Completion: {progressPercent}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {completedCount} of {allItems.length} operational modules verified
          </div>
        </div>

        <div style={{ width: '280px' }}>
          <div style={{
            height: '10px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #2563EB 0%, #10B981 100%)',
              borderRadius: '999px',
            }} />
          </div>
        </div>
      </div>

      {/* Groups */}
      <div>
        {renderGroup('Core Startup Profile', coreProfile)}
        {renderGroup('Market Scope & Traction Verification', marketMetrics)}
        {renderGroup('AI Due Diligence & Data Room', aiVerification)}
      </div>
    </div>
  );
};
