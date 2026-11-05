import { motion } from 'framer-motion'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar,
} from 'recharts'
import { ArrowDownRight, Lightbulb, Flame, Check, Clock, AlertTriangle, Target } from 'lucide-react'
import { C, tip, StatusDonut } from './DashboardCards.jsx'

const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0)
const colors = { Applied: '#5bc8ff', Shortlisted: '#ffc24b', Interview: '#9b8cff', Offer: '#3ee6b0', Rejected: '#ff6b9a' }
const stageNames = ['applying to getting shortlisted', 'shortlist to interview', 'interview to offer']
const stageGrads = ['from-sky to-sky/50', 'from-amber to-amber/50', 'from-violet to-violet/50', 'from-mint to-mint/50']
const stageLabels = ['Applied', 'Shortlisted', 'Interview', 'Offer']

function conversions(f) {
  return [pct(f[1], f[0]), pct(f[2], f[1]), pct(f[3], f[2])]
}

function weakest(f) {
  const rates = conversions(f)
  let idx = -1
  for (let k = 0; k < 3; k++) {
    if (f[k] > 0 && (idx === -1 || rates[k] < rates[idx])) idx = k
  }
  return idx
}

export function OverviewTab({ d }) {
  const modes = d.byMode.filter(m => m.applied > 0).map(m => ({ ...m, r: pct(m.progressed, m.applied) }))
  const best = [...modes].sort((a, b) => b.r - a.r)[0]
  const w = weakest(d.funnel)
  const status = Object.keys(colors).map(k => ({ name: k, value: d.byStatus[k] || 0, color: colors[k] }))

  const cards = [
    { icon: Flame, t: 'Best work mode', c: 'from-sun/30 text-sun', x: best ? best.mode + ' roles move ahead ' + best.r + '% of the time. Apply there first.' : 'Add applications to see which work mode works best for you.' },
    { icon: ArrowDownRight, t: 'Biggest drop', c: 'from-rose/30 text-rose', x: w >= 0 ? 'Most applications stall at ' + stageNames[w] + ' (' + conversions(d.funnel)[w] + '% move on).' : 'Not enough data yet.' },
    { icon: Lightbulb, t: 'Quick win', c: 'from-amber/30 text-amber', x: d.stale > 0 ? d.stale + ' application' + (d.stale > 1 ? 's have' : ' has') + ' sat at Applied for over a week. Send a polite follow-up.' : 'No stale applications. Keep your board moving.' },
  ]

  return (
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
          <h2 className="mb-4 font-display text-xl font-bold text-white">Last 6 months</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={d.monthly} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="ia" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffc24b" stopOpacity={0.55} /><stop offset="100%" stopColor="#ffc24b" stopOpacity={0} /></linearGradient>
                  <linearGradient id="ii" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3ee6b0" stopOpacity={0.5} /><stop offset="100%" stopColor="#3ee6b0" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="#252d57" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" stroke="#a9b1d6" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#a9b1d6" tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={tip} />
                <Area type="monotone" dataKey="applied" name="Applied" stroke="#ffc24b" strokeWidth={3} fill="url(#ia)" />
                <Area type="monotone" dataKey="interviews" name="Interviews" stroke="#3ee6b0" strokeWidth={3} fill="url(#ii)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <StatusDonut status={status} total={d.total} />
      </div>

      <div className="rounded-3xl border border-line bg-panel/80 p-6">
        <h2 className="mb-1 font-display text-xl font-bold text-white">Which work mode works best</h2>
        <p className="mb-3 text-xs text-mist">Applications, and how many moved past the first stage.</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={d.byMode} margin={{ left: -20, right: 8 }}>
              <CartesianGrid stroke="#252d57" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mode" stroke="#a9b1d6" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#a9b1d6" tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={tip} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="applied" name="Applied" fill="#5bc8ff" radius={[8, 8, 0, 0]} />
              <Bar dataKey="progressed" name="Moved ahead" fill="#ffc24b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

export function FunnelTab({ d }) {
  const f = d.funnel
  const rates = conversions(f)
  const w = weakest(f)
  const advice = w === 0 ? 'Tailor your resume to each job post and add numbers to your projects.' : w === 1 ? 'Prepare short answers about your projects and practise your skills out loud.' : 'Do a mock interview and research the company before the final round.'
  return (
    <div className="rounded-3xl border border-line bg-panel/80 p-6 sm:p-8">
      <h2 className="font-display text-2xl font-extrabold text-white">Your hiring funnel</h2>
      <p className="mb-6 text-sm text-mist">How many applications reach each stage, and where they drop off.</p>
      <div className="space-y-3">
        {f.map((n, k) => (
          <div key={stageLabels[k]}>
            {k > 0 && (
              <div className="my-2 flex justify-center">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold ${k - 1 === w ? 'bg-rose/15 text-rose' : 'bg-white/10 text-white/80'}`}>
                  <ArrowDownRight size={14} />{rates[k - 1]}% move on{k - 1 === w ? ' · biggest drop' : ''}
                </span>
              </div>
            )}
            <div className="flex items-center gap-4">
              <span className="w-28 shrink-0 text-sm font-semibold text-white">{stageLabels[k]}</span>
              <div className="h-12 flex-1 rounded-2xl bg-line/60">
                <motion.div className={`flex h-12 items-center justify-end rounded-2xl bg-gradient-to-r px-4 font-display text-xl font-extrabold text-ink ${stageGrads[k]}`} initial={{ width: 0 }} animate={{ width: Math.max(pct(n, f[0]), 12) + '%' }} transition={{ duration: 0.9, delay: k * 0.12 }}>{n}</motion.div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {f[0] > 0 && w >= 0 && (
        <div className="mt-7 flex items-start gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-violet/25 via-sun/15 to-panel p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black/25 text-amber"><Lightbulb size={22} /></span>
          <p className="text-sm text-white/90">Your weakest step is <b>{stageNames[w]}</b>. {advice}</p>
        </div>
      )}
      {f[0] === 0 && <p className="mt-6 rounded-2xl border border-dashed border-line p-6 text-center text-sm text-mist">No applications in this period yet.</p>}
    </div>
  )
}

export function InterviewsTab({ d }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-3xl border border-line bg-panel/80 p-6">
        <h2 className="mb-4 font-display text-xl font-bold text-white">Interviews by round</h2>
        <div className="space-y-4">
          {d.byRound.map(r => (
            <div key={r.round}>
              <div className="mb-1.5 flex justify-between text-sm"><span className="text-mist">{r.round}</span><span className="font-semibold text-white">{r.done} done of {r.total}</span></div>
              <div className="h-3 rounded-full bg-line/70"><motion.div className="h-3 rounded-full bg-gradient-to-r from-violet to-sky" initial={{ width: 0 }} animate={{ width: pct(r.done, r.total) + '%' }} transition={{ duration: 0.9 }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-3xl border border-mint/30 bg-gradient-to-br from-mint/20 to-panel p-6">
          <p className="font-display text-4xl font-extrabold text-white">{d.upcomingCount}</p>
          <p className="text-sm text-white/70">upcoming interviews, {d.prepPercent}% prepared</p>
        </div>
        {d.overdue > 0 ? (
          <div className="flex items-start gap-3 rounded-3xl border border-amber/30 bg-amber/10 p-5 text-sm text-amber"><AlertTriangle size={18} className="mt-0.5 shrink-0" />{d.overdue} past interview{d.overdue > 1 ? 's are' : ' is'} not marked done. Update them on the Interviews page.</div>
        ) : (
          <div className="flex items-start gap-3 rounded-3xl border border-line bg-panel/80 p-5 text-sm text-mist"><Check size={18} className="mt-0.5 shrink-0 text-mint" />All past interviews are up to date.</div>
        )}
      </div>
    </div>
  )
}

export function GoalsTab({ d }) {
  const goals = [
    { t: 'Apply to 5 jobs this week', note: d.thisWeek + ' of 5 so far', p: Math.min(d.thisWeek, 5) / 5, tag: 'Applications', c: 'bg-sky/15 text-sky' },
    { t: 'Follow up on stale applications', note: d.stale ? d.stale + ' waiting over a week' : 'None waiting', p: d.stale ? 0 : 1, tag: 'Follow-ups', c: 'bg-amber/15 text-amber' },
    { t: 'Finish your interview prep', note: d.upcomingCount ? d.prepPercent + '% of the checklist is ticked' : 'No upcoming interviews', p: d.upcomingCount ? d.prepPercent / 100 : 1, tag: 'Interviews', c: 'bg-violet/15 text-violet' },
    { t: 'Keep past interviews up to date', note: d.overdue ? d.overdue + ' to mark done' : 'All up to date', p: d.overdue ? 0 : 1, tag: 'Tidy up', c: 'bg-mint/15 text-mint' },
  ]
  const score = Math.round((goals.reduce((a, g) => a + g.p, 0) / goals.length) * 100)
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="flex flex-col items-center rounded-3xl border border-line bg-gradient-to-br from-panel via-panel to-mint/20 p-6 text-center">
        <h2 className="self-start font-display text-xl font-bold text-white">This week</h2>
        <div className="relative mt-4 h-44 w-44">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#252d57" strokeWidth="9" />
            <motion.circle cx="60" cy="60" r="54" fill="none" stroke="url(#ig)" strokeWidth="9" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - score / 100) }} transition={{ duration: 0.9 }} />
            <defs><linearGradient id="ig" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3ee6b0" /><stop offset="100%" stopColor="#ffc24b" /></linearGradient></defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-5xl font-extrabold text-white">{score}%</span>
            <span className="text-xs text-mist">of goals met</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 lg:col-span-2">
        {goals.map(g => (
          <div key={g.t} className={`rounded-3xl border p-5 ${g.p >= 1 ? 'border-mint/30 bg-mint/10' : 'border-line bg-panel/80'}`}>
            <div className="flex items-center gap-4">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${g.p >= 1 ? 'bg-mint text-ink' : 'bg-line text-mist'}`}>{g.p >= 1 ? <Check size={18} /> : <Target size={16} />}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white">{g.t}</p>
                <p className="flex items-center gap-1.5 text-xs text-mist"><Clock size={12} />{g.note}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${g.c}`}>{g.tag}</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-line/70"><motion.div className="h-2 rounded-full bg-gradient-to-r from-sun to-amber" initial={{ width: 0 }} animate={{ width: g.p * 100 + '%' }} transition={{ duration: 0.8 }} /></div>
          </div>
        ))}
      </div>
    </div>
  )
}