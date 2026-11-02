import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays, Clock, Video, Phone, MapPin, Plus, X, Check, Trash2, ChevronLeft,
  ChevronRight, ChevronDown, List, Sparkles, Timer, Trophy, ClipboardCheck,
} from 'lucide-react'

const KEY = 'placeiq-interviews'
const pad = n => String(n).padStart(2, '0')
const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
const day = n => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d) }
const when = i => new Date(i.date + 'T' + i.time)

const tasks = ['Revise key skills', 'Review your projects', 'Research the company', 'Prepare questions to ask']
const rounds = {
  Technical: { chip: 'bg-violet/15 text-violet', dot: 'bg-violet' },
  HR: { chip: 'bg-sky/15 text-sky', dot: 'bg-sky' },
  Managerial: { chip: 'bg-amber/15 text-amber', dot: 'bg-amber' },
}
const modes = { Video, Phone, 'On-site': MapPin }
const grads = ['from-sky to-violet', 'from-sun to-amber', 'from-mint to-sky', 'from-violet to-rose', 'from-amber to-mint']
const filters = [['all', 'All'], ['upcoming', 'Upcoming'], ['completed', 'Completed']]
const input = 'w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-sm text-white placeholder:text-mist/60 focus:border-amber focus:outline-none'

const seed = [
  { id: 1, company: 'Helio Labs', role: 'Backend Developer', round: 'Technical', mode: 'Video', date: day(1), time: '10:00', done: false, prep: [true, true, false, false] },
  { id: 2, company: 'Orbit Pay', role: 'Data Analyst', round: 'HR', mode: 'Phone', date: day(4), time: '14:30', done: false, prep: [true, false, false, false] },
  { id: 3, company: 'Lumen', role: 'Full Stack Developer', round: 'Managerial', mode: 'On-site', date: day(8), time: '11:00', done: false, prep: [false, false, false, false] },
  { id: 4, company: 'Northwind', role: 'Java Developer', round: 'Technical', mode: 'Video', date: day(-3), time: '15:00', done: true, prep: [true, true, true, true] },
]

function load() {
  try {
    const s = localStorage.getItem(KEY)
    return s ? JSON.parse(s) : seed
  } catch {
    return seed
  }
}

function left(i, now) {
  const ms = when(i) - now
  if (ms <= 0) return 'Now'
  const m = Math.floor(ms / 60000)
  const d = Math.floor(m / 1440)
  const h = Math.floor((m % 1440) / 60)
  return d > 0 ? d + 'd ' + h + 'h' : h + 'h ' + (m % 60) + 'm'
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-mist">{label}</span>
      {children}
    </label>
  )
}

export default function Interviews() {
  const [items, setItems] = useState(load)
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('list')
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) })
  const [sel, setSel] = useState(null)
  const [open, setOpen] = useState(null)
  const [modal, setModal] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const [form, setForm] = useState({ company: '', role: '', round: 'Technical', mode: 'Video', date: day(1), time: '10:00' })

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { /* storage unavailable */ }
  }, [items])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const upcoming = items.filter(i => !i.done).sort((a, b) => when(a) - when(b))
  const completed = items.filter(i => i.done)
  const next = upcoming[0]
  const readiness = upcoming.length ? Math.round((upcoming.reduce((a, i) => a + i.prep.filter(Boolean).length, 0) / (upcoming.length * 4)) * 100) : 100

  const shown = items
    .filter(i => (filter === 'all' ? true : filter === 'upcoming' ? !i.done : i.done))
    .filter(i => (sel ? i.date === sel : true))
    .sort((a, b) => when(a) - when(b))

  const toggleDone = id => setItems(l => l.map(i => (i.id === id ? { ...i, done: !i.done } : i)))
  const remove = id => setItems(l => l.filter(i => i.id !== id))
  const togglePrep = (id, k) => setItems(l => l.map(i => (i.id === id ? { ...i, prep: i.prep.map((p, n) => (n === k ? !p : p)) } : i)))

  const add = e => {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) return
    setItems(l => [{ id: Date.now(), ...form, done: false, prep: [false, false, false, false] }, ...l])
    setForm({ company: '', role: '', round: 'Technical', mode: 'Video', date: day(1), time: '10:00' })
    setModal(false)
  }

  const first = month.getDay === undefined ? 0 : new Date(month.getFullYear(), month.getMonth(), 1).getDay()
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, k) => k + 1)]
  const shift = n => { setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1)); setSel(null) }

  const stats = [
    { l: 'Upcoming', v: upcoming.length, icon: CalendarDays, c: 'from-sky/40 border-sky/40 text-sky' },
    { l: 'Completed', v: completed.length, icon: Trophy, c: 'from-mint/40 border-mint/40 text-mint' },
    { l: 'Prep ready', v: readiness + '%', icon: ClipboardCheck, c: 'from-amber/40 border-amber/40 text-amber' },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky/35 via-violet/30 to-mint/25 p-7 sm:p-9">
        <div className="orb -right-10 -top-16 h-64 w-64 bg-sun" />
        <div className="orb -bottom-24 left-1/3 h-64 w-64 bg-amber" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3.5 py-1.5 text-xs font-medium text-amber backdrop-blur"><Sparkles size={14} /> Stay one step ahead</span>
            <h1 className="mt-3 font-display text-4xl font-extrabold text-white sm:text-6xl">Interview <span className="shimmer">planner</span></h1>
            <p className="mt-2 max-w-lg text-white/85">Every round, every date, and a prep checklist for each one.</p>
          </div>
          <div className="rounded-3xl border border-white/15 bg-black/30 p-5 backdrop-blur">
            <p className="flex items-center gap-2 text-xs font-medium text-white/70"><Timer size={14} className="text-amber" /> Next interview</p>
            {next ? (
              <>
                <p className="mt-1 font-display text-4xl font-extrabold text-white">{left(next, now)}</p>
                <p className="text-sm text-white/80">{next.company} · {next.round}</p>
              </>
            ) : <p className="mt-2 text-sm text-white/80">Nothing scheduled</p>}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ l, v, icon: Icon, c }, k) => (
          <motion.div key={l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + k * 0.07 }} whileHover={{ y: -4 }} className={`flex items-center gap-4 rounded-3xl border bg-gradient-to-br to-panel p-5 ${c}`}>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/25"><Icon size={24} /></span>
            <div><p className="font-display text-3xl font-extrabold text-white">{v}</p><p className="text-sm text-white/70">{l}</p></div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 rounded-full border border-line bg-panel p-1.5">
          {filters.map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)} className={`relative rounded-full px-4 py-2 text-sm font-semibold transition ${filter === id ? 'text-ink' : 'text-mist hover:text-white'}`}>
              {filter === id && <motion.span layoutId="ifilter" className="absolute inset-0 rounded-full bg-gradient-to-r from-sun to-amber" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-full border border-line bg-panel p-1.5">
            {[['list', List], ['calendar', CalendarDays]].map(([id, Icon]) => (
              <button key={id} onClick={() => setView(id)} aria-label={id} className={`rounded-full p-2.5 transition ${view === id ? 'bg-white text-ink' : 'text-mist hover:text-white'}`}><Icon size={18} /></button>
            ))}
          </div>
          <button onClick={() => setModal(true)} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sun to-amber px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-sun/25 transition hover:scale-[1.03]"><Plus size={16} /> Add interview</button>
        </div>
      </div>
      
      <AnimatePresence>
        {view === 'calendar' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-3xl border border-line bg-panel/80 p-6">
              <div className="mb-4 flex items-center justify-between">
                <button onClick={() => shift(-1)} aria-label="Previous month" className="rounded-full border border-line p-2.5 text-mist transition hover:text-white"><ChevronLeft size={18} /></button>
                <h2 className="font-display text-2xl font-extrabold text-white">{month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={() => shift(1)} aria-label="Next month" className="rounded-full border border-line p-2.5 text-mist transition hover:text-white"><ChevronRight size={18} /></button>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-mist">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <span key={d} className="py-2">{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {cells.map((n, k) => {
                  if (!n) return <span key={'e' + k} />
                  const key = month.getFullYear() + '-' + pad(month.getMonth() + 1) + '-' + pad(n)
                  const here = items.filter(i => i.date === key)
                  const isSel = sel === key
                  const isToday = key === iso(now)
                  return (
                    <button key={key} onClick={() => setSel(isSel ? null : key)} className={`flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-sm transition ${isSel ? 'bg-gradient-to-br from-sun to-amber font-bold text-ink' : isToday ? 'text-white ring-2 ring-amber' : 'text-white/80 hover:bg-white/10'}`}>
                      {n}
                      <span className="flex gap-0.5">{here.slice(0, 3).map(x => <i key={x.id} className={`h-1.5 w-1.5 rounded-full ${isSel ? 'bg-ink' : rounds[x.round].dot}`} />)}</span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-mist">
                {Object.keys(rounds).map(r => <span key={r} className="flex items-center gap-1.5"><i className={`h-2.5 w-2.5 rounded-full ${rounds[r].dot}`} />{r}</span>)}
                {sel && <button onClick={() => setSel(null)} className="ml-auto text-amber hover:underline">Clear day filter</button>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {shown.map((i, k) => {
          const Mode = modes[i.mode] || Video
          const prep = i.prep.filter(Boolean).length
          const isOpen = open === i.id
          return (
            <motion.div key={i.id} layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.05 }} className={`overflow-hidden rounded-3xl border bg-panel/80 ${i.done ? 'border-mint/25' : 'border-line'}`}>
              <div className="flex flex-wrap items-center gap-4 p-5">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-display text-2xl font-extrabold text-ink ${grads[i.company.charCodeAt(0) % grads.length]}`}>{i.company[0].toUpperCase()}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-xl font-bold text-white">{i.company}</p>
                  <p className="truncate text-sm text-mist">{i.role}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${rounds[i.round].chip}`}>{i.round}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80"><Mode size={13} />{i.mode}</span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-mist"><CalendarDays size={13} />{when(i).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}<Clock size={13} className="ml-1" />{i.time}</span>
                  </div>
                </div>
                {i.done ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/15 px-4 py-2 text-xs font-bold text-mint"><Check size={14} />Completed</span>
                ) : (
                  <span className="rounded-2xl bg-gradient-to-br from-sun/25 to-amber/20 px-4 py-2 text-center"><span className="block font-display text-xl font-extrabold text-amber">{left(i, now)}</span><span className="text-[11px] text-white/60">to go</span></span>
                )}
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleDone(i.id)} className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10">{i.done ? 'Reopen' : 'Mark done'}</button>
                  <button onClick={() => remove(i.id)} aria-label="Delete interview" className="rounded-full border border-line p-2.5 text-mist transition hover:text-rose"><Trash2 size={16} /></button>
                  <button onClick={() => setOpen(isOpen ? null : i.id)} aria-label="Toggle prep checklist" className="rounded-full border border-line p-2.5 text-mist transition hover:text-white"><ChevronDown size={16} className={`transition ${isOpen ? 'rotate-180' : ''}`} /></button>
                </div>
              </div>
              <div className="h-1.5 bg-line/60"><motion.div className="h-1.5 bg-gradient-to-r from-sun via-amber to-mint" animate={{ width: (prep / 4) * 100 + '%' }} /></div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="grid gap-2.5 p-5 sm:grid-cols-2">
                      <p className="text-sm font-semibold text-white sm:col-span-2">Prep checklist · {prep} of 4 done</p>
                      {tasks.map((t, n) => (
                        <button key={t} onClick={() => togglePrep(i.id, n)} className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left text-sm transition ${i.prep[n] ? 'border-mint/30 bg-mint/10 text-white' : 'border-line bg-ink/40 text-mist hover:border-mist'}`}>
                          <span className={`flex h-6 w-6 items-center justify-center rounded-full ${i.prep[n] ? 'bg-mint text-ink' : 'bg-line'}`}>{i.prep[n] && <Check size={14} />}</span>
                          {t}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
        {shown.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber/15 text-amber"><CalendarDays size={26} /></span>
            <p className="font-display text-xl font-bold text-white">No interviews here</p>
            <p className="text-sm text-mist">Click Add interview to schedule one.</p>
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm" onClick={() => setModal(false)}>
            <motion.form initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.96 }} onClick={e => e.stopPropagation()} onSubmit={add} className="relative w-full max-w-md space-y-4 overflow-hidden rounded-3xl border border-line bg-panel p-7 shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky via-violet to-mint" />
              <div className="flex items-center justify-between pt-1">
                <h2 className="font-display text-2xl font-extrabold text-white">New interview</h2>
                <button type="button" onClick={() => setModal(false)} aria-label="Close" className="text-mist hover:text-white"><X size={20} /></button>
              </div>
              <Field label="Company"><input className={input} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g. Helio Labs" autoFocus /></Field>
              <Field label="Role"><input className={input} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Backend Developer" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Round"><select className={input} value={form.round} onChange={e => setForm({ ...form, round: e.target.value })}>{Object.keys(rounds).map(r => <option key={r} value={r}>{r}</option>)}</select></Field>
                <Field label="Mode"><select className={input} value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })}>{Object.keys(modes).map(m => <option key={m} value={m}>{m}</option>)}</select></Field>
                <Field label="Date"><input type="date" className={input} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></Field>
                <Field label="Time"><input type="time" className={input} value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></Field>
              </div>
              <button className="w-full rounded-xl bg-gradient-to-r from-sun to-amber py-3.5 font-semibold text-ink transition hover:brightness-110">Schedule interview</button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}