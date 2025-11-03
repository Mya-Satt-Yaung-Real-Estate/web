import { Mail, Phone, MapPin, Target, Users, Heart, Award, TrendingUp, Shield, Sparkles, Eye, Rocket, Building2, Search, FileText, Calendar, UserCheck, BarChart3, Bell, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';

export function About() {
  const { t } = useLanguage();
  const seo = seoUtils.getPageSEO('about');
  
  const team = [
    {
      name: 'Aung Min Thu',
      role: 'CEO & Founder',
      image: '👨‍💼',
      bio: 'Real estate expert with 15+ years experience',
    },
    {
      name: 'Thida Myo',
      role: 'Head of Operations',
      image: '👩‍💼',
      bio: 'Specialized in property management',
    },
    {
      name: 'Kyaw Zin',
      role: 'Chief Technology Officer',
      image: '👨‍💻',
      bio: 'Building innovative property solutions',
    },
    {
      name: 'May Phyu',
      role: 'Marketing Director',
      image: '👩‍🎨',
      bio: 'Connecting properties with people',
    },
  ];

  const vision = {
    icon: <Eye className="h-8 w-8" />,
    title: 'Company Vision',
    titleMm: 'ကုမ္ပဏီအမြင်',
    description: 'To become Myanmar\'s most trusted and innovative real estate platform, empowering every individual and business to find their ideal property through technology-driven solutions and exceptional service.',
    descriptionMm: 'နည်းပညာမောင်းနှင်သော ဖြေရှင်းချက်များနှင့် ထူးခြားသော ဝန်ဆောင်မှုများမှတဆင့် လူတိုင်းနှင့် စီးပွားရေးလုပ်ငန်းတိုင်းအား ၎င်းတို့၏ အကောင်းဆုံး အိမ်ခြံမြေကို ရှာတွေ့နိုင်စေရန် မြန်မာနိုင်ငံ၏ အယုံကြည်ရဆုံးနှင့် ဆန်းသစ်ဆုံး အိမ်ခြံမြေပလက်ဖောင်း ဖြစ်လာရန်။',
  };

  const mission = {
    icon: <Target className="h-8 w-8" />,
    title: t('about.mission'),
    description: t('about.missionDesc'),
  };

  const values = [
    {
      icon: <Users className="h-8 w-8" />,
      title: t('about.clientCentric'),
      description: t('about.clientDesc'),
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: t('about.integrity'),
      description: t('about.integrityDesc'),
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: 'Excellence',
      titleMm: 'ထူးချွန်မှု',
      description: 'We strive for excellence in every aspect of our service, continuously improving and innovating to exceed expectations.',
      descriptionMm: 'ကျွန်ုပ်တို့သည် ဝန်ဆောင်မှု၏ ကဏ္ဍတိုင်းတွင် ထူးချွန်မှုအတွက် ကြိုးစားပြီး မျှော်မှန်းချက်များကို ကျော်လွန်ရန် စဉ်ဆက်မပြတ် တိုးတက်မှုနှင့် ဆန်းသစ်တီထွင်မှုပြုလုပ်ပါသည်။',
    },
  ];

  const ourServices = [
    {
      icon: <Search className="h-6 w-6" />,
      title: 'Property Search & Discovery',
      titleMm: 'အိမ်ခြံမြေရှာဖွေခြင်း',
      description: 'Advanced search tools with comprehensive filters to find your perfect property.',
      descriptionMm: 'သင့်အတွက်အကောင်းဆုံး အိမ်ခြံမြေကို ရှာတွေ့ရန် ပြည့်စုံသော စစ်ထုတ်မှုများပါရှိသော အဆင့်မြင့်ရှာဖွေမှုကိရိယာများ။',
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Property Listing Services',
      titleMm: 'အိမ်ခြံမြေစာရင်းဝန်ဆောင်မှု',
      description: 'List your properties with professional presentation and maximum visibility.',
      descriptionMm: 'ပရော်ဖက်ရှင်နယ် တင်ပြမှုနှင့် အများဆုံးမြင်နိုင်မှုဖြင့် သင့်အိမ်ခြံမြေများကို စာရင်းတင်ပါ။',
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Appointment Management',
      titleMm: 'ချိန်းဆိုမှုစီမံခန့်ခွဲမှု',
      description: 'Schedule and manage property viewings with ease and convenience.',
      descriptionMm: 'အိမ်ခြံမြေကြည့်ရှုမှုများကို လွယ်ကူအဆင်ပြေစွာ ချိန်းဆို၍ စီမံပါ။',
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: 'Expert Consultation',
      titleMm: 'ကျွမ်းကျင်သူအကြံပြုမှု',
      description: 'Get professional advice from our experienced real estate consultants.',
      descriptionMm: 'ကျွန်ုပ်တို့၏ အတွေ့အကြုံရှိ အိမ်ခြံမြေအကြံပေးများထံမှ ပရော်ဖက်ရှင်နယ်အကြံပြုမှုရယူပါ။',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Market Analytics',
      titleMm: 'စျေးကွက်ခွဲခြမ်းစိတ်ဖြာမှု',
      description: 'Access real-time market data and insights for informed decision-making.',
      descriptionMm: 'အကောင်းဆုံးဆုံးဖြတ်ချက်ချရန် လက်ရှိအချိန် စျေးကွက်ဒေတာနှင့် အသိအမြင်များကို ရယူပါ။',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure Transactions',
      titleMm: 'လုံခြုံသောအရောင်းအဝယ်',
      description: 'Safe and verified property transactions with legal support.',
      descriptionMm: 'ဥပဒေပံ့ပိုးမှုဖြင့် လုံခြုံပြီး အတည်ပြုထားသော အိမ်ခြံမြေအရောင်းအဝယ်များ။',
    },
  ];

  const customerDashboardFeatures = [
    {
      icon: <Building2 className="h-6 w-6" />,
      title: 'Property Management',
      titleMm: 'အိမ်ခြံမြေစီမံခန့်ခွဲမှု',
      description: 'Manage all your listed properties from one central dashboard.',
      descriptionMm: 'သင့်စာရင်းတင်ထားသော အိမ်ခြံမြေအားလုံးကို ဗဟိုမှ စီမံပါ။',
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: 'Real-time Notifications',
      titleMm: 'လက်ရှိအချိန် အကြောင်းကြားချက်များ',
      description: 'Get instant updates on inquiries, appointments, and market changes.',
      descriptionMm: 'မေးမြန်းမှုများ၊ ချိန်းဆိုမှုများနှင့် စျေးကွက်ပြောင်းလဲမှုများအား ချက်ချင်းအပ်ဒိတ်ရယူပါ။',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Analytics & Insights',
      titleMm: 'ခွဲခြမ်းစိတ်ဖြာမှုနှင့် အသိအမြင်',
      description: 'Track property views, engagement metrics, and performance analytics.',
      descriptionMm: 'အိမ်ခြံမြေကြည့်ရှုမှု၊ ပါဝင်မှုနှင့် စွမ်းဆောင်ရည် ခွဲခြမ်းစိတ်ဖြာမှုများကို ခြေရာခံပါ။',
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Favorites & Saved Searches',
      titleMm: 'အကြိုက်ဆုံးများနှင့် သိမ်းထားသော ရှာဖွေမှုများ',
      description: 'Save your favorite properties and search preferences for quick access.',
      descriptionMm: 'သင့်အကြိုက်ဆုံး အိမ်ခြံမြေများနှင့် ရှာဖွေမှုများကို လျင်မြန်စွာ ဝင်ရောက်ရန် သိမ်းဆည်းပါ။',
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Points & Rewards',
      titleMm: 'ပွိုင့်များနှင့် ဆုလာဘ်များ',
      description: 'Earn reward points for activities and redeem for premium features.',
      descriptionMm: 'လုပ်ဆောင်ချက်များအတွက် ဆုလာဘ်ပွိုင့်များရယူပြီး ပရီမီယံဝန်ဆောင်မှုများအတွက် လဲလှယ်ပါ။',
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'Privacy & Security',
      titleMm: 'ကိုယ်ရေးကိုယ်တာနှင့် လုံခြုံမှု',
      description: 'Advanced security features to protect your account and data.',
      descriptionMm: 'သင့်အကောင့်နှင့် ဒေတာကို ကာကွယ်ရန် အဆင့်မြင့် လုံခြုံရေးအင်္ဂါရပ်များ။',
    },
  ];

  const achievements = [
    {
      icon: <Award className="h-8 w-8" />,
      title: t('about.experience'),
      description: t('about.experienceDesc'),
      value: '12+',
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: t('about.marketLeader'),
      description: t('about.marketLeaderDesc'),
      value: '10K+',
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: t('about.innovation'),
      description: t('about.innovationDesc'),
      value: '#1',
    },
  ];

  return (
    <>
      <SEOHead seo={seo} path="/about" />
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="mb-20 gradient-mesh -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-sm animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-primary">{t('about.story')}</span>
          </div>
          <h1 className="mb-6 text-foreground">
            {t('about.title')}
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('about.intro')}
          </p>
        </div>
      </section>

      {/* Company About - Tabs Section */}
      <section className="mb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center mb-12 text-foreground">
            Company About
          </h2>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 justify-start mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="vision">Vision</TabsTrigger>
              <TabsTrigger value="mission">Mission</TabsTrigger>
              <TabsTrigger value="services">Our Services</TabsTrigger>
              <TabsTrigger value="dashboard">Customer Dashboard</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card className="shadow-xl border-border/50 backdrop-blur-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-bl-full transform translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-500" />
                <CardHeader className="relative">
                  <CardTitle className="text-foreground">
                    {t('about.whatWeDo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 relative">
                  <p className="text-muted-foreground leading-relaxed">
                    {t('about.description1')}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('about.description2')}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="mb-1">Secure Transactions</h4>
                        <p className="text-muted-foreground">Safe and verified property deals</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center flex-shrink-0">
                        <Target className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="mb-1">Expert Guidance</h4>
                        <p className="text-muted-foreground">Professional consultation available</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="mb-1">Market Insights</h4>
                        <p className="text-muted-foreground">Real-time property analytics</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vision">
              <Card className="shadow-xl border-border/50 backdrop-blur-sm overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center shadow-lg shadow-primary/25">
                      {vision.icon}
                    </div>
                    <CardTitle className="text-foreground">
                      {vision.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {vision.description}
                  </p>
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-muted-foreground leading-relaxed">
                      {vision.descriptionMm}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mission">
              <Card className="shadow-xl border-border/50 backdrop-blur-sm overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center shadow-lg shadow-primary/25">
                      {mission.icon}
                    </div>
                    <CardTitle className="text-foreground">
                      {mission.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {mission.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services">
              <Card className="shadow-xl border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Our Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ourServices.map((service, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 group">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary group-hover:to-[#4a9b82] transition-all">
                          <div className="text-primary group-hover:text-white transition-colors">
                            {service.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-2 group-hover:text-primary transition-colors">
                            {service.title}
                          </h4>
                          <p className="text-muted-foreground mb-2">
                            {service.description}
                          </p>
                          <p className="text-muted-foreground/70">
                            {service.descriptionMm}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dashboard">
              <Card className="shadow-xl border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Customer Dashboard Features
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Powerful tools to manage your property journey efficiently
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {customerDashboardFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-4 p-5 rounded-xl border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 group bg-gradient-to-br from-background to-muted/20">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary group-hover:to-[#4a9b82] transition-all">
                          <div className="text-primary group-hover:text-white transition-colors">
                            {feature.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-2 group-hover:text-primary transition-colors">
                            {feature.title}
                          </h4>
                          <p className="text-muted-foreground mb-2">
                            {feature.description}
                          </p>
                          <p className="text-muted-foreground/70">
                            {feature.descriptionMm}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Achievements */}
      <section className="mb-20 bg-gradient-to-b from-muted/30 to-background -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center mb-12 text-foreground">
            Our Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl transform transition-transform group-hover:scale-105" />
                <Card className="relative shadow-lg hover:shadow-2xl transition-all border-border/50 backdrop-blur-sm h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center shadow-lg shadow-primary/25">
                        {achievement.icon}
                      </div>
                      <div className="text-primary font-bold">
                        {achievement.value}
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {achievement.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {achievement.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="mb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center mb-12 text-foreground">
            {t('about.ourValues')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl transform transition-transform group-hover:scale-105" />
                <Card className="relative shadow-lg hover:shadow-2xl transition-all border-border/50 backdrop-blur-sm h-full">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                      {value.icon}
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                    {value.descriptionMm && (
                      <p className="text-muted-foreground/70 leading-relaxed border-t border-border/30 pt-3">
                        {value.descriptionMm}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20 bg-gradient-to-b from-background to-muted/30 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center mb-4 text-foreground">
            {t('about.meetTeam')}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Meet the dedicated professionals behind Jade Property's success
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card 
                key={index} 
                className="text-center group hover:shadow-xl transition-all border-border/50 backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                    {member.image}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {member.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-primary mb-2">{member.role}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-xl border-border/50 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-600 to-primary" />
            <CardHeader>
              <CardTitle className="text-foreground">
                {t('about.contactInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:from-primary/20 group-hover:to-purple-500/20 transition-all">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="mb-2 group-hover:text-primary transition-colors">
                      {t('about.email')}
                    </h4>
                    <a
                      href="mailto:info@jadeproperty.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      info@jadeproperty.com
                    </a>
                    <br />
                    <a
                      href="mailto:support@jadeproperty.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      support@jadeproperty.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:from-primary/20 group-hover:to-purple-500/20 transition-all">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="mb-2 group-hover:text-primary transition-colors">
                      {t('about.phone')}
                    </h4>
                    <a
                      href="tel:+95123456789"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +95 (1) 234-5678
                    </a>
                    <br />
                    <a
                      href="tel:+95987654321"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +95 (9) 876-54321
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:from-primary/20 group-hover:to-purple-500/20 transition-all">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="mb-2 group-hover:text-primary transition-colors">
                      {t('about.address')}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      123 Property Street<br />
                      Downtown Yangon<br />
                      Myanmar, 11181
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
    </>
  );
}