/**
 * Point Management Page
 * 
 * Main page for managing user points, packages, and transactions.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { BalanceCard, PackageList, TransactionList } from './components';

export function PointManagement() {
  const { user, isAuthenticated } = useAuthStore();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const seo = seoUtils.getPageSEO('point-management');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/signin');
    }
  }, [isAuthenticated, user, navigate]);

  if (!user || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <SEOHead seo={seo} path="/point-management" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {t('points.title') || 'Point Management'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('points.subtitle') || 'Manage your points, view packages, and track transactions'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back') || 'Back'}
              </Button>
            </div>
          </div>

          {/* Balance Card Section */}
          <div className="mb-8">
            <BalanceCard />
          </div>

          {/* Package List Section */}
          <div className="mb-8">
            <PackageList />
          </div>

          {/* Transaction List Section */}
          <div className="mb-8">
            <TransactionList />
          </div>
        </div>
      </div>
    </>
  );
}

