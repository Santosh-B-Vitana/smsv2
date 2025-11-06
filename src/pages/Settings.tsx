
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Shield, Download, Upload } from "lucide-react";
import { SettingsManager } from "@/components/settings/SettingsManager";
import BiometricSettings from "@/components/settings/BiometricSettings";
import { DataImportManager } from "@/components/superadmin/DataImportManager";
import { useLanguage } from "@/contexts/LanguageContext";
import { PermissionsManager } from "@/components/permissions/PermissionsManager";

export default function Settings() {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            {t('settings.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">
                <SettingsIcon className="h-4 w-4 mr-2" />
                {t('settings.general')}
              </TabsTrigger>
              <TabsTrigger value="permissions">
                <Shield className="h-4 w-4 mr-2" />
                Permissions
              </TabsTrigger>
              <TabsTrigger value="biometric">
                {t('settings.biometric')}
              </TabsTrigger>
              <TabsTrigger value="import">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </TabsTrigger>
              <TabsTrigger value="export">
                <Download className="h-4 w-4 mr-2" />
                Export
              </TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <SettingsManager />
            </TabsContent>
            <TabsContent value="permissions">
              <PermissionsManager />
            </TabsContent>
            <TabsContent value="biometric">
              <BiometricSettings />
            </TabsContent>
            <TabsContent value="import">
              <DataImportManager />
            </TabsContent>
            <TabsContent value="export" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Export Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Export module data to Excel format for backup or external analysis.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {['Students', 'Staff', 'Attendance', 'Fees', 'Examinations', 'Library', 'Transport', 'Store Inventory', 'Store Sales'].map((module) => (
                      <Card key={module} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2">{module}</h3>
                          <button 
                            className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                            onClick={() => {
                              // Export functionality will be implemented per module
                              console.log(`Exporting ${module}`);
                            }}
                          >
                            <Download className="h-4 w-4" />
                            Export to Excel
                          </button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
