import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Home, Bed, Bath, Square, Phone, Mail, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';

// Mock data for UI demonstration
const mockWantingList = {
  id: 1,
  title: 'Looking for 3 Bedroom House in Yangon',
  wanted_type: 'buyer',
  property_type: 'House',
  location: 'Yangon, Bahan',
  budget: '50M - 80M MMK',
  bedrooms: 3,
  bathrooms: 2,
  area: '1,200 - 2,000 sqft',
  description: 'I am looking for a spacious 3-bedroom house in Yangon with good security and modern amenities. The house should have a garden space and be located in a quiet neighborhood. Prefer areas near schools and hospitals.',
  additional_requirement: 'Must have parking space, security guard, and be pet-friendly. Prefer houses with natural lighting and good ventilation.',
  status: {
    verification_status: 'approved',
    status: 'published',
    is_expired: false,
    is_published: true,
  },
  created_at: '2025-01-28',
  responses: 5,
  contact: {
    name: 'John Doe',
    phone: '09123456789',
    email: 'john.doe@example.com'
  }
};

export default function WantingListDetail() {
  const { id } = useParams();
  const seo = seoUtils.getPageSEO('myWantedList');

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this wanted listing?')) {
      console.log('Delete listing:', id);
    }
  };

  const handleToggleStatus = () => {
    console.log('Toggle status for listing:', id);
  };

  const getVerificationStatusColor = (verificationStatus: string, isExpired: boolean) => {
    if (isExpired) return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    if (verificationStatus === 'approved') return 'bg-green-500/10 text-green-600 border-green-500/20';
    if (verificationStatus === 'pending') return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    if (verificationStatus === 'rejected') return 'bg-red-500/10 text-red-600 border-red-500/20';
    return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
  };

  const getVerificationStatusLabel = (verificationStatus: string, isExpired: boolean) => {
    if (isExpired) return 'Expired';
    if (verificationStatus === 'approved') return 'Approved';
    if (verificationStatus === 'pending') return 'Pending';
    if (verificationStatus === 'rejected') return 'Rejected';
    return verificationStatus;
  };

  return (
    <>
      <SEOHead seo={seo} path={`/my-wanted-listings/detail/${id}`} />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {mockWantingList.title}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge 
                  variant="outline" 
                  className={mockWantingList.wanted_type === 'buyer' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-purple-500/10 text-purple-600 border-purple-500/20'}
                >
                  {mockWantingList.wanted_type === 'buyer' ? 'Buyer' : 'Renter'}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={getVerificationStatusColor(mockWantingList.status.verification_status, mockWantingList.status.is_expired)}
                >
                  {getVerificationStatusLabel(mockWantingList.status.verification_status, mockWantingList.status.is_expired)}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/my-wanted-listings/edit/${id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleStatus}>
                  {mockWantingList.status.is_published ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Publish
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {mockWantingList.description}
                  </p>
                </CardContent>
              </Card>

              {/* Additional Requirements */}
              {mockWantingList.additional_requirement && (
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle>Additional Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {mockWantingList.additional_requirement}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Property Details */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Property Type:</span>
                        <span className="text-sm text-muted-foreground">{mockWantingList.property_type}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Location:</span>
                        <span className="text-sm text-muted-foreground">{mockWantingList.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Budget:</span>
                        <span className="text-sm text-muted-foreground">{mockWantingList.budget}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {mockWantingList.bedrooms && (
                        <div className="flex items-center gap-2">
                          <Bed className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Bedrooms:</span>
                          <span className="text-sm text-muted-foreground">{mockWantingList.bedrooms}</span>
                        </div>
                      )}
                      
                      {mockWantingList.bathrooms && (
                        <div className="flex items-center gap-2">
                          <Bath className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Bathrooms:</span>
                          <span className="text-sm text-muted-foreground">{mockWantingList.bathrooms}</span>
                        </div>
                      )}
                      
                      {mockWantingList.area && (
                        <div className="flex items-center gap-2">
                          <Square className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Area:</span>
                          <span className="text-sm text-muted-foreground">{mockWantingList.area}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm text-muted-foreground">{mockWantingList.contact.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{mockWantingList.contact.phone}</span>
                  </div>
                  
                  {mockWantingList.contact.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{mockWantingList.contact.email}</span>
                    </div>
                  )}
                  
                  <Button className="w-full gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Now
                  </Button>
                </CardContent>
              </Card>

              {/* Listing Info */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Listing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Posted:</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(mockWantingList.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Responses:</span>
                    <span className="text-sm text-muted-foreground">{mockWantingList.responses}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge 
                      variant="outline" 
                      className={getVerificationStatusColor(mockWantingList.status.verification_status, mockWantingList.status.is_expired)}
                    >
                      {getVerificationStatusLabel(mockWantingList.status.verification_status, mockWantingList.status.is_expired)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
