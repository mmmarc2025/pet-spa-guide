
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, DollarSign, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_min: number;
  is_active: boolean;
};

export default function ServiceManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration_min: "60",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("provider_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setServices(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const { error } = await supabase.from("services").insert({
        provider_id: user.id,
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        duration_min: parseInt(formData.duration_min),
      });

      if (error) throw error;

      toast({ title: "新增成功！", description: "服務已上架。" });
      setOpen(false);
      setFormData({ name: "", description: "", price: "", duration_min: "60" });
      fetchServices();
    } catch (error: any) {
      toast({ title: "錯誤", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除此服務嗎？")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (!error) {
      toast({ title: "已刪除" });
      fetchServices();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">我的服務項目</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> 新增服務
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增服務項目</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>服務名稱</Label>
                <Input placeholder="例如：貴賓泰迪熊剪" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>價格 (TWD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-8" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>預計時間 (分鐘)</Label>
                  <div className="relative">
                    <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-8" type="number" value={formData.duration_min} onChange={e => setFormData({...formData, duration_min: e.target.value})} required />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>服務描述</Label>
                <Textarea placeholder="包含洗澡、剪指甲、清耳朵..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "儲存中..." : "確認上架"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                {service.name}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(service.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${service.price}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {service.duration_min} 分鐘
              </p>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                {service.description || "無描述"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
