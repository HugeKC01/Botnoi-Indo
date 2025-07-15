import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { LogIn, Globe, Sparkles } from 'lucide-react';

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border/50 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
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
          </div>
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
          
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 border-accent/20 text-accent hover:bg-accent hover:text-white hover:border-accent/40 transition-all duration-200"
          >
            <LogIn className="w-4 h-4" />
            <span>{t('login')}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};