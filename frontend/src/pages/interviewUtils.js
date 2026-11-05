import { Video, Phone, MapPin } from 'lucide-react'

export const pad = n => String(n).padStart(2, '0')
export const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
export const day = n => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d) }
export const when = i => new Date(i.interviewAt)
export const dateOf = i => i.interviewAt.slice(0, 10)
export const timeOf = i => i.interviewAt.slice(11, 16)
export const bits = i => [0, 1, 2, 3].map(k => ((i.prepDone >> k) & 1) === 1)

export const tasks = ['Revise key skills', 'Review your projects', 'Research the company', 'Prepare questions to ask']

export const rounds = {
  Technical: { chip: 'bg-violet/15 text-violet', dot: 'bg-violet' },
  HR: { chip: 'bg-sky/15 text-sky', dot: 'bg-sky' },
  Managerial: { chip: 'bg-amber/15 text-amber', dot: 'bg-amber' },
}

export const modes = { Video, Phone, 'On-site': MapPin }

export const grads = ['from-sky to-violet', 'from-sun to-amber', 'from-mint to-sky', 'from-violet to-rose', 'from-amber to-mint']

export const filters = [['all', 'All'], ['upcoming', 'Upcoming'], ['completed', 'Completed']]

export const input = 'w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-sm text-white placeholder:text-mist/60 focus:border-amber focus:outline-none'

export function left(i, now) {
  const ms = when(i) - now
  if (ms <= 0) return 'Now'
  const m = Math.floor(ms / 60000)
  const d = Math.floor(m / 1440)
  const h = Math.floor((m % 1440) / 60)
  return d > 0 ? d + 'd ' + h + 'h' : h + 'h ' + (m % 60) + 'm'
}