import { useEffect, useState } from 'react'
import { motion, animate } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  Briefcase, BadgeCheck, CalendarClock, Trophy, Sparkles, ArrowUpRight,
  TrendingUp, Flame, Video, Lightbulb, Clock,
} from 'lucide-react'

const C = 2 * Math.PI * 54

const stats = [
  { label: 'Applications', value: 24, icon: Briefcase, delta: '+6 this month', grad: 'from-sky/40 via-sky/10 to-panel', border: 'border-sky/40', text: 'text-sky', color: '#5bc8ff', data: [2, 4, 3, 6, 8, 7, 12] },
  { label: 'Shortlisted', value: 9, icon: BadgeCheck, delta: '37% rate', grad: 'from-amber/40 via-amber/10 to-panel', border: 'border-amber/40', text: 'text-amber', color: '#ffc24b', data: [1, 1, 2, 3, 3, 5, 6] },
  { label: 'Interviews', value: 5, icon: CalendarClock, delta: '2 upcoming', grad: 'from-violet/40 via-violet/10 to-panel', border: 'border-violet/40', text: 'text-violet', color: '#9b8cff', data: [0, 1, 1, 2, 2, 3, 5] },
  { label: 'Offers', value: 2, icon: Trophy, delta: '40% of interviews', grad: 'from-mint/40 via-mint/10 to-panel', border: 'border-mint/40', text: 'text-mint', color: '#3ee6b0', data: [0, 0, 0, 1, 1, 1, 2] },
]

const monthly = [
  { m: 'Jun', applied: 2, interviews: 0 },
  { m: 'Jul', applied: 4, interviews: 1 },
  { m: 'Aug', applied: 6, interviews: 1 },
  { m: 'Sep', applied: 9, interviews: 2 },
  { m: 'Oct', applied: 14, interviews: 4 },
  { m: 'Nov', applied: 18, interviews: 5 },
]

const status = [
  { name: 'Applied', value: 8, color: '#5bc8ff' },
  { name: 'Shortlisted', value: 4, color: '#ffc24b' },
  { name: 'Interview', value: 3, color: '#9b8cff' },
  { name: 'Offer', value: 2, color: '#3ee6b0' },
  { name: 'Rejected', value: 7, color: '#ff6b9a' },
]

const breakdown = [
  { t: 'Skills', v: 78, c: 'from-sky to-sky/60' },
  { t: 'Projects', v: 85, c: 'from-mint to-mint/60' },
  { t: 'Certificates', v: 90, c: 'from-amber to-amber/60' },
  { t: 'Activity', v: 70, c: 'from-rose to-rose/60' },
]

const skills = [
  { t: 'Java', v: 90, c: 'from-mint to-mint/50' },
  { t: 'SQL', v: 85, c: 'from-sky to-sky/50' },
  { t: 'Power BI', v: 80, c: 'from-amber to-amber/50' },
  { t: 'Spring Boot', v: 35, c: 'from-sun to-sun/50' },
  { t: 'Docker', v: 20, c: 'from-rose to-rose/50' },
]

const upcoming = [
  { co: 'Helio Labs', round: 'Technical round', when: 'Tomorrow, 10:00 AM', chip: 'bg-violet/20 text-violet' },
  { co: 'Orbit Pay', round: 'HR round', when: 'Friday, 2:30 PM', chip: 'bg-sky/20 text-sky' },
  { co: 'Lumen', round: 'Offer call', when: 'Monday, 11:00 AM', chip: 'bg-mint/20 text-mint' },
]

const recent = [
  { co: 'Northwind', role: 'Java Developer', st: 'Applied', date: 'Today' },
  { co: 'Helio Labs', role: 'Backend Developer', st: 'Interview', date: 'Yesterday' },
  { co: 'Orbit Pay', role: 'Data Analyst', st: 'Shortlisted', date: '2 days ago' },
  { co: 'Lumen', role: 'Full Stack Developer', st: 'Offer', date: '4 days ago' },
  { co: 'Kestrel', role: 'SQL Developer', st: 'Rejected', date: '6 days ago' },
]

const badge = {
  Applied: 'bg-sky/15 text-sky',
  Shortlisted: 'bg-amber/15 text-amber',
  Interview: 'bg-violet/15 text-violet',
  Offer: 'bg-mint/15 text-mint',
  Rejected: 'bg-rose/15 text-rose',
}

const avatar = ['from-sky to-violet', 'from-sun to-amber', 'from-mint to-sky', 'from-violet to-rose', 'from-amber to-mint']

function Count({ to }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const c = animate(0, to, { duration: 1.4, onUpdate: v => setN(Math.round(v)) })
    return () => c.stop()
  }, [to])
  return <>{n}</>
}

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: i * 0.07 },
})

function Bar({ t, v, c, delay = 0 }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="text-mist">{t}</span>
        <span className="font-semibold text-white">{v}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-line/70">
        <motion.div className={`h-2.5 rounded-full bg-gradient-to-r ${c}`} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 1, delay: 0.3 + delay }} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const score = 82
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div {...fade(0)} className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sun/35 via-violet/25 to-sky/25 p-7 sm:p-9">
        <div className="orb -right-10 -top-16 h-64 w-64 bg-amber" />
        <div className="orb -bottom-20 left-1/3 h-64 w-64 bg-mint" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3.5 py-1.5 text-xs font-medium text-amber backdrop-blur">
              <Flame size={14} /> 5-day activity streak
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold text-white sm:text-5xl">
              Welcome back <span className="shimmer">Pavani</span> 👋
            </h1>
            <p className="mt-2 max-w-md text-white/80">You have 2 interviews coming up. Your readiness score rose by 6 points this week.</p>
          </div>
          <Link to="/applications" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink shadow-xl transition hover:scale-[1.04]">
            Add application <ArrowUpRight size={16} />
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, delta, grad, border, text, color, data }, i) => (
          <motion.div key={label} {...fade(i + 1)} whileHover={{ y: -5 }} className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br p-5 ${grad} ${border}`}>
            <div className="flex items-center justify-between">
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-black/25 ${text}`}><Icon size={22} /></span>
              <span className={`flex items-center gap-1 text-xs ${text}`}><TrendingUp size={14} />{delta}</span>
            </div>
            <p className="mt-4 font-display text-5xl font-extrabold text-white"><Count to={value} /></p>
            <p className="text-sm text-white/70">{label}</p>
            <div className="mt-2 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.map(v => ({ v }))}>
                  <Area type="monotone" dataKey="v" stroke={color} fill={color} fillOpacity={0.22} strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div {...fade(5)} className="rounded-3xl border border-line bg-panel/80 p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white">Applications over time</h2>
            <div className="flex gap-4 text-xs text-mist">
              <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-amber" />Applied</span>
              <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-mint" />Interviews</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffc24b" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#ffc24b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3ee6b0" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#3ee6b0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#252d57" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" stroke="#a9b1d6" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#a9b1d6" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip contentStyle={{ background: '#121835', border: '1px solid #252d57', borderRadius: 12, color: '#fff' }} />
                <Area type="monotone" dataKey="applied" stroke="#ffc24b" strokeWidth={3} fill="url(#ga)" />
                <Area type="monotone" dataKey="interviews" stroke="#3ee6b0" strokeWidth={3} fill="url(#gi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div {...fade(6)} className="rounded-3xl border border-line bg-gradient-to-br from-panel via-panel to-sun/25 p-6">
          <h2 className="font-display text-xl font-bold text-white">Readiness score</h2>
          <div className="relative mx-auto mt-3 h-40 w-40">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#252d57" strokeWidth="9" />
              <motion.circle
                cx="60" cy="60" r="54" fill="none" stroke="url(#dr)" strokeWidth="9" strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: C }}
                animate={{ strokeDashoffset: C * (1 - score / 100) }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="dr" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ff7a59" />
                  <stop offset="100%" stopColor="#ffc24b" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-5xl font-extrabold sun-text"><Count to={score} /></span>
              <span className="text-xs text-mist">out of 100</span>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {breakdown.map((b, i) => <Bar key={b.t} {...b} delay={i * 0.12} />)}
          </div>
        </motion.div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div {...fade(7)} className="rounded-3xl border border-line bg-panel/80 p-6">
          <h2 className="font-display text-xl font-bold text-white">Application status</h2>
          <div className="relative mx-auto mt-2 h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={status} dataKey="value" innerRadius={58} outerRadius={84} paddingAngle={4} stroke="none">
                  {status.map(s => <Cell key={s.name} fill={s.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#121835', border: '1px solid #252d57', borderRadius: 12, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-extrabold text-white">24</span>
              <span className="text-xs text-mist">total</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
            {status.map(s => (
              <span key={s.name} className="flex items-center gap-1.5 text-xs text-mist">
                <i className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />{s.name} {s.value}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div {...fade(8)} className="rounded-3xl border border-line bg-panel/80 p-6">
          <h2 className="mb-5 font-display text-xl font-bold text-white">Skill strength</h2>
          <div className="space-y-4">
            {skills.map((s, i) => <Bar key={s.t} {...s} delay={i * 0.1} />)}
          </div>
        </motion.div>

        <motion.div {...fade(9)} className="rounded-3xl border border-line bg-panel/80 p-6">
          <h2 className="mb-4 font-display text-xl font-bold text-white">Upcoming interviews</h2>
          <ul className="space-y-3">
            {upcoming.map(u => (
              <li key={u.co} className="flex items-center gap-3 rounded-2xl border border-line bg-ink/50 p-3.5">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${u.chip}`}><Video size={20} /></span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{u.co}</p>
                  <p className="truncate text-xs text-mist">{u.round}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-amber"><Clock size={12} />{u.when}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div {...fade(10)} className="rounded-3xl border border-line bg-panel/80 p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white">Recent applications</h2>
            <Link to="/applications" className="text-sm text-amber hover:underline">View all</Link>
          </div>
          <ul className="divide-y divide-line">
            {recent.map((r, i) => (
              <li key={r.co} className="flex items-center gap-4 py-3.5">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-display text-lg font-extrabold text-ink ${avatar[i % avatar.length]}`}>
                  {r.co[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{r.co}</p>
                  <p className="truncate text-sm text-mist">{r.role}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${badge[r.st]}`}>{r.st}</span>
                <span className="hidden w-24 text-right text-xs text-mist sm:block">{r.date}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...fade(11)} className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet/40 via-sun/25 to-amber/25 p-6">
          <div className="orb -right-8 -top-8 h-44 w-44 bg-amber" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-black/25 text-amber"><Lightbulb size={24} /></span>
          <h2 className="relative mt-4 font-display text-2xl font-extrabold text-white">Your next best move</h2>
          <p className="relative mt-2 text-sm text-white/80">
            Learn <span className="font-semibold text-amber">Spring Boot</span> to raise your backend match from 71% to about 86% and add roughly 8 points to your score.
          </p>
          <Link to="/match" className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:scale-[1.04]">
            <Sparkles size={15} /> Check job match
          </Link>
        </motion.div>
      </div>
    </div>
  )
}