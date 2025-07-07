import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

const StylistsManager = () => {
  const [newStylist, setNewStylist] = useState({
    name: "",
    title: "",
    bio: "",
    image_url: "",
    instagram_handle: "",
    specialties: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stylists = [] } = useQuery({
    queryKey: ['stylists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stylists')
        .select('*')
        .order('order_index');
      if (error) throw error;
      return data;
    }
  });

  const addStylistMutation = useMutation({
    mutationFn: async (stylistData: typeof newStylist) => {
      const specialtiesArray = stylistData.specialties ? stylistData.specialties.split(',').map(s => s.trim()) : [];
      const { error } = await supabase
        .from('stylists')
        .insert([{
          ...stylistData,
          specialties: specialtiesArray,
          order_index: stylists.length
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stylists'] });
      setNewStylist({ name: "", title: "", bio: "", image_url: "", instagram_handle: "", specialties: "" });
      toast({ title: "Stylist added successfully!" });
    }
  });

  const updateStylistMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      if (updates.specialties && typeof updates.specialties === 'string') {
        updates.specialties = updates.specialties.split(',').map((s: string) => s.trim());
      }
      const { error } = await supabase
        .from('stylists')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stylists'] });
      toast({ title: "Stylist updated successfully!" });
    }
  });

  const deleteStylistMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stylists')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stylists'] });
      toast({ title: "Stylist deleted successfully!" });
    }
  });

  const handleAddStylist = () => {
    if (!newStylist.name) {
      toast({ title: "Please provide a stylist name", variant: "destructive" });
      return;
    }
    addStylistMutation.mutate(newStylist);
  };

  const handleUpdateStylist = (id: string, field: string, value: string | boolean) => {
    updateStylistMutation.mutate({ id, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pink-600">Stylists Management</h2>
      
      {/* Add New Stylist */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Stylist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Name"
            value={newStylist.name}
            onChange={(e) => setNewStylist({ ...newStylist, name: e.target.value })}
          />
          <Input
            placeholder="Title (e.g., Senior Stylist)"
            value={newStylist.title}
            onChange={(e) => setNewStylist({ ...newStylist, title: e.target.value })}
          />
          <textarea
            className="w-full min-h-20 p-3 border border-gray-300 rounded-md"
            placeholder="Bio"
            value={newStylist.bio}
            onChange={(e) => setNewStylist({ ...newStylist, bio: e.target.value })}
          />
          <Input
            placeholder="Image URL"
            value={newStylist.image_url}
            onChange={(e) => setNewStylist({ ...newStylist, image_url: e.target.value })}
          />
          <Input
            placeholder="Instagram Handle (without @)"
            value={newStylist.instagram_handle}
            onChange={(e) => setNewStylist({ ...newStylist, instagram_handle: e.target.value })}
          />
          <Input
            placeholder="Specialties (comma separated: cuts, colors, styling)"
            value={newStylist.specialties}
            onChange={(e) => setNewStylist({ ...newStylist, specialties: e.target.value })}
          />
          <Button onClick={handleAddStylist} className="bg-pink-600 hover:bg-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Stylist
          </Button>
        </CardContent>
      </Card>

      {/* Existing Stylists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stylists.map((stylist) => (
          <Card key={stylist.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{stylist.name || "Unnamed Stylist"}</CardTitle>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteStylistMutation.mutate(stylist.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {stylist.image_url && (
                <img src={stylist.image_url} alt={stylist.name || "Stylist"} className="w-full h-32 object-cover rounded" />
              )}
              <Input
                placeholder="Name"
                defaultValue={stylist.name || ""}
                onBlur={(e) => handleUpdateStylist(stylist.id, 'name', e.target.value)}
              />
              <Input
                placeholder="Title"
                defaultValue={stylist.title || ""}
                onBlur={(e) => handleUpdateStylist(stylist.id, 'title', e.target.value)}
              />
              <textarea
                className="w-full min-h-20 p-3 border border-gray-300 rounded-md"
                placeholder="Bio"
                defaultValue={stylist.bio || ""}
                onBlur={(e) => handleUpdateStylist(stylist.id, 'bio', e.target.value)}
              />
              <Input
                placeholder="Image URL"
                defaultValue={stylist.image_url || ""}
                onBlur={(e) => handleUpdateStylist(stylist.id, 'image_url', e.target.value)}
              />
              <Input
                placeholder="Instagram Handle"
                defaultValue={stylist.instagram_handle || ""}
                onBlur={(e) => handleUpdateStylist(stylist.id, 'instagram_handle', e.target.value)}
              />
              <Input
                placeholder="Specialties (comma separated)"
                defaultValue={stylist.specialties ? stylist.specialties.join(', ') : ""}
                onBlur={(e) => handleUpdateStylist(stylist.id, 'specialties', e.target.value)}
              />
              <div className="flex items-center space-x-2">
                <label className="text-sm">Active:</label>
                <input
                  type="checkbox"
                  checked={stylist.is_active}
                  onChange={(e) => handleUpdateStylist(stylist.id, 'is_active', e.target.checked)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StylistsManager;
