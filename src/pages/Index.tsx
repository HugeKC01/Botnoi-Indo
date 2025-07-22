import { Header } from '@/components/Header';
import { TTSForm } from '@/components/TTSForm';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <TTSForm />
        </div>
      </main>
    </div>
  );
};

export default Index;
