
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Upload } from "lucide-react";

const GalleryManager = () => {
  const [newPhoto, setNewPhoto] = useState({ title: "", category: "", image_file: null as File | null });
  const [uploading, setUploading] = useState(false);
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

  const uploadImage = async (file: File, folder: string = 'gallery') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('salon-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('salon-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const addPhotoMutation = useMutation({
    mutationFn: async (photoData: typeof newPhoto) => {
      let imageUrl = '';
      
      if (photoData.image_file) {
        setUploading(true);
        imageUrl = await uploadImage(photoData.image_file);
      }

      const { error } = await supabase
        .from('gallery_photos')
        .insert([{
          title: photoData.title,
          category: photoData.category,
          image_url: imageUrl,
          order_index: photos.length
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryPhotos'] });
      setNewPhoto({ title: "", category: "", image_file: null });
      setUploading(false);
      toast({ title: "Photo added successfully!" });
    },
    onError: () => {
      setUploading(false);
    }
  });

  const updatePhotoMutation = useMutation({
    mutationFn: async ({ id, field, value, file }: { id: string, field: string, value: string | boolean, file?: File }) => {
      let updateData: any = { [field]: value };
      
      if (file && field === 'image_url') {
        setUploading(true);
        const imageUrl = await uploadImage(file);
        updateData = { image_url: imageUrl };
      }

      const { error } = await supabase
        .from('gallery_photos')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryPhotos'] });
      setUploading(false);
      toast({ title: "Photo updated successfully!" });
    },
    onError: () => {
      setUploading(false);
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
    if (!newPhoto.image_file) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }
    addPhotoMutation.mutate(newPhoto);
  };

  const handleUpdatePhoto = (id: string, field: string, value: string | boolean) => {
    updatePhotoMutation.mutate({ id, field, value });
  };

  const handleImageUpdate = (id: string, file: File) => {
    updatePhotoMutation.mutate({ id, field: 'image_url', value: '', file });
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setNewPhoto({ ...newPhoto, image_file: e.target.files?.[0] || null })}
            />
          </div>
          <Button 
            onClick={handleAddPhoto} 
            className="bg-pink-600 hover:bg-pink-700"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Photo
              </>
            )}
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Update Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpdate(photo.id, file);
                  }}
                />
              </div>
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
