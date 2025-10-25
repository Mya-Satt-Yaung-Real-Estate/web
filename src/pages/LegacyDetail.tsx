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
        <Link 
          to="/legacy" 
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Legacy Team
        </Link>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 md:p-12 text-white mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src={member.profile_image}
                    alt={member.name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-2xl border-4 border-white/20"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-white text-primary rounded-full p-2 shadow-lg">
                    <div className="w-6 h-6 flex items-center justify-center font-bold">⭐</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{member.name}</h1>
                <p className="text-xl md:text-2xl text-white/90 mb-4">{member.title}</p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {member.specialization}
                  </span>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {member.experience_years} years experience
                  </span>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {member.township.name_en}, {member.region.name_en}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{member.phone}</span>
                  </div>
                  {member.email && (
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{member.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        {member.about && (
          <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-gray-50 to-gray-100/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">👤</span>
                </div>
                About {member.name}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">{member.about}</p>
            </CardContent>
          </Card>
        )}

        {/* Skills & Expertise Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Languages */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                  🌐
                </div>
                <h3 className="text-xl font-bold text-gray-900">Languages</h3>
              </div>
              <div className="space-y-3">
                {member.skillful_languages.map((language, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-800">{language}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                  💼
                </div>
                <h3 className="text-xl font-bold text-gray-900">Services</h3>
              </div>
              <div className="space-y-3">
                {member.services.map((service, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-800">{service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Education & Certifications */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Education */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                  🎓
                </div>
                <h3 className="text-xl font-bold text-gray-900">Education</h3>
              </div>
              <div className="space-y-4">
                {member.education.map((edu, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="font-medium text-gray-800">{edu}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">
                  🏆
                </div>
                <h3 className="text-xl font-bold text-gray-900">Certifications</h3>
              </div>
              <div className="space-y-4">
                {member.certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="font-medium text-gray-800">{cert}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Professional Stats */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Professional Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">{member.experience_years}</span>
                </div>
                <p className="text-sm font-medium text-gray-600">Years Experience</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">{member.skillful_languages.length}</span>
                </div>
                <p className="text-sm font-medium text-gray-600">Languages</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-green-600">{member.services.length}</span>
                </div>
                <p className="text-sm font-medium text-gray-600">Services</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-purple-600">{member.education.length}</span>
                </div>
                <p className="text-sm font-medium text-gray-600">Education</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
