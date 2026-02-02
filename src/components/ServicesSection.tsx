
import { Scissors, Bath, Heart, Sparkles, Clock, Award, Palette, Syringe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import catImage from "@/assets/cat-grooming.jpg";
import poodleImage from "@/assets/poodle-styled.jpg";
import toolsImage from "@/assets/grooming-tools.jpg";

// Re-using existing images, distributing them reasonably
const services = [
  {
    icon: Bath,
    title: "基礎洗澡",
    engTitle: "Basic Bath",
    description: "包含：洗澡、潤絲、清耳朵、剪指甲、擠肛門腺、修腳底毛。",
    note: "最安全的清潔服務",
    image: poodleImage, // Using dog image
  },
  {
    icon: Scissors,
    title: "精緻修剪",
    engTitle: "Full Grooming",
    description: "包含：全身剪毛、造型修剪 (泰迪熊、貴賓腳)。",
    note: "專業美容技術",
    image: toolsImage, // Using tools image
  },
  {
    icon: Sparkles,
    title: "局部護理",
    engTitle: "Care Add-on",
    description: "刷牙、梳廢毛、深層護毛 SPA。除蚤藥浴需配合獸醫處方。",
    note: "深層清潔與保養",
    image: poodleImage, // Reuse or find another if possible, for now reuse
  },
  {
    icon: Palette,
    title: "特殊美容",
    engTitle: "Creative Styling",
    description: "創意染色、特殊造型修剪、主題裝扮。使用寵物專用安全染劑。",
    note: "讓毛孩成為全場焦點✨",
    image: catImage, // Using cat image (maybe replace later with colored dog?)
  },
];

const features = [
  {
    icon: Heart,
    title: "溫柔對待",
    description: "專業又有愛心的美容師團隊",
  },
  {
    icon: Clock,
    title: "彈性預約",
    description: "線上預約，時間自由選擇",
  },
  {
    icon: Award,
    title: "品質保證",
    description: "使用頂級天然產品",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-block font-display text-primary font-semibold mb-4">
            我們的服務
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            專業寵物美容服務
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            我們提供最安全、透明的寵物美容體驗。
            <br />
            所有服務皆不含醫療行為，讓您的毛寶貝享受純粹的呵護。
          </p>
        </div>

        {/* Services Grid (Updated to 4 cols) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-0 shadow-card hover:shadow-warm transition-all duration-300 hover:-translate-y-2 bg-background flex flex-col"
            >
              <div className="relative h-48 overflow-hidden shrink-0">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>
              <CardContent className="p-6 flex flex-col flex-grow">
                <div className="w-12 h-12 rounded-2xl gradient-warm flex items-center justify-center mb-4 -mt-10 relative z-10 shadow-warm">
                  <service.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                
                <div className="mb-2">
                    <h3 className="font-display text-xl font-bold text-foreground">
                    {service.title}
                    </h3>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {service.engTitle}
                    </span>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 flex-grow leading-relaxed">
                    {service.description}
                </p>
                
                <div className="pt-4 border-t border-border/50">
                    <p className="font-medium text-primary text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {service.note}
                    </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 rounded-2xl bg-blush/50 hover:bg-blush transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-soft-sage flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-deep-sage" />
              </div>
              <div>
                <h4 className="font-display font-bold text-foreground mb-1">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
