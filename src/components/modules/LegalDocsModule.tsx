import React, { useState } from 'react';
import { 
  Scale, 
  ChevronDown, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { LEGAL_STANDARDS, StartupProfile } from '../../data/defaultData';

interface LegalDocsModuleProps {
  startup?: StartupProfile;
}

export const LegalDocsModule: React.FC<LegalDocsModuleProps> = ({ startup }) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const getInstitutionalLegalTemplate = (title: string) => {
    const comp = startup?.name || 'Company Inc.';
    const founder = startup?.founder || 'Founder';
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    if (title.toLowerCase().includes('safe')) {
      return {
        filename: `${comp.replace(/\s+/g, '_')}_PostMoney_SAFE_YC_Standard.txt`,
        text: `THIS INSTRUMENT AND ANY SECURITIES ISSUABLE PURSUANT HERETO HAVE NOT BEEN REGISTERED UNDER THE SECURITIES ACT OF 1933, AS AMENDED.

================================================================================
                    POST-MONEY SIMPLE AGREEMENT FOR FUTURE EQUITY
                               (YC Post-Money SAFE)
================================================================================

Company: ${comp}
Founder / Authorized Officer: ${founder}
Date of Execution: ${dateStr}
Governing Law: State of Delaware / Jurisdiction of Incorporation

THIS SIMPLE AGREEMENT FOR FUTURE EQUITY (this "Safe") is entered into between ${comp} (the "Company") and the undersigned Investor ("Investor") in consideration of the payment of the Purchase Amount.

1. EVENTS & CONVERSION
   (a) Equity Financing: If there is an Equity Financing before the expiration or termination of this Safe, the Company will automatically issue to the Investor a number of shares of Safe Preferred Stock equal to the Purchase Amount divided by the Safe Price.
   (b) Liquidity Event: If there is a Liquidity Event (Merger, Acquisition, or Initial Public Offering) before the expiration or termination of this Safe, the Investor will, at its option, either (i) receive a cash payment equal to the Purchase Amount (subject to Section 1(d)) or (ii) receive from the Company a number of shares of Common Stock equal to the Purchase Amount divided by the Liquidity Price.
   (c) Dissolution Event: If there is a Dissolution Event before this Safe expires or terminates, the Company will pay an amount equal to the Purchase Amount, immediately prior to, or concurrently with, the effectiveness of the Dissolution Event.

2. DEFINITIONS & FORMULAS
   - "Valuation Cap": Post-Money Valuation Cap agreed upon by Company and Lead Syndicate.
   - "Company Capitalization": Calculated on a fully-diluted basis including all issued common shares, preferred shares, and unallocated Option/ESOP pool.
   - "Discount Rate": 100% (No discount unless explicitly scheduled in Addendum A).

3. COMPANY REPRESENTATIONS & WARRANTIES
   (a) The Company is a corporation duly organized, validly existing and in good standing under the laws of its state of incorporation.
   (b) The execution, delivery and performance of this Safe have been duly authorized by all requisite corporate actions of the Company.
   (c) The issuance of Safe Preferred Stock or Common Stock pursuant hereto will not violate any term of the Company's Certificate of Incorporation or Bylaws.

4. INVESTOR REPRESENTATIONS
   (a) Investor is an "Accredited Investor" as defined in Rule 501(a) of Regulation D under the Securities Act.
   (b) Investor is acquiring this Safe for its own account for investment, not with a view to distribution.

5. MISCELLANEOUS
   This Safe constitutes the full and entire understanding between the parties. Amendments require written consent of both the Company and the Majority-in-Interest of Safe holders.

IN WITNESS WHEREOF, the undersigned have executed this Safe as of ${dateStr}.

COMPANY:
${comp}
By: _____________________________
Name: ${founder}
Title: Chief Executive Officer & Co-Founder

INVESTOR:
_________________________________
Authorized Signatory: ___________
Title: __________________________`,
      };
    }

    if (title.toLowerCase().includes('vesting')) {
      return {
        filename: `${comp.replace(/\s+/g, '_')}_Founder_Stock_Vesting_Agreement.txt`,
        text: `================================================================================
           RESTRICTED STOCK PURCHASE & FOUNDER VESTING AGREEMENT
================================================================================

Company: ${comp}
Founder: ${founder}
Effective Date: ${dateStr}

This Restricted Stock Purchase Agreement (the "Agreement") is made between ${comp} (the "Company") and ${founder} (the "Founder").

1. ISSUANCE & VESTING SCHEDULE
   (a) Total Shares: The Company hereby issues to Founder shares of Common Stock representing Founder's agreed initial equity holding.
   (b) 4-Year Vesting with 1-Year Cliff:
       - 25% of the Shares shall vest on the first anniversary of the Vesting Commencement Date (the "Cliff").
       - The remaining 75% of the Shares shall vest in equal monthly installments (1/48th per month) over the subsequent 36 months of continuous active service.

2. REPURCHASE OPTION UPON TERMINATION
   If the Founder ceases to provide services to the Company as an employee, officer, director, or consultant for any reason, the Company shall have an irrevocable option to repurchase all unvested Shares at the original par value purchase price.

3. ACCELERATION PROVISIONS (DOUBLE-TRIGGER)
   In the event of a Change of Control (acquisition or merger of the Company), and if within 12 months following such event Founder's employment is terminated without Cause or Founder resigns for Good Reason, 100% of Founder's remaining unvested Shares shall immediately vest.

4. INTELLECTUAL PROPERTY & PROPRIETARY INFORMATION
   All patents, inventions, software code, algorithms, brand marks, and technical documentation developed by Founder related to the Company's business are hereby assigned irrevocably and exclusively to ${comp}.

5. SECTION 83(b) ELECTION NOTICE
   Founder acknowledges the vital importance of filing an election under Section 83(b) of the Internal Revenue Code within thirty (30) days from the Effective Date hereof with the relevant tax authority.

SIGNATURES:

COMPANY: ${comp}
By: _____________________________
Name: Authorized Officer
Title: Director

FOUNDER:
_________________________________
Signature: ${founder}
Date: ${dateStr}`,
      };
    }

    if (title.toLowerCase().includes('esop')) {
      return {
        filename: `${comp.replace(/\s+/g, '_')}_ESOP_Governance_Plan_Standard.txt`,
        text: `================================================================================
                    EMPLOYEE STOCK OPTION PLAN (ESOP) SCHEME
                                POLICY MANUAL
================================================================================

Entity: ${comp}
Founder / CEO: ${founder}
Adopted as of: ${dateStr}

1. PURPOSE & PRINCIPLES
   The purpose of the ${comp} Employee Stock Option Plan is to attract, retain, and incentivize top engineering, sales, and executive talent through alignment with long-term company enterprise valuation.

2. POOL ALLOCATION & SIZING
   (a) The total reserved ESOP pool shall represent 10.0% to 12.0% of the fully-diluted capitalization of the Company created at the Post-Money closing of the Seed financing round.
   (b) Pool unallocated shares shall remain under the governance of the Board Compensation Committee.

3. VESTING BENCHMARKS
   (a) Standard 4-Year Schedule: Options granted to full-time employees vest over 48 months:
       - 25% after 12 months continuous service (1-Year Cliff).
       - Remaining 75% in equal monthly increments over the following 36 months.
   (b) Performance Milestones: Up to 30% of executive option grants may be linked directly to audited ARR or product ship milestones.

4. EXERCISE PRICE & EXERCISE WINDOW
   (a) Exercise Price: Determined by the Board at Fair Market Value (FMV) or nominal par value in accordance with applicable tax statutes.
   (b) Extended Exercise Window: Departing team members in good standing shall have up to 5 years following termination to exercise vested options.

5. NON-TRANSFERABILITY
   Options are strictly personal and cannot be transferred, pledged, or encumbered other than by will or laws of descent.

BOARD APPROVAL CERTIFICATE:
Adopted by Resolution of the Board of Directors of ${comp} on ${dateStr}.

_________________________________
${founder}, Director & Co-Founder`,
      };
    }

    // Default: Term sheet
    return {
      filename: `${comp.replace(/\s+/g, '_')}_Institutional_Seed_Term_Sheet.txt`,
      text: `================================================================================
                      SERIES SEED PREFERRED STOCK TERM SHEET
                              (Summary of Terms)
================================================================================

Company: ${comp}
Founder(s): ${founder}
Date: ${dateStr}

This Term Sheet summarizes the principal terms of the Series Seed Preferred Stock financing of ${comp}.

1. FINANCING AMOUNT & VALUATION
   - Securities: Series Seed Preferred Stock
   - Investment Amount: Standard institutional seed tranche (e.g. ₹2,00,00,000 to ₹6,00,00,000)
   - Pre-Money Valuation: Negotiated post-diligence valuation cap
   - Post-Money Capitalization: As determined by fully-diluted capitalization table

2. LIQUIDATION PREFERENCE
   1x Non-Participating Preferred Stock. In any liquidation, dissolution, or winding up, proceeds distributed first to Series Seed Preferred until 1x original purchase price is repaid, with remainder pro-rata to Common Stock.

3. GOVERNANCE & BOARD REPRESENTATION
   - Board Size: Three (3) members total.
   - 2 Seats designated by Founders (${founder} and Co-Founders).
   - 1 Seat designated by Majority-in-Interest of Series Seed Lead Investors.
   - Observer Seats: Granted strictly to syndicates investing at least ₹50,00,000.

4. PROTECTIVE PROVISIONS
   Customary consent required from Majority of Series Seed for:
   (i) Liquidation or merger of the Company;
   (ii) Creation of a senior class of equity;
   (iii) Amendment of Certificate of Incorporation impacting Preferred rights.

5. INFORMATION RIGHTS & ROFR
   Major Investors (>₹25L) receive quarterly unaudited financial statements, annual audited reports, and right of first refusal on subsequent financing rounds.

6. CONFIDENTIALITY & GOVERNING LAW
   Delaware / Indian Companies Act standard.

PROPOSED AND AGREED:

COMPANY: ${comp}
By: _____________________________
Name: ${founder}

INVESTOR LEAD:
_________________________________
Authorized Representative`,
    };
  };

  const handleDownloadTemplate = (title: string) => {
    const { filename, text } = getInstitutionalLegalTemplate(title);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#6366F1',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <Scale size={14} />
          <span>LEGAL STANDARDS & FOUNDER PROTECTION LOCKER</span>
        </div>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.2rem)',
          fontWeight: 900,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-heading)',
          marginTop: '0.2rem',
        }}>
          Legal Standards & Term Sheets
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Deconstruct investor term sheets, prevent predatory liquidation preferences, and download clean YC-standard Post-Money SAFE agreements.
        </p>
      </div>

      {/* ── Accordion List ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {LEGAL_STANDARDS.map((std, idx) => {
          const isOpen = expandedIdx === idx;
          return (
            <div
              key={idx}
              className="card-elevated"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                onClick={() => setExpandedIdx(isOpen ? null : idx)}
                style={{
                  padding: '1.25rem 1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    color: '#818CF8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <FileText size={18} />
                  </div>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {std.title}
                  </span>
                </div>

                <ChevronDown 
                  size={18} 
                  color="var(--text-hint)" 
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} 
                />
              </div>

              {isOpen && (
                <div style={{
                  padding: '0 1.75rem 1.75rem 1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1.25rem',
                }}>
                  {/* The Standard Box */}
                  <div style={{
                    backgroundColor: 'var(--accent-bg-emerald)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10B981', letterSpacing: '0.06em' }}>
                      THE INSTITUTIONAL STANDARD:
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                      {std.standard}
                    </p>
                  </div>

                  {/* Red Flags Box */}
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#EF4444', letterSpacing: '0.06em' }}>
                      PREDATORY RED FLAGS TO REJECT:
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#F87171', marginTop: '4px', lineHeight: 1.5 }}>
                      {std.flags}
                    </p>
                  </div>

                  {/* Download Template button */}
                  <div>
                    <button
                      onClick={() => handleDownloadTemplate(std.title)}
                      className="btn-cyan"
                      style={{ padding: '0.6rem 1.25rem', fontSize: '0.84rem' }}
                    >
                      <Download size={14} />
                      <span>{std.actionLabel}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
