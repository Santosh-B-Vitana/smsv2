
import { useState } from "react";
import { Check, X, Save, AlertCircle, Eye, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePermissions, ModuleName, PermissionLevel } from "../../contexts/PermissionsContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../../contexts/AuthContext";

const MODULE_LABELS: Record<ModuleName, string> = {
  students: 'Student Management',
  staff: 'Staff Management',
  attendance: 'Attendance Tracking',
  fees: 'Fee Management',
  timetable: 'Timetable',
  examinations: 'Examinations',
  announcements: 'Announcements',
  reports: 'Reports & Analytics',
  documents: 'Document Management',
  admissions: 'Admissions'
};

const PERMISSION_CONFIG: Record<PermissionLevel, { label: string; icon: any; color: string }> = {
  read: { 
    label: 'View', 
    icon: Eye, 
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200' 
  },
  write: { 
    label: 'Edit', 
    icon: Edit, 
    color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
  },
  delete: { 
    label: 'Delete', 
    icon: Trash2, 
    color: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200' 
  }
};

export function PermissionsManager() {
  const { schoolPermissions, updateSchoolPermissions, loading } = usePermissions();
  const { user } = useAuth();
  const [saving, setSaving] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  // Filter permissions based on current user's school (for non-super admins)
  const relevantSchools = user?.role === 'super_admin' 
    ? schoolPermissions 
    : schoolPermissions.filter(school => school.schoolId === user?.schoolId);

  const handleModuleToggle = async (schoolId: string, moduleName: ModuleName, enabled: boolean) => {
    setSaving(`${schoolId}-${moduleName}`);
    try {
      const school = relevantSchools.find(s => s.schoolId === schoolId);
      const currentModule = school?.modules[moduleName];
      
      await updateSchoolPermissions(schoolId, moduleName, {
        enabled,
        permissions: enabled ? (currentModule?.permissions || ['read']) : []
      });
      
      toast({
        title: "Success",
        description: `${MODULE_LABELS[moduleName]} ${enabled ? 'enabled' : 'disabled'} for ${school?.schoolName}`,
      });
      setHasChanges(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update permissions",
        variant: "destructive"
      });
    } finally {
      setSaving(null);
    }
  };

  const handlePermissionToggle = async (
    schoolId: string, 
    moduleName: ModuleName, 
    permission: PermissionLevel, 
    hasPermission: boolean
  ) => {
    setSaving(`${schoolId}-${moduleName}-${permission}`);
    try {
      const school = relevantSchools.find(s => s.schoolId === schoolId);
      const currentModule = school?.modules[moduleName];
      
      if (!currentModule) return;

      let newPermissions = [...currentModule.permissions];
      
      if (hasPermission) {
        newPermissions = newPermissions.filter(p => p !== permission);
      } else {
        newPermissions.push(permission);
        // Auto-enable read permission when granting write or delete
        if (permission !== 'read' && !newPermissions.includes('read')) {
          newPermissions.push('read');
        }
      }

      await updateSchoolPermissions(schoolId, moduleName, {
        enabled: currentModule.enabled,
        permissions: newPermissions
      });

      toast({
        title: "Success",
        description: `${PERMISSION_CONFIG[permission].label} permission ${hasPermission ? 'revoked' : 'granted'}`,
      });
      setHasChanges(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update permissions",
        variant: "destructive"
      });
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded animate-pulse"></div>
        <div className="h-64 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  if (relevantSchools.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No schools available for permission management.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Module Permissions</h2>
          <p className="text-sm text-muted-foreground">
            {user?.role === 'super_admin' 
              ? 'Manage module access and permissions for each school'
              : `Manage module permissions for ${relevantSchools[0]?.schoolName}`
            }
          </p>
        </div>
        {hasChanges && (
          <Alert className="w-full sm:w-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Changes have been saved automatically
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-4 sm:space-y-6">
        {relevantSchools.map((school) => (
          <Card key={school.schoolId} className="border-border">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-lg">{school.schoolName}</CardTitle>
                <Badge variant="secondary" className="text-xs w-fit">
                  {Object.values(school.modules).filter(m => m.enabled).length} / {Object.keys(school.modules).length} modules enabled
                </Badge>
              </div>
              <CardDescription>
                Configure module access and permission levels for this school
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3 sm:space-y-4">
                {(Object.keys(school.modules) as ModuleName[]).map((moduleName) => {
                  const moduleData = school.modules[moduleName];
                  const isSaving = saving?.startsWith(`${school.schoolId}-${moduleName}`);
                  
                  return (
                    <div key={moduleName} className="border border-border rounded-lg p-3 sm:p-4 bg-muted/30">
                      {/* Module Header - Mobile Responsive */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={moduleData.enabled}
                            onCheckedChange={(enabled) => handleModuleToggle(school.schoolId, moduleName, enabled)}
                            disabled={isSaving}
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-foreground text-sm sm:text-base">{MODULE_LABELS[moduleName]}</p>
                            <p className="text-xs text-muted-foreground">
                              {moduleData.enabled 
                                ? `Active with ${moduleData.permissions.length} permission${moduleData.permissions.length !== 1 ? 's' : ''}` 
                                : 'Module is disabled'
                              }
                            </p>
                          </div>
                        </div>
                        
                        {/* Permission Buttons - Mobile Responsive */}
                        {moduleData.enabled && (
                          <div className="flex flex-wrap gap-2">
                            {(['read', 'write', 'delete'] as PermissionLevel[]).map((permission) => {
                              const hasPermission = moduleData.permissions.includes(permission);
                              const isPermissionSaving = saving === `${school.schoolId}-${moduleName}-${permission}`;
                              const config = PERMISSION_CONFIG[permission];
                              const IconComponent = config.icon;
                              
                              return (
                                <Button
                                  key={permission}
                                  variant={hasPermission ? "default" : "outline"}
                                  size="sm"
                                  className={`h-8 text-xs transition-all ${
                                    hasPermission 
                                      ? config.color
                                      : 'hover:bg-muted border-border'
                                  }`}
                                  onClick={() => handlePermissionToggle(school.schoolId, moduleName, permission, hasPermission)}
                                  disabled={isPermissionSaving || isSaving}
                                >
                                  <IconComponent className="w-3 h-3 mr-1" />
                                  {config.label}
                                  {hasPermission && <Check className="w-3 h-3 ml-1" />}
                                </Button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
