'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { College, Course, Placement } from '@/types';
import { Notification, useNotification } from '@/components/ui/Notification';

export default function CollegeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [college, setCollege] = useState<College | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'placement'>('overview');
  const { notif, show } = useNotification()

  useEffect(() => {
    if (!id) return;
    fetch(`/api/colleges/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setCollege(data.college);
        setCourses(data.courses || []);
        setPlacement(data.placement || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const addToCompare = () => {
    const existing: string[] = JSON.parse(localStorage.getItem('compareList') || '[]');
    if (existing.includes(id as string)) {
      show('Already in compare list', 'error');
      return;
    }
    if (existing.length >= 3) {
      show('You can compare up to 3 colleges only', 'error');
      return;
    }
    localStorage.setItem('compareList', JSON.stringify([...existing, id]));
    show('Added to compare list!', 'success');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading college details...</p>
      </div>
    </div>
  );

  if (!college) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-700 mb-2">College not found</p>
        <Link href="/" className="text-blue-600 hover:underline">← Back to listings</Link>
      </div>
    </div>
  );

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'courses', label: `Courses (${courses.length})` },
    { key: 'placement', label: 'Placement' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-linear-to-r from-blue-700 to-blue-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <button
            onClick={() => router.back()}
            className="text-blue-100 hover:text-white mb-4 flex items-center gap-1 text-sm"
          >
            ← Back
          </button>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{college.name}</h1>
              <p className="text-blue-100 text-lg">{college.city}, {college.state}</p>
              <p className="text-blue-200 text-sm mt-1">{college.location}</p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <button
                onClick={addToCompare}
                className="bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-50 transition"
              >
                + Add to Compare
              </button>
              <Link
                href="/compare"
                className="border border-white/50 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-white/10 transition text-center"
              >
                View Compare →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Notification notif={notif} />

      <div className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Fees / Year',
              value: `₹${college.fees_per_year.toLocaleString('en-IN')}`,
            },
            {
              label: 'Rating',
              value: `${college.rating} / 5`,
            },
            {
              label: 'Placement',
              value: `${college.placement_percent}%`,
            },
            {
              label: 'Total Courses',
              value: courses.length > 0 ? courses.length : '—',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100"
            >
              <p className="text-2xl font-bold text-blue-700">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.key
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="md:col-span-2 space-y-6">
              {college.overview && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 mb-3">About the College</h2>
                  <p className="text-gray-600 leading-relaxed">{college.overview}</p>
                </div>
              )}
              {college.image_url && (
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  <img
                    src={college.image_url}
                    alt={college.name}
                    className="w-full h-56 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Info</h2>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'City', value: college.city },
                    { label: 'State', value: college.state },
                    { label: 'Location', value: college.location },
                    { label: 'Rating', value: `${college.rating} / 5 ⭐` },
                    { label: 'Placement', value: `${college.placement_percent}%` },
                    {
                      label: 'Fees / Year',
                      value: `₹${college.fees_per_year.toLocaleString('en-IN')}`,
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-medium text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="mb-12">
            {courses.length === 0 ? (
              <p className="text-gray-400 text-center py-12">
                No courses listed for this college.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
                  >
                    <h3 className="font-bold text-gray-800">{course.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Duration: {course.duration}</p>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        Fees:{' '}
                        <b className="text-blue-700">
                          ₹{course.fees.toLocaleString('en-IN')} / yr
                        </b>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'placement' && placement && (

          <div className="mb-12">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold mb-4">Placement Overview</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Placement Rate</p>
                  <p className="text-xl font-semibold text-green-600">
                    {placement.placement_rate}%
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Avg Package</p>
                  <p className="text-xl font-semibold">
                    ₹{(placement.avg_package / 100000).toFixed(1)} LPA
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Highest</p>
                  <p className="text-xl font-semibold">
                    ₹{(placement.highest_package / 100000).toFixed(1)} LPA
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Median</p>
                  <p className="text-xl font-semibold">
                    ₹{(placement.median_package / 100000).toFixed(1)} LPA
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Top Recruiters</p>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(placement.top_recruiters) &&
                    placement.top_recruiters.map((c: string) => (
                      <span
                        key={c}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs"
                      >
                        {c}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}