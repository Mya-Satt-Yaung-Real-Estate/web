import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

interface MobileRouteGuardProps {
  children: React.ReactNode;
}

export function MobileRouteGuard({ children }: MobileRouteGuardProps) {
  const [isValid, setIsValid] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const validateAccess = () => {
      const token = searchParams.get('token');
      const expectedToken = import.meta.env.VITE_MOBILE_APP_TOKEN;

      // Only check token - no other conditions
      if (token && token === expectedToken) {
        setIsValid(true);
        setIsChecking(false);
        return;
      }

      // If token is missing or doesn't match, deny access
      toast.error('This page is only accessible from the mobile app');
      navigate('/', { replace: true });
    };

    validateAccess();
  }, [searchParams, navigate]);

  if (isChecking) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return null;
  }

  return <>{children}</>;
}

