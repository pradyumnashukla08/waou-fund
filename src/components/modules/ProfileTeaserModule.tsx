import React, { useState } from 'react';
import { 
  User, 
  Building, 
  Save, 
  Printer, 
  FileText, 
  Sparkles, 
  Globe, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { StartupProfile } from '../../data/defaultData';
import { EvaluationResult, FundingStage } from '../../types';

interface ProfileTeaserModuleProps {
  startup: StartupProfile;
  onUpdateStartup: (s: StartupProfile) => void;
  evaluation: EvaluationResult;
}

export const ProfileTeaserModule: React.FC<ProfileTeaserModuleProps> = ({
  startup,
  onUpdateStartup,
  evaluation,
}) => {
  const [formData, setFormData] = useState<StartupProfile>({ ...startup });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showTeaserPreview, setShowTeaserPreview] = useState(false);

  const handleChange = (field: keyof StartupProfile, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStartup(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePrintTeaser = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
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
            <User size={14} />
            <span>FOUNDER DOSSIER & INVESTOR EXECUTIVE TEASER</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.2rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            marginTop: '0.2rem',
          }}>
            Founder Profile & 1-Pager Teaser
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Maintain your official fundraising round parameters and generate an institutional 1-page executive pitch summary.
          </p>
        </div>

        <button
          onClick={() => setShowTeaserPreview(!showTeaserPreview)}
          className="btn-cyan"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.86rem' }}
        >
          <FileText size={15} />
          <span>{showTeaserPreview ? 'Back to Editor' : 'Generate 1-Pager Teaser'}</span>
        </button>
      </div>

      {/* ── MODE 1: EDIT FORM ──────────────────────────────────────────── */}
      {!showTeaserPreview ? (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card-elevated" style={{ borderRadius: '20px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Core Profile & Round Mechanics
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Founder Full Name
                </label>
                <input 
                  type="text"
                  value={formData.founder}
                  onChange={(e) => handleChange('founder', e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(2, 4, 10, 0.7)',
                    border: '1px solid rgba(37, 99, 235, 0.15)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Startup Name
                </label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(2, 4, 10, 0.7)',
                    border: '1px solid rgba(37, 99, 235, 0.15)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Funding Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleChange('stage', e.target.value as FundingStage)}
                  style={{
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(37, 99, 235, 0.15)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                  }}
                >
                  <option value="Pre-Seed">Pre-Seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series-A">Series-A</option>
                  <option value="Series-B">Series-B</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Industry Category
                </label>
                <input 
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(2, 4, 10, 0.7)',
                    border: '1px solid rgba(37, 99, 235, 0.15)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Target Fundraise Ask
                </label>
                <input 
                  type="text"
                  value={formData.targetAsk}
                  onChange={(e) => handleChange('targetAsk', e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(2, 4, 10, 0.7)',
                    border: '1px solid rgba(37, 99, 235, 0.15)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Target Valuation Cap
                </label>
                <input 
                  type="text"
                  value={formData.valuation}
                  onChange={(e) => handleChange('valuation', e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(2, 4, 10, 0.7)',
                    border: '1px solid rgba(37, 99, 235, 0.15)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                One-Sentence Elevator Pitch Tagline
              </label>
              <textarea 
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                rows={2}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(2, 4, 10, 0.7)',
                  border: '1px solid rgba(37, 99, 235, 0.15)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                }}
              />
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                type="submit"
                className="btn-cyan"
                style={{ padding: '0.75rem 1.75rem', fontSize: '0.92rem' }}
              >
                <Save size={16} />
                <span>Save Profile Changes</span>
              </button>

              {savedSuccess && (
                <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={16} /> Synchronized with AI Matrix Core
                </span>
              )}
            </div>
          </div>
        </form>
      ) : (
        /* ── MODE 2: 1-PAGER EXECUTIVE PITCH TEASER ───────────────────── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              onClick={handlePrintTeaser}
              className="btn-cyan"
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.86rem' }}
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>
          </div>

          {/* Printable White Sheet Document */}
          <div style={{
            backgroundColor: '#FFFFFF',
            color: '#0F172A',
            borderRadius: '16px',
            padding: '3rem 3.5rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            maxWidth: '900px',
            margin: '0 auto',
            width: '100%',
            fontFamily: 'var(--font-sans)',
          }}>
            {/* Header Strip */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid #0F172A',
              paddingBottom: '1.5rem',
              marginBottom: '2rem',
            }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
                  {formData.name}
                </h2>
                <p style={{ fontSize: '1rem', color: '#2563EB', fontWeight: 700, marginTop: '2px' }}>
                  {formData.tagline}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-hint)', marginTop: '4px' }}>
                  {formData.category} • {formData.location} • {formData.website}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}>
                  {formData.stage} ROUND
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', marginTop: '0.5rem' }}>
                  {formData.targetAsk}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-hint)' }}>
                  @ {formData.valuation} Cap ({formData.equityOffered} Equity)
                </div>
              </div>
            </div>

            {/* Grid 1: The Problem & The Solution */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                  THE PROBLEM & PAIN
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6 }}>
                  Commercial real estate investors spend 14–21 days per asset manually gathering municipal records and valuation metrics with high error rates, losing competitive deals.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                  PROPRIETARY SOLUTION
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6 }}>
                  {formData.name} provides an algorithmic spatial intelligence suite that auto-underwrites commercial real estate in under 60 seconds with 94% yield accuracy.
                </p>
              </div>
            </div>

            {/* Grid 2: Key Traction & Unit Economics */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #E2E8F0',
              marginBottom: '2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              textAlign: 'center',
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-hint)', fontWeight: 800 }}>CURRENT MRR</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A' }}>{formData.mrr}</div>
                <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>{formData.growth}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-hint)', fontWeight: 800 }}>MONTHLY BURN</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A' }}>{formData.burn}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-hint)' }}>11.6 mos runway</div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-hint)', fontWeight: 800 }}>NET RETENTION</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A' }}>118% NRR</div>
                <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>Negative churn</div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-hint)', fontWeight: 800 }}>MARKET SIZE</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A' }}>{evaluation.market_landscape.sam}</div>
                <div style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 700 }}>SAM Potential</div>
              </div>
            </div>

            {/* Use of Funds & Team */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                  USE OF PROPOSED CAPITAL ({formData.targetAsk})
                </h4>
                <ul style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6, paddingLeft: '1.2rem' }}>
                  <li>50% Engineering & Spatial ML Pipeline Expansion</li>
                  <li>30% Enterprise Outbound SDR Team (Expand into 3 metros)</li>
                  <li>20% Security (SOC-2 Type II Certification & Working Capital)</li>
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                  FOUNDING TEAM & CONTACT
                </h4>
                <div style={{ fontSize: '0.88rem', color: '#0F172A', fontWeight: 700 }}>
                  {formData.founder} — Chief Executive Officer
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-hint)', marginTop: '2px' }}>
                  Ex-Senior Lead Flipkart / PropTech Alum
                </div>
                <div style={{ fontSize: '0.82rem', color: '#2563EB', marginTop: '6px', fontWeight: 600 }}>
                  Contact: founder@{formData.name.toLowerCase()}.ai • Confidential
                </div>
              </div>
            </div>

            {/* Footer watermark */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>Verified via WaouFund AI Diligence Protocol (Fundability Score: {formData.fundabilityScore}/100)</span>
              <span>Strictly Confidential • For Accredited Institutional Investors</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
