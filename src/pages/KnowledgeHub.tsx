import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Video, FileText, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';

export function KnowledgeHub() {
  const { t } = useLanguage();

  const articles = [
    {
      id: 1,
      title: 'First-Time Homebuyer Guide',
      category: 'Buying',
      readTime: '8 min read',
      thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
      description: 'Everything you need to know about buying your first property in Myanmar',
    },
    {
      id: 2,
      title: 'Investment Property Strategies',
      category: 'Investing',
      readTime: '12 min read',
      thumbnail: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=400&h=250&fit=crop',
      description: 'Smart strategies for property investment and maximizing returns',
    },
    {
      id: 3,
      title: 'Property Valuation Methods',
      category: 'Valuation',
      readTime: '10 min read',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop',
      description: 'Understanding different methods to value real estate properties',
    },
  ];

  const videos = [
    {
      id: 1,
      title: 'Virtual Property Tour Techniques',
      duration: '15:30',
      views: '2.5K',
      thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=250&fit=crop',
    },
    {
      id: 2,
      title: 'Understanding Mortgage Options',
      duration: '20:45',
      views: '3.2K',
      thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=250&fit=crop',
    },
  ];

  const guides = [
    {
      id: 1,
      title: 'Complete Property Buying Checklist',
      pages: 25,
      downloads: 1234,
      icon: FileText,
    },
    {
      id: 2,
      title: 'Rental Property Management Guide',
      pages: 35,
      downloads: 856,
      icon: FileText,
    },
    {
      id: 3,
      title: 'Myanmar Real Estate Market Report 2025',
      pages: 48,
      downloads: 2341,
      icon: TrendingUp,
    },
  ];

  const courses = [
    {
      id: 1,
      title: 'Real Estate Investment Fundamentals',
      lessons: 12,
      duration: '6 hours',
      level: 'Beginner',
      students: 458,
    },
    {
      id: 2,
      title: 'Property Management Essentials',
      lessons: 15,
      duration: '8 hours',
      level: 'Intermediate',
      students: 321,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
            {t('services.knowledgeHub')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('services.knowledgeHubDesc')}
          </p>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Articles</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Guides</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
          </TabsList>

          {/* Articles */}
          <TabsContent value="articles">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Card key={article.id} className="glass border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 right-4 gradient-primary text-white">
                      {article.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                    <CardDescription>{article.readTime}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{article.description}</p>
                    <button className="text-primary hover:underline">Read More →</button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Videos */}
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="glass border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 overflow-hidden group">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <Video className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <Badge className="absolute bottom-4 right-4 bg-black/80 text-white border-none">
                      {video.duration}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>{video.title}</CardTitle>
                    <CardDescription>{video.views} views</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Guides */}
          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <Card key={guide.id} className="glass border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-[#4a9b82] flex items-center justify-center mb-4">
                      <guide.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>{guide.title}</CardTitle>
                    <CardDescription>
                      {guide.pages} pages • {guide.downloads.toLocaleString()} downloads
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 text-primary hover:from-primary hover:to-[#4a9b82] hover:text-white transition-all">
                      Download PDF
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Courses */}
          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="glass border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-[#4a9b82] flex items-center justify-center">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="outline" className="border-primary text-primary">
                        {course.level}
                      </Badge>
                    </div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>
                      {course.lessons} lessons • {course.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground">
                        {course.students} students enrolled
                      </span>
                    </div>
                    <button className="w-full px-4 py-2 rounded-lg gradient-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all">
                      Enroll Now
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}