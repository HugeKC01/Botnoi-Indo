import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mic, Download, RotateCcw, Loader2 } from 'lucide-react';

interface TTSFormData {
  apiKey: string;
  text: string;
  speaker: string;
  volume: number;
  speed: number;
  format: string;
}

export const TTSForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<TTSFormData>({
    apiKey: '',
    text: '',
    speaker: '1',
    volume: 1.0,
    speed: 1.0,
    format: 'mp3'
  });
  
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!formData.text.trim()) {
      toast({
        title: 'Error',
        description: t('pleaseEnterText'),
        variant: 'destructive'
      });
      return;
    }

    if (!formData.apiKey.trim()) {
      toast({
        title: 'Error',
        description: t('pleaseEnterApiKey'),
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://api-voice.botnoi.ai/openapi/v1/generate_audio', {
        method: 'POST',
        headers: {
          'Botnoi-Token': formData.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: formData.text,
          speaker: formData.speaker,
          volume: formData.volume.toString(),
          speed: formData.speed,
          type_media: formData.format,
          save_file: "true",
          language: "id"
        })
      });

      const result = await response.json();
      
      if (response.ok && result.audio_url) {
        setAudioUrl(result.audio_url);
        toast({
          title: 'Success',
          description: t('audioGenerated'),
          variant: 'default'
        });
      } else {
        throw new Error(result.message || 'API request failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: t('errorOccurred'),
        variant: 'destructive'
      });
      console.error('TTS generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!audioUrl) return;

    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tts-audio.${formData.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download audio',
        variant: 'destructive'
      });
    }
  };

  const handleRegenerate = () => {
    setAudioUrl(null);
    handleGenerate();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardContent className="p-8 space-y-6">
          {/* API Key Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="apiKey" className="text-sm font-medium">
                {t('apiKey')}
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-primary hover:text-primary/80"
              >
                {showApiKey ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    {t('hide')}
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    {t('show')}
                  </>
                )}
              </Button>
            </div>
            <Input
              id="apiKey"
              type={showApiKey ? 'text' : 'password'}
              placeholder={t('enterApiKey')}
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {t('signInToRetrieve')}
            </p>
          </div>

          {/* Text to Convert */}
          <div className="space-y-2">
            <Label htmlFor="text" className="text-sm font-medium">
              {t('textToConvert')}
            </Label>
            <Textarea
              id="text"
              placeholder={t('enterText')}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Speaker ID and Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="speaker" className="text-sm font-medium">
                {t('speakerId')}
              </Label>
              <Input
                id="speaker"
                type="number"
                value={formData.speaker}
                onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                {t('differentSpeakers')}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t('language')}
              </Label>
              <Select value="id" disabled>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">{t('indonesian')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Volume and Speed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center">
                <Mic className="w-4 h-4 mr-2" />
                {t('volume')}
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[formData.volume]}
                  onValueChange={(value) => setFormData({ ...formData, volume: value[0] })}
                  max={2}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-right text-sm text-muted-foreground">
                  {formData.volume.toFixed(1)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium flex items-center">
                <RotateCcw className="w-4 h-4 mr-2" />
                {t('speed')}
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[formData.speed]}
                  onValueChange={(value) => setFormData({ ...formData, speed: value[0] })}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-right text-sm text-muted-foreground">
                  {formData.speed.toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Media Format */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {t('mediaFormat')}
            </Label>
            <RadioGroup
              value={formData.format}
              onValueChange={(value) => setFormData({ ...formData, format: value })}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="m4a" id="m4a" />
                <Label htmlFor="m4a" className="cursor-pointer">M4A</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mp3" id="mp3" />
                <Label htmlFor="mp3" className="cursor-pointer">MP3</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wav" id="wav" />
                <Label htmlFor="wav" className="cursor-pointer">WAV</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('processing')}
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  {t('convertToSpeech')}
                </>
              )}
            </Button>

            {audioUrl && (
              <div className="flex space-x-3">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('download')}
                </Button>
                <Button
                  onClick={handleRegenerate}
                  variant="outline"
                  className="flex-1"
                  disabled={isLoading}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t('regenerate')}
                </Button>
              </div>
            )}

            {audioUrl && (
              <div className="mt-4">
                <audio controls className="w-full">
                  <source src={audioUrl} type={`audio/${formData.format}`} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};