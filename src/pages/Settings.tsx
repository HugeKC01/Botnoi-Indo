
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';

const themes = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [category, setCategory] = React.useState<'appearance' | 'website' | 'account'>('appearance');

  const handleThemeChange = (value: string) => {
    setTheme(value as 'light' | 'dark' | 'system');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as 'en' | 'id');
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-foreground">{t('settings') || 'Settings'}</h1>
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 min-w-[180px] border-r border-border/30 pr-6 bg-sidebar-background text-sidebar-foreground">
            <nav className="flex flex-col gap-2">
              <Button
                variant={category === 'appearance' ? 'accent' : 'ghost'}
                className="justify-start"
                onClick={() => setCategory('appearance')}
              >
                {t('appearance') || 'Appearance'}
              </Button>
            </nav>
          </aside>
          {/* Main Content */}
          <main className="flex-1">
            {category === 'appearance' && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('appearance') || 'Appearance'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('theme') || 'Theme'}</label>
                    <div className="flex gap-4">
                      {themes.map((th) => (
                        <Button
                          key={th.value}
                          variant={theme === th.value ? 'accent' : 'outline'}
                          onClick={() => handleThemeChange(th.value)}
                        >
                          {th.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('language') || 'Language'}</label>
                    <select
                      value={language}
                      onChange={handleLanguageChange}
                      className="border rounded px-3 py-2 bg-card text-foreground focus:ring-2 focus:ring-accent"
                    >
                      <option value="en" className="bg-card text-foreground">English</option>
                      <option value="id" className="bg-card text-foreground">Bahasa Indonesia</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}
            {category === 'website' && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('websiteOptions') || 'Website Options'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('comingSoon') || 'More options coming soon...'}</label>
                  </div>
                </CardContent>
              </Card>
            )}
            {category === 'account' && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('accountSettings') || 'Account Settings'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('comingSoon') || 'Account options coming soon...'}</label>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Settings;
