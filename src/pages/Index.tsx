import { LanguageProvider } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { TTSForm } from '@/components/TTSForm';

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <TTSForm />
        </main>
      </div>
    </LanguageProvider>
  );
};

export default Index;
