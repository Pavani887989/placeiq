import { useEffect, useState } from 'react'
import { motion, animate } from 'framer-motion'
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { TrendingUp } from 'lucide-react'

export const C = 2 * Math.PI * 54
export const tip = { background: '#121835', border: '1px solid #252d57', borderRadius: 12, color: '#fff' }

export const fade = (i = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: i * 0.07 },
})

export function Count({ to }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const c = animate(0, to, { duration: 1.2, onUpdate: v => setN(Math.round(v)) })
    return () => c.stop()
  }, [to])
  return <>{n}</>
}

export function Bar({ t, v, c, delay = 0 }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="text-mist">{t}</span>
        <span className="font-semibold text-white">{v}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-line/70">
        <motion.div className={`h-2.5 rounded-full bg-gradient-to-r ${c}`} initial={{ width: 0 }} animate={{ width: v + '%' }} transition={{ duration: 1, delay: 0.3 + delay }} />
      </div>
    </div>
  )
}

export function StatCards({ cards }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, delta, grad, border, text, color, data, share }, i) => (
        <motion.div key={label} {...fade(i + 1)} whileHover={{ y: -5 }} className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br p-5 ${grad} ${border}`}>
          <div className="flex items-center justify-between">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-black/25 ${text}`}><Icon size={22} /></span>
            <span className={`flex items-center gap-1 text-xs ${text}`}><TrendingUp size={14} />{delta}</span>
          </div>
          <p className="mt-4 font-display text-5xl font-extrabold text-white"><Count to={value} /></p>
          <p className="text-sm text-white/70">{label}</p>
          <div className="mt-2 flex h-12 items-end">
            {data ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <Area type="monotone" dataKey="v" stroke={color} fill={color} fillOpacity={0.22} strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-2.5 w-full rounded-full bg-black/25">
                <motion.div className="h-2.5 rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: share + '%' }} transition={{ duration: 1 }} />
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export function ScoreCard({ score, parts }) {
  return (
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
            transition={{ duration: 1.6, ease: 'easeOut' }}
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
        {parts.map((p, i) => <Bar key={p.t} {...p} delay={i * 0.12} />)}
      </div>
      <p className="mt-4 text-xs text-mist">Activity from your applications, progress past the first stage, and your interview prep.</p>
    </motion.div>
  )
}

export function StatusDonut({ status, total }) {
  return (
    <motion.div {...fade(7)} className="rounded-3xl border border-line bg-panel/80 p-6">
      <h2 className="font-display text-xl font-bold text-white">Application status</h2>
      <div className="relative mx-auto mt-2 h-48 w-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={total ? status : [{ name: 'None', value: 1, color: '#252d57' }]} dataKey="value" innerRadius={58} outerRadius={84} paddingAngle={total ? 4 : 0} stroke="none">
              {(total ? status : [{ name: 'None', value: 1, color: '#252d57' }]).map(s => <Cell key={s.name} fill={s.color} />)}
            </Pie>
            {total > 0 && <Tooltip contentStyle={tip} />}
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-extrabold text-white">{total}</span>
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
  )
}