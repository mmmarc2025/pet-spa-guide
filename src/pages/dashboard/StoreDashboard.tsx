
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, MapPin, Clock } from "lucide-react";

export function StoreDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">店家管理中心</h2>
          <Button>新增服務項目</Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">營業狀態</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">營業中</div>
            <p className="text-xs text-muted-foreground">目前可接受預約</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">今日預約</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">還有 3 個空檔</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>門市資訊</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid gap-2">
                <label className="text-sm font-medium">店名</label>
                <div className="p-2 border rounded bg-gray-50">{user.store_name || "尚未設定"}</div>
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium">地址</label>
                <div className="flex items-center gap-2 p-2 border rounded bg-gray-50">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {user.store_address || "尚未設定"}
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
