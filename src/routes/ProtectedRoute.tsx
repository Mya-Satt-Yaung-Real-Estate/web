import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { type ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Lock, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
  memberLevels?: string[];
  guestAllowed?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  roles = [], 
  memberLevels = [], 
  guestAllowed = false,
  redirectTo 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    if (guestAllowed) {
      return <>{children}</>;
    }
    
    // Redirect to signin page with return url
    const redirectPath = redirectTo || '/signin';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check if user has required roles
  if (roles.length > 0 && user && !roles.includes(user.user_type)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page. This page is restricted to {roles.join(', ')} users.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user has required member level
  if (memberLevels.length > 0 && user && !memberLevels.includes(user.member_level)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <Lock className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-xl">Upgrade Required</CardTitle>
            <CardDescription>
              This feature requires a {memberLevels.join(' or ')} membership level. 
              Your current level: <strong>{user.member_level}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button 
              onClick={() => window.location.href = '/settings'}
              className="w-full"
            >
              Upgrade Membership
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

