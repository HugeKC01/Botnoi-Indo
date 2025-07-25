import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User, Mail, Calendar, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';

const Profile = () => {
  const { currentUser, logout, botnoiToken, botnoiProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  // Store Botnoi token and profile in state
  const { t } = useLanguage();
  // ...existing code...

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className="relative min-h-screen bg-background text-foreground">
        <Header />
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 bg-card rounded-lg p-6 shadow-sm">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('profile')}</h1>
              <p className="text-muted-foreground mt-1">{t('welcomeBack')}, {botnoiProfile?.username || currentUser?.displayName || t('profile')}!</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              {t('logout')}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Profile Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t('profile')} {t('information') || 'Information'}
                </CardTitle>
                <CardDescription>{t('yourAccountDetails') || 'Your account details'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={botnoiProfile?.photoURL || currentUser?.photoURL || ''} />
                    <AvatarFallback className="text-lg">
                      {getInitials(botnoiProfile?.username || currentUser?.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {botnoiProfile?.username || currentUser?.displayName || t('noNameProvided') || 'No name provided'}
                    </h3>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {botnoiProfile?.email || currentUser?.email || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4" />
                      Joined {currentUser?.metadata.creationTime && formatDate(currentUser.metadata.creationTime)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {t('emailVerified') || 'Email Verified'}
                    </p>
                    <p className={`text-sm ${botnoiProfile ? (botnoiProfile.agreement ? 'text-green-600' : 'text-red-600') : (currentUser?.emailVerified ? 'text-green-600' : 'text-red-600')} text-foreground`}>{botnoiProfile ? (botnoiProfile.agreement ? 'Yes' : 'No') : (currentUser?.emailVerified ? 'Yes' : 'No')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {t('username') || 'Username'}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono truncate">{botnoiProfile?.username || currentUser?.displayName || 'No username'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {t('userId') || 'User ID'}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono truncate">{botnoiProfile?.uid ? `uid: ${botnoiProfile.uid}` : (currentUser?.uid ? `uid: ${currentUser.uid}` : 'N/A')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {t('email')}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono truncate">{botnoiProfile?.email || currentUser?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      {t('credits') || 'Credits'}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono truncate">{botnoiProfile?.credits ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {t('subscription') || 'Subscription'}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono truncate">{botnoiProfile?.subscription ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {t('monthlyPoint') || 'Monthly Point'}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono truncate">{botnoiProfile?.monthly_point ?? '-'}</p>
                  </div>
                  {botnoiProfile?.subscription && botnoiProfile.subscription !== 'Free' && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {t('subscriptionExpiry') || 'Subscription Expiry'}
                      </p>
                      <p className="text-sm text-muted-foreground font-mono truncate">{botnoiProfile.exp_subscription ?? '-'}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>



            {/* Stats Cards */}
            <Card>
              <CardHeader>
                <CardTitle>{t('accountStats') || 'Account Stats'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('loginProvider') || 'Login Provider'}</span>
                    <span className="text-sm font-medium">
                      {currentUser?.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('lastSignIn') || 'Last Sign In'}</span>
                    <span className="text-sm font-medium">
                      {currentUser?.metadata.lastSignInTime && formatDate(currentUser.metadata.lastSignInTime)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('recentActivity') || 'Recent Activity'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t('noRecentActivity') || 'No recent activity to show.'}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
