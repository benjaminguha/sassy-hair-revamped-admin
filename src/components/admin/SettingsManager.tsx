
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Save } from "lucide-react";

const SettingsManager = () => {
  const [newSetting, setNewSetting] = useState({ key: "", value: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const upsertSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key, value }, { onConflict: 'key' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      toast({ title: "Setting saved successfully!" });
    }
  });

  const addSettingMutation = useMutation({
    mutationFn: async (settingData: typeof newSetting) => {
      const { error } = await supabase
        .from('site_settings')
        .insert([settingData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      setNewSetting({ key: "", value: "" });
      toast({ title: "Setting added successfully!" });
    }
  });

  const handleAddSetting = () => {
    if (!newSetting.key) {
      toast({ title: "Please provide a setting key", variant: "destructive" });
      return;
    }
    addSettingMutation.mutate(newSetting);
  };

  const handleUpdateSetting = (key: string, value: string) => {
    upsertSettingMutation.mutate({ key, value });
  };

  // Common settings that might be useful
  const commonSettings = [
    { key: "business_name", placeholder: "Business Name" },
    { key: "business_phone", placeholder: "Phone Number" },
    { key: "business_email", placeholder: "Email Address" },
    { key: "business_address", placeholder: "Street Address" },
    { key: "business_hours", placeholder: "Business Hours" },
    { key: "about_text", placeholder: "About Us Text" },
    { key: "hero_title", placeholder: "Hero Section Title" },
    { key: "hero_subtitle", placeholder: "Hero Section Subtitle" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pink-600">Site Settings Management</h2>
      
      {/* Common Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Common Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {commonSettings.map((setting) => {
            const existingSetting = settings.find(s => s.key === setting.key);
            return (
              <div key={setting.key} className="flex space-x-2">
                <Input
                  placeholder={setting.placeholder}
                  defaultValue={existingSetting?.value || ""}
                  onBlur={(e) => handleUpdateSetting(setting.key, e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => {
                    const input = document.querySelector(`input[placeholder="${setting.placeholder}"]`) as HTMLInputElement;
                    if (input) handleUpdateSetting(setting.key, input.value);
                  }}
                  size="sm"
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Add Custom Setting */}
      <Card>
        <CardHeader>
          <CardTitle>Add Custom Setting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Setting Key (e.g., custom_message)"
            value={newSetting.key}
            onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
          />
          <Input
            placeholder="Setting Value"
            value={newSetting.value}
            onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
          />
          <Button onClick={handleAddSetting} className="bg-pink-600 hover:bg-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Setting
          </Button>
        </CardContent>
      </Card>

      {/* All Settings */}
      <Card>
        <CardHeader>
          <CardTitle>All Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settings.map((setting) => (
              <div key={setting.id} className="flex space-x-2 items-center">
                <div className="font-medium text-sm w-32">{setting.key}:</div>
                <Input
                  defaultValue={setting.value || ""}
                  onBlur={(e) => handleUpdateSetting(setting.key, e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => {
                    const input = document.querySelector(`input[defaultValue="${setting.value}"]`) as HTMLInputElement;
                    if (input) handleUpdateSetting(setting.key, input.value);
                  }}
                  size="sm"
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsManager;
