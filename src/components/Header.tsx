import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { LogIn, Globe } from 'lucide-react';

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="w-full bg-background border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-bold text-foreground">V4ICE</span>
          </div>
          <nav>
            <Button variant="ghost" className="text-foreground hover:text-primary">
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
          
          <Button variant="outline" className="flex items-center space-x-2">
            <LogIn className="w-4 h-4" />
            <span>{t('login')}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};