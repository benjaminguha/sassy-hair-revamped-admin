
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminUserManager = () => {
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("admin");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: adminUsers = [] } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const createAdminMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      // First create the user account
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: 'TempPassword123!', // User will need to reset
        email_confirm: true
      });

      if (authError) throw authError;

      // Then add them to admin_users table
      const { data, error } = await supabase
        .from('admin_users')
        .insert({
          user_id: authData.user.id,
          email,
          role,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Admin user created successfully",
        description: "The user will receive instructions to set their password.",
      });
      setNewAdminEmail("");
      setNewAdminRole("admin");
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating admin user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: async (adminId: string) => {
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: false })
        .eq('id', adminId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Admin user deactivated",
      });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deactivating admin user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    createAdminMutation.mutate({ email: newAdminEmail, role: newAdminRole });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Admin Users</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pink-600 hover:bg-pink-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Admin User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Admin User</DialogTitle>
                <DialogDescription>
                  Create a new admin user account. They will receive login instructions via email.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <Select value={newAdminRole} onValueChange={setNewAdminRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  disabled={createAdminMutation.isPending}
                >
                  {createAdminMutation.isPending ? "Creating..." : "Create Admin User"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adminUsers.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{admin.email}</p>
                  <p className="text-sm text-gray-500">
                    Role: {admin.role} • Status: {admin.is_active ? 'Active' : 'Inactive'}
                  </p>
                  <p className="text-xs text-gray-400">
                    Created: {new Date(admin.created_at).toLocaleDateString()}
                  </p>
                </div>
                {admin.is_active && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteAdminMutation.mutate(admin.id)}
                    disabled={deleteAdminMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManager;
