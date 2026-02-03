import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { Dog, Calendar, Store, Scissors, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export function OwnerDashboard({ user }: { user: any }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Partner Application State
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [applyType, setApplyType] = useState<"store" | "groomer">("store");
  const [applyName, setApplyName] = useState("");
  const [loading, setLoading] = useState(false);

  // Pet State
  const [petCount, setPetCount] = useState(0);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [petForm, setPetForm] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    notes: ""
  });

  useEffect(() => {
    if (user?.id) {
        fetchPetCount();
    }
  }, [user?.id]);

  const fetchPetCount = async () => {
    const { count, error } = await supabase
        .from('pets')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
    
    if (error) {
        console.error("Error fetching pets:", error);
    } else if (count !== null) {
        setPetCount(count);
    }
  };

  const handleAddPet = async () => {
    if (!petForm.name) {
        toast({ title: "請填寫寵物名稱", variant: "destructive" });
        return;
    }
    setLoading(true);
    try {
        const { error } = await supabase.from('pets').insert({
            user_id: user.id,
            name: petForm.name,
            breed: petForm.breed,
            age: petForm.age ? parseInt(petForm.age) : null,
            weight: petForm.weight ? parseFloat(petForm.weight) : null,
            notes: petForm.notes
        });

        if (error) throw error;

        toast({ title: "新增成功", description: "您的毛孩已加入資料庫。" });
        setIsAddPetOpen(false);
        setPetForm({ name: "", breed: "", age: "", weight: "", notes: "" });
        fetchPetCount();
    } catch (e: any) {
        toast({ title: "新增失敗", description: e.message, variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!applyName) return;
    setLoading(true);

    try {
        const updates: any = {
            role: applyType,
            is_verified: false, // Pending admin approval
        };

        if (applyName) {
            updates.store_name = applyName;
        }
        
        /* 
        if (applyType === 'store') {
            updates.store_name = applyName;
        } else {
            // For groomer, maybe bio or just reuse store_name field conceptually or add display_name update
            // Let's stick to updating role first.
        }
        */

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

        if (error) throw error;

        toast({ title: "申請已送出", description: "請耐心等候管理員審核。" });
        setIsApplyOpen(false);
        // Reload page to reflect state change (Dashboard parent will catch role change)
        window.location.reload();

    } catch (e: any) {
        toast({ title: "申請失敗", description: e.message, variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* My Pets Card */}
        <Card className="relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">我的毛孩</CardTitle>
            <div className="flex items-center gap-2">
                <Dialog open={isAddPetOpen} onOpenChange={setIsAddPetOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>新增毛孩</DialogTitle>
                            <DialogDescription>
                                填寫您的毛孩基本資料
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="pet-name">名字</Label>
                                <Input 
                                    id="pet-name" 
                                    value={petForm.name} 
                                    onChange={(e) => setPetForm({...petForm, name: e.target.value})} 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="pet-breed">品種</Label>
                                    <Input 
                                        id="pet-breed" 
                                        value={petForm.breed} 
                                        onChange={(e) => setPetForm({...petForm, breed: e.target.value})} 
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="pet-age">年齡 (歲)</Label>
                                    <Input 
                                        id="pet-age" 
                                        type="number" 
                                        value={petForm.age} 
                                        onChange={(e) => setPetForm({...petForm, age: e.target.value})} 
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="pet-weight">體重 (kg)</Label>
                                <Input 
                                    id="pet-weight" 
                                    type="number" 
                                    step="0.1" 
                                    value={petForm.weight} 
                                    onChange={(e) => setPetForm({...petForm, weight: e.target.value})} 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="pet-notes">備註</Label>
                                <Textarea 
                                    id="pet-notes" 
                                    value={petForm.notes} 
                                    onChange={(e) => setPetForm({...petForm, notes: e.target.value})} 
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddPetOpen(false)}>取消</Button>
                            <Button onClick={handleAddPet} disabled={loading}>
                                {loading ? "新增中..." : "新增"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dog className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{petCount}</div>
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
        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <h3 className="font-bold text-blue-900 text-lg">成為合作夥伴</h3>
                <p className="text-sm text-blue-700 mt-1">
                    無論您是擁有實體店面的店家，或是提供到府服務的獨立美容師，
                    <br className="hidden md:block"/>
                    都歡迎加入我們，接觸更多毛孩家長！
                </p>
            </div>
            
            <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm whitespace-nowrap">
                        立即申請加入
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>申請成為合作夥伴</DialogTitle>
                        <DialogDescription>
                            請選擇您的服務類型並填寫基本資料，管理員審核通過後即可開通後台。
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                        <div className="space-y-3">
                            <Label>您是？</Label>
                            <RadioGroup value={applyType} onValueChange={(v: any) => setApplyType(v)} className="grid grid-cols-2 gap-4">
                                <div>
                                    <RadioGroupItem value="store" id="type-store" className="peer sr-only" />
                                    <Label
                                        htmlFor="type-store"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer"
                                    >
                                        <Store className="mb-3 h-6 w-6" />
                                        實體店家
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="groomer" id="type-groomer" className="peer sr-only" />
                                    <Label
                                        htmlFor="type-groomer"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer"
                                    >
                                        <Scissors className="mb-3 h-6 w-6" />
                                        獨立美容師
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                {applyType === 'store' ? '店鋪名稱' : '服務名稱 / 暱稱'}
                            </Label>
                            <Input 
                                id="name" 
                                placeholder={applyType === 'store' ? "例如：快樂狗寵物沙龍" : "例如：小美美容師"} 
                                value={applyName}
                                onChange={(e) => setApplyName(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApplyOpen(false)}>取消</Button>
                        <Button onClick={handleApply} disabled={loading}>
                            {loading ? "送出中..." : "送出申請"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
