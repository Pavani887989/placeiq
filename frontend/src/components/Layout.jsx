import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, FileSearch, Target,
  CalendarClock, LineChart, LogOut, Bell, Search,
} from 'lucide-react'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/applications', label: 'Applications', icon: Briefcase },
  { to: '/resume', label: 'Resume Analyzer', icon: FileSearch },
  { to: '/match', label: 'Job Match', icon: Target },
  { to: '/interviews', label: 'Interviews', icon: CalendarClock },
  { to: '/insights', label: 'Insights', icon: LineChart },
]

function Item({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium transition ${
          isActive
            ? 'bg-gradient-to-r from-sun/90 to-amber/90 text-ink shadow-lg shadow-sun/20'
            : 'text-mist hover:bg-white/5 hover:text-white'
        }`
      }
    >
      <Icon size={18} /> {label}
    </NavLink>
  )
}

export default function Layout() {
  return (
    <div className="min-h-screen bg-ink lg:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-panel/60 p-5 backdrop-blur-xl lg:flex">
        <Link to="/" className="mb-8 px-2 font-display text-3xl font-extrabold text-white">
          Place<span className="sun-text">IQ</span>
        </Link>
        <nav className="space-y-1.5">
          {nav.map(n => <Item key={n.to} {...n} />)}
        </nav>
        <div className="mt-auto rounded-2xl border border-line bg-ink/60 p-4">
          <p className="font-display font-bold text-white">Keep going</p>
          <p className="mt-1 text-xs text-mist">Learn Spring Boot next to lift your backend match.</p>
        </div>
        <Link to="/login" className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-mist transition hover:bg-white/5 hover:text-white">
          <LogOut size={18} /> Log out
        </Link>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-line bg-ink/80 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-8">
            <Link to="/" className="font-display text-2xl font-extrabold text-white lg:hidden">
              Place<span className="sun-text">IQ</span>
            </Link>
            <label className="hidden max-w-sm flex-1 items-center gap-2 rounded-full border border-line bg-panel px-4 py-2.5 text-sm text-mist focus-within:border-amber lg:flex">
              <Search size={16} />
              <input placeholder="Search applications, skills..." className="w-full bg-transparent text-white placeholder:text-mist/60 focus:outline-none" />
            </label>
            <div className="flex items-center gap-3">
              <button className="relative rounded-full border border-line bg-panel p-2.5 text-mist transition hover:text-white">
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-sun" />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sun to-amber font-display font-extrabold text-ink">P</div>
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto px-3 pb-3 lg:hidden">
            {nav.map(n => <Item key={n.to} {...n} />)}
          </div>
        </header>
        <main className="px-5 py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}