
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Scissors, Map, Star } from "lucide-react";

export function GroomerDashboard({ user }: { user: any }) {
  // Demo data for service areas
  const areas = user?.service_areas || ["大安區", "信義區"];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">接單狀態</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Switch id="groomer-status" defaultChecked />
            <Label htmlFor="groomer-status">可接單</Label>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">評價分數</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.0</div>
            <p className="text-xs text-muted-foreground">基於 0 筆評價</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>服務區域</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {areas.map((area: string) => (
                <Badge key={area} variant="secondary" className="text-sm py-1 px-3">
                    {area}
                </Badge>
            ))}
            <Button variant="outline" size="sm" className="h-7 text-xs">+ 新增區域</Button>
          </div>
          <p className="text-sm text-muted-foreground">
            設定您願意前往提供到府服務的區域，系統將會根據區域媒合訂單。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
