import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

const InstagramManager = () => {
  const [newPost, setNewPost] = useState({
    post_url: "",
    image_url: "",
    caption: ""
  });
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

  const addPostMutation = useMutation({
    mutationFn: async (postData: typeof newPost) => {
      const { error } = await supabase
        .from('instagram_posts')
        .insert([{
          ...postData,
          order_index: posts.length
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instagramPosts'] });
      setNewPost({ post_url: "", image_url: "", caption: "" });
      toast({ title: "Instagram post added successfully!" });
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase
        .from('instagram_posts')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instagramPosts'] });
      toast({ title: "Instagram post updated successfully!" });
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
    updatePostMutation.mutate({ id, [field]: value });
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
          <Input
            placeholder="Image URL (optional - for preview)"
            value={newPost.image_url}
            onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
          />
          <textarea
            className="w-full min-h-20 p-3 border border-gray-300 rounded-md"
            placeholder="Caption (optional)"
            value={newPost.caption}
            onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
          />
          <Button onClick={handleAddPost} className="bg-pink-600 hover:bg-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Post
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
              <Input
                placeholder="Image URL"
                defaultValue={post.image_url || ""}
                onBlur={(e) => handleUpdatePost(post.id, 'image_url', e.target.value)}
              />
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
