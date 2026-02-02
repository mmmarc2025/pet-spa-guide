
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Store, Clock, MapPin } from "lucide-react";

export function StoreDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日訂單</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">0 筆待處理</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">營業狀態</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Switch id="store-status" defaultChecked />
            <Label htmlFor="store-status">營業中</Label>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>門市資訊</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>店名</Label>
            <Input defaultValue={user?.store_name || "我的寵物美容店"} />
          </div>
          <div className="space-y-2">
            <Label>地址</Label>
            <div className="flex gap-2">
                <MapPin className="w-4 h-4 mt-3 text-muted-foreground" />
                <Input defaultValue={user?.store_address || ""} placeholder="請輸入門市地址" />
            </div>
          </div>
          <Button>儲存設定</Button>
        </CardContent>
      </Card>
    </div>
  );
}
