import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
import { Eye, EyeOff, Mic, Download, Loader2, Share2, Code, Zap } from 'lucide-react';
import { ShareDialog } from './ShareDialog';
import { EmbedDialog } from './EmbedDialog';

interface TTSFormData {
  apiKey: string;
  text: string;
  speaker: string;
  volume: number;
  speed: number;
  format: string;
}

interface SpeakerOption {
  speaker_id: string;
  name: string;
}

export const TTSForm = () => {
  const { botnoiToken } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const [formData, setFormData] = useState<TTSFormData>({
    apiKey: '',
    text: '',
    speaker: '',
    volume: 1.0,
    speed: 1.0,
    format: 'mp3'
  });

  const [speakerOptions, setSpeakerOptions] = useState<SpeakerOption[]>([]);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);

  // Removed auto-fill API key from botnoiToken

  useEffect(() => {
    // Fetch and parse the CSV file for speaker options
    fetch('/resource/speakers_2025-07-22.csv')
      .then((res) => {
        if (!res.ok) throw new Error('CSV not found');
        return res.text();
      })
      .then((csv) => {
        const lines = csv.trim().split('\n');
        const options: SpeakerOption[] = [];
        for (let i = 1; i < lines.length; i++) {
          const [speaker_id, ...nameParts] = lines[i].split(',');
          let name = nameParts.join(',').replace(/^"|"$/g, '').trim();
          if (speaker_id && name) {
            options.push({ speaker_id: speaker_id.trim(), name });
          }
        }
        setSpeakerOptions(options);
        if (options.length > 0 && !formData.speaker) {
          setFormData((prev) => ({ ...prev, speaker: options[0].speaker_id }));
        }
      })
      .catch((err) => {
        setSpeakerOptions([]);
        // Optionally show a toast or fallback UI
        toast({
          title: 'Error',
          description: 'Speaker list could not be loaded. Please check the CSV file.',
          variant: 'destructive',
        });
      });
  }, []);

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

  const handleDownload = () => {
    if (!audioUrl) return;
    try {
      // Direct download using the audioUrl (assumed to be a direct file link)
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `tts-audio.${formData.format}`;
      document.body.appendChild(a);
      a.click();
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

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleEmbed = () => {
    setShowEmbedDialog(true);
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

      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          className="px-3"
          onClick={() => setShowSidebar((prev) => !prev)}
        >
          {showSidebar
            ? (language === 'id' ? 'Sembunyikan Tips' : 'Hide Tips')
            : (language === 'id' ? 'Tampilkan Tips' : 'Show Tips')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className={showSidebar ? "lg:col-span-2" : "lg:col-span-3"}>
          <Card className="border border-border bg-card dark:bg-[hsl(222.2_84%_6%)] dark:border-[hsl(222.2_84%_20%)] backdrop-blur-sm shadow-[0_4px_32px_0_hsl(var(--shadow))]">
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
                    <Select
                      value={formData.speaker}
                      onValueChange={(value) => setFormData({ ...formData, speaker: value })}
                    >
                      <SelectTrigger className="w-full border-border/50">
                        <SelectValue placeholder={t('selectSpeaker')} />
                      </SelectTrigger>
                      <SelectContent>
                        {speakerOptions.map((option) => (
                          <SelectItem key={option.speaker_id} value={option.speaker_id}>
                            {option.speaker_id} - {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        max={1}
                        min={0.1}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>10%</span>
                        <span className="font-medium text-foreground">{Math.round(formData.volume * 100)}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-accent" />
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

              {/* Audio Output moved below Convert to Speech Button */}
              {audioUrl && (
                <div className="mt-8">
                  <Card className="border border-border bg-card/80 dark:bg-[hsl(222.2_84%_8%)] dark:border-[hsl(222.2_84%_24%)] backdrop-blur-sm shadow-[0_4px_32px_0_hsl(var(--shadow))]">
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
                      {/* Download, Share, and Embed buttons */}
                      <div className="flex gap-2 mt-6">
                        <Button
                          onClick={handleDownload}
                          variant="outline"
                          className="flex-1 border-accent/20 text-accent"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {t('download')}
                        </Button>
                        <Button
                          onClick={handleShare}
                          variant="outline"
                          size="icon"
                          className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-all duration-200"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={handleEmbed}
                          variant="outline"
                          size="icon"
                          className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-all duration-200"
                        >
                          <Code className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Output and Tips */}
        {showSidebar && (
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Tips */}
            <Card className="border border-border bg-card/70 dark:bg-[hsl(222.2_84%_8%)] dark:border-[hsl(222.2_84%_24%)] backdrop-blur-sm shadow-[0_4px_32px_0_hsl(var(--shadow))]">
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
            {/* Speaker List */}
            <Card className="border border-border bg-card/70 dark:bg-[hsl(222.2_84%_8%)] dark:border-[hsl(222.2_84%_24%)] backdrop-blur-sm shadow-[0_4px_32px_0_hsl(var(--shadow))]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {t('voiceId')} {t('list') || 'List'}
                </h3>
                <ul className="max-h-64 overflow-y-auto space-y-1 text-sm text-muted-foreground">
                  {speakerOptions.map((option) => (
                    <li key={option.speaker_id} className="flex items-center gap-2">
                      <span className="font-mono text-xs text-accent">{option.speaker_id}</span>
                      <span className="truncate">{option.name}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        audioUrl={audioUrl}
      />

      {/* Embed Dialog */}
      <EmbedDialog
        open={showEmbedDialog}
        onOpenChange={setShowEmbedDialog}
        audioUrl={audioUrl}
      />
    </div>
  );
};