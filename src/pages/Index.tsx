import { LanguageProvider } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { TTSForm } from '@/components/TTSForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Shield } from 'lucide-react';

const Index = () => {
  const { currentUser } = useAuth();

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          {!currentUser && (
            <div className="container mx-auto px-4 mb-8">
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Shield className="h-5 w-5" />
                    Authentication System
                  </CardTitle>
                  <CardDescription>
                    Sign in to access your personalized dashboard and features
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="flex items-center gap-2">
                    <Link to="/login">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex items-center gap-2">
                    <Link to="/signup">
                      <UserPlus className="h-4 w-4" />
                      Create Account
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
          <TTSForm />
        </main>
      </div>
    </LanguageProvider>
  );
};

export default Index;
