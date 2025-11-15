/**
 * Home Legal Card Component
 * 
 * Legal team card component specifically for home page.
 * Matches the Figma design 100% (100% same design).
 * Not reusable - specific to home page feature for easy maintenance.
 */

import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Building } from 'lucide-react';
import type { LegacyTeamMember } from '@/types/legacy';

interface HomeLegalCardProps {
  member: LegacyTeamMember;
}

export function HomeLegalCard({ member }: HomeLegalCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="glass border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
      onClick={() => navigate(`/legacy/${member.slug}`)}
    >
      <CardHeader className="pb-4">
        <div className="flex flex-col items-center text-center">
          <img
            src={member.profile_image}
            alt={member.name}
            className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg"
          />
          <CardTitle className="text-lg font-semibold mb-1">{member.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-3">{member.title}</CardDescription>
          <Badge className="gradient-primary text-white text-xs px-3 py-1">
            {member.specialization}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Separator line */}
        <div className="border-t border-border/50 mb-4" />
        
        {/* Experience Details - 2 lines as per design */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4 text-primary flex-shrink-0" />
            <span>{member.experience_years} years experience</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4 text-primary flex-shrink-0" />
            <span>{member.education && member.education.length > 0 ? member.education.join(', ') : 'Education'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

