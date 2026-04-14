"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const mainNavItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
        <rect x="1" y="1" width="6" height="6" rx="1.5"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5"/>
      </svg>
    ),
  },
  {
    name: "AI Insights",
    href: "/ai-insights",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
        <circle cx="8" cy="8" r="6"/>
        <path d="M8 4v4l3 2"/>
      </svg>
    ),
    badge: "3",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
        <polyline points="1,11 5,7 9,9 15,3"/>
      </svg>
    ),
  },
  {
    name: "Data",
    href: "/data",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
        <path d="M2 12V5l6-3 6 3v7"/>
        <rect x="6" y="8" width="4" height="4"/>
      </svg>
    ),
  },
  {
    name: "Settings",
    href: "/settings",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
        <circle cx="8" cy="8" r="2.5"/>
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"/>
      </svg>
    ),
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[230px] bg-card border-r border-border flex flex-col h-screen sticky top-0 shrink-0 max-md:hidden">
      <div className="p-5 pb-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] bg-primary rounded-lg flex items-center justify-center text-[13px] font-semibold text-primary-foreground">
            B
          </div>
          <span className="text-[15px] font-semibold text-foreground">BizAI Pro</span>
        </Link>
      </div>

      <div className="text-[9px] text-muted-foreground font-mono tracking-[0.1em] uppercase px-5 mt-4 mb-1.5">
        Main
      </div>

      <nav className="flex-1">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname?.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-5 py-2.5 text-[13px] transition-all border-l-2 border-transparent",
                isActive 
                  ? "text-white bg-sidebar-accent border-l-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
              {item.badge && (
                <span className="ml-auto bg-destructive text-white text-[9px] px-1.5 py-0.5 rounded-full font-mono">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto p-5 border-t border-border">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-[34px] h-[34px] rounded-full bg-primary/20 flex items-center justify-center text-[12px] font-semibold text-primary shrink-0">
            AK
          </div>
          <div>
            <div className="text-[13px] font-medium text-foreground">Arjun Kumar</div>
            <div className="text-[11px] text-muted-foreground font-mono">Business Owner</div>
          </div>
        </div>
        <Link 
          href="/"
          className="w-full py-2 bg-transparent border border-input rounded-md text-muted-foreground text-[12px] hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all flex items-center justify-center"
        >
          Sign out
        </Link>
      </div>
    </aside>
  )
}
