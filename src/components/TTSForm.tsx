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
    <div className="w-full max-w-5xl mx-auto">
      {/* Form Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          {t('ttsTitle')}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t('ttsDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-xl border-0 bg-white backdrop-blur-sm">
            <CardContent className="p-8 space-y-8">
              {/* API Key Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t('apiKeySection')}
                  </h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="apiKey" className="text-sm font-medium">
                      {t('apiKeySection')}
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-xs"
                    >
                      {showApiKey ? (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" />
                          {t('hide')}
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
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
                    className="w-full border-border/50 focus:border-accent transition-colors"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('apiKeyHint')}
                  </p>
                </div>
              </div>

              {/* Text Input Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="text-accent font-bold text-sm">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t('textSection')}
                  </h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="text" className="text-sm font-medium">
                    {t('textLabel')}
                  </Label>
                  <Textarea
                    id="text"
                    placeholder={t('textPlaceholder')}
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="min-h-[140px] resize-none border-border/50 focus:border-accent transition-colors"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      {t('textHint')}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formData.text.length} {t('characters')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Voice Configuration */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                    <span className="text-success font-bold text-sm">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t('voiceSection')}
                  </h3>
                </div>

                {/* Speaker and Language */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="speaker" className="text-sm font-medium">
                      {t('voiceId')}
                    </Label>
                    <Input
                      id="speaker"
                      type="number"
                      value={formData.speaker}
                      onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                      className="w-full border-border/50 focus:border-accent transition-colors"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('voiceIdHint')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      {t('language')}
                    </Label>
                    <Select value="id" disabled>
                      <SelectTrigger className="w-full border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">{t('indonesian')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Volume and Speed */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium flex items-center">
                      <Mic className="w-4 h-4 mr-2 text-accent" />
                      {t('volume')}
                    </Label>
                    <div className="space-y-3">
                      <Slider
                        value={[formData.volume]}
                        onValueChange={(value) => setFormData({ ...formData, volume: value[0] })}
                        max={2}
                        min={0.1}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0.1</span>
                        <span className="font-medium text-foreground">{formData.volume.toFixed(1)}</span>
                        <span>2.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium flex items-center">
                      <RotateCcw className="w-4 h-4 mr-2 text-accent" />
                      {t('speed')}
                    </Label>
                    <div className="space-y-3">
                      <Slider
                        value={[formData.speed]}
                        onValueChange={(value) => setFormData({ ...formData, speed: value[0] })}
                        max={2}
                        min={0.5}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0.5</span>
                        <span className="font-medium text-foreground">{formData.speed.toFixed(1)}</span>
                        <span>2.0</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media Format */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    {t('audioFormat')}
                  </Label>
                  <RadioGroup
                    value={formData.format}
                    onValueChange={(value) => setFormData({ ...formData, format: value })}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2 bg-secondary/30 px-4 py-2 rounded-lg">
                      <RadioGroupItem value="m4a" id="m4a" />
                      <Label htmlFor="m4a" className="cursor-pointer font-medium">M4A</Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-secondary/30 px-4 py-2 rounded-lg">
                      <RadioGroupItem value="mp3" id="mp3" />
                      <Label htmlFor="mp3" className="cursor-pointer font-medium">MP3</Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-secondary/30 px-4 py-2 rounded-lg">
                      <RadioGroupItem value="wav" id="wav" />
                      <Label htmlFor="wav" className="cursor-pointer font-medium">WAV</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Convert to Speech Button */}
              <div className="pt-4">
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white py-3 border-0 shadow-lg transition-all duration-200 hover:shadow-xl"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('processing')}
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      {t('convertToSpeech') || t('generateAudio')}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Output and Tips */}
        <div className="lg:col-span-1 space-y-6">
          {/* Audio Output */}
          {audioUrl && (
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {t('audioPreview')}
                </h3>
                <div className="space-y-4">
                  <audio controls className="w-full rounded-lg">
                    <source src={audioUrl} type={`audio/${formData.format}`} />
                    Your browser does not support the audio element.
                  </audio>
                  <div className="text-xs text-muted-foreground text-center">
                    {t('audioReady')}
                  </div>
                </div>
                {/* Download and Regenerate buttons */}
                <div className="flex flex-col gap-2 mt-6">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full border-accent/20 text-accent hover:bg-accent/5 hover:border-accent/40 transition-all duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('download')}
                  </Button>
                  <Button
                    onClick={handleRegenerate}
                    variant="outline"
                    className="w-full border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-all duration-200"
                    disabled={isLoading}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t('regenerate')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Tips */}
          <Card className="shadow-xl border-0 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {t('tips')}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('tip1')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('tip2')}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('tip3')}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};