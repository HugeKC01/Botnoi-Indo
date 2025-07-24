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
  // Settings page specific
  appearance: { en: 'Appearance', id: 'Tampilan' },
  websiteOptions: { en: 'Website Options', id: 'Opsi Website' },
  accountSettings: { en: 'Account Settings', id: 'Pengaturan Akun' },
  theme: { en: 'Theme', id: 'Tema' },
  comingSoon: { en: 'More options coming soon...', id: 'Opsi lain segera hadir...' },
  // Profile page specific
  information: { en: 'Information', id: 'Informasi' },
  yourAccountDetails: { en: 'Your account details', id: 'Detail akun Anda' },
  noNameProvided: { en: 'No name provided', id: 'Tidak ada nama' },
  emailVerified: { en: 'Email Verified', id: 'Email Terverifikasi' },
  username: { en: 'Username', id: 'Nama Pengguna' },
  userId: { en: 'User ID', id: 'ID Pengguna' },
  credits: { en: 'Credits', id: 'Kredit' },
  subscription: { en: 'Subscription', id: 'Langganan' },
  monthlyPoint: { en: 'Monthly Point', id: 'Poin Bulanan' },
  subscriptionExpiry: { en: 'Subscription Expiry', id: 'Berakhir Langganan' },
  accountStats: { en: 'Account Stats', id: 'Statistik Akun' },
  loginProvider: { en: 'Login Provider', id: 'Penyedia Login' },
  lastSignIn: { en: 'Last Sign In', id: 'Terakhir Masuk' },
  recentActivity: { en: 'Recent Activity', id: 'Aktivitas Terbaru' },
  noRecentActivity: { en: 'No recent activity to show.', id: 'Tidak ada aktivitas terbaru.' },
  home: { en: 'Home', id: 'Beranda' },
  login: { en: 'Login', id: 'Masuk' },
  register: { en: 'Register', id: 'Daftar' },
  logout: { en: 'Logout', id: 'Keluar' },
  profile: { en: 'Profile', id: 'Profil' },
  settings: { en: 'Settings', id: 'Pengaturan' },
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
  pleaseEnterApiKey: { en: 'Please enter your API key', id: 'Silakan masukkan kunci API Anda' },
  // Newly added/refined TTS form text
  ttsTitle: { en: 'Indonesian Text-to-Speech', id: 'Teks ke Suara Bahasa Indonesia' },
  ttsDescription: {
    en: 'Instantly turn your Indonesian text into clear, natural-sounding speech. Enter your text, adjust the voice, and download your audio in seconds.',
    id: 'Ubah teks Bahasa Indonesia Anda menjadi suara jernih dan alami secara instan. Masukkan teks, atur suara, dan unduh audio Anda dalam hitungan detik.'
  },
  apiKeySection: { en: 'API Key', id: 'Kunci API' },
  apiKeyHint: { en: 'Get your API key from your Botnoi account dashboard.', id: 'Dapatkan kunci API Anda dari dasbor akun Botnoi.' },
  textSection: { en: 'Text to Convert', id: 'Teks untuk Dikonversi' },
  textLabel: { en: 'Text', id: 'Teks' },
  textPlaceholder: { en: 'Type or paste Indonesian text here...', id: 'Ketik atau tempel teks Bahasa Indonesia di sini...' },
  textHint: { en: 'Enter the Indonesian text you want to convert. For best results, use clear and complete sentences.', id: 'Masukkan teks Bahasa Indonesia yang ingin Anda konversi. Untuk hasil terbaik, gunakan kalimat yang jelas dan lengkap.' },
  characters: { en: 'characters', id: 'karakter' },
  voiceSection: { en: 'Voice Settings', id: 'Pengaturan Suara' },
  voiceId: { en: 'Voice ID', id: 'ID Suara' },
  voiceIdHint: { en: 'Choose a different number for a different voice style.', id: 'Pilih angka berbeda untuk gaya suara yang berbeda.' },
  audioFormat: { en: 'Audio Format', id: 'Format Audio' },
  actions: { en: 'Actions', id: 'Aksi' },
  generateAudio: { en: 'Generate Audio', id: 'Buat Audio' },
audioPreview: { en: 'Generated Audio', id: 'Audio yang Dihasilkan' },
  audioReady: { en: 'Your audio is ready! Listen or download below.', id: 'Audio Anda siap! Dengarkan atau unduh di bawah.' },
  tips: { en: 'Tips for Best Results', id: 'Tips untuk Hasil Terbaik' },
  tip1: { en: 'Keep sentences short and clear for better pronunciation.', id: 'Gunakan kalimat singkat dan jelas untuk pelafalan yang lebih baik.' },
  tip2: { en: 'Adjust speed and volume to suit your needs.', id: 'Atur kecepatan dan volume sesuai kebutuhan Anda.' },
  tip3: { en: 'Try different Voice IDs for a variety of voices.', id: 'Coba ID Suara yang berbeda untuk variasi suara.' },
  
  // Authentication translations
  email: { en: 'Email', id: 'Email' },
  password: { en: 'Password', id: 'Kata Sandi' },
  confirmPassword: { en: 'Confirm Password', id: 'Konfirmasi Kata Sandi' },
  forgotPassword: { en: 'Forgot Password?', id: 'Lupa Kata Sandi?' },
  signInWithGoogle: { en: 'Sign in with Google', id: 'Masuk dengan Google' },
  signUpWithGoogle: { en: 'Sign up with Google', id: 'Daftar dengan Google' },
  noAccount: { en: "Don't have an account?", id: 'Tidak punya akun?' },
  haveAccount: { en: 'Already have an account?', id: 'Sudah punya akun?' },
  signInHere: { en: 'Sign in here', id: 'Masuk di sini' },
  signUpHere: { en: 'Sign up here', id: 'Daftar di sini' },
  welcomeBack: { en: 'Welcome back', id: 'Selamat datang kembali' },
  signInToContinue: { en: 'Sign in to your account to continue.', id: 'Masuk ke akun Anda untuk melanjutkan.' },
  createAccount: { en: 'Create an account', id: 'Buat akun' },
  signUpToContinue: { en: 'Sign up to get started with our services.', id: 'Daftar untuk memulai dengan layanan kami.' },
  signingIn: { en: 'Signing in...', id: 'Sedang masuk...' },
  signingUp: { en: 'Signing up...', id: 'Sedang mendaftar...' },
  or: { en: 'or', id: 'atau' },
  
  // Error messages
  passwordsDontMatch: { en: "Passwords don't match", id: 'Kata sandi tidak cocok' },
  loginError: { en: 'Failed to sign in. Please try again.', id: 'Gagal masuk. Silakan coba lagi.' },
  registerError: { en: 'Failed to create account. Please try again.', id: 'Gagal membuat akun. Silakan coba lagi.' },
  
  // Success messages
  loginSuccess: { en: 'Welcome back!', id: 'Selamat datang kembali!' },
  registerSuccess: { en: 'Account created successfully!', id: 'Akun berhasil dibuat!' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('id');

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