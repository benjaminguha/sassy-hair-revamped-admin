
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const SettingsManager = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: siteSettings = [] } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    const settingsObj = siteSettings.reduce((acc, setting) => ({
      ...acc,
      [setting.key]: setting.value || ""
    }), {});
    setSettings(settingsObj);
  }, [siteSettings]);

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(update, { onConflict: 'key' });
        
        if (error) throw error;
      }

      toast({
        title: "Settings saved successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const settingsFields = [
    { key: 'site_title', label: 'Site Title', type: 'input' },
    { key: 'site_description', label: 'Site Description', type: 'textarea' },
    { key: 'contact_phone', label: 'Contact Phone', type: 'input' },
    { key: 'contact_email', label: 'Contact Email', type: 'input' },
    { key: 'address', label: 'Address', type: 'textarea' },
    { key: 'hours', label: 'Business Hours', type: 'textarea' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {settingsFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <Textarea
                  value={settings[field.key] || ""}
                  onChange={(e) => handleSettingChange(field.key, e.target.value)}
                  rows={3}
                />
              ) : (
                <Input
                  value={settings[field.key] || ""}
                  onChange={(e) => handleSettingChange(field.key, e.target.value)}
                />
              )}
            </div>
          ))}
          
          <Button onClick={handleSave} className="bg-pink-600 hover:bg-pink-700">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsManager;
