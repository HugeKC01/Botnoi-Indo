import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { LoginDialog } from './LoginDialog';
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

  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <header className="w-full bg-background border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-foreground">Botnoi Indonesia</span>
          </div>
          <nav>
            <Button variant="ghost">
              {t('home')}
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
          
          <Button variant="outline" className="flex items-center space-x-2" onClick={() => setLoginOpen(true)}>
            <LogIn className="w-4 h-4" />
            <span>{t('login')}</span>
          </Button>
          <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
        </div>
      </div>
    </header>
  );
};