/**
 * Legacy Team Page
 * 
 * Displays the legacy team members with modern design based on Figma.
 */

import { useNavigate } from 'react-router-dom';
import { useLegacyTeam } from '@/hooks/queries/useLegacy';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  Building, 
  GraduationCap
} from 'lucide-react';

export default function Legacy() {
  const navigate = useNavigate();
  
  const { data: legacyData, isLoading, error } = useLegacyTeam();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !legacyData?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Legacy Team Not Found</h1>
            <p className="text-gray-600">Unable to load the legacy team information.</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
            Legacy Team
          </h1>
          <p className="text-muted-foreground mt-2">
            Meet our experienced legal professionals who have been serving our community for years.
          </p>
        </div>

        {/* Legacy Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {legacyData.data.map((member) => (
            <Card
              key={member.id}
              className="glass border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
              onClick={() => navigate(`/legacy/${member.slug}`)}
            >
              <CardHeader>
                <div className="flex flex-col items-center text-center">
                  <img
                    src={member.profile_image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg"
                  />
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription className="mt-2">{member.title}</CardDescription>
                  <Badge className="mt-3 gradient-primary text-white">
                    {member.specialization}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award className="h-4 w-4 text-primary" />
                    <span>{member.experience_years} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="h-4 w-4 text-primary" />
                    <span>{member.education[0] || 'Education'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span>{member.experience_years}+ years experience</span>
                  </div>
                </div>
                <Button className="w-full mt-4 gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all">
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
