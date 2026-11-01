import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, animate } from 'framer-motion'
import {
  Compass, FileSearch, Target, LineChart, BellRing, Gauge,
  ArrowRight, Check, X, Play, Sparkles, Layers,
} from 'lucide-react'

const C = 2 * Math.PI * 54

const rise = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
})

const view = (i = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay: i * 0.08 },
})

function Count({ to }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const c = animate(0, to, { duration: 1.8, delay: 0.7, onUpdate: v => setN(Math.round(v)) })
    return () => c.stop()
  }, [to])
  return <>{n}</>
}

function Ring({ value, size = 'h-36 w-36', big = 'text-4xl', live = false }) {
  return (
    <div className={`relative ${size}`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#252d57" strokeWidth="9" />
        <motion.circle
          cx="60" cy="60" r="54" fill="none" stroke="url(#ringg)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - value / 100) }}
          transition={{ duration: live ? 0.8 : 1.8, delay: live ? 0 : 0.7, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="ringg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff7a59" />
            <stop offset="100%" stopColor="#ffc24b" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-display ${big} font-extrabold sun-text`}>
          {live ? value : <Count to={value} />}
          {live && '%'}
        </span>
        <span className="text-xs text-mist">{live ? 'match' : 'readiness'}</span>
      </div>
    </div>
  )
}

function HeroPreview() {
  const have = ['Java', 'SQL', 'Power BI', 'Git']
  const gap = ['Spring Boot', 'REST APIs', 'Docker']
  const cols = [
    { t: 'Applied', n: ['Northwind', 'Helio Labs', 'Kestrel'], c: 'text-sky' },
    { t: 'Interview', n: ['Orbit Pay'], c: 'text-amber' },
    { t: 'Offer', n: ['Lumen'], c: 'text-mint' },
  ]
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="orb -right-10 -top-10 h-56 w-56 bg-sun" />
      <div className="orb -bottom-10 -left-10 h-56 w-56 bg-violet" />
      <div className="glass bob relative rounded-3xl p-5 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-5">
          <Ring value={82} />
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-bold text-white">Backend Developer</p>
            <p className="text-sm text-mist">Match with Helio Labs: <span className="font-semibold text-mint">71%</span></p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {have.map(s => (
                <span key={s} className="inline-flex items-center gap-1 rounded-full bg-mint/15 px-2.5 py-1 text-xs text-mint">
                  <Check size={12} />{s}
                </span>
              ))}
              {gap.map(s => (
                <span key={s} className="inline-flex items-center gap-1 rounded-full bg-sun/15 px-2.5 py-1 text-xs text-sun">
                  <X size={12} />{s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="glass bob-slow relative -mt-3 ml-6 rounded-2xl p-4 shadow-xl shadow-black/40 sm:ml-12">
        <div className="grid grid-cols-3 gap-3">
          {cols.map(col => (
            <div key={col.t}>
              <p className={`mb-2 text-xs font-semibold ${col.c}`}>{col.t} <span className="text-white/40">{col.n.length}</span></p>
              <div className="space-y-2">
                {col.n.map(n => (
                  <div key={n} className="rounded-lg border border-line bg-ink/60 px-2.5 py-2 text-xs text-white/90">{n}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ticker = ['Java', 'SQL', 'Spring Boot', 'React', 'Power BI', 'Python', 'MySQL', 'REST APIs', 'Git', 'Docker', 'Tableau', 'Excel', 'HTML', 'JWT']
const tickerColors = ['text-sun', 'text-mint', 'text-sky', 'text-amber', 'text-violet', 'text-rose']

const roles = {
  'Backend Developer': ['Java', 'SQL', 'Spring Boot', 'REST APIs', 'Git', 'Docker'],
  'Data Analyst': ['SQL', 'Power BI', 'Excel', 'Python', 'Tableau', 'Statistics'],
  'Full Stack Developer': ['Java', 'HTML', 'React', 'SQL', 'REST APIs', 'Git'],
}
const mine = ['Java', 'SQL', 'Power BI', 'Git', 'HTML', 'Excel', 'Tableau']

function Demo() {
  const [role, setRole] = useState('Backend Developer')
  const req = roles[role]
  const have = req.filter(s => mine.includes(s))
  const gap = req.filter(s => !mine.includes(s))
  const pct = Math.round((have.length / req.length) * 100)
  const next = Math.round(((have.length + 1) / req.length) * 100)

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-10">
      <div className="orb -left-20 -top-20 h-64 w-64 bg-mint" />
      <div className="relative grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            Pick a role. <span className="text-mint">See your gap.</span>
          </h3>
          <p className="mt-3 text-mist">
            This sample student knows <span className="text-amber">Java, SQL, Power BI, Git, HTML, Excel and Tableau</span>. Choose a role and watch the match update.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {Object.keys(roles).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  role === r
                    ? 'border-transparent bg-gradient-to-r from-sun to-amber text-ink'
                    : 'border-line text-mist hover:border-mist hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <Ring value={pct} live size="h-44 w-44" big="text-5xl" />
          <div>
            <div className="flex flex-wrap gap-2">
              {have.map(s => (
                <span key={s} className="inline-flex items-center gap-1 rounded-full bg-mint/15 px-3 py-1.5 text-sm text-mint">
                  <Check size={14} />{s}
                </span>
              ))}
              {gap.map(s => (
                <span key={s} className="inline-flex items-center gap-1 rounded-full bg-sun/15 px-3 py-1.5 text-sm text-sun">
                  <X size={14} />{s}
                </span>
              ))}
            </div>
            {gap[0] && (
              <p className="mt-4 flex items-start gap-2 text-sm text-mist">
                <Sparkles size={16} className="mt-0.5 shrink-0 text-amber" />
                Learn <span className="font-semibold text-amber">{gap[0]}</span> next to move from {pct}% to {next}%.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const features = [
  { icon: Compass, title: 'Application board', text: 'Drag every company from Applied to Interview to Offer. Deadlines and notes stay on the card.', tile: 'bg-sky/15 text-sky', glow: 'hover:border-sky/60' },
  { icon: FileSearch, title: 'Resume reader', text: 'Upload your PDF and see the skills and education it actually shows.', tile: 'bg-mint/15 text-mint', glow: 'hover:border-mint/60' },
  { icon: Target, title: 'Skill-gap match', text: 'Paste a job post and get a match percentage with the exact skills to add.', tile: 'bg-sun/15 text-sun', glow: 'hover:border-sun/60' },
  { icon: LineChart, title: 'Funnel analytics', text: 'See how applications turn into interviews, and where they stall.', tile: 'bg-violet/15 text-violet', glow: 'hover:border-violet/60' },
  { icon: BellRing, title: 'Smart reminders', text: 'Email nudges arrive before every interview and deadline.', tile: 'bg-amber/15 text-amber', glow: 'hover:border-amber/60' },
  { icon: Gauge, title: 'Readiness score', text: 'Skills, projects, certificates and activity, with the reasoning shown.', tile: 'bg-rose/15 text-rose', glow: 'hover:border-rose/60' },
]

const steps = [
  { t: 'Add your resume', d: 'Upload once. PlaceIQ lists the skills it finds.', c: 'text-sky border-sky/40' },
  { t: 'Paste a job post', d: 'See your match and the skills you are missing.', c: 'text-amber border-amber/40' },
  { t: 'Track and improve', d: 'Move applications along and watch your score rise.', c: 'text-mint border-mint/40' },
]

const stack = ['React', 'Spring Boot', 'MySQL', 'Python Flask', 'JWT Security', 'Tailwind CSS']

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden font-sans">
      <header className="sticky top-0 z-50 border-b border-line/60 bg-ink/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#top" className="font-display text-2xl font-extrabold tracking-tight text-white">
            Place<span className="sun-text">IQ</span>
          </a>
          <div className="hidden gap-8 text-sm text-mist md:flex">
            <a href="#demo" className="hover:text-mint">Live demo</a>
            <a href="#features" className="hover:text-amber">Features</a>
            <a href="#how" className="hover:text-sky">How it works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden rounded-full px-4 py-2 text-sm text-mist hover:text-white sm:block">Log in</Link>
            <Link to="/login" className="rounded-full bg-gradient-to-r from-sun to-amber px-5 py-2 text-sm font-semibold text-ink transition hover:brightness-110">
              Start free
            </Link>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="field relative">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 lg:grid-cols-2 lg:pt-24">
            <div>
              <motion.p {...rise(0)} className="mb-5 inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3.5 py-1.5 text-xs font-medium text-mint">
                <span className="h-2 w-2 animate-pulse rounded-full bg-mint" /> Built for campus placements
              </motion.p>
              <motion.h1 {...rise(1)} className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Know exactly where you stand for <span className="shimmer">every job</span>.
              </motion.h1>
              <motion.p {...rise(2)} className="mt-6 max-w-lg text-lg leading-relaxed text-mist">
                Track every application, read your resume the way a recruiter does, and <span className="font-semibold text-amber">close your skill gaps</span> before the next <span className="font-semibold text-mint">interview</span>.
              </motion.p>
              <motion.div {...rise(3)} className="mt-9 flex flex-wrap items-center gap-4">
                <Link to="/login" className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sun to-amber px-7 py-3.5 font-semibold text-ink shadow-lg shadow-sun/30 transition hover:scale-[1.03]">
                  Create my account <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                </Link>
                <a href="#demo" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-white/90 transition hover:border-mint hover:text-mint">
                  <Play size={16} /> Try the live demo
                </a>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
              <HeroPreview />
            </motion.div>
          </div>
        </section>

        <section className="overflow-hidden border-y border-line bg-panel/50 py-5">
          <div className="marquee gap-10">
            {[...ticker, ...ticker].map((s, i) => (
              <span key={i} className={`flex items-center gap-10 font-display text-xl font-bold ${tickerColors[i % tickerColors.length]}`}>
                {s} <span className="h-1.5 w-1.5 rounded-full bg-line" />
              </span>
            ))}
          </div>
        </section>

        <section id="demo" className="mx-auto max-w-6xl px-5 py-24">
          <motion.div {...view()}>
            <Demo />
          </motion.div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-5 pb-24">
          <motion.h2 {...view()} className="max-w-2xl font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Everything a placement season throws at you, <span className="sun-text">in one place</span>.
          </motion.h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text, tile, glow }, i) => (
              <motion.div
                key={title}
                {...view(i % 3)}
                whileHover={{ y: -6 }}
                className={`rounded-3xl border border-line bg-panel/80 p-7 transition-colors ${glow}`}
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${tile}`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-display text-xl font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="how" className="border-y border-line bg-panel/40">
          <div className="mx-auto max-w-6xl px-5 py-24">
            <motion.h2 {...view()} className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Three steps to a <span className="text-sky">clearer plan</span>.
            </motion.h2>
            <ol className="mt-14 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <motion.li key={s.t} {...view(i)} className="relative rounded-3xl border border-line bg-ink/60 p-7">
                  <span className={`flex h-14 w-14 items-center justify-center rounded-full border-2 font-display text-2xl font-extrabold ${s.c}`}>
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold text-white">{s.t}</h3>
                  <p className="mt-2 text-mist">{s.d}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 text-center">
          <p className="mb-6 flex items-center justify-center gap-2 text-sm text-mist">
            <Layers size={16} className="text-violet" /> Built with a full-stack toolkit
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {stack.map((s, i) => (
              <span key={s} className={`rounded-full border border-line bg-panel px-5 py-2.5 font-display text-base font-bold ${tickerColors[i % tickerColors.length]}`}>
                {s}
              </span>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 pb-28">
          <motion.div {...view()} className="relative overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-panel via-panel to-sun/25 px-6 py-16 text-center sm:px-14">
            <div className="orb -right-10 -top-10 h-60 w-60 bg-amber" />
            <div className="orb -bottom-16 -left-10 h-60 w-60 bg-violet" />
            <h2 className="relative font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
              Walk into your next interview <span className="sun-text">already prepared</span>.
            </h2>
            <p className="relative mx-auto mt-5 max-w-md text-mist">Free to start. Your first skill-gap report takes under a minute.</p>
            <Link to="/login" className="group relative mt-9 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sun to-amber px-8 py-4 text-lg font-semibold text-ink shadow-lg shadow-sun/30 transition hover:scale-[1.03]">
              Create my account <ArrowRight size={20} className="transition group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-mist">
          <span className="font-display font-bold text-white">Place<span className="sun-text">IQ</span></span>
          <span>Smart job application and career intelligence platform</span>
          <a href="https://github.com/Pavani887989/placeiq" className="hover:text-amber">GitHub</a>
        </div>
      </footer>
    </div>
  )
}