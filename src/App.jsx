import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { ArrowRight, TrendingUp, Shield, Zap, Globe } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts'

const CALENDLY = 'https://calendly.com/matchanow-org/20-minute-meeting'

/* ─── Chart Data ─── */
const MONTHLY_DATA = [
  { month: 'Jan', india: 42, us: 38 },
  { month: 'Feb', india: 48, us: 41 },
  { month: 'Mar', india: 55, us: 47 },
  { month: 'Apr', india: 51, us: 52 },
  { month: 'May', india: 63, us: 58 },
  { month: 'Jun', india: 71, us: 62 },
  { month: 'Jul', india: 68, us: 69 },
  { month: 'Aug', india: 79, us: 74 },
  { month: 'Sep', india: 85, us: 78 },
  { month: 'Oct', india: 91, us: 83 },
  { month: 'Nov', india: 96, us: 89 },
  { month: 'Dec', india: 100, us: 94 },
]

const STATUS_DATA = [
  { name: 'Matched', value: 847, color: '#11B67A' },
  { name: 'Review', value: 89, color: '#D4A72C' },
  { name: 'Mismatch', value: 34, color: '#E5534B' },
]

const WEEKLY_VOLUME = [
  { day: 'Mon', invoices: 124 },
  { day: 'Tue', invoices: 156 },
  { day: 'Wed', invoices: 142 },
  { day: 'Thu', invoices: 189 },
  { day: 'Fri', invoices: 167 },
  { day: 'Sat', invoices: 78 },
  { day: 'Sun', invoices: 45 },
]

/* ─── Reconciliation Data (US + India only) ─── */
const JURIS = [
  {
    id: 'india', flag: '🇮🇳', name: 'India', label: 'GST · GSTR-2B',
    curr: '₹',
    rows: [
      { id: 'GST-2024-1102', supplier: 'Tata Steel Ltd', amt: '4,85,200', status: 'matched' },
      { id: 'GST-2024-1103', supplier: 'Reliance Industries', amt: '12,34,500', status: 'mismatch' },
      { id: 'GST-2024-1104', supplier: 'Infosys BPM Ltd', amt: '2,18,000', status: 'matched' },
      { id: 'GST-2024-1105', supplier: 'Mahindra Logistics', amt: '97,650', status: 'review' },
      { id: 'GST-2024-1106', supplier: 'Wipro Enterprises', amt: '3,42,800', status: 'matched' },
    ],
  },
  {
    id: 'us', flag: '🇺🇸', name: 'United States', label: 'Sales Tax · Nexus',
    curr: '$',
    rows: [
      { id: 'ST-2024-0078', supplier: 'Walmart Inc.', amt: '24,500', status: 'matched' },
      { id: 'ST-2024-0079', supplier: 'Amazon Services LLC', amt: '11,230', status: 'review' },
      { id: 'ST-2024-0080', supplier: 'Caterpillar Inc.', amt: '45,800', status: 'matched' },
      { id: 'ST-2024-0081', supplier: 'Deere & Company', amt: '8,920', status: 'matched' },
      { id: 'ST-2024-0082', supplier: 'FedEx Corporation', amt: '6,340', status: 'mismatch' },
    ],
  },
]

const S = {
  matched: { label: 'Matched', dot: '#11B67A' },
  mismatch: { label: 'Mismatch', dot: '#E5534B' },
  review: { label: 'Review', dot: '#D4A72C' },
}

/* ─── Custom Tooltips ─── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="chart-tooltip-val" style={{ color: p.color }}>
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  )
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      <p className="chart-tooltip-val">{payload[0].value} invoices</p>
    </div>
  )
}

/* ─── Donut Center Label ─── */
function DonutCenter({ total }) {
  return (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
      <tspan x="50%" dy="-8" fill="#f4efe6" fontSize="22" fontWeight="600">{total}</tspan>
      <tspan x="50%" dy="22" fill="#7d7770" fontSize="11" fontWeight="400">Total</tspan>
    </text>
  )
}

/* ─── Fade in on scroll ─── */
function F({ children, delay = 0 }) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { rootMargin: '-30px' })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? 'none' : 'translateY(12px)',
      transition: `opacity 0.55s ${delay}s, transform 0.55s ${delay}s`,
    }}>{children}</div>
  )
}

/* ─── Reconciliation Table ─── */
function ReconTable() {
  const [jIdx, setJIdx] = useState(0)
  const [resolved, setResolved] = useState(new Set())
  const [lit, setLit] = useState(null)
  const [fade, setFade] = useState(true)

  const j = JURIS[jIdx]

  useEffect(() => {
    setFade(true)
    setResolved(new Set())
    setLit(null)

    const t1 = setTimeout(() => {
      const idx = j.rows.findIndex(r => r.status === 'mismatch')
      if (idx !== -1) {
        setLit(idx)
        setTimeout(() => { setResolved(new Set([idx])); setLit(null) }, 650)
      }
    }, 1800)

    const t2 = setTimeout(() => {
      setFade(false)
      setTimeout(() => setJIdx(p => (p + 1) % JURIS.length), 260)
    }, 4600)

    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [jIdx])

  const st = (row, i) => resolved.has(i) ? 'matched' : row.status

  return (
    <div className="rw">
      <div className="rw-chrome">
        <div className="rw-dots">
          <span className="dot dot-r" /><span className="dot dot-y" /><span className="dot dot-g" />
        </div>
        <div className="rw-title">
          <span className="live-pip" />
          Reconciliation Engine
        </div>
        <div className="rw-tabs">
          {JURIS.map((jj, i) => (
            <button key={jj.id} onClick={() => setJIdx(i)}
              className={`rw-tab${i === jIdx ? ' on' : ''}`}>
              {jj.flag} {jj.name}
            </button>
          ))}
        </div>
      </div>

      <motion.div animate={{ opacity: fade ? 1 : 0 }} transition={{ duration: 0.22 }}>
        <table className="rt">
          <thead>
            <tr>
              <th>Invoice</th>
              <th className="rt-hide">Supplier</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th style={{ textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {j.rows.map((row, i) => {
              const s = st(row, i)
              const cfg = S[s]
              return (
                <motion.tr key={`${j.id}-${row.id}`}
                  animate={{ background: lit === i ? 'rgba(17,182,122,0.07)' : 'transparent' }}
                  transition={{ duration: 0.3 }}>
                  <td className="mono-c">{row.id}</td>
                  <td className="rt-hide sup-c">{row.supplier}</td>
                  <td className="mono-c amt-c">{j.curr}{row.amt}</td>
                  <td style={{ textAlign: 'center' }}>
                    <motion.span
                      key={s}
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
          <span>{j.label}</span>
          <span>{j.rows.filter((r, i) => st(r, i) === 'matched').length}/{j.rows.length} matched</span>
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
        Book a call <ArrowRight size={13} />
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
          <p className="eyebrow">AI-native accounting firm</p>
        </F>
        <F delay={0.05}>
          <h1 className="h1">
            Your books closed<br className="desk-br" /> before Monday.
          </h1>
        </F>
        <F delay={0.09}>
          <p className="sub">
            Cross-border reconciliation, filings, and bookkeeping across India and US — done in hours, not weeks.
          </p>
        </F>
        <F delay={0.13}>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="btn-cta btn-lg">
            Book a free call <ArrowRight size={15} />
          </a>
        </F>
        <F delay={0.18}>
          <div className="table-shell">
            <ReconTable />
          </div>
        </F>
      </div>
    </section>
  )
}

/* ─── Stats ─── */
function Stats() {
  return (
    <div className="stats-band">
      <div className="con">
        <div className="stats-row">
          {[
            { val: '99%', label: 'Filing accuracy' },
            { val: '1 day', label: 'Onboarding time' },
            { val: '2', label: 'Jurisdictions live' },
          ].map((s, i) => (
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

/* ─── Analytics Section ─── */
function Analytics() {
  const [animReady, setAnimReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAnimReady(true), 300)
    return () => clearTimeout(t)
  }, [])

  const total = STATUS_DATA.reduce((a, b) => a + b.value, 0)

  return (
    <section className="analytics-sec">
      <div className="con">
        <F>
          <p className="sec-label">Real-time analytics</p>
          <h2 className="sec-h">Everything at a glance</h2>
          <p className="sec-sub">Track reconciliation accuracy, invoice volume, and filing status across any jurisdiction.</p>
        </F>

        <div className="chart-grid">
          <F delay={0.05}>
            <div className="chart-card chart-card-wide">
              <div className="chart-card-head">
                <div>
                  <h3 className="chart-card-title">Reconciliation accuracy</h3>
                  <p className="chart-card-sub">Monthly match rate by jurisdiction</p>
                </div>
                <span className="chart-badge">
                  <TrendingUp size={12} /> +12% this quarter
                </span>
              </div>
              <div className="chart-area-wrap">
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={MONTHLY_DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradIndia" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#11B67A" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#11B67A" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradUS" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#635BFF" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#635BFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333339" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#7d7770', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#7d7770', fontSize: 11 }} axisLine={false} tickLine={false} domain={[30, 105]} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone" dataKey="india" name="🇮🇳 India"
                      stroke="#11B67A" strokeWidth={2}
                      fill="url(#gradIndia)" fillOpacity={1}
                      dot={false} activeDot={{ r: 4, fill: '#11B67A', stroke: '#1e1e22', strokeWidth: 2 }}
                      isAnimationActive={animReady} animationDuration={1200}
                    />
                    <Area
                      type="monotone" dataKey="us" name="🇺🇸 United States"
                      stroke="#635BFF" strokeWidth={2}
                      fill="url(#gradUS)" fillOpacity={1}
                      dot={false} activeDot={{ r: 4, fill: '#635BFF', stroke: '#1e1e22', strokeWidth: 2 }}
                      isAnimationActive={animReady} animationDuration={1200} animationBegin={200}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-legend">
                <span className="chart-legend-item"><span className="chart-legend-dot" style={{ background: '#11B67A' }} /> India</span>
                <span className="chart-legend-item"><span className="chart-legend-dot" style={{ background: '#635BFF' }} /> United States</span>
              </div>
            </div>
          </F>

          <F delay={0.1}>
            <div className="chart-card">
              <div className="chart-card-head">
                <div>
                  <h3 className="chart-card-title">Invoice status</h3>
                  <p className="chart-card-sub">Current period breakdown</p>
                </div>
              </div>
              <div className="donut-wrap">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={STATUS_DATA}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={82}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                      isAnimationActive={animReady} animationDuration={1000}
                    >
                      {STATUS_DATA.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <DonutCenter total={total} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="donut-legend">
                {STATUS_DATA.map(d => (
                  <div key={d.name} className="donut-legend-row">
                    <span className="donut-legend-dot" style={{ background: d.color }} />
                    <span className="donut-legend-name">{d.name}</span>
                    <span className="donut-legend-val">{d.value}</span>
                    <span className="donut-legend-pct">{((d.value / total) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </F>
        </div>

        <F delay={0.15}>
          <div className="chart-card-full">
            <div className="chart-card-head">
              <div>
                <h3 className="chart-card-title">Weekly invoice volume</h3>
                <p className="chart-card-sub">Invoices processed per day</p>
              </div>
              <span className="chart-badge-subtle">This week</span>
            </div>
            <div className="chart-area-wrap">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={WEEKLY_VOLUME} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barCategoryGap="30%">
                  <defs>
                    <linearGradient id="gradBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#11B67A" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#11B67A" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333339" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#7d7770', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#7d7770', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(17,182,122,0.04)' }} />
                  <Bar
                    dataKey="invoices" fill="url(#gradBar)"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={animReady} animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </F>
      </div>
    </section>
  )
}

/* ─── Features ─── */
function Features() {
  const items = [
    { icon: <Shield size={20} />, title: 'Compliance-first', desc: 'Built for GST, GSTR-2B, sales tax nexus, and 1099 — always current with latest regulations.' },
    { icon: <Zap size={20} />, title: 'Instant reconciliation', desc: 'AI matches invoices against government records in seconds. Mismatches flagged automatically.' },
    { icon: <Globe size={20} />, title: 'India + US coverage', desc: 'One platform for cross-border operations. Unified dashboard, jurisdiction-specific logic.' },
    { icon: <TrendingUp size={20} />, title: 'Real-time insights', desc: 'Live dashboards with match rates, filing status, and anomaly detection.' },
  ]
  return (
    <section className="features-sec">
      <div className="con">
        <F>
          <p className="sec-label">Why Matcha</p>
          <h2 className="sec-h">Built for modern finance teams</h2>
        </F>
        <div className="features-grid">
          {items.map((item, i) => (
            <F key={item.title} delay={i * 0.06}>
              <div className="feature-card">
                <div className="feature-icon">{item.icon}</div>
                <h3 className="feature-title">{item.title}</h3>
                <p className="feature-desc">{item.desc}</p>
              </div>
            </F>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Cross-border flow data ─── */
const CROSSBORDER_DATA = [
  { month: 'Jan', flow: 12 },
  { month: 'Feb', flow: 18 },
  { month: 'Mar', flow: 24 },
  { month: 'Apr', flow: 21 },
  { month: 'May', flow: 32 },
  { month: 'Jun', flow: 38 },
  { month: 'Jul', flow: 35 },
  { month: 'Aug', flow: 44 },
  { month: 'Sep', flow: 52 },
  { month: 'Oct', flow: 58 },
  { month: 'Nov', flow: 63 },
  { month: 'Dec', flow: 71 },
]

/* ─── Jurisdictions — separate cards + cross-border section ─── */
const INDIA_FEATURES = [
  { title: 'GSTR-2B reconciliation', sub: 'Auto-match invoices against government records.' },
  { title: 'ITC optimisation', sub: 'Maximise input tax credits automatically.' },
  { title: 'TDS & advance tax', sub: 'Quarterly filings, computed and filed on time.' },
  { title: 'E-invoicing', sub: 'IRN and e-way bills from your ERP data.' },
]

const US_FEATURES = [
  { title: 'Nexus monitoring', sub: 'Track thresholds across every state.' },
  { title: 'Sales tax filing', sub: 'Returns filed wherever you have obligations.' },
  { title: '1099 processing', sub: 'Vendor classification and year-end generation.' },
  { title: 'Exemptions', sub: 'Certificates and use tax handled automatically.' },
]

function JurCard({ flag, headline, desc, features, delay = 0 }) {
  return (
    <F delay={delay}>
      <div className="jur-detail-card">
        <div className="jur-detail-head">
          <span className="jur-detail-flag">{flag}</span>
          <div>
            <h3 className="jur-detail-title">{headline}</h3>
            <p className="jur-detail-desc">{desc}</p>
          </div>
        </div>
        <div className="jur-features-grid">
          {features.map((f, i) => (
            <div key={i} className="jur-feature">
              <span className="jur-feature-dot" />
              <div>
                <p className="jur-feature-title">{f.title}</p>
                <p className="jur-feature-sub">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </F>
  )
}

function Jurisdictions() {
  return (
    <section className="jur-sec">
      <div className="con">
        <F>
          <p className="sec-label">Where we operate</p>
          <h2 className="sec-h">One engine. Any jurisdiction.</h2>
          <p className="sec-sub">Built to scale across jurisdictions.</p>
        </F>

        <div className="jur-cards-stack">
          <JurCard
            flag="🇮🇳"
            headline="India"
            desc="GST reconciliation, ITC claims, TDS, e-invoicing."
            features={INDIA_FEATURES}
            delay={0.05}
          />
          <JurCard
            flag="🇺🇸"
            headline="United States"
            desc="Multi-state sales tax, nexus tracking, 1099s."
            features={US_FEATURES}
            delay={0.1}
          />
        </div>

        {/* Cross-border mini section */}
        <F delay={0.15}>
          <div className="crossborder-card">
            <div className="crossborder-head">
              <div className="crossborder-flags">
                <span>🇮🇳</span>
                <span className="crossborder-arrow">⇄</span>
                <span>🇺🇸</span>
              </div>
              <div>
                <h3 className="chart-card-title">Cross-border flow</h3>
                <p className="chart-card-sub">Monthly reconciled transactions between India and US</p>
              </div>
            </div>
            <div className="chart-area-wrap">
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={CROSSBORDER_DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradCross" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#11B67A" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#11B67A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333339" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#7d7770', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#7d7770', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Area
                    type="monotone" dataKey="flow"
                    stroke="#11B67A" strokeWidth={2}
                    fill="url(#gradCross)" fillOpacity={1}
                    dot={false}
                    activeDot={{ r: 3, fill: '#11B67A', stroke: '#1e1e22', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </F>
      </div>
    </section>
  )
}

/* ─── Final CTA ─── */
function CTA() {
  return (
    <section className="cta-sec">
      <div className="con" style={{ textAlign: 'center' }}>
        <F><h2 className="cta-h">Ready to automate your accounting?</h2></F>
        <F delay={0.05}><p className="cta-sub">30 minutes.</p></F>
        <F delay={0.09}>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="btn-cta btn-lg">
            Book a free call <ArrowRight size={15} />
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
        <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="foot-link">Book a Call</a>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <Analytics />
      <Features />
      <Jurisdictions />
      <CTA />
      <Footer />
    </>
  )
}
