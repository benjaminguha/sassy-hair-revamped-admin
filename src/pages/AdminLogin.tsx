
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

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

        toast({
          title: "Login successful",
          description: "Welcome to the admin panel!",
        });
        navigate("/admin/dashboard");
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

  // Quick access for the sassyadmin user
  const handleQuickLogin = async () => {
    setEmail("sassyadmin@sassyhair.com");
    setPassword("sassyadmin#");
    
    // Auto-submit after setting values
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

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
            >
              Quick Login (Demo)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
