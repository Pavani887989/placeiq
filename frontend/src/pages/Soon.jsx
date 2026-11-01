import { Hammer } from 'lucide-react'

export default function Soon({ title }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber/15 text-amber">
        <Hammer size={30} />
      </span>
      <h1 className="mt-6 font-display text-4xl font-extrabold text-white">{title}</h1>
      <p className="mt-3 text-mist">This page is being built next.</p>
    </div>
  )
}