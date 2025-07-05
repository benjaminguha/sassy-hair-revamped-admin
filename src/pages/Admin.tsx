import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import CarouselManager from "@/components/admin/CarouselManager";
import ServicesManager from "@/components/admin/ServicesManager";
import GalleryManager from "@/components/admin/GalleryManager";
import SettingsManager from "@/components/admin/SettingsManager";
import AdminUserManager from "@/components/admin/AdminUserManager";

const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setIsCheckingAuth(false);
      return;
    }

    setUser(session.user);

    // Check admin status
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .single();

    if (error || !adminUser) {
      await supabase.auth.signOut();
      setIsCheckingAuth(false);
      return;
    }

    setIsAdmin(true);
    setIsSuperAdmin(adminUser.role === 'super_admin');
    setIsCheckingAuth(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Check if user is an admin
      if (data.user) {
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', data.user.id)
          .eq('is_active', true)
          .single();

        if (adminError || !adminUser) {
          await supabase.auth.signOut();
          throw new Error("Access denied. Admin privileges required.");
        }

        setUser(data.user);
        setIsAdmin(true);
        setIsSuperAdmin(adminUser.role === 'super_admin');
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin panel!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    const quickEmail = "sassyadmin@sassyhair.com";
    const quickPassword = "sassyadmin#";
    
    setEmail(quickEmail);
    setPassword(quickPassword);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: quickEmail,
        password: quickPassword,
      });

      if (error) {
        throw error;
      }

      // Check if user is an admin
      if (data.user) {
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', data.user.id)
          .eq('is_active', true)
          .single();

        if (adminError || !adminUser) {
          await supabase.auth.signOut();
          throw new Error("Access denied. Admin privileges required.");
        }

        setUser(data.user);
        setIsAdmin(true);
        setIsSuperAdmin(adminUser.role === 'super_admin');
        
        toast({
          title: "Quick login successful",
          description: "Welcome to the admin panel!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Quick login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setIsSuperAdmin(false);
    setEmail("");
    setPassword("");
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated or not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-pink-600">
              Admin Login
            </CardTitle>
            <p className="text-gray-600">Access the admin panel</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            <div className="mt-4 pt-4 border-t">
              <Button
                onClick={handleQuickLogin}
                variant="outline"
                className="w-full text-sm"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Quick Login (Demo)"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show admin dashboard if authenticated and admin
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

export default Admin;
