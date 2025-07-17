import { LanguageProvider } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { TTSForm } from '@/components/TTSForm';

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <TTSForm />
          </div>
        </main>
      </div>
    </LanguageProvider>
  );
};

export default Index;
