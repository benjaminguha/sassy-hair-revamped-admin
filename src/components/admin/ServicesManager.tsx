
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Edit } from "lucide-react";

const ServicesManager = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services = [] } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order_index');
      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        const { error } = await supabase
          .from('services')
          .update({
            name,
            description,
            price
          })
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: "Service updated successfully",
        });
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('services')
          .insert({
            name,
            description,
            price,
            order_index: services.length
          });

        if (error) throw error;

        toast({
          title: "Service added successfully",
        });
      }

      setName("");
      setDescription("");
      setPrice("");
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    } catch (error: any) {
      toast({
        title: editingId ? "Error updating service" : "Error adding service",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (service: any) => {
    setName(service.name);
    setDescription(service.description || "");
    setPrice(service.price || "");
    setEditingId(service.id);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Service deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    } catch (error: any) {
      toast({
        title: "Error deleting service",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={20} />
            {editingId ? "Edit Service" : "Add New Service"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Service Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <Input
                placeholder="Price (e.g., From $65)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                {editingId ? "Update Service" : "Add Service"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
              {service.price && (
                <p className="text-pink-600 font-semibold mb-2">{service.price}</p>
              )}
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(service)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit size={16} className="mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(service.id)}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesManager;
