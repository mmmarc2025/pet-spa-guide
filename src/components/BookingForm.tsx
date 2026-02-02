import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  CalendarIcon, 
  Loader2, 
  Dog, 
  Cat, 
  Bath, 
  Scissors, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  MapPin,
  User,
  Phone,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// 定義表單驗證規則
const formSchema = z.object({
  owner_name: z.string().min(2, "請輸入聯絡人姓名"),
  phone: z.string().min(8, "請輸入有效的電話號碼"),
  pet_type: z.string().min(1, "請選擇寵物類型"),
  service_type: z.string().min(1, "請選擇服務項目"),
  address: z.string().min(5, "請輸入詳細地址"),
  preferred_date: z.date({
    required_error: "請選擇預約日期",
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const STEPS = [
  { id: 1, title: "毛孩資料", fields: ["pet_type"] },
  { id: 2, title: "服務與時間", fields: ["service_type", "preferred_date"] },
  { id: 3, title: "聯絡資訊", fields: ["owner_name", "phone", "address", "notes"] },
  { id: 4, title: "確認預約", fields: [] }
];

export function BookingForm({ onSuccess }: { onSuccess?: () => void }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      owner_name: "",
      phone: "",
      address: "",
      notes: "",
      pet_type: "",     // 預設為空
      service_type: "", // 預設為空
    },
  });

  // 下一步：驗證當前步驟的欄位
  const nextStep = async () => {
    const currentFields = STEPS[step - 1].fields as any[];
    const isValid = await form.trigger(currentFields);

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  // 上一步
  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // 最終送出
  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .insert([
          {
            owner_name: values.owner_name,
            phone: values.phone,
            pet_type: values.pet_type,
            service_type: values.service_type,
            address: values.address,
            preferred_date: values.preferred_date.toISOString(),
            notes: values.notes,
            status: "pending",
          },
        ]);

      if (error) throw error;

      toast({
        title: "預約成功！🎉",
        description: "我們已收到您的預約，美容師將盡快與您聯繫。",
      });
      
      form.reset();
      setStep(1);
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        variant: "destructive",
        title: "預約失敗",
        description: "系統發生錯誤，請稍後再試。",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // 選項卡片元件 (用於選擇寵物和服務)
  const SelectionCard = ({ 
    value, 
    selectedValue, 
    onChange, 
    icon: Icon, 
    title, 
    desc 
  }: { 
    value: string; 
    selectedValue: string; 
    onChange: (val: string) => void; 
    icon: any; 
    title: string; 
    desc?: string;
  }) => (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:border-primary", 
        selectedValue === value ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-muted"
      )}
      onClick={() => onChange(value)}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2">
        <Icon className={cn("w-8 h-8", selectedValue === value ? "text-primary" : "text-muted-foreground")} />
        <div className="font-semibold">{title}</div>
        {desc && <div className="text-xs text-muted-foreground">{desc}</div>}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-xl mx-auto">
      {/* 進度條 */}
      <div className="mb-8 space-y-2">
        <div className="flex justify-between text-sm font-medium text-muted-foreground">
          <span>步驟 {step} / {STEPS.length}</span>
          <span>{STEPS[step-1].title}</span>
        </div>
        <Progress value={(step / STEPS.length) * 100} className="h-2" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* STEP 1: 選擇寵物 */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <FormField
                control={form.control}
                name="pet_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">請問您的毛孩是？</FormLabel>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <SelectionCard 
                        value="dog_small" 
                        selectedValue={field.value} 
                        onChange={field.onChange} 
                        icon={Dog} 
                        title="小型犬" 
                        desc="5kg 以下" 
                      />
                      <SelectionCard 
                        value="dog_medium" 
                        selectedValue={field.value} 
                        onChange={field.onChange} 
                        icon={Dog} 
                        title="中型犬" 
                        desc="5-15kg" 
                      />
                      <SelectionCard 
                        value="dog_large" 
                        selectedValue={field.value} 
                        onChange={field.onChange} 
                        icon={Dog} 
                        title="大型犬" 
                        desc="15kg 以上" 
                      />
                      <SelectionCard 
                        value="cat" 
                        selectedValue={field.value} 
                        onChange={field.onChange} 
                        icon={Cat} 
                        title="貓咪" 
                        desc="各品種貓" 
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* STEP 2: 服務與時間 */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <FormField
                control={form.control}
                name="service_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">需要什麼服務？</FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                      <SelectionCard 
                        value="basic_bath" 
                        selectedValue={field.value} 
                        onChange={field.onChange} 
                        icon={Bath} 
                        title="基礎洗澡" 
                        desc="洗+吹+清耳" 
                      />
                      <SelectionCard 
                        value="full_grooming" 
                        selectedValue={field.value} 
                        onChange={field.onChange} 
                        icon={Scissors} 
                        title="大美容" 
                        desc="含造型修剪" 
                      />
                      <SelectionCard 
                        value="spa" 
                        selectedValue={field.value} 
                        onChange={field.onChange} 
                        icon={Sparkles} 
                        title="SPA 護理" 
                        desc="深層皮毛保養" 
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferred_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-lg font-semibold">希望預約日期</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal h-12 text-base",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "yyyy 年 MM 月 dd 日")
                            ) : (
                              <span>請選擇日期...</span>
                            )}
                            <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* STEP 3: 聯絡資訊 */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="owner_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>聯絡人姓名</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" placeholder="王小明" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>手機號碼</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" placeholder="0912-345-678" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>服務地址 (到府美容)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="台北市信義區..." {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>備註事項 (選填)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="例如：狗狗比較怕生、有皮膚過敏、大樓有電梯..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* STEP 4: 確認頁面 */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-muted/30 p-6 rounded-lg border space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  確認預約資訊
                </h3>
                
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="text-muted-foreground">寵物類型</div>
                  <div className="font-medium">
                    {(() => {
                      const map: Record<string, string> = {
                        dog_small: "小型犬 (5kg以下)",
                        dog_medium: "中型犬 (5-15kg)",
                        dog_large: "大型犬 (15kg以上)",
                        cat: "貓咪"
                      };
                      return map[form.getValues("pet_type")] || form.getValues("pet_type");
                    })()}
                  </div>

                  <div className="text-muted-foreground">服務項目</div>
                  <div className="font-medium">
                     {(() => {
                      const map: Record<string, string> = {
                        basic_bath: "基礎洗澡",
                        full_grooming: "大美容",
                        spa: "SPA 護理"
                      };
                      return map[form.getValues("service_type")] || form.getValues("service_type");
                    })()}
                  </div>

                  <div className="text-muted-foreground">預約日期</div>
                  <div className="font-medium text-primary">
                    {form.getValues("preferred_date") && format(form.getValues("preferred_date"), "yyyy/MM/dd")}
                  </div>

                  <div className="text-muted-foreground">聯絡人</div>
                  <div className="font-medium">{form.getValues("owner_name")} ({form.getValues("phone")})</div>

                  <div className="text-muted-foreground">地址</div>
                  <div className="font-medium col-span-2">{form.getValues("address")}</div>
                  
                  {form.getValues("notes") && (
                    <>
                      <div className="text-muted-foreground">備註</div>
                      <div className="font-medium col-span-2 text-muted-foreground/80 italic">
                        "{form.getValues("notes")}"
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 按鈕區 */}
          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} disabled={isLoading}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                上一步
              </Button>
            ) : (
              <div></div> // 佔位用
            )}

            {step < STEPS.length ? (
              <Button type="button" onClick={nextStep}>
                下一步
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" className="w-32" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    送出
                  </>
                ) : (
                  "確認預約"
                )}
              </Button>
            )}
          </div>

        </form>
      </Form>
    </div>
  );
}
