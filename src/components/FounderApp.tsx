import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Cpu, 
  Calculator, 
  Database, 
  TrendingUp, 
  Rocket, 
  ShieldCheck, 
  Scale, 
  Users, 
  User, 
  Sparkles,
  LogOut
} from 'lucide-react';
import { StartupProfile } from '../data/defaultData';
import { EvaluationResult } from '../types';

import { DashboardModule } from './modules/DashboardModule';
import { WorkspaceModule } from './modules/WorkspaceModule';
import { DiagnosticModule } from './modules/DiagnosticModule';
import { GrillModule } from './modules/GrillModule';
import { FinanceModule } from './modules/FinanceModule';
import { DataRoomModule } from './modules/DataRoomModule';
import { MarketTractionModule } from './modules/MarketTractionModule';
import { GTMModule } from './modules/GTMModule';
import { ActionPlanModule } from './modules/ActionPlanModule';
import { LegalDocsModule } from './modules/LegalDocsModule';
import { MentorsModule } from './modules/MentorsModule';
import { ProfileTeaserModule } from './modules/ProfileTeaserModule';

interface FounderAppProps {
  startup: StartupProfile;
  onUpdateStartup: (s: StartupProfile) => void;
  evaluation: EvaluationResult;
  onUpdateEvaluation: (res: EvaluationResult) => void;
  streakCount: number;
  openStreakModal: () => void;
  isDailyTaskDone: boolean;
  toggleDailyTask: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSignOut?: () => void;
}

export const FounderApp: React.FC<FounderAppProps> = ({
  startup,
  onUpdateStartup,
  evaluation,
  onUpdateEvaluation,
  streakCount,
  openStreakModal,
  isDailyTaskDone,
  toggleDailyTask,
  activeTab,
  setActiveTab,
  onSignOut,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'HOT' },
    { id: 'workspace', label: 'Readiness Hub', icon: Briefcase },
    { id: 'diagnostic', label: 'Deck Diagnostic', icon: FileText, badge: 'AI' },
    { id: 'grill', label: 'AI Investor Grill', icon: Cpu, badge: 'CALL 1' },
    { id: 'finance', label: 'Financial Command', icon: Calculator },
    { id: 'dataroom', label: 'Virtual Data Room', icon: Database },
    { id: 'market', label: 'Market & Traction', icon: TrendingUp },
    { id: 'gtm', label: 'GTM Strategy', icon: Rocket },
    { id: 'actionplan', label: 'Action Plan', icon: ShieldCheck },
    { id: 'legaldocs', label: 'Legal Standards', icon: Scale },
    { id: 'mentors', label: 'Mentor Directory', icon: Users },
    { id: 'profile', label: 'Profile & 1-Pager', icon: User },
  ];

  return (
    <div className="bg-app-surface" style={{
      minHeight: 'calc(100dvh - 64px)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      overflowX: 'hidden',
    }}>
      {/* ── Mobile Horizontal Tab Navigation (Visible on mobile only) ────────────────── */}
      <div className="show-on-mobile mobile-tabs-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`mobile-tab-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={14} color={isActive ? '#FFFFFF' : 'currentColor'} />
              <span>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: '0.62rem',
                  padding: '1px 5px',
                  borderRadius: '6px',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--accent-bg-blue)',
                  color: isActive ? '#FFFFFF' : 'var(--text-brand)',
                  fontWeight: 800,
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flex: 1, width: '100%', minWidth: 0 }}>
        {/* ── Left Sidebar Navigation (Desktop) ──────────────────────────────────── */}
        <aside className="sidebar-desktop" style={{
          width: '280px',
          flexShrink: 0,
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid var(--border-subtle)',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          overflowY: 'auto',
        }}>
        {/* Startup Card Mini */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
              <span style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {startup.name || 'Your Venture'}
              </span>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                backgroundColor: startup.fundabilityScore ? 'var(--accent-bg-emerald)' : 'var(--bg-secondary)',
                color: startup.fundabilityScore ? '#10B981' : 'var(--text-hint)',
                border: '1px solid var(--border-subtle)',
                padding: '2px 8px',
                borderRadius: '6px',
              }}>
                {startup.fundabilityScore ? `${startup.fundabilityScore}/100` : 'Not Scored'}
              </span>
            </div>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            {startup.stage || 'Seed'} {startup.category ? `• ${startup.category}` : ''}
          </div>
          <div style={{
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: 'var(--text-brand)',
            fontWeight: 600,
          }}>
            <span>Ask: {startup.targetAsk && startup.targetAsk !== '₹0' && startup.targetAsk !== '0' ? startup.targetAsk : 'Not Set'}</span>
            <span>MRR: {startup.mrr && startup.mrr !== '₹0' && startup.mrr !== '0' ? (startup.mrr.startsWith('₹') ? startup.mrr : `₹${startup.mrr}`) : 'Not Set'}</span>
          </div>
        </div>

        {/* Navigation Items List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            color: 'var(--text-hint)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0 0.75rem 0.5rem 0.75rem',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={11} color="var(--text-brand)" />
              Modules
            </span>
          </div>

          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <IconComponent size={18} color={isActive ? 'var(--text-brand)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: '0.86rem', fontWeight: isActive ? 700 : 500 }}>
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span style={{
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: isActive ? 'var(--color-brand-600)' : 'var(--bg-secondary)',
                    color: isActive ? '#FFFFFF' : 'var(--text-hint)',
                    letterSpacing: '0.04em',
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Logout */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
        }}>
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="btn-outline"
              title="Sign out of your session"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.55rem',
                padding: '0.7rem 1rem',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#DC2626',
                backgroundColor: '#FEF2F2',
                borderColor: '#FEE2E2',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FEE2E2';
                e.currentTarget.style.borderColor = '#FCA5A5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FEF2F2';
                e.currentTarget.style.borderColor = '#FEE2E2';
              }}
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* ── Main Workspace Content Area ──────────────────────────────── */}
      <main 
        className="founder-main-content"
        style={{
          flex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          overflowY: 'auto',
          minWidth: 0,
        }}
      >
        {activeTab === 'dashboard' && (
          <DashboardModule 
            startup={startup} 
            evaluation={evaluation} 
            streakCount={streakCount}
            isDailyTaskDone={isDailyTaskDone}
            toggleDailyTask={toggleDailyTask}
            openStreakModal={openStreakModal}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'workspace' && (
          <WorkspaceModule 
            startup={startup} 
            evaluation={evaluation} 
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'diagnostic' && (
          <DiagnosticModule 
            startup={startup}
            evaluation={evaluation} 
            onUpdateEvaluation={onUpdateEvaluation} 
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'grill' && (
          <GrillModule 
            startup={startup} 
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceModule 
            startup={startup} 
            evaluation={evaluation}
          />
        )}

        {activeTab === 'dataroom' && (
          <DataRoomModule 
            startup={startup} 
            evaluation={evaluation} 
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'market' && (
          <MarketTractionModule 
            startup={startup} 
            evaluation={evaluation}
          />
        )}

        {activeTab === 'gtm' && (
          <GTMModule 
            startup={startup} 
            evaluation={evaluation}
          />
        )}

        {activeTab === 'actionplan' && (
          <ActionPlanModule 
            evaluation={evaluation} 
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'legaldocs' && (
          <LegalDocsModule startup={startup} />
        )}

        {activeTab === 'mentors' && (
          <MentorsModule />
        )}

        {activeTab === 'profile' && (
          <ProfileTeaserModule 
            startup={startup} 
            onUpdateStartup={onUpdateStartup} 
            evaluation={evaluation}
          />
        )}
      </main>
      </div>
    </div>
  );
};
