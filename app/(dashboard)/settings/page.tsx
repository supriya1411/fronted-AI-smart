"use client"

import { useState } from "react"
import { TopBar } from "@/components/topbar"

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-4">
      <h3 className="text-[14px] font-medium text-foreground mb-4">{title}</h3>
      {children}
    </div>
  )
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0 last:pb-0 first:pt-0">
      <div>
        <div className="text-[13px] text-foreground">{label}</div>
        {description && <div className="text-[11px] text-muted-foreground mt-0.5">{description}</div>}
      </div>
      {children}
    </div>
  )
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-10 h-5 rounded-full transition-colors relative ${enabled ? "bg-primary" : "bg-secondary"}`}
      aria-pressed={enabled}
    >
      <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  )
}

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] bg-card border border-border rounded-xl px-5 py-3 shadow-2xl flex items-center gap-3 text-[13px] text-foreground">
      <div className="w-2 h-2 rounded-full bg-[#00C896]" />
      {msg}
      <button onClick={onClose} className="ml-2 text-muted-foreground hover:text-foreground text-[11px]">✕</button>
    </div>
  )
}

export default function SettingsPage() {
  const [toast, setToast] = useState("")

  // Profile fields
  const [businessName, setBusinessName] = useState("Kumar Fashion Store")
  const [email, setEmail] = useState("arjun@business.com")
  const [phone, setPhone] = useState("+91 98765 43210")

  // AI Preferences toggles
  const [autoRec, setAutoRec] = useState(true)
  const [dailyDigest, setDailyDigest] = useState(true)
  const [criticalAlerts, setCriticalAlerts] = useState(true)
  const [festivalPred, setFestivalPred] = useState(false)

  // Notification toggles
  const [pushNotif, setPushNotif] = useState(true)
  const [emailNotif, setEmailNotif] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  function handleSaveProfile() {
    if (!businessName.trim() || !email.trim()) {
      showToast("Please fill in all required fields.")
      return
    }
    showToast("✓ Profile saved successfully!")
  }

  return (
    <>
      <TopBar title="Settings" subtitle="Manage your account and preferences" />

      <div className="grid grid-cols-[1fr_300px] gap-6">
        <div>
          {/* Profile Settings */}
          <SettingSection title="Profile Settings">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-semibold text-primary">
                AK
              </div>
              <div>
                <div className="text-[15px] font-medium text-foreground">Arjun Kumar</div>
                <div className="text-[12px] text-muted-foreground">arjun@business.com</div>
                <button
                  onClick={() => showToast("Opening file picker to change avatar...")}
                  className="text-[11px] text-primary font-mono mt-1 hover:underline"
                >
                  Change avatar
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-muted-foreground font-mono uppercase tracking-wide block mb-1.5">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full h-10 px-3 bg-secondary border border-input rounded-lg text-[13px] text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-mono uppercase tracking-wide block mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 bg-secondary border border-input rounded-lg text-[13px] text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-mono uppercase tracking-wide block mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 bg-secondary border border-input rounded-lg text-[13px] text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                className="h-10 px-6 bg-primary text-primary-foreground rounded-lg text-[13px] font-medium hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </SettingSection>

          {/* AI Settings */}
          <SettingSection title="AI Preferences">
            <SettingRow label="Auto-recommendations" description="Get automatic AI suggestions for inventory and pricing">
              <Toggle enabled={autoRec} onToggle={() => { setAutoRec(!autoRec); showToast(`Auto-recommendations ${!autoRec ? "enabled" : "disabled"}`) }} />
            </SettingRow>
            <SettingRow label="Daily digest email" description="Receive daily AI insights via email">
              <Toggle enabled={dailyDigest} onToggle={() => { setDailyDigest(!dailyDigest); showToast(`Daily digest email ${!dailyDigest ? "enabled" : "disabled"}`) }} />
            </SettingRow>
            <SettingRow label="Critical alerts" description="Instant notifications for urgent issues">
              <Toggle enabled={criticalAlerts} onToggle={() => { setCriticalAlerts(!criticalAlerts); showToast(`Critical alerts ${!criticalAlerts ? "enabled" : "disabled"}`) }} />
            </SettingRow>
            <SettingRow label="Festival predictions" description="AI predictions for upcoming festivals and events">
              <Toggle enabled={festivalPred} onToggle={() => { setFestivalPred(!festivalPred); showToast(`Festival predictions ${!festivalPred ? "enabled" : "disabled"}`) }} />
            </SettingRow>
          </SettingSection>

          {/* Notification Settings */}
          <SettingSection title="Notifications">
            <SettingRow label="Push notifications" description="Browser notifications for alerts">
              <Toggle enabled={pushNotif} onToggle={() => { setPushNotif(!pushNotif); showToast(`Push notifications ${!pushNotif ? "enabled" : "disabled"}`) }} />
            </SettingRow>
            <SettingRow label="Email notifications" description="Email updates for important events">
              <Toggle enabled={emailNotif} onToggle={() => { setEmailNotif(!emailNotif); showToast(`Email notifications ${!emailNotif ? "enabled" : "disabled"}`) }} />
            </SettingRow>
            <SettingRow label="SMS alerts" description="Text messages for critical stock issues">
              <Toggle enabled={smsAlerts} onToggle={() => { setSmsAlerts(!smsAlerts); showToast(`SMS alerts ${!smsAlerts ? "enabled" : "disabled"}`) }} />
            </SettingRow>
          </SettingSection>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-card border border-border rounded-xl p-5 mb-4">
            <h3 className="text-[14px] font-medium text-foreground mb-3">Subscription</h3>
            <div className="bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/25 rounded-lg p-4 mb-4">
              <div className="text-[10px] text-primary font-mono uppercase tracking-wide mb-1">Current Plan</div>
              <div className="text-lg font-semibold text-foreground">Pro Plan</div>
              <div className="text-[12px] text-muted-foreground mt-1">₹999/month</div>
            </div>
            <div className="space-y-2 text-[12px]">
              {["Unlimited AI insights", "Advanced forecasting", "Priority support"].map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-muted-foreground">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="size-3 text-[#00C896]">
                    <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
                  </svg>
                  {feat}
                </div>
              ))}
            </div>
            <button
              onClick={() => showToast("Opening subscription management portal...")}
              className="w-full mt-4 py-2 bg-secondary border border-input rounded-lg text-[12px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Manage subscription
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-[14px] font-medium text-foreground mb-3">Danger Zone</h3>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                  showToast("Account deletion request submitted. You will receive a confirmation email.")
                }
              }}
              className="w-full py-2 bg-destructive/10 border border-destructive/30 rounded-lg text-[12px] text-destructive hover:bg-destructive/20 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
    </>
  )
}
