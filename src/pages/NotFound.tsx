import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';

export function NotFound() {
  const seo = seoUtils.getPageSEO('notFound');
  
  return (
    <>
      <SEOHead seo={seo} path="/404" />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-purple-500/5 flex items-center justify-center p-4">
      <div className="max-w-lg mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-3xl font-bold text-primary/50 mb-4">
            Wait! Mg Khaing! <br /> We are still developing this page.
          </div>
        </div>

        {/* Error Message */}
        <Card>
          <CardContent className="p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Page Not Found
              </h1>
              <p className="text-muted-foreground">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="w-full sm:w-auto">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
