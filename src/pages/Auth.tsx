
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // 1. Check for LINE Login Token in URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (error) {
      toast({ title: "登入失敗", description: `LINE 登入錯誤: ${error}`, variant: "destructive" });
      // Clear URL param
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (token) {
      setLoading(true);
      // Verify token with backend
      fetch("https://yzkjyiugkkuqycxitfst.supabase.co/functions/v1/line-auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        
        // Save custom session
        localStorage.setItem("custom_auth_token", token);
        localStorage.setItem("custom_user", JSON.stringify(data.user));
        
        toast({ title: "登入成功", description: `歡迎回來，${data.user.display_name}！` });
        navigate("/dashboard");
      })
      .catch(err => {
        console.error(err);
        toast({ title: "驗證失敗", description: "登入憑證無效或已過期", variant: "destructive" });
      })
      .finally(() => setLoading(false));
      return; // Skip Supabase check if processing token
    }

    // 2. Check Supabase Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });
    
    // 3. Check Custom Session (already logged in)
    if (localStorage.getItem("custom_auth_token")) {
      navigate("/dashboard");
    }

  }, [navigate, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "登入失敗", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { role: 'owner' } // 預設註冊為飼主
        }
      });
      if (error) throw error;
      toast({ title: "註冊成功！", description: "請檢查信箱並驗證您的帳號。" });
    } catch (error: any) {
      toast({ title: "註冊失敗", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-display">歡迎回到 Groom.now</CardTitle>
          <CardDescription>登入以管理您的預約或查看訂單</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">登入</TabsTrigger>
              <TabsTrigger value="register">註冊</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">密碼</Label>
                  <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "登入中..." : "登入"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">密碼</Label>
                  <Input id="reg-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "註冊中..." : "註冊帳號"}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  目前僅開放飼主註冊，美容師請聯繫客服開通。
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
            <Button 
              variant="outline" 
              className="bg-[#00C300] text-white hover:bg-[#00B300] hover:text-white border-none" 
              onClick={() => {
                // Use Edge Function for LINE Login (Bot Channel)
                window.location.href = "https://yzkjyiugkkuqycxitfst.supabase.co/functions/v1/line-auth/login";
              }}
            >
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.2 6.5c-1.3-1.6-3.5-2.6-6-2.6s-4.7 1-6 2.6C6.4 8.2 5.5 10.8 5.5 13.5c0 .7.1 1.4.3 2 .2.7.5 1.4.8 2 .1.2.2.4.2.6 0 .4-.1.8-.3 1.2-.2.4-.5 1-.6 1.3-.1.2-.1.4-.1.5 0 .2.1.3.2.4.1.1.2.1.4.1.2 0 .4-.1.6-.2 1.3-.6 2.3-1.3 2.9-1.9.3-.3.6-.5.9-.6.7.2 1.5.3 2.3.3 2.5 0 4.7-1 6-2.6 1.8-2.3 1.8-6.1-.1-8.6zm-12 7.1c-.2 0-.4-.2-.4-.4V9.6c0-.2.2-.4.4-.4s.4.2.4.4v3.6c0 .2-.2.4-.4.4zm2.1 0c-.2 0-.4-.2-.4-.4V9.6c0-.2.2-.4.4-.4s.4.2.4.4v3.6c0 .2-.2.4-.4.4zm2.8-1.5h-1.6v-1.9h1.6c.2 0 .4-.2.4-.4s-.2-.4-.4-.4h-2c-.2 0-.4.2-.4.4v3.6c0 .2.2.4.4.4h2c.2 0 .4-.2.4-.4s-.2-.4-.4-.4zm2.8 1.5c-.2 0-.4-.2-.4-.4V9.6c0-.2.2-.4.4-.4h2c.2 0 .4.2.4.4s-.2.4-.4.4h-1.6v1h1.6c.2 0 .4.2.4.4s-.2.4-.4.4h-2v.8c0 .3.2.5.4.5h.1z"/>
              </svg>
              LINE
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
