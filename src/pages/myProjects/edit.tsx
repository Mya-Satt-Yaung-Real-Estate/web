import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMyProject } from '@/hooks/queries/useProjects';
import { ProjectFormPage } from './ProjectFormPage';

export default function EditProject() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useMyProject(id || '');

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="glass border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-semibold mb-2">Project not found</h3>
              <p className="text-muted-foreground mb-4">Unable to load this project.</p>
              <Button asChild variant="outline">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back Home
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <ProjectFormPage
      mode="edit"
      project={data?.data?.data}
      projectId={id}
      isLoading={isLoading}
    />
  );
}
