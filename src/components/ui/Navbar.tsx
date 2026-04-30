'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          🎓 CollegeDiscover
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/">Colleges</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/predictor">Predictor</Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-600"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm font-medium text-gray-600">
          <Link href="/" onClick={() => setOpen(false)}>Colleges</Link>
          <Link href="/compare" onClick={() => setOpen(false)}>Compare</Link>
          <Link href="/predictor" onClick={() => setOpen(false)}>Predictor</Link>
        </div>
      )}
    </nav>
  )
}