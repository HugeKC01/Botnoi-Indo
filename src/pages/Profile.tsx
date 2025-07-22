import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User, Mail, Calendar } from 'lucide-react';
import { Header } from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  // Store Botnoi token and profile in state
  const { t } = useLanguage();
  const [botnoiToken, setBotnoiToken] = React.useState<string | null>(null);
  const [botnoiProfile, setBotnoiProfile] = React.useState<any | null>(null);

  // Fetch Botnoi Token using Firebase JWT Token
  const getBotnoiToken = async () => {
    if (!currentUser) return;
    try {
      const firebaseToken = await currentUser.getIdToken();
      const res = await fetch('https://api-voice-staging.botnoi.ai/api/dashboard/firebase_auth', {
        method: 'GET',
        headers: {
          'botnoi-token': `Bearer ${firebaseToken}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch Botnoi token');
      const data = await res.json();
      if (data.data && data.data.token) {
        setBotnoiToken(data.data.token);
        toast({
          title: 'Botnoi Token',
          description: 'Token fetched and stored.',
        });
        return data.data.token;
      } else {
        setBotnoiToken(undefined);
        toast({
          title: 'Botnoi Token Error',
          description: 'No token returned from API. See console for details.',
          variant: 'destructive',
        });
        return undefined;
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
      return undefined;
    }
  };

  // Auto get Botnoi token and profile after login
  React.useEffect(() => {
    const fetchBotnoi = async () => {
      if (currentUser) {
        const token = await getBotnoiToken();
        if (token) {
          // fetch profile
          try {
            const res = await fetch('https://api-voice.botnoi.ai/api/dashboard/get_profile', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if (!res.ok) throw new Error('Failed to fetch Botnoi profile');
            const data = await res.json();
            setBotnoiProfile(data.data || null);
            toast({
              title: 'Botnoi Profile',
              description: 'Profile loaded.',
            });
          } catch (err) {
            toast({
              title: 'Error',
              description: err instanceof Error ? err.message : 'Unknown error',
              variant: 'destructive',
            });
          }
        }
      }
    };
    fetchBotnoi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Fetch Botnoi Profile using Botnoi JWT Token
  const getBotnoiProfile = async () => {
    if (!botnoiToken) {
      toast({
        title: 'Error',
        description: 'Please get the Botnoi Token first.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const res = await fetch('https://api-voice.botnoi.ai/api/dashboard/get_profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${botnoiToken}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch Botnoi profile');
      const data = await res.json();
      setBotnoiProfile(data.data || null);
      toast({
        title: 'Botnoi Profile',
        description: 'Profile loaded.',
      });
      console.log('Botnoi Profile:', data);
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      navigate('/login');
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
      <Header />
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('profile')}</h1>
              <p className="text-gray-600 mt-1">{t('welcomeBack')}, {botnoiProfile?.username || currentUser?.displayName || t('profile')}!</p>
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
                    <AvatarImage src={currentUser?.photoURL || ''} />
                    <AvatarFallback className="text-lg">
                      {getInitials(currentUser?.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {botnoiProfile?.username || currentUser?.displayName || t('noNameProvided') || 'No name provided'}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {botnoiProfile?.email || currentUser?.email || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4" />
                      Joined {currentUser?.metadata.creationTime && formatDate(currentUser.metadata.creationTime)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('emailVerified') || 'Email Verified'}</p>
                    <p className={`text-sm ${botnoiProfile ? (botnoiProfile.agreement ? 'text-green-600' : 'text-red-600') : (currentUser?.emailVerified ? 'text-green-600' : 'text-red-600')}`}>{botnoiProfile ? (botnoiProfile.agreement ? 'Yes' : 'No') : (currentUser?.emailVerified ? 'Yes' : 'No')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('username') || 'Username'}</p>
                    <p className="text-sm text-gray-600 font-mono truncate">{botnoiProfile?.username || currentUser?.displayName || 'No username'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('userId') || 'User ID'}</p>
                    <p className="text-sm text-gray-600 font-mono truncate">{botnoiProfile?.uid ? `uid: ${botnoiProfile.uid}` : (currentUser?.uid ? `uid: ${currentUser.uid}` : 'N/A')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('email')}</p>
                    <p className="text-sm text-gray-600 font-mono truncate">{botnoiProfile?.email || currentUser?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('credits') || 'Credits'}</p>
                    <p className="text-sm text-gray-600 font-mono truncate">{botnoiProfile?.credits ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('subscription') || 'Subscription'}</p>
                    <p className="text-sm text-gray-600 font-mono truncate">{botnoiProfile?.subscription ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('monthlyPoint') || 'Monthly Point'}</p>
                    <p className="text-sm text-gray-600 font-mono truncate">{botnoiProfile?.monthly_point ?? '-'}</p>
                  </div>
                  {botnoiProfile?.subscription && botnoiProfile.subscription !== 'Free' && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('subscriptionExpiry') || 'Subscription Expiry'}</p>
                      <p className="text-sm text-gray-600 font-mono truncate">{botnoiProfile.exp_subscription ?? '-'}</p>
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
                    <span className="text-sm text-gray-600">{t('loginProvider') || 'Login Provider'}</span>
                    <span className="text-sm font-medium">
                      {currentUser?.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('lastSignIn') || 'Last Sign In'}</span>
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
                <p className="text-sm text-gray-600">{t('noRecentActivity') || 'No recent activity to show.'}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
