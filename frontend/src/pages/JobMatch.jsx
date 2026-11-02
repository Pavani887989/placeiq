import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, Sparkles, Check, X, Plus, Zap, Rocket, MessageSquare, ListChecks, Clock,
  RotateCcw, BookOpen, TrendingUp, Building2, Info, Layers, Gauge, Wand2,
} from 'lucide-react'

const C = 2 * Math.PI * 54

const skills = [
  { n: 'Java', re: /\bjava\b/i, w: 4, r: 'Practise OOP and collections on small projects', q: 'Explain the four OOP pillars with an example from your project.' },
  { n: 'Python', re: /\bpython\b/i, w: 3, r: 'Automate a small data task with scripts', q: 'How would you find duplicate rows in a CSV with Python?' },
  { n: 'SQL', re: /\bsql\b/i, w: 2, r: 'Solve JOIN and GROUP BY practice questions', q: 'What is the difference between INNER JOIN and LEFT JOIN?' },
  { n: 'MySQL', re: /mysql/i, w: 1, r: 'Design a small schema with foreign keys', q: 'How did you design the tables for your project?' },
  { n: 'Power BI', re: /power\s?bi/i, w: 2, r: 'Rebuild a dashboard with DAX measures', q: 'How did you clean data with Power Query in your dashboard?' },
  { n: 'Tableau', re: /tableau/i, w: 2, r: 'Publish one dashboard on Tableau Public', q: 'When would you pick Tableau over Power BI?' },
  { n: 'Excel', re: /\bexcel\b/i, w: 1, r: 'Practise pivot tables and lookup formulas', q: 'Explain VLOOKUP and when XLOOKUP is better.' },
  { n: 'Pandas', re: /pandas/i, w: 2, r: 'Clean a messy dataset with Pandas', q: 'How do you handle missing values in a DataFrame?' },
  { n: 'Statistics', re: /statistic/i, w: 3, r: 'Revise mean, variance and hypothesis tests', q: 'When does the median describe data better than the mean?' },
  { n: 'Machine Learning', re: /machine learning|deep learning/i, w: 4, r: 'Write up your CNN-LSTM project results', q: 'Why did you combine CNN and LSTM for arrhythmia signals?' },
  { n: 'HTML', re: /\bhtml\b/i, w: 1, r: 'Build two static pages from scratch', q: 'What is semantic HTML and why does it matter?' },
  { n: 'CSS', re: /\bcss\b/i, w: 1, r: 'Practise flexbox and grid layouts', q: 'How do flexbox and grid differ?' },
  { n: 'JavaScript', re: /javascript/i, w: 3, r: 'Build a small interactive app in plain JavaScript', q: 'What is a closure in JavaScript?' },
  { n: 'React', re: /\breact(\.js)?\b/i, w: 3, r: 'Build a small React app with hooks and routing', q: 'What are props and state in React?' },
  { n: 'Spring Boot', re: /spring\s?boot/i, w: 3, r: 'Build a REST API with Spring Boot and MySQL', q: 'How does Spring Boot auto-configuration work?' },
  { n: 'REST APIs', re: /rest(ful)?\s?api/i, w: 1, r: 'Design GET, POST, PUT and DELETE endpoints', q: 'What makes an API RESTful?' },
  { n: 'Git', re: /\bgit(hub)?\b/i, w: 1, r: 'Practise branches, merges and pull requests', q: 'What is the difference between merge and rebase?' },
  { n: 'Docker', re: /docker/i, w: 1, r: 'Containerise one app with a Dockerfile', q: 'What is the difference between an image and a container?' },
]

const defaults = ['Java', 'SQL', 'MySQL', 'Power BI', 'Tableau', 'Excel', 'HTML', 'Git', 'Machine Learning']

const samples = [
  { co: 'Helio Labs', role: 'Backend Developer', mode: 'Remote', tone: 'from-sky to-violet', jd: 'We need a Backend Developer with strong Java and Spring Boot experience. You will build REST APIs backed by MySQL, write SQL queries, and containerise services with Docker. Git is required. Knowledge of Spring Boot and REST API design is a must.' },
  { co: 'Orbit Pay', role: 'Data Analyst', mode: 'Hybrid', tone: 'from-amber to-sun', jd: 'Looking for a Data Analyst skilled in SQL and Power BI. You will clean data with Excel and Python, build dashboards in Tableau, and use Pandas and basic Statistics to find insights. SQL and Power BI are required.' },
  { co: 'Northwind', role: 'Full Stack Developer', mode: 'On-site', tone: 'from-mint to-sky', jd: 'Full Stack Developer role: build web apps with React, JavaScript, HTML and CSS on the front end and Java with REST APIs and SQL on the back end. Git workflow and Docker knowledge is a plus.' },
]

const hero = [
  { i: Layers, t: '18 skills tracked', c: 'text-sky' },
  { i: Gauge, t: 'Live match score', c: 'text-mint' },
  { i: Wand2, t: 'What-if simulator', c: 'text-amber' },
]

function verdict(p) {
  if (p >= 75) return { t: 'Strong match', c: 'text-mint bg-mint/15' }
  if (p >= 50) return { t: 'Good match', c: 'text-amber bg-amber/15' }
  return { t: 'Stretch role', c: 'text-rose bg-rose/15' }
}

function level(w) {
  if (w >= 4) return { t: 'Hard', c: 'bg-rose/15 text-rose' }
  if (w >= 2) return { t: 'Medium', c: 'bg-amber/15 text-amber' }
  return { t: 'Easy', c: 'bg-mint/15 text-mint' }
}

export default function JobMatch() {
  const [jd, setJd] = useState('')
  const [picked, setPicked] = useState(null)
  const [mine, setMine] = useState(defaults)
  const [stage, setStage] = useState('idle')
  const [reqs, setReqs] = useState([])
  const [learn, setLearn] = useState([])
  const [tab, setTab] = useState('skills')
  const [notice, setNotice] = useState('')

  const toggle = n => setMine(m => (m.includes(n) ? m.filter(x => x !== n) : [...m, n]))
  const toggleLearn = n => setLearn(l => (l.includes(n) ? l.filter(x => x !== n) : [...l, n]))

  const run = () => {
    if (!jd.trim()) { setNotice('Paste a job description or pick a job first.'); return }
    const found = skills
      .map(s => ({ s, count: (jd.match(new RegExp(s.re.source, 'gi')) || []).length }))
      .filter(x => x.count > 0)
      .sort((a, b) => b.count - a.count)
    if (!found.length) { setNotice('No known skills found. Try a fuller job description.'); return }
    setNotice('')
    setLearn([])
    setTab('skills')
    setStage('loading')
    setTimeout(() => { setReqs(found); setStage('done') }, 1400)
  }

  const reset = () => { setJd(''); setPicked(null); setStage('idle'); setReqs([]); setLearn([]); setNotice('') }

  const total = reqs.length
  const haveNow = reqs.filter(x => mine.includes(x.s.n))
  const missing = reqs.filter(x => !mine.includes(x.s.n))
  const base = total ? Math.round((haveNow.length / total) * 100) : 0
  const pct = total ? Math.round(((haveNow.length + missing.filter(x => learn.includes(x.s.n)).length) / total) * 100) : 0
  const v = verdict(pct)
  const allWeeks = missing.reduce((a, x) => a + x.s.w, 0)
  const weeks = missing.filter(x => learn.includes(x.s.n)).reduce((a, x) => a + x.s.w, 0)
  const maxCount = reqs.length ? reqs[0].count : 1
  const questions = reqs.filter(x => mine.includes(x.s.n) || learn.includes(x.s.n)).slice(0, 6)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet/40 via-sun/30 to-amber/30 p-7 sm:p-9">
        <div className="orb -right-10 -top-16 h-64 w-64 bg-mint" />
        <div className="orb -bottom-24 left-1/3 h-64 w-64 bg-sky" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3.5 py-1.5 text-xs font-medium text-amber backdrop-blur"><Zap size={14} /> Skill-gap matcher</span>
            <h1 className="mt-3 font-display text-4xl font-extrabold text-white sm:text-6xl">Job <span className="shimmer">match</span></h1>
            <p className="mt-2 max-w-lg text-white/85">Paste any job post and see exactly where you stand. Tap a missing skill to watch your match climb.</p>
          </div>
          <div className="flex flex-col gap-2.5">
            {hero.map(({ i: Icon, t, c }, k) => (
              <motion.div key={t} animate={{ x: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity, delay: k * 0.5 }} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-2.5 backdrop-blur">
                <Icon size={18} className={c} /><span className="text-sm font-medium text-white">{t}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-5">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6 rounded-3xl border border-line bg-panel/80 p-6 lg:col-span-2">
          <div>
            <h2 className="mb-3 flex items-center gap-2.5 font-display text-lg font-bold text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sun to-amber text-sm font-extrabold text-ink">1</span>Choose a job
            </h2>
            <div className="grid gap-2.5">
              {samples.map(s => (
                <button key={s.co} onClick={() => { setJd(s.jd); setPicked(s.co); setNotice('') }} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${picked === s.co ? 'border-amber bg-amber/10 shadow-lg shadow-amber/10' : 'border-line bg-ink/40 hover:border-mist'}`}>
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-display text-lg font-extrabold text-ink ${s.tone}`}>{s.co[0]}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-white">{s.role}</span>
                    <span className="block text-xs text-mist">{s.co}</span>
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/80">{s.mode}</span>
                </button>
              ))}
            </div>
            <textarea value={jd} onChange={e => { setJd(e.target.value); setPicked(null) }} rows={4} placeholder="Or paste any job description here..." className="mt-3 w-full resize-none rounded-xl border border-line bg-ink/60 px-4 py-3 text-sm text-white placeholder:text-mist/60 focus:border-amber focus:outline-none" />
          </div>

          <div>
            <h2 className="mb-3 flex items-center gap-2.5 font-display text-lg font-bold text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-mint to-sky text-sm font-extrabold text-ink">2</span>Your skills
              <span className="ml-auto rounded-full bg-mint/15 px-2.5 py-0.5 text-xs text-mint">{mine.length} on</span>
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map(s => (
                <button key={s.n} onClick={() => toggle(s.n)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${mine.includes(s.n) ? 'bg-mint/20 text-mint ring-1 ring-mint/40' : 'bg-line/60 text-mist hover:text-white'}`}>{s.n}</button>
              ))}
            </div>
          </div>

          {notice && <p className="flex items-start gap-2 rounded-xl bg-amber/10 px-4 py-3 text-xs text-amber"><Info size={14} className="mt-0.5 shrink-0" />{notice}</p>}

          <div className="flex gap-3">
            <button onClick={run} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sun to-amber px-5 py-4 text-sm font-semibold text-ink shadow-lg shadow-sun/30 transition hover:scale-[1.02]"><Sparkles size={16} /> Match my skills</button>
            <button onClick={reset} aria-label="Reset" className="rounded-xl border border-line px-4 py-4 text-mist transition hover:text-white"><RotateCcw size={16} /></button>
          </div>
        </motion.div>
        
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {stage === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex h-full min-h-96 flex-col items-center justify-center gap-5 overflow-hidden rounded-3xl border border-dashed border-line bg-panel/40 p-8 text-center">
                <div className="orb left-1/4 top-0 h-52 w-52 bg-violet" />
                <div className="orb bottom-0 right-1/4 h-44 w-44 bg-sun" />
                <motion.span animate={{ scale: [1, 1.1, 1], rotate: [0, 6, 0] }} transition={{ duration: 3, repeat: Infinity }} className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-sun to-amber text-ink shadow-2xl shadow-sun/30"><Target size={44} /></motion.span>
                <h2 className="relative font-display text-3xl font-extrabold text-white">Your match appears here</h2>
                <p className="relative max-w-xs text-sm text-mist">Choose a job on the left, then click Match my skills.</p>
              </motion.div>
            )}

            {stage === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full min-h-96 flex-col items-center justify-center gap-5 rounded-3xl border border-line bg-panel/60 p-8 text-center">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-amber/20" />
                  <span className="absolute inset-0 animate-spin rounded-full border-4 border-line border-t-amber" />
                  <Target size={32} className="text-amber" />
                </div>
                <p className="font-display text-xl font-bold text-white">Comparing your skills with the job...</p>
              </motion.div>
            )}

            {stage === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-panel via-panel to-sun/25 p-6">
                  <div className="orb -right-10 -top-10 h-48 w-48 bg-mint" />
                  <div className="relative flex flex-wrap items-center gap-6">
                    <div className="relative h-40 w-40 shrink-0">
                      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#252d57" strokeWidth="9" />
                        <motion.circle cx="60" cy="60" r="54" fill="none" stroke="url(#jm)" strokeWidth="9" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - pct / 100) }} transition={{ duration: 0.9 }} />
                        <defs>
                          <linearGradient id="jm" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#ff7a59" />
                            <stop offset="100%" stopColor="#3ee6b0" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-display text-5xl font-extrabold sun-text">{pct}%</span>
                        <span className="text-xs text-mist">match</span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${v.c}`}>{v.t}</span>
                      <h2 className="mt-2 font-display text-2xl font-extrabold text-white">{picked || 'Your job'}</h2>
                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-line">
                        <div className="relative h-3">
                          <motion.div className="absolute inset-y-0 left-0 rounded-full bg-mint/40" animate={{ width: pct + '%' }} />
                          <motion.div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sun to-amber" animate={{ width: base + '%' }} />
                        </div>
                      </div>
                      <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-mist">
                        <span>Now {base}%</span>
                        {pct > base && <span className="inline-flex items-center gap-1 rounded-full bg-mint/15 px-2.5 py-1 font-semibold text-mint"><TrendingUp size={12} />{pct}% with your plan</span>}
                      </p>
                    </div>
                  </div>
                  <div className="relative mt-5 grid grid-cols-3 gap-3">
                    {[
                      { l: 'You have', v: haveNow.length, c: 'text-mint border-mint/30 bg-mint/10' },
                      { l: 'Missing', v: missing.length, c: 'text-rose border-rose/30 bg-rose/10' },
                      { l: 'Plan weeks', v: weeks, c: 'text-amber border-amber/30 bg-amber/10' },
                    ].map(s => (
                      <div key={s.l} className={`rounded-2xl border p-3.5 text-center ${s.c}`}>
                        <p className="font-display text-3xl font-extrabold">{s.v}</p>
                        <p className="text-xs text-white/70">{s.l}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 rounded-full border border-line bg-panel p-1.5">
                  {[
                    { id: 'skills', label: 'Skills', icon: ListChecks, n: total },
                    { id: 'plan', label: 'Learning plan', icon: Rocket, n: missing.length },
                    { id: 'interview', label: 'Interview prep', icon: MessageSquare, n: questions.length },
                  ].map(t => {
                    const Icon = t.icon
                    return (
                      <button key={t.id} onClick={() => setTab(t.id)} className={`relative flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold transition ${tab === t.id ? 'text-ink' : 'text-mist hover:text-white'}`}>
                        {tab === t.id && <motion.span layoutId="jtab" className="absolute inset-0 rounded-full bg-gradient-to-r from-sun to-amber" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                        <span className="relative flex items-center gap-2"><Icon size={16} /><span className="hidden sm:inline">{t.label}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] ${tab === t.id ? 'bg-ink/20' : 'bg-white/10'}`}>{t.n}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                                      {tab === 'skills' && (
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                          <p className="text-xs text-mist">Tap <span className="text-amber">Add to plan</span> to see your match change.</p>
                          {missing.length > 0 && <button onClick={() => setLearn(missing.map(x => x.s.n))} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"><Plus size={13} />Plan all missing</button>}
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {reqs.map((x, i) => {
                            const has = mine.includes(x.s.n)
                            const planned = learn.includes(x.s.n)
                            const tone = has ? 'border-mint/30 bg-mint/10' : planned ? 'border-amber/40 bg-amber/10' : 'border-rose/30 bg-rose/10'
                            const chip = has ? 'bg-mint/20 text-mint' : planned ? 'bg-amber/20 text-amber' : 'bg-rose/20 text-rose'
                            return (
                              <motion.div key={x.s.n} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`rounded-2xl border p-4 ${tone}`}>
                                <div className="flex items-center gap-3">
                                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${chip}`}>{has ? <Check size={20} /> : planned ? <Rocket size={18} /> : <X size={20} />}</span>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate font-semibold text-white">{x.s.n}</p>
                                    <p className="text-xs text-mist">mentioned {x.count}x</p>
                                  </div>
                                </div>
                                <div className="mt-3 h-1.5 rounded-full bg-line"><div className="h-1.5 rounded-full bg-gradient-to-r from-sun to-amber" style={{ width: (x.count / maxCount) * 100 + '%' }} /></div>
                                <div className="mt-3">
                                  {has ? <span className="text-xs font-semibold text-mint">You have it</span> : (
                                    <button onClick={() => toggleLearn(x.s.n)} className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${planned ? 'bg-amber text-ink' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                      {planned ? <><Check size={13} />Planned</> : <><Plus size={13} />Add to plan</>}
                                    </button>
                                  )}
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {tab === 'plan' && (
                      <div className="space-y-4">
                        {missing.length === 0 && <p className="rounded-3xl border border-mint/30 bg-mint/10 p-6 text-sm text-mint">Nothing missing. You cover every skill in this job.</p>}
                        {missing.length > 0 && (
                          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-violet/25 to-sun/20 p-5">
                            <p className="flex items-center gap-2 text-sm text-white/90"><Clock size={18} className="text-amber" />{learn.length ? <>Your plan: <b>{learn.length}</b> skill{learn.length > 1 ? 's' : ''}, about <b>{weeks}</b> of {allWeeks} weeks.</> : 'Add skills to your plan on the Skills tab.'}</p>
                            <div className="mt-3 h-2.5 rounded-full bg-black/25"><motion.div className="h-2.5 rounded-full bg-gradient-to-r from-sun to-amber" animate={{ width: (allWeeks ? (weeks / allWeeks) * 100 : 0) + '%' }} /></div>
                          </div>
                        )}
                        <div className="relative space-y-3 pl-2">
                          {missing.length > 1 && <span className="absolute bottom-6 left-7 top-6 w-px bg-line" />}
                          {missing.map((x, i) => (
                            <div key={x.s.n} className="relative flex items-start gap-4">
                              <span className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display font-extrabold ${learn.includes(x.s.n) ? 'bg-gradient-to-br from-sun to-amber text-ink' : 'bg-panel text-mist ring-2 ring-line'}`}>{i + 1}</span>
                              <div className="min-w-0 flex-1 rounded-3xl border border-line bg-panel/80 p-4">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-semibold text-white">{x.s.n}</p>
                                  <span className="rounded-full bg-sky/15 px-2.5 py-0.5 text-xs text-sky">about {x.s.w} week{x.s.w > 1 ? 's' : ''}</span>
                                  {learn.includes(x.s.n) && <span className="rounded-full bg-amber/15 px-2.5 py-0.5 text-xs text-amber">In your plan</span>}
                                </div>
                                <p className="mt-1.5 flex items-start gap-2 text-sm text-mist"><BookOpen size={15} className="mt-0.5 shrink-0 text-amber" />{x.s.r}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {tab === 'interview' && (
                      <div className="space-y-3">
                        <p className="px-1 text-xs text-mist">Questions for the skills you have or plan to learn for this job.</p>
                        {questions.map((x, i) => {
                          const lv = level(x.s.w)
                          return (
                            <div key={x.s.n} className="flex items-start gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-violet/25 via-sun/10 to-panel p-5">
                              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/25 font-display text-lg font-extrabold text-amber">{i + 1}</span>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="rounded-full bg-amber/15 px-2.5 py-0.5 text-xs font-semibold text-amber">{x.s.n}</span>
                                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${lv.c}`}>{lv.t}</span>
                                </div>
                                <p className="mt-2 text-sm text-white/90">{x.s.q}</p>
                              </div>
                            </div>
                          )
                        })}
                        {questions.length === 0 && <p className="text-sm text-mist">Switch on some of your skills to get questions.</p>}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}