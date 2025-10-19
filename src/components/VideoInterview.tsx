import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { RealtimeVideoChat } from "@/utils/RealtimeVideoChat";
import { Video, VideoOff, Mic, MicOff, Phone, Loader2 } from "lucide-react";

interface VideoInterviewProps {
  role: string;
  resumeContext: string;
  onEndInterview: (messages: Array<{ role: string; content: string }>) => void;
}

const VideoInterview = ({ role, resumeContext, onEndInterview }: VideoInterviewProps) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [userTranscript, setUserTranscript] = useState("");
  
  const chatRef = useRef<RealtimeVideoChat | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      cleanupMedia();
      chatRef.current?.disconnect();
    };
  }, []);

  const cleanupMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startInterview = async () => {
    setIsConnecting(true);
    try {
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });

      streamRef.current = stream;

      const videoEl = videoRef.current;
      const videoTrack = stream.getVideoTracks()[0];
      if (!videoTrack) {
        console.warn('No video track found on media stream');
      }
      
      if (videoEl) {
        videoEl.muted = true; // ensure autoplay policies allow play
        // iOS inline playback
        videoEl.playsInline = true;
        videoEl.srcObject = stream;
        const tryPlay = () => videoEl.play().catch(err => console.error('Error playing video:', err));
        if (videoEl.readyState >= 2) {
          tryPlay();
        } else {
          videoEl.onloadedmetadata = () => tryPlay();
        }
      }

      // Initialize realtime chat
      chatRef.current = new RealtimeVideoChat(
        (event) => {
          if (event.type === 'response.audio.delta') {
            setIsSpeaking(true);
          } else if (event.type === 'response.audio.done') {
            setIsSpeaking(false);
          }
        },
        (text, isFinal) => {
          if (isFinal) {
            setUserTranscript(text);
            setTimeout(() => setUserTranscript(""), 3000);
          } else {
            setCurrentTranscript(prev => prev + text);
            if (text.includes('.') || text.includes('?') || text.includes('!')) {
              setTimeout(() => setCurrentTranscript(""), 3000);
            }
          }
        }
      );

      await chatRef.current.init(role, resumeContext);
      setIsConnected(true);

      toast({
        title: "Interview Started",
        description: "You're now connected with the AI interviewer",
      });
    } catch (error) {
      console.error('Error starting interview:', error);
      cleanupMedia();
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start interview',
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const endInterview = async () => {
    const messages = chatRef.current?.getConversationHistory() || [];
    cleanupMedia();
    chatRef.current?.disconnect();
    setIsConnected(false);
    onEndInterview(messages);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold">Ready for your video interview?</h2>
          <p className="text-muted-foreground max-w-md">
            Make sure you're in a quiet environment with good lighting. 
            The AI interviewer will conduct a professional {role} interview.
          </p>
        </div>
        
        <Button 
          onClick={startInterview}
          disabled={isConnecting}
          className="gap-2 px-8 py-6 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90"
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Video className="h-5 w-5" />
              Start Video Interview
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video Display */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Student Video */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <VideoOff className="h-16 w-16 text-white/50" />
                </div>
              )}
              <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 text-white text-sm rounded">
                You
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Interviewer */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center ${isSpeaking ? 'animate-pulse' : ''}`}>
                  <Video className="h-16 w-16 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Interviewer</h3>
                  <p className="text-sm text-muted-foreground">{role} Interview</p>
                </div>
              </div>
              {isSpeaking && (
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 text-white text-sm rounded flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  Speaking...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transcripts */}
      {(currentTranscript || userTranscript) && (
        <Card className="glass border-primary/20">
          <CardContent className="p-4">
            <div className="space-y-2">
              {userTranscript && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium text-primary">You said:</p>
                  <p className="text-sm">{userTranscript}</p>
                </div>
              )}
              {currentTranscript && (
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm font-medium text-accent">AI Interviewer:</p>
                  <p className="text-sm">{currentTranscript}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={toggleVideo}
          className={`gap-2 ${!isVideoEnabled ? 'bg-destructive text-white hover:bg-destructive/90' : ''}`}
        >
          {isVideoEnabled ? (
            <>
              <Video className="h-5 w-5" />
              Video On
            </>
          ) : (
            <>
              <VideoOff className="h-5 w-5" />
              Video Off
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={toggleAudio}
          className={`gap-2 ${!isAudioEnabled ? 'bg-destructive text-white hover:bg-destructive/90' : ''}`}
        >
          {isAudioEnabled ? (
            <>
              <Mic className="h-5 w-5" />
              Mic On
            </>
          ) : (
            <>
              <MicOff className="h-5 w-5" />
              Mic Off
            </>
          )}
        </Button>

        <Button
          variant="destructive"
          size="lg"
          onClick={endInterview}
          className="gap-2"
        >
          <Phone className="h-5 w-5 rotate-135" />
          End Interview
        </Button>
      </div>
    </div>
  );
};

export default VideoInterview;
