import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

interface Translations {
  [key: string]: {
    en: string;
    id: string;
  };
}

const translations: Translations = {
  home: { en: 'Home', id: 'Beranda' },
  login: { en: 'Login', id: 'Masuk' },
  apiKey: { en: 'Botnoi API Key', id: 'Kunci API Botnoi' },
  show: { en: 'Show', id: 'Tampilkan' },
  hide: { en: 'Hide', id: 'Sembunyikan' },
  enterApiKey: { en: 'Enter your API Key', id: 'Masukkan Kunci API Anda' },
  signInToRetrieve: { en: 'Sign in to automatically retrieve your API key, or enter it manually.', id: 'Masuk untuk mengambil kunci API secara otomatis, atau masukkan secara manual.' },
  textToConvert: { en: 'Text to Convert', id: 'Teks untuk Dikonversi' },
  enterText: { en: 'Enter the text you want to convert to speech', id: 'Masukkan teks yang ingin Anda konversi menjadi suara' },
  speakerId: { en: 'Speaker ID', id: 'ID Pembicara' },
  differentSpeakers: { en: 'Different speakers have different voice characteristics.', id: 'Pembicara yang berbeda memiliki karakteristik suara yang berbeda.' },
  language: { en: 'Language', id: 'Bahasa' },
  volume: { en: 'Volume', id: 'Volume' },
  speed: { en: 'Speed', id: 'Kecepatan' },
  mediaFormat: { en: 'Media Format', id: 'Format Media' },
  convertToSpeech: { en: 'Convert to Speech', id: 'Konversi ke Suara' },
  regenerate: { en: 'Regenerate', id: 'Regenerasi' },
  download: { en: 'Download', id: 'Unduh' },
  processing: { en: 'Processing...', id: 'Memproses...' },
  indonesian: { en: 'Indonesian', id: 'Indonesia' },
  english: { en: 'English', id: 'Inggris' },
  errorOccurred: { en: 'An error occurred while generating speech', id: 'Terjadi kesalahan saat menghasilkan suara' },
  audioGenerated: { en: 'Audio generated successfully!', id: 'Audio berhasil dihasilkan!' },
  pleaseEnterText: { en: 'Please enter text to convert', id: 'Silakan masukkan teks untuk dikonversi' },
  pleaseEnterApiKey: { en: 'Please enter your API key', id: 'Silakan masukkan kunci API Anda' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};