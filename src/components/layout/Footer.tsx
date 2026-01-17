import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logoImage from '@/assets/jade.png';

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="relative bg-gradient-to-br from-white via-gray-50 to-white border-t border-border/50 mt-auto overflow-hidden">
      {/* Modern decorative elements */}
      <div className="absolute inset-0 bg-grid-slate-200/[0.03] bg-[size:60px_60px]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-teal-500/10 via-primary/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/3 to-transparent rounded-full blur-3xl" />
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-8">
            {/* Brand */}
            <div className="lg:col-span-4">
              <Link to="/" className="flex items-center gap-3 mb-4 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                  <img 
                    src={logoImage} 
                    alt="Jade Property Logo" 
                    className="relative w-10 h-10 rounded-xl shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all group-hover:scale-105"
                  />
                </div>
                <div>
                  <div className="text-lg bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                    Jade Property
                  </div>
                  <div className="text-[10px] text-muted-foreground">Find Your Dream Space</div>
                </div>
              </Link>
              <p className="text-muted-foreground mb-5 leading-relaxed text-sm">
                {t('footer.description')}
              </p>
              
              {/* App Store Downloads - 2 Column Grid */}
              <div className="grid grid-cols-2 gap-2">
                <a 
                  href="#" 
                  className="group relative flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm border border-primary/20 hover:border-primary hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/20 hover:shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5"
                >
                  <svg className="h-7 w-7 text-primary group-hover:scale-110 transition-all" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-center">
                    <div className="text-[9px] text-muted-foreground uppercase tracking-wide">Get it on</div>
                    <div className="text-xs text-foreground group-hover:text-primary transition-colors -mt-0.5">Google Play</div>
                  </div>
                </a>
                <a 
                  href="#" 
                  className="group relative flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm border border-primary/20 hover:border-primary hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/20 hover:shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5"
                >
                  <svg className="h-7 w-7 text-primary group-hover:scale-110 transition-all" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                  </svg>
                  <div className="text-center">
                    <div className="text-[9px] text-muted-foreground uppercase tracking-wide">Download on</div>
                    <div className="text-xs text-foreground group-hover:text-primary transition-colors -mt-0.5">App Store</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="mb-4 text-foreground text-sm">
                {t('footer.quickLinks')}
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link 
                    to="/" 
                    className="text-muted-foreground hover:text-primary transition-all inline-flex items-center gap-2 group text-sm"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:scale-150 transition-all"></span>
                    {t('nav.home')}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className="text-muted-foreground hover:text-primary transition-all inline-flex items-center gap-2 group text-sm"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:scale-150 transition-all"></span>
                    {t('nav.about')}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/search" 
                    className="text-muted-foreground hover:text-primary transition-all inline-flex items-center gap-2 group text-sm"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:scale-150 transition-all"></span>
                    {t('nav.properties')}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/my-properties" 
                    className="text-muted-foreground hover:text-primary transition-all inline-flex items-center gap-2 group text-sm"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:scale-150 transition-all"></span>
                    {t('nav.postProperty')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="lg:col-span-2">
              <h4 className="mb-4 text-foreground text-sm">
                {t('footer.legal')}
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link 
                    to="/privacy-policy" 
                    className="text-muted-foreground hover:text-primary transition-all inline-flex items-center gap-2 group text-sm"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:scale-150 transition-all"></span>
                    {t('footer.privacy')}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms-of-service" 
                    className="text-muted-foreground hover:text-primary transition-all inline-flex items-center gap-2 group text-sm"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary group-hover:scale-150 transition-all"></span>
                    {t('footer.terms')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-4">
              <h4 className="mb-4 text-foreground text-sm">
                {t('footer.contact')}
              </h4>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-3 text-muted-foreground hover:text-primary group transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-all">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <a 
                    href="mailto:info@jadeproperty.com" 
                    className="text-sm"
                  >
                    jade.cusservice@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground hover:text-primary group transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-all">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <a 
                    href="tel:+95123456789" 
                    className="text-sm"
                  >
                    +959 750009119, +959 750009229
                  </a>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground group">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">
                  Address- PSH-78, Padauk Loop 2, Padauk Garden Housing, Hlaing Tharyar Township, Yangon
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border/50 pt-5 mt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs text-center md:text-left">
              &copy; 2025 Jade Property. {t('footer.rights')}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/30" />
              <span className="text-muted-foreground text-xs">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
