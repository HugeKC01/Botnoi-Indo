import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginClick?: () => void;
}

export function RegisterDialog({ open, onOpenChange, onLoginClick }: RegisterDialogProps) {
  const { t, language } = useLanguage();
  const { signup } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ 
    displayName: '',
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dialogText = {
    title: {
      en: 'Join Botnoi Indonesia',
      id: 'Bergabung dengan Botnoi Indonesia',
    },
    email: {
      en: 'Register with Email',
      id: 'Daftar dengan Email',
    },
    cancel: {
      en: 'Cancel',
      id: 'Batal',
    },
    nameLabel: {
      en: 'Full Name',
      id: 'Nama Lengkap',
    },
    emailLabel: {
      en: 'Email',
      id: 'Email',
    },
    passwordLabel: {
      en: 'Password',
      id: 'Kata Sandi',
    },
    confirmPasswordLabel: {
      en: 'Confirm Password',
      id: 'Konfirmasi Kata Sandi',
    },
    register: {
      en: 'Register',
      id: 'Daftar',
    },
    registering: {
      en: 'Creating account...',
      id: 'Membuat akun...',
    },
    haveAccount: {
      en: 'Already have an account?',
      id: 'Sudah punya akun?',
    },
    login: {
      en: 'Login',
      id: 'Masuk',
    },
  };

  const validateForm = () => {
    if (!formData.displayName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(language === 'en' ? 'Please fill in all fields' : 'Mohon isi semua kolom');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError(language === 'en' ? 'Passwords do not match' : 'Kata sandi tidak cocok');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError(language === 'en' ? 'Password must be at least 6 characters long' : 'Kata sandi harus minimal 6 karakter');
      return false;
    }
    
    return true;
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setError('');
      setLoading(true);
      await signup(formData.email, formData.password, formData.displayName);
      toast({
        title: language === 'en' ? 'Success!' : 'Berhasil!',
        description: language === 'en' ? 'Your account has been created successfully.' : 'Akun Anda telah berhasil dibuat.',
      });
      onOpenChange(false);
      setFormData({ displayName: '', email: '', password: '', confirmPassword: '' });
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
            {dialogText.email[language]}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleEmailRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">{dialogText.nameLabel[language]}</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  placeholder={language === 'en' ? 'Enter your full name' : 'Masukkan nama lengkap Anda'}
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

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
                  placeholder={language === 'en' ? 'Create a password' : 'Buat kata sandi'}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{dialogText.confirmPasswordLabel[language]}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={language === 'en' ? 'Confirm your password' : 'Konfirmasi kata sandi Anda'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? dialogText.registering[language] : dialogText.register[language]}
            </Button>

            <Separator className="my-2" />

            <div className="text-center text-sm">
              <span className="text-muted-foreground">{dialogText.haveAccount[language]} </span>
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal text-primary hover:underline"
                onClick={() => {
                  onOpenChange(false);
                  onLoginClick?.();
                }}
              >
                {dialogText.login[language]}
              </Button>
            </div>
          </form>

        <DialogClose asChild>
          <Button variant="ghost" className="w-full mt-2">{dialogText.cancel[language]}</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
