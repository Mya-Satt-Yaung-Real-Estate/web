import { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableOfContents } from '@/components/ui/TableOfContents';
import { useLanguage } from '@/contexts/LanguageContext';
import { SEOHead } from '@/components/seo/SEOHead';
import {
  Calendar,
  CheckCircle,
  User,
  UserPlus,
  Globe,
  Home,
  CreditCard,
  Ban,
  Copyright,
  AlertTriangle,
  XCircle,
  Edit,
  ChevronUp
} from 'lucide-react';

interface TableOfContentsItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const TermsOfService = memo(function TermsOfService() {
  const { t, language } = useLanguage();

  const tableOfContents = useMemo<TableOfContentsItem[]>(() => [
    { id: 'acceptance', title: t('termsOfService.toc.acceptance'), icon: CheckCircle },
    { id: 'eligibility', title: t('termsOfService.toc.eligibility'), icon: User },
    { id: 'registration', title: t('termsOfService.toc.registration'), icon: UserPlus },
    { id: 'use', title: t('termsOfService.toc.use'), icon: Globe },
    { id: 'listings', title: t('termsOfService.toc.listings'), icon: Home },
    { id: 'payments', title: t('termsOfService.toc.payments'), icon: CreditCard },
    { id: 'prohibited', title: t('termsOfService.toc.prohibited'), icon: Ban },
    { id: 'intellectual', title: t('termsOfService.toc.intellectual'), icon: Copyright },
    { id: 'liability', title: t('termsOfService.toc.liability'), icon: AlertTriangle },
    { id: 'termination', title: t('termsOfService.toc.termination'), icon: XCircle },
    { id: 'changes', title: t('termsOfService.toc.changes'), icon: Edit },
  ], [t]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEOHead
        seo={{
          title: t('termsOfService.seo.title'),
          description: t('termsOfService.seo.description'),
          keywords: t('termsOfService.seo.keywords'),
          image: '/jade.png',
          type: 'website'
        }}
        path="/terms-of-service"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
              {t('termsOfService.title')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('termsOfService.subtitle')}
            </p>
          </div>

          {/* Last Updated Notice */}
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="flex items-center gap-2 text-primary">
                <Calendar className="h-5 w-5" />
                <strong>{t('termsOfService.lastUpdated')}:</strong>
                <span>{new Date().toLocaleDateString(language === 'mm' ? 'my-MM' : 'en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </CardContent>
          </Card>

          {/* Table of Contents */}
          <TableOfContents
            title={t('termsOfService.toc.title')}
            items={tableOfContents}
            onItemClick={scrollToSection}
            className="mb-8"
          />

          {/* Content Sections */}
          <div className="space-y-8">
            {/* 1. Acceptance of Terms */}
            <section id="acceptance" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    {t('termsOfService.sections.acceptance.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('termsOfService.sections.acceptance.content')}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* 2. Eligibility */}
            <section id="eligibility" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    {t('termsOfService.sections.eligibility.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('termsOfService.sections.eligibility.content')}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* 3. Account Registration */}
            <section id="registration" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary" />
                    {t('termsOfService.sections.registration.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('termsOfService.sections.registration.content')}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* 4. Use of the Platform */}
            <section id="use" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    {t('termsOfService.sections.use.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('termsOfService.sections.use.content')}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* 5. Property Listings */}
            <section id="listings" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    {t('termsOfService.sections.listings.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('termsOfService.sections.listings.content')}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* 6. Payments & Fees */}
            <section id="payments" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    {t('termsOfService.sections.payments.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('termsOfService.sections.payments.content')}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* 7. Prohibited Activities */}
            <section id="prohibited" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ban className="h-5 w-5 text-primary" />
                    {t('termsOfService.sections.prohibited.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {t('termsOfService.sections.prohibited.content')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>{t('termsOfService.sections.prohibited.item1')}</li>
                    <li>{t('termsOfService.sections.prohibited.item2')}</li>
                    <li>{t('termsOfService.sections.prohibited.item3')}</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* 8. Intellectual Property */}
            <section id="intellectual" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Copyright className="h-5 w-5 text-primary" />
                    {t('termsOfService.sections.intellectual.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('termsOfService.sections.intellectual.content')}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* 9. Limitation of Liability */}
            <section id="liability" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    {t('termsOfService.sections.liability.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('termsOfService.sections.liability.content')}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* 10. Termination */}
            <section id="termination" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-primary" />
                    {t('termsOfService.sections.termination.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('termsOfService.sections.termination.content')}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* 11. Changes to Terms */}
            <section id="changes" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5 text-primary" />
                    {t('termsOfService.sections.changes.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('termsOfService.sections.changes.content')}
                  </p>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Back to Top Button */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={scrollToTop}
              className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <ChevronUp className="h-4 w-4" />
              {t('termsOfService.backToTop')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
});

