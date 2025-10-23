import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Menu, User, LogOut, Globe, X, Grid3x3, Award, History as HistoryIcon,
  Calendar, Megaphone, Building2, BookOpen, Scale, Home as HomeIcon,
  HelpCircle, Mail, Newspaper, MessageSquare, Heart, Eye, Settings, Info,
  Coins, Banknote, Calculator, Briefcase, Star, Search, ChevronDown,
  Building, TrendingUp, Users
} from 'lucide-react';

import logoImage from '@/assets/jade.png';
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
import { NotificationDropdown } from '@/components/common/NotificationDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Navigation data structure
const createNavigationData = (t: (key: string) => string) => ({
  navLinks: [
    { name: t('nav.home'), path: '/' },
  ],
  
  propertyCategories: [
    { name: t('categories.searchAllProperty'), path: '/search-all', icon: Search },
    { name: t('categories.tantantan'), path: '/search-all?filter=tantantan', icon: Grid3x3 },
    { name: t('categories.premiumProperties'), path: '/search-all?type=premium', icon: Star },
    { name: t('listings.forSale'), path: '/search-all?filter=sale', icon: HomeIcon },
    { name: t('listings.forRent'), path: '/search-all?filter=rent', icon: Building },
    { name: t('categories.preSale'), path: '/search-all?filter=presale', icon: TrendingUp },
    { name: t('categories.installment'), path: '/search-all?filter=installment', icon: Calculator },
    { name: t('categories.buyerPosts'), path: '/search-all?type=wanted&listingType=buyer', icon: Search },
    { name: t('categories.renterPosts'), path: '/search-all?type=wanted&listingType=renter', icon: Users },
    { name: t('categories.vacanciesJobs'), path: '/search-all?type=job', icon: Briefcase },
    { name: t('services.housingEvent'), path: '/search-all?type=event', icon: Calendar },
  ],
  
  createListingOptions: [
    { name: t('createListing.propertyPost'), path: '/post-property?tab=property', icon: HomeIcon },
    { name: t('createListing.wantedPost'), path: '/post-property?tab=wanted', icon: Search },
    { name: t('createListing.advertisementPost'), path: '/post-property?tab=advertisement', icon: Megaphone },
    { name: t('createListing.appointmentRequest'), path: '/appointments', icon: Calendar },
    { name: t('createListing.giveYourReview'), path: '/review-post', icon: Star },
    { name: t('createListing.jobPostCreate'), path: '/jobs', icon: Briefcase },
    { name: t('services.homeLoanRequest'), path: '/loan-request', icon: Banknote },
  ],
  
  calculatorOptions: [
    { name: t('calculators.loanCalculator'), path: '/loan-calculator', icon: Banknote },
    { name: t('calculators.yarPyatTaxCalculator'), path: '/yar-pyat-tax-calculator', icon: Calculator },
  ],
  
  knowledgeCategories: [
    { name: t('services.knowledgeHub'), path: '/knowledge-hub', icon: BookOpen },
    { name: t('services.faq'), path: '/faq', icon: HelpCircle },
    { name: t('services.newsUpdates'), path: '/news-updates', icon: Newspaper },
    { name: t('services.aboutUs'), path: '/about', icon: Info },
    { name: t('services.contactUs'), path: '/contact', icon: Mail },
    { name: t('services.legalTeam'), path: '/legal-team', icon: Scale },
  ],
  
  companyCategories: [
    { name: t('categories.realEstateAgency'), path: '/companies?category=agency', icon: HomeIcon },
    { name: t('categories.constructionCompany'), path: '/companies?category=construction', icon: Building },
    { name: t('categories.propertyManagement'), path: '/companies?category=management', icon: Briefcase },
    { name: t('categories.propertyDeveloper'), path: '/companies?category=developer', icon: TrendingUp },
    { name: t('categories.realEstateConsultant'), path: '/companies?category=consultant', icon: Users },
  ],
});

// Reusable dropdown component
const NavigationDropdown = ({ 
  trigger, 
  label, 
  items, 
  onItemClick 
}: {
  trigger: React.ReactNode;
  label: string;
  items: Array<{ name: string; path: string; icon: any }>;
  onItemClick: (path: string) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      {trigger}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="w-64 backdrop-blur-xl bg-background/95 border-border/50">
      <DropdownMenuLabel className="text-primary">{label}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {items.map((item) => (
        <DropdownMenuItem 
          key={item.path} 
          onClick={() => onItemClick(item.path)}
          className="cursor-pointer whitespace-nowrap"
        >
          <item.icon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">{item.name}</span>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);


export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationData = createNavigationData(t);
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <img 
                src={logoImage} 
                alt="Jade Property Logo" 
                className="relative w-10 h-10 rounded-xl shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all group-hover:scale-105"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent background-animate">
                Jade Property
              </span>
              <span className="text-muted-foreground -mt-1">
                {t('home.newProperties')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 flex-wrap">
            {navigationData.navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-xl transition-all group ${
                  isActive(link.path) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive(link.path) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl" />
                )}
                <span className="relative z-10 group-hover:translate-y-[-2px] inline-block transition-transform">
                  {link.name}
                </span>
              </Link>
            ))}
            
            {/* Properties Dropdown */}
            <NavigationDropdown
              trigger={
                <button
                  className={`relative px-4 py-2 rounded-xl transition-all group flex items-center gap-1 whitespace-nowrap ${
                    isActive('/modules') || isActive('/wanted-listing')
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {(isActive('/modules') || isActive('/wanted-listing')) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl" />
                  )}
                  <span className="relative z-10 group-hover:translate-y-[-2px] inline-block transition-transform text-sm lg:text-base">
                    {t('nav.properties')}
                  </span>
                  <ChevronDown className="relative z-10 h-4 w-4 transition-transform group-hover:translate-y-0.5 flex-shrink-0" />
                </button>
              }
              label={t('nav.properties')}
              items={navigationData.propertyCategories}
              onItemClick={handleNavigation}
            />
            
            {/* Companies Dropdown */}
            <NavigationDropdown
              trigger={
                <button
                  className={`relative px-4 py-2 rounded-xl transition-all group flex items-center gap-1 whitespace-nowrap ${
                    isActive('/companies')
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isActive('/companies') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl" />
                  )}
                  <span className="relative z-10 group-hover:translate-y-[-2px] inline-block transition-transform text-sm lg:text-base">
                    {t('nav.companies')}
                  </span>
                  <ChevronDown className="relative z-10 h-4 w-4 transition-transform group-hover:translate-y-0.5 flex-shrink-0" />
                </button>
              }
              label={t('categories.companies')}
              items={[
                { name: 'All Companies', path: '/companies', icon: Building2 },
                ...navigationData.companyCategories
              ]}
              onItemClick={handleNavigation}
            />

            {/* Create Listing Dropdown */}
            <NavigationDropdown
              trigger={
                <button
                  className={`relative px-4 py-2 rounded-xl transition-all group flex items-center gap-1 whitespace-nowrap ${
                    isActive('/post-property')
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isActive('/post-property') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl" />
                  )}
                  <span className="relative z-10 group-hover:translate-y-[-2px] inline-block transition-transform text-sm lg:text-base">
                    {t('nav.createListing')}
                  </span>
                  <ChevronDown className="relative z-10 h-4 w-4 transition-transform group-hover:translate-y-0.5 flex-shrink-0" />
                </button>
              }
              label={t('createListing.title')}
              items={navigationData.createListingOptions}
              onItemClick={handleNavigation}
            />

            {/* Calculator Dropdown */}
            <NavigationDropdown
              trigger={
                <button
                  className={`relative px-4 py-2 rounded-xl transition-all group flex items-center gap-1 whitespace-nowrap ${
                    isActive('/loan-calculator') || isActive('/yar-pyat-tax-calculator')
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {(isActive('/loan-calculator') || isActive('/yar-pyat-tax-calculator')) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl" />
                  )}
                  <span className="relative z-10 group-hover:translate-y-[-2px] inline-block transition-transform text-sm lg:text-base">
                    {t('nav.calculator')}
                  </span>
                  <ChevronDown className="relative z-10 h-4 w-4 transition-transform group-hover:translate-y-0.5 flex-shrink-0" />
                </button>
              }
              label={t('nav.calculator')}
              items={navigationData.calculatorOptions}
              onItemClick={handleNavigation}
            />

            {/* Knowledges Dropdown */}
            <NavigationDropdown
              trigger={
                <button
                  className={`relative px-4 py-2 rounded-xl transition-all group flex items-center gap-1 whitespace-nowrap ${
                    isActive('/knowledge-hub') || isActive('/faq') || isActive('/news-updates') || 
                    isActive('/about') || isActive('/contact') || isActive('/legal-team')
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {(isActive('/knowledge-hub') || isActive('/faq') || isActive('/news-updates') || 
                   isActive('/about') || isActive('/contact') || isActive('/legal-team')) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl" />
                  )}
                  <span className="relative z-10 group-hover:translate-y-[-2px] inline-block transition-transform text-sm lg:text-base">
                    {t('nav.knowledges')}
                  </span>
                  <ChevronDown className="relative z-10 h-4 w-4 transition-transform group-hover:translate-y-0.5 flex-shrink-0" />
                </button>
              }
              label={t('nav.knowledges')}
              items={navigationData.knowledgeCategories}
              onItemClick={handleNavigation}
            />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
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
                    <DropdownMenuItem onClick={() => navigate('/favorites')}>
                      <Heart className="mr-2 h-4 w-4" />
                      {t('services.favorite')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/recent-views')}>
                      <Eye className="mr-2 h-4 w-4" />
                      {t('services.recentViews')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/history')}>
                      <HistoryIcon className="mr-2 h-4 w-4" />
                      {t('services.history')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      {t('services.setting')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/about-app')}>
                      <Info className="mr-2 h-4 w-4" />
                      {t('services.aboutApp')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/point-management')}>
                      <Award className="mr-2 h-4 w-4" />
                      {t('services.pointManagement')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/feedback')}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {t('services.applyFeedback')}
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
                className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105"
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
              {navigationData.navLinks.map(link => (
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
              
              {/* Mobile Dropdowns */}
              <NavigationDropdown
                trigger={
                  <button className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${
                    isActive('/modules') || isActive('/wanted-listing')
                      ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}>
                    <span>{t('nav.properties')}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                }
                label={t('nav.properties')}
                items={navigationData.propertyCategories}
                onItemClick={handleNavigation}
              />
              
              <NavigationDropdown
                trigger={
                  <button className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${
                    isActive('/companies')
                      ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}>
                    <span>{t('nav.companies')}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                }
                label={t('categories.companies')}
                items={[
                  { name: 'All Companies', path: '/companies', icon: Building2 },
                  ...navigationData.companyCategories
                ]}
                onItemClick={handleNavigation}
              />

              <NavigationDropdown
                trigger={
                  <button className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${
                    isActive('/post-property')
                      ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}>
                    <span>{t('nav.createListing')}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                }
                label={t('createListing.title')}
                items={navigationData.createListingOptions}
                onItemClick={handleNavigation}
              />

              <NavigationDropdown
                trigger={
                  <button className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${
                    isActive('/loan-calculator') || isActive('/yar-pyat-tax-calculator')
                      ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}>
                    <span>{t('nav.calculator')}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                }
                label={t('nav.calculator')}
                items={navigationData.calculatorOptions}
                onItemClick={handleNavigation}
              />

              <NavigationDropdown
                trigger={
                  <button className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${
                    isActive('/knowledge-hub') || isActive('/faq') || isActive('/news-updates') || 
                    isActive('/about') || isActive('/contact') || isActive('/legal-team')
                      ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}>
                    <span>{t('nav.knowledges')}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                }
                label={t('nav.knowledges')}
                items={navigationData.knowledgeCategories}
                onItemClick={handleNavigation}
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}