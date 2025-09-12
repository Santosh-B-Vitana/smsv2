
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LogOut, Settings, User, Sparkles, BadgeCheck, CreditCard, Bell } from 'lucide-react';

export function Header() {
  // Universal search bar state
  const [searchTerm, setSearchTerm] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  // Only modules that exist in src/pages (filtered from actual files)
  const moduleFiles = [
    "Admissions.tsx", "Alumni.tsx", "Analytics.tsx", "Announcements.tsx", "Assignments.tsx", "Attendance.tsx", "ChildProfile.tsx", "ClassDetail.tsx", "ClassProfile.tsx", "Communication.tsx", "Dashboard.tsx", "Documents.tsx", "Examinations.tsx", "Fees.tsx", "Grades.tsx", "Health.tsx", "IdCards.tsx", "Index.tsx", "Library.tsx", "Login.tsx", "MyClassDetail.tsx", "MyClasses.tsx", "Notifications.tsx", "ParentChildFeeDetails.tsx", "ParentFees.tsx", "ParentNotifications.tsx", "Reports.tsx", "Settings.tsx", "Staff.tsx", "StaffAttendance.tsx", "StaffAttendanceTeacher.tsx", "StaffEdit.tsx", "StaffProfile.tsx", "StudentAttendance.tsx", "StudentDetail.tsx", "StudentEdit.tsx", "StudentFeeDetails.tsx", "StudentProfile.tsx", "Students.tsx", "SuperAdminLogin.tsx", "Timetable.tsx", "Transport.tsx"
  ];
  const modules = moduleFiles.map(f => f.replace(/\.tsx$/, ""));
  const students = ["Aarav Sharma", "Priya Singh", "Rahul Verma", "Sneha Patel", "Rohan Gupta"];
  const staff = ["Dr. Rajesh Sharma", "Anil Kumar", "Priya Singh", "Ms. Sarah", "Mr. John", "Ms. Lisa"];
  // Combine all for search with professional labels
  const allItems = [
    ...modules.map(m => ({ type: "Section", name: m })),
    ...students.map(s => ({ type: "Student", name: s })),
    ...staff.map(st => ({ type: "Staff Member", name: st }))
  ];
  React.useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    setSuggestions(
      allItems
        .filter(item => item.name.toLowerCase().includes(term))
        .slice(0, 6)
        .map(item => `${item.type}: ${item.name}`)
    );
  }, [searchTerm]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm("");
    setSuggestions([]);
    // Parse suggestion string: "Type: Name"
    const [type, ...nameParts] = suggestion.split(": ");
    const name = nameParts.join(": ");
    let path = "/";
    if (type === "Module") {
      // Route to module page (assume /ModuleName, lowercased)
      path += name.replace(/\s+/g, "").toLowerCase();
    } else if (type === "Student") {
      // Route to student profile (assume /students/:name, lowercased and hyphenated)
      path += "students/" + name.replace(/\s+/g, "-").toLowerCase();
    } else if (type === "Staff") {
      // Route to staff profile (assume /staff/:name, lowercased and hyphenated)
      path += "staff/" + name.replace(/\s+/g, "-").toLowerCase();
    }
    // Use window.location for navigation
    window.location.href = path;
  };
  const { user, logout } = useAuth();
  const { schoolInfo } = useSchool();

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Dialog state for Account, Billing, Notifications
  const [accountOpen, setAccountOpen] = React.useState(false);
  const [billingOpen, setBillingOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  // Determine if school is pro or not (mock: if schoolInfo.plan === 'Pro')
  // For now, let's assume schoolInfo has a 'plan' property, fallback to 'Pro' if missing
  const isPro = (schoolInfo as any)?.plan === 'Pro' || (schoolInfo as any)?.plan === 'Enterprise';

  return (
  <header className="flex h-14 lg:h-16 items-center gap-2 border-b border-border bg-background px-3 lg:px-6">
      {/* Mobile sidebar trigger */}
      <SidebarTrigger className="lg:hidden" />
      {/* School info - responsive */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {schoolInfo?.logoUrl && (
          <img 
            src={schoolInfo.logoUrl} 
            alt={`${schoolInfo.name} Logo`}
            className="w-6 h-6 lg:w-8 lg:h-8 object-contain rounded-sm"
          />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="font-semibold text-sm lg:text-base text-foreground truncate">
            {schoolInfo?.name || 'School Management System'}
          </h1>
        </div>
      </div>
      {/* Universal search bar for admin */}
      {user?.role === "admin" && (
        <div className="relative flex-1 flex justify-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search sections, students, staff members..."
            className="border rounded-lg px-3 py-1 text-sm w-72 focus:outline-none focus:ring"
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-72 bg-background border rounded-lg shadow-lg z-50">
              <ul className="divide-y divide-border">
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    className="px-3 py-2 cursor-pointer hover:bg-accent text-sm"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {/* User menu styled like NavUser, with photo and details */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-48 lg:h-10 lg:w-56 rounded-lg px-2 flex items-center gap-2">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || 'User'} />
                <AvatarFallback className="rounded-lg">
                  {user?.name ? getUserInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 min-w-56 rounded-lg" align="end" forceMount>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || 'User'} />
                  <AvatarFallback className="rounded-lg">
                    {user?.name ? getUserInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* Removed Upgrade to Pro for admin and super admin */}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setAccountOpen(true)} className="cursor-pointer">
                <BadgeCheck className="mr-2 h-4 w-4 text-green-500" />
                <span>Account</span>
              </DropdownMenuItem>
              {user?.role !== 'parent' && user?.role !== 'staff' && (
                <DropdownMenuItem onClick={() => setBillingOpen(true)} className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4 text-blue-500" />
                  <span>Billing</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setNotificationsOpen(true)} className="cursor-pointer">
                <Bell className="mr-2 h-4 w-4 text-pink-500 animate-bounce" />
                <span>Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => setProfileOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setSettingsOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
  {/* Elegant dialogs for Account, Billing, Notifications, Profile, Settings */}
        {/* Profile Dialog */}
        {profileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-background rounded-xl shadow-xl p-8 w-full max-w-md animate-fadeIn">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><User className="text-purple-500" /> Profile</h2>
              <p className="text-muted-foreground mb-4">Your personal profile details.</p>
              <div className="mb-4">
                <div className="font-semibold">Name:</div>
                <div>{user?.name}</div>
                <div className="font-semibold mt-2">Email:</div>
                <div>{user?.email}</div>
                <div className="font-semibold mt-2">Role:</div>
                <div>{user?.role}</div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setProfileOpen(false)}>Close</Button>
            </div>
          </div>
        )}
        {/* Settings Dialog */}
        {settingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-background rounded-xl shadow-xl p-8 w-full max-w-md animate-fadeIn">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Settings className="text-gray-500" /> Settings</h2>
              <p className="text-muted-foreground mb-4">App settings and preferences.</p>
              <div className="mb-4">
                <div className="font-semibold">Theme:</div>
                <div>Default (customize in future)</div>
                <div className="font-semibold mt-2">Notifications:</div>
                <div>Enabled (customize in future)</div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setSettingsOpen(false)}>Close</Button>
            </div>
          </div>
        )}
        {/* Account Dialog */}
        {accountOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-background rounded-xl shadow-xl p-8 w-full max-w-md animate-fadeIn">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><BadgeCheck className="text-green-500" /> Account</h2>
              <p className="text-muted-foreground mb-4">Manage your account details and preferences.</p>
              <div className="mb-4">
                <div className="font-semibold">Name:</div>
                <div>{user?.name}</div>
                <div className="font-semibold mt-2">Email:</div>
                <div>{user?.email}</div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setAccountOpen(false)}>Close</Button>
            </div>
          </div>
        )}
        {/* Billing Dialog */}
        {billingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-background rounded-xl shadow-xl p-8 w-full max-w-md animate-fadeIn">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><CreditCard className="text-blue-500" /> Billing</h2>
              <p className="text-muted-foreground mb-4">View and manage your billing information.</p>
              <div className="mb-4">
                <div className="font-semibold">Current Plan:</div>
                <div>{(schoolInfo as any)?.plan || 'Pro'}</div>
                <div className="font-semibold mt-2">School:</div>
                <div>{schoolInfo?.name}</div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setBillingOpen(false)}>Close</Button>
            </div>
          </div>
        )}
        {/* Notifications Dialog */}
        {notificationsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-background rounded-xl shadow-xl p-8 w-full max-w-md animate-fadeIn">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Bell className="text-pink-500" /> Notifications</h2>
              <p className="text-muted-foreground mb-4">Your recent notifications will appear here.</p>
              {/* Mock notifications */}
              <ul className="mb-4 space-y-2">
                <li className="bg-accent rounded-lg px-3 py-2 flex items-center gap-2">
                  <Bell className="text-pink-500" /> Welcome to Vitana Schools!
                </li>
                <li className="bg-accent rounded-lg px-3 py-2 flex items-center gap-2">
                  <Bell className="text-pink-500" /> Your account is active.
                </li>
                {/* Removed Upgrade to Pro notification for admin and super admin */}
              </ul>
              <Button variant="outline" className="w-full" onClick={() => setNotificationsOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
