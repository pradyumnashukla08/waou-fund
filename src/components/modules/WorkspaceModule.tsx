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
  const coreProfile = [
    { id: '1', title: 'Company Overview & Elevator Pitch', status: 'done', route: 'profile', icon: Building },
    { id: '2', title: `Product & Core Architecture (${startup.category || 'Tech'})`, status: 'done', route: 'diagnostic', icon: Layers },
    { id: '4', title: 'Founding Team Pedigree & Equity Split', status: 'done', route: 'profile', icon: Users },
    { id: '7', title: 'Fundraising Goal & Use of Funds', status: 'done', route: 'finance', icon: DollarSign },
  ];

  const marketMetrics = [
    { id: '3', title: 'Market Opportunity & Concentric TAM', status: 'done', route: 'market', icon: PieChart },
    { id: '5', title: 'Traction & 6-Month MRR Expansion', status: 'done', route: 'market', icon: TrendingUp },
  ];

  const aiVerification = [
    { id: '6', title: 'Virtual Data Room & AI Diligence Scan', status: 'pending', route: 'dataroom', icon: ShieldCheck },
  ];

  const allItems = [...coreProfile, ...marketMetrics, ...aiVerification];
  const completedCount = allItems.filter((i) => i.status === 'done').length;
  const progressPercent = Math.round((completedCount / allItems.length) * 100);

  let readinessLevel = 'Level 1: Ideation';
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
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: cardProgress === 100 ? '#10B981' : '#38BDF8' }}>
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
                    backgroundColor: isDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    color: isDone ? '#10B981' : '#38BDF8',
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
                    <div style={{ fontSize: '0.72rem', color: isDone ? '#10B981' : '#F59E0B', fontWeight: 800 }}>
                      {isDone ? 'COMPLETED' : 'ACTION REQUIRED'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Inspect</span>
                  <ArrowRight size={14} color="var(--text-hint)" />
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
