import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User, Mail, Calendar } from 'lucide-react';
import { Header } from '@/components/Header';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  console.log('Profile currentUser:', currentUser);
  const navigate = useNavigate();
  const { toast } = useToast();

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
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-1">Welcome back, {currentUser?.displayName || 'User'}!</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your account details</CardDescription>
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
                      {currentUser?.displayName || 'No name provided'}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {currentUser?.email}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4" />
                      Joined {currentUser?.metadata.creationTime && formatDate(currentUser.metadata.creationTime)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Verified</p>
                    <p className={`text-sm ${currentUser?.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                      {currentUser?.emailVerified ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Username</p>
                    <p className="text-sm text-gray-600 font-mono truncate">
                      {currentUser?.displayName || 'No username'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">User ID</p>
                    <p className="text-sm text-gray-600 font-mono truncate">
                      {currentUser?.uid ? `uid: ${currentUser.uid}` : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  Edit Profile
                </Button>
                <Button className="w-full" variant="outline">
                  Change Password
                </Button>
                <Button className="w-full" variant="outline">
                  Security Settings
                </Button>
                <Button className="w-full" variant="outline">
                  Privacy Settings
                </Button>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Account Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Login Provider</span>
                    <span className="text-sm font-medium">
                      {currentUser?.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Sign In</span>
                    <span className="text-sm font-medium">
                      {currentUser?.metadata.lastSignInTime && formatDate(currentUser.metadata.lastSignInTime)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">No recent activity to show.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
