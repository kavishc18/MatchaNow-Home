import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight, TrendingUp, Upload,
  Cpu, CheckCircle, FileText, RefreshCw, BarChart2,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

const CALENDLY = 'https://calendly.com/matchanow-org/20-minute-meeting'

/* ─── Chart data ─── */
const TIME_SAVED_DATA = [
  { clients: '5', manual: 30, matcha: 5 },
  { clients: '10', manual: 60, matcha: 8 },
  { clients: '20', manual: 120, matcha: 14 },
  { clients: '30', manual: 180, matcha: 19 },
  { clients: '40', manual: 240, matcha: 23 },
  { clients: '50', manual: 300, matcha: 27 },
]

/* ─── Engine demo — 4 tab types ─── */
const TABS = [
  {
    id: 'recon',
    icon: <RefreshCw size={12} />,
    name: 'Bank Recon',
    label: 'Bank vs Ledger · GST',
    colA: 'Reference',
    colB: 'Counterparty',
    colC: 'Amount',
    curr: '₹',
    rows: [
      { id: 'GST-2024-1102', b: 'Tata Steel Ltd', c: '4,85,200', status: 'matched' },
      { id: 'GST-2024-1103', b: 'Reliance Industries', c: '12,34,500', status: 'mismatch' },
      { id: 'GST-2024-1104', b: 'Infosys BPM Ltd', c: '2,18,000', status: 'matched' },
      { id: 'GST-2024-1105', b: 'Mahindra Logistics', c: '97,650', status: 'review' },
      { id: 'GST-2024-1106', b: 'Wipro Enterprises', c: '3,42,800', status: 'matched' },
    ],
  },
  {
    id: 'us-recon',
    icon: <RefreshCw size={12} />,
    name: 'US Recon',
    label: 'Bank vs Ledger · USD',
    colA: 'Reference',
    colB: 'Counterparty',
    colC: 'Amount',
    curr: '$',
    rows: [
      { id: 'CHK-2025-0412', b: 'Acme Corp', c: '12,450.00', status: 'matched' },
      { id: 'CHK-2025-0413', b: 'Global Logistics LLC', c: '8,920.50', status: 'mismatch' },
      { id: 'CHK-2025-0414', b: 'Tech Solutions Inc', c: '5,200.00', status: 'matched' },
      { id: 'CHK-2025-0415', b: 'Office Supplies Co', c: '1,875.25', status: 'review' },
      { id: 'CHK-2025-0416', b: 'Consulting Partners', c: '15,600.00', status: 'matched' },
    ],
  },
  {
    id: 'tax',
    icon: <FileText size={12} />,
    name: 'Tax Matching',
    label: 'Invoices vs GSTR-2B · ITC',
    colA: 'Invoice ID',
    colB: 'Vendor',
    colC: 'ITC Claim',
    curr: '₹',
    rows: [
      { id: 'INV-5501', b: 'Bajaj Auto Ltd', c: '62,400', status: 'matched' },
      { id: 'INV-5502', b: 'Hindustan Unilever', c: '1,18,200', status: 'mismatch' },
      { id: 'INV-5503', b: 'Sun Pharma', c: '34,800', status: 'matched' },
      { id: 'INV-5504', b: 'Tech Mahindra', c: '2,76,500', status: 'review' },
      { id: 'INV-5505', b: 'Asian Paints Ltd', c: '89,100', status: 'matched' },
    ],
  },
  {
    id: 'reports',
    icon: <BarChart2 size={12} />,
    name: 'Report Gen',
    label: 'Monthly reports · Auto-prepared',
    colA: 'Client',
    colB: 'Report type',
    colC: 'Period',
    curr: '',
    rows: [
      { id: 'Sharma & Co', b: 'Monthly P&L', c: 'Mar 2025', status: 'matched' },
      { id: 'Patel Ventures', b: 'GSTR Summary', c: 'Mar 2025', status: 'matched' },
      { id: 'ABC Corporation', b: 'Bank Reconciliation', c: 'Mar 2025', status: 'review' },
      { id: 'XYZ Limited', b: 'Vendor Aging', c: 'Mar 2025', status: 'matched' },
      { id: 'Kumar Associates', b: 'TDS Summary', c: 'Mar 2025', status: 'matched' },
    ],
  },
]

/* Status labels vary by tab type */
const STATUS_CFG = {
  recon: { matched: { label: 'Matched', dot: '#11B67A' }, mismatch: { label: 'Mismatch', dot: '#E5534B' }, review: { label: 'Review', dot: '#D4A72C' } },
  'us-recon': { matched: { label: 'Matched', dot: '#11B67A' }, mismatch: { label: 'Mismatch', dot: '#E5534B' }, review: { label: 'Review', dot: '#D4A72C' } },
  tax: { matched: { label: 'Verified', dot: '#11B67A' }, mismatch: { label: 'Discrepancy', dot: '#E5534B' }, review: { label: 'Pending', dot: '#D4A72C' } },
  reports: { matched: { label: 'Ready', dot: '#11B67A' }, mismatch: { label: 'Error', dot: '#E5534B' }, review: { label: 'Generating', dot: '#D4A72C' } },
}

/* ─── Tooltip ─── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label} clients</p>
      {payload.map((p, i) => (
        <p key={i} className="chart-tooltip-val" style={{ color: p.color }}>
          {p.name}: {p.value} hrs/mo
        </p>
      ))}
    </div>
  )
}

/* ─── Fade on scroll ─── */
function F({ children, delay = 0 }) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setV(true) },
      { rootMargin: '-20px' }
    )
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? 'none' : 'translateY(14px)',
      transition: `opacity 0.55s ${delay}s, transform 0.55s ${delay}s`,
    }}>
      {children}
    </div>
  )
}

/* ─── Engine Demo ─── */
function EngineDemo() {
  const [tIdx, setTIdx] = useState(0)
  const [resolved, setResolved] = useState(new Set())
  const [lit, setLit] = useState(null)
  const [fade, setFade] = useState(true)

  const tab = TABS[tIdx]
  const sCfg = STATUS_CFG[tab.id]

  useEffect(() => {
    setFade(true); setResolved(new Set()); setLit(null)
    const t1 = setTimeout(() => {
      const idx = tab.rows.findIndex(r => r.status === 'mismatch')
      if (idx !== -1) {
        setLit(idx)
        setTimeout(() => { setResolved(new Set([idx])); setLit(null) }, 650)
      }
    }, 1800)
    const t2 = setTimeout(() => {
      setFade(false)
      setTimeout(() => setTIdx(p => (p + 1) % TABS.length), 260)
    }, 4800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [tIdx])

  const st = (row, i) => resolved.has(i) ? 'matched' : row.status

  return (
    <div className="rw">
      <div className="rw-chrome">
        <div className="rw-dots">
          <span className="dot dot-r" />
          <span className="dot dot-y" />
          <span className="dot dot-g" />
        </div>
        <div className="rw-title">
          <span className="live-pip" />
          Matcha Engine
        </div>
        <div className="rw-tabs">
          {TABS.map((t, i) => (
            <button key={t.id} onClick={() => setTIdx(i)}
              className={`rw-tab${i === tIdx ? ' on' : ''}`}>
              {t.icon} {t.name}
            </button>
          ))}
        </div>
      </div>

      <motion.div animate={{ opacity: fade ? 1 : 0 }} transition={{ duration: 0.22 }}>
        <table className="rt">
          <thead>
            <tr>
              <th>{tab.colA}</th>
              <th className="rt-hide">{tab.colB}</th>
              <th style={{ textAlign: 'right' }}>{tab.colC}</th>
              <th style={{ textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tab.rows.map((row, i) => {
              const s = st(row, i)
              const cfg = sCfg[s]
              return (
                <motion.tr key={`${tab.id}-${i}`}
                  animate={{ background: lit === i ? 'rgba(17,182,122,0.07)' : 'transparent' }}
                  transition={{ duration: 0.3 }}>
                  <td className="mono-c">{row.id}</td>
                  <td className="rt-hide sup-c">{row.b}</td>
                  <td className="mono-c amt-c">{tab.curr}{row.c}</td>
                  <td style={{ textAlign: 'center' }}>
                    <motion.span key={s}
                      initial={{ opacity: 0.5, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.22 }}
                      className="spill">
                      <span className="spill-dot" style={{ background: cfg.dot }} />
                      {cfg.label}
                    </motion.span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        <div className="rw-foot">
          <span>{tab.label}</span>
          <span>
            {tab.rows.filter((r, i) => st(r, i) === 'matched').length}/{tab.rows.length}{' '}
            {tab.id === 'reports' ? 'ready' : 'matched'}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Nav ─── */
function Nav() {
  const [up, setUp] = useState(false)
  useEffect(() => {
    const h = () => setUp(window.scrollY > 12)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <nav className={`nav${up ? ' nav-up' : ''}`}>
      <span className="ln">Matcha</span>
      <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="btn-cta">
        Book a demo <ArrowRight size={13} />
      </a>
    </nav>
  )
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section className="hero">
      <div className="con">
        <F>
          <p className="eyebrow">AI junior staff for accounting firms</p>
        </F>
        <F delay={0.05}>
          <h1 className="h1">
            Stop hiring juniors<br className="desk-br" /> for grunt work.
          </h1>
        </F>
        <F delay={0.09}>
          <p className="sub">
            The work your juniors do before any filing — bank recon, tax matching, monthly reports, ledger cleanup — runs on Matcha at a fraction of headcount cost.
          </p>
        </F>
        <F delay={0.13}>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="btn-cta btn-lg">
            Book a free demo <ArrowRight size={15} />
          </a>
        </F>
        <F delay={0.18}>
          <div className="table-shell">
            <EngineDemo />
          </div>
        </F>
      </div>
    </section>
  )
}

/* ─── Stats ─── */
function Stats() {
  const stats = [
    { val: '~169', label: 'End-clients across 5 paying firms' },
    { val: '600+', label: 'Reconciliations run, zero false positives' },
    { val: '10×', label: 'Faster than manual' },
  ]
  return (
    <div className="stats-band">
      <div className="con">
        <div className="stats-row-3">
          {stats.map((s, i) => (
            <F key={s.label} delay={i * 0.04}>
              <div className="stat">
                <span className="sv">{s.val}</span>
                <span className="sl">{s.label}</span>
              </div>
            </F>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Suite ─── */
const SUITE = [
  {
    icon: <RefreshCw size={20} />,
    title: 'Reconciliation',
    tag: 'Bank · Vendor · Inter-company · GST',
    desc: 'Junior accountant, 3–6 hours per client per month. Matcha runs it in minutes.',
  },
  {
    icon: <FileText size={20} />,
    title: 'Tax matching',
    tag: 'GSTR-2B · ITC · TDS · Sales Tax',
    desc: 'Match invoice data against portal records before filing. Catch ITC discrepancies and flag errors before they become penalties.',
  },
  {
    icon: <BarChart2 size={20} />,
    title: 'Report generation',
    tag: 'P&L · Vendor aging · Monthly close',
    desc: 'Feed in raw data; get formatted monthly reports out. No manual formatting, no copy-paste from Excel.',
  },
  {
    icon: <Cpu size={20} />,
    title: 'Ledger cleanup',
    tag: 'Tally · QuickBooks · Xero · Any CSV',
    desc: 'Your clients send data in a dozen different formats. Matcha reads any schema, normalises it, and makes it usable.',
  },
]

function Suite() {
  return (
    <section className="suite-sec">
      <div className="con">
        <F>
          <p className="sec-label">The work this replaces</p>
          <h2 className="sec-h">Everything your juniors do manually, automated.</h2>
        </F>
        <div className="suite-grid">
          {SUITE.map((s, i) => (
            <F key={s.title} delay={i * 0.06}>
              <div className="suite-card">
                <div className="suite-icon">{s.icon}</div>
                <p className="suite-tag">{s.tag}</p>
                <h3 className="suite-title">{s.title}</h3>
                <p className="suite-desc">{s.desc}</p>
              </div>
            </F>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── How It Works ─── */
const STEPS = [
  {
    num: '01',
    icon: <Upload size={20} />,
    title: 'Pull whatever you have',
    desc: 'CSV, PDF, bank export, GST portal download, Tally XML, vendor statement — any format, any layout. No ERP. No setup call.',
  },
  {
    num: '02',
    icon: <Cpu size={20} />,
    title: 'AI reads, standardises, and processes',
    desc: 'The engine detects the schema, normalises the data, runs the matching or generation logic, and flags every exception — automatically. Client data runs on private inference. Never sent to a public LLM.',
  },
  {
    num: '03',
    icon: <CheckCircle size={20} />,
    title: 'Clean output, exceptions surfaced',
    desc: 'What took junior staff 3–6 hours takes minutes. Your team reviews exceptions, not raw data.',
  },
]

function HowItWorks() {
  return (
    <section className="steps-sec">
      <div className="con">
        <F>
          <p className="sec-label">How it works</p>
          <h2 className="sec-h">Upload. Process. Done.</h2>
          <p className="sec-sub">No integration, no onboarding, no pilot project. Upload your data and get results on the first try.</p>
        </F>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <F key={s.num} delay={i * 0.07}>
              <div className="step-card">
                <div className="step-icon">{s.icon}</div>
                <div className="step-num">{s.num}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            </F>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── ROI Chart ─── */
function ROIChart() {
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t) }, [])
  return (
    <section className="roi-sec">
      <div className="con">
        <F>
          <div className="chart-card-full roi-card">
            <div className="chart-card-head">
              <div>
                <h3 className="chart-card-title">Why firms cut junior hours 80–90% on Matcha</h3>
                <p className="chart-card-sub">As your client base grows — manual labour vs Matcha</p>
              </div>
              <span className="chart-badge">
                <TrendingUp size={12} /> 10× faster at 50 clients
              </span>
            </div>
            <div className="chart-area-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={TIME_SAVED_DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradManual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E5534B" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#E5534B" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradMatcha" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#11B67A" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#11B67A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333339" vertical={false} />
                  <XAxis dataKey="clients" tick={{ fill: '#7d7770', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#7d7770', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}h`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="manual" name="Manual"
                    stroke="#E5534B" strokeWidth={2} fill="url(#gradManual)"
                    dot={false} activeDot={{ r: 4, fill: '#E5534B', stroke: '#1e1e22', strokeWidth: 2 }}
                    isAnimationActive={ready} animationDuration={1200} />
                  <Area type="monotone" dataKey="matcha" name="Matcha"
                    stroke="#11B67A" strokeWidth={2} fill="url(#gradMatcha)"
                    dot={false} activeDot={{ r: 4, fill: '#11B67A', stroke: '#1e1e22', strokeWidth: 2 }}
                    isAnimationActive={ready} animationDuration={1200} animationBegin={200} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              <span className="chart-legend-item"><span className="chart-legend-dot" style={{ background: '#E5534B' }} /> Manual staff hours</span>
              <span className="chart-legend-item"><span className="chart-legend-dot" style={{ background: '#11B67A' }} /> With Matcha</span>
            </div>
          </div>
        </F>
      </div>
    </section>
  )
}


/* ─── Pricing ─── */
const PLANS = [
  {
    tier: 'Solo',
    price: '$50',
    desc: 'For solo practitioners managing up to 20 clients.',
    features: [
      'Unlimited reconciliations',
      'Tax matching & ITC verification',
      'Any data format — CSV, PDF, portal exports',
      'Single user',
      'Email support',
    ],
  },
  {
    tier: 'Firm',
    price: '$200',
    desc: 'For small firms managing up to 50 clients.',
    features: [
      'Everything in Solo',
      'Report generation (P&L, recon, aging)',
      'Multi-client dashboard',
      'Up to 5 users',
      'Priority support',
    ],
  },
  {
    tier: 'Scale',
    price: '$500',
    desc: 'For mid-size firms with 50+ clients and a full team.',
    features: [
      'Everything in Firm',
      'Unlimited clients & users',
      'Data standardisation pipeline',
      'Custom integrations on request',
      'Dedicated onboarding',
    ],
  },
]

function Pricing() {
  return (
    <section className="pricing-sec">
      <div className="con">
        <F>
          <p className="sec-label">Pricing</p>
          <h2 className="sec-h">The labour we replace costs 10–100× our price</h2>
          <p className="sec-sub">A junior accountant costs ~$500/month in India, $4,000+/month in the US. Matcha replaces most of that work for less than a single timesheet.</p>
        </F>
        <div className="pricing-grid">
          {PLANS.map((plan, i) => (
            <F key={plan.tier} delay={i * 0.07}>
              <div className="pricing-card">
                <p className="pricing-tier">{plan.tier}</p>
                <div className="pricing-price-row">
                  <span className="pricing-price">{plan.price}</span>
                  <span className="pricing-period">/ month</span>
                </div>
                <p className="pricing-desc">{plan.desc}</p>
                <ul className="pricing-features-list">
                  {plan.features.map((f, j) => (
                    <li key={j} className="pricing-feature-item">
                      <CheckCircle size={13} className="pricing-check" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={CALENDLY} target="_blank" rel="noopener noreferrer"
                  className={`btn-cta btn-cta-full${plan.featured ? '' : ' btn-outline'}`}>
                  Get started <ArrowRight size={13} />
                </a>
              </div>
            </F>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ─── */
function CTA() {
  return (
    <section className="cta-sec">
      <div className="con cta-inner">
        <F><h2 className="cta-h">Ready to give your team their hours back?</h2></F>
        <F delay={0.05}><p className="cta-sub">20 minutes. We'll demo live on your actual data.</p></F>
        <F delay={0.09}>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="btn-cta btn-lg">
            Book a free demo <ArrowRight size={15} />
          </a>
        </F>
      </div>
    </section>
  )
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="foot">
      <span className="ln">Matcha</span>
      <div style={{ display: 'flex', gap: 22 }}>
        <a href="https://www.linkedin.com/company/matchanow/" target="_blank" rel="noopener noreferrer" className="foot-link">LinkedIn</a>
        <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="foot-link">Book a demo</a>
      </div>
    </footer>
  )
}

/* ─── App ─── */
export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <Suite />
      <HowItWorks />
      <ROIChart />
      <Pricing />
      <CTA />
      <Footer />
    </>
  )
}
