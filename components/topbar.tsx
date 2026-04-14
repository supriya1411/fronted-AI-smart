"use client"

import * as React from "react"
interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const [dateString, setDateString] = React.useState("")
  const [search, setSearch] = React.useState("")
  const [showNotif, setShowNotif] = React.useState(false)
  const [showAvatar, setShowAvatar] = React.useState(false)
  const [toast, setToast] = React.useState("")

  React.useEffect(() => {
    const today = new Date()
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    setDateString(`${dayNames[today.getDay()]} ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`)
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest("[data-notif]")) setShowNotif(false)
      if (!target.closest("[data-avatar]")) setShowAvatar(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const notifications = [
    { title: "Shoes stock critical", desc: "Only 12 units left — runs out in 2 days", time: "2m ago", color: "bg-destructive" },
    { title: "T-shirts slow moving", desc: "76 units unsold for 3 weeks", time: "15m ago", color: "bg-[#FFA940]" },
    { title: "Caps demand rising", desc: "+18% this week due to festival season", time: "1h ago", color: "bg-[#00C896]" },
    { title: "Eid weekend approaching", desc: "2x sales expected in 5 days", time: "3h ago", color: "bg-primary" },
  ]

  return (
    <div className="flex items-center justify-between mb-7 relative">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="text-[12px] text-muted-foreground font-mono mt-0.5">
          {subtitle || `${dateString} · Hello, Arjun!`}
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        {/* Search */}
        <div className="flex items-center gap-2 bg-card border border-input rounded-lg px-3 py-1.5 text-[12px] text-muted-foreground w-[200px] focus-within:border-primary/50 transition-colors">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-3.5 shrink-0">
            <circle cx="7" cy="7" r="4"/>
            <path d="M11 11l3 3"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && search.trim()) { showToast(`Searching for "${search}"...`); setSearch("") } }}
            placeholder="Search anything..."
            className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full text-[12px]"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground text-[10px]">✕</button>
          )}
        </div>

        {/* Notification bell */}
        <div data-notif className="relative">
          <button
            onClick={() => { setShowNotif(!showNotif); setShowAvatar(false) }}
            className="w-9 h-9 bg-card border border-input rounded-lg flex items-center justify-center relative hover:border-white/20 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 1a5 5 0 015 5v3l1.5 2H1.5L3 9V6a5 5 0 015-5z"/>
              <path d="M6.5 13a1.5 1.5 0 003 0"/>
            </svg>
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-[1.5px] border-background" />
          </button>

          {showNotif && (
            <div className="absolute right-0 top-11 z-50 w-[300px] bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-[13px] font-medium text-foreground">Notifications</span>
                <button onClick={() => { showToast("All notifications marked as read"); setShowNotif(false) }} className="text-[10px] text-primary font-mono hover:underline">Mark all read</button>
              </div>
              {notifications.map((n, i) => (
                <div key={i} onClick={() => { showToast(`Opening: ${n.title}`); setShowNotif(false) }} className="flex gap-3 px-4 py-3 hover:bg-secondary/40 cursor-pointer border-b border-border last:border-b-0 transition-colors">
                  <div className={`w-1.5 rounded-full shrink-0 mt-1 ${n.color}`} style={{ minHeight: "36px" }} />
                  <div>
                    <div className="text-[12px] font-medium text-foreground">{n.title}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{n.desc}</div>
                    <div className="text-[10px] text-muted-foreground/60 font-mono mt-1">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div data-avatar className="relative">
          <div
            onClick={() => { setShowAvatar(!showAvatar); setShowNotif(false) }}
            className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center text-[12px] font-semibold text-primary cursor-pointer border border-primary/30 hover:bg-primary/30 transition-colors"
          >
            AK
          </div>

          {showAvatar && (
            <div className="absolute right-0 top-11 z-50 w-[180px] bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <div className="text-[13px] font-medium text-foreground">Arjun Kumar</div>
                <div className="text-[10px] text-muted-foreground font-mono">arjun@business.com</div>
              </div>
              {[
                { label: "My Profile", icon: "👤" },
                { label: "Settings", icon: "⚙️" },
                { label: "Help & Support", icon: "❓" },
              ].map((item) => (
                <button key={item.label} onClick={() => { showToast(`Opening ${item.label}...`); setShowAvatar(false) }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors text-left">
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
              <div className="border-t border-border">
                <button onClick={() => { showToast("Signing out..."); setShowAvatar(false) }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-destructive hover:bg-destructive/10 transition-colors text-left">
                  <span>🚪</span> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[200] bg-card border border-border rounded-xl px-5 py-3 shadow-2xl flex items-center gap-3 text-[13px] text-foreground">
          <div className="w-2 h-2 rounded-full bg-[#00C896]" />
          {toast}
          <button onClick={() => setToast("")} className="ml-2 text-muted-foreground hover:text-foreground text-[11px]">✕</button>
        </div>
      )}
    </div>
  )
}
