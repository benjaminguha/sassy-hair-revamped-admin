
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Upload } from "lucide-react";

const CarouselManager = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: carouselImages = [] } = useQuery({
    queryKey: ['admin-carousel'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carousel_images')
        .select('*')
        .order('order_index');
      if (error) throw error;
      return data;
    }
  });

  const handleImageUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `carousel/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('salon-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('salon-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast({
        title: "Please select an image",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await handleImageUpload(imageFile);
      
      const { error } = await supabase
        .from('carousel_images')
        .insert({
          title,
          subtitle,
          image_url: imageUrl,
          order_index: carouselImages.length
        });

      if (error) throw error;

      toast({
        title: "Carousel image added successfully",
      });

      setTitle("");
      setSubtitle("");
      setImageFile(null);
      queryClient.invalidateQueries({ queryKey: ['admin-carousel'] });
    } catch (error: any) {
      toast({
        title: "Error adding carousel image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('carousel_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Carousel image deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['admin-carousel'] });
    } catch (error: any) {
      toast({
        title: "Error deleting carousel image",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={20} />
            Add New Carousel Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                placeholder="Subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                required
              />
            </div>
            <Button type="submit" disabled={isUploading} className="bg-pink-600 hover:bg-pink-700">
              {isUploading ? "Uploading..." : "Add Image"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carouselImages.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-4">
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
              <p className="text-gray-600 mb-4">{image.subtitle}</p>
              <Button
                onClick={() => handleDelete(image.id)}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CarouselManager;
