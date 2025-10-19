export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async start(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm',
      });
      
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  async stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('MediaRecorder not initialized'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.cleanup();
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  private cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }
}

// Text-to-Speech using Web Speech API
export class TextToSpeech {
  private synth: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private enabled: boolean = true;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices() {
    const pickPreferred = (list: SpeechSynthesisVoice[]) => {
      const preferredNames = [
        'Google UK English Female',
        'Google US English',
        'Microsoft Aria',
        'Microsoft Zira',
        'Samantha',
        'Victoria',
        'Karen',
        'Serena',
        'Tessa',
        'Kate',
        'Female'
      ];
      // 1) Exact/preferred name match
      for (const name of preferredNames) {
        const v = list.find(voice => voice.name.toLowerCase().includes(name.toLowerCase()));
        if (v) return v;
      }
      // 2) Heuristic: English + female
      const femaleHeuristic = list.find(v => v.lang.startsWith('en') && /female|aria|zira|samantha/i.test(v.name));
      if (femaleHeuristic) return femaleHeuristic;
      // 3) Fallback to first English
      const firstEn = list.find(v => v.lang.startsWith('en'));
      return firstEn || list[0] || null;
    };

    const voices = this.synth.getVoices();
    this.voice = pickPreferred(voices);

    if (voices.length === 0) {
      this.synth.onvoiceschanged = () => {
        const newVoices = this.synth.getVoices();
        this.voice = pickPreferred(newVoices);
      };
    }
  }

  speak(text: string) {
    if (!this.enabled || !text.trim()) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.rate = 0.98;
    utterance.pitch = 1.15;
    utterance.volume = 1.0;

    this.synth.speak(utterance);
  }

  stop() {
    this.synth.cancel();
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  isEnabled() {
    return this.enabled;
  }
}

export const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const playAudioFromBase64 = (base64Audio: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
      audio.onended = () => resolve();
      audio.onerror = reject;
      audio.play();
    } catch (error) {
      reject(error);
    }
  });
};
