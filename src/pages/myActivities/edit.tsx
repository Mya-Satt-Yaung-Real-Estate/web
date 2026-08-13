import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMyActivity } from '@/hooks/queries/useMyActivities';
import { useLanguage } from '@/contexts/LanguageContext';
import { ActivityFormPage } from './ActivityFormPage';

export default function EditActivity() {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const { data, isLoading, error } = useMyActivity(slug || '');
  const activity = data?.data?.data;

  if (!slug || (!isLoading && (error || !activity))) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="glass border-border/50">
            <CardContent className="py-12 text-center space-y-4">
              <h2 className="text-xl font-semibold">
                {t('myActivities.notFound') || (language === 'mm' ? 'လုပ်ငန်းလှုပ်ရှားမှု မတွေ့ပါ' : 'Activity not found')}
              </h2>
              <Button asChild variant="outline">
                <Link to="/my-activities/list">{t('myWantedList.backToList')}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <ActivityFormPage mode="edit" activity={activity} slug={slug} isLoading={isLoading || !activity} />;
}
