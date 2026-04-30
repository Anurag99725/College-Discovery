import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'College Discovery',
  description: 'Find and compare the best colleges in India',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-blue-600">
              🎓 CollegeDiscover
            </a>
            <div className="flex gap-6 text-sm font-medium text-gray-600">
              <a href="/" className="hover:text-blue-600">Colleges</a>
              <a href="/compare" className="hover:text-blue-600">Compare</a>
              <a href="/predictor" className="hover:text-blue-600">Predictor</a>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}