
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
      const role = user.role || 'owner';
      
      // Check for pending verification
      if ((role === 'store' || role === 'groomer') && user.is_verified === false) {
          return (
              <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                      <div className="text-4xl">⏳</div>
                  </div>
                  <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900">帳號審核中</h2>
                      <p className="text-gray-500 max-w-md mx-auto">
                          我們已收到您的{role === 'store' ? '店家' : '美容師'}申請。
                          <br />
                          管理員將在 24 小時內完成審核，請稍候再回來查看。
                      </p>
                  </div>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                      重新整理狀態
                  </Button>
              </div>
          );
      }

      switch(role) {
          case 'admin': return <AdminDashboard user={user} />;
          case 'store': return <StoreDashboard user={user} />;
          case 'groomer': return <GroomerDashboard user={user} />;
          case 'owner':
          default: return <OwnerDashboard user={user} />;
      }
  };

  // Role translation map
  const roleNames: Record<string, string> = {
    owner: "毛孩家長",
    groomer: "美容師",
    store: "店家",
    admin: "管理員"
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
              <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20 font-medium">
                {roleNames[user?.role] || "會員"}
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
