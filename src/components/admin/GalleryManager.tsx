
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

const GalleryManager = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: galleryPhotos = [] } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .order('order_index');
      if (error) throw error;
      return data;
    }
  });

  const handleImageUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `gallery/${Date.now()}.${fileExt}`;
    
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
        .from('gallery_photos')
        .insert({
          title,
          category,
          image_url: imageUrl,
          order_index: galleryPhotos.length
        });

      if (error) throw error;

      toast({
        title: "Gallery photo added successfully",
      });

      setTitle("");
      setCategory("");
      setImageFile(null);
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
    } catch (error: any) {
      toast({
        title: "Error adding gallery photo",
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
        .from('gallery_photos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Gallery photo deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
    } catch (error: any) {
      toast({
        title: "Error deleting gallery photo",
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
            Add New Gallery Photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Input
                placeholder="Category (e.g., styling, coloring, cutting)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
              {isUploading ? "Uploading..." : "Add Photo"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {galleryPhotos.map((photo) => (
          <Card key={photo.id}>
            <CardContent className="p-4">
              <img
                src={photo.image_url}
                alt={photo.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold mb-1">{photo.title}</h3>
              <p className="text-sm text-gray-600 mb-4 capitalize">{photo.category}</p>
              <Button
                onClick={() => handleDelete(photo.id)}
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

export default GalleryManager;
