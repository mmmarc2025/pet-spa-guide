import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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

export function BookingForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      owner_name: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
        description: "我們已收到您的預約，將儘快與您聯繫確認。",
      });
      
      form.reset();
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        variant: "destructive",
        title: "預約失敗",
        description: "系統發生錯誤，請稍後再試或直接聯繫客服。",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="owner_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>聯絡人姓名</FormLabel>
              <FormControl>
                <Input placeholder="王小明" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>聯絡電話</FormLabel>
                <FormControl>
                  <Input placeholder="0912-345-678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pet_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>寵物類型</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇類型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dog_small">小型犬 (5kg以下)</SelectItem>
                    <SelectItem value="dog_medium">中型犬 (5-15kg)</SelectItem>
                    <SelectItem value="dog_large">大型犬 (15kg以上)</SelectItem>
                    <SelectItem value="cat">貓咪</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="service_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>服務項目</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇服務" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="basic_bath">基礎洗澡 (洗+吹+清耳朵)</SelectItem>
                  <SelectItem value="full_grooming">大美容 (洗+剪+造型)</SelectItem>
                  <SelectItem value="spa">深層皮毛護理 SPA</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferred_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>預約日期</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "yyyy/MM/dd")
                      ) : (
                        <span>選擇日期</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>服務地址 (到府美容)</FormLabel>
              <FormControl>
                <Input placeholder="台北市信義區..." {...field} />
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
              <FormLabel>備註 (選填)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="例如：狗狗比較怕生、有皮膚過敏..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              處理中...
            </>
          ) : (
            "確認預約"
          )}
        </Button>
      </form>
    </Form>
  );
}
