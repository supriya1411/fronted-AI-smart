"use client"

import { useState } from "react"
import { TopBar } from "@/components/topbar"
import {
  AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadialBarChart, RadialBar,
  LineChart, Line
} from "recharts"

// ---------- DATA ----------
const weeklyRevenueData = [
  { day: "Mon", revenue: 62000, prev: 54000 },
  { day: "Tue", revenue: 71000, prev: 61000 },
  { day: "Wed", revenue: 58000, prev: 52000 },
  { day: "Thu", revenue: 88000, prev: 70000 },
  { day: "Fri", revenue: 95000, prev: 80000 },
  { day: "Sat", revenue: 120000, prev: 95000 },
  { day: "Sun", revenue: 84000, prev: 73000 },
]

const forecastData = [
  { day: "Mon", forecast: 82000 },
  { day: "Tue", forecast: 91000 },
  { day: "Wed", forecast: 87000 },
  { day: "Thu", forecast: 105000 },
  { day: "Fri", forecast: 118000 },
  { day: "Sat", forecast: 145000 },
  { day: "Sun", forecast: 160000 },
]

const productData = [
  { name: "Shoes", value: 88, fill: "#6C63FF" },
  { name: "Bags", value: 63, fill: "#4ECDC4" },
  { name: "Caps", value: 71, fill: "#00C896" },
  { name: "T-shirts", value: 24, fill: "#FF4F6A" },
  { name: "Watches", value: 55, fill: "#FFD166" },
]

const sentimentData = [
  { label: "Positive", value: 74, fill: "#00C896" },
  { label: "Neutral", value: 18, fill: "#FFD166" },
  { label: "Negative", value: 8, fill: "#FF4F6A" },
]

// ---------- CUSTOM TOOLTIP ----------
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl text-[12px]">
        <div className="text-muted-foreground font-mono mb-1.5">{label}</div>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-foreground font-mono">
              {entry.name === "revenue" || entry.name === "forecast" || entry.name === "prev"
                ? `₹${(entry.value / 1000).toFixed(0)}k`
                : `${entry.value}%`}
            </span>
            <span className="text-muted-foreground capitalize">{entry.name}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// ---------- METRIC CARD ----------
function MetricCard({
  icon, iconBg, trend, trendColor, trendBg, value, label
}: {
  icon: React.ReactNode; iconBg: string; trend: string
  trendColor: string; trendBg: string; value: string; label: string
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 transition-all hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 cursor-default">
      <div className="flex justify-between items-center mb-3">
        <div className={`w-[34px] h-[34px] rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <div className={`text-[10px] px-2 py-0.5 rounded font-mono ${trendBg} ${trendColor}`}>
          {trend}
        </div>
      </div>
      <div className="text-2xl font-semibold text-foreground tracking-tight mb-1">{value}</div>
      <div className="text-[11px] text-muted-foreground font-mono">{label}</div>
    </div>
  )
}

// ---------- ALERT ROW ----------
function AlertRow({ pipColor, title, subtitle, tagText, tagColor, tagBg }: {
  pipColor: string; title: string; subtitle: string
  tagText: string; tagColor: string; tagBg: string
}) {
  return (
    <div className="flex gap-2.5 py-2.5 border-b border-border last:border-b-0 items-start">
      <div className={`w-0.5 min-h-9 rounded-sm mt-0.5 ${pipColor}`} />
      <div>
        <div className="text-[13px] text-foreground font-medium">{title}</div>
        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{subtitle}</div>
        <div className={`text-[10px] px-2 py-0.5 rounded mt-1.5 inline-block font-mono ${tagBg} ${tagColor}`}>{tagText}</div>
      </div>
    </div>
  )
}

// ---------- REVIEW ROW ----------
function ReviewRow({ name, stars, starsColor, text, tagText, tagColor, tagBg }: {
  name: string; stars: string; starsColor: string; text: string
  tagText: string; tagColor: string; tagBg: string
}) {
  return (
    <div className="py-2.5 border-b border-border last:border-b-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[13px] font-medium text-foreground">{name}</span>
        <span className={`text-[11px] tracking-wider ${starsColor}`}>{stars}</span>
      </div>
      <div className="text-[12px] text-muted-foreground leading-relaxed">{text}</div>
      <div className={`text-[10px] px-2 py-0.5 rounded mt-1.5 inline-block font-mono ${tagBg} ${tagColor}`}>{tagText}</div>
    </div>
  )
}

// ---------- PAGE ----------
export default function DashboardPage() {
  const [activeChart, setActiveChart] = useState<"weekly" | "forecast">("weekly")
  const [toast, setToast] = useState("")

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  return (
    <>
      <TopBar title="AI Business Dashboard" />

      {/* AI Banner */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/25 rounded-xl p-5 mb-6 flex items-start gap-3.5">
        <div className="w-9 h-9 bg-primary rounded-[10px] flex items-center justify-center text-[13px] font-bold text-primary-foreground font-mono shrink-0 mt-0.5">
          AI
        </div>
        <div>
          <div className="text-[10px] text-primary font-mono tracking-[0.08em] uppercase mb-1.5">AI Insight — Live recommendation</div>
          <div className="text-[13px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground font-medium">Shoes stock will run out in 2 days</strong> — order minimum 50 units now.{" "}
            <strong className="text-foreground font-medium">Apply 20% discount on T-shirts</strong> — 76 units are unsold.{" "}
            <strong className="text-foreground font-medium">Eid weekend is approaching</strong> — pre-stock your top 3 products, 2x sales expected.
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {["Reorder strategy", "Discount plan", "Festival forecast", "Pricing optimizer"].map((chip) => (
              <button key={chip} onClick={() => showToast(`Opening ${chip}...`)} className="text-[11px] bg-primary/10 border border-primary/25 text-primary/80 px-3 py-1 rounded-full font-mono hover:bg-primary/20 hover:text-white transition-colors">
                {chip} ↗
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <MetricCard
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6C63FF" strokeWidth="1.5"><polyline points="1,11 5,7 9,9 15,3" /></svg>}
          iconBg="bg-primary/10" trend="+12.4%" trendBg="bg-[#00C896]/10" trendColor="text-[#00C896]"
          value="₹84,200" label="Today's revenue"
        />
        <MetricCard
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#FF4F6A" strokeWidth="1.5"><rect x="1" y="4" width="14" height="10" rx="1.5" /><path d="M5 4V3a3 3 0 016 0v1" /></svg>}
          iconBg="bg-destructive/10" trend="3 low" trendBg="bg-destructive/10" trendColor="text-destructive"
          value="247" label="Total stock units"
        />
        <MetricCard
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#4ECDC4" strokeWidth="1.5"><circle cx="8" cy="6" r="3" /><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" /></svg>}
          iconBg="bg-accent/10" trend="+5 new" trendBg="bg-[#00C896]/10" trendColor="text-[#00C896]"
          value="1,482" label="Total customers"
        />
        <MetricCard
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#FFD166" strokeWidth="1.5"><path d="M8 1l2 4 5 .7-3.5 3.5.8 5L8 12l-4.3 2.2.8-5L1 5.7 6 5z" /></svg>}
          iconBg="bg-[#FFD166]/10" trend="74% pos" trendBg="bg-[#00C896]/10" trendColor="text-[#00C896]"
          value="4.2 / 5" label="Avg customer rating"
        />
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-[1.6fr_1fr] gap-3 mb-3">
        {/* Revenue Chart — toggle weekly / forecast */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[13px] font-medium text-foreground">Revenue Overview (₹ thousands)</h3>
            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveChart("weekly")}
                className={`text-[11px] px-3 py-1 rounded-lg font-mono transition-colors ${activeChart === "weekly" ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
              >
                This Week
              </button>
              <button
                onClick={() => setActiveChart("forecast")}
                className={`text-[11px] px-3 py-1 rounded-lg font-mono transition-colors ${activeChart === "forecast" ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
              >
                Forecast
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            {activeChart === "weekly" ? (
              <AreaChart data={weeklyRevenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: "#888", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fill: "#888", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="prev" name="prev" stroke="#4ECDC4" strokeWidth={1.5} fill="url(#prevGrad)" strokeDasharray="4 2" dot={false} />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="#6C63FF" strokeWidth={2} fill="url(#revGrad)" dot={{ fill: "#6C63FF", r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            ) : (
              <AreaChart data={forecastData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="foreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: "#888", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fill: "#888", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="forecast" name="forecast" stroke="#4ECDC4" strokeWidth={2} fill="url(#foreGrad)" dot={{ fill: "#4ECDC4", r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            )}
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            {activeChart === "weekly" ? (
              <>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                  <div className="w-2 h-2 rounded-sm bg-primary" /> This week
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                  <div className="w-2 h-2 rounded-sm bg-accent" /> Last week
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5 text-[10px] text-[#00C896] font-mono">
                ↑ +38% weekend surge predicted · Eid effect
              </div>
            )}
          </div>
        </div>

        {/* Product Performance — RadialBarChart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[13px] font-medium text-foreground">Product Performance</h3>
            <span onClick={() => showToast("Opening product details...")} className="text-[11px] text-muted-foreground font-mono cursor-pointer hover:text-primary transition-colors">Details →</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <RadialBarChart
              innerRadius="25%" outerRadius="100%"
              data={productData} startAngle={90} endAngle={-270}
              barSize={10}
            >
              <RadialBar dataKey="value" cornerRadius={4} background={{ fill: "rgba(255,255,255,0.03)" }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    const d = payload[0].payload
                    return (
                      <div className="bg-card border border-border rounded-lg px-3 py-2 text-[11px] shadow-xl">
                        <span className="text-foreground font-mono">{d.name}: </span>
                        <span style={{ color: d.fill }} className="font-mono font-semibold">{d.value}%</span>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
            {productData.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: p.fill }} />
                {p.name} <span className="ml-auto" style={{ color: p.fill }}>{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* Smart Alerts */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[13px] font-medium text-foreground">Smart alerts</h3>
            <span onClick={() => showToast("Loading all alerts...")} className="text-[11px] text-muted-foreground font-mono cursor-pointer hover:text-primary transition-colors">All alerts →</span>
          </div>
          <AlertRow pipColor="bg-destructive" title="Shoes — critical stock" subtitle="Runs out in 2 days · 12 units left" tagText="Order now" tagBg="bg-destructive/10" tagColor="text-destructive" />
          <AlertRow pipColor="bg-[#FFA940]" title="T-shirts — slow moving" subtitle="76 units unsold · 3 weeks" tagText="Apply discount" tagBg="bg-[#FFA940]/10" tagColor="text-[#FFA940]" />
          <AlertRow pipColor="bg-[#00C896]" title="Caps — demand rising" subtitle="+18% this week · festival season" tagText="Increase stock" tagBg="bg-[#00C896]/10" tagColor="text-[#00C896]" />
          <AlertRow pipColor="bg-primary" title="Eid weekend prediction" subtitle="In 5 days · 2x sales expected" tagText="Prepare now" tagBg="bg-primary/10" tagColor="text-primary/80" />
        </div>

        {/* Customer Sentiment - Bar */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[13px] font-medium text-foreground">Customer reviews AI</h3>
            <span onClick={() => showToast("Loading all reviews...")} className="text-[11px] text-muted-foreground font-mono cursor-pointer hover:text-primary transition-colors">All reviews →</span>
          </div>
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={sentimentData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#888", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#888", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    const d = payload[0].payload
                    return (
                      <div className="bg-card border border-border rounded-lg px-3 py-2 text-[11px] shadow-xl">
                        <span className="text-foreground font-mono">{d.label}: </span>
                        <span style={{ color: d.fill }} className="font-mono font-semibold">{d.value}%</span>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {sentimentData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            <ReviewRow name="Rahul S." stars="★★★★★" starsColor="text-[#FFD166]" text={`"The shoe quality is excellent!"`} tagText="Positive" tagBg="bg-[#00C896]/10" tagColor="text-[#00C896]" />
            <ReviewRow name="Priya M." stars="★★☆☆☆" starsColor="text-destructive" text={`"T-shirt stitching came apart after 2 washes"`} tagText="Negative" tagBg="bg-destructive/10" tagColor="text-destructive" />
          </div>
        </div>

        {/* 7-Day Forecast — LineChart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[13px] font-medium text-foreground">7-day forecast</h3>
            <span onClick={() => showToast("Opening full forecast report...")} className="text-[11px] text-muted-foreground font-mono cursor-pointer hover:text-primary transition-colors">Full report →</span>
          </div>
          <ResponsiveContainer width="100%" height={110}>
            <LineChart data={forecastData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="100%" stopColor="#4ECDC4" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: "#888", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fill: "#888", fontSize: 9, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="forecast" name="forecast" stroke="url(#lineGrad)" strokeWidth={2.5} dot={{ fill: "#6C63FF", r: 3 }} activeDot={{ r: 5, fill: "#4ECDC4" }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex justify-between text-[12px]">
              <span className="text-muted-foreground">Projected weekly revenue</span>
              <span className="text-foreground font-mono font-medium">₹5.8L</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-muted-foreground">Best selling day</span>
              <span className="text-accent font-mono">Sunday</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-muted-foreground">AI confidence</span>
              <span className="text-[#00C896] font-mono">94%</span>
            </div>
          </div>
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
    </>
  )
}
