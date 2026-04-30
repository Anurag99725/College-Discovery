'use client'

import { useEffect, useState } from 'react'
import { College } from '@/types'
import { Search, MapPin, DollarSign, Star } from 'lucide-react'
import CollegeCard from '@/components/ui/CollegeCard'

export default function Home() {
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [state, setState] = useState('')
  const [maxFees, setMaxFees] = useState('9999999')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const limit = 9

  async function fetchColleges() {
    setLoading(true)
    const params = new URLSearchParams({
      search,
      state,
      maxFees,
      page: page.toString(),
    })
    const res = await fetch(`/api/colleges?${params}`)
    const json = await res.json()
    setColleges(json.data || [])
    setTotal(json.count || 0)
    setLoading(false)
  }

  useEffect(() => {
    fetchColleges()
  }, [search, state, maxFees, page])

  const totalPages = Math.ceil(total / limit)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Your College</h1>
        <p className="text-gray-500 mt-1">Discover and compare top colleges in India</p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-50 border border-gray-200 rounded-xl px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search colleges..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="outline-none text-sm w-full"
          />
        </div>

        <select
          value={state}
          onChange={e => { setState(e.target.value); setPage(1) }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
        >
          <option value="">All States</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Delhi">Delhi</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Telangana">Telangana</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          <option value="West Bengal">West Bengal</option>
          <option value="Rajasthan">Rajasthan</option>
          <option value="Punjab">Punjab</option>
          <option value="Kerala">Kerala</option>
        </select>

        <select
          value={maxFees}
          onChange={e => { setMaxFees(e.target.value); setPage(1) }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
        >
          <option value="9999999">Any Fees</option>
          <option value="100000">Under ₹1 LPA</option>
          <option value="200000">Under ₹2 LPA</option>
          <option value="300000">Under ₹3 LPA</option>
          <option value="500000">Under ₹5 LPA</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-4">{total} colleges found</p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-48 border border-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map(college => (
            <CollegeCard
              key={college.id}
              college={college}
              onCompare={(id) => {
                const existing = JSON.parse(localStorage.getItem('compareList') || '[]')
                if (existing.length >= 3) { alert('Max 3 colleges'); return }
                if (existing.includes(id)) { alert('Already added'); return }
                localStorage.setItem('compareList', JSON.stringify([...existing, id]))
                alert('Added to compare!')
              }}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}