import * as React from "react"
import { GraduationCap, Users, UserCheck, Calendar, BookOpen, Award, FileText, Clock, Bus, Heart, DollarSign, MessageSquare, Megaphone, FileImage, CreditCard, BarChart3, Settings, User, Building } from "lucide-react"
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const { hasPermission } = usePermissions()
  const { t } = useLanguage()
  const [showInfrastructure, setShowInfrastructure] = React.useState(() => {
    const saved = localStorage.getItem('showInfrastructure');
    return saved !== null ? JSON.parse(saved) : false;
  });

  React.useEffect(() => {
    const handleInfrastructureToggle = (event: CustomEvent) => {
      setShowInfrastructure(event.detail);
    };

    window.addEventListener('infrastructureToggle', handleInfrastructureToggle as EventListener);
    return () => window.removeEventListener('infrastructureToggle', handleInfrastructureToggle as EventListener);
  }, []);

  // Define navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return []

    const baseItems = []

    // Super Admin has access to everything except Library and Health
    if (user.role === 'super_admin') {
      return [
        ...baseItems,
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
        // Library and Health hidden for super_admin
        ...(showInfrastructure ? [{
          title: t('nav.infrastructure'),
          url: "#",
          icon: Building,
          items: [
            { title: t('nav.transport'), url: "/transport" },
            { title: t('nav.hostel'), url: "/hostel" },
            { title: t('nav.visitorManagement'), url: "/visitor-management" },
          ],
        }] : []),
        {
          title: t('nav.fees'),
          url: "/fees",
          icon: DollarSign,
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
        {
          title: t('nav.settings'),
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
    // Examinations hidden for admin
        // Library and Health hidden for admin
        ...(showInfrastructure ? [{
          title: t('nav.infrastructure'),
          url: "#",
          icon: Building,
          items: [
            { title: t('nav.transport'), url: "/transport" },
            { title: t('nav.library'), url: "/library" },
            { title: t('nav.hostel'), url: "/hostel" },
            { title: t('nav.health'), url: "/health" },
            { title: t('nav.visitorManagement'), url: "/visitor-management" },
          ],
        }] : []),
        {
          title: t('nav.fees'),
          url: "/fees",
          icon: DollarSign,
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
        {
          title: t('nav.settings'),
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
