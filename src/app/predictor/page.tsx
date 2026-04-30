'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PredictorResult {
  college_id: string;
  college_name: string;
  exam: string;
  min_rank: number;
  max_rank: number;
  chance: 'High' | 'Medium' | 'Low';
}

const EXAMS = ['JEE Main', 'JEE Advanced', 'BITSAT', 'MHT-CET', 'KCET', 'WBJEE', 'Other']
export default function PredictorPage() {
  const [form, setForm] = useState({ rank: '', exam: 'JEE Main' });
  const [results, setResults] = useState<PredictorResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filter, setFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const handlePredict = async () => {
    if (!form.rank || isNaN(Number(form.rank))) {
      alert('Please enter a valid rank');
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(
        `/api/predictor?rank=${form.rank}&exam=${encodeURIComponent(form.exam)}`
      );
      const data = await res.json();
      setResults(data.predictions || []);
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const chanceColor = {
    High: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-red-100 text-red-700',
  };

  const filtered = filter === 'All' ? results : results.filter((r) => r.chance === filter);
  const counts = { High: 0, Medium: 0, Low: 0 };
  results.forEach((r) => counts[r.chance]++);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-linear-to-r from-purple-700 to-purple-500 text-white">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <Link href="/" className="text-purple-200 hover:text-white text-sm">
            ← Back to listings
          </Link>
          <h1 className="text-3xl font-bold mt-3 mb-1">College Predictor</h1>
          <p className="text-purple-100">
            Enter your rank to see which colleges you're likely to get into
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-5">Your Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Entrance Exam
              </label>
              <select
                value={form.exam}
                onChange={(e) => setForm({ ...form, exam: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {EXAMS.map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Rank
              </label>
              <input
                type="number"
                placeholder="e.g. 15000"
                value={form.rank}
                onChange={(e) => setForm({ ...form, rank: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handlePredict()}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <button
            onClick={handlePredict}
            disabled={loading}
            className="mt-5 w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? 'Predicting...' : '🔮 Predict My Colleges'}
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && searched && (
          <>
            {results.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-4xl mb-3">😔</p>
                <h3 className="text-lg font-bold text-gray-700 mb-1">No colleges found</h3>
                <p className="text-gray-500 text-sm">Try a different rank or exam.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {(['High', 'Medium', 'Low'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setFilter(filter === level ? 'All' : level)}
                      className={`rounded-xl p-4 text-center border-2 transition ${filter === level ? 'border-purple-400 shadow-md' : 'border-transparent'
                        } ${level === 'High'
                          ? 'bg-green-50'
                          : level === 'Medium'
                            ? 'bg-yellow-50'
                            : 'bg-red-50'
                        }`}
                    >
                      <p className={`text-2xl font-bold ${level === 'High'
                          ? 'text-green-700'
                          : level === 'Medium'
                            ? 'text-yellow-700'
                            : 'text-red-700'
                        }`}>
                        {counts[level]}
                      </p>
                      <p className={`text-sm font-medium ${level === 'High'
                          ? 'text-green-600'
                          : level === 'Medium'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}>
                        {level} Chance
                      </p>
                    </button>
                  ))}
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Showing <b>{filtered.length}</b> of {results.length} results
                  {filter !== 'All' && (
                    <button
                      onClick={() => setFilter('All')}
                      className="ml-2 text-purple-600 hover:underline"
                    >
                      Show all
                    </button>
                  )}
                </p>

                <div className="space-y-3">
                  {filtered.map((result, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <Link
                            href={`/college/${result.college_id}`}
                            className="font-bold text-gray-800 hover:text-purple-600 transition"
                          >
                            {result.college_name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-0.5">Exam: {result.exam}</p>
                        </div>
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${chanceColor[result.chance]}`}
                        >
                          {result.chance} Chance
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex gap-6 text-sm">
                        <span className="text-gray-500">
                          Min Rank:{' '}
                          <b className="text-green-700">{result.min_rank.toLocaleString('en-IN')}</b>
                        </span>
                        <span className="text-gray-500">
                          Max Rank:{' '}
                          <b className="text-red-600">{result.max_rank.toLocaleString('en-IN')}</b>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}