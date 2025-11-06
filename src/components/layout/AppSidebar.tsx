import * as React from "react"
import { GraduationCap, Users, UserCheck, Calendar, BookOpen, Award, FileText, Clock, Bus, Heart, DollarSign, MessageSquare, Megaphone, FileImage, CreditCard, BarChart3, Settings, User, Building, Library, Wallet, School, ShoppingBag } from "lucide-react"
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

  // Define navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return []

    const baseItems = []
    // Add Permissions Manager for admin and super_admin (insert after Settings)
    const permissionsManagerItem = {
      title: t('nav.permissionsManager'),
      url: '/configuration-settings',
      icon: Settings,
    };

    // Super Admin has access to everything except Library and Health
    if (user.role === 'super_admin') {
  const items = [
        {
          title: t('nav.academics'),
          url: "/academics",
          icon: BookOpen,
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
        {
          title: t('nav.examinations'),
          url: "/examinations",
          icon: FileText,
        },
        ...(shouldShowModule('library') ? [{
          title: t('nav.library'),
          url: "/library",
          icon: Library,
        }] : []),
        {
          title: t('nav.transport'),
          url: "/transport",
          icon: Bus,
        },
        {
          title: t('common.store'),
          url: "/store",
          icon: ShoppingBag,
        },
        // Visitor Management as a top-level item
        {
          title: t('nav.visitorManagement'),
          url: "/visitor-management",
          icon: User,
        },

        {
          title: t('nav.fees'),
          url: "/fees",
          icon: DollarSign,
        },
        {
          title: t('nav.wallet'),
          url: "/wallet",
          icon: Wallet,
        },
        {
          title: t('nav.schoolConnect'),
          url: "/school-connect",
          icon: School,
        },
        {
          title: t('nav.communication'),
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
          title: t('nav.alumni'),
          url: "/alumni",
          icon: GraduationCap,
        },
        // Settings removed from sidebar as it is now in dashboard tab
        // Add Permissions Manager as a top-level item at the end
        permissionsManagerItem,
      ];
      return items;
    }

    // Admin has access to most features except Library and Health
    if (user.role === 'admin') {
  const items = [
        {
          title: t('nav.academics'),
          url: "/academics",
          icon: BookOpen,
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
        ...(shouldShowModule('library') ? [{
          title: t('nav.library'),
          url: "/library",
          icon: Library,
        }] : []),
        {
          title: t('nav.transport'),
          url: "/transport",
          icon: Bus,
        },
        {
          title: t('common.store'),
          url: "/store",
          icon: ShoppingBag,
        },
        // Visitor Management as a top-level item
        {
          title: t('nav.visitorManagement'),
          url: "/visitor-management",
          icon: User,
        },

        {
          title: t('nav.fees'),
          url: "/fees",
          icon: DollarSign,
        },
        {
          title: t('nav.wallet'),
          url: "/wallet",
          icon: Wallet,
        },
        {
          title: t('nav.schoolConnect'),
          url: "/school-connect",
          icon: School,
        },
        {
          title: t('nav.communication'),
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
          title: t('nav.alumni'),
          url: "/alumni",
          icon: GraduationCap,
        },
        // Settings removed from sidebar as it is now in dashboard tab
        // Add Permissions Manager as a top-level item at the end
        permissionsManagerItem,
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
      <SidebarContent>
        <NavMain items={navigationItems} />
        {/* NavProjects removed as requested */}
      </SidebarContent>
      {/* SidebarFooter removed, NavUser will be moved to Header */}
      <SidebarRail />
    </Sidebar>
  )
}
