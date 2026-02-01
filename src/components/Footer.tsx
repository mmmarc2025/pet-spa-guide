import { Heart, Instagram, Facebook, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground fill-current" />
            </div>
            <span className="font-display font-bold text-xl text-background">
              毛寶貝沙龍
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
            >
              <Instagram className="w-5 h-5 text-background" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
            >
              <Facebook className="w-5 h-5 text-background" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-background" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-background/60 text-sm">
            © 2024 毛寶貝沙龍. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
