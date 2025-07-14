import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Globe, User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <header className="w-full bg-background border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-bold text-foreground">V4ICE</span>
          </Link>
          <nav>
            <Button variant="ghost" className="text-foreground hover:text-primary" asChild>
              <Link to="/">{t('home')}</Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={language} onValueChange={(value: 'en' | 'id') => setLanguage(value)}>
            <SelectTrigger className="w-32">
              <Globe className="w-4 h-4 mr-2" />
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
                    <AvatarImage src={currentUser.photoURL || ''} alt={currentUser.displayName || ''} />
                    <AvatarFallback>{getInitials(currentUser.displayName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{currentUser.displayName || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" className="flex items-center space-x-2" asChild>
              <Link to="/login">
                <LogIn className="w-4 h-4" />
                <span>{t('login')}</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};