
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Upload } from "lucide-react";

const ServicesManager = () => {
  const [newService, setNewService] = useState({ name: "", description: "", price: "", image_file: null as File | null });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order_index');
      if (error) throw error;
      return data;
    }
  });

  const uploadImage = async (file: File, folder: string = 'services') => {
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

  const addServiceMutation = useMutation({
    mutationFn: async (serviceData: typeof newService) => {
      let imageUrl = '';
      
      if (serviceData.image_file) {
        setUploading(true);
        imageUrl = await uploadImage(serviceData.image_file);
      }

      const { error } = await supabase
        .from('services')
        .insert([{
          name: serviceData.name,
          description: serviceData.description,
          price: serviceData.price,
          image_url: imageUrl,
          order_index: services.length
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setNewService({ name: "", description: "", price: "", image_file: null });
      setUploading(false);
      toast({ title: "Service added successfully!" });
    },
    onError: () => {
      setUploading(false);
    }
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, field, value, file }: { id: string, field: string, value: string | boolean, file?: File }) => {
      let updateData: any = { [field]: value };
      
      if (file && field === 'image_url') {
        setUploading(true);
        const imageUrl = await uploadImage(file);
        updateData = { image_url: imageUrl };
      }

      const { error } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setUploading(false);
      toast({ title: "Service updated successfully!" });
    },
    onError: () => {
      setUploading(false);
    }
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({ title: "Service deleted successfully!" });
    }
  });

  const handleAddService = () => {
    if (!newService.name) {
      toast({ title: "Please fill in service name", variant: "destructive" });
      return;
    }
    addServiceMutation.mutate(newService);
  };

  const handleUpdateService = (id: string, field: string, value: string | boolean) => {
    updateServiceMutation.mutate({ id, field, value });
  };

  const handleImageUpdate = (id: string, file: File) => {
    updateServiceMutation.mutate({ id, field: 'image_url', value: '', file });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pink-600">Services Management</h2>
      
      {/* Add New Service */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Service Name"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
          />
          <Input
            placeholder="Price (e.g., $50-80)"
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Image (Optional)</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setNewService({ ...newService, image_file: e.target.files?.[0] || null })}
            />
          </div>
          <Button 
            onClick={handleAddService} 
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
                Add Service
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteServiceMutation.mutate(service.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {service.image_url && (
                <img src={service.image_url} alt={service.name} className="w-full h-32 object-cover rounded" />
              )}
              <Input
                placeholder="Service Name"
                defaultValue={service.name}
                onBlur={(e) => handleUpdateService(service.id, 'name', e.target.value)}
              />
              <Input
                placeholder="Description"
                defaultValue={service.description || ""}
                onBlur={(e) => handleUpdateService(service.id, 'description', e.target.value)}
              />
              <Input
                placeholder="Price"
                defaultValue={service.price || ""}
                onBlur={(e) => handleUpdateService(service.id, 'price', e.target.value)}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Update Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpdate(service.id, file);
                  }}
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm">Active:</label>
                <input
                  type="checkbox"
                  checked={service.is_active}
                  onChange={(e) => handleUpdateService(service.id, 'is_active', e.target.checked)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesManager;
