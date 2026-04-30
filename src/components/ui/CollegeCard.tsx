// Replace your college card in src/app/page.tsx

import { College } from "@/types";
import Link from "next/link";

export default function CollegeCard({ college, onCompare }: { college: College; onCompare: (id: string) => void }) {
  // Generate a consistent gradient based on college name
  const gradients = [
    'from-blue-500 to-blue-700',
    'from-purple-500 to-purple-700',
    'from-emerald-500 to-emerald-700',
    'from-orange-500 to-orange-700',
    'from-rose-500 to-rose-700',
    'from-cyan-500 to-cyan-700',
    'from-indigo-500 to-indigo-700',
    'from-teal-500 to-teal-700',
  ]
  const gradient = gradients[college.name.charCodeAt(0) % gradients.length]

  // Get initials from college name
  const initials = college.name
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden">

      {/* Gradient Header instead of image */}
      <div className={`bg-linear-to-br ${gradient} h-28 flex items-center justify-center relative`}>
        <span className="text-white text-4xl font-bold opacity-90">{initials}</span>
        <div className="absolute top-3 right-3">
          <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            ⭐ {college.rating}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-800 text-base leading-snug line-clamp-2 mb-1">
          {college.name}
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          📍 {college.city}, {college.state}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <p className="text-sm font-bold text-blue-700">
              ₹{college.fees_per_year.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Per Year</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <p className="text-sm font-bold text-green-700">
              {college.placement_percent}%
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Placement</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/colleges/${college.id}`}
            className="flex-1 text-center bg-blue-600 text-white text-sm py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            View Details
          </Link>
          <button
            onClick={() => onCompare(college.id)}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-300 transition text-sm"
            title="Add to Compare"
          >
            ⚖️
          </button>
        </div>
      </div>
    </div>
  )
}