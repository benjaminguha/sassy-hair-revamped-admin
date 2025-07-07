
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Upload } from "lucide-react";

const CarouselManager = () => {
  const [newImage, setNewImage] = useState({ title: "", subtitle: "", image_file: null as File | null });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: images = [] } = useQuery({
    queryKey: ['carouselImages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carousel_images')
        .select('*')
        .order('order_index');
      if (error) throw error;
      return data;
    }
  });

  const uploadImage = async (file: File, folder: string = 'carousel') => {
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

  const addImageMutation = useMutation({
    mutationFn: async (imageData: typeof newImage) => {
      let imageUrl = '';
      
      if (imageData.image_file) {
        setUploading(true);
        imageUrl = await uploadImage(imageData.image_file);
      }

      const { error } = await supabase
        .from('carousel_images')
        .insert([{
          title: imageData.title,
          subtitle: imageData.subtitle,
          image_url: imageUrl,
          order_index: images.length
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carouselImages'] });
      setNewImage({ title: "", subtitle: "", image_file: null });
      setUploading(false);
      toast({ title: "Image added successfully!" });
    },
    onError: () => {
      setUploading(false);
    }
  });

  const updateImageMutation = useMutation({
    mutationFn: async ({ id, field, value, file }: { id: string, field: string, value: string | boolean, file?: File }) => {
      let updateData: any = { [field]: value };
      
      if (file && field === 'image_url') {
        setUploading(true);
        const imageUrl = await uploadImage(file);
        updateData = { image_url: imageUrl };
      }

      const { error } = await supabase
        .from('carousel_images')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carouselImages'] });
      setUploading(false);
      toast({ title: "Image updated successfully!" });
    },
    onError: () => {
      setUploading(false);
    }
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('carousel_images')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carouselImages'] });
      toast({ title: "Image deleted successfully!" });
    }
  });

  const handleAddImage = () => {
    if (!newImage.title || !newImage.image_file) {
      toast({ title: "Please fill in title and select an image file", variant: "destructive" });
      return;
    }
    addImageMutation.mutate(newImage);
  };

  const handleUpdateImage = (id: string, field: string, value: string | boolean) => {
    updateImageMutation.mutate({ id, field, value });
  };

  const handleImageUpdate = (id: string, file: File) => {
    updateImageMutation.mutate({ id, field: 'image_url', value: '', file });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pink-600">Carousel Images Management</h2>
      
      {/* Add New Image */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Carousel Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Title"
            value={newImage.title}
            onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
          />
          <Input
            placeholder="Subtitle"
            value={newImage.subtitle}
            onChange={(e) => setNewImage({ ...newImage, subtitle: e.target.value })}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage({ ...newImage, image_file: e.target.files?.[0] || null })}
            />
          </div>
          <Button 
            onClick={handleAddImage} 
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
                Add Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image) => (
          <Card key={image.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Image #{image.order_index + 1}</CardTitle>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteImageMutation.mutate(image.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {image.image_url && (
                <img src={image.image_url} alt={image.title || "Carousel"} className="w-full h-32 object-cover rounded" />
              )}
              <Input
                placeholder="Title"
                defaultValue={image.title || ""}
                onBlur={(e) => handleUpdateImage(image.id, 'title', e.target.value)}
              />
              <Input
                placeholder="Subtitle"
                defaultValue={image.subtitle || ""}
                onBlur={(e) => handleUpdateImage(image.id, 'subtitle', e.target.value)}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Update Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpdate(image.id, file);
                  }}
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm">Active:</label>
                <input
                  type="checkbox"
                  checked={image.is_active}
                  onChange={(e) => handleUpdateImage(image.id, 'is_active', e.target.checked)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CarouselManager;
