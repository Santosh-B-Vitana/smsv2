
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
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
import { useSidebar } from '@/components/ui/sidebar';
import { LogOut, Settings, User, BadgeCheck, CreditCard, Bell, Sun, Moon, Monitor } from 'lucide-react';
import { UniversalSearch } from '@/components/search/UniversalSearch';
import { CenteredModal } from '@/components/common/CenteredModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Header() {
  const { toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
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

  // Language change handler with immediate UI update
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // Force re-render by closing and reopening the dialog
    setTimeout(() => {
      setSettingsOpen(false);
      setTimeout(() => setSettingsOpen(true), 100);
    }, 50);
  };

  // Determine if school is pro or not (mock: if schoolInfo.plan === 'Pro')
  // For now, let's assume schoolInfo has a 'plan' property, fallback to 'Pro' if missing
  const isPro = (schoolInfo as any)?.plan === 'Pro' || (schoolInfo as any)?.plan === 'Enterprise';

  return (
  <header className="flex h-14 sm:h-16 lg:h-18 items-center gap-2 sm:gap-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 sm:px-4 lg:px-6 sticky top-0 z-40">
      {/* Modern sidebar trigger with enhanced visual feedback */}
      <button
        className="lg:hidden h-9 w-9 sm:h-8 sm:w-8 flex flex-col justify-center items-center focus:outline-none rounded-lg hover:bg-accent/50 transition-all duration-200 group"
        aria-label="Open navigation menu"
        onClick={toggleSidebar}
      >
        <span className="block w-5 h-0.5 bg-foreground mb-1 rounded-full transition-all group-hover:bg-primary"></span>
        <span className="block w-5 h-0.5 bg-foreground mb-1 rounded-full transition-all group-hover:bg-primary"></span>
        <span className="block w-5 h-0.5 bg-foreground rounded-full transition-all group-hover:bg-primary"></span>
      </button>
      {/* Modern school info with enhanced styling */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 header-school-info">
        {schoolInfo?.logoUrl && (
          <div className="relative">
            <img 
              src={schoolInfo.logoUrl} 
              alt={`${schoolInfo.name} Logo`}
              className="w-6 h-6 sm:w-7 sm:h-7 lg:w-9 lg:h-9 object-contain rounded-lg shadow-sm flex-shrink-0 transition-transform hover:scale-105"
            />
          </div>
        )}
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="font-bold text-sm sm:text-base lg:text-lg text-foreground truncate bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
            {schoolInfo?.name || 'School Management System'}
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Academic Excellence • Innovation • Growth
          </p>
        </div>
      </div>
      {/* Enhanced Universal Search for Admin and Super Admin */}
      {(user?.role === "admin" || user?.role === "super_admin") && (
        <div className="flex-1 flex justify-center max-w-sm lg:max-w-md">
          <UniversalSearch className="w-full" />
        </div>
      )}
      {/* User menu styled like NavUser, with photo and details */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 sm:w-36 lg:h-11 lg:w-60 rounded-xl px-1 sm:px-3 flex items-center gap-2 sm:gap-3 hover:bg-accent/50 transition-all duration-200 group">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl ring-2 ring-background shadow-md group-hover:ring-primary/20 transition-all">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || 'User'} />
                <AvatarFallback className="rounded-xl text-xs font-semibold bg-gradient-to-br from-primary/10 to-primary/5">
                  {user?.name ? getUserInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-xs sm:text-sm group-hover:text-primary transition-colors">{user?.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 min-w-56 rounded-lg bg-popover text-popover-foreground border border-border z-[10000]" align="end" forceMount>
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
                <span>{t('nav.account')}</span>
              </DropdownMenuItem>
              {user?.role !== 'parent' && user?.role !== 'staff' && (
                <DropdownMenuItem onClick={() => setBillingOpen(true)} className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4 text-blue-500" />
                  <span>{t('nav.billing')}</span>
                </DropdownMenuItem>
              )}
              {user?.role !== 'parent' && (
                <DropdownMenuItem onClick={() => setNotificationsOpen(true)} className="cursor-pointer">
                  <Bell className="mr-2 h-4 w-4 text-pink-500 animate-bounce" />
                  <span>{t('notifications.title')}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => setProfileOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              <span>{t('nav.profile')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setSettingsOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('nav.settings')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('nav.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
  {/* Elegant dialogs for Account, Billing, Notifications, Profile, Settings */}
        {/* Profile Dialog */}
        {profileOpen && (
          <CenteredModal open={profileOpen} onClose={() => setProfileOpen(false)} ariaLabel="Profile dialog">
            <div className="bg-background border rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto animate-enter relative">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><User className="text-purple-500" /> {t('nav.profile')}</h2>
              <p className="text-muted-foreground mb-4">{t('profile.profileDescription')}</p>
              <div className="mb-4 space-y-3">
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">{t('profile.name')}</div>
                  <div className="text-foreground">{user?.name}</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">{t('common.email')}</div>
                  <div className="text-foreground">{user?.email}</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">{t('profile.role')}</div>
                  <div className="text-foreground capitalize">{user?.role}</div>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setProfileOpen(false)}>{t('common.close')}</Button>
            </div>
          </CenteredModal>
        )}
        {/* Settings Dialog */}
        {settingsOpen && (
          <CenteredModal open={settingsOpen} onClose={() => setSettingsOpen(false)} ariaLabel="Settings dialog">
            <div className="bg-background border rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto animate-enter relative">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Settings className="text-muted-foreground" /> {t('settings.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('settings.description')}</p>
              <div className="mb-4 space-y-3">
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">{t('settings.theme')}</div>
                  <div className="text-foreground">{t('settings.systemDefault')}</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">{t('notifications.title')}</div>
                  <div className="text-foreground">{t('settings.enabled')}</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">{t('settings.language')}</div>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('settings.selectLanguage')} />
                    </SelectTrigger>
                    <SelectContent className="z-[10001] bg-popover text-popover-foreground border border-border shadow-md">
                      <SelectItem value="en">{t('settings.english')}</SelectItem>
                      <SelectItem value="hi">{t('settings.hindi')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">{t('settings.theme')}</div>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('settings.selectTheme')} />
                    </SelectTrigger>
                    <SelectContent className="z-[10001] bg-popover text-popover-foreground border border-border shadow-md">
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          {t('settings.light')}
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          {t('settings.dark')}
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          {t('settings.system')}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setSettingsOpen(false)}>{t('common.close')}</Button>
            </div>
          </CenteredModal>
        )}
        {/* Account Dialog */}
        {accountOpen && (
          <CenteredModal open={accountOpen} onClose={() => setAccountOpen(false)} ariaLabel="Account dialog">
            <div className="bg-background border rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto animate-enter relative">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><BadgeCheck className="text-green-500" /> Account</h2>
              <p className="text-muted-foreground mb-4">Manage your account details and preferences.</p>
              <div className="mb-4 space-y-3">
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">Name</div>
                  <div className="text-foreground">{user?.name}</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">Email</div>
                  <div className="text-foreground">{user?.email}</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">Account Status</div>
                  <div className="text-green-600 flex items-center gap-1">
                    <BadgeCheck className="h-4 w-4" /> Active
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setAccountOpen(false)}>Close</Button>
            </div>
          </CenteredModal>
        )}
        {/* Billing Dialog */}
        {billingOpen && (
          <CenteredModal open={billingOpen} onClose={() => setBillingOpen(false)} ariaLabel="Billing dialog">
            <div className="bg-background border rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto animate-enter relative">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><CreditCard className="text-blue-500" /> Billing</h2>
              <p className="text-muted-foreground mb-4">View and manage your billing information.</p>
              <div className="mb-4 space-y-3">
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">Current Plan</div>
                  <div className="text-foreground font-medium">{(schoolInfo as any)?.plan || 'Pro'}</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">School</div>
                  <div className="text-foreground">{schoolInfo?.name}</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">Billing Status</div>
                  <div className="text-green-600 flex items-center gap-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    Current
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setBillingOpen(false)}>Close</Button>
            </div>
          </CenteredModal>
        )}
        {/* Notifications Dialog */}
        {notificationsOpen && (
          <CenteredModal open={notificationsOpen} onClose={() => setNotificationsOpen(false)} ariaLabel="Notifications dialog">
            <div className="bg-background border rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto animate-enter relative">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Bell className="text-amber-500" /> Notifications</h2>
              <p className="text-muted-foreground mb-4">Your recent notifications will appear here.</p>
              <div className="mb-4 space-y-2 max-h-48 overflow-y-auto">
                <div className="bg-accent/50 rounded-lg px-3 py-2 border border-border/50">
                  <div className="flex items-center gap-2 text-sm">
                    <Bell className="text-amber-500 h-4 w-4" />
                    <div>
                      <div className="font-medium">Welcome to Vitana Schools!</div>
                      <div className="text-xs text-muted-foreground">System notification</div>
                    </div>
                  </div>
                </div>
                <div className="bg-accent/50 rounded-lg px-3 py-2 border border-border/50">
                  <div className="flex items-center gap-2 text-sm">
                    <Bell className="text-green-500 h-4 w-4" />
                    <div>
                      <div className="font-medium">Your account is active</div>
                      <div className="text-xs text-muted-foreground">Account status</div>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setNotificationsOpen(false)}>Close</Button>
            </div>
          </CenteredModal>
        )}
      </div>
    </header>
  );
}
