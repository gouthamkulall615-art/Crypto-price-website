import { useEffect, useRef, useState } from 'react'
import { Zap, Search, LineChart, Smartphone, Plus, Minus, Menu, X, ArrowUpRight, ArrowUp, ArrowDown } from 'lucide-react'

function GithubIcon({ size = 14, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

const APP = 'https://coinpulse-beryl.vercel.app'

const COINS = [
  { s: 'BTC', n: 'Bitcoin', p: 64120.4, c: 2.41, w: -1.2, m: '1.26T', col: '#E0A526', sp: [4, 5, 4, 6, 7, 6, 8, 9] },
  { s: 'ETH', n: 'Ethereum', p: 3485.12, c: 1.18, w: 3.4, m: '418B', col: '#14532D', sp: [3, 4, 4, 5, 4, 6, 6, 7] },
  { s: 'SOL', n: 'Solana', p: 148.95, c: -0.85, w: 5.1, m: '68B', col: '#14110F', sp: [5, 6, 7, 6, 7, 6, 5, 5] },
  { s: 'BNB', n: 'BNB', p: 592.3, c: 0.64, w: -2.0, m: '86B', col: '#B8860B', sp: [6, 5, 5, 4, 5, 5, 6, 6] },
  { s: 'XRP', n: 'XRP', p: 0.52, c: -1.34, w: 0.8, m: '29B', col: '#4B4B4B', sp: [6, 6, 5, 6, 5, 4, 5, 4] },
  { s: 'ADA', n: 'Cardano', p: 0.46, c: 0.9, w: 2.2, m: '16B', col: '#1E3A5F', sp: [3, 4, 3, 5, 5, 6, 5, 7] },
  { s: 'DOGE', n: 'Dogecoin', p: 0.158, c: 4.02, w: 8.7, m: '23B', col: '#8A6D1D', sp: [2, 3, 3, 4, 6, 5, 7, 9] },
]
const TF = {
  '1D': [40, 42, 41, 45, 44, 48, 47, 52, 50, 55, 58, 57],
  '1W': [30, 35, 33, 40, 38, 36, 44, 50, 47, 55, 53, 60],
  '1M': [20, 28, 26, 35, 30, 42, 40, 38, 50, 56, 52, 64],
  '1Y': [10, 14, 22, 18, 30, 26, 38, 34, 46, 52, 60, 70],
}
const FEATURES = [
  { n: '01', t: 'Live Data', d: 'Prices that move when the market does, shown in a clean, readable table.', i: Zap },
  { n: '02', t: 'Search and Filter', d: 'Find any coin in a keystroke and narrow the list your way.', i: Search },
  { n: '03', t: 'Price Charts', d: 'Clear charts for every coin, from one day to one year.', i: LineChart },
  { n: '04', t: 'Responsive Design', d: 'Built to feel right on a phone, a tablet or a wide desktop.', i: Smartphone },
]
const FAQ = [
  ['Is CoinPulse free?', 'Yes. You can open the app and use it without paying or signing up.'],
  ['Where does the price data come from?', 'CoinPulse pulls market data from a public crypto data API. Figures on this page are sample data for illustration.'],
  ['Does it work on mobile?', 'Yes. The interface is responsive and designed to work on any screen size.'],
  ['Is it open source?', 'Yes. The code is on GitHub, built with React, Vite and Tailwind CSS.'],
]
const CANDLES = [[30, 42, 48, 26], [42, 38, 46, 34], [38, 50, 54, 36], [50, 46, 56, 42], [46, 58, 62, 44], [58, 52, 64, 48], [52, 66, 70, 50], [66, 62, 72, 58], [62, 74, 78, 60]]

const fmt = (p) => (p >= 100 ? p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : p.toFixed(p < 1 ? 3 : 2))
const Pct = ({ v }) => <span className={`tnum font-semibold ${v >= 0 ? 'text-gain' : 'text-loss'}`}>{v >= 0 ? '+' : ''}{v.toFixed(2)}%</span>

function Spark({ data, up = true, w = 64, h = 22 }) {
  const mx = Math.max(...data), mn = Math.min(...data)
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - 2 - ((v - mn) / (mx - mn || 1)) * (h - 4)}`).join(' ')
  return <svg width={w} height={h} aria-hidden="true"><polyline points={pts} fill="none" stroke={up ? '#15803D' : '#B91C1C'} strokeWidth="1.5" /></svg>
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect() } }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

const Btn = ({ children, outline, className = '' }) => (
  <a href={APP} target="_blank" rel="noreferrer"
    className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold uppercase tracking-widest border-2 border-ink transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0_0_#14110F] ${outline ? 'bg-paper text-ink' : 'bg-forest text-paper'} ${className}`}>
    {children}
  </a>
)

function Ticker() {
  const items = [...COINS, ...COINS]
  return (
    <div className="marquee-wrap bg-ink text-paper overflow-hidden text-xs" aria-label="Sample price ticker">
      <div className="marquee flex w-max gap-10 py-2 px-4 whitespace-nowrap">
        {items.map((c, i) => (
          <span key={i} className="tnum flex gap-2"><b>{c.s}</b> ${fmt(c.p)} <span className={c.c >= 0 ? 'text-green-400' : 'text-red-400'}>{c.c >= 0 ? '▲' : '▼'} {Math.abs(c.c).toFixed(2)}%</span></span>
        ))}
      </div>
    </div>
  )
}

function Masthead() {
  const [open, setOpen] = useState(false)
  const links = [['Features', '#features'], ['How it works', '#how'], ['Markets', '#markets'], ['FAQ', '#faq']]
  return (
    <header className="sticky top-0 z-30 bg-paper border-b border-ink">
      <nav className="max-w-[1280px] mx-auto flex items-center justify-between px-5 py-4" aria-label="Main">
        <a href="#top" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true"><rect x="1" y="1" width="26" height="26" fill="none" stroke="#14110F" strokeWidth="2" /><polyline points="4,15 9,15 12,7 16,21 19,13 24,13" fill="none" stroke="#14532D" strokeWidth="2" /></svg>
          <span className="font-display font-black text-3xl tracking-tight">CoinPulse</span>
        </a>
        <ul className="hidden md:flex gap-8 text-sm font-medium">
          {links.map(([l, h]) => <li key={l}><a href={h} className="hover:underline underline-offset-4">{l}</a></li>)}
        </ul>
        <div className="flex items-center gap-3">
          <Btn className="hidden sm:inline-flex !py-2">Launch App</Btn>
          <button className="md:hidden border border-ink p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>{open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}</button>
        </div>
      </nav>
      {open && (
        <ul className="md:hidden border-t border-ink bg-paper px-5 py-3 flex flex-col gap-3 text-sm font-medium">
          {links.map(([l, h]) => <li key={l}><a href={h} onClick={() => setOpen(false)}>{l}</a></li>)}
        </ul>
      )}
    </header>
  )
}

function DashboardMock() {
  const [tf, setTf] = useState('1M')
  const [prices, setPrices] = useState(COINS.slice(0, 4).map((c) => ({ ...c, flash: '' })))
  useEffect(() => {
    const id = setInterval(() => {
      setPrices((ps) => ps.map((c) => {
        const d = (Math.random() - 0.5) * 0.004
        return { ...c, p: c.p * (1 + d), c: c.c + d * 100, flash: d >= 0 ? 'flash-up' : 'flash-down' }
      }))
      setTimeout(() => setPrices((ps) => ps.map((c) => ({ ...c, flash: '' }))), 500)
    }, 2000)
    return () => clearInterval(id)
  }, [])
  const d = TF[tf], W = 320, H = 110
  const pts = d.map((v, i) => [(i / (d.length - 1)) * W, H - (v / 80) * H])
  const line = pts.map((p) => p.join(',')).join(' ')
  const last = pts[pts.length - 1]
  return (
    <div className="border-2 border-ink bg-paper shadow-[8px_8px_0_0_#14110F] p-5" aria-label="Dashboard preview">
      <div className="flex justify-between items-end border-b border-ink pb-3">
        <div><p className="text-xs uppercase tracking-widest">Portfolio</p><p className="font-display font-black text-3xl tnum">$48,210.55</p></div>
        <div className="flex border border-ink text-xs">
          {Object.keys(TF).map((k) => <button key={k} onClick={() => setTf(k)} className={`px-2 py-1 ${tf === k ? 'bg-ink text-paper' : ''}`}>{k}</button>)}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full my-4" role="img" aria-label={`Portfolio chart for ${tf}`}>
        {[0, 1, 2, 3].map((i) => <line key={i} x1="0" x2={W} y1={(i * H) / 3} y2={(i * H) / 3} stroke="#14110F" strokeOpacity=".15" />)}
        <polygon points={`0,${H} ${line} ${W},${H}`} fill="#D5E8D4" />
        <polyline points={line} fill="none" stroke="#15803D" strokeWidth="2" />
        <rect x={last[0] - 4} y={last[1] - 4} width="8" height="8" fill="#14110F" />
      </svg>
      <ul>
        {prices.map((c) => (
          <li key={c.s} className={`flex items-center gap-3 py-2 border-t border-ink/30 ${c.flash}`}>
            <span className="w-7 h-7 text-paper grid place-items-center text-xs font-bold" style={{ background: c.col }}>{c.s[0]}</span>
            <span className="flex-1 text-sm font-medium">{c.n}</span>
            <Spark data={c.sp} up={c.c >= 0} />
            <span className="tnum text-sm w-24 text-right">${fmt(c.p)}</span>
            <span className="w-16 text-right text-sm"><Pct v={c.c} /></span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Hero() {
  const stats = [['24/7', 'Live prices'], ['1 tap', 'Search and filter'], ['Any', 'Screen size']]
  return (
    <section id="top" className="max-w-[1280px] mx-auto px-5 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-7">
        <p className="text-xs uppercase tracking-widest font-semibold inline-block border-b-4 border-mustard pb-1">Crypto tracking, made calm</p>
        <h1 className="font-display font-black text-6xl md:text-8xl leading-[0.95] tracking-tighter mt-6">
          Track crypto with <span className="italic relative inline-block">clarity.
            <svg className="absolute left-0 -bottom-2 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true"><path d="M2 6 Q 30 1 60 5 T 120 5 T 198 4" fill="none" stroke="#E0A526" strokeWidth="5" /></svg>
          </span>
        </h1>
        <p className="mt-8 text-lg leading-relaxed max-w-[45ch]">Keep an eye on live coin prices, market trends, and portfolio changes, all in one clean interface.</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Btn>Launch App <ArrowUpRight size={16} strokeWidth={1.5} /></Btn>
          <a href="#how" className="inline-flex items-center px-6 py-3 text-sm font-semibold uppercase tracking-widest border-2 border-ink hover:bg-tint">See how it works</a>
        </div>
        <dl className="mt-12 grid grid-cols-3 border-t-2 border-ink">
          {stats.map(([a, b]) => <div key={b} className="pt-4 pr-4"><dt className="font-display font-black text-4xl">{a}</dt><dd className="text-xs uppercase tracking-widest mt-1">{b}</dd></div>)}
        </dl>
      </div>
      <div className="lg:col-span-5"><DashboardMock /></div>
    </section>
  )
}

function TrustStrip() {
  const t = ['React', 'Vite', 'Tailwind CSS', 'Vercel']
  return (
    <section className="border-y border-ink bg-tint">
      <div className="max-w-[1280px] mx-auto px-5 py-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        <span>Built with</span>
        {t.map((x, i) => <span key={x} className="flex items-center gap-6"><i className="font-display font-semibold text-xl">{x}</i>{i < t.length - 1 && <span className="h-5 w-px bg-ink" />}</span>)}
        <span>and deployed on Vercel</span>
      </div>
    </section>
  )
}

function SearchDemo() {
  const [n, setN] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setN((x) => (x >= 3 ? 0 : x + 1)), 900)
    return () => clearInterval(id)
  }, [])
  const q = 'sol'.slice(0, n)
  const res = COINS.filter((c) => c.n.toLowerCase().includes(q) || c.s.toLowerCase().includes(q))
  return (
    <div className="mt-6">
      <div className="border border-ink px-3 py-2 text-sm flex items-center gap-2 bg-paper"><Search size={14} strokeWidth={1.5} />{q || <span className="opacity-50">Search coins</span>}</div>
      <ul className="mt-2 text-sm">{res.slice(0, 4).map((c) => <li key={c.s} className="flex justify-between border-b border-ink/30 py-1.5"><span>{c.n}</span><span className="tnum">${fmt(c.p)}</span></li>)}</ul>
    </div>
  )
}

function Cell({ f, className = '', children }) {
  const I = f.i
  return (
    <article className={`group p-8 transition-colors hover:bg-tint ${className}`}>
      <div className="flex justify-between items-start"><span className="font-display font-black text-5xl group-hover:text-gain transition-colors">{f.n}</span><I size={24} strokeWidth={1.5} /></div>
      <h3 className="font-display font-black text-3xl mt-4">{f.t}</h3>
      <p className="mt-2 max-w-[40ch]">{f.d}</p>
      {children}
    </article>
  )
}

function Features() {
  const [bars, setBars] = useState([40, 55, 35, 60, 50, 70, 45, 65])
  useEffect(() => {
    const id = setInterval(() => setBars((b) => b.map((v) => Math.max(20, Math.min(90, v + (Math.random() - 0.5) * 20)))), 1500)
    return () => clearInterval(id)
  }, [])
  return (
    <section id="features" className="max-w-[1280px] mx-auto px-5 py-20">
      <Reveal>
        <h2 className="font-display font-black text-4xl md:text-6xl tracking-tight leading-none max-w-[18ch]">Everything the market throws at you, in one place.</h2>
        <div className="mt-12 border-2 border-ink grid grid-cols-1 md:grid-cols-3 md:grid-rows-[auto_auto] divide-ink [&>*]:border-ink [&>*]:border-b md:[&>*]:border-r">
          <Cell f={FEATURES[0]} className="md:col-span-2 md:row-span-2">
            <div className="mt-8 flex items-end gap-2 h-48 border-b border-ink">
              {bars.map((v, i) => <div key={i} className="flex-1 bg-forest transition-all duration-700" style={{ height: `${v}%` }} />)}
            </div>
            <table className="w-full mt-4 text-sm tnum"><tbody>{COINS.slice(0, 3).map((c) => <tr key={c.s} className="border-b border-ink/30"><td className="py-1.5 font-medium">{c.n}</td><td className="text-right">${fmt(c.p)}</td><td className="text-right w-20"><Pct v={c.c} /></td></tr>)}</tbody></table>
          </Cell>
          <Cell f={FEATURES[1]} className="md:row-span-2"><SearchDemo /></Cell>
          <Cell f={FEATURES[2]} className="md:col-span-2">
            <svg viewBox="0 0 270 90" className="w-full mt-6" aria-label="Candlestick illustration">
              {CANDLES.map(([o, c, h, l], i) => {
                const y = (v) => 90 - v * 1.1, up = c >= o, x = 15 + i * 29
                return <g key={i}><line x1={x} x2={x} y1={y(h)} y2={y(l)} stroke="#14110F" /><rect x={x - 7} y={y(Math.max(o, c))} width="14" height={Math.abs(y(o) - y(c)) || 1} fill={up ? '#15803D' : '#B91C1C'} /></g>
              })}
            </svg>
          </Cell>
          <Cell f={FEATURES[3]} className="md:col-span-3 !border-b-0 md:!border-r-0">
            <svg viewBox="0 0 220 80" className="mt-6 h-20" fill="none" stroke="#14110F" strokeWidth="1.5" aria-label="Phone and laptop outlines">
              <rect x="10" y="8" width="36" height="64" /><line x1="22" x2="34" y1="66" y2="66" />
              <rect x="70" y="14" width="120" height="52" /><line x1="60" x2="200" y1="72" y2="72" />
            </svg>
          </Cell>
        </div>
      </Reveal>
    </section>
  )
}

function HowItWorks() {
  const steps = [['1', 'Open the app', 'No sign-up wall. Just launch CoinPulse in your browser.'], ['2', 'Find your coins', 'Search and filter the market down to what you care about.'], ['3', 'Watch the market', 'Follow prices, charts and your portfolio in one view.']]
  return (
    <section id="how" className="bg-forest text-paper">
      <Reveal className="max-w-[1280px] mx-auto px-5 py-20">
        <h2 className="font-display font-black text-4xl md:text-6xl tracking-tight">How it works</h2>
        <div className="mt-12 grid md:grid-cols-3 md:divide-x divide-paper/60 gap-y-10">
          {steps.map(([n, t, d]) => (
            <div key={n} className="md:px-8 first:pl-0">
              <span className="font-display font-black text-[8rem] leading-none outline-num hover:text-paper hover:[-webkit-text-stroke:0] transition-colors">{n}</span>
              <h3 className="font-display font-black text-2xl mt-2">{t}</h3>
              <p className="mt-2 max-w-[32ch] opacity-90">{d}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function TableHeader({ k, label, right = true, currentKey, asc, onSort }) {
  return (
    <th className={`p-3 font-semibold ${right ? 'text-right' : 'text-left'}`}>
      <button onClick={() => onSort(k)} className="inline-flex items-center gap-1 uppercase tracking-widest text-xs">
        {label}{currentKey === k && (asc ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
      </button>
    </th>
  )
}

function MarketTable() {
  const [key, setKey] = useState('m')
  const [asc, setAsc] = useState(false)
  const rows = COINS.map((c, i) => ({ ...c, r: i + 1, mv: parseFloat(c.m) * (c.m.endsWith('T') ? 1000 : 1) }))
  const val = (c) => ({ n: c.n, p: c.p, c: c.c, w: c.w, m: c.mv, r: c.r }[key])
  const sorted = [...rows].sort((a, b) => (val(a) > val(b) ? 1 : -1) * (asc ? 1 : -1))

  const handleSort = (k) => {
    if (key === k) {
      setAsc(!asc)
    } else {
      setKey(k)
      setAsc(false)
    }
  }

  return (
    <section id="markets" className="max-w-[1280px] mx-auto px-5 py-20">
      <Reveal>
        <h2 className="font-display font-black text-4xl md:text-6xl tracking-tight">Market snapshot</h2>
        <div className="mt-10 overflow-x-auto border-2 border-ink">
          <table className="w-full min-w-[720px] tnum text-sm">
            <thead className="border-b-2 border-ink">
              <tr>
                <TableHeader k="r" label="#" right={false} currentKey={key} asc={asc} onSort={handleSort} />
                <TableHeader k="n" label="Coin" right={false} currentKey={key} asc={asc} onSort={handleSort} />
                <TableHeader k="p" label="Price" currentKey={key} asc={asc} onSort={handleSort} />
                <TableHeader k="c" label="24h" currentKey={key} asc={asc} onSort={handleSort} />
                <TableHeader k="w" label="7d" currentKey={key} asc={asc} onSort={handleSort} />
                <TableHeader k="m" label="Market cap" currentKey={key} asc={asc} onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {sorted.map((c, i) => (
                <tr key={c.s} className={i % 2 ? 'bg-tint' : ''}>
                  <td className="p-3">{c.r}</td><td className="p-3 font-medium">{c.n} <span className="opacity-60">{c.s}</span></td>
                  <td className="p-3 text-right">${fmt(c.p)}</td><td className="p-3 text-right"><Pct v={c.c} /></td>
                  <td className="p-3 text-right"><span className="inline-flex items-center gap-2"><Spark data={c.sp} up={c.w >= 0} /><Pct v={c.w} /></span></td>
                  <td className="p-3 text-right">${c.m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-display italic mt-3 text-sm">Sample data shown for illustration.</p>
      </Reveal>
    </section>
  )
}

function Quote() {
  return (
    <section className="border-y-2 border-ink bg-tint">
      <Reveal className="max-w-[1280px] mx-auto px-5 py-24">
        <p className="font-display font-black text-5xl md:text-8xl leading-[0.95] tracking-tighter">Markets are loud. <span className="bg-mustard px-2">Your interface</span> shouldn't be.</p>
      </Reveal>
    </section>
  )
}

function FAQSection() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="max-w-[900px] mx-auto px-5 py-20">
      <Reveal>
        <h2 className="font-display font-black text-4xl md:text-6xl tracking-tight">Questions</h2>
        <div className="mt-10 border-2 border-ink divide-y divide-ink">
          {FAQ.map(([q, a], i) => (
            <div key={q}>
              <button className="w-full flex justify-between items-center p-5 text-left font-semibold hover:bg-tint" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                {q}{open === i ? <Minus size={20} strokeWidth={1.5} /> : <Plus size={20} strokeWidth={1.5} />}
              </button>
              {open === i && <p className="px-5 pb-5 max-w-[60ch]">{a}</p>}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="max-w-[1280px] mx-auto px-5 pb-20">
      <Reveal className="border-2 border-ink bg-mustard p-10 md:p-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <h2 className="font-display font-black text-5xl md:text-7xl tracking-tighter leading-none">Ready when the market is.</h2>
        <Btn className="self-start md:self-auto !py-4 !px-8 text-base">Launch App <ArrowUpRight size={18} strokeWidth={1.5} /></Btn>
      </Reveal>
    </section>
  )
}

function Footer() {
  const col = (t, items) => (
    <div><h4 className="text-xs uppercase tracking-widest mb-3 opacity-60">{t}</h4><ul className="space-y-2 text-sm">{items.map(([l, h]) => <li key={l}><a href={h} className="hover:underline">{l}</a></li>)}</ul></div>
  )
  return (
    <footer className="bg-ink text-paper overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 pt-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1"><p className="font-display font-black text-2xl">CoinPulse</p><p className="text-sm mt-2 max-w-[28ch] opacity-80">Live prices, market trends and portfolio changes in one clean interface.</p></div>
        {col('Product', [['Features', '#features'], ['Markets', '#markets'], ['FAQ', '#faq']])}
        {col('Stack', [['React', 'https://react.dev'], ['Vite', 'https://vite.dev'], ['Tailwind CSS', 'https://tailwindcss.com'], ['Vercel', 'https://vercel.com']])}
        {col('Links', [['GitHub', 'https://github.com'], ['Live App', APP]])}
      </div>
      <div className="max-w-[1280px] mx-auto px-5 mt-12 pt-4 border-t border-paper/30 flex justify-between text-xs uppercase tracking-widest">
        <span>© {new Date().getFullYear()} CoinPulse</span><span className="flex items-center gap-2"><GithubIcon size={14} />Open source</span>
      </div>
      <p aria-hidden="true" className="font-display font-black text-[20vw] leading-[0.7] text-[#2a2522] whitespace-nowrap text-center -mb-[2vw] pt-8 select-none">CoinPulse</p>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen md:m-4 md:border border-ink">
      <Ticker />
      <Masthead />
      <main>
        <Hero />
        <TrustStrip />
        <Features />
        <HowItWorks />
        <MarketTable />
        <Quote />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
