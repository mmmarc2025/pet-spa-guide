
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, ShieldAlert, CheckCircle, XCircle, Store, Scissors, Home } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export function AdminDashboard({ user }: { user: any }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({ totalUsers: 0, pending: 0 });
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    // Fetch pending applications (Include 'provider' just in case)
    const { data: pending, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['store', 'groomer', 'provider', 'admin'])
        .eq('is_verified', false)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Fetch error:", error);
    } else {
        // Filter out self if somehow included
        const filtered = pending?.filter(u => u.id !== user.id) || [];
        setPendingUsers(filtered);
        setStats({ 
            totalUsers: 0, 
            pending: filtered.length 
        });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    const { error } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', id);

    if (error) {
        toast({ title: "操作失敗", description: error.message, variant: "destructive" });
    } else {
        toast({ title: "已核准", description: "該用戶現在可以登入後台了。" });
        fetchData();
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
        .from('profiles')
        .update({ role: 'owner', is_verified: false })
        .eq('id', id);

    if (error) {
        toast({ title: "操作失敗", description: error.message, variant: "destructive" });
    } else {
        toast({ title: "已駁回", description: "該用戶身分已重置為一般會員。" });
        fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <Home className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">系統管理中心</h2>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData}>重新整理</Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總用戶數</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">待審核申請</CardTitle>
              <ShieldAlert className={`h-4 w-4 ${stats.pending > 0 ? "text-orange-500" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
      </div>

      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList>
            <TabsTrigger value="applications">申請審核</TabsTrigger>
            <TabsTrigger value="users">所有用戶</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications">
            <Card>
                <CardHeader>
                    <CardTitle>待審核列表</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-4">載入中...</div>
                    ) : pendingUsers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">目前沒有待審核的申請</div>
                    ) : (
                        <div className="space-y-4">
                            {pendingUsers.map(u => (
                                <div key={u.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                                        <div className={`p-2 rounded-full ${u.role === 'store' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                            {u.role === 'store' ? <Store className="w-5 h-5" /> : <Scissors className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg flex items-center gap-2">
                                                {u.store_name || u.full_name}
                                                <Badge variant="outline" className="capitalize">{u.role}</Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                ID: {u.id.substring(0,8)}...
                                                <br />
                                                申請時間：{new Date(u.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Button variant="outline" className="flex-1 md:flex-none border-red-200 text-red-700 hover:bg-red-50" onClick={() => handleReject(u.id)}>
                                            <XCircle className="w-4 h-4 mr-2" />
                                            駁回
                                        </Button>
                                        <Button className="flex-1 md:flex-none bg-green-600 hover:bg-green-700" onClick={() => handleApprove(u.id)}>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            核准
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
