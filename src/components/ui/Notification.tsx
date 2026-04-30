"use client"

import { useState, useCallback } from "react"

type NotifType = "success" | "error" | "warning" | "info"

interface NotifState {
    message: string
    type: NotifType
    visible: boolean
}

const styles: Record<NotifType, string> = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    error: "bg-red-50 text-red-600 border-red-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    info: "bg-blue-50 text-blue-600 border-blue-200",
}

const icons: Record<NotifType, string> = {
    success: "✓",
    error: "✕",
    warning: "!",
    info: "i",
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useNotification(duration = 2500) {
    const [notif, setNotif] = useState<NotifState>({ message: "", type: "info", visible: false })

    const show = useCallback((message: string, type: NotifType = "info") => {
        setNotif({ message, type, visible: true })
        setTimeout(() => setNotif(n => ({ ...n, visible: false })), duration)
    }, [duration])

    return { notif, show }
}

// ── Component ─────────────────────────────────────────────────────────────────
export function Notification({ notif }: { notif: NotifState }) {
    if (!notif.visible) return null

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium
      animate-[fadeIn_0.2s_ease-out] ${styles[notif.type]}`}>
            <b>{icons[notif.type]}</b>
            {notif.message}
            <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-4px) } to { opacity:1; transform:translateY(0) } }`}</style>
        </span>
    )
}