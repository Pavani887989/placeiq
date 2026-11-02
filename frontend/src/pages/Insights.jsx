import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts'
import {
  TrendingUp, TrendingDown, Mail, CalendarCheck, Trophy, Timer, LayoutGrid, Filter,
  Sparkles, Target, Check, Flame, Lightbulb, ArrowDownRight, BarChart3, ListChecks,
} from 'lucide-react'

const C = 2 * Math.PI * 54
const tip = { background: '#121835', border: '1px solid #252d57', borderRadius: 12, color: '#fff' }

const ranges = {
  '30d': { label: 'Last 30 days', f: 1, funnel: [22, 9, 5, 2], days: 6, delta: [6, 4, 3, -1], trend: [{ m: 'Week 1', a: 3, i: 0 }, { m: 'Week 2', a: 5, i: 1 }, { m: 'Week 3', a: 6, i: 2 }, { m: 'Week 4', a: 8, i: 2 }] },
  '90d': { label: 'Last 3 months', f: 1.7, funnel: [38, 15, 8, 3], days: 7, delta: [4, 3, 1, -2], trend: [{ m: 'Sep', a: 9, i: 2 }, { m: 'Oct', a: 14, i: 4 }, { m: 'Nov', a: 15, i: 5 }] },
  all: { label: 'All time', f: 2.3, funnel: [52, 20, 10, 4], days: 8, delta: [2, 2, 1, -1], trend: [{ m: 'Jun', a: 2, i: 0 }, { m: 'Jul', a: 6, i: 1 }, { m: 'Aug', a: 9, i: 2 }, { m: 'Sep', a: 11, i: 3 }, { m: 'Oct', a: 14, i: 4 }, { m: 'Nov', a: 10, i: 3 }] },
}

const baseSources = [
  { s: 'Campus', a: 12, i: 4 },
  { s: 'LinkedIn', a: 9, i: 2 },
  { s: 'Referral', a: 4, i: 3 },
  { s: 'Company site', a: 7, i: 1 },
]

const roleData = {
  'Backend Developer': [['Java', 90, 85], ['SQL', 80, 85], ['Spring Boot', 85, 30], ['REST APIs', 75, 45], ['Git', 70, 75], ['Docker', 60, 20]],
  'Data Analyst': [['SQL', 90, 85], ['Power BI', 85, 80], ['Excel', 75, 78], ['Python', 80, 45], ['Tableau', 70, 60], ['Statistics', 70, 40]],
  'Full Stack Developer': [['Java', 80, 85], ['HTML', 80, 75], ['React', 85, 25], ['SQL', 75, 85], ['REST APIs', 75, 45], ['Git', 70, 75]],
}

const goalList = [
  { id: 1, t: 'Apply to 5 new jobs', tag: 'Applications', c: 'bg-sky/15 text-sky', done: true },
  { id: 2, t: 'Practise 10 interview questions', tag: 'Interviews', c: 'bg-violet/15 text-violet', done: true },
  { id: 3, t: 'Study Spring Boot for 4 hours', tag: 'Skills', c: 'bg-amber/15 text-amber', done: false },
  { id: 4, t: 'Update resume with project numbers', tag: 'Resume', c: 'bg-mint/15 text-mint', done: false },
  { id: 5, t: 'Push one commit to GitHub', tag: 'Portfolio', c: 'bg-rose/15 text-rose', done: false },
]

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'funnel', label: 'Funnel', icon: Filter },
  { id: 'skills', label: 'Skills', icon: BarChart3 },
  { id: 'goals', label: 'Weekly goals', icon: ListChecks },
]

const dropNames = ['applying to getting shortlisted', 'shortlist to interview', 'interview to offer']
const pieColors = ['#3ee6b0', '#9b8cff', '#ffc24b', '#5bc8ff']
const rate = (x, y) => (y ? Math.round((x / y) * 100) : 0)

export default function Insights() {
  const [range, setRange] = useState('30d')
  const [tab, setTab] = useState('overview')
  const [role, setRole] = useState('Backend Developer')
  const [goals, setGoals] = useState(goalList)

  const R = ranges[range]
  const [a, s, i, o] = R.funnel
  const stages = [['Applied', a, 'from-sky to-sky/50'], ['Shortlisted', s, 'from-amber to-amber/50'], ['Interview', i, 'from-violet to-violet/50'], ['Offer', o, 'from-mint to-mint/50']]
  const conv = [rate(s, a), rate(i, s), rate(o, i)]
  const worst = conv.indexOf(Math.min(...conv))

  const kpis = [
    { l: 'Response rate', v: rate(s, a) + '%', d: R.delta[0], icon: Mail, c: 'from-sky/40 border-sky/40 text-sky' },
    { l: 'Interview rate', v: rate(i, a) + '%', d: R.delta[1], icon: CalendarCheck, c: 'from-violet/40 border-violet/40 text-violet' },
    { l: 'Offer rate', v: rate(o, a) + '%', d: R.delta[2], icon: Trophy, c: 'from-mint/40 border-mint/40 text-mint' },
    { l: 'Avg reply time', v: R.days + ' days', d: R.delta[3], icon: Timer, c: 'from-amber/40 border-amber/40 text-amber' },
  ]

  const sources = baseSources.map(x => ({ s: x.s, Applied: Math.round(x.a * R.f), Interviews: Math.round(x.i * R.f), r: rate(x.i, x.a) }))
  const best = [...sources].sort((x, y) => y.r - x.r)[0]
  const outcomes = [
    { name: 'Offers', value: o },
    { name: 'Interviewed', value: i - o },
    { name: 'Shortlisted only', value: s - i },
    { name: 'No reply yet', value: a - s },
  ]

  const cards = [
    { icon: Flame, t: 'Best source', x: best.s + ' turns ' + best.r + '% of applications into interviews. Apply there first.', c: 'from-sun/30 text-sun' },
    { icon: ArrowDownRight, t: 'Biggest drop', x: 'Most people leave at ' + dropNames[worst] + ' (' + conv[worst] + '% move on).', c: 'from-rose/30 text-rose' },
    { icon: Lightbulb, t: 'Quick win', x: 'Replies take about ' + R.days + ' days. Follow up politely after 7 days.', c: 'from-amber/30 text-amber' },
  ]

  const need = roleData[role]
  const radar = need.map(([k, n, y]) => ({ k, Needed: n, You: y }))
  const gaps = [...need].sort((x, y) => (y[1] - y[2]) - (x[1] - x[2])).slice(0, 3)
  const doneCount = goals.filter(g => g.done).length
  const goalPct = Math.round((doneCount / goals.length) * 100)
  const toggleGoal = id => setGoals(l => l.map(g => (g.id === id ? { ...g, done: !g.done } : g)))

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-rose/30 via-violet/30 to-sky/30 p-7 sm:p-9">
        <div className="orb -right-10 -top-16 h-64 w-64 bg-amber" />
        <div className="orb -bottom-24 left-1/3 h-64 w-64 bg-mint" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3.5 py-1.5 text-xs font-medium text-amber backdrop-blur"><Sparkles size={14} /> Your placement analytics</span>
            <h1 className="mt-3 font-display text-4xl font-extrabold text-white sm:text-6xl">Career <span className="shimmer">insights</span></h1>
            <p className="mt-2 max-w-lg text-white/85">See what is working, where applications stall, and what to do next.</p>
          </div>
          <div className="flex gap-1.5 rounded-full border border-white/15 bg-black/30 p-1.5 backdrop-blur">
            {Object.entries(ranges).map(([id, r]) => (
              <button key={id} onClick={() => setRange(id)} className={`relative rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${range === id ? 'text-ink' : 'text-white/70 hover:text-white'}`}>
                {range === id && <motion.span layoutId="irange" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span className="relative">{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ l, v, d, icon: Icon, c }, k) => {
          const good = l === 'Avg reply time' ? d < 0 : d > 0
          return (
            <motion.div key={l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + k * 0.07 }} whileHover={{ y: -5 }} className={`rounded-3xl border bg-gradient-to-br to-panel p-5 ${c}`}>
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/25"><Icon size={22} /></span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${good ? 'bg-mint/15 text-mint' : 'bg-rose/15 text-rose'}`}>{d > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{d > 0 ? '+' : ''}{d}{l === 'Avg reply time' ? 'd' : '%'}</span>
              </div>
              <p className="mt-4 font-display text-4xl font-extrabold text-white">{v}</p>
              <p className="text-sm text-white/70">{l}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-1.5 rounded-full border border-line bg-panel p-1.5">
        {tabs.map(t => {
          const Icon = t.icon
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className={`relative flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-3 text-sm font-semibold transition ${tab === t.id ? 'text-ink' : 'text-mist hover:text-white'}`}>
              {tab === t.id && <motion.span layoutId="itab" className="absolute inset-0 rounded-full bg-gradient-to-r from-sun to-amber" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              <span className="relative flex items-center gap-2"><Icon size={16} /><span className="hidden sm:inline">{t.label}</span></span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab + range} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-4">
            {tab === 'overview' && (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                {cards.map(({ icon: Icon, t, x, c }) => (
                  <div key={t} className={`rounded-3xl border border-white/10 bg-gradient-to-br to-panel p-5 ${c}`}>
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/25"><Icon size={22} /></span>
                    <p className="mt-3 font-display text-lg font-bold text-white">{t}</p>
                    <p className="mt-1 text-sm text-white/80">{x}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-3xl border border-line bg-panel/80 p-6 lg:col-span-2">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display text-xl font-bold text-white">Applications and interviews</h2>
                    <div className="flex gap-4 text-xs text-mist">
                      <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-amber" />Applied</span>
                      <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-mint" />Interviews</span>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={R.trend} margin={{ left: -20, right: 8, top: 8 }}>
                        <defs>
                          <linearGradient id="ia" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffc24b" stopOpacity={0.55} /><stop offset="100%" stopColor="#ffc24b" stopOpacity={0} /></linearGradient>
                          <linearGradient id="ii" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3ee6b0" stopOpacity={0.5} /><stop offset="100%" stopColor="#3ee6b0" stopOpacity={0} /></linearGradient>
                        </defs>
                        <CartesianGrid stroke="#252d57" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="m" stroke="#a9b1d6" tickLine={false} axisLine={false} fontSize={12} />
                        <YAxis stroke="#a9b1d6" tickLine={false} axisLine={false} fontSize={12} />
                        <Tooltip contentStyle={tip} />
                        <Area type="monotone" dataKey="a" name="Applied" stroke="#ffc24b" strokeWidth={3} fill="url(#ia)" />
                        <Area type="monotone" dataKey="i" name="Interviews" stroke="#3ee6b0" strokeWidth={3} fill="url(#ii)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-3xl border border-line bg-panel/80 p-6">
                  <h2 className="font-display text-xl font-bold text-white">Where applications end up</h2>
                  <div className="relative mx-auto mt-2 h-44 w-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={outcomes} dataKey="value" innerRadius={52} outerRadius={78} paddingAngle={4} stroke="none">
                          {outcomes.map((x, n) => <Cell key={x.name} fill={pieColors[n]} />)}
                        </Pie>
                        <Tooltip contentStyle={tip} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-3xl font-extrabold text-white">{a}</span>
                      <span className="text-xs text-mist">applied</span>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {outcomes.map((x, n) => <p key={x.name} className="flex items-center justify-between text-xs text-mist"><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: pieColors[n] }} />{x.name}</span><b className="text-white">{x.value}</b></p>)}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-line bg-panel/80 p-6">
                <h2 className="mb-1 font-display text-xl font-bold text-white">Which source works best</h2>
                <p className="mb-3 text-xs text-mist">Applications and interviews by where you found the job.</p>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sources} margin={{ left: -20, right: 8 }}>
                      <CartesianGrid stroke="#252d57" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="s" stroke="#a9b1d6" tickLine={false} axisLine={false} fontSize={12} />
                      <YAxis stroke="#a9b1d6" tickLine={false} axisLine={false} fontSize={12} />
                      <Tooltip contentStyle={tip} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Bar dataKey="Applied" fill="#5bc8ff" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="Interviews" fill="#ffc24b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {tab === 'funnel' && (
            <div className="rounded-3xl border border-line bg-panel/80 p-6 sm:p-8">
              <h2 className="font-display text-2xl font-extrabold text-white">Your hiring funnel</h2>
              <p className="mb-6 text-sm text-mist">How many applications move to each stage, and where they drop off.</p>
              <div className="space-y-3">
                {stages.map(([name, n, grad], k) => (
                  <div key={name}>
                    {k > 0 && (
                      <div className="my-2 flex justify-center">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold ${k - 1 === worst ? 'bg-rose/15 text-rose' : 'bg-white/10 text-white/80'}`}><ArrowDownRight size={14} />{conv[k - 1]}% move on{k - 1 === worst ? ' · biggest drop' : ''}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <span className="w-28 shrink-0 text-sm font-semibold text-white">{name}</span>
                      <div className="h-12 flex-1 rounded-2xl bg-line/60">
                        <motion.div className={`flex h-12 items-center justify-end rounded-2xl bg-gradient-to-r px-4 font-display text-xl font-extrabold text-ink ${grad}`} initial={{ width: 0 }} animate={{ width: Math.max(rate(n, a), 12) + '%' }} transition={{ duration: 0.9, delay: k * 0.12 }}>{n}</motion.div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex items-start gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-violet/25 via-sun/15 to-panel p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black/25 text-amber"><Lightbulb size={22} /></span>
                <p className="text-sm text-white/90">Your weakest step is <b>{dropNames[worst]}</b>. {worst === 0 ? 'Tailor your resume to each job post and add numbers to your projects.' : worst === 1 ? 'Prepare short answers about your projects and practise your skills out loud.' : 'Do a mock interview and research the company before the final round.'}</p>
              </div>
            </div>
          )}
          {tab === 'skills' && (
            <>
              <div className="flex flex-wrap gap-2">
                {Object.keys(roleData).map(r => (
                  <button key={r} onClick={() => setRole(r)} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${role === r ? 'border-transparent bg-gradient-to-r from-sun to-amber text-ink' : 'border-line text-mist hover:border-mist hover:text-white'}`}>{r}</button>
                ))}
              </div>
              <div className="grid gap-4 lg:grid-cols-5">
                <div className="rounded-3xl border border-line bg-panel/80 p-6 lg:col-span-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="font-display text-xl font-bold text-white">You vs the job</h2>
                    <div className="flex gap-4 text-xs text-mist">
                      <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-sky" />Needed</span>
                      <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-amber" />You</span>
                    </div>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radar} outerRadius="72%">
                        <PolarGrid stroke="#252d57" />
                        <PolarAngleAxis dataKey="k" tick={{ fill: '#a9b1d6', fontSize: 12 }} />
                        <Radar dataKey="Needed" stroke="#5bc8ff" strokeWidth={2} fill="#5bc8ff" fillOpacity={0.15} />
                        <Radar dataKey="You" stroke="#ffc24b" strokeWidth={3} fill="#ffc24b" fillOpacity={0.3} />
                        <Tooltip contentStyle={tip} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="rounded-3xl border border-sun/30 bg-gradient-to-br from-sun/20 to-panel p-6 lg:col-span-2">
                  <h2 className="mb-1 flex items-center gap-2 font-display text-xl font-bold text-white"><Target size={20} className="text-sun" />Biggest gaps</h2>
                  <p className="mb-5 text-xs text-white/70">Close these first to lift your match.</p>
                  <div className="space-y-5">
                    {gaps.map(([k, n, y], n2) => (
                      <div key={k}>
                        <div className="mb-1.5 flex justify-between text-sm"><span className="font-semibold text-white">{n2 + 1}. {k}</span><span className="text-rose">-{n - y} points</span></div>
                        <div className="relative h-2.5 rounded-full bg-black/25">
                          <div className="absolute inset-y-0 left-0 rounded-full bg-sky/50" style={{ width: n + '%' }} />
                          <motion.div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sun to-amber" initial={{ width: 0 }} animate={{ width: y + '%' }} transition={{ duration: 0.9, delay: n2 * 0.15 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'goals' && (
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="flex flex-col items-center rounded-3xl border border-line bg-gradient-to-br from-panel via-panel to-mint/20 p-6 text-center">
                <h2 className="self-start font-display text-xl font-bold text-white">This week</h2>
                <div className="relative mt-4 h-44 w-44">
                  <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#252d57" strokeWidth="9" />
                    <motion.circle cx="60" cy="60" r="54" fill="none" stroke="url(#ig)" strokeWidth="9" strokeLinecap="round" strokeDasharray={C} animate={{ strokeDashoffset: C * (1 - goalPct / 100) }} initial={{ strokeDashoffset: C }} transition={{ duration: 0.8 }} />
                    <defs><linearGradient id="ig" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3ee6b0" /><stop offset="100%" stopColor="#ffc24b" /></linearGradient></defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-5xl font-extrabold text-white">{goalPct}%</span>
                    <span className="text-xs text-mist">{doneCount} of {goals.length} done</span>
                  </div>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-sun/15 px-4 py-2 text-sm font-semibold text-sun"><Flame size={16} />5-day streak</span>
              </div>
              <div className="space-y-3 lg:col-span-2">
                {goals.map(g => (
                  <button key={g.id} onClick={() => toggleGoal(g.id)} className={`flex w-full items-center gap-4 rounded-3xl border p-5 text-left transition hover:-translate-y-0.5 ${g.done ? 'border-mint/30 bg-mint/10' : 'border-line bg-panel/80 hover:border-mist'}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${g.done ? 'bg-mint text-ink' : 'bg-line text-transparent'}`}><Check size={18} /></span>
                    <span className="min-w-0 flex-1">
                      <span className={`block font-semibold ${g.done ? 'text-white/60 line-through' : 'text-white'}`}>{g.t}</span>
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${g.c}`}>{g.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}