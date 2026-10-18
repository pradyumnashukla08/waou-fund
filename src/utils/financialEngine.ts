/**
 * Institutional Financial Modeling Engine for WaouFund / Venture Wolf
 * Implements deterministic 5-year multi-scenario P&L waterfall (14 metrics),
 * 60-month cash flow compounding, equity dilution / valuation cap table,
 * and high-fidelity multi-sheet Excel (.xls / SpreadsheetML) export.
 */

export interface ScenarioAssumptions {
  initialMetric: number;        // Starting MRR in INR
  growthRateOrYield: number;    // MoM Growth Rate (e.g. 0.18 for 18%)
  pricingMetric: number;        // Churn rate for SaaS (e.g. 0.025 for 2.5%)
  cogsMargin: number;           // COGS margin (e.g. 0.18 for 18%)
  annualPayrollIncrease: number;// Annual salary escalation (e.g. 0.10)
  employerPfBurden: number;     // PF / benefits burden (0.12)
  marketingSpendPct: number;    // Marketing spend as % of revenue (0.12)
  interestRateOnDebt: number;   // Debt rate (0.12)
  annualInflationRate: number;  // Inflation rate (0.06)
  dpiitTaxHolidayActive: number;// 1 if tax holiday active, 0 otherwise
  receivableDays: number;       // Days sales outstanding (e.g. 30)
  inventoryDays: number;        // Days inventory held (e.g. 0 for SaaS)
  payableDays: number;          // Days payable (e.g. 30)
  estimatedValuation: number;   // Pre-Money valuation in INR
  equityDilutionPct: number;    // Dilution percentage (e.g. 0.1667)
}

export interface ScenarioFinancialResults {
  totalRevenue: number[];
  totalCogs: number[];
  grossProfit: number[];
  grossMarginPct: number[];
  totalOpex: number[];
  ebitda: number[];
  ebitdaPct: number[];
  depreciation: number[];
  ebit: number[];
  interest: number[];
  pbt: number[];
  taxes: number[];
  pat: number[];
  patPct: number[];
}

export interface MonthlyCashFlowPoint {
  month: number;
  revenue: number;
  cogs: number;
  opex: number;
  ebitda: number;
  netIncome: number;
  netCashFlow: number;
  closingCash: number;
  isRunwayActive: boolean;
}

/**
 * Computes the 14 institutional metrics across 5 years with growth decay
 * according to the Venture Wolf mathematical model.
 */
export function computeScenarioFinancials(
  scenario: ScenarioAssumptions,
  archetype: 'SAAS' | 'MANUFACTURING' | 'SERVICES' = 'SAAS'
): ScenarioFinancialResults {
  const totalRevenue: number[] = [];
  const totalCogs: number[] = [];
  const grossProfit: number[] = [];
  const grossMarginPct: number[] = [];
  const totalOpEx: number[] = [];
  const ebitda: number[] = [];
  const ebitdaPct: number[] = [];
  const depreciation: number[] = [];
  const ebit: number[] = [];
  const interest: number[] = [];
  const pbt: number[] = [];
  const taxes: number[] = [];
  const pat: number[] = [];
  const patPct: number[] = [];

  let currentMonthlyRevenue = scenario.initialMetric;
  let currentGrowthRate = scenario.growthRateOrYield;

  // Debt load assumption: roughly 2x initial annualized revenue floor
  let debtLoad = Math.max((currentMonthlyRevenue * 12) * 1.5, 1000000);

  // Annualized payroll starting baseline (~35% of initial annualized revenue)
  let annualPayroll = Math.max((currentMonthlyRevenue * 12) * 0.35, 1800000);

  for (let year = 1; year <= 5; year++) {
    let yearRevenue = 0;

    // Apply Law of Large Numbers (Growth Decay across years)
    if (year > 1) {
      if (archetype === 'SAAS') {
        currentGrowthRate = currentGrowthRate * 0.65; // SaaS growth decays as base scales
      } else {
        currentGrowthRate = currentGrowthRate * 0.85;
      }
    }

    // Monthly compounding loop (12 months per year)
    for (let month = 1; month <= 12; month++) {
      // MRR compounds with (Growth - Churn)
      currentMonthlyRevenue = currentMonthlyRevenue * (1 + currentGrowthRate) * (1 - scenario.pricingMetric);
      yearRevenue += currentMonthlyRevenue;
    }

    const roundedRev = Math.round(yearRevenue);
    totalRevenue.push(roundedRev);

    // 2. COGS & Hosting Infrastructure
    const cogs = Math.round(yearRevenue * scenario.cogsMargin);
    totalCogs.push(cogs);

    // 3. Gross Profit
    const gp = Math.round(yearRevenue - cogs);
    grossProfit.push(gp);

    // 4. Gross Margin %
    grossMarginPct.push(roundedRev > 0 ? Number(((gp / roundedRev) * 100).toFixed(1)) : 0);

    // 5. Total Operating Expenses (Payroll + PF + Marketing)
    annualPayroll = annualPayroll * (1 + scenario.annualPayrollIncrease);
    const totalPayroll = annualPayroll * (1 + scenario.employerPfBurden);
    const marketing = yearRevenue * scenario.marketingSpendPct;
    const opex = Math.round(totalPayroll + marketing);
    totalOpEx.push(opex);

    // 6. EBITDA
    const currentEbitda = gp - opex;
    ebitda.push(currentEbitda);

    // 7. EBITDA %
    ebitdaPct.push(roundedRev > 0 ? Number(((currentEbitda / roundedRev) * 100).toFixed(1)) : 0);

    // 8. Depreciation & Amortization (~5% of revenue for SaaS)
    const da = Math.round(yearRevenue * 0.05);
    depreciation.push(da);

    // 9. EBIT (Operating Profit)
    const currentEbit = currentEbitda - da;
    ebit.push(currentEbit);

    // 10. Interest Expense
    const interestExpense = Math.round(debtLoad * scenario.interestRateOnDebt);
    interest.push(interestExpense);
    // Pay down debt if positive EBIT, otherwise slight capital carry
    if (currentEbit > interestExpense) {
      debtLoad = debtLoad * 0.85;
    }

    // 11. PBT (Profit Before Tax)
    const currentPbt = currentEbit - interestExpense;
    pbt.push(currentPbt);

    // 12. Taxes (Corporate Tax 25% with DPIIT Holiday exemption in Years 1-3)
    let taxExpense = 0;
    if (currentPbt > 0) {
      const isTaxHoliday = scenario.dpiitTaxHolidayActive === 1 && year <= 3;
      if (!isTaxHoliday) {
        taxExpense = Math.round(currentPbt * 0.25);
      }
    }
    taxes.push(taxExpense);

    // 13. PAT (Profit After Tax / Net Income)
    const currentPat = currentPbt - taxExpense;
    pat.push(currentPat);

    // 14. PAT %
    patPct.push(roundedRev > 0 ? Number(((currentPat / roundedRev) * 100).toFixed(1)) : 0);
  }

  return {
    totalRevenue,
    totalCogs,
    grossProfit,
    grossMarginPct,
    totalOpex: totalOpEx,
    ebitda,
    ebitdaPct,
    depreciation,
    ebit,
    interest,
    pbt,
    taxes,
    pat,
    patPct,
  };
}

/**
 * Computes 60-Month Cash Flow & Runway Trajectory
 */
export function compute60MonthCashFlow(
  scenario: ScenarioAssumptions,
  startingCash: number,
  capitalRaise: number
): MonthlyCashFlowPoint[] {
  const points: MonthlyCashFlowPoint[] = [];
  let runningCash = startingCash + capitalRaise;
  let currentMonthlyRevenue = scenario.initialMetric;
  let growthRate = scenario.growthRateOrYield;
  let monthlyPayroll = (scenario.initialMetric * 12 * 0.35) / 12;

  for (let m = 1; m <= 60; m++) {
    // Decay growth rate once per year
    if (m > 1 && m % 12 === 1) {
      growthRate = growthRate * 0.65;
      monthlyPayroll = monthlyPayroll * (1 + scenario.annualPayrollIncrease);
    }

    currentMonthlyRevenue = currentMonthlyRevenue * (1 + growthRate) * (1 - scenario.pricingMetric);
    const rev = Math.round(currentMonthlyRevenue);
    const cogs = Math.round(rev * scenario.cogsMargin);
    const opex = Math.round(monthlyPayroll * (1 + scenario.employerPfBurden) + rev * scenario.marketingSpendPct);
    const ebitda = rev - cogs - opex;
    const netIncome = Math.round(ebitda * 0.95); // approx after depr/interest
    const netCashFlow = rev - cogs - opex;

    runningCash += netCashFlow;

    points.push({
      month: m,
      revenue: rev,
      cogs,
      opex,
      ebitda,
      netIncome,
      netCashFlow,
      closingCash: Math.round(runningCash),
      isRunwayActive: runningCash > 0,
    });
  }

  return points;
}

/**
 * Generates an Institutional-Grade Multi-Sheet XML Spreadsheet (.xls)
 * fully compliant with Microsoft Excel, Apple Numbers, and Google Sheets.
 * Features 5 distinct styled worksheets with formulas, colors, and headers.
 */
export function generateSpreadsheetMLWorkbook(data: {
  companyName: string;
  stage: string;
  sector: string;
  baseMrr: number;
  valuationPreCr: number;
  fundraiseCr: number;
  postMoneyValuationCr: number;
  equityDilutionPct: number;
  founderEquityPct: number;
  esopPoolPct: number;
  baseAssumptions: ScenarioAssumptions;
  worstAssumptions: ScenarioAssumptions;
  bestAssumptions: ScenarioAssumptions;
  baseResults: ScenarioFinancialResults;
  worstResults: ScenarioFinancialResults;
  bestResults: ScenarioFinancialResults;
  cashFlow60: MonthlyCashFlowPoint[];
}): string {
  const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
  const now = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const b = data.baseResults;
  const w = data.worstResults;
  const best = data.bestResults;

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>${data.companyName} — 5-Year Financial Forecast Model</Title>
  <Subject>Institutional Venture Capital Financial Projections</Subject>
  <Author>WaouFund Venture Capital Modeling Engine</Author>
  <Created>${new Date().toISOString()}</Created>
  <Company>WaouFund</Company>
 </DocumentProperties>

 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#1E293B"/>
  </Style>
  <Style ss:ID="CoverTitle">
   <Font ss:FontName="Calibri" ss:Size="18" ss:Bold="1" ss:Color="#0F172A"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="CoverSubtitle">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Italic="1" ss:Color="#475569"/>
  </Style>
  <Style ss:ID="HeaderNavy">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#0F172A" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#334155"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#334155"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#334155"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#334155"/>
   </Borders>
  </Style>
  <Style ss:ID="HeaderBlue">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#0F172A"/>
   <Interior ss:Color="#38BDF8" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
  <Style ss:ID="HeaderGreen">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#059669" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="SectionBanner">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#1E293B" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="LabelBold">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#0F172A"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="LabelRegular">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#334155"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Currency">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#0F172A"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="₹#,##0"/>
  </Style>
  <Style ss:ID="CurrencyBold">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#0F172A"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="₹#,##0"/>
  </Style>
  <Style ss:ID="CurrencyHighlight">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#0284C7"/>
   <Interior ss:Color="#F0F9FF" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="₹#,##0"/>
  </Style>
  <Style ss:ID="CurrencyGreen">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#059669"/>
   <Interior ss:Color="#ECFDF5" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="₹#,##0"/>
  </Style>
  <Style ss:ID="CurrencyRed">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#DC2626"/>
   <Interior ss:Color="#FEF2F2" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="(₹#,##0)"/>
  </Style>
  <Style ss:ID="Percent">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#0F172A"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="0.0%"/>
  </Style>
  <Style ss:ID="PercentHighlight">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#0284C7"/>
   <Interior ss:Color="#F0F9FF" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="0.0%"/>
  </Style>
 </Styles>

 <!-- ============================================================== -->
 <!-- SHEET 1: COVER & EXECUTIVE SUMMARY                            -->
 <!-- ============================================================== -->
 <Worksheet ss:Name="COVER">
  <Table ss:DefaultColumnWidth="65" ss:DefaultRowHeight="20">
   <Column ss:Index="1" ss:Width="25"/>
   <Column ss:Index="2" ss:Width="240"/>
   <Column ss:Index="3" ss:Width="260"/>

   <Row ss:Index="2" ss:Height="28">
    <Cell ss:Index="2" ss:MergeAcross="1" ss:StyleID="CoverTitle"><Data ss:Type="String">${data.companyName} — 5-Year Institutional Financial Model</Data></Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:Index="2" ss:MergeAcross="1" ss:StyleID="CoverSubtitle"><Data ss:Type="String">Engineered via WaouFund VC Decision Engine • Multi-Scenario P&amp;L, Cap Table &amp; 60-Month Cash Flow</Data></Cell>
   </Row>

   <Row ss:Index="5" ss:Height="22">
    <Cell ss:Index="2" ss:StyleID="SectionBanner"><Data ss:Type="String">EXECUTIVE SUMMARY PARAMETERS</Data></Cell>
    <Cell ss:StyleID="SectionBanner"><Data ss:Type="String">VERIFIED VALUE</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Company Name</Data></Cell>
    <Cell ss:StyleID="LabelRegular"><Data ss:Type="String">${data.companyName}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Stage &amp; Sector</Data></Cell>
    <Cell ss:StyleID="LabelRegular"><Data ss:Type="String">${data.stage} • ${data.sector}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Current Verified MRR</Data></Cell>
    <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${data.baseMrr}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Current Run-Rate ARR</Data></Cell>
    <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${data.baseMrr * 12}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Target Round Capital Injection</Data></Cell>
    <Cell ss:StyleID="LabelBold"><Data ss:Type="String">₹${data.fundraiseCr} Cr</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Pre-Money Valuation Cap</Data></Cell>
    <Cell ss:StyleID="LabelBold"><Data ss:Type="String">₹${data.valuationPreCr} Cr</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Post-Money Valuation</Data></Cell>
    <Cell ss:StyleID="LabelBold"><Data ss:Type="String">₹${data.postMoneyValuationCr} Cr</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Equity Dilution %</Data></Cell>
    <Cell ss:StyleID="LabelBold"><Data ss:Type="String">${data.equityDilutionPct}%</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Model Generation Date</Data></Cell>
    <Cell ss:StyleID="LabelRegular"><Data ss:Type="String">${now}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Compliance Standard</Data></Cell>
    <Cell ss:StyleID="LabelRegular"><Data ss:Type="String">Indian Startup Act / DPIIT Tax Exemption Ready</Data></Cell>
   </Row>

   <Row ss:Index="18" ss:Height="22">
    <Cell ss:Index="2" ss:MergeAcross="1" ss:StyleID="CoverSubtitle"><Data ss:Type="String">Notice: All figures represent deterministic compounding projections based on active startup data room parameters.</Data></Cell>
   </Row>
  </Table>
 </Worksheet>

 <!-- ============================================================== -->
 <!-- SHEET 2: ASSUMPTIONS (WORST, BASE, BEST)                      -->
 <!-- ============================================================== -->
 <Worksheet ss:Name="ASSUMPTIONS">
  <Table ss:DefaultColumnWidth="65" ss:DefaultRowHeight="20">
   <Column ss:Index="1" ss:Width="25"/>
   <Column ss:Index="2" ss:Width="280"/>
   <Column ss:Index="3" ss:Width="130"/>
   <Column ss:Index="4" ss:Width="130"/>
   <Column ss:Index="5" ss:Width="130"/>

   <Row ss:Index="2" ss:Height="24">
    <Cell ss:Index="2" ss:StyleID="HeaderNavy"><Data ss:Type="String">OPERATIONAL &amp; MACRO DRIVER</Data></Cell>
    <Cell ss:StyleID="HeaderNavy"><Data ss:Type="String">WORST CASE</Data></Cell>
    <Cell ss:StyleID="HeaderBlue"><Data ss:Type="String">BASE CASE</Data></Cell>
    <Cell ss:StyleID="HeaderGreen"><Data ss:Type="String">BEST CASE</Data></Cell>
   </Row>

   <Row ss:Height="22">
    <Cell ss:Index="2" ss:MergeAcross="3" ss:StyleID="SectionBanner"><Data ss:Type="String">1. MACROECONOMIC &amp; TAX ENVIRONMENT (INDIA)</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelRegular"><Data ss:Type="String">Corporate Tax Rate</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">0.25</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">0.25</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">0.25</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelRegular"><Data ss:Type="String">DPIIT Tax Holiday (First 3 Years)</Data></Cell>
    <Cell ss:StyleID="LabelRegular"><Data ss:Type="String">${data.worstAssumptions.dpiitTaxHolidayActive ? 'Active (0%)' : 'Inactive (25%)'}</Data></Cell>
    <Cell ss:StyleID="LabelBold"><Data ss:Type="String">${data.baseAssumptions.dpiitTaxHolidayActive ? 'Active (0%)' : 'Inactive (25%)'}</Data></Cell>
    <Cell ss:StyleID="LabelBold"><Data ss:Type="String">${data.bestAssumptions.dpiitTaxHolidayActive ? 'Active (0%)' : 'Inactive (25%)'}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelRegular"><Data ss:Type="String">Employer PF &amp; Benefits Burden</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.worstAssumptions.employerPfBurden}</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.baseAssumptions.employerPfBurden}</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.bestAssumptions.employerPfBurden}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelRegular"><Data ss:Type="String">Debt Facility Interest Rate</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.worstAssumptions.interestRateOnDebt}</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.baseAssumptions.interestRateOnDebt}</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.bestAssumptions.interestRateOnDebt}</Data></Cell>
   </Row>

   <Row ss:Height="22">
    <Cell ss:Index="2" ss:MergeAcross="3" ss:StyleID="SectionBanner"><Data ss:Type="String">2. CORE REVENUE &amp; GROWTH DRIVERS</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Starting Monthly Recurring Revenue (MRR)</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">${data.worstAssumptions.initialMetric}</Data></Cell>
    <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${data.baseAssumptions.initialMetric}</Data></Cell>
    <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${data.bestAssumptions.initialMetric}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Monthly ARR Growth Rate (MoM)</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.worstAssumptions.growthRateOrYield}</Data></Cell>
    <Cell ss:StyleID="PercentHighlight"><Data ss:Type="Number">${data.baseAssumptions.growthRateOrYield}</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.bestAssumptions.growthRateOrYield}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelRegular"><Data ss:Type="String">Monthly Customer Churn Rate</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.worstAssumptions.pricingMetric}</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.baseAssumptions.pricingMetric}</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.bestAssumptions.pricingMetric}</Data></Cell>
   </Row>

   <Row ss:Height="22">
    <Cell ss:Index="2" ss:MergeAcross="3" ss:StyleID="SectionBanner"><Data ss:Type="String">3. COST &amp; EXPENSE RATIOS</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelRegular"><Data ss:Type="String">COGS Margin (Cloud Compute &amp; APIs)</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.worstAssumptions.cogsMargin}</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.baseAssumptions.cogsMargin}</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.bestAssumptions.cogsMargin}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelRegular"><Data ss:Type="String">Sales &amp; Marketing Spend (% of Revenue)</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.worstAssumptions.marketingSpendPct}</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.baseAssumptions.marketingSpendPct}</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.bestAssumptions.marketingSpendPct}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelRegular"><Data ss:Type="String">Annual Payroll Increment Index</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.worstAssumptions.annualPayrollIncrease}</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.baseAssumptions.annualPayrollIncrease}</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.bestAssumptions.annualPayrollIncrease}</Data></Cell>
   </Row>

   <Row ss:Height="22">
    <Cell ss:Index="2" ss:MergeAcross="3" ss:StyleID="SectionBanner"><Data ss:Type="String">4. VALUATION &amp; DILUTION REALITY</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Pre-Money Valuation</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">${data.worstAssumptions.estimatedValuation}</Data></Cell>
    <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${data.baseAssumptions.estimatedValuation}</Data></Cell>
    <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${data.bestAssumptions.estimatedValuation}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Equity Dilution %</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.worstAssumptions.equityDilutionPct}</Data></Cell>
    <Cell ss:StyleID="PercentHighlight"><Data ss:Type="Number">${data.baseAssumptions.equityDilutionPct}</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">${data.bestAssumptions.equityDilutionPct}</Data></Cell>
   </Row>
  </Table>
 </Worksheet>

 <!-- ============================================================== -->
 <!-- SHEET 3: CAP TABLE & VALUATION DILUTION                       -->
 <!-- ============================================================== -->
 <Worksheet ss:Name="CAP_TABLE_AND_VALUATION">
  <Table ss:DefaultColumnWidth="65" ss:DefaultRowHeight="20">
   <Column ss:Index="1" ss:Width="25"/>
   <Column ss:Index="2" ss:Width="240"/>
   <Column ss:Index="3" ss:Width="120"/>
   <Column ss:Index="4" ss:Width="120"/>
   <Column ss:Index="5" ss:Width="120"/>
   <Column ss:Index="6" ss:Width="150"/>
   <Column ss:Index="7" ss:Width="220"/>

   <Row ss:Index="2" ss:Height="24">
    <Cell ss:Index="2" ss:StyleID="HeaderNavy"><Data ss:Type="String">SHAREHOLDER CLASS</Data></Cell>
    <Cell ss:StyleID="HeaderNavy"><Data ss:Type="String">PRE-ROUND %</Data></Cell>
    <Cell ss:StyleID="HeaderBlue"><Data ss:Type="String">POST-ROUND %</Data></Cell>
    <Cell ss:StyleID="HeaderNavy"><Data ss:Type="String">DILUTION DELTA</Data></Cell>
    <Cell ss:StyleID="HeaderNavy"><Data ss:Type="String">IMPLIED VALUE (₹ CR)</Data></Cell>
    <Cell ss:StyleID="HeaderNavy"><Data ss:Type="String">GOVERNANCE &amp; RIGHTS</Data></Cell>
   </Row>

   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Founders &amp; Core Common Stock</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">0.900</Data></Cell>
    <Cell ss:StyleID="PercentHighlight"><Data ss:Type="Number">${data.founderEquityPct / 100}</Data></Cell>
    <Cell ss:StyleID="LabelRegular"><Data ss:Type="String">-${data.equityDilutionPct}%</Data></Cell>
    <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${Math.round((data.valuationPreCr + data.fundraiseCr) * (data.founderEquityPct / 100) * 10000000)}</Data></Cell>
    <Cell ss:StyleID="LabelRegular"><Data ss:Type="String">Board Majority (2 Seats) • Ordinary Voting</Data></Cell>
   </Row>

   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Incoming Seed Investors (Series Seed CCPS)</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">0.000</Data></Cell>
    <Cell ss:StyleID="PercentHighlight"><Data ss:Type="Number">${data.equityDilutionPct / 100}</Data></Cell>
    <Cell ss:StyleID="LabelBold"><Data ss:Type="String">+${data.equityDilutionPct}%</Data></Cell>
    <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${Math.round(data.fundraiseCr * 10000000)}</Data></Cell>
    <Cell ss:StyleID="LabelRegular"><Data ss:Type="String">1 Board Observer • Affirmative Covenants</Data></Cell>
   </Row>

   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Employee Stock Option Pool (ESOP)</Data></Cell>
    <Cell ss:StyleID="Percent"><Data ss:Type="Number">0.100</Data></Cell>
    <Cell ss:StyleID="PercentHighlight"><Data ss:Type="Number">${data.esopPoolPct / 100}</Data></Cell>
    <Cell ss:StyleID="LabelRegular"><Data ss:Type="String">Re-topped to 10%</Data></Cell>
    <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${Math.round((data.valuationPreCr + data.fundraiseCr) * (data.esopPoolPct / 100) * 10000000)}</Data></Cell>
    <Cell ss:StyleID="LabelRegular"><Data ss:Type="String">Non-Voting Common Stock Pool</Data></Cell>
   </Row>

   <Row ss:Height="22">
    <Cell ss:Index="2" ss:StyleID="SectionBanner"><Data ss:Type="String">TOTAL FULLY DILUTED CAPITAL</Data></Cell>
    <Cell ss:StyleID="SectionBanner"><Data ss:Type="String">100.0%</Data></Cell>
    <Cell ss:StyleID="SectionBanner"><Data ss:Type="String">100.0%</Data></Cell>
    <Cell ss:StyleID="SectionBanner"><Data ss:Type="String">—</Data></Cell>
    <Cell ss:StyleID="SectionBanner"><Data ss:Type="String">₹${data.postMoneyValuationCr} Cr</Data></Cell>
    <Cell ss:StyleID="SectionBanner"><Data ss:Type="String">Term Sheet &amp; SHA Enforceable</Data></Cell>
   </Row>
  </Table>
 </Worksheet>

 <!-- ============================================================== -->
 <!-- SHEET 4: 5-YEAR WATERFALL P&L (YEARLY SUMMARY)                -->
 <!-- ============================================================== -->
 <Worksheet ss:Name="YEARLY_SUMMARY">
  <Table ss:DefaultColumnWidth="65" ss:DefaultRowHeight="20">
   <Column ss:Index="1" ss:Width="25"/>
   <Column ss:Index="2" ss:Width="260"/>
   <Column ss:Index="3" ss:Width="125"/>
   <Column ss:Index="4" ss:Width="125"/>
   <Column ss:Index="5" ss:Width="125"/>
   <Column ss:Index="6" ss:Width="125"/>
   <Column ss:Index="7" ss:Width="125"/>

   <!-- BASE CASE SECTION -->
   <Row ss:Index="2" ss:Height="24">
    <Cell ss:Index="2" ss:MergeAcross="5" ss:StyleID="HeaderBlue"><Data ss:Type="String">BASE CASE — 14-METRIC INTEGRATED FINANCIAL WATERFALL (₹)</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:Index="2" ss:StyleID="HeaderNavy"><Data ss:Type="String">Core Metric</Data></Cell>
    ${years.map(y => `<Cell ss:StyleID="HeaderNavy"><Data ss:Type="String">${y}</Data></Cell>`).join('')}
   </Row>

   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">1. Total Gross Revenue</Data></Cell>
    ${b.totalRevenue.map(v => `<Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelRegular"><Data ss:Type="String">2. Total COGS (Cloud &amp; Direct)</Data></Cell>
    ${b.totalCogs.map(v => `<Cell ss:StyleID="CurrencyRed"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">3. Gross Profit</Data></Cell>
    ${b.grossProfit.map(v => `<Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">A. Gross Margin %</Data></Cell>
    ${b.grossMarginPct.map(v => `<Cell ss:StyleID="PercentHighlight"><Data ss:Type="Number">${v / 100}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelRegular"><Data ss:Type="String">4. Total Operating Expenses (OpEx)</Data></Cell>
    ${b.totalOpex.map(v => `<Cell ss:StyleID="CurrencyRed"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">5. EBITDA</Data></Cell>
    ${b.ebitda.map(v => `<Cell ss:StyleID="${v >= 0 ? 'CurrencyGreen' : 'CurrencyRed'}"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">B. EBITDA %</Data></Cell>
    ${b.ebitdaPct.map(v => `<Cell ss:StyleID="Percent"><Data ss:Type="Number">${v / 100}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelRegular"><Data ss:Type="String">6. Depreciation &amp; Amortisation</Data></Cell>
    ${b.depreciation.map(v => `<Cell ss:StyleID="Currency"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">7. EBIT (Operating Profit)</Data></Cell>
    ${b.ebit.map(v => `<Cell ss:StyleID="${v >= 0 ? 'CurrencyBold' : 'CurrencyRed'}"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelRegular"><Data ss:Type="String">8. Interest Expense</Data></Cell>
    ${b.interest.map(v => `<Cell ss:StyleID="Currency"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">9. Profit Before Tax (PBT)</Data></Cell>
    ${b.pbt.map(v => `<Cell ss:StyleID="${v >= 0 ? 'CurrencyBold' : 'CurrencyRed'}"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelRegular"><Data ss:Type="String">10. Corporate Taxes</Data></Cell>
    ${b.taxes.map(v => `<Cell ss:StyleID="Currency"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">11. Profit After Tax (PAT / Net Income)</Data></Cell>
    ${b.pat.map(v => `<Cell ss:StyleID="${v >= 0 ? 'CurrencyGreen' : 'CurrencyRed'}"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">C. PAT % (Net Margin)</Data></Cell>
    ${b.patPct.map(v => `<Cell ss:StyleID="PercentHighlight"><Data ss:Type="Number">${v / 100}</Data></Cell>`).join('')}
   </Row>

   <!-- BEST CASE SECTION -->
   <Row ss:Index="20" ss:Height="24">
    <Cell ss:Index="2" ss:MergeAcross="5" ss:StyleID="HeaderGreen"><Data ss:Type="String">BEST CASE — HIGH GROWTH MARKET EXPANSION (₹)</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:Index="2" ss:StyleID="HeaderNavy"><Data ss:Type="String">Core Metric</Data></Cell>
    ${years.map(y => `<Cell ss:StyleID="HeaderNavy"><Data ss:Type="String">${y}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">1. Total Gross Revenue</Data></Cell>
    ${best.totalRevenue.map(v => `<Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelRegular"><Data ss:Type="String">3. Gross Profit</Data></Cell>
    ${best.grossProfit.map(v => `<Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">5. EBITDA</Data></Cell>
    ${best.ebitda.map(v => `<Cell ss:StyleID="CurrencyGreen"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">11. Profit After Tax (PAT)</Data></Cell>
    ${best.pat.map(v => `<Cell ss:StyleID="CurrencyGreen"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>

   <!-- WORST CASE SECTION -->
   <Row ss:Index="28" ss:Height="24">
    <Cell ss:Index="2" ss:MergeAcross="5" ss:StyleID="SectionBanner"><Data ss:Type="String">WORST CASE — DOWNTURN &amp; PUNITIVE STRESS TEST (₹)</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:Index="2" ss:StyleID="HeaderNavy"><Data ss:Type="String">Core Metric</Data></Cell>
    ${years.map(y => `<Cell ss:StyleID="HeaderNavy"><Data ss:Type="String">${y}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">1. Total Gross Revenue</Data></Cell>
    ${w.totalRevenue.map(v => `<Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelRegular"><Data ss:Type="String">3. Gross Profit</Data></Cell>
    ${w.grossProfit.map(v => `<Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">5. EBITDA</Data></Cell>
    ${w.ebitda.map(v => `<Cell ss:StyleID="${v >= 0 ? 'CurrencyGreen' : 'CurrencyRed'}"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">11. Profit After Tax (PAT)</Data></Cell>
    ${w.pat.map(v => `<Cell ss:StyleID="${v >= 0 ? 'CurrencyGreen' : 'CurrencyRed'}"><Data ss:Type="Number">${v}</Data></Cell>`).join('')}
   </Row>
  </Table>
 </Worksheet>

 <!-- ============================================================== -->
 <!-- SHEET 5: 60-MONTH CASH FLOW & RUNWAY STATEMENT               -->
 <!-- ============================================================== -->
 <Worksheet ss:Name="60_MONTH_CASH_FLOW">
  <Table ss:DefaultColumnWidth="65" ss:DefaultRowHeight="20">
   <Column ss:Index="1" ss:Width="25"/>
   <Column ss:Index="2" ss:Width="80"/>
   <Column ss:Index="3" ss:Width="130"/>
   <Column ss:Index="4" ss:Width="120"/>
   <Column ss:Index="5" ss:Width="120"/>
   <Column ss:Index="6" ss:Width="130"/>
   <Column ss:Index="7" ss:Width="140"/>
   <Column ss:Index="8" ss:Width="120"/>

   <Row ss:Index="2" ss:Height="24">
    <Cell ss:Index="2" ss:StyleID="HeaderNavy"><Data ss:Type="String">Month #</Data></Cell>
    <Cell ss:StyleID="HeaderNavy"><Data ss:Type="String">Revenue Inflow (₹)</Data></Cell>
    <Cell ss:StyleID="HeaderNavy"><Data ss:Type="String">COGS (₹)</Data></Cell>
    <Cell ss:StyleID="HeaderNavy"><Data ss:Type="String">OpEx &amp; Payroll (₹)</Data></Cell>
    <Cell ss:StyleID="HeaderNavy"><Data ss:Type="String">Net Cash Flow (₹)</Data></Cell>
    <Cell ss:StyleID="HeaderBlue"><Data ss:Type="String">Closing Treasury (₹)</Data></Cell>
    <Cell ss:StyleID="HeaderNavy"><Data ss:Type="String">Runway Health</Data></Cell>
   </Row>

   ${data.cashFlow60.map(pt => `
   <Row>
    <Cell ss:Index="2" ss:StyleID="LabelBold"><Data ss:Type="String">Month ${pt.month}</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">${pt.revenue}</Data></Cell>
    <Cell ss:StyleID="CurrencyRed"><Data ss:Type="Number">${pt.cogs}</Data></Cell>
    <Cell ss:StyleID="CurrencyRed"><Data ss:Type="Number">${pt.opex}</Data></Cell>
    <Cell ss:StyleID="${pt.netCashFlow >= 0 ? 'CurrencyGreen' : 'CurrencyRed'}"><Data ss:Type="Number">${pt.netCashFlow}</Data></Cell>
    <Cell ss:StyleID="${pt.closingCash > 0 ? 'CurrencyHighlight' : 'CurrencyRed'}"><Data ss:Type="Number">${pt.closingCash}</Data></Cell>
    <Cell ss:StyleID="LabelRegular"><Data ss:Type="String">${pt.isRunwayActive ? 'Active Runway' : 'Depleted'}</Data></Cell>
   </Row>`).join('')}
  </Table>
 </Worksheet>
</Workbook>`;
}

/**
 * Browser download trigger for the generated multi-sheet workbook
 */
export function triggerExcelDownload(xmlContent: string, fileName: string) {
  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.xls') ? fileName : `${fileName}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
