
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

  // Elegant VEDA branding and Pro status
  const appName = "VEDA";
  const appDesc = "Vitana Educational Application";
  // Show Pro badge for all users if schoolInfo.plan is 'Pro'
  const isPro = (schoolInfo as any)?.plan === 'Pro';

  const handleLogoClick = () => {
    navigate('/login');
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div 
          className="flex flex-col items-start justify-center px-4 py-3 cursor-pointer hover:bg-accent/50 rounded-lg transition-colors" 
          onClick={handleLogoClick}
        >
          {/* Elegant VEDA Brand Name with Gradient and Icon */}
          <div className="flex items-center gap-2 mb-1">
            <span className="relative text-4xl font-black tracking-widest bg-gradient-to-r from-blue-600 via-fuchsia-500 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(99,102,241,0.25)]" style={{letterSpacing: '0.18em', fontFamily: 'Montserrat, Inter, sans-serif'}}>
              VEDA
              <span className="align-super text-xs font-bold ml-1 text-primary">™</span>
              <span className="absolute left-0 bottom-[-6px] w-full h-1 bg-gradient-to-r from-blue-400 via-fuchsia-400 to-amber-300 rounded-full opacity-70"></span>
            </span>
          </div>
          <span className="text-xs font-semibold tracking-wide bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">{appDesc}</span>
          {isPro && (
            <span className="inline-block bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg mt-1 border-2 border-amber-300 animate-pulse" style={{boxShadow: '0 2px 8px rgba(251,191,36,0.25)'}}>
              <span className="inline-block align-middle mr-1" style={{filter: 'drop-shadow(0 0 4px #fde68a)'}}>★</span>Pro
            </span>
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
