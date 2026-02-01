import { CheckCircle } from "lucide-react";
import poodleImage from "@/assets/poodle-styled.jpg";

const aboutPoints = [
  "8年以上專業寵物美容經驗",
  "使用天然有機無毒產品",
  "溫馨舒適的美容環境",
  "一對一專屬服務",
  "專業寵物健康諮詢",
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={poodleImage}
                alt="關於我們"
                className="w-full h-auto rounded-3xl shadow-warm"
              />
            </div>
            {/* Stats card */}
            <div className="absolute -bottom-8 -right-8 bg-background rounded-2xl shadow-warm p-6 z-20">
              <p className="font-display text-4xl font-bold text-primary mb-1">
                98%
              </p>
              <p className="text-muted-foreground text-sm">顧客滿意度</p>
            </div>
            {/* Decorative */}
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-soft-sage rounded-3xl" />
          </div>

          {/* Content */}
          <div>
            <span className="inline-block font-display text-primary font-semibold mb-4">
              關於我們
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              用愛與專業
              <br />
              呵護每一位毛寶貝
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              「毛寶貝沙龍」由一群熱愛動物的專業美容師創立。我們深信每一隻毛孩子都值得被溫柔對待，
              因此我們堅持使用最天然的產品，提供最舒適的環境，讓您的寵物在輕鬆愉快的氛圍中享受美容服務。
            </p>

            <ul className="space-y-4 mb-8">
              {aboutPoints.map((point, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
