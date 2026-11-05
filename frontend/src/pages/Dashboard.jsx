import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import {
  Briefcase, BadgeCheck, CalendarClock, Trophy, ArrowUpRight, Video,
  Lightbulb, Clock, AlertTriangle, Database, Sparkles,
} from 'lucide-react'
import { api, getUser } from '../api.js'
import { fade, tip, StatCards, ScoreCard, StatusDonut } from './DashboardCards.jsx'

const badge = {
  Applied: 'bg-sky/15 text-sky',
  Shortlisted: 'bg-amber/15 text-amber',
  Interview: 'bg-violet/15 text-violet',
  Offer: 'bg-mint/15 text-mint',
  Rejected: 'bg-rose/15 text-rose',
}
const colors = { Applied: '#5bc8ff', Shortlisted: '#ffc24b', Interview: '#9b8cff', Offer: '#3ee6b0', Rejected: '#ff6b9a' }
const avatar = ['from-sky to-violet', 'from-sun to-amber', 'from-mint to-sky', 'from-violet to-rose', 'from-amber to-mint']
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0)
const dateFmt = s => new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
const timeFmt = s => s.slice(11, 16)

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const user = getUser()
  const first = ((user && user.fullName) || 'there').split(' ')[0]

  useEffect(() => {
    let alive = true
    api('/api/stats')
      .then(d => { if (alive) setData(d) })
      .catch(e => { if (alive) setError(e.message) })
    return () => { alive = false }
  }, [])

  if (error) {
    return (
      <p className="mx-auto flex max-w-6xl items-center gap-3 rounded-2xl border border-rose/30 bg-rose/10 px-5 py-4 text-sm text-rose">
        <AlertTriangle size={18} className="shrink-0" />{error}
      </p>
    )
  }
  if (!data) {
    return (
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-4 rounded-3xl border border-line bg-panel/60 py-20">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-amber" />
        <p className="font-display text-lg font-bold text-white">Loading your dashboard...</p>
      </div>
    )
  }

  const total = data.total
  const s = data.byStatus
  const status = Object.keys(colors).map(k => ({ name: k, value: s[k] || 0, color: colors[k] }))
  const progressed = (s.Shortlisted || 0) + (s.Interview || 0) + (s.Offer || 0)
  const activity = Math.round((Math.min(total, 10) / 10) * 40)
  const progress = Math.round(pct(progressed, total) * 0.3)
  const prep = Math.round(data.prepPercent * 0.3)
  const score = activity + progress + prep
  const parts = [
    { t: 'Activity', v: pct(activity, 40), c: 'from-sky to-sky/60' },
    { t: 'Progress', v: pct(progress, 30), c: 'from-amber to-amber/60' },
    { t: 'Interview prep', v: pct(prep, 30), c: 'from-mint to-mint/60' },
  ]

  const cards = [
    { label: 'Applications', value: total, icon: Briefcase, delta: data.thisMonth + ' this month', grad: 'from-sky/40 via-sky/10 to-panel', border: 'border-sky/40', text: 'text-sky', color: '#5bc8ff', data: data.monthly.map(m => ({ v: m.applied })) },
    { label: 'Shortlisted', value: s.Shortlisted || 0, icon: BadgeCheck, delta: pct(s.Shortlisted || 0, total) + '% of all', grad: 'from-amber/40 via-amber/10 to-panel', border: 'border-amber/40', text: 'text-amber', color: '#ffc24b', share: pct(s.Shortlisted || 0, total) },
    { label: 'Interviews', value: data.interviewsTotal, icon: CalendarClock, delta: data.upcomingCount + ' upcoming', grad: 'from-violet/40 via-violet/10 to-panel', border: 'border-violet/40', text: 'text-violet', color: '#9b8cff', data: data.monthly.map(m => ({ v: m.interviews })) },
    { label: 'Offers', value: s.Offer || 0, icon: Trophy, delta: pct(s.Offer || 0, total) + '% of all', grad: 'from-mint/40 via-mint/10 to-panel', border: 'border-mint/40', text: 'text-mint', color: '#3ee6b0', share: pct(s.Offer || 0, total) },
  ]

  let move = { t: 'Find your skill gaps', x: 'Paste a job description and see what to learn next.', to: '/match', cta: 'Check job match' }
  if (total === 0) move = { t: 'Add your first application', x: 'Your dashboard fills up as you track applications.', to: '/applications', cta: 'Add application' }
  else if (data.upcoming.length && data.prepPercent < 100) move = { t: 'Prepare for ' + data.upcoming[0].company, x: 'Tick off your prep checklist before the interview.', to: '/interviews', cta: 'Open interviews' }

  const banner = data.upcomingCount
    ? 'You have ' + data.upcomingCount + ' upcoming interview' + (data.upcomingCount > 1 ? 's' : '') + '. Good luck!'
    : total ? 'No interviews scheduled yet. Keep applying!' : 'Add your first application to get started.'

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div {...fade(0)} className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sun/35 via-violet/25 to-sky/25 p-7 sm:p-9">
        <div className="orb -right-10 -top-16 h-64 w-64 bg-amber" />
        <div className="orb -bottom-20 left-1/3 h-64 w-64 bg-mint" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3.5 py-1.5 text-xs font-medium text-amber backdrop-blur"><Database size={14} /> Live from your database</span>
            <h1 className="mt-4 font-display text-4xl font-extrabold text-white sm:text-5xl">Welcome back <span className="shimmer">{first}</span> 👋</h1>
            <p className="mt-2 max-w-md text-white/80">{banner}</p>
          </div>
          <Link to="/applications" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink shadow-xl transition hover:scale-[1.04]">
            Add application <ArrowUpRight size={16} />
          </Link>
        </div>
      </motion.div>

      <StatCards cards={cards} />

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div {...fade(5)} className="rounded-3xl border border-line bg-panel/80 p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white">Last 6 months</h2>
            <div className="flex gap-4 text-xs text-mist">
              <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-amber" />Applied</span>
              <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-mint" />Interviews</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthly} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffc24b" stopOpacity={0.55} /><stop offset="100%" stopColor="#ffc24b" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3ee6b0" stopOpacity={0.5} /><stop offset="100%" stopColor="#3ee6b0" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="#252d57" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" stroke="#a9b1d6" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#a9b1d6" tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={tip} />
                <Area type="monotone" dataKey="applied" name="Applied" stroke="#ffc24b" strokeWidth={3} fill="url(#ga)" />
                <Area type="monotone" dataKey="interviews" name="Interviews" stroke="#3ee6b0" strokeWidth={3} fill="url(#gi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        <ScoreCard score={score} parts={parts} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StatusDonut status={status} total={total} />

        <motion.div {...fade(8)} className="rounded-3xl border border-line bg-panel/80 p-6">
          <h2 className="mb-4 font-display text-xl font-bold text-white">Upcoming interviews</h2>
          <ul className="space-y-3">
            {data.upcoming.map(u => (
              <li key={u.id} className="flex items-center gap-3 rounded-2xl border border-line bg-ink/50 p-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet/20 text-violet"><Video size={20} /></span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{u.company}</p>
                  <p className="truncate text-xs text-mist">{u.roundType} · {u.mode}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-amber"><Clock size={12} />{dateFmt(u.interviewAt)}, {timeFmt(u.interviewAt)}</p>
                </div>
              </li>
            ))}
            {data.upcoming.length === 0 && <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-mist">No upcoming interviews.</p>}
          </ul>
        </motion.div>

        <motion.div {...fade(9)} className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet/40 via-sun/25 to-amber/25 p-6">
          <div className="orb -right-8 -top-8 h-44 w-44 bg-amber" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-black/25 text-amber"><Lightbulb size={24} /></span>
          <h2 className="relative mt-4 font-display text-2xl font-extrabold text-white">{move.t}</h2>
          <p className="relative mt-2 text-sm text-white/80">{move.x}</p>
          <Link to={move.to} className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:scale-[1.04]">
            <Sparkles size={15} /> {move.cta}
          </Link>
        </motion.div>
      </div>

      <motion.div {...fade(10)} className="rounded-3xl border border-line bg-panel/80 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-white">Recent applications</h2>
          <Link to="/applications" className="text-sm text-amber hover:underline">View all</Link>
        </div>
        <ul className="divide-y divide-line">
          {data.recent.map((r, i) => (
            <li key={r.id} className="flex items-center gap-4 py-3.5">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-display text-lg font-extrabold text-ink ${avatar[i % avatar.length]}`}>{r.company[0].toUpperCase()}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">{r.company}</p>
                <p className="truncate text-sm text-mist">{r.role}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${badge[r.status]}`}>{r.status}</span>
              <span className="hidden w-24 text-right text-xs text-mist sm:block">{new Date(r.appliedOn + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </li>
          ))}
          {data.recent.length === 0 && <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-mist">No applications yet.</p>}
        </ul>
      </motion.div>
    </div>
  )
}