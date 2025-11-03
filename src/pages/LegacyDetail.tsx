/**
 * Legacy Team Detail Page
 * 
 * Displays a single legacy team member with detailed information.
 */

import { useParams, Link } from 'react-router-dom';
import { useLegacyTeamMember } from '@/hooks/queries/useLegacy';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Mail, 
  Phone
} from 'lucide-react';

export default function LegacyDetail() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: legacyData, isLoading, error } = useLegacyTeamMember(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !legacyData?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Team Member Not Found</h1>
            <p className="text-gray-600 mb-6">The team member you're looking for doesn't exist or has been removed.</p>
            <Link to="/legacy">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Legacy Team
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const member = legacyData.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          asChild
          className="mb-6 hover:bg-primary/10"
        >
          <Link to="/legacy">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Legacy Team
          </Link>
        </Button>

        <Card className="glass border-border/50">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <img
                  src={member.profile_image}
                  alt={member.name}
                  className="w-48 h-48 rounded-2xl object-cover shadow-lg"
                />
              </div>
              <div className="flex-1">
                <h1 className="mb-2">{member.name}</h1>
                <p className="text-primary mb-4">{member.title}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-muted-foreground mb-1">Specialization</p>
                    <p>{member.specialization}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Experience</p>
                    <p>{member.experience_years} years</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Education</p>
                    <p>{member.education.length > 0 ? member.education[0] : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Languages</p>
                    <p>{member.skillful_languages.join(', ')}</p>
                  </div>
                </div>

                {member.about && (
                  <div className="mb-6">
                    <h3 className="mb-2">About</h3>
                    <p className="text-muted-foreground">{member.about}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="mb-2">Contact Information</h3>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>{member.phone}</span>
                  </div>
                  {member.email && (
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
                      <Mail className="h-5 w-5 text-primary" />
                      <span>{member.email}</span>
                    </div>
                  )}
                </div>

                <Button 
                  asChild
                  className="w-full mt-6 gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                >
                  <a href={`tel:${member.phone}`}>
                    Contact
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
