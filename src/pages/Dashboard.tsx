
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { LogOut, Dog } from "lucide-react";
import { OwnerDashboard } from "./dashboard/OwnerDashboard";
import { StoreDashboard } from "./dashboard/StoreDashboard";
import { GroomerDashboard } from "./dashboard/GroomerDashboard";
import { AdminDashboard } from "./dashboard/AdminDashboard";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Try Supabase Auth
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Fetch full profile including role
        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
        setUser(profile || session.user);
        setLoading(false);
        return;
      }

      // 2. Try Custom Auth (LINE)
      const customToken = localStorage.getItem("custom_auth_token");
      const customUserStr = localStorage.getItem("custom_user");
      
      if (customToken && customUserStr) {
        try {
          const customUser = JSON.parse(customUserStr);
          // Already has role from Edge Function response
          setUser(customUser);
          setLoading(false);
          return;
        } catch (e) {
          console.error("Invalid custom user data", e);
        }
      }

      // 3. No auth found
      navigate("/auth");
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("custom_auth_token");
    localStorage.removeItem("custom_user");
    navigate("/");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // Role-based rendering
  const renderDashboard = () => {
      switch(user.role) {
          case 'admin': return <AdminDashboard user={user} />;
          case 'store': return <StoreDashboard user={user} />;
          case 'groomer': return <GroomerDashboard user={user} />;
          case 'owner':
          default: return <OwnerDashboard user={user} />;
      }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
            <Dog className="w-6 h-6" />
            <span>會員中心</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:inline">
              {user?.display_name || user?.email} 
              <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-xs border uppercase">
                {user?.role || 'owner'}
              </span>
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              登出
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
}
