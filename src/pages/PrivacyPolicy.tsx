import { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableOfContents } from '@/components/ui/TableOfContents';
import { useLanguage } from '@/contexts/LanguageContext';
import { SEOHead } from '@/components/seo/SEOHead';
import {
  Calendar,
  Info,
  Database,
  HelpCircle,
  FolderOpen,
  Share2,
  Clock,
  Shield,
  ShieldCheck,
  Bell,
  Edit,
  Mail,
  Gavel,
  ChevronUp
} from 'lucide-react';

interface TableOfContentsItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const PrivacyPolicy = memo(function PrivacyPolicy() {
  const { t } = useLanguage();

  const tableOfContents = useMemo<TableOfContentsItem[]>(() => [
    { id: 'introduction', title: t('privacyPolicy.toc.introduction'), icon: Info },
    { id: 'definition', title: t('privacyPolicy.toc.definition'), icon: Database },
    { id: 'why-collect', title: t('privacyPolicy.toc.whyCollect'), icon: HelpCircle },
    { id: 'how-collect', title: t('privacyPolicy.toc.howCollect'), icon: FolderOpen },
    { id: 'data-disclosure', title: t('privacyPolicy.toc.dataDisclosure'), icon: Share2 },
    { id: 'retention', title: t('privacyPolicy.toc.retention'), icon: Clock },
    { id: 'security', title: t('privacyPolicy.toc.security'), icon: Shield },
    { id: 'privacy-rights', title: t('privacyPolicy.toc.privacyRights'), icon: ShieldCheck },
    { id: 'notifications', title: t('privacyPolicy.toc.notifications'), icon: Bell },
    { id: 'amendments', title: t('privacyPolicy.toc.amendments'), icon: Edit },
    { id: 'contact', title: t('privacyPolicy.toc.contact'), icon: Mail },
    { id: 'governing-law', title: t('privacyPolicy.toc.governingLaw'), icon: Gavel },
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
          title: t('privacyPolicy.seo.title'),
          description: t('privacyPolicy.seo.description'),
          keywords: t('privacyPolicy.seo.keywords'),
          image: '/jade.png',
          type: 'website'
        }}
        path="/privacy-policy"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
              {t('privacyPolicy.title')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('privacyPolicy.subtitle')}
            </p>
          </div>

          {/* Last Updated Notice */}
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-primary">
                <Calendar className="h-5 w-5" />
                <strong>{t('privacyPolicy.lastUpdated')}:</strong>
                <span>{new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </CardContent>
          </Card>

          {/* Table of Contents */}
          <TableOfContents
            title={t('privacyPolicy.toc.title')}
            items={tableOfContents}
            onItemClick={scrollToSection}
            className="mb-8"
          />

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Introduction */}
            <section id="introduction" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    {t('privacyPolicy.sections.introduction.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.sections.introduction.content')}
                  </p>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                    <p className="text-primary font-medium">
                      {t('privacyPolicy.sections.introduction.highlight')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Definition of Personal Data */}
            <section id="definition" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    {t('privacyPolicy.sections.definition.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.sections.definition.content')}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Why We Collect Personal Data */}
            <section id="why-collect" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    {t('privacyPolicy.sections.whyCollect.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary">
                      {t('privacyPolicy.sections.whyCollect.ageVerification.title')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('privacyPolicy.sections.whyCollect.ageVerification.content')}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary">
                      {t('privacyPolicy.sections.whyCollect.accountSecurity.title')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('privacyPolicy.sections.whyCollect.accountSecurity.content')}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary">
                      {t('privacyPolicy.sections.whyCollect.cameraAccess.title')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      {t('privacyPolicy.sections.whyCollect.cameraAccess.content')}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('privacyPolicy.sections.whyCollect.cameraAccess.additional')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* How We Collect Personal Data */}
            <section id="how-collect" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    {t('privacyPolicy.sections.howCollect.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.sections.howCollect.content')}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.sections.howCollect.additional')}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Data Disclosure */}
            <section id="data-disclosure" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    {t('privacyPolicy.sections.dataDisclosure.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.sections.dataDisclosure.content')}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Retention of Personal Data */}
            <section id="retention" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    {t('privacyPolicy.sections.retention.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.sections.retention.content')}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.sections.retention.additional')}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Security of Personal Data */}
            <section id="security" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    {t('privacyPolicy.sections.security.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary">
                      {t('privacyPolicy.sections.security.measures.title')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('privacyPolicy.sections.security.measures.content')}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary">
                      {t('privacyPolicy.sections.security.limitations.title')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('privacyPolicy.sections.security.limitations.content')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Privacy Rights */}
            <section id="privacy-rights" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    {t('privacyPolicy.sections.privacyRights.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.sections.privacyRights.content')}
                  </p>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                    <p className="text-primary font-medium">
                      {t('privacyPolicy.sections.privacyRights.highlight')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Push Notifications */}
            <section id="notifications" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    {t('privacyPolicy.sections.notifications.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.sections.notifications.content')}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Amendments and Updates */}
            <section id="amendments" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5 text-primary" />
                    {t('privacyPolicy.sections.amendments.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.sections.amendments.content')}
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Contact Us */}
            <section id="contact" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    {t('privacyPolicy.sections.contact.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary">
                      {t('privacyPolicy.sections.contact.subtitle')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {t('privacyPolicy.sections.contact.content')}
                    </p>
                    <div className="flex items-center gap-2">
                      <strong className="text-foreground">{t('privacyPolicy.sections.contact.email')}:</strong>
                      <a 
                        href="mailto:myasattyaung.dev@gmail.com"
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        myasattyaung.dev@gmail.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Governing Law */}
            <section id="governing-law" className="scroll-mt-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="h-5 w-5 text-primary" />
                    {t('privacyPolicy.sections.governingLaw.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.sections.governingLaw.content')}
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
              {t('privacyPolicy.backToTop')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
});
