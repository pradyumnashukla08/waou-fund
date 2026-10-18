import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Filter, 
  DollarSign, 
  Users, 
  Box, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { EvaluationResult, ActionStep } from '../../types';
import { generateActionSteps } from '../../utils/remediationMapper';

interface ActionPlanModuleProps {
  evaluation: EvaluationResult;
  setActiveTab: (tab: string) => void;
}

export const ActionPlanModule: React.FC<ActionPlanModuleProps> = ({ evaluation, setActiveTab }) => {
  const [tasks, setTasks] = useState<ActionStep[]>(() => {
    try {
      const saved = sessionStorage.getItem('waou_action_tasks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return generateActionSteps(evaluation.red_flags);
  });

  React.useEffect(() => {
    try {
      sessionStorage.setItem('waou_action_tasks', JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  React.useEffect(() => {
    setTasks(generateActionSteps(evaluation.red_flags));
  }, [evaluation.red_flags]);

  const [filter, setFilter] = useState<'all' | 'financial' | 'product' | 'team' | 'market'>('all');

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, isComplete: !t.isComplete } : t));
    setTasks(updated);

    const completedNow = updated.find((t) => t.id === id)?.isComplete;
    if (completedNow) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const completedCount = tasks.filter((t) => t.isComplete).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.type === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#EC4899',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <ShieldCheck size={14} />
          <span>ALGORITHMIC REMEDIATION KANBAN</span>
        </div>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.2rem)',
          fontWeight: 900,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-heading)',
          marginTop: '0.2rem',
        }}>
          Fundability Action Plan
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          The AI has mapped your risk vectors into actionable remediation milestones. Clear the board to elevate your fundability score to the 95th percentile.
        </p>
      </div>

      {/* ── Progress Completion Bar ───────────────────────────────────── */}
      <div className="card-elevated" style={{
        borderRadius: '20px',
        padding: '2rem',
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
            backgroundColor: progressPercent === 100 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(236, 72, 153, 0.15)',
            color: progressPercent === 100 ? '#10B981' : '#EC4899',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '0.06em' }}>
              BOARD COMPLETION RATE
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {completedCount} of {tasks.length} Directives Cleared ({progressPercent}%)
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {progressPercent === 100 ? 'All fatal vulnerabilities mitigated! Ready for syndicate review.' : 'Address pending items to boost term sheet conviction.'}
            </div>
          </div>
        </div>

        <div style={{ width: '260px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <span>Milestones</span>
            <span style={{ color: '#10B981', fontWeight: 800 }}>{progressPercent}%</span>
          </div>
          <div style={{
            height: '8px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #EC4899 0%, #10B981 100%)',
              borderRadius: '999px',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      </div>

      {/* ── Category Filters ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginRight: '0.5rem' }}>
          Filter By:
        </span>
        {(['all', 'financial', 'product', 'market'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '8px',
              border: filter === cat ? '1px solid #EC4899' : '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: filter === cat ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: filter === cat ? '#EC4899' : '#94A3B8',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Task Cards List ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="card-elevated"
            style={{
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              cursor: 'pointer',
              opacity: task.isComplete ? 0.65 : 1,
              borderLeft: task.isComplete ? '4px solid #10B981' : '4px solid #EC4899',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '8px',
              border: task.isComplete ? '1px solid #10B981' : '2px solid rgba(255, 255, 255, 0.3)',
              backgroundColor: task.isComplete ? '#10B981' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px',
            }}>
              {task.isComplete && <CheckCircle2 size={16} color="#FFFFFF" />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: task.type === 'financial' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                  color: task.type === 'financial' ? '#F59E0B' : '#38BDF8',
                }}>
                  {task.type}
                </span>
                <span style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)', textDecoration: task.isComplete ? 'line-through' : 'none' }}>
                  {task.title}
                </span>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                {task.task}
              </p>

              <div style={{
                marginTop: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
              }}>
                <span style={{ fontWeight: 800, color: 'var(--text-brand)' }}>AI Action Directive: </span>
                {task.fix}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
