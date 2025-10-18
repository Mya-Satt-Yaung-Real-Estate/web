import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, Globe, X, Grid3x3, Award, FileText, History as HistoryIcon, Calendar, Megaphone, Building2, BookOpen, Scale, Home as HomeIcon, HelpCircle, Mail, Newspaper, MessageSquare, Heart, Eye, Settings, Info, Coins, Banknote, Calculator, Briefcase, Star, Search } from 'lucide-react';
import logoImage from '@/assets/jade.png';
import { navigationStyles, getNavigationLinkClasses } from '@/lib/component-styles';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NotificationDropdown } from '@/components/common/NotificationDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesSheetOpen, setServicesSheetOpen] = useState(false);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.companies'), path: '/companies' },
    { name: t('nav.appointments'), path: '/appointments' },
    { name: t('nav.createListing'), path: '/post-property' },
  ];

  const serviceFeatures = {
    propertyManagement: [
      { icon: Award, name: t('services.pointManagement'), path: '/point-management', desc: t('services.pointManagementDesc') },
      { icon: FileText, name: t('services.createListing'), path: '/post-property', desc: t('services.createListingDesc') },
      { icon: FileText, name: t('services.wantedListing'), path: '/wanted-listing', desc: t('services.wantedListingDesc') },
      { icon: HistoryIcon, name: t('services.history'), path: '/history', desc: t('services.historyDesc') },
      { icon: Calendar, name: t('services.appointmentRequest'), path: '/appointments', desc: t('services.appointmentRequestDesc') },
      { icon: Megaphone, name: t('services.advertisement'), path: '/advertisement-management', desc: t('services.advertisementDesc') },
      { icon: Banknote, name: t('services.loanRequest'), path: '/loan-request', desc: t('services.loanRequestDesc') },
      { icon: Calculator, name: t('services.loanCalculator'), path: '/loan-calculator', desc: t('services.loanCalculatorDesc') },
      { icon: Calculator, name: 'Yar Pyat Tax Calculator', path: '/yar-pyat-tax-calculator', desc: 'Calculate property taxes (ရာပြတ်ခွန်) for land transactions' },
      { icon: Briefcase, name: t('services.jobPostListing'), path: '/jobs', desc: t('services.jobPostListingDesc') },
      { icon: Star, name: t('services.reviewPost'), path: '/reviews', desc: t('services.reviewPostDesc') },
      { icon: Search, name: t('services.searchAll'), path: '/search-all', desc: t('services.searchAllDesc') },
    ],
    information: [
      { icon: Building2, name: t('services.companies'), path: '/companies', desc: t('services.companiesDesc') },
      { icon: BookOpen, name: t('services.knowledgeHub'), path: '/knowledge-hub', desc: t('services.knowledgeHubDesc') },
      { icon: Scale, name: t('services.legalTeam'), path: '/legal-team', desc: t('services.legalTeamDesc') },
      { icon: HomeIcon, name: t('services.housingEvent'), path: '/events', desc: t('services.housingEventDesc') },
      { icon: HelpCircle, name: t('services.faq'), path: '/faq', desc: t('services.faqDesc') },
      { icon: Mail, name: t('services.contactUs'), path: '/contact', desc: t('services.contactUsDesc') },
      { icon: Newspaper, name: t('services.newsUpdates'), path: '/news-updates', desc: t('services.newsUpdatesDesc') },
      { icon: MessageSquare, name: t('services.applyFeedback'), path: '/feedback', desc: t('services.applyFeedbackDesc') },
    ],
    userFeatures: [
      { icon: Heart, name: t('services.favorite'), path: '/favorites', desc: t('services.favoriteDesc') },
      { icon: Eye, name: t('services.recentViews'), path: '/recent-views', desc: t('services.recentViewsDesc') },
      { icon: User, name: t('services.profile'), path: '/profile', desc: t('services.profileDesc') },
      { icon: Settings, name: t('services.setting'), path: '/settings', desc: t('services.settingDesc') },
      { icon: Info, name: t('services.aboutApp'), path: '/about-app', desc: t('services.aboutAppDesc') },
    ],
  };

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const handleServiceClick = (path: string) => {
    navigate(path);
    setServicesSheetOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className={navigationStyles.container}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className={navigationStyles.logo.container}>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <img 
                src={logoImage} 
                alt="Jade Property Logo" 
                className={navigationStyles.logo.image}
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className={navigationStyles.logo.text}>
                Jade Property
              </span>
              <span className={navigationStyles.logo.subtitle}>
                {t('home.newProperties')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={getNavigationLinkClasses(isActive(link.path))}
              >
                {isActive(link.path) && (
                  <div className={navigationStyles.link.background} />
                )}
                <span className={navigationStyles.link.hover}>
                  {link.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Our Service Features - Desktop */}
            <Sheet open={servicesSheetOpen} onOpenChange={setServicesSheetOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hidden md:flex items-center gap-2 rounded-xl hover:bg-primary/10 transition-all"
                >
                  <Grid3x3 className="h-4 w-4" />
                  {t('services.ourServices')}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-2xl glass backdrop-blur-xl bg-background/95 border-border/50">
                <SheetHeader>
                  <SheetTitle className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                    {t('services.ourServices')}
                  </SheetTitle>
                  <SheetDescription>
                    Access all features and services in one place
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
                  <div className="space-y-8">
                    {/* Property Management Section */}
                    <div>
                      <h3 className="mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        {t('services.propertyManagement')}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {serviceFeatures.propertyManagement.map((service) => (
                          <button
                            key={service.path}
                            onClick={() => handleServiceClick(service.path)}
                            className="flex items-start gap-3 p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 text-left group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary group-hover:to-[#4a9b82] transition-all">
                              <service.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="mb-1 group-hover:text-primary transition-colors truncate">
                                {service.name}
                              </p>
                              <p className="text-muted-foreground line-clamp-2">
                                {service.desc}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Information Center Section */}
                    <div>
                      <h3 className="mb-4 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        {t('services.informationCenter')}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {serviceFeatures.information.map((service) => (
                          <button
                            key={service.path}
                            onClick={() => handleServiceClick(service.path)}
                            className="flex items-start gap-3 p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 text-left group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary group-hover:to-[#4a9b82] transition-all">
                              <service.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="mb-1 group-hover:text-primary transition-colors truncate">
                                {service.name}
                              </p>
                              <p className="text-muted-foreground line-clamp-2">
                                {service.desc}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* User Features Section */}
                    <div>
                      <h3 className="mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        {t('services.userFeatures')}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {serviceFeatures.userFeatures.map((service) => (
                          <button
                            key={service.path}
                            onClick={() => handleServiceClick(service.path)}
                            className="flex items-start gap-3 p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 text-left group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary group-hover:to-[#4a9b82] transition-all">
                              <service.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="mb-1 group-hover:text-primary transition-colors truncate">
                                {service.name}
                              </p>
                              <p className="text-muted-foreground line-clamp-2">
                                {service.desc}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative rounded-xl hover:bg-primary/10 transition-all group"
                >
                  <Globe className="h-5 w-5 group-hover:text-primary transition-colors" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 backdrop-blur-xl bg-background/95 border-border/50">
                <DropdownMenuItem 
                  onClick={() => setLanguage('en')}
                  className={language === 'en' ? 'bg-primary/10' : ''}
                >
                  <span className={language === 'en' ? 'text-primary' : ''}>🇬🇧 {t('language.english')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage('mm')}
                  className={language === 'mm' ? 'bg-primary/10' : ''}
                >
                  <span className={language === 'mm' ? 'text-primary' : ''}>🇲🇲 {t('language.myanmar')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated && <NotificationDropdown />}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-primary/10 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-[#4a9b82] flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all">
                      <User className="h-5 w-5" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 backdrop-blur-xl bg-background/95 border-border/50">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="truncate">{user?.name}</p>
                      {user?.email && (
                        <p className="text-muted-foreground truncate">{user.email}</p>
                      )}
                      {user?.phone && (
                        <p className="text-muted-foreground truncate">{user.phone}</p>
                      )}
                      {user?.isGuest && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          Guest
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* Points Display */}
                  <div 
                    className="px-2 py-3 mx-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 cursor-pointer hover:border-primary/40 transition-all hover:shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/point-management');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-[#4a9b82] flex items-center justify-center">
                          <Coins className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-muted-foreground">Your Points</p>
                          <p className="text-primary">{user?.points?.toLocaleString() || 0}</p>
                        </div>
                      </div>
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      {t('services.profile')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/history')}>
                      <HistoryIcon className="mr-2 h-4 w-4" />
                      {t('services.history')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      {t('services.setting')}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('nav.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                className="gradient-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105"
                onClick={() => navigate('/signin')}
              >
                {t('nav.signIn')}
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 backdrop-blur-xl">
            <div className="space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl transition-all ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Sheet open={servicesSheetOpen} onOpenChange={setServicesSheetOpen}>
                <SheetTrigger asChild>
                  <button className="w-full text-left px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all flex items-center gap-2">
                    <Grid3x3 className="h-4 w-4" />
                    {t('services.ourServices')}
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-2xl glass backdrop-blur-xl bg-background/95 border-border/50">
                  <SheetHeader>
                    <SheetTitle className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                      {t('services.ourServices')}
                    </SheetTitle>
                    <SheetDescription>
                      Access all features and services in one place
                    </SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
                    <div className="space-y-8">
                      {/* Property Management Section */}
                      <div>
                        <h3 className="mb-4 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          {t('services.propertyManagement')}
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {serviceFeatures.propertyManagement.map((service) => (
                            <button
                              key={service.path}
                              onClick={() => handleServiceClick(service.path)}
                              className="flex items-start gap-3 p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 text-left group"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary group-hover:to-[#4a9b82] transition-all">
                                <service.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="mb-1 group-hover:text-primary transition-colors">
                                  {service.name}
                                </p>
                                <p className="text-muted-foreground line-clamp-2">
                                  {service.desc}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Information Center Section */}
                      <div>
                        <h3 className="mb-4 flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          {t('services.informationCenter')}
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {serviceFeatures.information.map((service) => (
                            <button
                              key={service.path}
                              onClick={() => handleServiceClick(service.path)}
                              className="flex items-start gap-3 p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 text-left group"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary group-hover:to-[#4a9b82] transition-all">
                                <service.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="mb-1 group-hover:text-primary transition-colors">
                                  {service.name}
                                </p>
                                <p className="text-muted-foreground line-clamp-2">
                                  {service.desc}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* User Features Section */}
                      <div>
                        <h3 className="mb-4 flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          {t('services.userFeatures')}
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {serviceFeatures.userFeatures.map((service) => (
                            <button
                              key={service.path}
                              onClick={() => handleServiceClick(service.path)}
                              className="flex items-start gap-3 p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 text-left group"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary group-hover:to-[#4a9b82] transition-all">
                                <service.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="mb-1 group-hover:text-primary transition-colors">
                                  {service.name}
                                </p>
                                <p className="text-muted-foreground line-clamp-2">
                                  {service.desc}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}