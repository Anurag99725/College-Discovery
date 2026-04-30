"use client"

import { useState, useCallback, JSX } from "react"

type NotifType = "success" | "error" | "warning" | "info"

interface NotifState {
  message: string
  type: NotifType
  visible: boolean
}

const config: Record<NotifType, { bg: string; border: string; text: string; icon: JSX.Element }> = {
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
  },
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useNotification(duration = 2800) {
  const [notif, setNotif] = useState<NotifState>({ message: "", type: "info", visible: false })

  const show = useCallback((message: string, type: NotifType = "info") => {
    setNotif({ message, type, visible: true })
    setTimeout(() => setNotif(n => ({ ...n, visible: false })), duration)
  }, [duration])

  return { notif, show }
}

// ── Component — fixed bottom-right, slides in from the right ──────────────────
export function Notification({ notif }: { notif: NotifState }) {
  const c = config[notif.type]

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(110%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutRight {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(110%); }
        }
        .notif-enter { animation: slideInRight 0.35s cubic-bezier(0.22,1,0.36,1) forwards; }
        .notif-exit  { animation: slideOutRight 0.3s ease-in forwards; }
      `}</style>

      <div
        className={`
          fixed bottom-6 right-6 z-50
          flex items-center gap-3
          px-5 py-4 rounded-2xl border shadow-lg
          text-sm font-semibold
          min-w-60 max-w-xs
          pointer-events-none
          ${c.bg} ${c.border} ${c.text}
          ${notif.visible ? "notif-enter" : "notif-exit"}
        `}
      >
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${c.border} bg-white/70`}>
          {c.icon}
        </div>
        <span className="leading-snug">{notif.message}</span>
      </div>
    </>
  )
}