import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { useModal } from '@/contexts/ModalContext';
import { useChangePassword } from '@/hooks/mutations/useChangePassword';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Bell, Globe, Lock, Shield, Save, Eye, EyeOff } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';

export function Settings() {
  const { user, isAuthenticated } = useAuthStore();
  const { t, language, setLanguage } = useLanguage();
  const { showSuccess, showError } = useModal();
  const navigate = useNavigate();
  const seo = seoUtils.getPageSEO('settings');
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    propertyAlerts: true,
    appointmentReminders: true,
    marketingEmails: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/signin');
    }
  }, [isAuthenticated, user, navigate]);

  // Sync notification permission status with state on mount
  useEffect(() => {
    if ('Notification' in window) {
      const permission = Notification.permission;
      // If permission is granted, keep the toggle state as is
      // If denied or default, set pushNotifications to false
      if (permission === 'denied' || permission === 'default') {
        setNotificationSettings(prev => ({
          ...prev,
          pushNotifications: false,
        }));
      }
    } else {
      // Browser doesn't support notifications
      setNotificationSettings(prev => ({
        ...prev,
        pushNotifications: false,
      }));
    }
  }, []);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleMasterNotificationToggle = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    showSuccess(
      newValue 
        ? t('settings.saved') 
        : t('settings.saved')
    );
  };

  const handleNotificationToggle = async (key: keyof typeof notificationSettings) => {
    // Special handling for push notifications - request browser permission
    if (key === 'pushNotifications') {
      const newValue = !notificationSettings.pushNotifications;
      
      if (newValue) {
        // User wants to enable push notifications - request browser permission
        if (!('Notification' in window)) {
          showError(t('settings.notificationsNotSupported') || 'Browser does not support notifications');
          return;
        }

        const permission = Notification.permission;
        
        if (permission === 'granted') {
          // Permission already granted, just update state
          setNotificationSettings(prev => ({
            ...prev,
            [key]: true,
          }));
          showSuccess(t('settings.pushNotificationsEnabled') || 'Push notifications enabled');
        } else if (permission === 'denied') {
          // Permission was denied, can't request again
          showError(t('settings.notificationsDenied') || 'Notifications are blocked. Please enable them in your browser settings.');
          return;
        } else {
          // Permission is 'default' - request permission
          try {
            const result = await Notification.requestPermission();
            if (result === 'granted') {
              setNotificationSettings(prev => ({
                ...prev,
                [key]: true,
              }));
              showSuccess(t('settings.pushNotificationsEnabled') || 'Push notifications enabled');
            } else {
              showError(t('settings.notificationsDenied') || 'Notifications permission denied');
            }
          } catch (error) {
            console.error('Error requesting notification permission:', error);
            showError(t('settings.notificationError') || 'Failed to request notification permission');
          }
        }
      } else {
        // User wants to disable push notifications
        setNotificationSettings(prev => ({
          ...prev,
          [key]: false,
        }));
        showSuccess(t('settings.pushNotificationsDisabled') || 'Push notifications disabled');
      }
    } else {
      // For other notification types, just toggle the state
      setNotificationSettings(prev => ({
        ...prev,
        [key]: !prev[key],
      }));
      showSuccess(t('settings.saved'));
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as 'en' | 'mm');
    showSuccess(t('settings.languageChanged'));
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError(t('settings.passwordMismatch'));
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError(t('settings.passwordTooShort'));
      return;
    }

    changePassword(
      {
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword,
      },
      {
        onSuccess: (response) => {
          showSuccess(response.message || t('settings.passwordChanged'));
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || 
                              error?.message || 
                              t('settings.passwordChanged') + ' failed';
          showError(errorMessage);
        },
      }
    );
  };

  return (
    <>
      <SEOHead seo={seo} path="/settings" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
           {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {t('settings.title')}
              </h1>
              <p className="text-muted-foreground mt-2">{t('editProfile.subtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back') || 'Back'}
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Notifications - Hidden */}
            {false && (
            <Card className="backdrop-blur-sm bg-background/95">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <CardTitle>{t('settings.notifications')}</CardTitle>
                </div>
                <CardDescription>{t('settings.notificationsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Master Notification Toggle */}
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="space-y-0.5">
                    <Label className="text-primary">All Notifications</Label>
                    <p className="text-sm text-muted-foreground">Enable or disable all notifications</p>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={handleMasterNotificationToggle}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('settings.emailNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">{t('settings.emailNotificationsDesc')}</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                    disabled={!notificationsEnabled}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('settings.pushNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">{t('settings.pushNotificationsDesc')}</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={() => handleNotificationToggle('pushNotifications')}
                    disabled={!notificationsEnabled}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('settings.propertyAlerts')}</Label>
                    <p className="text-sm text-muted-foreground">{t('settings.propertyAlertsDesc')}</p>
                  </div>
                  <Switch
                    checked={notificationSettings.propertyAlerts}
                    onCheckedChange={() => handleNotificationToggle('propertyAlerts')}
                    disabled={!notificationsEnabled}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('settings.appointmentReminders')}</Label>
                    <p className="text-sm text-muted-foreground">{t('settings.appointmentRemindersDesc')}</p>
                  </div>
                  <Switch
                    checked={notificationSettings.appointmentReminders}
                    onCheckedChange={() => handleNotificationToggle('appointmentReminders')}
                    disabled={!notificationsEnabled}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('settings.marketingEmails')}</Label>
                    <p className="text-sm text-muted-foreground">{t('settings.marketingEmailsDesc')}</p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={() => handleNotificationToggle('marketingEmails')}
                    disabled={!notificationsEnabled}
                  />
                </div>
              </CardContent>
            </Card>
            )}

            {/* General Settings - Combined Card */}
            <Card className="backdrop-blur-sm bg-background/95 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">General Settings</CardTitle>
                <CardDescription>Manage your language and notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Language */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <Label className="text-base font-semibold">{t('settings.language')}</Label>
                  </div>
                  <div className="pl-7">
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="max-w-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">
                          <div className="flex items-center gap-2">
                            <span>🇬🇧</span>
                            <span>{t('language.english')}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="mm">
                          <div className="flex items-center gap-2">
                            <span>🇲🇲</span>
                            <span>{t('language.myanmar')}</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-2">{t('settings.languageDesc')}</p>
                  </div>
                </div>

                <Separator />

                {/* Notifications */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <Label className="text-base font-semibold">{t('settings.notifications')}</Label>
                  </div>
                  <div className="pl-7">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{t('settings.pushNotifications')}</Label>
                        <p className="text-sm text-muted-foreground">{t('settings.pushNotificationsDesc')}</p>
                      </div>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={() => handleNotificationToggle('pushNotifications')}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Change Password Settings */}
            <Card className="backdrop-blur-sm bg-background/95 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{t('settings.changePassword')}</CardTitle>
                </div>
                <CardDescription>{t('settings.changePasswordDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">{t('settings.currentPassword')}</Label>
                    <div className="relative mt-2">
                      <Input
                        id="current-password"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="new-password">{t('settings.newPassword')}</Label>
                    <div className="relative mt-2">
                      <Input
                        id="new-password"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">{t('settings.confirmPassword')}</Label>
                    <div className="relative mt-2">
                      <Input
                        id="confirm-password"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="gradient-primary mt-4"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {t('common.loading') || 'Updating...'}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {t('settings.updatePassword')}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="backdrop-blur-sm bg-background/95 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{t('settings.privacySecurity')}</CardTitle>
                </div>
                <CardDescription>{t('settings.privacySecurityDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Link to="/privacy-policy">
                  <Button variant="outline" className="w-full justify-start">
                    {t('footer.privacy')}
                  </Button>
                </Link>
                <Link to="/terms-of-service">
                  <Button variant="outline" className="w-full justify-start">
                    {t('footer.terms')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

