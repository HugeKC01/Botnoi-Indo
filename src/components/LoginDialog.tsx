
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { SiLine } from 'react-icons/si';
import { Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { t, language } = useLanguage();
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
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{dialogText.title[language]}</DialogTitle>
          <DialogDescription className="text-center mb-4">
            {dialogText.choose[language]}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2" aria-label={dialogText.email[language]}>
            <Mail className="w-5 h-5 text-blue-500" />
            <span>{dialogText.email[language]}</span>
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2" aria-label={dialogText.google[language]}>
            <FcGoogle className="w-5 h-5" />
            <span>{dialogText.google[language]}</span>
          </Button>
          <Button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600" aria-label={dialogText.line[language]}>
            <SiLine className="w-5 h-5 text-white" />
            <span>{dialogText.line[language]}</span>
          </Button>
        </div>
        <DialogClose asChild>
          <Button variant="ghost" className="w-full mt-2">{dialogText.cancel[language]}</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
