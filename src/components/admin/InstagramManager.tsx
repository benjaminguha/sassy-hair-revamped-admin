
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Upload } from "lucide-react";

const InstagramManager = () => {
  const [newPost, setNewPost] = useState({
    post_url: "",
    image_file: null as File | null,
    caption: ""
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts = [] } = useQuery({
    queryKey: ['instagramPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .order('order_index');
      if (error) throw error;
      return data;
    }
  });

  const uploadImage = async (file: File, folder: string = 'instagram') => {
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

  const addPostMutation = useMutation({
    mutationFn: async (postData: typeof newPost) => {
      let imageUrl = '';
      
      if (postData.image_file) {
        setUploading(true);
        imageUrl = await uploadImage(postData.image_file);
      }

      const { error } = await supabase
        .from('instagram_posts')
        .insert([{
          post_url: postData.post_url,
          image_url: imageUrl,
          caption: postData.caption,
          order_index: posts.length
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instagramPosts'] });
      setNewPost({ post_url: "", image_file: null, caption: "" });
      setUploading(false);
      toast({ title: "Instagram post added successfully!" });
    },
    onError: () => {
      setUploading(false);
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, field, value, file }: { id: string, field: string, value: string | boolean, file?: File }) => {
      let updateData: any = { [field]: value };
      
      if (file && field === 'image_url') {
        setUploading(true);
        const imageUrl = await uploadImage(file);
        updateData = { image_url: imageUrl };
      }

      const { error } = await supabase
        .from('instagram_posts')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instagramPosts'] });
      setUploading(false);
      toast({ title: "Instagram post updated successfully!" });
    },
    onError: () => {
      setUploading(false);
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('instagram_posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instagramPosts'] });
      toast({ title: "Instagram post deleted successfully!" });
    }
  });

  const handleAddPost = () => {
    if (!newPost.post_url) {
      toast({ title: "Please provide an Instagram post URL", variant: "destructive" });
      return;
    }
    addPostMutation.mutate(newPost);
  };

  const handleUpdatePost = (id: string, field: string, value: string | boolean) => {
    updatePostMutation.mutate({ id, field, value });
  };

  const handleImageUpdate = (id: string, file: File) => {
    updatePostMutation.mutate({ id, field: 'image_url', value: '', file });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pink-600">Instagram Posts Management</h2>
      
      {/* Add New Post */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Instagram Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Instagram Post URL (share link)"
            value={newPost.post_url}
            onChange={(e) => setNewPost({ ...newPost, post_url: e.target.value })}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Preview Image (Optional)</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setNewPost({ ...newPost, image_file: e.target.files?.[0] || null })}
            />
          </div>
          <textarea
            className="w-full min-h-20 p-3 border border-gray-300 rounded-md"
            placeholder="Caption (optional)"
            value={newPost.caption}
            onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
          />
          <Button 
            onClick={handleAddPost} 
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
                Add Post
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Posts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm">Post #{post.order_index + 1}</CardTitle>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deletePostMutation.mutate(post.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {post.image_url && (
                <img src={post.image_url} alt="Instagram post" className="w-full h-24 object-cover rounded" />
              )}
              <Input
                placeholder="Post URL"
                defaultValue={post.post_url || ""}
                onBlur={(e) => handleUpdatePost(post.id, 'post_url', e.target.value)}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Update Preview Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpdate(post.id, file);
                  }}
                />
              </div>
              <textarea
                className="w-full min-h-16 p-2 border border-gray-300 rounded-md text-sm"
                placeholder="Caption"
                defaultValue={post.caption || ""}
                onBlur={(e) => handleUpdatePost(post.id, 'caption', e.target.value)}
              />
              <div className="flex items-center space-x-2">
                <label className="text-sm">Active:</label>
                <input
                  type="checkbox"
                  checked={post.is_active}
                  onChange={(e) => handleUpdatePost(post.id, 'is_active', e.target.checked)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InstagramManager;
