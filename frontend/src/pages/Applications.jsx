import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, X, Search, Trash2, CalendarDays, GripVertical,
  Send, Star, Video, Trophy, Ban, MapPin, Sparkles, Target, TrendingUp, Layers,
} from 'lucide-react'

const KEY = 'placeiq-apps-v2'

const columns = [
  { id: 'Applied', icon: Send, bar: 'bg-gradient-to-r from-sky to-violet', side: 'bg-sky', text: 'text-sky', tint: 'bg-sky/10', ring: 'ring-sky/60', top: 'from-sky/25', glow: 'shadow-sky/20' },
  { id: 'Shortlisted', icon: Star, bar: 'bg-gradient-to-r from-amber to-sun', side: 'bg-amber', text: 'text-amber', tint: 'bg-amber/10', ring: 'ring-amber/60', top: 'from-amber/25', glow: 'shadow-amber/20' },
  { id: 'Interview', icon: Video, bar: 'bg-gradient-to-r from-violet to-rose', side: 'bg-violet', text: 'text-violet', tint: 'bg-violet/10', ring: 'ring-violet/60', top: 'from-violet/25', glow: 'shadow-violet/20' },
  { id: 'Offer', icon: Trophy, bar: 'bg-gradient-to-r from-mint to-sky', side: 'bg-mint', text: 'text-mint', tint: 'bg-mint/10', ring: 'ring-mint/60', top: 'from-mint/25', glow: 'shadow-mint/20' },
  { id: 'Rejected', icon: Ban, bar: 'bg-gradient-to-r from-rose to-sun', side: 'bg-rose', text: 'text-rose', tint: 'bg-rose/10', ring: 'ring-rose/60', top: 'from-rose/25', glow: 'shadow-rose/20' },
]

const modes = {
  Remote: 'bg-mint/15 text-mint',
  Hybrid: 'bg-violet/15 text-violet',
  'On-site': 'bg-sky/15 text-sky',
}

const stages = ['Applied', 'Shortlisted', 'Interview', 'Offer']

const seed = [
  { id: 1, company: 'Northwind', role: 'Java Developer', status: 'Applied', mode: 'Hybrid', date: '1 Nov' },
  { id: 2, company: 'Kestrel', role: 'SQL Developer', status: 'Applied', mode: 'On-site', date: '30 Oct' },
  { id: 3, company: 'Helio Labs', role: 'Backend Developer', status: 'Interview', mode: 'Remote', date: '28 Oct' },
  { id: 4, company: 'Orbit Pay', role: 'Data Analyst', status: 'Shortlisted', mode: 'Hybrid', date: '27 Oct' },
  { id: 5, company: 'Lumen', role: 'Full Stack Developer', status: 'Offer', mode: 'Remote', date: '25 Oct' },
  { id: 6, company: 'Brightly', role: 'Power BI Analyst', status: 'Rejected', mode: 'On-site', date: '20 Oct' },
]

const grads = ['from-sky to-violet', 'from-sun to-amber', 'from-mint to-sky', 'from-violet to-rose', 'from-amber to-mint']

function load() {
  try {
    const s = localStorage.getItem(KEY)
    return s ? JSON.parse(s) : seed
  } catch {
    return seed
  }
}

const input = 'w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-sm text-white placeholder:text-mist/60 focus:border-amber focus:outline-none'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-mist">{label}</span>
      {children}
    </label>
  )
}

export default function Applications() {
  const [apps, setApps] = useState(load)
  const [dragId, setDragId] = useState(null)
  const [over, setOver] = useState(null)
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [toast, setToast] = useState('')
  const [form, setForm] = useState({ company: '', role: '', status: 'Applied', mode: 'Hybrid' })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(apps))
    } catch {
      /* storage unavailable */
    }
  }, [apps])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const shown = apps.filter(a => (a.company + ' ' + a.role).toLowerCase().includes(q.toLowerCase()))
  const count = s => apps.filter(a => a.status === s).length
  const total = apps.length
  const active = total - count('Rejected') - count('Offer')
  const rate = total ? Math.round((count('Offer') / total) * 100) : 0

  const move = (id, status) => {
    const app = apps.find(a => a.id === id)
    if (!app || app.status === status) return
    setApps(list => list.map(a => (a.id === id ? { ...a, status } : a)))
    if (status === 'Offer') setToast('Offer from ' + app.company + '! Congratulations 🎉')
  }
  const remove = id => setApps(list => list.filter(a => a.id !== id))

  const add = e => {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) return
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    setApps(list => [{ id: Date.now(), ...form, date }, ...list])
    setForm({ company: '', role: '', status: 'Applied', mode: 'Hybrid' })
    setOpen(false)
  }

  const banner = [
    { label: 'Total applications', value: total, icon: Layers },
    { label: 'Still active', value: active, icon: Target },
    { label: 'Interviews', value: count('Interview'), icon: Video },
    { label: 'Offer rate', value: rate + '%', icon: TrendingUp },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky/30 via-violet/25 to-sun/30 p-7 sm:p-8">
        <div className="orb -right-10 -top-16 h-60 w-60 bg-amber" />
        <div className="orb -bottom-20 left-1/4 h-60 w-60 bg-mint" />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3.5 py-1.5 text-xs font-medium text-amber backdrop-blur">
              <Sparkles size={14} /> Drag cards between columns
            </span>
            <h1 className="mt-3 font-display text-4xl font-extrabold text-white sm:text-5xl">
              Application <span className="shimmer">board</span>
            </h1>
            <p className="mt-1.5 text-white/80">Every company, every stage, one clear view.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-2.5 text-sm text-white/70 backdrop-blur focus-within:border-amber">
              <Search size={16} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search company or role" className="w-44 bg-transparent text-white placeholder:text-white/50 focus:outline-none" />
            </label>
            <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink shadow-xl transition hover:scale-[1.04]">
              <Plus size={16} /> Add application
            </button>
          </div>
        </div>
        <div className="relative mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {banner.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-amber"><Icon size={20} /></span>
              <div>
                <p className="font-display text-2xl font-extrabold text-white">{value}</p>
                <p className="text-xs text-white/70">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex gap-4 overflow-x-auto pb-6">
        {columns.map((c, ci) => {
          const items = shown.filter(a => a.status === c.id)
          const Icon = c.icon
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + ci * 0.08 }}
              onDragOver={e => { e.preventDefault(); setOver(c.id) }}
              onDragLeave={() => setOver(null)}
              onDrop={() => { if (dragId) move(dragId, c.id); setDragId(null); setOver(null) }}
              className={`w-72 shrink-0 overflow-hidden rounded-3xl border border-line bg-gradient-to-b ${c.top} to-panel/80 p-4 shadow-xl transition ${c.glow} ${over === c.id ? `scale-[1.02] ring-2 ${c.ring}` : ''}`}
            >
              <div className={`mb-4 h-1.5 rounded-full ${c.bar}`} />
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-black/25 ${c.text}`}><Icon size={18} /></span>
                  <h2 className="font-display text-lg font-bold text-white">{c.id}</h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${c.tint} ${c.text}`}>{items.length}</span>
              </div>

              <div className="min-h-28 space-y-3">
                {items.map(a => {
                  const idx = stages.indexOf(a.status)
                  return (
                    <motion.div key={a.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                      <div
                        draggable
                        onDragStart={() => setDragId(a.id)}
                        onDragEnd={() => { setDragId(null); setOver(null) }}
                        className={`group relative cursor-grab overflow-hidden rounded-2xl border border-line bg-ink/80 p-4 pl-5 transition hover:-translate-y-1 hover:border-white/25 hover:shadow-lg active:cursor-grabbing ${dragId === a.id ? 'rotate-2 opacity-40' : ''}`}
                      >
                        <span className={`absolute inset-y-0 left-0 w-1 ${c.side}`} />
                        <div className="flex items-start gap-3">
                          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-display text-lg font-extrabold text-ink ${grads[a.company.charCodeAt(0) % grads.length]}`}>
                            {a.company[0].toUpperCase()}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-white">{a.company}</p>
                            <p className="truncate text-sm text-mist">{a.role}</p>
                          </div>
                          <GripVertical size={16} className="text-line transition group-hover:text-mist" />
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${modes[a.mode] || modes.Hybrid}`}>
                            <MapPin size={11} />{a.mode || 'Hybrid'}
                          </span>
                          {a.status === 'Rejected' ? (
                            <span className="rounded-full bg-rose/15 px-2.5 py-1 text-xs font-medium text-rose">Closed</span>
                          ) : (
                            <div className="flex items-center gap-1">
                              {stages.map((s, i) => (
                                <i key={s} className={`h-1.5 w-5 rounded-full ${i <= idx ? c.side : 'bg-line'}`} />
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs text-mist"><CalendarDays size={13} />{a.date}</span>
                          <button onClick={() => remove(a.id)} aria-label="Delete application" className="text-mist transition hover:text-rose">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
                {items.length === 0 && (
                  <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line py-10 text-center text-xs text-mist">
                    <Icon size={22} className={c.text} />
                    Drop a card here
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gradient-to-r from-mint to-sky px-7 py-3.5 text-sm font-semibold text-ink shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm" onClick={() => setOpen(false)}>
            <motion.form
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              onClick={e => e.stopPropagation()}
              onSubmit={add}
              className="relative w-full max-w-md space-y-4 overflow-hidden rounded-3xl border border-line bg-panel p-7 shadow-2xl"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sun via-amber to-mint" />
              <div className="flex items-center justify-between pt-1">
                <h2 className="font-display text-2xl font-extrabold text-white">New application</h2>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-mist hover:text-white"><X size={20} /></button>
              </div>
              <Field label="Company">
                <input className={input} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g. Helio Labs" autoFocus />
              </Field>
              <Field label="Role">
                <input className={input} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Backend Developer" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Status">
                  <select className={input} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {columns.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                  </select>
                </Field>
                <Field label="Work mode">
                  <select className={input} value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })}>
                    {Object.keys(modes).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Field>
              </div>
              <button className="w-full rounded-xl bg-gradient-to-r from-sun to-amber py-3.5 font-semibold text-ink transition hover:brightness-110">Add to board</button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}