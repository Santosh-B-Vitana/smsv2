import * as React from "react"
import { GraduationCap, Users, UserCheck, Calendar, BookOpen, Award, FileText, Clock, Bus, Heart, DollarSign, MessageSquare, Megaphone, FileImage, CreditCard, BarChart3, Settings, User, Building, Library, Wallet, School, ShoppingBag, LayoutDashboard, Shield, UserCog, Home } from "lucide-react"
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
import { useLanguage } from "@/contexts/LanguageContext"
import { shouldShowModule } from "@/config/moduleVisibility"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const { hasPermission } = usePermissions()
  const { t } = useLanguage()

  // Define navigation items based on user role with grouped sections
  const getNavigationItems = () => {
    if (!user) return []

    const baseItems = []

    // Super Admin and Admin have similar structured navigation
    if (user.role === 'super_admin' || user.role === 'admin') {
      const items = [
        // OVERVIEW Section
        {
          title: "OVERVIEW",
          isLabel: true,
        },
        {
          title: t('nav.dashboard'),
          url: user.role === 'super_admin' ? "/super-admin-dashboard" : "/admin-dashboard",
          icon: LayoutDashboard,
        },

        // PEOPLE & ENROLLMENT Section
        {
          title: "PEOPLE & ENROLLMENT",
          isLabel: true,
        },
        {
          title: t('nav.students'),
          url: "/students",
          icon: Users,
        },
        {
          title: t('nav.staff'),
          url: "/staff",
          icon: UserCheck,
        },

        // ACADEMICS & ASSESSMENT Section
        {
          title: "ACADEMICS & ASSESSMENT",
          isLabel: true,
        },
        {
          title: t('nav.academicSetup'),
          url: "/academics",
          icon: BookOpen,
        },
        {
          title: t('nav.examinations'),
          url: "/examinations",
          icon: Award,
        },
        {
          title: t('nav.timetable'),
          url: "/timetable",
          icon: Clock,
        },

        // FINANCE & ADMINISTRATION Section
        {
          title: "FINANCE & ADMINISTRATION",
          isLabel: true,
        },
        {
          title: t('nav.fees'),
          url: "/fees",
          icon: DollarSign,
        },
        ...(shouldShowModule('library') ? [{
          title: t('nav.library'),
          url: "/library",
          icon: Library,
        }] : []),
        {
          title: t('nav.roleManagement'),
          url: "/configuration-settings",
          icon: Shield,
        },

        // STUDENT SUPPORT SERVICES Section
        {
          title: "STUDENT SUPPORT SERVICES",
          isLabel: true,
        },
        {
          title: t('nav.transport'),
          url: "/transport",
          icon: Bus,
        },
        {
          title: t('nav.hostel'),
          url: "/hostel",
          icon: Home,
        },
        {
          title: t('nav.health'),
          url: "/health",
          icon: Heart,
        },
        {
          title: t('nav.visitorManagement'),
          url: "/visitor-management",
          icon: UserCog,
        },

        // COMMUNICATIONS Section
        {
          title: "COMMUNICATIONS",
          isLabel: true,
        },
        {
          title: t('nav.communication'),
          url: "/communication",
          icon: MessageSquare,
        },
        {
          title: t('nav.announcements'),
          url: "/announcements",
          icon: Megaphone,
        },

        // SUPER ADMIN ONLY Section
        ...(user.role === 'super_admin' ? [{
          title: "SYSTEM ADMINISTRATION",
          isLabel: true,
        }, {
          title: t('nav.schools'),
          url: "/superadmin/schools",
          icon: Building,
        }] : []),

        // ADDITIONAL FEATURES Section
        {
          title: "ADDITIONAL FEATURES",
          isLabel: true,
        },
        {
          title: t('nav.alumni'),
          url: "/alumni",
          icon: GraduationCap,
        },
        {
          title: t('nav.wallet'),
          url: "/wallet",
          icon: Wallet,
        },
        {
          title: t('common.store'),
          url: "/store",
          icon: ShoppingBag,
        },
        {
          title: t('nav.schoolConnect'),
          url: "/school-connect",
          icon: School,
        },
        
        // SETTINGS - Fixed at bottom
        {
          title: "SETTINGS",
          isLabel: true,
        },
        {
          title: t('nav.settings'),
          url: "/settings",
          icon: Settings,
        },
      ];
      return items;
    }

    // Staff has limited access
    if (user.role === 'staff') {
      return [
        ...baseItems,
        {
          title: t('nav.myClasses'),
          url: "/my-classes",
          icon: GraduationCap,
        },
        {
          title: t('nav.attendance'),
          url: "/attendance",
          icon: UserCheck,
        },
        {
          title: t('nav.communication'),
          url: "/communication", 
          icon: MessageSquare,
        },
        {
          title: t('nav.leaveManagement'),
          url: "/leave-management",
          icon: Calendar,
        }
      ]
    }

    // Parent has minimal access
    if (user.role === 'parent') {
      return [
        ...baseItems,
        {
          title: t('nav.childProfile'),
          url: "/child-profile",
          icon: User,
        },
        {
          title: t('nav.fees'),
          url: "/parent-fees",
          icon: DollarSign,
        },
        {
          title: t('nav.notifications'),
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
      <SidebarContent className="py-2 px-1">
        <NavMain items={navigationItems} />
        {/* NavProjects removed as requested */}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
