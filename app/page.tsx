"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="flex-[1.1] bg-card border-r border-border flex flex-col justify-between p-10 relative overflow-hidden max-md:hidden">
        {/* Decorative gradients */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[radial-gradient(circle,rgba(108,99,255,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 bg-[radial-gradient(circle,rgba(78,205,196,0.1)_0%,transparent_70%)] pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 bg-primary rounded-[10px] flex items-center justify-center text-[16px] font-semibold text-primary-foreground">
            B
          </div>
          <span className="text-[17px] font-semibold text-foreground">BizAI Pro</span>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-primary/15 border border-primary/30 rounded-full px-3 py-1 text-[11px] text-primary font-mono mb-6">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            AI-Powered · Real-time · Intelligent
          </div>
          <h1 className="text-[32px] font-semibold leading-[1.25] text-foreground mb-4">
            Smart decisions<br />that grow your<br /><span className="text-primary">business.</span>
          </h1>
          <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[380px] mb-8">
            Your AI Business Advisor — analyzes sales data, understands demand, and automatically suggests the best decisions to grow your business.
          </p>
          <div className="flex gap-6">
            <div>
              <div className="text-2xl font-semibold text-foreground">12k+</div>
              <div className="text-[11px] text-muted-foreground font-mono mt-1">Businesses</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">98%</div>
              <div className="text-[11px] text-muted-foreground font-mono mt-1">Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">3.2x</div>
              <div className="text-[11px] text-muted-foreground font-mono mt-1">Avg ROI</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-2.5 relative z-10">
          {[
            "Real-time stock & demand alerts",
            "AI-driven pricing & discount strategy",
            "Customer sentiment analysis",
            "7-day revenue forecasting"
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[400px]">
          <h2 className="text-[22px] font-semibold text-foreground mb-1">Welcome back</h2>
          <p className="text-[13px] text-muted-foreground mb-7">Sign in to your AI dashboard</p>

          {/* Social Login */}
          <div className="flex flex-col gap-2 mb-5">
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2.5 px-4 py-3 bg-card border border-input rounded-lg text-[13px] text-foreground hover:bg-secondary hover:border-white/20 transition-all w-full text-left"
            >
              <svg viewBox="0 0 24 24" className="size-[18px] shrink-0">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="flex-1">Continue with Google</span>
              <span className="text-muted-foreground text-[12px]">→</span>
            </button>
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2.5 px-4 py-3 bg-card border border-input rounded-lg text-[13px] text-foreground hover:bg-secondary hover:border-white/20 transition-all w-full text-left"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px] shrink-0">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span className="flex-1">Continue with GitHub</span>
              <span className="text-muted-foreground text-[12px]">→</span>
            </button>
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2.5 px-4 py-3 bg-card border border-input rounded-lg text-[13px] text-foreground hover:bg-secondary hover:border-white/20 transition-all w-full text-left"
            >
              <svg viewBox="0 0 24 24" fill="#1877F2" className="size-[18px] shrink-0">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="flex-1">Continue with Facebook</span>
              <span className="text-muted-foreground text-[12px]">→</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 my-5 text-muted-foreground text-[11px] font-mono">
            <div className="flex-1 h-px bg-border" />
            or use email
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email Form */}
          <div className="space-y-4">
            <div>
              <label className="text-[11px] text-muted-foreground font-mono tracking-[0.05em] uppercase block mb-1.5">
                Email address
              </label>
              <input 
                type="email" 
                placeholder="arjun@business.com"
                className="w-full h-[42px] px-3.5 pr-11 bg-card border border-input rounded-lg text-[14px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-mono tracking-[0.05em] uppercase block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  className="w-full h-[42px] px-3.5 pr-11 bg-card border border-input rounded-lg text-[14px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-base"
                >
                  {showPassword ? "👁" : "👁‍🗨"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center my-5 text-[12px]">
            <label className="flex items-center gap-1.5 text-muted-foreground cursor-pointer">
              <input type="checkbox" className="accent-primary" />
              Remember me
            </label>
            <span className="text-primary cursor-pointer hover:underline">Forgot password?</span>
          </div>

          <button 
            onClick={handleLogin}
            className="w-full h-11 bg-primary rounded-lg text-primary-foreground text-[14px] font-semibold hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            Sign in to dashboard →
          </button>

          <p className="text-center text-[13px] text-muted-foreground mt-5">
            New to BizAI Pro?{" "}
            <span onClick={handleLogin} className="text-primary cursor-pointer hover:underline">
              Create free account
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
