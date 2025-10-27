import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logoImage from '@/assets/jade.png';

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="relative bg-gradient-to-b from-background via-muted/20 to-muted/40 border-t border-border/50 mt-auto overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDEyYzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgZmlsbD0iIzYzNjZmMSIgZmlsbC1vcGFjaXR5PSIuMDIiLz48L2c+PC9zdmc+')] opacity-50" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/5 to-primary/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <img 
                  src={logoImage} 
                  alt="Jade Property Logo" 
                  className="relative w-10 h-10 rounded-xl shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all"
                />
              </div>
              <span className="text-primary font-semibold">
                Jade Property
              </span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            
            {/* App Store Downloads */}
            <div className="mt-6 space-y-2">
              <a 
                href="#" 
                className="flex items-center gap-2 p-2 rounded-lg bg-black hover:bg-black/80 text-white transition-all group"
              >
                <Smartphone className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="text-xs opacity-80">Download on the</span>
                  <span className="-mt-1">Google Play</span>
                </div>
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 p-2 rounded-lg bg-black hover:bg-black/80 text-white transition-all group"
              >
                <Smartphone className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="text-xs opacity-80">Download on the</span>
                  <span className="-mt-1">App Store</span>
                </div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-muted-foreground hover:text-primary transition-all inline-flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span> 
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-muted-foreground hover:text-primary transition-all inline-flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span> 
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/modules" 
                  className="text-muted-foreground hover:text-primary transition-all inline-flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span> 
                  {t('nav.properties')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/post-property" 
                  className="text-muted-foreground hover:text-primary transition-all inline-flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span> 
                  {t('nav.postProperty')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h4 className="mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="text-muted-foreground hover:text-primary transition-all inline-flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span> 
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-muted-foreground hover:text-primary transition-all inline-flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span> 
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h4 className="mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-purple-500/20 transition-all flex-shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <a 
                  href="mailto:info@jadeproperty.com" 
                  className="hover:text-primary transition-colors pt-2"
                >
                  info@jadeproperty.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-purple-500/20 transition-all flex-shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <a 
                  href="tel:+95123456789" 
                  className="hover:text-primary transition-colors pt-2"
                >
                  +95 (1) 234-5678
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-purple-500/20 transition-all flex-shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="pt-2 leading-relaxed">
                  Downtown Yangon, Myanmar
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-center md:text-left">
            &copy; 2025 Jade Property. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-muted-foreground">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}