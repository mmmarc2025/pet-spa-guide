
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, User, LogOut, Dog } from "lucide-react";

type Booking = {
  id: number;
  created_at: string;
  pet_type: string;
  service_type: string;
  preferred_date: string;
  status: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Try Supabase Auth
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        fetchBookings(session.user.id);
        return;
      }

      // 2. Try Custom Auth (LINE)
      const customToken = localStorage.getItem("custom_auth_token");
      const customUserStr = localStorage.getItem("custom_user");
      
      if (customToken && customUserStr) {
        try {
          const customUser = JSON.parse(customUserStr);
          // Adapt custom user to match minimal expectation (email/id)
          setUser({
            id: customUser.id,
            email: customUser.display_name || "LINE User", // Display name as email fallback
            user_metadata: {
              avatar_url: customUser.picture_url
            }
          });
          fetchBookings(customUser.id);
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

  const fetchBookings = async (userId: string) => {
    // 這裡我們暫時用 owner_name 來模擬查詢，實際上應該用 user_id
    // 因為目前的 bookings 表還沒強制關聯 user_id，我們抓取所有 (Demo用)
    // 之後 migration 跑完應該改為 .eq('user_id', userId)
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order('created_at', { ascending: false });
      
    if (data) setBookings(data);
  };

  const handleLogout = async () => {
    // Clear both
    await supabase.auth.signOut();
    localStorage.removeItem("custom_auth_token");
    localStorage.removeItem("custom_user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl font-bold text-primary">
            <Dog className="w-6 h-6" />
            <span>會員中心</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:inline">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              登出
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-4">
          {/* Sidebar Navigation */}
          <Card className="md:col-span-1 h-fit">
            <CardContent className="p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start text-primary font-medium bg-primary/10">
                <Calendar className="w-4 h-4 mr-2" />
                我的預約
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                個人資料
              </Button>
            </CardContent>
          </Card>

import ServiceManager from "@/components/ServiceManager";

// Inside Dashboard component...
          {/* Main Content */}
          <div className="md:col-span-3">
            <Tabs defaultValue="bookings">
              <TabsList>
                <TabsTrigger value="bookings">預約管理</TabsTrigger>
                {/* 只有美容師才顯示服務管理 */}
                <TabsTrigger value="services">服務項目</TabsTrigger> 
              </TabsList>
              
              <TabsContent value="bookings">
                <Card>
                  <CardHeader>
                    <CardTitle>預約紀錄</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* ... existing booking list ... */}
                    {bookings.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        目前沒有預約紀錄
                        <br />
                        <Button variant="link" onClick={() => navigate("/")} className="mt-2">
                          去預約第一次服務
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {booking.service_type === 'basic_bath' ? '🛁 基礎洗澡' : '✂️ 大美容'}
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                                }`}>
                                  {booking.status === 'pending' ? '待確認' : booking.status}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                預約日期：{new Date(booking.preferred_date).toLocaleDateString()}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">查看詳情</Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="services">
                <ServiceManager />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
