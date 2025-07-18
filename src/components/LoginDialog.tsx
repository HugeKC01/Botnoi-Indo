
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, Eye, EyeOff, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { SiLine } from 'react-icons/si';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegisterClick?: () => void;
}

export function LoginDialog({ open, onOpenChange, onRegisterClick }: LoginDialogProps) {
  const { t, language } = useLanguage();
  const { login, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMode, setLoginMode] = useState<'options' | 'email'>('options');
  const dialogText = {
    title: {
      en: 'Sign in to Botnoi Indonesia',
      id: 'Masuk ke Botnoi Indonesia',
    },
    choose: {
      en: 'Choose a login method below',
      id: 'Pilih metode masuk di bawah ini',
    },
    email: {
      en: 'Sign in with Email',
      id: 'Masuk dengan Email',
    },
    google: {
      en: 'Sign in with Google',
      id: 'Masuk dengan Google',
    },
    line: {
      en: 'Sign in with LINE',
      id: 'Masuk dengan LINE',
    },
    cancel: {
      en: 'Cancel',
      id: 'Batal',
    },
    emailLabel: {
      en: 'Email',
      id: 'Email',
    },
    passwordLabel: {
      en: 'Password',
      id: 'Kata Sandi',
    },
    signIn: {
      en: 'Sign In',
      id: 'Masuk',
    },
    signingIn: {
      en: 'Signing in...',
      id: 'Sedang masuk...',
    },
    backToOptions: {
      en: 'Back to options',
      id: 'Kembali ke pilihan',
    },
    noAccount: {
      en: "Don't have an account?",
      id: 'Belum punya akun?',
    },
    register: {
      en: 'Register',
      id: 'Daftar',
    },
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError(language === 'en' ? 'Please fill in all fields' : 'Mohon isi semua kolom');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(formData.email, formData.password);
      toast({
        title: language === 'en' ? 'Success!' : 'Berhasil!',
        description: language === 'en' ? 'You have been logged in successfully.' : 'Anda telah berhasil masuk.',
      });
      onOpenChange(false);
      setFormData({ email: '', password: '' });
      setLoginMode('options');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      toast({
        title: language === 'en' ? 'Success!' : 'Berhasil!',
        description: language === 'en' ? 'You have been logged in with Google.' : 'Anda telah berhasil masuk dengan Google.',
      });
      onOpenChange(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{dialogText.title[language]}</DialogTitle>
          <DialogDescription className="text-center mb-4">
            {loginMode === 'options' ? dialogText.choose[language] : dialogText.email[language]}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loginMode === 'options' ? (
          <div className="flex flex-col gap-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 group" 
              onClick={() => setLoginMode('email')}
              disabled={loading}
            >
              <Mail className="w-5 h-5 text-blue-500 group-hover:text-white transition-colors" />
              <span>{dialogText.email[language]}</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 hover:bg-white hover:text-inherit" 
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>{dialogText.google[language]}</span>
            </Button>
            
              <Button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600" aria-label={dialogText.line[language]}>
            <SiLine className="w-5 h-5 text-white" />
            <span>{dialogText.line[language]}</span>
          </Button>

            <Separator className="my-2" />

            <div className="text-center text-sm">
              <span className="text-muted-foreground">{dialogText.noAccount[language]} </span>
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal text-primary hover:underline"
                onClick={() => {
                  onOpenChange(false);
                  onRegisterClick?.();
                }}
              >
                {dialogText.register[language]}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{dialogText.emailLabel[language]}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={language === 'en' ? 'Enter your email' : 'Masukkan email Anda'}
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{dialogText.passwordLabel[language]}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={language === 'en' ? 'Enter your password' : 'Masukkan kata sandi Anda'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? dialogText.signingIn[language] : dialogText.signIn[language]}
            </Button>

            <Button 
              type="button"
              variant="ghost" 
              className="w-full" 
              onClick={() => setLoginMode('options')}
              disabled={loading}
            >
              {dialogText.backToOptions[language]}
            </Button>
          </form>
        )}

        <DialogClose asChild>
          <Button variant="ghost" className="w-full mt-2">{dialogText.cancel[language]}</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
