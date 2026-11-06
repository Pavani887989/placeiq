import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts'
import {
  UploadCloud, FileText, Wand2, Check, X, Sparkles, RotateCcw, Target, ListChecks,
  Lightbulb, Info, Server, BarChart3, Layers, LayoutGrid, ScanSearch, Trophy, Gauge,
} from 'lucide-react'

const C = 2 * Math.PI * 54

const catalog = [
  { name: 'Java', cat: 'Languages', re: /\bjava\b/i },
  { name: 'C', cat: 'Languages', re: /\bC\b(?![+#])/ },
  { name: 'C++', cat: 'Languages', re: /C\+\+/ },
  { name: 'Python', cat: 'Languages', re: /\bpython\b/i },
  { name: 'JavaScript', cat: 'Languages', re: /javascript/i },
  { name: 'SQL', cat: 'Databases', re: /\bsql\b/i },
  { name: 'MySQL', cat: 'Databases', re: /mysql/i },
  { name: 'Power BI', cat: 'Data', re: /power\s?bi/i },
  { name: 'Tableau', cat: 'Data', re: /tableau/i },
  { name: 'Excel', cat: 'Data', re: /\bexcel\b/i },
  { name: 'Pandas', cat: 'Data', re: /pandas/i },
  { name: 'Machine Learning', cat: 'Data', re: /machine learning|deep learning|\bcnn\b|\blstm\b/i },
  { name: 'HTML', cat: 'Web', re: /\bhtml\b/i },
  { name: 'CSS', cat: 'Web', re: /\bcss\b/i },
  { name: 'React', cat: 'Web', re: /\breact(\.js)?\b/i },
  { name: 'Spring Boot', cat: 'Web', re: /spring\s?boot/i },
  { name: 'REST APIs', cat: 'Web', re: /rest(ful)?\s?api/i },
  { name: 'Git', cat: 'Tools', re: /\bgit(hub)?\b/i },
  { name: 'Docker', cat: 'Tools', re: /docker/i },
  { name: 'VS Code', cat: 'Tools', re: /vs\s?code/i },
]

const catStyle = {
  Languages: { chip: 'bg-sky/15 text-sky', dot: 'bg-sky' },
  Databases: { chip: 'bg-amber/15 text-amber', dot: 'bg-amber' },
  Data: { chip: 'bg-violet/15 text-violet', dot: 'bg-violet' },
  Web: { chip: 'bg-mint/15 text-mint', dot: 'bg-mint' },
  Tools: { chip: 'bg-rose/15 text-rose', dot: 'bg-rose' },
}

const roles = {
  'Backend Developer': {
    icon: Server, tone: 'from-sky to-violet', desc: 'APIs, databases, Java',
    skills: ['Java', 'SQL', 'MySQL', 'Spring Boot', 'REST APIs', 'Git', 'Docker'],
  },
  'Data Analyst': {
    icon: BarChart3, tone: 'from-amber to-sun', desc: 'SQL, dashboards, Python',
    skills: ['SQL', 'Power BI', 'Excel', 'Python', 'Tableau', 'Pandas'],
  },
  'Full Stack Developer': {
    icon: Layers, tone: 'from-mint to-sky', desc: 'Web apps end to end',
    skills: ['Java', 'HTML', 'CSS', 'JavaScript', 'React', 'SQL', 'REST APIs', 'Git'],
  },
}

const sections = [
  { name: 'Contact details', re: /@|\+?\d[\d\s-]{8,}/ },
  { name: 'Career objective', re: /objective|summary|profile/i },
  { name: 'Skills', re: /skills/i },
  { name: 'Education', re: /education|cgpa|b\.?e\b|b\.?tech/i },
  { name: 'Projects', re: /projects?/i },
  { name: 'Certifications', re: /certif/i },
]

const scanSteps = ['Reading your resume', 'Detecting skills', 'Matching the role', 'Scoring sections']

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'sections', label: 'Sections', icon: ListChecks },
  { id: 'tips', label: 'Tips', icon: Lightbulb },
]

const sample = `PAVANI S
Bangalore, Karnataka | +91-8970739212 | name@gmail.com

CAREER OBJECTIVE
Final-year B.E student in Computer Science with a strong foundation in Java, SQL, Data Analytics and Power BI.

SKILLS
Programming Languages: C, C++, Java
Database: SQL, MySQL
Data Analytics and Visualization: Power BI, Tableau, Microsoft Excel
Web Technologies: HTML
Tools: GitHub, VS Code, Eclipse

EDUCATION
B.E in Computer Science and Engineering, CGPA 8.42

PROJECTS
Sales Performance Dashboard using Power BI
Detection and Classification of Arrhythmia using CNN-LSTM

CERTIFICATIONS
Git Training, Introduction to SQL, Java Programming Fundamentals`

function grade(score) {
  if (score >= 80) return { label: 'Excellent', tone: 'text-mint bg-mint/15' }
  if (score >= 60) return { label: 'Good', tone: 'text-amber bg-amber/15' }
  return { label: 'Needs work', tone: 'text-rose bg-rose/15' }
}

export default function ResumeAnalyzer() {
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('')
  const [notice, setNotice] = useState('')
  const [role, setRole] = useState('Backend Developer')
  const [stage, setStage] = useState('idle')
  const [step, setStep] = useState(0)
  const [tab, setTab] = useState('overview')
  const [result, setResult] = useState(null)
  const [drag, setDrag] = useState(false)
  const fileRef = useRef(null)

  const readFile = async file => {
    if (!file) return
    setFileName(file.name)
    setNotice('')
    if (/\.txt$/i.test(file.name)) {
      const r = new FileReader()
      r.onload = () => setText(String(r.result))
      r.readAsText(file)
      return
    }
    if (!/\.pdf$/i.test(file.name)) {
      setNotice('Please upload a PDF or a .txt file.')
      return
    }
    setNotice('Reading your PDF...')
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('http://localhost:5000/parse', { method: 'POST', body })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not read this PDF.')
      setText(data.text)
      setNotice('')
    } catch (e) {
      setNotice(e.message === 'Failed to fetch' ? 'The resume service is not running. Start it with: python app.py' : e.message)
    }
  }

  const analyze = () => {
    if (!text.trim()) {
      setNotice('Paste your resume text or load the sample first.')
      return
    }
    setNotice('')
    setStage('loading')
    setStep(0)
    ;[1, 2, 3].forEach(i => setTimeout(() => setStep(i), i * 450))
    setTimeout(() => {
      const found = catalog.filter(s => s.re.test(text))
      const names = found.map(s => s.name)
      const req = roles[role].skills
      const have = req.filter(s => names.includes(s))
      const missing = req.filter(s => !names.includes(s))
      const secs = sections.map(s => ({ name: s.name, ok: s.re.test(text) }))
      const roleMatch = Math.round((have.length / req.length) * 100)
      const secScore = Math.round((secs.filter(s => s.ok).length / secs.length) * 100)
      const score = Math.round(roleMatch * 0.6 + secScore * 0.4)
      const radar = Object.keys(catStyle).map(c => {
        const all = catalog.filter(s => s.cat === c).length
        const got = found.filter(s => s.cat === c).length
        return { c, v: Math.round((got / all) * 100) }
      })
      const tips = []
      if (missing.length) tips.push('Add ' + missing.slice(0, 3).join(', ') + ' to your resume if you have used them, or learn them next.')
      secs.filter(s => !s.ok).forEach(s => tips.push('Add a ' + s.name + ' section.'))
      if (!/\d/.test(text.replace(/\+?\d[\d\s-]{8,}/g, ''))) tips.push('Add numbers to your projects, such as accuracy, users or records handled.')
      if (!tips.length) tips.push('Your resume covers this role well. Keep project bullets short and specific.')
      setResult({ found, have, missing, secs, roleMatch, secScore, score, tips, role, radar })
      setTab('overview')
      setStage('done')
    }, 1900)
  }

  const reset = () => {
    setText('')
    setFileName('')
    setNotice('')
    setResult(null)
    setStage('idle')
  }

  const stepIdx = stage === 'done' ? 3 : text.trim() ? 2 : 1
  const g = result ? grade(result.score) : null

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-mint/30 via-sky/25 to-violet/30 p-7 sm:p-8">
        <div className="orb -right-10 -top-16 h-60 w-60 bg-amber" />
        <div className="orb -bottom-20 left-1/4 h-60 w-60 bg-sun" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3.5 py-1.5 text-xs font-medium text-amber backdrop-blur">
              <Wand2 size={14} /> Skill detector
            </span>
            <h1 className="mt-3 font-display text-4xl font-extrabold text-white sm:text-5xl">
              Resume <span className="shimmer">analyzer</span>
            </h1>
            <p className="mt-1.5 max-w-xl text-white/80">See what a recruiter will find, what is missing for your target role, and how strong your resume is.</p>
          </div>
          <div className="flex items-center gap-2">
            {['Add resume', 'Pick role', 'See report'].map((s, i) => {
              const done = i + 1 < stepIdx || stage === 'done'
              const now = i + 1 === stepIdx && stage !== 'done'
              return (
                <div key={s} className="flex items-center gap-2">
                  <span className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold backdrop-blur ${done ? 'bg-mint/25 text-mint' : now ? 'bg-white text-ink' : 'bg-black/25 text-white/60'}`}>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${done ? 'bg-mint text-ink' : now ? 'bg-ink text-white' : 'bg-white/15'}`}>{done ? <Check size={12} /> : i + 1}</span>
                    <span className="hidden sm:inline">{s}</span>
                  </span>
                  {i < 2 && <span className="h-px w-4 bg-white/25" />}
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-5">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-5 rounded-3xl border border-line bg-panel/80 p-6 lg:col-span-2">
          <div
            onDragOver={e => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); readFile(e.dataTransfer.files[0]) }}
            onClick={() => fileRef.current && fileRef.current.click()}
            className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${drag ? 'border-amber bg-amber/10' : 'border-line hover:border-amber/60'}`}
          >
            <div className="orb -top-10 left-1/2 h-32 w-32 -translate-x-1/2 bg-sun" />
            <div className="relative flex flex-col items-center gap-2">
              <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 2.4, repeat: Infinity }} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sun to-amber text-ink shadow-lg shadow-sun/30"><UploadCloud size={26} /></motion.span>
              <p className="font-display text-lg font-bold text-white">Drop your resume here</p>
              <p className="text-xs text-mist">.txt works now. PDF reading comes with the back end.</p>
              {fileName && <p className="mt-1 flex items-center gap-1.5 rounded-full bg-mint/15 px-3 py-1 text-xs text-mint"><FileText size={13} />{fileName}</p>}
            </div>
            <input ref={fileRef} type="file" accept=".txt,.pdf" className="hidden" onChange={e => readFile(e.target.files[0])} />
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-mist">Or paste your resume text</span>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={6}
              placeholder="Paste your resume here..."
              className="w-full resize-none rounded-xl border border-line bg-ink/60 px-4 py-3 text-sm text-white placeholder:text-mist/60 focus:border-amber focus:outline-none"
            />
          </label>

          <div>
            <span className="mb-2 block text-xs font-medium text-mist">Target role</span>
            <div className="space-y-2.5">
              {Object.entries(roles).map(([name, r]) => {
                const Icon = r.icon
                const on = role === name
                return (
                  <button key={name} onClick={() => setRole(name)} className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition ${on ? 'border-amber bg-amber/10' : 'border-line bg-ink/40 hover:border-mist'}`}>
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-ink ${r.tone}`}><Icon size={22} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-white">{name}</span>
                      <span className="block text-xs text-mist">{r.desc}</span>
                    </span>
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full ${on ? 'bg-amber text-ink' : 'bg-line text-transparent'}`}><Check size={14} /></span>
                  </button>
                )
              })}
            </div>
          </div>

          {notice && <p className="flex items-start gap-2 rounded-xl bg-amber/10 px-4 py-3 text-xs text-amber"><Info size={14} className="mt-0.5 shrink-0" />{notice}</p>}

          <div className="flex flex-wrap gap-3">
            <button onClick={analyze} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sun to-amber px-5 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-sun/25 transition hover:scale-[1.02]">
              <Sparkles size={16} /> Analyze resume
            </button>
            <button onClick={() => { setText(sample); setFileName('sample-resume.txt'); setNotice('') }} className="rounded-xl border border-line px-4 py-3.5 text-sm text-mist transition hover:border-mist hover:text-white">Load sample</button>
            <button onClick={reset} aria-label="Reset" className="rounded-xl border border-line px-4 py-3.5 text-mist transition hover:text-white"><RotateCcw size={16} /></button>
          </div>
        </motion.div>
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {stage === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex h-full min-h-96 flex-col items-center justify-center gap-5 overflow-hidden rounded-3xl border border-dashed border-line bg-panel/40 p-8 text-center">
                <div className="orb left-1/4 top-0 h-48 w-48 bg-violet" />
                <div className="relative grid w-full max-w-sm grid-cols-3 gap-3">
                  {[{ i: Gauge, t: 'Score', c: 'bg-amber/15 text-amber' }, { i: Target, t: 'Role match', c: 'bg-mint/15 text-mint' }, { i: Lightbulb, t: 'Tips', c: 'bg-sun/15 text-sun' }].map(({ i: Icon, t, c }, k) => (
                    <motion.div key={t} animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: k * 0.4 }} className="glass rounded-2xl p-4">
                      <span className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl ${c}`}><Icon size={22} /></span>
                      <p className="mt-2 text-xs font-medium text-white">{t}</p>
                    </motion.div>
                  ))}
                </div>
                <h2 className="relative font-display text-2xl font-extrabold text-white">Your report appears here</h2>
                <p className="relative max-w-xs text-sm text-mist">Load the sample or paste your resume, choose a role, and click Analyze.</p>
              </motion.div>
            )}

            {stage === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex h-full min-h-96 flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl border border-line bg-panel/60 p-8 text-center">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-amber/20" />
                  <span className="absolute inset-0 animate-spin rounded-full border-4 border-line border-t-amber" />
                  <ScanSearch size={34} className="text-amber" />
                </div>
                <ul className="w-full max-w-xs space-y-2.5 text-left">
                  {scanSteps.map((s, i) => (
                    <li key={s} className={`flex items-center gap-3 text-sm transition ${i <= step ? 'text-white' : 'text-mist/50'}`}>
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${i < step ? 'bg-mint text-ink' : i === step ? 'bg-amber/20 text-amber' : 'bg-line'}`}>
                        {i < step ? <Check size={14} /> : <span className="h-2 w-2 rounded-full bg-current" />}
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {stage === 'done' && result && (
              <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="flex flex-wrap gap-1.5 rounded-full border border-line bg-panel p-1.5">
                  {tabs.map(t => {
                    const Icon = t.icon
                    return (
                      <button key={t.id} onClick={() => setTab(t.id)} className={`relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${tab === t.id ? 'text-ink' : 'text-mist hover:text-white'}`}>
                        {tab === t.id && <motion.span layoutId="rtab" className="absolute inset-0 rounded-full bg-gradient-to-r from-sun to-amber" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                        <span className="relative flex items-center gap-2"><Icon size={16} />{t.label}</span>
                      </button>
                    )
                  })}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-4">
                    {tab === 'overview' && (
                      <>
                        <div className="relative flex flex-wrap items-center gap-6 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-panel via-panel to-sun/25 p-6">
                          <div className="relative h-40 w-40 shrink-0">
                            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                              <circle cx="60" cy="60" r="54" fill="none" stroke="#252d57" strokeWidth="9" />
                              <motion.circle cx="60" cy="60" r="54" fill="none" stroke="url(#rr)" strokeWidth="9" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - result.score / 100) }} transition={{ duration: 1.4 }} />
                              <defs>
                                <linearGradient id="rr" x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="0%" stopColor="#ff7a59" />
                                  <stop offset="100%" stopColor="#ffc24b" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="font-display text-5xl font-extrabold sun-text">{result.score}</span>
                              <span className="text-xs text-mist">resume score</span>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${g.tone}`}><Trophy size={13} />{g.label}</span>
                            <h2 className="mt-2 font-display text-2xl font-extrabold text-white">{result.role}</h2>
                            <p className="mt-1 text-sm text-mist">Your resume matches {result.roleMatch}% of the skills this role asks for.</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {result.have.map(s => <span key={s} className="inline-flex items-center gap-1 rounded-full bg-mint/15 px-3 py-1 text-xs text-mint"><Check size={12} />{s}</span>)}
                              {result.missing.map(s => <span key={s} className="inline-flex items-center gap-1 rounded-full bg-sun/15 px-3 py-1 text-xs text-sun"><X size={12} />{s}</span>)}
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                          {[
                            { l: 'Skills found', v: result.found.length, c: 'from-sky/35 border-sky/40 text-sky' },
                            { l: 'Role match', v: result.roleMatch + '%', c: 'from-mint/35 border-mint/40 text-mint' },
                            { l: 'Sections done', v: result.secScore + '%', c: 'from-violet/35 border-violet/40 text-violet' },
                          ].map(s => (
                            <div key={s.l} className={`rounded-3xl border bg-gradient-to-br to-panel p-5 ${s.c}`}>
                              <p className="font-display text-4xl font-extrabold text-white">{s.v}</p>
                              <p className="text-sm text-white/70">{s.l}</p>
                            </div>
                          ))}
                        </div>

                        <div className="rounded-3xl border border-line bg-panel/80 p-6">
                          <h3 className="font-display text-lg font-bold text-white">Skill coverage</h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart data={result.radar} outerRadius="72%">
                                <PolarGrid stroke="#252d57" />
                                <PolarAngleAxis dataKey="c" tick={{ fill: '#a9b1d6', fontSize: 12 }} />
                                <Radar dataKey="v" stroke="#ffc24b" strokeWidth={3} fill="#ffc24b" fillOpacity={0.3} />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </>
                    )}

                    {tab === 'skills' && (
                      <>
                        <div className="rounded-3xl border border-line bg-panel/80 p-6">
                          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-white"><Sparkles size={18} className="text-amber" />Skills found ({result.found.length})</h3>
                          <div className="space-y-4">
                            {Object.keys(catStyle).map(c => {
                              const items = result.found.filter(s => s.cat === c)
                              if (!items.length) return null
                              return (
                                <div key={c}>
                                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-mist"><i className={`h-2 w-2 rounded-full ${catStyle[c].dot}`} />{c}</p>
                                  <div className="flex flex-wrap gap-2">
                                    {items.map(s => <span key={s.name} className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${catStyle[c].chip}`}>{s.name}</span>)}
                                  </div>
                                </div>
                              )
                            })}
                            {result.found.length === 0 && <p className="text-sm text-mist">No known skills detected. Check that your skills are written out in the text.</p>}
                          </div>
                        </div>
                        <div className="rounded-3xl border border-sun/30 bg-gradient-to-br from-sun/20 to-panel p-6">
                          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-white"><Target size={18} className="text-sun" />Missing for {result.role}</h3>
                          <div className="flex flex-wrap gap-2">
                            {result.missing.map(s => <span key={s} className="inline-flex items-center gap-1 rounded-full bg-sun/15 px-3.5 py-1.5 text-sm text-sun"><X size={13} />{s}</span>)}
                            {result.missing.length === 0 && <p className="text-sm text-mint">Nothing missing. You cover every skill for this role.</p>}
                          </div>
                        </div>
                      </>
                    )}

                    {tab === 'sections' && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {result.secs.map(s => (
                          <div key={s.name} className={`flex items-center gap-4 rounded-3xl border p-5 ${s.ok ? 'border-mint/30 bg-gradient-to-br from-mint/15 to-panel' : 'border-rose/30 bg-gradient-to-br from-rose/15 to-panel'}`}>
                            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${s.ok ? 'bg-mint/20 text-mint' : 'bg-rose/20 text-rose'}`}>{s.ok ? <Check size={24} /> : <X size={24} />}</span>
                            <div>
                              <p className="font-semibold text-white">{s.name}</p>
                              <p className="text-xs text-mist">{s.ok ? 'Found in your resume' : 'Not found, add this section'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {tab === 'tips' && (
                      <div className="space-y-3">
                        {result.tips.map((t, i) => (
                          <div key={t} className="flex items-start gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-violet/25 via-sun/15 to-panel p-5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sun to-amber font-display font-extrabold text-ink">{i + 1}</span>
                            <p className="pt-1.5 text-sm text-white/90">{t}</p>
                          </div>
                        ))}
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