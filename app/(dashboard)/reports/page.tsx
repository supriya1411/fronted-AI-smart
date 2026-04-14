"use client"

import { useState } from "react"
import { TopBar } from "@/components/topbar"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"

// ---------- DATA ----------
const revenueTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `Apr ${i + 1}`,
  revenue: Math.floor(15000 + Math.random() * 8000 + (i > 20 ? i * 1000 : 0)),
  target: 20000,
}))

const categoryData = [
  { name: "Shoes", value: 38200, fill: "#6C63FF" },
  { name: "Bags", value: 22100, fill: "#4ECDC4" },
  { name: "T-shirts", value: 12400, fill: "#FF4F6A" },
  { name: "Caps", value: 8800, fill: "#00C896" },
  { name: "Watches", value: 2700, fill: "#FFD166" },
]

const monthlyOrders = [
  { month: "Oct", orders: 198 },
  { month: "Nov", orders: 221 },
  { month: "Dec", orders: 305 },
  { month: "Jan", orders: 267 },
  { month: "Feb", orders: 289 },
  { month: "Mar", orders: 312 },
  { month: "Apr", orders: 342 },
]

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] bg-card border border-border rounded-xl px-5 py-3 shadow-2xl flex items-center gap-3 text-[13px] text-foreground">
      <div className="w-2 h-2 rounded-full bg-[#00C896]" />
      {msg}
      <button onClick={onClose} className="ml-2 text-muted-foreground hover:text-foreground text-[11px]">✕</button>
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl text-[12px]">
        <div className="text-muted-foreground font-mono mb-1.5">{label}</div>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color || entry.fill }} />
            <span className="text-foreground font-mono">
              {typeof entry.value === "number" && entry.value > 1000
                ? `₹${(entry.value / 1000).toFixed(1)}k`
                : entry.value}
            </span>
            <span className="text-muted-foreground capitalize">{entry.name}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function PieTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl text-[12px]">
        <span style={{ color: d.fill }} className="font-mono font-semibold">{d.name}: </span>
        <span className="text-foreground font-mono">₹{(d.value / 1000).toFixed(1)}k</span>
      </div>
    )
  }
  return null
}

function ReportCard({ title, description, lastUpdated, type, onClick }: {
  title: string; description: string; lastUpdated: string
  type: "sales" | "inventory" | "customers" | "forecast"
  onClick?: () => void
}) {
  const iconMap = {
    sales: (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5"><polyline points="1,11 5,7 9,9 15,3" /></svg>),
    inventory: (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5"><rect x="1" y="4" width="14" height="10" rx="1.5" /><path d="M5 4V3a3 3 0 016 0v1" /></svg>),
    customers: (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5"><circle cx="8" cy="6" r="3" /><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" /></svg>),
    forecast: (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5"><circle cx="8" cy="8" r="6" /><path d="M8 4v4l3 2" /></svg>),
  }
  const colorMap = {
    sales: "bg-primary/10 text-primary",
    inventory: "bg-destructive/10 text-destructive",
    customers: "bg-accent/10 text-accent",
    forecast: "bg-[#FFD166]/10 text-[#FFD166]",
  }
  return (
    <div onClick={onClick} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[type]}`}>
          {iconMap[type]}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClick?.() }}
          className="text-[11px] text-muted-foreground font-mono opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary"
        >
          Download →
        </button>
      </div>
      <h3 className="text-[14px] font-medium text-foreground mb-1">{title}</h3>
      <p className="text-[12px] text-muted-foreground mb-3">{description}</p>
      <div className="text-[10px] text-muted-foreground font-mono">Last updated: {lastUpdated}</div>
    </div>
  )
}

export default function ReportsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d")
  const [toast, setToast] = useState("")

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  return (
    <>
      <TopBar title="Reports" subtitle="Comprehensive business analytics and reports" />

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Revenue (MTD)", value: "₹5,84,200", change: "+18.5% vs last month", pos: true },
          { label: "Orders (MTD)", value: "342", change: "+12.3% vs last month", pos: true },
          { label: "Avg Order Value", value: "₹1,708", change: "+5.6% vs last month", pos: true },
          { label: "Return Rate", value: "3.2%", change: "-0.8% vs last month", pos: false },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="text-[11px] text-muted-foreground font-mono uppercase tracking-wide mb-2">{s.label}</div>
            <div className="text-2xl font-semibold text-foreground">{s.value}</div>
            <div className={`text-[11px] font-mono mt-1 ${s.pos ? "text-[#00C896]" : "text-destructive"}`}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Revenue Trend */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[13px] font-medium text-foreground">Revenue Trend</h3>
            <div className="flex gap-1.5">
              {(["7d", "30d", "90d"] as const).map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`text-[10px] px-2.5 py-1 rounded font-mono transition-colors ${period === p ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={period === "7d" ? revenueTrend.slice(-7) : period === "30d" ? revenueTrend : revenueTrend}
              margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="rptRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rptTgtGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: "#888", fontSize: 9, fontFamily: "monospace" }} axisLine={false} tickLine={false}
                interval={period === "7d" ? 0 : 4} />
              <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fill: "#888", fontSize: 9, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="target" name="target" stroke="#4ECDC4" strokeWidth={1} fill="url(#rptTgtGrad)" strokeDasharray="4 2" dot={false} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#6C63FF" strokeWidth={2} fill="url(#rptRevGrad)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
              <div className="w-2 h-2 rounded-sm bg-primary" /> Revenue
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
              <div className="w-2 h-2 rounded-sm bg-accent" /> Target
            </div>
          </div>
        </div>

        {/* Sales by Category - Pie */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[13px] font-medium text-foreground">Sales by Category</h3>
            <span className="text-[11px] text-muted-foreground font-mono">MTD</span>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={180}>
              <PieChart>
                <Pie
                  data={categoryData} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" innerRadius={45} outerRadius={80}
                  paddingAngle={3} strokeWidth={0}
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categoryData.map((c) => {
                const total = categoryData.reduce((s, d) => s + d.value, 0)
                const pct = ((c.value / total) * 100).toFixed(0)
                return (
                  <div key={c.name}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-muted-foreground font-mono">{c.name}</span>
                      <span className="font-mono" style={{ color: c.fill }}>{pct}%</span>
                    </div>
                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                      <div className="h-1 rounded-full transition-all" style={{ width: `${pct}%`, background: c.fill }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Orders + Reports grid */}
      <div className="grid grid-cols-[1fr_1.5fr] gap-3 mb-6">
        {/* Monthly Orders Bar */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[13px] font-medium text-foreground">Monthly Orders</h3>
            <span className="text-[11px] text-muted-foreground font-mono">Last 7 months</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={monthlyOrders} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#888", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" name="orders" radius={[4, 4, 0, 0]}>
                {monthlyOrders.map((_, i) => (
                  <Cell key={i} fill={i === monthlyOrders.length - 1 ? "#6C63FF" : "#534AB7"} fillOpacity={i === monthlyOrders.length - 1 ? 1 : 0.5 + (i / monthlyOrders.length) * 0.3} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Available Reports */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-[13px] font-medium text-foreground mb-3">Available Reports</h3>
          <div className="grid grid-cols-2 gap-3">
            <ReportCard type="sales" title="Sales Report" description="Daily, weekly, monthly breakdown" lastUpdated="Today, 2:30 PM" onClick={() => showToast("Opening Sales Report...")} />
            <ReportCard type="inventory" title="Inventory Report" description="Stock levels & reorder alerts" lastUpdated="Today, 1:15 PM" onClick={() => showToast("Opening Inventory Report...")} />
            <ReportCard type="customers" title="Customer Analytics" description="Retention & lifetime value" lastUpdated="Yesterday" onClick={() => showToast("Opening Customer Analytics...")} />
            <ReportCard type="forecast" title="AI Forecast Report" description="7-day & 30-day predictions" lastUpdated="Today, 3:00 PM" onClick={() => showToast("Opening AI Forecast Report...")} />
          </div>
        </div>
      </div>

      {/* Recent Downloads */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[13px] font-medium text-foreground">Recent Report Downloads</h3>
          <button onClick={() => showToast("Loading all reports...")} className="text-[11px] text-muted-foreground font-mono hover:text-primary transition-colors">View all →</button>
        </div>
        <div className="space-y-3">
          {[
            { name: "Weekly Sales Report - Apr 7-13", date: "Apr 13, 2026", size: "2.4 MB" },
            { name: "Monthly Customer Analytics - March", date: "Apr 1, 2026", size: "5.1 MB" },
            { name: "Q1 Performance Summary", date: "Mar 31, 2026", size: "8.7 MB" },
            { name: "Inventory Audit Report - March", date: "Mar 28, 2026", size: "3.2 MB" },
          ].map((report, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 text-primary">
                    <path d="M3 14V2h7l3 3v9H3z" /><path d="M10 2v3h3" />
                  </svg>
                </div>
                <div>
                  <div className="text-[13px] text-foreground">{report.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{report.date} · {report.size}</div>
                </div>
              </div>
              <button onClick={() => showToast(`Downloading "${report.name}"...`)} className="text-[11px] text-primary font-mono hover:underline">Download</button>
            </div>
          ))}
        </div>
      </div>

      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
    </>
  )
}
