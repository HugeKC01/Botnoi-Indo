import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Copy, Check } from 'lucide-react';

interface EmbedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audioUrl: string | null;
}

export function EmbedDialog({ open, onOpenChange, audioUrl }: EmbedDialogProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const embedText = {
    title: {
      en: 'Embed Audio Player',
      id: 'Embed Pemutar Audio',
    },
    description: {
      en: 'Copy the code below to embed this audio player on your website',
      id: 'Salin kode di bawah ini untuk menyematkan pemutar audio ini di website Anda',
    },
    codeLabel: {
      en: 'Embed Code',
      id: 'Kode Embed',
    },
    copyButton: {
      en: 'Copy Code',
      id: 'Salin Kode',
    },
    copied: {
      en: 'Copied!',
      id: 'Tersalin!',
    },
    close: {
      en: 'Close',
      id: 'Tutup',
    },
    codeCopied: {
      en: 'Embed code copied to clipboard!',
      id: 'Kode embed disalin ke clipboard!',
    },
    noAudio: {
      en: 'No audio available to embed',
      id: 'Tidak ada audio untuk disematkan',
    },
    preview: {
      en: 'Preview',
      id: 'Pratinjau',
    },
  };

  // Generate unique ID for each embed
  const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const generateEmbedCode = () => {
    if (!audioUrl) return '';
    
    const uniqueId = generateUniqueId();
    
    return `<div style="width:100%; max-width:600px; background-color:#f9f9f9; border-radius:12px; padding:12px; font-family:Arial, sans-serif; box-shadow:0 1px 3px rgba(0,0,0,0.08);">
  <div style="display:flex; align-items:center; position:relative; height:36px;">
    <!-- Play/Pause Button -->
    <div style="margin-right:10px; cursor:pointer; width:28px; text-align:center;" onclick="document.getElementById('botnoiAudio${uniqueId}').play(); this.style.display='none'; document.getElementById('pauseBtn${uniqueId}').style.display='block'; document.getElementById('waveAnimation${uniqueId}').style.animationPlayState='running';" id="playBtn${uniqueId}">
      <svg width="22" height="22" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <polygon points="10,5 40,25 10,45" fill="#000000" stroke="none"/>
      </svg>
    </div>
    <div style="margin-right:10px; cursor:pointer; width:28px; text-align:center; display:none;" onclick="document.getElementById('botnoiAudio${uniqueId}').pause(); this.style.display='none'; document.getElementById('playBtn${uniqueId}').style.display='block'; document.getElementById('waveAnimation${uniqueId}').style.animationPlayState='paused';" id="pauseBtn${uniqueId}">
      <svg width="22" height="22" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="10" width="10" height="30" fill="#000000"/>
        <rect x="28" y="10" width="10" height="30" fill="#000000"/>
      </svg>
    </div>
    
    <!-- Animated Waveform Display -->
    <div style="flex:1; height:24px; position:relative; overflow:hidden; cursor:pointer;" onclick="if(document.getElementById('botnoiAudio${uniqueId}').paused) {document.getElementById('botnoiAudio${uniqueId}').play(); document.getElementById('playBtn${uniqueId}').style.display='none'; document.getElementById('pauseBtn${uniqueId}').style.display='block'; document.getElementById('waveAnimation${uniqueId}').style.animationPlayState='running';} else {document.getElementById('botnoiAudio${uniqueId}').pause(); document.getElementById('pauseBtn${uniqueId}').style.display='none'; document.getElementById('playBtn${uniqueId}').style.display='block'; document.getElementById('waveAnimation${uniqueId}').style.animationPlayState='paused';}">
      <div id="waveAnimation${uniqueId}" style="width:200%; height:100%; background:url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwMCIgaGVpZ2h0PSIzMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSIjRDlEOUQ5Ij4KICAgIDxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjIiIGhlaWdodD0iMTAiIC8+CiAgICA8cmVjdCB4PSIyMCIgeT0iNyIgd2lkdGg9IjIiIGhlaWdodD0iMTYiIC8+CiAgICA8cmVjdCB4PSIzMCIgeT0iMyIgd2lkdGg9IjIiIGhlaWdodD0iMjQiIC8+CiAgICA8cmVjdCB4PSI0MCIgeT0iMTAiIHdpZHRoPSIyIiBoZWlnaHQ9IjEwIiAvPgogICAgPHJlY3QgeD0iNTAiIHk9IjciIHdpZHRoPSIyIiBoZWlnaHQ9IjE2IiAvPgogICAgPHJlY3QgeD0iNjAiIHk9IjUiIHdpZHRoPSIyIiBoZWlnaHQ9IjIwIiAvPgogICAgPHJlY3QgeD0iNzAiIHk9IjIiIHdpZHRoPSIyIiBoZWlnaHQ9IjI2IiAvPgogICAgPHJlY3QgeD0iODAiIHk9IjciIHdpZHRoPSIyIiBoZWlnaHQ9IjE2IiAvPgogICAgPHJlY3QgeD0iOTAiIHk9IjExIiB3aWR0aD0iMiIgaGVpZ2h0PSI4IiAvPgogICAgPHJlY3QgeD0iMTAwIiB5PSI3IiB3aWR0aD0iMiIgaGVpZ2h0PSIxNiIgLz4KICAgIDxyZWN0IHg9IjExMCIgeT0iNCIgd2lkdGg9IjIiIGhlaWdodD0iMjIiIC8+CiAgICA8cmVjdCB4PSIxMjAiIHk9IjEzIiB3aWR0aD0iMiIgaGVpZ2h0PSI0IiAvPgogICAgPHJlY3QgeD0iMTMwIiB5PSI5IiB3aWR0aD0iMiIgaGVpZ2h0PSIxMiIgLz4KICAgIDxyZWN0IHg9IjE0MCIgeT0iMiIgd2lkdGg9IjIiIGhlaWdodD0iMjYiIC8+CiAgICA8cmVjdCB4PSIxNTAiIHk9IjUiIHdpZHRoPSIyIiBoZWlnaHQ9IjIwIiAvPgogICAgPHJlY3QgeD0iMTYwIiB5PSI5IiB3aWR0aD0iMiIgaGVpZ2h0PSIxMiIgLz4KICAgIDxyZWN0IHg9IjE3MCIgeT0iMTAiIHdpZHRoPSIyIiBoZWlnaHQ9IjEwIiAvPgogICAgPHJlY3QgeD0iMTgwIiB5PSI3IiB3aWR0aD0iMiIgaGVpZ2h0PSIxNiIgLz4KICAgIDxyZWN0IHg9IjE5MCIgeT0iMyIgd2lkdGg9IjIiIGhlaWdodD0iMjQiIC8+CiAgICA8cmVjdCB4PSIyMDAiIHk9IjUiIHdpZHRoPSIyIiBoZWlnaHQ9IjIwIiAvPgogICAgPHJlY3QgeD0iMjEwIiB5PSI5IiB3aWR0aD0iMiIgaGVpZ2h0PSIxMiIgLz4KICAgIDxyZWN0IHg9IjIyMCIgeT0iMTAiIHdpZHRoPSIyIiBoZWlnaHQ9IjEwIiAvPgogICAgPHJlY3QgeD0iMjMwIiB5PSI3IiB3aWR0aD0iMiIgaGVpZ2h0PSIxNiIgLz4KICAgIDxyZWN0IHg9IjI0MCIgeT0iMyIgd2lkdGg9IjIiIGhlaWdodD0iMjQiIC8+CiAgICA8cmVjdCB4PSIyNTAiIHk9IjkiIHdpZHRoPSIyIiBoZWlnaHQ9IjEyIiAvPgogICAgPHJlY3QgeD0iMjYwIiB5PSIzIiB3aWR0aD0iMiIgaGVpZ2h0PSIyNCIgLz4KICAgIDxyZWN0IHg9IjI3MCIgeT0iNSIgd2lkdGg9IjIiIGhlaWdodD0iMjAiIC8+CiAgICA8cmVjdCB4PSIyODAiIHk9IjkiIHdpZHRoPSIyIiBoZWlnaHQ9IjEyIiAvPgogICAgPHJlY3QgeD0iMjkwIiB5PSI0IiB3aWR0aD0iMiIgaGVpZ2h0PSIyMiIgLz4KICAgIDxyZWN0IHg9IjMwMCIgeT0iNyIgd2lkdGg9IjIiIGhlaWdodD0iMTYiIC8+CiAgICA8cmVjdCB4PSIzMTAiIHk9IjMiIHdpZHRoPSIyIiBoZWlnaHQ9IjI0IiAvPgogICAgPHJlY3QgeD0iMzIwIiB5PSI2IiB3aWR0aD0iMiIgaGVpZ2h0PSIxOCIgLz4KICAgIDxyZWN0IHg9IjMzMCIgeT0iMTAiIHdpZHRoPSIyIiBoZWlnaHQ9IjEwIiAvPgogICAgPHJlY3QgeD0iMzQwIiB5PSI4IiB3aWR0aD0iMiIgaGVpZ2h0PSIxNCIgLz4KICAgIDxyZWN0IHg9IjM1MCIgeT0iNCIgd2lkdGg9IjIiIGhlaWdodD0iMjIiIC8+CiAgICA8cmVjdCB4PSIzNjAiIHk9IjkiIHdpZHRoPSIyIiBoZWlnaHQ9IjEyIiAvPgogICAgPHJlY3QgeD0iMzcwIiB5PSI2IiB3aWR0aD0iMiIgaGVpZ2h0PSIxOCIgLz4KICAgIDxyZWN0IHg9IjM4MCIgeT0iMyIgd2lkdGg9IjIiIGhlaWdodD0iMjQiIC8+CiAgICA8cmVjdCB4PSIzOTAiIHk9IjEwIiB3aWR0aD0iMiIgaGVpZ2h0PSIxMCIgLz4KICAgIDxyZWN0IHg9IjQwMCIgeT0iNyIgd2lkdGg9IjIiIGhlaWdodD0iMTYiIC8+CiAgICA8cmVjdCB4PSI0MTAiIHk9IjQiIHdpZHRoPSIyIiBoZWlnaHQ9IjIyIiAvPgogICAgPHJlY3QgeD0iNDIwIiB5PSIxMCIgd2lkdGg9IjIiIGhlaWdodD0iMTAiIC8+CiAgICA8cmVjdCB4PSI0MzAiIHk9IjgiIHdpZHRoPSIyIiBoZWlnaHQ9IjE0IiAvPgogICAgPHJlY3QgeD0iNDQwIiB5PSI1IiB3aWR0aD0iMiIgaGVpZ2h0PSIyMCIgLz4KICAgIDxyZWN0IHg9IjQ1MCIgeT0iMyIgd2lkdGg9IjIiIGhlaWdodD0iMjQiIC8+CiAgICA8cmVjdCB4PSI0NjAiIHk9IjkiIHdpZHRoPSIyIiBoZWlnaHQ9IjEyIiAvPgogICAgPHJlY3QgeD0iNDcwIiB5PSI1IiB3aWR0aD0iMiIgaGVpZ2h0PSIyMCIgLz4KICAgIDxyZWN0IHg9IjQ4MCIgeT0iMyIgd2lkdGg9IjIiIGhlaWdodD0iMjQiIC8+CiAgICA8cmVjdCB4PSI0OTAiIHk9IjEwIiB3aWR0aD0iMiIgaGVpZ2h0PSIxMCIgLz4KICAgIDxyZWN0IHg9IjUwMCIgeT0iNyIgd2lkdGg9IjIiIGhlaWdodD0iMTYiIC8+CiAgICA8cmVjdCB4PSI1MTAiIHk9IjQiIHdpZHRoPSIyIiBoZWlnaHQ9IjIyIiAvPgogICAgPHJlY3QgeD0iNTIwIiB5PSI2IiB3aWR0aD0iMiIgaGVpZ2h0PSIxOCIgLz4KICAgIDxyZWN0IHg9IjUzMCIgeT0iMTAiIHdpZHRoPSIyIiBoZWlnaHQ9IjEwIiAvPgogICAgPHJlY3QgeD0iNTQwIiB5PSI4IiB3aWR0aD0iMiIgaGVpZ2h0PSIxNCIgLz4KICAgIDxyZWN0IHg9IjU1MCIgeT0iNSIgd2lkdGg9IjIiIGhlaWdodD0iMjAiIC8+CiAgICA8cmVjdCB4PSI1NjAiIHk9IjMiIHdpZHRoPSIyIiBoZWlnaHQ9IjI0IiAvPgogICAgPHJlY3QgeD0iNTcwIiB5PSI3IiB3aWR0aD0iMiIgaGVpZ2h0PSIxNiIgLz4KICAgIDxyZWN0IHg9IjU4MCIgeT0iMyIgd2lkdGg9IjIiIGhlaWdodD0iMjQiIC8+CiAgICA8cmVjdCB4PSI1OTAiIHk9IjYiIHdpZHRoPSIyIiBoZWlnaHQ9IjE4IiAvPgogICAgPHJlY3QgeD0iNjAwIiB5PSI5IiB3aWR0aD0iMiIgaGVpZ2h0PSIxMiIgLz4KICAgIDxyZWN0IHg9IjYxMCIgeT0iMTAiIHdpZHRoPSIyIiBoZWlnaHQ9IjEwIiAvPgogICAgPHJlY3QgeD0iNjIwIiB5PSI2IiB3aWR0aD0iMiIgaGVpZ2h0PSIxOCIgLz4KICAgIDxyZWN0IHg9IjYzMCIgeT0iNCIgd2lkdGg9IjIiIGhlaWdodD0iMjIiIC8+CiAgICA8cmVjdCB4PSI2NDAiIHk9IjMiIHdpZHRoPSIyIiBoZWlnaHQ9IjI0IiAvPgogICAgPHJlY3QgeD0iNjUwIiB5PSI4IiB3aWR0aD0iMiIgaGVpZ2h0PSIxNCIgLz4KICAgIDxyZWN0IHg9IjY2MCIgeT0iNiIgd2lkdGg9IjIiIGhlaWdodD0iMTgiIC8+CiAgICA8cmVjdCB4PSI2NzAiIHk9IjkiIHdpZHRoPSIyIiBoZWlnaHQ9IjEyIiAvPgogICAgPHJlY3QgeD0iNjgwIiB5PSI3IiB3aWR0aD0iMiIgaGVpZ2h0PSIxNiIgLz4KICAgIDxyZWN0IHg9IjY5MCIgeT0iMyIgd2lkdGg9IjIiIGhlaWdodD0iMjQiIC8+CiAgICA8cmVjdCB4PSI3MDAiIHk9IjciIHdpZHRoPSIyIiBoZWlnaHQ9IjE2IiAvPgogICAgPHJlY3QgeD0iNzEwIiB5PSI5IiB3aWR0aD0iMiIgaGVpZ2h0PSIxMiIgLz4KICAgIDxyZWN0IHg9IjcyMCIgeT0iNiIgd2lkdGg9IjIiIGhlaWdodD0iMTgiIC8+CiAgICA8cmVjdCB4PSI3MzAiIHk9IjQiIHdpZHRoPSIyIiBoZWlnaHQ9IjIyIiAvPgogICAgPHJlY3QgeD0iNzQwIiB5PSI4IiB3aWR0aD0iMiIgaGVpZ2h0PSIxNCIgLz4KICAgIDxyZWN0IHg9Ijc1MCIgeT0iMTAiIHdpZHRoPSIyIiBoZWlnaHQ9IjEwIiAvPgogICAgPHJlY3QgeD0iNzYwIiB5PSI1IiB3aWR0aD0iMiIgaGVpZ2h0PSIyMCIgLz4KICAgIDxyZWN0IHg9Ijc3MCIgeT0iNyIgd2lkdGg9IjIiIGhlaWdodD0iMTYiIC8+CiAgICA8cmVjdCB4PSI3ODAiIHk9IjkiIHdpZHRoPSIyIiBoZWlnaHQ9IjEyIiAvPgogICAgPHJlY3QgeD0iNzkwIiB5PSIxMCIgd2lkdGg9IjIiIGhlaWdodD0iMTAiIC8+CiAgICA8cmVjdCB4PSI4MDAiIHk9IjYiIHdpZHRoPSIyIiBoZWlnaHQ9IjE4IiAvPgogICAgPHJlY3QgeD0iODEwIiB5PSIzIiB3aWR0aD0iMiIgaGVpZ2h0PSIyNCIgLz4KICAgIDxyZWN0IHg9IjgyMCIgeT0iOCIgd2lkdGg9IjIiIGhlaWdodD0iMTQiIC8+CiAgICA8cmVjdCB4PSI4MzAiIHk9IjYiIHdpZHRoPSIyIiBoZWlnaHQ9IjE4IiAvPgogICAgPHJlY3QgeD0iODQwIiB5PSI5IiB3aWR0aD0iMiIgaGVpZ2h0PSIxMiIgLz4KICAgIDxyZWN0IHg9Ijg1MCIgeT0iMTAiIHdpZHRoPSIyIiBoZWlnaHQ9IjEwIiAvPgogICAgPHJlY3QgeD0iODYwIiB5PSI3IiB3aWR0aD0iMiIgaGVpZ2h0PSIxNiIgLz4KICAgIDxyZWN0IHg9Ijg3MCIgeT0iNCIgd2lkdGg9IjIiIGhlaWdodD0iMjIiIC8+CiAgICA8cmVjdCB4PSI4ODAiIHk9IjIiIHdpZHRoPSIyIiBoZWlnaHQ9IjI2IiAvPgogICAgPHJlY3QgeD0iODkwIiB5PSI1IiB3aWR0aD0iMiIgaGVpZ2h0PSIyMCIgLz4KICAgIDxyZWN0IHg9IjkwMCIgeT0iMTAiIHdpZHRoPSIyIiBoZWlnaHQ9IjEwIiAvPgogICAgPHJlY3QgeD0iOTEwIiB5PSI4IiB3aWR0aD0iMiIgaGVpZ2h0PSIxNCIgLz4KICAgIDxyZWN0IHg9IjkyMCIgeT0iNSIgd2lkdGg9IjIiIGhlaWdodD0iMjAiIC8+CiAgICA8cmVjdCB4PSI5MzAiIHk9IjMiIHdpZHRoPSIyIiBoZWlnaHQ9IjI0IiAvPgogICAgPHJlY3QgeD0iOTQwIiB5PSI2IiB3aWR0aD0iMiIgaGVpZ2h0PSIxOCIgLz4KICAgIDxyZWN0IHg9Ijk1MCIgeT0iOSIgd2lkdGg9IjIiIGhlaWdodD0iMTIiIC8+CiAgICA8cmVjdCB4PSI5NjAiIHk9IjEwIiB3aWR0aD0iMiIgaGVpZ2h0PSIxMCIgLz4KICAgIDxyZWN0IHg9Ijk3MCIgeT0iOCIgd2lkdGg9IjIiIGhlaWdodD0iMTQiIC8+CiAgICA8cmVjdCB4PSI5ODAiIHk9IjciIHdpZHRoPSIyIiBoZWlnaHQ9IjE2IiAvPgogICAgPHJlY3QgeD0iOTkwIiB5PSI0IiB3aWR0aD0iMiIgaGVpZ2h0PSIyMiIgLz4KICA8L2c+Cjwvc3ZnPg==') repeat-x; animation: waveMove${uniqueId} 30s linear infinite; animation-play-state: paused;"></div>
    </div>
    
    <!-- Time -->
    <div style="margin-left:10px; font-size:13px; color:#666; min-width:40px; text-align:right;" id="timeDisplay${uniqueId}">00:00</div>
    
    <!-- Playback Speed Control - Icon Style -->
    <div style="position:relative; margin-left:10px; height:24px; display:flex; align-items:center; border:1px solid #ddd; border-radius:4px; background-color:#fff; padding:0 8px; cursor:pointer;">
      <div style="display:flex; align-items:center;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right:4px;">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 16.5V7.5L16 12L10 16.5Z" fill="#000"/>
        </svg>
        <select id="speed${uniqueId}" style="appearance:none; font-size:12px; border:none; background:transparent; cursor:pointer; height:22px; padding:0; width:36px;" onchange="document.getElementById('botnoiAudio${uniqueId}').playbackRate = this.value;">
          <option value="0.5">0.5x</option>
          <option value="0.75">0.75x</option>
          <option value="1" selected>1.0x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2.0x</option>
        </select>
      </div>
    </div>
    
    <!-- Logo -->
    <a href="https://voice.botnoi.ai" target="_blank" style="margin-left:10px; text-decoration:none;">
      <div style="display:flex; align-items:center; cursor:pointer;">
        <img src="https://voice.botnoi.ai/assets/icons/navbar-v2/botnoi_voice-logo4.svg" width="60" height="18" alt="Botnoi Voice Logo">
      </div>
    </a>
  </div>
  
  <!-- Hidden Audio Element -->
  <audio id="botnoiAudio${uniqueId}" src="${audioUrl}" style="display:none;" onended="document.getElementById('pauseBtn${uniqueId}').style.display='none'; document.getElementById('playBtn${uniqueId}').style.display='block'; document.getElementById('waveAnimation${uniqueId}').style.animationPlayState='paused';" ontimeupdate="updateTime${uniqueId}()"></audio>
  
  <style>
    @keyframes waveMove${uniqueId} {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  </style>
  
  <script>
    function updateTime${uniqueId}() {
      var audio = document.getElementById('botnoiAudio${uniqueId}');
      var minutes = Math.floor(audio.currentTime / 60);
      var seconds = Math.floor(audio.currentTime % 60);
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      document.getElementById('timeDisplay${uniqueId}').innerText = minutes + ':' + seconds;
    }
  </script>
</div>`;
  };

  const embedCode = generateEmbedCode();

  const handleCopyCode = async () => {
    if (!embedCode) return;

    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      toast({
        title: embedText.copied[language],
        description: embedText.codeCopied[language],
        variant: 'default',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy code',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">{embedText.title[language]}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground text-center">
            {embedText.description[language]}
          </p>

          {!audioUrl ? (
            <div className="text-center text-muted-foreground py-8">
              {embedText.noAudio[language]}
            </div>
          ) : (
            <>
              {/* Preview Section */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {embedText.preview[language]}
                </Label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div dangerouslySetInnerHTML={{ __html: embedCode }} />
                </div>
              </div>

              {/* Embed Code Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="embedCode" className="text-sm font-medium">
                    {embedText.codeLabel[language]}
                  </Label>
                  <Button
                    onClick={handleCopyCode}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        {embedText.copied[language]}
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        {embedText.copyButton[language]}
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="embedCode"
                  value={embedCode}
                  readOnly
                  className="min-h-[200px] text-xs font-mono bg-gray-50"
                  placeholder={embedText.noAudio[language]}
                />
              </div>
            </>
          )}

          {/* Close Button */}
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="w-full"
          >
            {embedText.close[language]}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
