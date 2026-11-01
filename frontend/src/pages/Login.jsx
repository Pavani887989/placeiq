import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, X,
  CalendarClock, Sparkles, ShieldCheck,
} from 'lucide-react'

const tips = [
  'Match any job post in seconds',
  'See exactly which skills to learn next',
  'Track every application on one board',
  'Walk into interviews already prepared',
]

const dots = Array.from({ length: 22 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 100}%`,
  size: 3 + (i % 4),
  delay: (i % 7) * 0.6,
  dur: 6 + (i % 5) * 2,
  color: ['#ff7a59', '#ffc24b', '#3ee6b0', '#5bc8ff', '#9b8cff'][i % 5],
}))

function Field({ icon: Icon, type = 'text', placeholder, value, onChange, right }) {
  return (
    <label className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 transition-all duration-300 focus-within:border-amber focus-within:bg-white/10 focus-within:shadow-[0_0_0_4px_rgba(255,194,75,0.15)]">
      <Icon size={18} className="text-mist transition group-focus-within:text-amber" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-sm text-white placeholder:text-mist/60 focus:outline-none"
      />
      {right}
    </label>
  )
}

function Strength({ pw }) {
  const score = [pw.length >= 8, /[A-Z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length
  const colors = ['#252d57', '#ff6b9a', '#ff7a59', '#ffc24b', '#3ee6b0']
  const labels = ['', 'Weak', 'Okay', 'Good', 'Strong']
  return (
    <div className="px-1">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="h-1.5 flex-1 rounded-full transition-all duration-500" style={{ background: n <= score ? colors[score] : '#252d57' }} />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-mist">{pw ? labels[score] : 'Use 8+ characters, a capital, a number and a symbol'}</p>
    </div>
  )
}

function MiniRing({ value = 82 }) {
  const c = 2 * Math.PI * 22
  return (
    <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
      <circle cx="28" cy="28" r="22" fill="none" stroke="#252d57" strokeWidth="6" />
      <motion.circle
        cx="28" cy="28" r="22" fill="none" stroke="#ffc24b" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - value / 100) }}
        transition={{ duration: 1.8, delay: 0.5 }}
      />
    </svg>
  )
}

export default function Login() {
  const [mode, setMode] = useState('login')
  const [show, setShow] = useState(false)
  const [pw, setPw] = useState('')
  const [tip, setTip] = useState(0)
  const [state, setState] = useState('idle')
  const isLogin = mode === 'login'
  const navigate = useNavigate()

  useEffect(() => {
    const t = setInterval(() => setTip(v => (v + 1) % tips.length), 3000)
    return () => clearInterval(t)
  }, [])

  const submit = e => {
    e.preventDefault()
    setState('loading')
    setTimeout(() => navigate('/dashboard'), 1200)
  }

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-ink lg:grid-cols-[1.1fr_1fr]">
      <style>{`
        @keyframes spinb { to { transform: rotate(360deg); } }
        @keyframes twinkle { 0%,100% { opacity:.15; transform: translateY(0); } 50% { opacity:.9; transform: translateY(-14px); } }
        @keyframes sweep { to { transform: translateX(260%); } }
        .spin-border::before { content:''; position:absolute; inset:-60%; background: conic-gradient(from 0deg, transparent 0 65%, #ff7a59, #ffc24b, #3ee6b0, #5bc8ff, transparent 100%); animation: spinb 6s linear infinite; }
        .btn-sweep::after { content:''; position:absolute; top:0; left:-60%; height:100%; width:40%; background: linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent); transform: skewX(-20deg); animation: sweep 3.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .spin-border::before, .btn-sweep::after { animation: none; } }
      `}</style>

      <motion.div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-sun/40 blur-[110px]" animate={{ x: [0, 70, 0], y: [0, 50, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-violet/30 blur-[120px]" animate={{ x: [0, -80, 0], y: [0, -40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="pointer-events-none absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-mint/25 blur-[110px]" animate={{ x: [0, -50, 0], y: [0, 60, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />

      {dots.map((d, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{ left: d.left, top: d.top, width: d.size, height: d.size, background: d.color, animation: `twinkle ${d.dur}s ease-in-out ${d.delay}s infinite` }}
        />
      ))}

      <aside className="relative z-10 hidden flex-col justify-between p-12 lg:flex">
        <Link to="/" className="font-display text-3xl font-extrabold text-white">
          Place<span className="sun-text">IQ</span>
        </Link>

        <div className="relative">
          <motion.h2 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-display text-6xl font-extrabold leading-[1.05] tracking-tight text-white">
            Your placement season, <span className="shimmer">organised</span>.
          </motion.h2>

          <div className="mt-6 h-8 overflow-hidden text-lg text-mist">
            <AnimatePresence mode="wait">
              <motion.p key={tip} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -24, opacity: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-2">
                <Sparkles size={18} className="text-amber" /> {tips[tip]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="relative mt-12 h-72">
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="glass absolute left-0 top-0 flex w-72 items-center gap-4 rounded-2xl p-4 shadow-2xl shadow-black/40">
              <div className="relative">
                <MiniRing />
                <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-extrabold text-white">82</span>
              </div>
              <div>
                <p className="font-display font-bold text-white">Readiness score</p>
                <p className="text-xs text-mint">+6 this week</p>
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, 14, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }} className="glass absolute left-40 top-24 flex w-80 items-center gap-4 rounded-2xl p-4 shadow-2xl shadow-black/40">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky/15 text-sky">
                <CalendarClock size={24} />
              </span>
              <div>
                <p className="font-display font-bold text-white">Helio Labs interview</p>
                <p className="text-xs text-mist">Tomorrow, 10:00 AM</p>
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }} className="glass absolute left-6 top-52 flex flex-wrap gap-2 rounded-2xl p-4 shadow-2xl shadow-black/40">
              {['Java', 'SQL', 'Power BI'].map(s => (
                <span key={s} className="inline-flex items-center gap-1 rounded-full bg-mint/15 px-3 py-1 text-xs text-mint"><Check size={12} />{s}</span>
              ))}
              {['Spring Boot', 'Docker'].map(s => (
                <span key={s} className="inline-flex items-center gap-1 rounded-full bg-sun/15 px-3 py-1 text-xs text-sun"><X size={12} />{s}</span>
              ))}
            </motion.div>
          </div>
        </div>

        <p className="flex items-center gap-2 text-sm text-mist">
          <ShieldCheck size={16} className="text-mint" /> Your data stays private to your account
        </p>
      </aside>

      <main className="relative z-10 flex items-center justify-center px-5 py-12">
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7 }} className="spin-border relative w-full max-w-md overflow-hidden rounded-[1.75rem] p-[1.5px]">
          <div className="relative rounded-[1.7rem] bg-ink/90 p-8 backdrop-blur-xl sm:p-10">
            <Link to="/" className="mb-6 block font-display text-2xl font-extrabold text-white lg:hidden">
              Place<span className="sun-text">IQ</span>
            </Link>

            <div className="relative mb-8 grid grid-cols-2 rounded-full border border-white/10 bg-white/5 p-1">
              <motion.span layout className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-sun to-amber" style={{ left: isLogin ? 4 : 'calc(50%)' }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              {['login', 'signup'].map(m => (
                <button key={m} onClick={() => setMode(m)} className={`relative z-10 rounded-full py-2.5 text-sm font-semibold transition ${mode === m ? 'text-ink' : 'text-mist hover:text-white'}`}>
                  {m === 'login' ? 'Log in' : 'Sign up'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.form key={mode} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }} onSubmit={submit} className="space-y-4">
                <h1 className="font-display text-3xl font-extrabold text-white">
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </h1>
                <p className="pb-1 text-mist">
                  {isLogin ? 'Log in to pick up where you left off.' : 'Start tracking your placements in a minute.'}
                </p>

                {!isLogin && <Field icon={User} placeholder="Full name" />}
                <Field icon={Mail} type="email" placeholder="Email address" />
                <Field
                  icon={Lock}
                  type={show ? 'text' : 'password'}
                  placeholder="Password"
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  right={
                    <button type="button" onClick={() => setShow(!show)} className="text-mist transition hover:text-white">
                      {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
                {!isLogin && <Strength pw={pw} />}

                {isLogin && (
                  <div className="flex justify-end">
                    <button type="button" className="text-sm text-mist transition hover:text-amber">Forgot password?</button>
                  </div>
                )}

                <button
                  className="btn-sweep group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-sun via-amber to-sun py-4 font-semibold text-ink shadow-lg shadow-sun/30 transition hover:scale-[1.02]"
                >
                  {state === 'loading' ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                  ) : (
                    <>{isLogin ? 'Log in' : 'Create account'} <ArrowRight size={18} className="transition group-hover:translate-x-1" /></>
                  )}
                </button>

                <p className="pt-1 text-center text-sm text-mist">
                  {isLogin ? 'New here? ' : 'Already have an account? '}
                  <button type="button" onClick={() => setMode(isLogin ? 'signup' : 'login')} className="font-semibold text-amber hover:underline">
                    {isLogin ? 'Create an account' : 'Log in'}
                  </button>
                </p>
              </motion.form>
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  )
}