import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { LoginDialog } from './LoginDialog';
import { RegisterDialog } from './RegisterDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Globe, User, Settings, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: language === 'en' ? "Logged out" : "Keluar",
        description: language === 'en' ? "You have been logged out successfully." : "Anda telah berhasil keluar.",
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

  const isHomePage = location.pathname === '/';

  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border/50 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-background"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Botnoi Indonesia
              </span>
              <div className="text-xs text-muted-foreground font-medium">
                {t('aiVoiceTechnology') || 'AI Voice Technology'}
              </div>
            </div>
          </Link>
          <nav className="hidden md:block">
            <Button 
              variant="ghost" 
              className="text-foreground/80 bg-accent text-white cursor-default pointer-events-none"
            >
              {t('home')}
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={language} onValueChange={(value: 'en' | 'id') => setLanguage(value)}>
            <SelectTrigger className="w-32 border-border/50 hover:border-accent/50 transition-colors">
              <Globe className="w-4 h-4 mr-2 text-accent" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t('english')}</SelectItem>
              <SelectItem value="id">{t('indonesian')}</SelectItem>
            </SelectContent>
          </Select>
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || 'User'} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(currentUser.displayName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {currentUser.displayName && (
                      <p className="font-medium">{currentUser.displayName}</p>
                    )}
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>{language === 'en' ? 'Dashboard' : 'Dasbor'}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>{language === 'en' ? 'Profile' : 'Profil'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{language === 'en' ? 'Settings' : 'Pengaturan'}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{language === 'en' ? 'Log out' : 'Keluar'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline"
                onClick={() => setLoginOpen(true)}
              >
                <LogIn className="w-4 h-4" />
                <span>{t('login')}</span>
              </Button>
            </div>
          )}
          <LoginDialog 
            open={loginOpen} 
            onOpenChange={setLoginOpen} 
            onRegisterClick={() => {
              setLoginOpen(false);
              setRegisterOpen(true);
            }}
          />
          <RegisterDialog 
            open={registerOpen} 
            onOpenChange={setRegisterOpen}
            onLoginClick={() => {
              setRegisterOpen(false);
              setLoginOpen(true);
            }}
          />
        </div>
      </div>
    </header>
  );
};