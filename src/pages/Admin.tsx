import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import CarouselManager from "@/components/admin/CarouselManager";
import ServicesManager from "@/components/admin/ServicesManager";
import GalleryManager from "@/components/admin/GalleryManager";
import StylistsManager from "@/components/admin/StylistsManager";
import InstagramManager from "@/components/admin/InstagramManager";
import SettingsManager from "@/components/admin/SettingsManager";

const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
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

      if (!error && adminUser) {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    }
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

      if (data.user) {
        // Check admin status
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', data.user.id)
          .eq('is_active', true);

        if (adminError) {
          await supabase.auth.signOut();
          throw new Error(`Database error: ${adminError.message}`);
        }

        if (!adminUser || adminUser.length === 0) {
          await supabase.auth.signOut();
          throw new Error("Access denied. Admin privileges required.");
        }

        setUser(data.user);
        setIsAdmin(true);
        
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setEmail("");
    setPassword("");
    setCurrentView("dashboard");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "carousel":
        return <CarouselManager />;
      case "services":
        return <ServicesManager />;
      case "gallery":
        return <GalleryManager />;
      case "stylists":
        return <StylistsManager />;
      case "instagram":
        return <InstagramManager />;
      case "settings":
        return <SettingsManager />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Carousel Images</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage hero carousel images</p>
                <Button 
                  className="mt-4 bg-pink-600 hover:bg-pink-700"
                  onClick={() => setCurrentView("carousel")}
                >
                  Manage Carousel
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage salon services</p>
                <Button 
                  className="mt-4 bg-pink-600 hover:bg-pink-700"
                  onClick={() => setCurrentView("services")}
                >
                  Manage Services
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage photo gallery</p>
                <Button 
                  className="mt-4 bg-pink-600 hover:bg-pink-700"
                  onClick={() => setCurrentView("gallery")}
                >
                  Manage Gallery
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stylists</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage salon stylists</p>
                <Button 
                  className="mt-4 bg-pink-600 hover:bg-pink-700"
                  onClick={() => setCurrentView("stylists")}
                >
                  Manage Stylists
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instagram</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage Instagram posts</p>
                <Button 
                  className="mt-4 bg-pink-600 hover:bg-pink-700"
                  onClick={() => setCurrentView("instagram")}
                >
                  Manage Instagram
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage site settings</p>
                <Button 
                  className="mt-4 bg-pink-600 hover:bg-pink-700"
                  onClick={() => setCurrentView("settings")}
                >
                  Manage Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

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
            <div className="flex items-center space-x-4">
              {currentView !== "dashboard" && (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView("dashboard")}
                  className="text-pink-600"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              )}
              <h1 className="text-2xl font-bold text-pink-600">
                {currentView === "dashboard" ? "Admin Dashboard" : 
                 currentView === "carousel" ? "Carousel Management" :
                 currentView === "services" ? "Services Management" :
                 currentView === "gallery" ? "Gallery Management" :
                 currentView === "stylists" ? "Stylists Management" :
                 currentView === "instagram" ? "Instagram Management" :
                 "Settings Management"}
              </h1>
            </div>
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
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default Admin;
