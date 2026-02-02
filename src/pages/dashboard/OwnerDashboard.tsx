
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Dog, Calendar } from "lucide-react";

export function OwnerDashboard({ user }: { user: any }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">我的毛孩</CardTitle>
            <Dog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">已建檔</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">即將到來的預約</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">尚無預約</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>最近預約</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            目前沒有預約紀錄
            <br />
            <Button variant="link" onClick={() => navigate("/")} className="mt-2">
              立即預約美容服務
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* 身份切換引導 */}
      <Card className="bg-blue-50 border-blue-100">
        <CardContent className="p-6 flex items-center justify-between">
            <div>
                <h3 className="font-bold text-blue-900">您是美容師或店家嗎？</h3>
                <p className="text-sm text-blue-700">立即申請加入平台，開始接單！</p>
            </div>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                申請開店
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
