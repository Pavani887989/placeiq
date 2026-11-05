import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase, Mail, CalendarCheck, Trophy, LayoutGrid, Filter, Video, ListChecks,
  Sparkles, AlertTriangle,
} from 'lucide-react'
import { api } from '../api.js'
import { OverviewTab, FunnelTab, InterviewsTab, GoalsTab } from './InsightsTabs.jsx'

const ranges = [['30', 'Last 30 days'], ['90', 'Last 3 months'], ['all', 'All time']]
const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'funnel', label: 'Funnel', icon: Filter },
  { id: 'interviews', label: 'Interviews', icon: Video },
  { id: 'goals', label: 'Weekly goals', icon: ListChecks },
]
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0)

export default function Insights() {
  const [range, setRange] = useState('30')
  const [tab, setTab] = useState('overview')
  const [d, setD] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    api('/api/insights?range=' + range)
      .then(x => { if (alive) { setD(x); setError('') } })
      .catch(e => { if (alive) setError(e.message) })
    return () => { alive = false }
  }, [range])

  const f = d ? d.funnel : [0, 0, 0, 0]
  const kpis = [
    { l: 'Applications', v: f[0], icon: Briefcase, c: 'from-sky/40 border-sky/40 text-sky' },
    { l: 'Got shortlisted', v: pct(f[1], f[0]) + '%', icon: Mail, c: 'from-amber/40 border-amber/40 text-amber' },
    { l: 'Shortlist to interview', v: pct(f[2], f[1]) + '%', icon: CalendarCheck, c: 'from-violet/40 border-violet/40 text-violet' },
    { l: 'Interview to offer', v: pct(f[3], f[2]) + '%', icon: Trophy, c: 'from-mint/40 border-mint/40 text-mint' },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-rose/30 via-violet/30 to-sky/30 p-7 sm:p-9">
        <div className="orb -right-10 -top-16 h-64 w-64 bg-amber" />
        <div className="orb -bottom-24 left-1/3 h-64 w-64 bg-mint" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3.5 py-1.5 text-xs font-medium text-amber backdrop-blur"><Sparkles size={14} /> Calculated from your own data</span>
            <h1 className="mt-3 font-display text-4xl font-extrabold text-white sm:text-6xl">Career <span className="shimmer">insights</span></h1>
            <p className="mt-2 max-w-lg text-white/85">See what is working, where applications stall, and what to do next.</p>
          </div>
          <div className="flex gap-1.5 rounded-full border border-white/15 bg-black/30 p-1.5 backdrop-blur">
            {ranges.map(([id, label]) => (
              <button key={id} onClick={() => setRange(id)} className={`relative rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${range === id ? 'text-ink' : 'text-white/70 hover:text-white'}`}>
                {range === id && <motion.span layoutId="irange" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {error && (
        <p className="flex items-center gap-3 rounded-2xl border border-rose/30 bg-rose/10 px-5 py-4 text-sm text-rose"><AlertTriangle size={18} className="shrink-0" />{error}</p>
      )}

      {!d && !error && (
        <div className="flex items-center justify-center gap-4 rounded-3xl border border-line bg-panel/60 py-16">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-amber" />
          <p className="font-display text-lg font-bold text-white">Loading your insights...</p>
        </div>
      )}

      {d && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map(({ l, v, icon: Icon, c }, k) => (
              <motion.div key={l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + k * 0.07 }} whileHover={{ y: -5 }} className={`rounded-3xl border bg-gradient-to-br to-panel p-5 ${c}`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/25"><Icon size={22} /></span>
                <p className="mt-4 font-display text-4xl font-extrabold text-white">{v}</p>
                <p className="text-sm text-white/70">{l}</p>
              </motion.div>
            ))}
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
              {tab === 'overview' && <OverviewTab d={d} />}
              {tab === 'funnel' && <FunnelTab d={d} />}
              {tab === 'interviews' && <InterviewsTab d={d} />}
              {tab === 'goals' && <GoalsTab d={d} />}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  )
}