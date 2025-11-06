
import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { useSchool } from "@/contexts/SchoolContext"
import { useNavigate } from "react-router-dom"

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const { user } = useAuth()
  const { schoolInfo } = useSchool()
  const navigate = useNavigate()

  const appName = "VEDA";
  const appDesc = "Vitana Educational Application";
  const isPro = (schoolInfo as any)?.plan === 'Pro';

  const handleLogoClick = () => {
    navigate('/login');
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div 
          className="group relative flex flex-col items-start justify-center px-4 py-5 cursor-pointer hover:bg-gradient-to-br hover:from-primary/5 hover:via-accent/5 hover:to-primary/5 rounded-2xl transition-all duration-300 overflow-hidden border border-transparent hover:border-primary/10" 
          onClick={handleLogoClick}
        >
          {/* Subtle premium glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 opacity-40 blur-2xl group-hover:opacity-60 transition-all duration-500" />
          
          {/* Brand Name with ultra-premium platinum styling */}
          <div className="relative flex items-baseline gap-2 mb-2">
            <span 
              className="text-4xl font-black tracking-[0.15em] bg-gradient-to-r from-slate-100 via-white to-slate-100 bg-clip-text text-transparent drop-shadow-[0_2px_25px_rgba(255,255,255,0.95)] transition-all duration-300 group-hover:drop-shadow-[0_4px_30px_rgba(255,255,255,1)] font-brand" 
              style={{
                WebkitTextStroke: '0.8px rgba(203,213,225,0.6)',
                filter: 'brightness(1.5) contrast(1.2)',
                backgroundImage: 'linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 20%, #C0C0C0 40%, #A8A8A8 50%, #C0C0C0 60%, #E8E8E8 80%, #F5F5F5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 10px rgba(255,255,255,0.3), 0 0 20px rgba(192,192,192,0.4), 0 4px 30px rgba(168,168,168,0.2)',
                letterSpacing: '0.02em',
              }}
            >
              VEDA
              <span className="align-super text-[11px] font-bold ml-1 text-slate-200">™</span>
            </span>
            <span 
              className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold tracking-wider rounded-full shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #E8E8E8, #C0C0C0)',
                color: 'hsl(var(--foreground))',
              }}
            >
              BETA
            </span>
          </div>
          
          {/* Description with refined platinum styling */}
          <span className="relative text-[11px] font-semibold tracking-[0.04em] text-slate-300/90 transition-all duration-200 group-hover:text-slate-200">
            {appDesc}
          </span>
          
          {/* Premium Pro Badge */}
          {isPro && (
            <div className="relative mt-3 inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-amber-950 text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-amber-200 hover:shadow-xl hover:scale-[1.03] transition-all duration-200">
              <span className="text-amber-900 text-xs">✦</span>
              <span className="tracking-wide">PRO</span>
            </div>
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
