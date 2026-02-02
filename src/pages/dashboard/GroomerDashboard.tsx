
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Map, Bike } from "lucide-react";

export function GroomerDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">美容師接單中心</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">接單狀態：</span>
            <Button variant="default" className="bg-green-600 hover:bg-green-700">接單中</Button>
          </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本月收入</CardTitle>
            <div className="text-2xl font-bold">NT$ 0</div>
          </CardHeader>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">待處理訂單</CardTitle>
                <div className="text-2xl font-bold">0</div>
            </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>服務設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                    <Map className="w-4 h-4" />
                    服務區域
                </h3>
                <div className="flex flex-wrap gap-2">
                    {user.service_areas?.length > 0 ? (
                        user.service_areas.map((area: string) => (
                            <span key={area} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {area}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-400 text-sm">尚未設定服務區域</span>
                    )}
                    <Button variant="outline" size="sm" className="h-7 text-xs">+ 編輯區域</Button>
                </div>
            </div>
            
            <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                    <Scissors className="w-4 h-4" />
                    提供的服務
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2 border p-3 rounded hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span>基礎洗澡</span>
                    </label>
                    <label className="flex items-center space-x-2 border p-3 rounded hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span>精緻修剪</span>
                    </label>
                    <label className="flex items-center space-x-2 border p-3 rounded hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>貓咪美容</span>
                    </label>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
