import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Star } from "lucide-react";
import heroImage from "@/assets/hero-dog.jpg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookingForm } from "./BookingForm";

const HeroSection = () => {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-blush/30 to-soft-sage/20" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-soft-sage/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-blush px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-display text-sm font-medium text-warm-brown">
                專業寵物美容服務
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              毛寵管家
              <br />
              <span className="text-primary">你最溫柔的夥伴</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-md font-body">
              我們提供專業、溫柔的寵物美容服務，讓您的毛孩子在舒適的環境中享受最頂級的呵護體驗。
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero" size="lg">
                    預約服務
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>預約寵物美容</DialogTitle>
                    <DialogDescription>
                      請填寫以下資訊，我們將為您安排專屬的美容師到府服務。
                    </DialogDescription>
                  </DialogHeader>
                  <BookingForm onSuccess={() => setOpen(false)} />
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="lg">
                了解更多
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-primary fill-current"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  5星好評推薦
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-foreground">
                  2000+
                </p>
                <p className="text-sm text-muted-foreground">滿意顧客</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-foreground">
                  8年
                </p>
                <p className="text-sm text-muted-foreground">專業經驗</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-scale-in">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="可愛的寵物美容"
                className="w-full h-auto rounded-3xl shadow-warm object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-soft-sage rounded-full animate-float" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full animate-float" style={{ animationDelay: "2s" }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
