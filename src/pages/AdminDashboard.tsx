
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import CarouselManager from "@/components/admin/CarouselManager";
import ServicesManager from "@/components/admin/ServicesManager";
import GalleryManager from "@/components/admin/GalleryManager";
import SettingsManager from "@/components/admin/SettingsManager";
import AdminUserManager from "@/components/admin/AdminUserManager";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/hidden-admin-login");
      return;
    }

    setUser(session.user);

    // Check admin status
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .single();

    if (!adminUser) {
      toast({
        title: "Access denied",
        description: "Admin privileges required",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      navigate("/hidden-admin-login");
      return;
    }

    setIsAdmin(true);
    setIsSuperAdmin(adminUser.role === 'super_admin');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/hidden-admin-login");
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-pink-600">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.email}</span>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="carousel" className="space-y-6">
          <TabsList className={`grid w-full ${isSuperAdmin ? 'grid-cols-5' : 'grid-cols-4'}`}>
            <TabsTrigger value="carousel">Carousel</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            {isSuperAdmin && <TabsTrigger value="admin-users">Admin Users</TabsTrigger>}
          </TabsList>

          <TabsContent value="carousel">
            <CarouselManager />
          </TabsContent>

          <TabsContent value="services">
            <ServicesManager />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryManager />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsManager />
          </TabsContent>

          {isSuperAdmin && (
            <TabsContent value="admin-users">
              <AdminUserManager />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
