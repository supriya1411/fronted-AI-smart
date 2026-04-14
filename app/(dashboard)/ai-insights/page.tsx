"use client"

import { useState } from "react"
import { TopBar } from "@/components/topbar"
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line
} from "recharts"

// ---------- DATA ----------
const accuracyHistory = [
  { week: "Wk1", accuracy: 89 },
  { week: "Wk2", accuracy: 91 },
  { week: "Wk3", accuracy: 90 },
  { week: "Wk4", accuracy: 93 },
  { week: "Wk5", accuracy: 94 },
  { week: "Wk6", accuracy: 94 },
]

const impactData = [
  { week: "Wk1", impact: 35000 },
  { week: "Wk2", impact: 52000 },
  { week: "Wk3", impact: 48000 },
  { week: "Wk4", impact: 80000 },
  { week: "Wk5", impact: 92000 },
  { week: "Wk6", impact: 120000 },
]

const radarData = [
  { subject: "Stock Mgmt", A: 92 },
  { subject: "Pricing", A: 85 },
  { subject: "Demand", A: 94 },
  { subject: "Sentiment", A: 88 },
  { subject: "Festival", A: 78 },
  { subject: "Retention", A: 82 },
]

// ---------- HELPERS ----------
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl text-[12px]">
        <div className="text-muted-foreground font-mono mb-1.5">{label}</div>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-foreground font-mono">
              {entry.value > 1000 ? `₹${(entry.value / 1000).toFixed(0)}k` : `${entry.value}%`}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

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

function InsightCard({ type, title, description, action, impact, dismissed, onDismiss, onAction }: {
  type: "critical" | "warning" | "success" | "info"
  title: string; description: string; action: string; impact: string
  dismissed?: boolean; onDismiss?: () => void; onAction?: () => void
}) {
  const colorMap = {
    critical: { border: "border-destructive/30", bg: "bg-destructive/10", text: "text-destructive", pip: "bg-destructive" },
    warning: { border: "border-[#FFA940]/30", bg: "bg-[#FFA940]/10", text: "text-[#FFA940]", pip: "bg-[#FFA940]" },
    success: { border: "border-[#00C896]/30", bg: "bg-[#00C896]/10", text: "text-[#00C896]", pip: "bg-[#00C896]" },
    info: { border: "border-primary/30", bg: "bg-primary/10", text: "text-primary", pip: "bg-primary" },
  }
  const colors = colorMap[type]
  if (dismissed) return null
  return (
    <div className={`bg-card border ${colors.border} rounded-xl p-5 hover:shadow-lg hover:shadow-primary/5 transition-all group`}>
      <div className="flex items-start gap-3">
        <div className={`w-1 h-full min-h-16 rounded-full ${colors.pip} shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-[10px] font-bold text-primary-foreground font-mono">
              AI
            </div>
            <h3 className="text-[13px] font-medium text-foreground flex-1">{title}</h3>
            {onDismiss && (
              <button onClick={onDismiss} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground text-[11px] font-mono">
                ✕
              </button>
            )}
          </div>
          <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">{description}</p>
          <div className="flex items-center justify-between">
            <button className={`text-[11px] px-3 py-1.5 rounded-lg ${colors.bg} ${colors.text} font-mono hover:opacity-80 transition-opacity`} onClick={onAction}>
              {action} →
            </button>
            <span className={`text-[10px] font-mono ${colors.text}`}>{impact}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, change, positive }: { label: string; value: string; change: string; positive: boolean }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
      <div className="text-[11px] text-muted-foreground font-mono uppercase tracking-wide mb-2">{label}</div>
      <div className="text-2xl font-semibold text-foreground mb-1">{value}</div>
      <div className={`text-[11px] font-mono ${positive ? "text-[#00C896]" : "text-destructive"}`}>{change}</div>
    </div>
  )
}

// ---------- PAGE ----------
export default function AIInsightsPage() {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())
  const [tab, setTab] = useState<"all" | "critical" | "success">("all")
  const [toast, setToast] = useState("")

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  const insights = [
    { type: "critical" as const, title: "Urgent: Shoes Stock Critical", description: "Only 12 units remaining. Based on current sales velocity (6 units/day), stock will be depleted in 2 days. Order minimum 50 units immediately to avoid stockout.", action: "Auto-order now", impact: "Potential loss: ₹18,000" },
    { type: "warning" as const, title: "Slow-Moving Inventory: T-shirts", description: "76 T-shirts unsold for 3 weeks. Apply 20% discount to clear stock. AI predicts this will sell 60% of inventory within 5 days.", action: "Apply discount", impact: "Recovery: ₹12,000" },
    { type: "success" as const, title: "High Demand: Caps", description: "Caps demand increased by 18% this week due to festival season. Increase stock by 30 units to capture additional revenue.", action: "Increase stock", impact: "Extra revenue: ₹8,500" },
    { type: "info" as const, title: "Festival Preparation: Eid Weekend", description: "Eid weekend is in 5 days. Historical data shows 2x sales during this period. Pre-stock top 3 products and adjust staffing.", action: "View plan", impact: "Expected boost: ₹45,000" },
    { type: "success" as const, title: "Pricing Opportunity: Watches", description: "Competitor prices increased by 8%. You can raise prices by 5% without affecting demand. Potential margin improvement.", action: "Adjust pricing", impact: "Margin gain: ₹3,200" },
    { type: "warning" as const, title: "Customer Sentiment Alert", description: "Recent reviews mention size chart issues. 3 returns in last week due to wrong sizing. Update size guide and product descriptions.", action: "Fix size guide", impact: "Reduce returns: ₹2,100" },
  ]

  const filtered = tab === "all" ? insights : insights.filter(i => i.type === tab)

  return (
    <>
      <TopBar title="AI Insights" subtitle="Real-time AI-powered business recommendations" />

      {/* AI Banner */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/25 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-lg font-bold text-primary-foreground font-mono shrink-0">
            AI
          </div>
          <div className="flex-1">
            <div className="text-[10px] text-primary font-mono tracking-[0.08em] uppercase mb-2">AI Analysis Summary</div>
            <h2 className="text-lg font-semibold text-foreground mb-2">3 Critical Actions Required Today</h2>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
              Based on your sales data, inventory levels, and upcoming events, I&apos;ve identified key opportunities
              that could increase your revenue by <span className="text-[#00C896] font-medium">₹45,000</span> this week.
            </p>
            <div className="flex gap-2">
              <button onClick={() => showToast("✓ Executing all recommendations — AI is processing your actions...")} className="text-[12px] px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Execute all recommendations
              </button>
              <button onClick={() => showToast("Switching to individual review mode...")} className="text-[12px] px-4 py-2 bg-card border border-input text-muted-foreground rounded-lg hover:text-foreground transition-colors">
                Review individually
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatCard label="Insights Generated" value="24" change="+8 today" positive />
        <StatCard label="Actions Taken" value="18" change="75% adoption rate" positive />
        <StatCard label="Revenue Impact" value="₹1.2L" change="+23% vs last week" positive />
        <StatCard label="Accuracy Rate" value="94%" change="+2% improvement" positive />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {/* Accuracy History */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-[13px] font-medium text-foreground mb-4">AI Accuracy (6 Weeks)</h3>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={accuracyHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="accGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4ECDC4" />
                  <stop offset="100%" stopColor="#6C63FF" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fill: "#888", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <YAxis domain={[85, 100]} tick={{ fill: "#888", fontSize: 9, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="accuracy" stroke="url(#accGrad)" strokeWidth={2.5}
                dot={{ fill: "#6C63FF", r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-[10px] text-[#00C896] font-mono mt-2">↑ Improving trend · 94% this week</div>
        </div>

        {/* Revenue Impact */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-[13px] font-medium text-foreground mb-4">Revenue Impact (₹)</h3>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={impactData} margin={{ top: 5, right: 10, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C896" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00C896" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fill: "#888", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fill: "#888", fontSize: 9, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="impact" stroke="#00C896" strokeWidth={2} fill="url(#impGrad)"
                dot={{ fill: "#00C896", r: 3 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="text-[10px] text-[#00C896] font-mono mt-2">+244% growth · ₹1.2L total impact</div>
        </div>

        {/* Radar — AI Coverage */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-[13px] font-medium text-foreground mb-2">AI Intelligence Coverage</h3>
          <ResponsiveContainer width="100%" height={155}>
            <RadarChart data={radarData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#888", fontSize: 9, fontFamily: "monospace" }} />
              <Radar dataKey="A" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.2} strokeWidth={2} dot={{ r: 3, fill: "#6C63FF" }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="bg-card border border-border rounded-lg px-3 py-2 text-[11px] shadow-xl">
                        <span className="text-primary font-mono">{payload[0].payload.subject}: </span>
                        <span className="text-foreground font-mono font-semibold">{payload[0].value}%</span>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Filter Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[13px] font-medium text-foreground">AI Recommendations</span>
        <div className="flex gap-1.5 ml-auto">
          {(["all", "critical", "success"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-[11px] px-3 py-1.5 rounded-lg font-mono transition-colors capitalize ${tab === t ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
              {t === "all" ? `All (${insights.length})` : t === "critical" ? "⚠ Alerts" : "✓ Opportunities"}
            </button>
          ))}
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((insight, i) => (
          <InsightCard
            key={i}
            {...insight}
            dismissed={dismissed.has(i)}
            onDismiss={() => setDismissed(prev => new Set([...prev, i]))}
            onAction={() => showToast(`✓ Action initiated: "${insight.action}" — AI is processing...`)}
          />
        ))}
      </div>

      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
    </>
  )
}
