
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Save } from "lucide-react";

const CarouselManager = () => {
  const [newImage, setNewImage] = useState({ title: "", subtitle: "", image_url: "" });
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

  const addImageMutation = useMutation({
    mutationFn: async (imageData: typeof newImage) => {
      const { error } = await supabase
        .from('carousel_images')
        .insert([{
          ...imageData,
          order_index: images.length
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carouselImages'] });
      setNewImage({ title: "", subtitle: "", image_url: "" });
      toast({ title: "Image added successfully!" });
    }
  });

  const updateImageMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase
        .from('carousel_images')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carouselImages'] });
      toast({ title: "Image updated successfully!" });
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
    if (!newImage.title || !newImage.image_url) {
      toast({ title: "Please fill in title and image URL", variant: "destructive" });
      return;
    }
    addImageMutation.mutate(newImage);
  };

  const handleUpdateImage = (id: string, field: string, value: string | boolean) => {
    updateImageMutation.mutate({ id, [field]: value });
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
          <Input
            placeholder="Image URL"
            value={newImage.image_url}
            onChange={(e) => setNewImage({ ...newImage, image_url: e.target.value })}
          />
          <Button onClick={handleAddImage} className="bg-pink-600 hover:bg-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Image
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
              <Input
                placeholder="Image URL"
                defaultValue={image.image_url}
                onBlur={(e) => handleUpdateImage(image.id, 'image_url', e.target.value)}
              />
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
