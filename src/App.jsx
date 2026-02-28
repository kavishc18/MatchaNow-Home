import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

function F({ children, delay = 0 }) {
  const ref = useRef(null)
  const v = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={v ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >{children}</motion.div>
  )
}

const w = { maxWidth: 1000, margin: '0 auto', padding: '0 48px' }
const muted = '#8e8e93'

function Hero() {
  return (
    <section style={{ paddingTop: '22vh', paddingBottom: '8vh' }}>
      <div style={w}>
        <F>
          <p style={{ fontSize: 13, fontWeight: 400, color: muted, letterSpacing: '0.02em', marginBottom: 32 }}>
            MatchaNow
          </p>
        </F>
        <F delay={0.15}>
          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 200,
            lineHeight: 1.12, letterSpacing: '-0.04em', maxWidth: 620,
          }}>
            Reconciliation,<br />without the anxiety.
          </h1>
        </F>
        <F delay={0.3}>
          <p style={{
            fontSize: 18, fontWeight: 300, lineHeight: 1.6,
            color: muted, maxWidth: 400, marginTop: 28, marginBottom: 52,
          }}>
            Upload your tax data. See every mismatch.<br />
            Fix it before anyone asks.
          </p>
        </F>
        <F delay={0.4}>
          <a href="#platforms" className="cta-primary">Get started</a>
        </F>
      </div>
    </section>
  )
}

function Product() {
  return (
    <section style={{ padding: '100px 0 160px' }}>
      <div style={w}>
        <F>
          <div className="product-frame">
            <img src="/product.png" alt="MatchaNow dashboard" />
          </div>
        </F>
      </div>
    </section>
  )
}

function Why() {
  return (
    <section style={{ padding: '180px 0' }}>
      <div style={w}>
        <F>
          <p style={{
            fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 200,
            lineHeight: 1.45, letterSpacing: '-0.02em',
            maxWidth: 580, color: '#2c2c2e',
          }}>
            Tax teams shouldn't spend their weeks chasing numbers
            across spreadsheets. We built something that does it
            for you — quietly, accurately, in the background.
          </p>
        </F>
      </div>
    </section>
  )
}

function How() {
  const steps = [
    ['Upload your files', 'Drop invoices and returns, or connect your ERP. Nothing complicated.'],
    ['We find every mismatch', 'Your records are cross-checked against government data. Automatically.'],
    ['Download clean reports', 'Audit-ready. Formatted for your authority. One click.'],
  ]
  return (
    <section style={{ padding: '120px 0 160px' }}>
      <div style={w}>
        <F>
          <p style={{
            fontSize: 12, fontWeight: 400, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: muted, marginBottom: 72,
          }}>How it works</p>
        </F>
        {steps.map(([title, desc], i) => (
          <F key={title} delay={0.12 * i}>
            <div className="step-row" style={{
              display: 'grid', gridTemplateColumns: '32px 1fr', gap: 0,
            }}>
              <span style={{ fontSize: 14, color: '#c7c7cc', fontWeight: 300, paddingTop: 3 }}>
                {i + 1}
              </span>
              <div>
                <p style={{ fontSize: 21, fontWeight: 300, letterSpacing: '-0.015em', marginBottom: 10 }}>
                  {title}
                </p>
                <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.65, color: muted, maxWidth: 420 }}>
                  {desc}
                </p>
              </div>
            </div>
          </F>
        ))}
      </div>
    </section>
  )
}

function Trust() {
  const nums = [
    ['99%', 'Match accuracy'],
    ['4', 'Countries'],
    ['Seconds', 'Not weeks'],
  ]
  return (
    <section style={{ padding: '120px 0 160px' }}>
      <div style={w}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {nums.map(([val, label], i) => (
            <F key={label} delay={i * 0.12}>
              <div className="trust-card">
                <div style={{
                  fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 200,
                  letterSpacing: '-0.04em', marginBottom: 12, color: '#2c2c2e',
                }}>{val}</div>
                <div style={{ fontSize: 12, fontWeight: 400, letterSpacing: '0.04em', color: muted }}>
                  {label}
                </div>
              </div>
            </F>
          ))}
        </div>
      </div>
    </section>
  )
}

function Platforms() {
  const list = [
    { flag: '🇮🇳', name: 'India', note: 'GST', href: 'https://matchanow-gst.netlify.app/', live: true },
    { flag: '🇬🇧', name: 'United Kingdom', note: 'VAT', href: 'https://matchanow-uk.netlify.app/', live: true },
    { flag: '🇦🇪', name: 'UAE', note: 'VAT', href: 'https://matchanow-uae.netlify.app/', live: true },
    { flag: '🇺🇸', name: 'United States', note: 'Sales Tax', href: '#', live: false },
  ]
  return (
    <section id="platforms" style={{ padding: '120px 0 160px' }}>
      <div style={w}>
        <F>
          <p style={{
            fontSize: 12, fontWeight: 400, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: muted, marginBottom: 72,
          }}>Choose your country</p>
        </F>
        {list.map((c, i) => (
          <F key={c.name} delay={0.08 * i}>
            <a
              href={c.href}
              target={c.live ? '_blank' : undefined}
              rel="noopener noreferrer"
              onClick={!c.live ? e => e.preventDefault() : undefined}
              className="platform-row"
              style={{ cursor: c.live ? 'pointer' : 'default', opacity: c.live ? 1 : 0.35 }}
            >
              <span style={{ fontSize: 22 }}>{c.flag}</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 300, letterSpacing: '-0.015em' }}>{c.name}</span>
                <span style={{ fontSize: 12, color: muted }}>{c.note}</span>
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: muted }}>
                {c.live && <span className="live-dot" />}
                {c.live ? 'Open' : 'Soon'}
              </span>
            </a>
          </F>
        ))}
      </div>
    </section>
  )
}

function End() {
  return (
    <section style={{ padding: '220px 0', textAlign: 'center' }}>
      <div style={w}>
        <F>
          <h2 style={{
            fontSize: 'clamp(28px, 4.5vw, 56px)', fontWeight: 200,
            lineHeight: 1.15, letterSpacing: '-0.035em',
            maxWidth: 500, margin: '0 auto 20px',
          }}>
            Less chasing.<br />More certainty.
          </h2>
        </F>
        <F delay={0.12}>
          <p style={{ fontSize: 16, fontWeight: 300, color: muted, marginBottom: 52 }}>
            Pick your country. Start reconciling.
          </p>
        </F>
        <F delay={0.2}>
          <a href="#platforms" className="cta-primary">Get started</a>
        </F>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{
      padding: '36px 48px',
      display: 'flex', justifyContent: 'space-between',
      borderTop: '1px solid rgba(0,0,0,0.04)',
    }}>
      <span style={{ fontSize: 12, color: muted }}>MatchaNow</span>
      <a
        href="mailto:kavish@matchanow.org"
        style={{ fontSize: 12, color: muted, transition: 'color 0.3s' }}
        onMouseEnter={e => { e.target.style.color = '#2c2c2e' }}
        onMouseLeave={e => { e.target.style.color = '#8e8e93' }}
      >kavish@matchanow.org</a>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Hero />
      <Product />
      <Why />
      <How />
      <Trust />
      <Platforms />
      <End />
      <Footer />
    </>
  )
}
