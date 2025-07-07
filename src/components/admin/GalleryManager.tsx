import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

const GalleryManager = () => {
  const [newPhoto, setNewPhoto] = useState({ title: "", category: "", image_url: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: photos = [] } = useQuery({
    queryKey: ['galleryPhotos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .order('order_index');
      if (error) throw error;
      return data;
    }
  });

  const addPhotoMutation = useMutation({
    mutationFn: async (photoData: typeof newPhoto) => {
      const { error } = await supabase
        .from('gallery_photos')
        .insert([{
          ...photoData,
          order_index: photos.length
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryPhotos'] });
      setNewPhoto({ title: "", category: "", image_url: "" });
      toast({ title: "Photo added successfully!" });
    }
  });

  const updatePhotoMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase
        .from('gallery_photos')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryPhotos'] });
      toast({ title: "Photo updated successfully!" });
    }
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gallery_photos')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryPhotos'] });
      toast({ title: "Photo deleted successfully!" });
    }
  });

  const handleAddPhoto = () => {
    if (!newPhoto.image_url) {
      toast({ title: "Please provide an image URL", variant: "destructive" });
      return;
    }
    addPhotoMutation.mutate(newPhoto);
  };

  const handleUpdatePhoto = (id: string, field: string, value: string | boolean) => {
    updatePhotoMutation.mutate({ id, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pink-600">Gallery Management</h2>
      
      {/* Add New Photo */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Gallery Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Photo Title"
            value={newPhoto.title}
            onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
          />
          <Input
            placeholder="Category (e.g., cuts, colors, styling)"
            value={newPhoto.category}
            onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
          />
          <Input
            placeholder="Image URL"
            value={newPhoto.image_url}
            onChange={(e) => setNewPhoto({ ...newPhoto, image_url: e.target.value })}
          />
          <Button onClick={handleAddPhoto} className="bg-pink-600 hover:bg-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Photo
          </Button>
        </CardContent>
      </Card>

      {/* Existing Photos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <Card key={photo.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm">{photo.title || "Untitled"}</CardTitle>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deletePhotoMutation.mutate(photo.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {photo.image_url && (
                <img src={photo.image_url} alt={photo.title || "Gallery"} className="w-full h-32 object-cover rounded" />
              )}
              <Input
                placeholder="Photo Title"
                defaultValue={photo.title || ""}
                onBlur={(e) => handleUpdatePhoto(photo.id, 'title', e.target.value)}
              />
              <Input
                placeholder="Category"
                defaultValue={photo.category || ""}
                onBlur={(e) => handleUpdatePhoto(photo.id, 'category', e.target.value)}
              />
              <Input
                placeholder="Image URL"
                defaultValue={photo.image_url}
                onBlur={(e) => handleUpdatePhoto(photo.id, 'image_url', e.target.value)}
              />
              <div className="flex items-center space-x-2">
                <label className="text-sm">Active:</label>
                <input
                  type="checkbox"
                  checked={photo.is_active}
                  onChange={(e) => handleUpdatePhoto(photo.id, 'is_active', e.target.checked)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;
