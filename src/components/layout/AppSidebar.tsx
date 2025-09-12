import * as React from "react"
import { GraduationCap, Users, UserCheck, Calendar, BookOpen, Award, FileText, Clock, Bus, Heart, DollarSign, MessageSquare, Megaphone, FileImage, CreditCard, BarChart3, Settings, User } from "lucide-react"
import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { usePermissions } from "@/contexts/PermissionsContext"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const { hasPermission } = usePermissions()

  // Define navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return []

    const baseItems = []

    // Super Admin has access to everything except Library and Health
    if (user.role === 'super_admin') {
      return [
        ...baseItems,
        {
          title: "Academics",
          url: "/academics",
          icon: BookOpen,
        },
        {
          title: "Students",
          url: "/students",
          icon: Users,
        },
        {
          title: "Staff",
          url: "/staff", 
          icon: UserCheck,
        },
        {
          title: "Examinations",
          url: "/examinations",
          icon: FileText,
        },
        // Library and Health hidden for super_admin
        {
          title: "Fees",
          url: "/fees",
          icon: DollarSign,
        },
        {
          title: "Communication",
          url: "/communication",
          icon: MessageSquare,
        },
        // REMOVE Documents and ID Cards for super_admin
        // {
        //   title: "Documents",
        //   url: "/documents",
        //   icon: FileText,
        // },
        // {
        //   title: "ID Cards",
        //   url: "/id-cards",
        //   icon: CreditCard,
        // },
        {
          title: "Alumni",
          url: "/alumni",
          icon: GraduationCap,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        }
      ]
    }

    // Admin has access to most features except Library and Health
    if (user.role === 'admin') {
      return [
        ...baseItems,
        {
          title: "Academics",
          url: "/academics",
          icon: BookOpen,
        },
        {
          title: "Students",
          url: "/students",
          icon: Users,
        },
        {
          title: "Staff",
          url: "/staff",
          icon: UserCheck,
        },
  // Examinations hidden for admin
        // Library and Health hidden for admin
        {
          title: "Fees",
          url: "/fees",
          icon: DollarSign,
        },
        {
          title: "Communication",
          url: "/communication",
          icon: MessageSquare,
        },
        // REMOVE Documents and ID Cards for admin
        // {
        //   title: "Documents",
        //   url: "/documents",
        //   icon: FileText,
        // },
        // {
        //   title: "ID Cards",
        //   url: "/id-cards",
        //   icon: CreditCard,
        // },
        {
          title: "Alumni",
          url: "/alumni",
          icon: GraduationCap,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        }
      ]
    }

    // Staff has limited access
    if (user.role === 'staff') {
      return [
        ...baseItems,
        {
          title: "My Classes",
          url: "/my-classes",
          icon: GraduationCap,
        },
        {
          title: "Assignments",
          url: "/assignments",
          icon: FileText,
        },
        {
          title: "Attendance",
          url: "/attendance",
          icon: UserCheck,
        },
        {
          title: "Communication",
          url: "/communication", 
          icon: MessageSquare,
        }
      ]
    }

    // Parent has minimal access
    if (user.role === 'parent') {
      return [
        ...baseItems,
        {
          title: "Child Profile",
          url: "/child-profile",
          icon: User,
        },
        {
          title: "Fees",
          url: "/parent-fees",
          icon: DollarSign,
        },
        {
          title: "Notifications",
          url: "/parent-notifications",
          icon: MessageSquare,
        }
      ]
    }

    return baseItems
  }

  const navigationItems = getNavigationItems()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* Always show premium VEDA branding for all roles */}
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationItems} />
        {/* NavProjects removed as requested */}
      </SidebarContent>
      {/* SidebarFooter removed, NavUser will be moved to Header */}
      <SidebarRail />
    </Sidebar>
  )
}
