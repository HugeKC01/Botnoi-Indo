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
import { LogIn, Globe, User, Settings, LogOut, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, logout, botnoiProfile } = useAuth();
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
    <header className="w-full backdrop-blur-sm border-b border-border/50 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8 w-full">
          {/* Desktop logo */}
          <a href="https://voice.botnoi.ai" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center space-x-3">
            <img
              src="https://voice.botnoi.ai/assets/icons/navbar-v2/botnoi_voice-logo4.svg"
              alt="Botnoi Voice Logo"
              width={120}
              height={36}
              style={{ display: 'block' }}
            />
          </a>
          {/* Mobile logo aligned left */}
          <a href="https://voice.botnoi.ai" target="_blank" rel="noopener noreferrer" className="flex md:hidden items-center mr-auto" style={{marginLeft: 0, paddingLeft: 0}}>
            <img
              src="https://voice.botnoi.ai/assets/icons/navbar-v2/logo_mobile2.webp"
              alt="Botnoi Voice Mobile Logo"
              width={40}
              height={40}
              style={{ display: 'block' }}
            />
          </a>
          <nav className="hidden md:block">
            <Button
              variant={isHomePage ? 'default' : 'ghost'}
              className={
                isHomePage
                  ? 'bg-accent cursor-default pointer-events-none'
                  : 'text-foreground/80 bg-transparent hover:bg-accent'
              }
              onClick={() => {
                if (!isHomePage) navigate('/');
              }}
            >
              {t('home')}
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Show credits if logged in and botnoiProfile is available */}
          {currentUser && botnoiProfile && (
            <div className="hidden md:flex items-center h-10 px-4 rounded-md bg-accent/10 border border-accent/30 text-accent text-sm font-medium mr-2 select-none" style={{minWidth:'0'}}>
              <Sparkles className="w-4 h-4 mr-1 text-accent flex-shrink-0" />
              <span className="whitespace-nowrap">{t('credits')}:</span>&nbsp;
              <span className="whitespace-nowrap font-mono">{botnoiProfile?.credits ?? '-'}</span>
            </div>
          )}
          <Select value={language} onValueChange={(value: 'en' | 'id') => setLanguage(value)}>
            <SelectTrigger className="w-32 border-border/50 hover:border-accent/50 hover:text-accent transition-colors">
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
                    <AvatarImage src={botnoiProfile?.photoURL || currentUser.photoURL || undefined} alt={botnoiProfile?.username || currentUser.displayName || 'User'} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(botnoiProfile?.username || currentUser.displayName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{botnoiProfile?.username || currentUser.displayName}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {botnoiProfile?.email || currentUser.email}
                    </p>
                    {botnoiProfile?.uid && (
                      <p className="w-[200px] truncate text-xs text-muted-foreground font-mono">uid: {botnoiProfile.uid}</p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>{language === 'en' ? 'Profile' : 'Profil'}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{language === 'en' ? 'Settings' : 'Pengaturan'}</span>
                  </Link>
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