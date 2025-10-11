
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon } from "lucide-react";
import { SettingsManager } from "@/components/settings/SettingsManager";
import BiometricSettings from "@/components/settings/BiometricSettings";
import { DataImportManager } from "@/components/superadmin/DataImportManager";
import { useLanguage } from "@/contexts/LanguageContext";

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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">{t('settings.general')}</TabsTrigger>
              <TabsTrigger value="biometric">{t('settings.biometric')}</TabsTrigger>
              <TabsTrigger value="import">{t('settings.import')}</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <SettingsManager />
            </TabsContent>
            <TabsContent value="biometric">
              <BiometricSettings />
            </TabsContent>
            <TabsContent value="import">
              <DataImportManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
