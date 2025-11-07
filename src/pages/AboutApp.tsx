import { Smartphone, Shield, Zap, Users, Award, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';

export function AboutApp() {
  const { t } = useLanguage();
  const seo = seoUtils.getPageSEO('aboutApp');

  const features = [
    {
      icon: Zap,
      title: t('aboutApp.fastEfficient') || 'Fast & Efficient',
      description: t('aboutApp.fastEfficientDesc') || 'Lightning-fast property search with advanced filters',
    },
    {
      icon: Shield,
      title: t('aboutApp.secureReliable') || 'Secure & Reliable',
      description: t('aboutApp.secureReliableDesc') || 'Your data is protected with industry-standard security',
    },
    {
      icon: Users,
      title: t('aboutApp.userFriendly') || 'User-Friendly',
      description: t('aboutApp.userFriendlyDesc') || 'Intuitive interface designed for everyone',
    },
    {
      icon: Award,
      title: t('aboutApp.awardWinning') || 'Award-Winning',
      description: t('aboutApp.awardWinningDesc') || 'Recognized as Myanmar\'s best real estate platform',
    },
  ];

  return (
    <>
      <SEOHead seo={seo} path="/about-app" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-lg">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="mb-1 bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent text-center">
              {t('aboutApp.title') || 'About App'}
            </h1>
            <p className="text-muted-foreground mt-2 text-center">
              {t('aboutApp.subtitle') || 'Your trusted partner in real estate discovery'}
            </p>
          </div>

          {/* App Info Card */}
          <Card className="backdrop-blur-sm bg-background/95 shadow-sm border-border/50 mb-8">
            <CardHeader>
              <CardTitle>{t('aboutApp.platformName') || 'Jade Property Platform'}</CardTitle>
              <CardDescription>{t('aboutApp.version') || 'Version 1.0.0'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-primary/5">
                  <p className="text-muted-foreground mb-1 text-sm">{t('aboutApp.releaseDate') || 'Release Date'}</p>
                  <p className="font-medium">{t('aboutApp.releaseDateValue') || 'October 2025'}</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/5">
                  <p className="text-muted-foreground mb-1 text-sm">{t('aboutApp.platform') || 'Platform'}</p>
                  <p className="font-medium">{t('aboutApp.platformValue') || 'Web Application'}</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/5">
                  <p className="text-muted-foreground mb-1 text-sm">{t('aboutApp.developer') || 'Developer'}</p>
                  <p className="font-medium">{t('aboutApp.developerValue') || 'Jade Property Team'}</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/5">
                  <p className="text-muted-foreground mb-1 text-sm">{t('aboutApp.license') || 'License'}</p>
                  <p className="font-medium">{t('aboutApp.licenseValue') || 'Proprietary'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-center mb-6 text-xl font-semibold">{t('aboutApp.keyFeatures') || 'Key Features'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="backdrop-blur-sm bg-background/95 shadow-sm border-border/50 hover:border-primary/50 transition-all">
                  <CardContent className="!pt-6 pb-6 px-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-[#4a9b82] flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="mb-2 font-semibold">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mission Statement */}
          <Card className="backdrop-blur-sm bg-background/95 shadow-sm border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                {t('aboutApp.ourMission') || 'Our Mission'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {t('aboutApp.missionDescription') || 'At Jade Property, our mission is to revolutionize the real estate experience in Myanmar by providing a transparent, efficient, and user-friendly platform that empowers individuals and businesses to discover, buy, sell, and manage properties with confidence. We leverage cutting-edge technology and local expertise to deliver exceptional service and value to our community.'}
              </p>
            </CardContent>
          </Card>

          {/* Contact & Support */}
          <Card className="backdrop-blur-sm bg-background/95 shadow-sm border-border/50">
            <CardHeader>
              <CardTitle>{t('aboutApp.contactSupport') || 'Contact & Support'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg border border-border/50">
                <span className="text-muted-foreground">{t('aboutApp.email') || 'Email'}</span>
                <span className="font-medium">support@jadeproperty.com</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg border border-border/50">
                <span className="text-muted-foreground">{t('aboutApp.phone') || 'Phone'}</span>
                <span className="font-medium">+95-9-123-456-789</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg border border-border/50">
                <span className="text-muted-foreground">{t('aboutApp.website') || 'Website'}</span>
                <span className="font-medium">www.jadeproperty.com</span>
              </div>
            </CardContent>
          </Card>

          {/* Copyright */}
          <div className="text-center mt-8 text-muted-foreground text-sm">
            <p>{t('aboutApp.copyright') || '© 2025 Jade Property. All rights reserved.'}</p>
          </div>
        </div>
      </div>
    </>
  );
}

