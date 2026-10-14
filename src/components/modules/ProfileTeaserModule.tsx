import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Camera,
  Trash2,
  Plus,
  ExternalLink,
  Lock,
  Layers,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Briefcase,
  Share2,
  Download
} from 'lucide-react';
import { StartupProfile, TeamMember } from '../../data/defaultData';
import { EvaluationResult, FundingStage } from '../../types';
import { api } from '../../services/api';

interface ProfileTeaserModuleProps {
  startup: StartupProfile;
  onUpdateStartup: (s: StartupProfile) => void;
  evaluation: EvaluationResult;
}

export const validateLinkedIn = (url: string) => {
  if (!url) return true;
  return /^https:\/\/(www\.)?linkedin\.com\/.+$/.test(url.trim());
};

export const validateUrl = (url: string) => {
  if (!url) return true;
  const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
  return pattern.test(url.trim());
};

export const ProfileTeaserModule: React.FC<ProfileTeaserModuleProps> = ({
  startup,
  onUpdateStartup,
  evaluation,
}) => {
  const [formData, setFormData] = useState<StartupProfile>({
    ...startup,
    fullName: startup.fullName || startup.founder || 'Rahul Sharma',
    role: startup.role || 'CEO & Co-Founder',
    profileImage: startup.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80',
    linkedinUrl: startup.linkedinUrl || 'https://linkedin.com/in/rahulsharma-founder',
    email: startup.email || 'founder@startup.com',
    team: startup.team && startup.team.length > 0 ? startup.team : [
      { name: 'Kavita Sundaram', role: 'CTO (Ex-Google Brain, IIT Madras)', linkedin: 'https://linkedin.com/in/kavita-sundaram' },
      { name: 'Aditya Sen', role: 'Head of Growth (Ex-Razorpay)', linkedin: 'https://linkedin.com/in/aditya-sen' }
    ],
    companyName: startup.companyName || startup.name || 'Your Startup Inc.',
    websiteUrl: startup.websiteUrl || startup.website || 'https://yourstartup.com',
    companyType: startup.companyType || 'Private Limited',
    isRegistered: startup.isRegistered !== undefined ? startup.isRegistered : true,
    registrationNo: startup.registrationNo || '29ABCDE1234F1Z5',
    sector: startup.sector || startup.category?.split('/')[0]?.trim() || 'SaaS',
    pitch: startup.pitch || startup.tagline || 'AI spatial intelligence platform enabling institutional REITs to evaluate commercial asset yields with 98% accuracy in 12 minutes.',
    currency: startup.currency || '₹ (INR)',
    tam: startup.tam || '42000000000',
    sam: startup.sam || '8500000000',
    som: startup.som || '1200000000',
    competitor1: startup.competitor1 || 'https://costar.com',
    competitor2: startup.competitor2 || 'https://cherre.com',
    competitor3: startup.competitor3 || 'https://reonomy.com',
    distributionMoat: startup.distributionMoat || 'Proprietary spatial graph of 1.4M commercial parcels and direct API integration with Indian municipal land registries.',
    targetRaise: startup.targetRaise || startup.targetAsk?.replace(/[^0-9]/g, '') || '40000000',
    valuationCap: startup.valuationCap || startup.valuation?.replace(/[^0-9]/g, '') || '280000000',
    equityOffered: startup.equityOffered?.replace(/%/g, '') || '14.2',
    capitalCommitted: startup.capitalCommitted || '18000000',
    // Pre-Seed
    waitlistCount: startup.waitlistCount || '450',
    betaConversion: startup.betaConversion || '28',
    productStatus: startup.productStatus || 'Functional MVP',
    problemValidation: startup.problemValidation || 'Commercial real estate underwriting takes 6 weeks of manual surveyor appraisals resulting in 18% pricing variance.',
    teamCapability: startup.teamCapability || 'Founders have 14+ years combined in enterprise GIS, spatial computer vision, and institutional REIT debt underwriting.',
    runway: startup.runway || '14',
    // Seed
    currentMrr: startup.currentMrr || startup.mrr?.replace(/[^0-9]/g, '') || '5000000',
    userTraction: startup.userTraction || '18 Enterprise Clients',
    momGrowth: startup.momGrowth || startup.growth?.replace(/[^0-9]/g, '') || '18',
    grossMargin: startup.grossMargin || '82',
    cac: startup.cac || '85000',
    // Series A
    verifiedArr: startup.verifiedArr || '60000000',
    churnRate: startup.churnRate || '1.2',
    nrr: startup.nrr || '124',
    ltvcacRatio: startup.ltvcacRatio || '>4:1',
    cacPayback: startup.cacPayback || '5',
    burnRate: startup.burnRate || startup.burn?.replace(/[^0-9]/g, '') || '1200000',
    execSales: startup.execSales !== undefined ? startup.execSales : true,
    execEng: startup.execEng !== undefined ? startup.execEng : true,
    execMarketing: startup.execMarketing !== undefined ? startup.execMarketing : false,
    // Series B
    annualRevenue: startup.annualRevenue || '60000000',
    expansionVectors: startup.expansionVectors || ['International Expansion', 'New Product Lines'],
    cSuiteComplete: startup.cSuiteComplete !== undefined ? startup.cSuiteComplete : true,
    marketShare: startup.marketShare || '12',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showTeaserPreview, setShowTeaserPreview] = useState(false);
  const [aiGeneratingField, setAiGeneratingField] = useState<string | null>(null);
  const [avatarInputUrl, setAvatarInputUrl] = useState('');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Sync state if prop changes
  useEffect(() => {
    if (startup.id !== formData.id) {
      setFormData({ ...startup });
    }
  }, [startup]);

  const currencySymbol = (formData.currency || '₹ (INR)').split(' ')[0];

  const handleChange = (field: keyof StartupProfile, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleTeamMemberChange = (index: number, key: keyof TeamMember, val: string) => {
    const updated = [...(formData.team || [])];
    if (updated[index]) {
      updated[index] = { ...updated[index], [key]: val };
      handleChange('team', updated);
    }
  };

  const handleAddTeamMember = () => {
    const currentTeam = formData.team || [];
    if (currentTeam.length < 4) {
      handleChange('team', [...currentTeam, { name: '', role: '', linkedin: '' }]);
    }
  };

  const handleRemoveTeamMember = (index: number) => {
    const updated = (formData.team || []).filter((_, i) => i !== index);
    handleChange('team', updated);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateStartup({
      ...formData,
      name: formData.companyName || formData.name,
      founder: formData.fullName || formData.founder,
      tagline: formData.pitch || formData.tagline,
      website: formData.websiteUrl || formData.website,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // AI Assist sparkle generator using live AI
  const handleAiAssist = async (field: string) => {
    setAiGeneratingField(field);
    try {
      const generated = await api.generateProfileField(field, formData);
      if (generated && generated.trim().length > 0) {
        if (field === 'tam' || field === 'sam' || field === 'som') {
          handleChange(field as keyof StartupProfile, generated.replace(/[^0-9]/g, ''));
        } else {
          handleChange(field as keyof StartupProfile, generated);
        }
      }
    } catch (err) {
      console.error('AI Assist error:', err);
    } finally {
      setAiGeneratingField(null);
    }
  };

  // Calculate profile completeness
  const calculateCompleteness = () => {
    const required = [
      formData.fullName,
      formData.role,
      formData.linkedinUrl,
      formData.companyName,
      formData.pitch,
      formData.sector,
      formData.tam,
      formData.sam,
      formData.som,
      formData.competitor1,
      formData.competitor2,
      formData.distributionMoat,
      formData.targetRaise,
      formData.valuationCap,
      formData.equityOffered,
    ];
    const filled = required.filter(f => f && String(f).trim().length > 0).length;
    return Math.round((filled / required.length) * 100);
  };

  const completeness = calculateCompleteness();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* ── TOP HEADER & MODE SWITCHER ─────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
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
            <span>FOUNDER DOSSIER & INSTITUTIONAL PROFILE</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-heading)',
            marginTop: '0.2rem',
          }}>
            Founder Profile & 1-Pager Pitch
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            All 5 institutional vectors synchronize directly with the AI Investor Evaluation Matrix and Virtual Data Room.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setShowTeaserPreview(!showTeaserPreview)}
            className={showTeaserPreview ? 'btn-primary' : 'btn-cyan'}
            style={{
              padding: '0.65rem 1.25rem',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '10px'
            }}
          >
            {showTeaserPreview ? (
              <>
                <Layers size={16} />
                <span>Return to Editor (5 Sections)</span>
              </>
            ) : (
              <>
                <FileText size={16} />
                <span>Generate 1-Pager Executive Teaser</span>
              </>
            )}
          </button>

          {!showTeaserPreview && (
            <button
              type="button"
              onClick={() => handleSave()}
              className="btn-primary"
              style={{
                padding: '0.65rem 1.25rem',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: '10px'
              }}
            >
              <Save size={15} />
              <span>{savedSuccess ? 'Saved to Cloud! ✓' : 'Save Changes'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Save Success Alert Banner */}
      {savedSuccess && (
        <div style={{
          backgroundColor: '#ECFDF5',
          border: '1px solid #10B981',
          borderRadius: '12px',
          padding: '0.9rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#065F46',
          fontSize: '0.92rem',
          fontWeight: 600,
        }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>All profile parameters and traction vectors have been saved to your secure cloud dossier!</span>
        </div>
      )}

      {/* ── MODE 1: FULL 5-SECTION EDITOR ──────────────────────────────── */}
      {!showTeaserPreview ? (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* HEADER PROFILE HERO CARD */}
          <div className="card-elevated" style={{
            borderRadius: '20px',
            padding: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={formData.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80'}
                  alt={formData.fullName}
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #2563EB',
                    boxShadow: '0 8px 16px rgba(37, 99, 235, 0.15)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(true)}
                  title="Change avatar photo"
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  }}
                >
                  <Camera size={14} color="#0F172A" />
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>
                    {formData.fullName || 'Founder Profile'}
                  </h2>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    border: '1px solid #DBEAFE',
                  }}>
                    {formData.stage} Stage
                  </span>
                </div>
                <p style={{ fontSize: '0.92rem', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
                  {formData.role || 'CEO'}, {formData.companyName || 'Startup'} • {formData.sector || 'SaaS'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#94A3B8' }}>
                  <span>{formData.email}</span>
                  {formData.isRegistered && <span>• DPIIT / GSTIN: {formData.registrationNo}</span>}
                </div>
              </div>
            </div>

            {/* Profile Completion Gauge */}
            <div style={{
              minWidth: '220px',
              padding: '1rem 1.25rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Profile Completeness</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#2563EB' }}>{completeness}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${completeness}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #3B82F6, #10B981)',
                  borderRadius: '4px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
              <span style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '6px', display: 'block' }}>
                {completeness >= 80 ? '✓ Ready for institutional investor review' : 'Fill remaining fields for optimal rating'}
              </span>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────── */}
          {/* SECTION 1: FOUNDER IDENTITY & KEY TEAM                         */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div className="card-elevated" style={{ borderRadius: '20px', padding: '2rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>1</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>Founder Identity & Core Leadership</h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>TEAM SIZE: {1 + (formData.team?.length || 0)}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  style={{
                    width: '100%',
                    backgroundColor: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: '#0F172A',
                    fontSize: '0.94rem',
                    fontWeight: 500,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                  Primary Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  placeholder="e.g. CEO, Technical Founder"
                  style={{
                    width: '100%',
                    backgroundColor: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: '#0F172A',
                    fontSize: '0.94rem',
                    fontWeight: 500,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                  placeholder="https://www.linkedin.com/in/..."
                  style={{
                    width: '100%',
                    backgroundColor: '#F8FAFC',
                    border: `1.5px solid ${!validateLinkedIn(formData.linkedinUrl || '') && formData.linkedinUrl ? '#EF4444' : '#E2E8F0'}`,
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: '#0F172A',
                    fontSize: '0.94rem',
                    fontWeight: 500,
                    outline: 'none',
                  }}
                />
                {!validateLinkedIn(formData.linkedinUrl || '') && formData.linkedinUrl && (
                  <p style={{ fontSize: '0.74rem', color: '#EF4444', marginTop: '4px' }}>Please enter a full LinkedIn URL (https://...)</p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="founder@company.com"
                  style={{
                    width: '100%',
                    backgroundColor: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: '#0F172A',
                    fontSize: '0.94rem',
                    fontWeight: 500,
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* KEY TEAM MEMBERS LIST */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  KEY TEAM MEMBERS ({formData.team?.length || 0}/4)
                </label>
                {(formData.team?.length || 0) < 4 && (
                  <button
                    type="button"
                    onClick={handleAddTeamMember}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'none',
                      border: 'none',
                      color: '#2563EB',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={15} />
                    <span>Add Member</span>
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {(formData.team || []).map((member, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) 40px',
                      gap: '0.85rem',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <input
                        type="text"
                        placeholder="Member Name"
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(idx, 'name', e.target.value)}
                        style={{
                          width: '100%',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          padding: '0.6rem 0.85rem',
                          fontSize: '0.88rem',
                          color: '#0F172A',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Role / Responsibility (e.g. CTO)"
                        value={member.role}
                        onChange={(e) => handleTeamMemberChange(idx, 'role', e.target.value)}
                        style={{
                          width: '100%',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          padding: '0.6rem 0.85rem',
                          fontSize: '0.88rem',
                          color: '#0F172A',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <input
                        type="url"
                        placeholder="LinkedIn Profile URL"
                        value={member.linkedin}
                        onChange={(e) => handleTeamMemberChange(idx, 'linkedin', e.target.value)}
                        style={{
                          width: '100%',
                          backgroundColor: '#FFFFFF',
                          border: `1px solid ${!validateLinkedIn(member.linkedin) && member.linkedin ? '#EF4444' : '#E2E8F0'}`,
                          borderRadius: '8px',
                          padding: '0.6rem 0.85rem',
                          fontSize: '0.88rem',
                          color: '#0F172A',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTeamMember(idx)}
                      title="Remove member"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#EF4444',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {(formData.team?.length || 0) < 4 && (
                  <button
                    type="button"
                    onClick={handleAddTeamMember}
                    style={{
                      border: '1.5px dashed #CBD5E1',
                      borderRadius: '10px',
                      padding: '0.85rem',
                      backgroundColor: '#FFFFFF',
                      color: '#64748B',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Plus size={16} />
                    <span>+ ADD TEAM MEMBER</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────── */}
          {/* SECTION 2: STARTUP CORE & COMPLIANCE                          */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div className="card-elevated" style={{ borderRadius: '20px', padding: '2rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>2</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>Startup Core & Compliance</h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>GOVERNANCE & STAGE</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                  Company Legal Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="e.g. WaouFund Inc."
                  style={{
                    width: '100%',
                    backgroundColor: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: '#0F172A',
                    fontSize: '0.94rem',
                    fontWeight: 500,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                  Startup Website URL
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => handleChange('websiteUrl', e.target.value)}
                  placeholder="https://yourstartup.com"
                  style={{
                    width: '100%',
                    backgroundColor: '#F8FAFC',
                    border: `1.5px solid ${!validateUrl(formData.websiteUrl || '') && formData.websiteUrl ? '#EF4444' : '#E2E8F0'}`,
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    color: '#0F172A',
                    fontSize: '0.94rem',
                    fontWeight: 500,
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Type of Company Setup */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                Type of Company Setup
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Proprietorship', 'LLP', 'Private Limited', 'Public Limited', 'Not Registered Yet - Need Help'].map((type) => {
                  const isSelected = formData.companyType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChange('companyType', type)}
                      style={{
                        padding: '0.5rem 0.9rem',
                        borderRadius: '8px',
                        border: `1.5px solid ${isSelected ? '#0F172A' : '#E2E8F0'}`,
                        backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : '#475569',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DIPP / DPIIT Registration */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                  Is Company Registered with DIPP/DPIIT?
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleChange('isRegistered', true)}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      borderRadius: '8px',
                      border: `1.5px solid ${formData.isRegistered ? '#0F172A' : '#E2E8F0'}`,
                      backgroundColor: formData.isRegistered ? '#0F172A' : '#FFFFFF',
                      color: formData.isRegistered ? '#FFFFFF' : '#475569',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('isRegistered', false)}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      borderRadius: '8px',
                      border: `1.5px solid ${!formData.isRegistered ? '#0F172A' : '#E2E8F0'}`,
                      backgroundColor: !formData.isRegistered ? '#0F172A' : '#FFFFFF',
                      color: !formData.isRegistered ? '#FFFFFF' : '#475569',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Not Yet
                  </button>
                </div>
              </div>

              {formData.isRegistered && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                    Registration / GSTIN Number
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNo}
                    onChange={(e) => handleChange('registrationNo', e.target.value)}
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      color: '#0F172A',
                      fontSize: '0.94rem',
                      fontWeight: 500,
                      outline: 'none',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Sector / Vertical */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                Sector / Vertical
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['SaaS', 'FinTech', 'HealthTech', 'Consumer', 'Manufacturing', 'Services'].map((sec) => {
                  const isSelected = formData.sector === sec;
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => handleChange('sector', sec)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: `1.5px solid ${isSelected ? '#0F172A' : '#E2E8F0'}`,
                        backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : '#475569',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {sec}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Funding Stage & Base Currency */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                  Current Funding Stage
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {(['Pre-Seed', 'Seed', 'Series-A', 'Series-B'] as FundingStage[]).map((stg) => {
                    const isSelected = formData.stage === stg;
                    return (
                      <button
                        key={stg}
                        type="button"
                        onClick={() => handleChange('stage', stg)}
                        style={{
                          flex: 1,
                          padding: '0.55rem',
                          borderRadius: '8px',
                          border: `1.5px solid ${isSelected ? '#0F172A' : '#E2E8F0'}`,
                          backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#475569',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {stg}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                  Base Currency
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {['₹ (INR)', '$ (USD)', '€ (EUR)', '£ (GBP)'].map((curr) => {
                    const isSelected = formData.currency === curr;
                    return (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => handleChange('currency', curr)}
                        style={{
                          flex: 1,
                          padding: '0.55rem',
                          borderRadius: '8px',
                          border: `1.5px solid ${isSelected ? '#0F172A' : '#E2E8F0'}`,
                          backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#475569',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {curr}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ONE-LINER PITCH WITH AI SPARKLE */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  One-Liner Pitch Tagline
                </label>
                <button
                  type="button"
                  onClick={() => handleAiAssist('pitch')}
                  disabled={aiGeneratingField === 'pitch'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#F0F9FF',
                    border: '1px solid #BAE6FD',
                    borderRadius: '12px',
                    padding: '3px 10px',
                    color: '#0284C7',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Sparkles size={12} color="#0284C7" />
                  <span>{aiGeneratingField === 'pitch' ? 'Drafting...' : 'AI Assist'}</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={formData.pitch}
                onChange={(e) => handleChange('pitch', e.target.value)}
                placeholder="Explain what you do in one clear, compelling sentence..."
                style={{
                  width: '100%',
                  backgroundColor: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  color: '#0F172A',
                  fontSize: '0.94rem',
                  fontWeight: 500,
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                Crisp elevator pitch (max 15-20 words). Used in top-level investor teasers.
              </span>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────── */}
          {/* SECTION 3: MARKET & COMPETITORS                                */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div className="card-elevated" style={{ borderRadius: '20px', padding: '2rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>3</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>Market Opportunity & Competitors</h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>TAM / SAM / SOM & MOAT</span>
            </div>

            {/* TAM / SAM / SOM Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {/* TAM */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    TAM (Total Market)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAiAssist('tam')}
                    disabled={aiGeneratingField === 'tam'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: '#F0F9FF',
                      border: '1px solid #BAE6FD',
                      borderRadius: '12px',
                      padding: '2px 8px',
                      color: '#0284C7',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Sparkles size={11} color="#0284C7" />
                    <span>AI TAM</span>
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#94A3B8' }}>{currencySymbol}</span>
                  <input
                    type="text"
                    value={formData.tam}
                    onChange={(e) => handleChange('tam', e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 50000000000"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem 0.75rem 2.2rem',
                      color: '#0F172A',
                      fontSize: '0.94rem',
                      fontWeight: 600,
                      outline: 'none',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                  Total revenue opportunity if 100% market share is achieved.
                </span>
              </div>

              {/* SAM */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    SAM (Serviceable Market)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAiAssist('sam')}
                    disabled={aiGeneratingField === 'sam'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: '#F0F9FF',
                      border: '1px solid #BAE6FD',
                      borderRadius: '12px',
                      padding: '2px 8px',
                      color: '#0284C7',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Sparkles size={11} color="#0284C7" />
                    <span>AI SAM</span>
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#94A3B8' }}>{currencySymbol}</span>
                  <input
                    type="text"
                    value={formData.sam}
                    onChange={(e) => handleChange('sam', e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 15000000000"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem 0.75rem 2.2rem',
                      color: '#0F172A',
                      fontSize: '0.94rem',
                      fontWeight: 600,
                      outline: 'none',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                  The segment of the TAM targeted by your products/services.
                </span>
              </div>

              {/* SOM */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    SOM (Obtainable Market)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAiAssist('som')}
                    disabled={aiGeneratingField === 'som'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: '#F0F9FF',
                      border: '1px solid #BAE6FD',
                      borderRadius: '12px',
                      padding: '2px 8px',
                      color: '#0284C7',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Sparkles size={11} color="#0284C7" />
                    <span>AI SOM</span>
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#94A3B8' }}>{currencySymbol}</span>
                  <input
                    type="text"
                    value={formData.som}
                    onChange={(e) => handleChange('som', e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 2500000000"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem 0.75rem 2.2rem',
                      color: '#0F172A',
                      fontSize: '0.94rem',
                      fontWeight: 600,
                      outline: 'none',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                  The realistic portion of the SAM you can capture in 3-5 years.
                </span>
              </div>
            </div>

            {/* TOP 3 COMPETITORS */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                TOP 3 COMPETITORS (WEBSITE LINKS - MIN 2)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                <div>
                  <input
                    type="url"
                    value={formData.competitor1}
                    onChange={(e) => handleChange('competitor1', e.target.value)}
                    placeholder="Competitor 1 (e.g. costar.com)"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: `1.5px solid ${!validateUrl(formData.competitor1 || '') && formData.competitor1 ? '#EF4444' : '#E2E8F0'}`,
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      color: '#0F172A',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                  {!validateUrl(formData.competitor1 || '') && formData.competitor1 && (
                    <span style={{ fontSize: '0.72rem', color: '#EF4444', marginTop: '2px', display: 'block' }}>Please enter a valid website URL</span>
                  )}
                </div>

                <div>
                  <input
                    type="url"
                    value={formData.competitor2}
                    onChange={(e) => handleChange('competitor2', e.target.value)}
                    placeholder="Competitor 2 (e.g. cherre.com)"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: `1.5px solid ${!validateUrl(formData.competitor2 || '') && formData.competitor2 ? '#EF4444' : '#E2E8F0'}`,
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      color: '#0F172A',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                  {!validateUrl(formData.competitor2 || '') && formData.competitor2 && (
                    <span style={{ fontSize: '0.72rem', color: '#EF4444', marginTop: '2px', display: 'block' }}>Please enter a valid website URL</span>
                  )}
                </div>

                <div>
                  <input
                    type="url"
                    value={formData.competitor3}
                    onChange={(e) => handleChange('competitor3', e.target.value)}
                    placeholder="Competitor 3 (Optional)"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: `1.5px solid ${!validateUrl(formData.competitor3 || '') && formData.competitor3 ? '#EF4444' : '#E2E8F0'}`,
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      color: '#0F172A',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                  {!validateUrl(formData.competitor3 || '') && formData.competitor3 && (
                    <span style={{ fontSize: '0.72rem', color: '#EF4444', marginTop: '2px', display: 'block' }}>Please enter a valid website URL</span>
                  )}
                </div>
              </div>
            </div>

            {/* CORE DISTRIBUTION MOAT */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Core Distribution Moat & Defensibility
                </label>
                <button
                  type="button"
                  onClick={() => handleAiAssist('distributionMoat')}
                  disabled={aiGeneratingField === 'distributionMoat'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#F0F9FF',
                    border: '1px solid #BAE6FD',
                    borderRadius: '12px',
                    padding: '3px 10px',
                    color: '#0284C7',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Sparkles size={12} color="#0284C7" />
                  <span>{aiGeneratingField === 'distributionMoat' ? 'Synthesizing...' : 'AI Assist'}</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={formData.distributionMoat}
                onChange={(e) => handleChange('distributionMoat', e.target.value)}
                placeholder="How do you acquire customers cheaper than competitors? What is your proprietary moat?"
                style={{
                  width: '100%',
                  backgroundColor: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  color: '#0F172A',
                  fontSize: '0.94rem',
                  fontWeight: 500,
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                Your unique advantage in customer acquisition, network effects, IP, or proprietary data graph.
              </span>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────── */}
          {/* SECTION 4: THE FUNDRAISING ASK                                */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div className="card-elevated" style={{ borderRadius: '20px', padding: '2rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>4</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>The Official Fundraising Ask</h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>ROUND PARAMETERS</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {/* TARGET RAISE */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                  Target Raise ({currencySymbol})
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: '#64748B' }}>{currencySymbol}</span>
                  <input
                    type="text"
                    value={formData.targetRaise}
                    onChange={(e) => handleChange('targetRaise', e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 40000000"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem 0.75rem 2.4rem',
                      color: '#0F172A',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      outline: 'none',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                  Total capital you are seeking in this specific round.
                </span>
              </div>

              {/* VALUATION CAP */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                  Valuation Cap ({currencySymbol})
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: '#64748B' }}>{currencySymbol}</span>
                  <input
                    type="text"
                    value={formData.valuationCap}
                    onChange={(e) => handleChange('valuationCap', e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 280000000"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem 0.75rem 2.4rem',
                      color: '#0F172A',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      outline: 'none',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                  Pre-money valuation cap at which your SAFE / convertible note converts.
                </span>
              </div>

              {/* EQUITY OFFERED */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                  Equity Offered (%)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={formData.equityOffered}
                    onChange={(e) => {
                      let num = e.target.value.replace(/[^0-9.]/g, '');
                      if (num !== '' && parseFloat(num) > 100) num = '100';
                      handleChange('equityOffered', num);
                    }}
                    placeholder="e.g. 14.2"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '0.75rem 2.5rem 0.75rem 1rem',
                      color: '#0F172A',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      outline: 'none',
                    }}
                  />
                  <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: '#0F172A' }}>%</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                  Dilution percentage. Institutional standard ranges between 10% and 20%.
                </span>
              </div>

              {/* CAPITAL COMMITTED SO FAR */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                  Committed So Far ({currencySymbol})
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: '#64748B' }}>{currencySymbol}</span>
                  <input
                    type="text"
                    value={formData.capitalCommitted}
                    onChange={(e) => handleChange('capitalCommitted', e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 18000000"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem 0.75rem 2.4rem',
                      color: '#0F172A',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      outline: 'none',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                  Soft / hard commitments already locked from angels or syndicates.
                </span>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────── */}
          {/* SECTION 5: DYNAMIC STAGE-AWARE TRACTION METRICS               */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div className="card-elevated" style={{ borderRadius: '20px', padding: '2rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>5</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>
                  5. Traction Metrics ({formData.stage})
                </h3>
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '999px',
                backgroundColor: '#F0FDF4',
                color: '#15803D',
                border: '1px solid #BBF7D0'
              }}>
                STAGE-AWARE BENCHMARKS
              </span>
            </div>

            {/* PRE-SEED STAGE METRICS */}
            {formData.stage === 'Pre-Seed' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                      Waitlist Count
                    </label>
                    <input
                      type="text"
                      value={formData.waitlistCount}
                      onChange={(e) => handleChange('waitlistCount', e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 500"
                      style={{
                        width: '100%',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        color: '#0F172A',
                        fontSize: '0.94rem',
                        fontWeight: 600,
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>Number of potential customers who signed up.</span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                      Beta Conversion (%)
                    </label>
                    <input
                      type="text"
                      value={formData.betaConversion}
                      onChange={(e) => handleChange('betaConversion', e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 15"
                      style={{
                        width: '100%',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        color: '#0F172A',
                        fontSize: '0.94rem',
                        fontWeight: 600,
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>Percentage of waitlist users converting to active users.</span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                      Current Runway (Months)
                    </label>
                    <input
                      type="text"
                      value={formData.runway}
                      onChange={(e) => handleChange('runway', e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 8"
                      style={{
                        width: '100%',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        color: '#0F172A',
                        fontSize: '0.94rem',
                        fontWeight: 600,
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>Months of operations remaining with current cash.</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                    Product Status
                  </label>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {['Concept Only', 'Mockups', 'Functional MVP'].map((status) => {
                      const isSelected = formData.productStatus === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleChange('productStatus', status)}
                          style={{
                            flex: 1,
                            padding: '0.7rem',
                            borderRadius: '8px',
                            border: `1.5px solid ${isSelected ? '#0F172A' : '#E2E8F0'}`,
                            backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
                            color: isSelected ? '#FFFFFF' : '#475569',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      The Problem (Validation)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAiAssist('problemValidation')}
                      disabled={aiGeneratingField === 'problemValidation'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: '#F0F9FF',
                        border: '1px solid #BAE6FD',
                        borderRadius: '12px',
                        padding: '2px 8px',
                        color: '#0284C7',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Sparkles size={11} color="#0284C7" />
                      <span>AI Assist</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={formData.problemValidation}
                    onChange={(e) => handleChange('problemValidation', e.target.value)}
                    placeholder="What specific problem are you solving, and how do you know it exists?"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      color: '#0F172A',
                      fontSize: '0.94rem',
                      fontWeight: 500,
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      The Team (Capability)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAiAssist('teamCapability')}
                      disabled={aiGeneratingField === 'teamCapability'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: '#F0F9FF',
                        border: '1px solid #BAE6FD',
                        borderRadius: '12px',
                        padding: '2px 8px',
                        color: '#0284C7',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Sparkles size={11} color="#0284C7" />
                      <span>AI Assist</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={formData.teamCapability}
                    onChange={(e) => handleChange('teamCapability', e.target.value)}
                    placeholder="Who are the core founders and what is your domain expertise?"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      color: '#0F172A',
                      fontSize: '0.94rem',
                      fontWeight: 500,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}

            {/* SEED STAGE METRICS */}
            {formData.stage === 'Seed' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                    Current ARR / MRR ({currencySymbol})
                  </label>
                  <input
                    type="text"
                    value={formData.currentMrr}
                    onChange={(e) => handleChange('currentMrr', e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 5000000"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      color: '#0F172A',
                      fontSize: '0.94rem',
                      fontWeight: 600,
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>Annual or Monthly Recurring Revenue.</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                    Active Users / Clients
                  </label>
                  <input
                    type="text"
                    value={formData.userTraction}
                    onChange={(e) => handleChange('userTraction', e.target.value)}
                    placeholder="e.g. 18 Enterprise Clients"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      color: '#0F172A',
                      fontSize: '0.94rem',
                      fontWeight: 600,
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>Total active users or clients currently on platform.</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                    MoM Growth (%)
                  </label>
                  <input
                    type="text"
                    value={formData.momGrowth}
                    onChange={(e) => handleChange('momGrowth', e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 18"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      color: '#0F172A',
                      fontSize: '0.94rem',
                      fontWeight: 600,
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>Month-over-month compounded revenue growth.</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                    Gross Margin (%)
                  </label>
                  <input
                    type="text"
                    value={formData.grossMargin}
                    onChange={(e) => handleChange('grossMargin', e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 82"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      color: '#0F172A',
                      fontSize: '0.94rem',
                      fontWeight: 600,
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>Revenue minus cost of goods sold, divided by revenue.</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                    Customer Acquisition Cost (CAC) ({currencySymbol})
                  </label>
                  <input
                    type="text"
                    value={formData.cac}
                    onChange={(e) => handleChange('cac', e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 85000"
                    style={{
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      color: '#0F172A',
                      fontSize: '0.94rem',
                      fontWeight: 600,
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>Blended cost to acquire a single paying customer.</span>
                </div>
              </div>
            )}

            {/* SERIES-A STAGE METRICS */}
            {formData.stage === 'Series-A' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                      Verified ARR ({currencySymbol})
                    </label>
                    <input
                      type="text"
                      value={formData.verifiedArr}
                      onChange={(e) => handleChange('verifiedArr', e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 60000000"
                      style={{
                        width: '100%',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        color: '#0F172A',
                        fontSize: '0.94rem',
                        fontWeight: 600,
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>Annual recurring revenue audited / bank-verified.</span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                      Annual Churn Rate (%)
                    </label>
                    <input
                      type="text"
                      value={formData.churnRate}
                      onChange={(e) => handleChange('churnRate', e.target.value)}
                      placeholder="e.g. 1.2"
                      style={{
                        width: '100%',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        color: '#0F172A',
                        fontSize: '0.94rem',
                        fontWeight: 600,
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>Annual customer logo or revenue churn.</span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                      LTV to CAC Ratio
                    </label>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {['<2:1', '2:1', '3:1', '>4:1'].map((ratio) => {
                        const isSelected = formData.ltvcacRatio === ratio;
                        return (
                          <button
                            key={ratio}
                            type="button"
                            onClick={() => handleChange('ltvcacRatio', ratio)}
                            style={{
                              flex: 1,
                              padding: '0.6rem 0.2rem',
                              borderRadius: '8px',
                              border: `1.5px solid ${isSelected ? '#0F172A' : '#E2E8F0'}`,
                              backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
                              color: isSelected ? '#FFFFFF' : '#475569',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {ratio}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                      Monthly Burn Rate ({currencySymbol})
                    </label>
                    <input
                      type="text"
                      value={formData.burnRate}
                      onChange={(e) => handleChange('burnRate', e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 1200000"
                      style={{
                        width: '100%',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        color: '#0F172A',
                        fontSize: '0.94rem',
                        fontWeight: 600,
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>Net cash spent every month.</span>
                  </div>
                </div>

                {/* Executive Hiring (Dedicated Heads) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                    EXECUTIVE HIRING (DEDICATED FUNCTIONAL LEADERS)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                      <input
                        type="checkbox"
                        checked={formData.execSales}
                        onChange={(e) => handleChange('execSales', e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#2563EB', cursor: 'pointer' }}
                      />
                      <span>VP / Head of Sales Hired</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                      <input
                        type="checkbox"
                        checked={formData.execEng}
                        onChange={(e) => handleChange('execEng', e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#2563EB', cursor: 'pointer' }}
                      />
                      <span>VP / Head of Engineering Hired</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                      <input
                        type="checkbox"
                        checked={formData.execMarketing}
                        onChange={(e) => handleChange('execMarketing', e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#2563EB', cursor: 'pointer' }}
                      />
                      <span>VP / Head of Marketing Hired</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* SERIES-B STAGE METRICS */}
            {formData.stage === 'Series-B' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                      Total Annual Revenue ({currencySymbol})
                    </label>
                    <input
                      type="text"
                      value={formData.annualRevenue}
                      onChange={(e) => handleChange('annualRevenue', e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 250000000"
                      style={{
                        width: '100%',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        color: '#0F172A',
                        fontSize: '0.94rem',
                        fontWeight: 600,
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>Total trailing 12-month revenue.</span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                      Net Revenue Retention (NRR) (%)
                    </label>
                    <input
                      type="text"
                      value={formData.nrr}
                      onChange={(e) => handleChange('nrr', e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 124"
                      style={{
                        width: '100%',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        color: '#0F172A',
                        fontSize: '0.94rem',
                        fontWeight: 600,
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>Cohort expansion minus contraction. Target: &gt;115%.</span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                      Market Share Niche (%)
                    </label>
                    <input
                      type="text"
                      value={formData.marketShare}
                      onChange={(e) => handleChange('marketShare', e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 15"
                      style={{
                        width: '100%',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        color: '#0F172A',
                        fontSize: '0.94rem',
                        fontWeight: 600,
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px', display: 'block' }}>Estimated percentage of targeted segment captured.</span>
                  </div>
                </div>

                {/* Expansion Vectors */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                    EXPANSION VECTORS (SELECT ALL THAT APPLY)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {['International Expansion', 'New Product Lines', 'Mergers & Acquisitions'].map((vector) => {
                      const isSelected = formData.expansionVectors?.includes(vector);
                      return (
                        <button
                          key={vector}
                          type="button"
                          onClick={() => {
                            const cur = formData.expansionVectors || [];
                            if (isSelected) {
                              handleChange('expansionVectors', cur.filter(v => v !== vector));
                            } else {
                              handleChange('expansionVectors', [...cur, vector]);
                            }
                          }}
                          style={{
                            padding: '0.55rem 1rem',
                            borderRadius: '8px',
                            border: `1.5px solid ${isSelected ? '#0F172A' : '#E2E8F0'}`,
                            backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
                            color: isSelected ? '#FFFFFF' : '#475569',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {isSelected ? '✓ ' : ''}{vector}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ────────────────────────────────────────────────────────────── */}
          {/* INSTITUTIONAL AI DISCLAIMER                                    */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <ShieldCheck size={28} color="#2563EB" style={{ flexShrink: 0 }} />
            <div>
              <h5 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '2px' }}>
                Bank-Grade AES 256-Bit Confidentiality & AI Encryption
              </h5>
              <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.5 }}>
                Your financial models, unit economics, and cap table parameters are encrypted and strictly isolated. WaouFund models never train on your proprietary data.
              </p>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────── */}
          {/* FOOTER ACTION BUTTONS                                          */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <button
              type="button"
              onClick={() => setShowTeaserPreview(true)}
              className="btn-cyan"
              style={{ padding: '0.85rem 1.75rem', fontSize: '0.94rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FileText size={18} />
              <span>Preview 1-Pager Pitch Teaser</span>
            </button>

            <button
              type="submit"
              className="btn-primary"
              style={{
                padding: '0.85rem 2.25rem',
                fontSize: '0.96rem',
                fontWeight: 800,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
              }}
            >
              <CheckCircle2 size={18} />
              <span>{savedSuccess ? 'Saved to Cloud! ✓' : 'Save & Submit Profile'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* ── MODE 2: INSTITUTIONAL 1-PAGER EXECUTIVE TEASER VIEW ──────────── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Actions in Teaser View */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => setShowTeaserPreview(false)}
              className="btn-outline"
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '10px' }}
            >
              <Layers size={16} />
              <span>Back to Profile Editor</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="btn-primary"
              style={{ padding: '0.6rem 1.5rem', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '10px' }}
            >
              <Printer size={16} />
              <span>Print / Export PDF Dossier</span>
            </button>
          </div>

          {/* Printable 1-Pager Container */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '2px solid #E2E8F0',
            boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
            padding: '3rem',
            color: '#0F172A',
          }}>
            {/* 1-Pager Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '2px solid #0F172A', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  EXECUTIVE VENTURE TEASER • CONFIDENTIAL
                </span>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', marginTop: '4px' }}>
                  {formData.companyName || formData.name}
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#475569', fontWeight: 600, maxWidth: '680px', marginTop: '4px' }}>
                  {formData.pitch || formData.tagline}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748B' }}>
                  <span>Founder: <strong>{formData.fullName || formData.founder}</strong> ({formData.role || 'CEO'})</span>
                  <span>•</span>
                  <span>Stage: <strong>{formData.stage}</strong></span>
                  <span>•</span>
                  <span>Sector: <strong>{formData.sector || 'B2B SaaS'}</strong></span>
                </div>
              </div>

              {/* Fundability Badge */}
              <div style={{
                textAlign: 'right',
                backgroundColor: '#F8FAFC',
                padding: '1rem 1.5rem',
                borderRadius: '16px',
                border: '1px solid #E2E8F0'
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>WAOUFUND SCORE</span>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#2563EB', lineHeight: 1 }}>
                  {evaluation.overall_score || 88}
                  <span style={{ fontSize: '1rem', color: '#94A3B8' }}>/100</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>INSTITUTIONAL GRADE</span>
              </div>
            </div>

            {/* Key Round Parameters 4-Block */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>TARGET ROUND</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>
                  {currencySymbol}{Number(formData.targetRaise || 40000000).toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>VALUATION CAP</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>
                  {currencySymbol}{Number(formData.valuationCap || 280000000).toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>EQUITY OFFERED</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>
                  {formData.equityOffered}%
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>COMMITTED SO FAR</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10B981', marginTop: '4px' }}>
                  {currencySymbol}{Number(formData.capitalCommitted || 18000000).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* 2-Column Content: Market vs Defensibility */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                  Market Opportunity (TAM / SAM / SOM)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Total Addressable (TAM)</span>
                    <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>{currencySymbol}{Number(formData.tam || 42000000000).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Serviceable Available (SAM)</span>
                    <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>{currencySymbol}{Number(formData.sam || 8500000000).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Serviceable Obtainable (SOM)</span>
                    <strong style={{ fontSize: '0.95rem', color: '#2563EB' }}>{currencySymbol}{Number(formData.som || 1200000000).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                  Core Defensibility & Competitive Moat
                </h4>
                <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, fontWeight: 500 }}>
                    {formData.distributionMoat || 'Proprietary spatial data graph and direct API integration with official registry databases.'}
                  </p>
                </div>
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Primary Competitors:</span>
                  {[formData.competitor1, formData.competitor2, formData.competitor3].filter(Boolean).map((comp, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', backgroundColor: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Core Team Credentials */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                Leadership & Founding Team
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '0.85rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <strong style={{ fontSize: '0.92rem', color: '#0F172A', display: 'block' }}>{formData.fullName || formData.founder}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{formData.role || 'CEO'}</span>
                  {formData.linkedinUrl && (
                    <a href={formData.linkedinUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#2563EB', display: 'block', marginTop: '4px' }}>
                      LinkedIn Profile ↗
                    </a>
                  )}
                </div>
                {(formData.team || []).map((m, idx) => (
                  <div key={idx} style={{ padding: '0.85rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <strong style={{ fontSize: '0.92rem', color: '#0F172A', display: 'block' }}>{m.name || 'Core Member'}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{m.role || 'Engineering / Ops'}</span>
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#2563EB', display: 'block', marginTop: '4px' }}>
                        LinkedIn Profile ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Teaser Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem', fontSize: '0.78rem', color: '#94A3B8' }}>
              <span>Generated via WaouFund AI Fundraising Studio • Investor Diligence Hub</span>
              <span>Contact: {formData.email || 'founder@startup.com'}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── AVATAR URL MODAL ───────────────────────────────────────────── */}
      {showAvatarModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '440px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              Update Profile Avatar
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Paste an image URL for your founder photo (e.g. Unsplash, LinkedIn headshot, or hosted avatar):
            </p>
            <input
              type="url"
              value={avatarInputUrl}
              onChange={(e) => setAvatarInputUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              style={{
                width: '100%',
                backgroundColor: '#F8FAFC',
                border: '1.5px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.9rem',
                color: '#0F172A',
                marginBottom: '1.25rem',
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="btn-outline"
                style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (avatarInputUrl.trim()) {
                    handleChange('profileImage', avatarInputUrl.trim());
                  }
                  setShowAvatarModal(false);
                }}
                className="btn-primary"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
              >
                Update Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
