
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";

export default function ProviderRegister() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    bio: "",
    years_experience: "",
    service_area: "", // e.g., "信義區, 大安區"
    license_level: "",
  });

  const [files, setFiles] = useState<{
    license?: File;
    police_record?: File;
    portfolio?: FileList;
  }>({});

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast({ title: "請先登入", description: "申請成為美容師前，請先註冊一般會員帳號。" });
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: any, type: string) => {
    if (e.target.files && e.target.files.length > 0) {
      if (type === 'portfolio') {
        setFiles(prev => ({ ...prev, [type]: e.target.files }));
      } else {
        setFiles(prev => ({ ...prev, [type]: e.target.files[0] }));
      }
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    if (error) throw error;
    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // 1. Upload License (if provided)
      let licensePath = null;
      if (files.license) {
        const ext = files.license.name.split('.').pop();
        licensePath = await uploadFile(files.license, 'provider-docs', `${user.id}/license.${ext}`);
      }

      // 2. Upload Police Record
      let policeRecordPath = null;
      if (files.police_record) {
        const ext = files.police_record.name.split('.').pop();
        policeRecordPath = await uploadFile(files.police_record, 'provider-docs', `${user.id}/police_record.${ext}`);
      }

      // 3. Upload Portfolio (Multiple)
      const portfolioPaths: string[] = [];
      if (files.portfolio) {
        for (let i = 0; i < files.portfolio.length; i++) {
          const file = files.portfolio[i];
          const path = await uploadFile(file, 'portfolio', `${user.id}/work_${Date.now()}_${i}.${file.name.split('.').pop()}`);
          const { data: publicUrl } = supabase.storage.from('portfolio').getPublicUrl(path);
          portfolioPaths.push(publicUrl.publicUrl);
        }
      }

      // 4. Update Profile Role
      await supabase.from('profiles').update({ role: 'provider' }).eq('id', user.id);

      // 5. Insert Provider Data
      const { error } = await supabase.from('providers').upsert({
        id: user.id,
        bio: formData.bio,
        years_experience: parseInt(formData.years_experience) || 0,
        service_area: formData.service_area.split(/[,，]\s*/), // Split by comma
        portfolio_images: portfolioPaths,
        is_verified: false, // Default to unverified
        // Note: We might want to store license_level and file paths in a separate 'provider_verifications' table strictly,
        // but for now let's append to bio or assume admin checks storage.
        // Or better: add metadata columns later.
      });

      if (error) throw error;

      toast({ 
        title: "申請已送出！", 
        description: "我們會儘快審核您的資料 (約 1-2 個工作天)。" 
      });
      navigate("/dashboard");

    } catch (error: any) {
      console.error(error);
      toast({ title: "申請失敗", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">成為 WashPet 美容師夥伴</h1>
          <p className="text-gray-600 mt-2">接單自由、增加收入，與我們一起服務可愛的毛小孩。</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>申請資料表</CardTitle>
            <CardDescription>請誠實填寫，這將影響審核結果與接單權限。</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="years_experience">美容經驗 (年)</Label>
                    <Input id="years_experience" type="number" placeholder="例如：3" value={formData.years_experience} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license_level">最高證照等級</Label>
                    <Select onValueChange={(val) => setFormData(prev => ({ ...prev, license_level: val }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">無證照 (僅實作審核)</SelectItem>
                        <SelectItem value="c_level">C 級 (KCT/TGA/PGA)</SelectItem>
                        <SelectItem value="b_level">B 級 (進階造型)</SelectItem>
                        <SelectItem value="a_level">A 級 / 教師級</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service_area">服務區域 (請用逗號分隔)</Label>
                  <Input id="service_area" placeholder="例如：信義區, 大安區, 松山區" value={formData.service_area} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">自我介紹 (將顯示給飼主看)</Label>
                  <Textarea id="bio" placeholder="請簡述您的美容風格、擅長犬種、對待毛孩的理念..." className="h-24" value={formData.bio} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> 證件與作品上傳
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>美容證照 (掃描/拍照)</Label>
                    <Input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'license')} />
                    <p className="text-xs text-muted-foreground">若有 C 級以上證書請務必上傳。</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      良民證 <span className="text-red-500">*</span>
                    </Label>
                    <Input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'police_record')} required />
                    <p className="text-xs text-muted-foreground">為保障到府安全，此為必備文件。</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>作品集 (Before/After 照片)</Label>
                  <Input type="file" accept="image/*" multiple onChange={(e) => handleFileChange(e, 'portfolio')} />
                  <p className="text-xs text-muted-foreground">建議上傳 3-5 組近期作品，這會大幅增加通過率。</p>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 提交審核中...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> 提交申請
                  </>
                )}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
