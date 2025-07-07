import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

const ServicesManager = () => {
  const [newService, setNewService] = useState({ name: "", description: "", price: "", image_url: "" });
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

  const addServiceMutation = useMutation({
    mutationFn: async (serviceData: typeof newService) => {
      const { error } = await supabase
        .from('services')
        .insert([{
          ...serviceData,
          order_index: services.length
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setNewService({ name: "", description: "", price: "", image_url: "" });
      toast({ title: "Service added successfully!" });
    }
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({ title: "Service updated successfully!" });
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
    updateServiceMutation.mutate({ id, [field]: value });
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
          <Input
            placeholder="Image URL"
            value={newService.image_url}
            onChange={(e) => setNewService({ ...newService, image_url: e.target.value })}
          />
          <Button onClick={handleAddService} className="bg-pink-600 hover:bg-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Service
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
              <Input
                placeholder="Image URL"
                defaultValue={service.image_url || ""}
                onBlur={(e) => handleUpdateService(service.id, 'image_url', e.target.value)}
              />
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
