import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { SiLine } from 'react-icons/si';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audioUrl: string | null;
}

export function ShareDialog({ open, onOpenChange, audioUrl }: ShareDialogProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareText = {
    title: {
      en: 'Share Generated Audio',
      id: 'Bagikan Audio yang Dihasilkan',
    },
    description: {
      en: 'Share your generated audio with others',
      id: 'Bagikan audio yang dihasilkan dengan orang lain',
    },
    linkLabel: {
      en: 'Audio Link',
      id: 'Tautan Audio',
    },
    copyButton: {
      en: 'Copy Link',
      id: 'Salin Tautan',
    },
    copied: {
      en: 'Copied!',
      id: 'Tersalin!',
    },
    shareVia: {
      en: 'Share via',
      id: 'Bagikan melalui',
    },
    line: {
      en: 'Share to LINE',
      id: 'Bagikan ke LINE',
    },
    capcut: {
      en: 'Open in CapCut',
      id: 'Buka di CapCut',
    },
    canva: {
      en: 'Open in Canva',
      id: 'Buka di Canva',
    },
    close: {
      en: 'Close',
      id: 'Tutup',
    },
    linkCopied: {
      en: 'Link copied to clipboard!',
      id: 'Tautan disalin ke clipboard!',
    },
  };

  const handleCopyLink = async () => {
    if (!audioUrl) return;

    try {
      await navigator.clipboard.writeText(audioUrl);
      setCopied(true);
      toast({
        title: shareText.copied[language],
        description: shareText.linkCopied[language],
        variant: 'default',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        variant: 'destructive',
      });
    }
  };

  const handleShareToLine = () => {
    if (!audioUrl) return;
    
    const shareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(
      `Check out this generated audio: ${audioUrl}`
    )}`;
    window.open(shareUrl, '_blank');
  };

  const handleOpenInCapCut = () => {
    if (!audioUrl) return;
    
    // CapCut doesn't have a direct URL scheme for importing audio, 
    // so we'll open their web app and show instructions
    toast({
      title: 'CapCut',
      description: language === 'id' 
        ? 'Salin tautan audio dan impor ke CapCut secara manual'
        : 'Copy the audio link and import to CapCut manually',
      variant: 'default',
    });
    window.open('https://www.capcut.com/', '_blank');
  };

  const handleOpenInCanva = () => {
    if (!audioUrl) return;
    
    // Canva doesn't have a direct URL scheme for importing audio,
    // so we'll open their web app and show instructions
    toast({
      title: 'Canva',
      description: language === 'id' 
        ? 'Salin tautan audio dan impor ke Canva secara manual'
        : 'Copy the audio link and import to Canva manually',
      variant: 'default',
    });
    window.open('https://www.canva.com/', '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{shareText.title[language]}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Audio Link Field */}
          <div className="space-y-2">
            <Label htmlFor="audioLink" className="text-sm font-medium">
              {shareText.linkLabel[language]}
            </Label>
            <div className="flex gap-2">
              <Input
                id="audioLink"
                value={audioUrl || ''}
                readOnly
                className="flex-1"
                placeholder={language === 'id' ? 'Tidak ada audio' : 'No audio'}
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="icon"
                disabled={!audioUrl}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {shareText.shareVia[language]}
            </Label>
            
            <div className="flex flex-col gap-2">
              {/* LINE */}
              <Button
                onClick={handleShareToLine}
                variant="outline"
                className="w-full justify-start gap-3 bg-green-50 hover:bg-green-100 border-green-200"
                disabled={!audioUrl}
              >
                <SiLine className="w-5 h-5 text-green-600" />
                <span>{shareText.line[language]}</span>
                <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
              </Button>

              {/* CapCut */}
              <Button
                onClick={handleOpenInCapCut}
                variant="outline"
                className="w-full justify-start gap-3 bg-black/5 hover:bg-black/10 border-gray-200"
                disabled={!audioUrl}
              >
                <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <span>{shareText.capcut[language]}</span>
                <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
              </Button>

              {/* Canva */}
              <Button
                onClick={handleOpenInCanva}
                variant="outline"
                className="w-full justify-start gap-3 bg-purple-50 hover:bg-purple-100 border-purple-200"
                disabled={!audioUrl}
              >
                <div className="w-5 h-5 bg-purple-600 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <span>{shareText.canva[language]}</span>
                <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Close Button */}
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="w-full"
          >
            {shareText.close[language]}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
