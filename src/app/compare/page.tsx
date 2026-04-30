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
        {/* CONTENT */}
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
          <>
            {/* ✅ MOBILE VIEW (Cards) */}
            <div className="md:hidden space-y-6">
              {colleges.map((college) => (
                <div key={college.id} className="bg-white rounded-xl shadow-sm border p-4">

                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">{college.name}</h3>
                      <p className="text-xs text-gray-500">
                        {college.city}, {college.state}
                      </p>
                    </div>
                    <button
                      onClick={() => removeCollege(college.id)}
                      className="text-red-400 text-lg"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-2 text-sm">
                    {COMPARE_FIELDS.map((field) => (
                      <div key={field.label} className="flex justify-between">
                        <span className="text-gray-500">{field.label}</span>
                        <span className="font-medium text-gray-800">
                          {field.render(college)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ DESKTOP VIEW (Table) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-175">
                <thead>
                  <tr>
                    <th className="w-40 py-4 pr-4 text-left text-gray-500 text-sm">
                      Feature
                    </th>
                    {colleges.map((college) => (
                      <th key={college.id} className="py-4 px-4 text-left">
                        <div className="bg-white rounded-xl shadow-sm border p-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                              {college.rating}⭐
                            </span>
                            <button
                              onClick={() => removeCollege(college.id)}
                              className="text-gray-600 hover:text-red-400"
                            >
                              ×
                            </button>
                          </div>
                          <h3 className="font-bold text-sm">{college.name}</h3>
                          <p className="text-xs text-gray-500">
                            {college.city}, {college.state}
                          </p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {COMPARE_FIELDS.map((field, idx) => (
                    <tr key={field.label} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-3 pr-4 text-sm text-gray-500">
                        {field.label}
                      </td>
                      {colleges.map((college) => (
                        <td key={college.id} className="py-3 px-4 text-sm font-medium">
                          {field.render(college)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}