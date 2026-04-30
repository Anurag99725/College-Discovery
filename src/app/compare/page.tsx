'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { College } from '@/types';

const COMPARE_FIELDS: {
  label: string;
  render: (c: College) => string | number;
}[] = [
    { label: 'City', render: (c) => c.city },
    { label: 'State', render: (c) => c.state },
    { label: 'Location', render: (c) => c.location },
    { label: 'Fees / Year', render: (c) => `₹${c.fees_per_year.toLocaleString('en-IN')}` },
    { label: 'Rating', render: (c) => `${c.rating} / 5` },
    { label: 'Placement %', render: (c) => `${c.placement_percent}%` },
  ];

export default function ComparePage() {
  const [ids, setIds] = useState<string[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored: string[] = JSON.parse(localStorage.getItem('compareList') || '[]');
    setIds(stored);
    if (stored.length === 0) { setLoading(false); return; }

    fetch(`/api/compare?ids=${stored.join(',')}`)
      .then((r) => r.json())
      .then((data) => setColleges(data.colleges || []))
      .finally(() => setLoading(false));
  }, []);

  const removeCollege = (id: string) => {
    const updated = ids.filter((i) => i !== id);
    setIds(updated);
    setColleges((prev) => prev.filter((c) => c.id !== id));
    localStorage.setItem('compareList', JSON.stringify(updated));
  };

  const clearAll = () => {
    setIds([]);
    setColleges([]);
    localStorage.setItem('compareList', '[]');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <Link href="/" className="text-blue-600 text-sm hover:underline">
              ← Back to listings
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 mt-1">Compare Colleges</h1>
            <p className="text-gray-500 text-sm">Side-by-side comparison of up to 3 colleges</p>
          </div>
          {colleges.length > 0 && (
            <button
              onClick={clearAll}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🏫</p>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No colleges to compare</h2>
            <p className="text-gray-500 mb-6">
              Add colleges from the listing or detail pages.
            </p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Browse Colleges
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-160">
              <thead>
                <tr>
                  <th className="w-40 py-4 pr-4 text-left text-gray-500 font-medium text-sm align-top">
                    Feature
                  </th>
                  {colleges.map((college) => (
                    <th key={college.id} className="py-4 px-4 text-left align-top">
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                            {college.rating}⭐
                          </span>
                          <button
                            onClick={() => removeCollege(college.id)}
                            className="text-gray-600 hover:text-red-400 text-lg leading-none"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                        <Link href={`/colleges/${college.id}`}>
                          <h3 className="font-bold text-gray-800 text-sm leading-snug hover:text-blue-600 transition">
                            {college.name}
                          </h3>
                          <p className="text-gray-500 text-xs mt-1">
                            {college.city}, {college.state}
                          </p>
                        </Link>
                        <p className="text-xs text-green-700 font-semibold mt-2">
                          {college.placement_percent}% Placement
                        </p>
                      </div>
                    </th>
                  ))}
                  {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                    <th key={`empty-${i}`} className="py-4 px-4 text-left align-top">
                      <Link href="/">
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 transition">
                          <span className="text-gray-300 text-3xl">+</span>
                          <p className="text-gray-400 text-xs mt-1">Add College</p>
                        </div>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_FIELDS.map((field, idx) => (
                  <tr key={field.label} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="py-3.5 pr-4 text-sm font-medium text-gray-500 pl-1">
                      {field.label}
                    </td>
                    {colleges.map((college) => (
                      <td key={college.id} className="py-3.5 px-4 text-sm text-gray-800 font-medium">
                        {field.render(college)}
                      </td>
                    ))}
                    {Array.from({ length: 3 - colleges.length }).map((_, i) => (
                      <td key={`empty-cell-${i}`} className="py-3.5 px-4 text-sm text-gray-200">
                        —
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}