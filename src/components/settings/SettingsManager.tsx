
import { useState } from "react";
import { Settings, User, Bell, Shield, Database, Palette, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useSchool } from "../../contexts/SchoolContext";
import { useLanguage } from "../../contexts/LanguageContext";

export function SettingsManager() {
  const { user } = useAuth();
  const { schoolInfo } = useSchool();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [showInfrastructure, setShowInfrastructure] = useState(() => {
    const saved = localStorage.getItem('showInfrastructure');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const handleInfrastructureToggle = (checked: boolean) => {
    setShowInfrastructure(checked);
    localStorage.setItem('showInfrastructure', JSON.stringify(checked));
    // Trigger a custom event to notify the sidebar
    window.dispatchEvent(new CustomEvent('infrastructureToggle', { detail: checked }));
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully."
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('settings.title')}</h1>
        <p className="text-muted-foreground">Manage your account and system preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{t('nav.profile')}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">{t('notifications.title')}</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">{t('settings.security')}</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.profileInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{t('profile.firstName')}</Label>
                  <Input id="firstName" defaultValue={user?.name?.split(' ')[0] || ""} />
                </div>
                <div>
                  <Label htmlFor="lastName">{t('profile.lastName')}</Label>
                  <Input id="lastName" defaultValue={user?.name?.split(' ').slice(1).join(' ') || ""} />
                </div>
              </div>
              <div>
                <Label htmlFor="email">{t('common.email')}</Label>
                <Input id="email" type="email" defaultValue={user?.email || ""} />
              </div>
              <div>
                <Label htmlFor="phone">{t('profile.phoneNumber')}</Label>
                <Input id="phone" placeholder="Enter your phone number" />
              </div>
              <div>
                <Label htmlFor="bio">{t('profile.bio')}</Label>
                <Textarea id="bio" placeholder="Tell us about yourself..." />
              </div>
              <Button onClick={handleSave}>{t('profile.saveChanges')}</Button>
            </CardContent>
          </Card>

          {user?.role === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.schoolInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="schoolName">{t('profile.schoolName')}</Label>
                  <Input id="schoolName" defaultValue={schoolInfo?.name || ""} />
                </div>
                <div>
                  <Label htmlFor="schoolAddress">{t('common.address')}</Label>
                  <Textarea id="schoolAddress" defaultValue={schoolInfo?.address || ""} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schoolPhone">{t('common.phone')}</Label>
                    <Input id="schoolPhone" defaultValue={schoolInfo?.phone || ""} />
                  </div>
                  <div>
                    <Label htmlFor="schoolEmail">{t('common.email')}</Label>
                    <Input id="schoolEmail" type="email" defaultValue={schoolInfo?.email || ""} />
                  </div>
                </div>
                <Button onClick={handleSave}>{t('profile.updateSchoolInfo')}</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('notifications.notificationPreferences')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{t('notifications.emailNotifications')}</h3>
                  <p className="text-sm text-muted-foreground">{t('notifications.receiveEmailUpdates')}</p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{t('notifications.smsNotifications')}</h3>
                  <p className="text-sm text-muted-foreground">{t('notifications.receiveSmsUpdates')}</p>
                </div>
                <Switch 
                  checked={smsNotifications} 
                  onCheckedChange={setSmsNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{t('notifications.pushNotifications')}</h3>
                  <p className="text-sm text-muted-foreground">{t('notifications.receivePushUpdates')}</p>
                </div>
                <Switch 
                  checked={pushNotifications} 
                  onCheckedChange={setPushNotifications}
                />
              </div>
              <Button onClick={handleSave}>{t('notifications.savePreferences')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('security.passwordSecurity')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">{t('security.currentPassword')}</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="newPassword">{t('security.newPassword')}</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">{t('security.confirmPassword')}</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button onClick={handleSave}>{t('security.changePassword')}</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('security.twoFactorAuth')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{t('security.enable2FA')}</h3>
                  <p className="text-sm text-muted-foreground">{t('security.extraSecurity')}</p>
                </div>
                <Button variant="outline">{t('security.configure')}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('system.systemPreferences')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language">{t('settings.language')}</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('settings.selectLanguage')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t('settings.english')}</SelectItem>
                    <SelectItem value="hi">{t('settings.hindi')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timezone">{t('system.timezone')}</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time</SelectItem>
                    <SelectItem value="pst">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateFormat">{t('system.dateFormat')}</Label>
                <Select defaultValue="mm/dd/yyyy">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                 <Button onClick={handleSave}>{t('system.saveSettings')}</Button>
               </CardContent>
             </Card>

             {(user?.role === 'admin' || user?.role === 'super_admin') && (
               <Card>
                 <CardHeader>
                   <CardTitle>{t('system.navigationSettings')}</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="flex items-center justify-between">
                     <div>
                       <h3 className="font-medium">{t('system.showInfrastructureMenu')}</h3>
                       <p className="text-sm text-muted-foreground">{t('system.infrastructureToggleDesc')}</p>
                     </div>
                     <Switch 
                       checked={showInfrastructure} 
                       onCheckedChange={handleInfrastructureToggle}
                     />
                   </div>
                 </CardContent>
               </Card>
             )}

           {user?.role === 'admin' && (
             <Card>
               <CardHeader>
                 <CardTitle>{t('system.dataManagement')}</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                   <div>
                     <h3 className="font-medium">{t('system.exportData')}</h3>
                     <p className="text-sm text-muted-foreground">{t('system.downloadAllData')}</p>
                   </div>
                   <Button variant="outline">
                     <Database className="w-4 h-4 mr-2" />
                     {t('system.export')}
                   </Button>
                 </div>
                 <div className="flex items-center justify-between">
                   <div>
                     <h3 className="font-medium">{t('system.backupData')}</h3>
                     <p className="text-sm text-muted-foreground">{t('system.createBackup')}</p>
                   </div>
                   <Button variant="outline">
                     <Database className="w-4 h-4 mr-2" />
                     {t('system.backup')}
                   </Button>
                 </div>
               </CardContent>
             </Card>
           )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
