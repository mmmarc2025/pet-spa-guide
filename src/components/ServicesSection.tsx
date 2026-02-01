import { Scissors, Bath, Heart, Sparkles, Clock, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import catImage from "@/assets/cat-grooming.jpg";
import poodleImage from "@/assets/poodle-styled.jpg";
import toolsImage from "@/assets/grooming-tools.jpg";

const services = [
  {
    icon: Bath,
    title: "洗澡護理",
    description: "使用天然有機洗毛精，溫和不刺激，讓毛髮柔順亮麗",
    price: "NT$ 500起",
    image: catImage,
  },
  {
    icon: Scissors,
    title: "造型修剪",
    description: "專業造型師依據品種特性，打造最適合的可愛造型",
    price: "NT$ 800起",
    image: poodleImage,
  },
  {
    icon: Sparkles,
    title: "SPA護理",
    description: "深層護理毛髮，滋養肌膚，享受頂級SPA體驗",
    price: "NT$ 1200起",
    image: toolsImage,
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
            我們提供全方位的寵物美容服務，從基礎洗澡到高級SPA護理，
            讓您的毛寶貝煥然一新
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-0 shadow-card hover:shadow-warm transition-all duration-300 hover:-translate-y-2 bg-background"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-2xl gradient-warm flex items-center justify-center mb-4 -mt-10 relative z-10 shadow-warm">
                  <service.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <p className="font-display font-bold text-primary text-lg">
                  {service.price}
                </p>
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
