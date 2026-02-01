import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

const contactInfo = [
  {
    icon: MapPin,
    title: "地址",
    content: "台北市大安區忠孝東路四段123號",
  },
  {
    icon: Phone,
    title: "電話",
    content: "(02) 2345-6789",
  },
  {
    icon: Mail,
    title: "電子郵件",
    content: "hello@petgrooming.tw",
  },
  {
    icon: Clock,
    title: "營業時間",
    content: "週一至週日 10:00 - 20:00",
  },
];

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block font-display text-primary font-semibold mb-4">
            聯繫我們
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            預約服務或諮詢
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            歡迎來電或填寫表單預約，我們會盡快與您聯繫
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-background rounded-3xl shadow-card p-8">
            <h3 className="font-display text-xl font-bold text-foreground mb-6">
              預約表單
            </h3>
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    您的姓名
                  </label>
                  <Input
                    placeholder="請輸入姓名"
                    className="rounded-xl border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    聯繫電話
                  </label>
                  <Input
                    placeholder="請輸入電話"
                    className="rounded-xl border-border focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  寵物名稱與品種
                </label>
                <Input
                  placeholder="例如：豆豆，貴賓犬"
                  className="rounded-xl border-border focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  想預約的服務
                </label>
                <Input
                  placeholder="例如：洗澡+造型修剪"
                  className="rounded-xl border-border focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  其他備註
                </label>
                <Textarea
                  placeholder="有任何特殊需求請在此說明"
                  className="rounded-xl border-border focus:border-primary min-h-[120px]"
                />
              </div>
              <Button variant="hero" size="lg" className="w-full">
                送出預約
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-blush/50 hover:bg-blush transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-foreground mb-1">
                      {info.title}
                    </h4>
                    <p className="text-muted-foreground">{info.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="h-64 rounded-3xl bg-muted flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">地圖位置</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
