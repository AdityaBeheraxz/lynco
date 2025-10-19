import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import VideoInterview from "@/components/VideoInterview";
import { Mic, MicOff, Send, Loader2, RotateCcw, Upload, Volume2, VolumeX, Video } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AudioRecorder, convertBlobToBase64, TextToSpeech } from "@/utils/audioUtils";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface InterviewAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  technicalSkills: {
    rating: number;
    feedback: string;
  };
  communication: {
    rating: number;
    feedback: string;
  };
  problemSolving: {
    rating: number;
    feedback: string;
  };
  improvements: string[];
  summary: string;
}

const ROLES = [
  "Software Developer",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Mobile Developer",
];

const MockInterviewPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Software Developer");
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [interviewMode, setInterviewMode] = useState<"video" | "chat">("video");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeContext, setResumeContext] = useState("");
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [interviewAnalysis, setInterviewAnalysis] = useState<InterviewAnalysis | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const audioRecorder = useRef<AudioRecorder>(new AudioRecorder());
  const textToSpeech = useRef<TextToSpeech>(new TextToSpeech());
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.type.includes('document')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or document file",
        variant: "destructive",
      });
      return;
    }

    setResumeFile(file);
    setIsAnalyzingResume(true);

    try {
      // Read file content
      const fileText = await file.text();
      
      // Analyze resume using AI
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: { resumeText: fileText }
      });

      if (error) throw error;

      setResumeContext(data.analysis);
      toast({
        title: "Resume analyzed",
        description: "Your resume has been analyzed successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  const startInterview = async () => {
    if (!resumeContext) {
      toast({
        title: "Resume required",
        description: "Please upload your resume first",
        variant: "destructive",
      });
      return;
    }

    setIsInterviewStarted(true);
    setMessages([]);
    setIsLoading(true);

    try {
      let fullAssistantMessage = "";
      await streamChat({
        messages: [{ role: "user", content: `Start the interview for ${selectedRole} position.` }],
        onDelta: (chunk) => {
          fullAssistantMessage += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((m, i) => 
                i === prev.length - 1 ? { ...m, content: m.content + chunk } : m
              );
            }
            return [...prev, { role: "assistant", content: chunk }];
          });
        },
        onDone: () => {
          setIsLoading(false);
          // Speak the complete response
          if (isSpeechEnabled && fullAssistantMessage) {
            textToSpeech.current.speak(fullAssistantMessage);
          }
        },
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to start interview. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      try {
        const audioBlob = await audioRecorder.current.stop();
        setIsRecording(false);
        setIsLoading(true);
        
        console.log('Audio blob size:', audioBlob.size);
        
        // Convert to base64
        const base64Audio = await convertBlobToBase64(audioBlob);
        console.log('Base64 audio length:', base64Audio.length);
        
        // Transcribe audio
        const { data, error } = await supabase.functions.invoke('transcribe-audio', {
          body: { audio: base64Audio }
        });

        console.log('Transcription response:', { data, error });

        if (error) {
          console.error('Transcription error:', error);
          throw new Error(error.message || 'Failed to transcribe audio');
        }

        if (data?.error) {
          console.error('Transcription API error:', data.error);
          throw new Error(data.error);
        }

        const transcribedText = data?.text;
        
        if (transcribedText) {
          setInput(transcribedText);
          toast({
            title: "Transcription complete",
            description: "Your voice has been transcribed",
          });
        } else {
          throw new Error('No transcription text received');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Transcription error:', error);
        setIsLoading(false);
        toast({
          title: "Transcription failed",
          description: error instanceof Error ? error.message : "Failed to transcribe audio. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      try {
        await audioRecorder.current.start();
        setIsRecording(true);
        toast({
          title: "Recording started",
          description: "Speak your answer clearly",
        });
      } catch (error) {
        console.error('Recording error:', error);
        toast({
          title: "Error",
          description: "Failed to start recording. Please check microphone permissions.",
          variant: "destructive",
        });
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let assistantContent = "";
      await streamChat({
        messages: [...messages, userMessage],
        onDelta: (chunk) => {
          assistantContent += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((m, i) => 
                i === prev.length - 1 ? { ...m, content: assistantContent } : m
              );
            }
            return [...prev, { role: "assistant", content: assistantContent }];
          });
        },
        onDone: () => {
          setIsLoading(false);
          // Speak the complete response
          if (isSpeechEnabled && assistantContent) {
            textToSpeech.current.speak(assistantContent);
          }
        },
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const streamChat = async ({
    messages,
    onDelta,
    onDone,
  }: {
    messages: Message[];
    onDelta: (chunk: string) => void;
    onDone: () => void;
  }) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mock-interview`;

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages, role: selectedRole, resumeContext }),
    });

    if (!resp.ok || !resp.body) throw new Error("Failed to start stream");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    onDone();
  };

  const endInterview = async (videoMessages?: Array<{ role: string; content: string }>) => {
    setIsGeneratingReport(true);
    textToSpeech.current.stop();

    try {
      // Use video messages if provided, otherwise use chat messages
      const interviewMessages = videoMessages || messages;
      
      const { data, error } = await supabase.functions.invoke('analyze-interview', {
        body: { messages: interviewMessages, role: selectedRole }
      });

      if (error) throw error;

      setInterviewAnalysis(data.analysis);
      setShowReport(true);
      setIsInterviewStarted(false);
      
      toast({
        title: "Interview completed",
        description: "Your performance report is ready",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const resetInterview = () => {
    setMessages([]);
    setIsInterviewStarted(false);
    setShowReport(false);
    setInterviewAnalysis(null);
    setInput("");
    setResumeFile(null);
    setResumeContext("");
    textToSpeech.current.stop();
  };

  const toggleSpeech = () => {
    const newEnabled = !isSpeechEnabled;
    setIsSpeechEnabled(newEnabled);
    textToSpeech.current.setEnabled(newEnabled);
    if (!newEnabled) {
      textToSpeech.current.stop();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="text-4xl font-bold mb-3 gradient-text">AI Mock Interview</h1>
            <p className="text-lg text-muted-foreground">
              Upload your resume and practice with real-time voice interaction
            </p>
          </div>

          {!isInterviewStarted && !showReport ? (
            <Card className="border-2 hover:border-primary/50 transition-all animate-scale-in shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Prepare for Interview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Resume (PDF/DOC)</label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <Upload className="h-5 w-5" />
                      <span>{resumeFile ? resumeFile.name : "Choose file"}</span>
                    </label>
                  </div>
                  {isAnalyzingResume && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing your resume...
                    </p>
                  )}
                  {resumeContext && (
                    <p className="text-sm text-green-600">✓ Resume analyzed successfully</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Position</label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Interview Mode</label>
                  <Tabs value={interviewMode} onValueChange={(v) => setInterviewMode(v as "video" | "chat")} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="video" className="gap-2">
                        <Video className="h-4 w-4" />
                        Video Interview
                      </TabsTrigger>
                      <TabsTrigger value="chat" className="gap-2">
                        <Mic className="h-4 w-4" />
                        Voice Chat
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="glass p-6 rounded-lg border border-primary/20">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    {interviewMode === "video" ? (
                      <><Video className="h-5 w-5 text-primary" /> Video Interview</>
                    ) : (
                      <><Volume2 className="h-5 w-5 text-primary" /> Voice Chat Interview</>
                    )}
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {interviewMode === "video" ? (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Face-to-face video conversation with AI</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Real-time voice interaction and visual feedback</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Professional interview environment simulation</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Real-time voice interaction with AI interviewer</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Contextual questions based on your resume</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Instant feedback and follow-up questions</span>
                        </li>
                      </>
                    )}
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Comprehensive performance evaluation</span>
                    </li>
                  </ul>
                </div>

                <Button 
                  onClick={startInterview} 
                  disabled={!resumeContext || isAnalyzingResume}
                  className="w-full gap-2 hover-lift hover-glow text-lg py-6 bg-gradient-to-r from-primary to-accent"
                  size="lg"
                >
                  {interviewMode === "video" ? "Start Video Interview" : "Start Voice Interview"}
                  {interviewMode === "video" ? <Video className="h-5 w-5" /> : <Send className="h-5 w-5" />}
                </Button>
              </CardContent>
            </Card>
          ) : isInterviewStarted && interviewMode === "video" ? (
            <VideoInterview 
              role={selectedRole}
              resumeContext={resumeContext}
              onEndInterview={endInterview}
            />
          ) : isInterviewStarted ? (
            <Card className="border-2 animate-scale-in shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">
                  Interview: {selectedRole}
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleSpeech}
                    className="gap-2"
                  >
                    {isSpeechEnabled ? (
                      <>
                        <Volume2 className="h-4 w-4" />
                        Voice On
                      </>
                    ) : (
                      <>
                        <VolumeX className="h-4 w-4" />
                        Voice Off
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetInterview}
                    className="gap-2 hover-lift"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[400px] pr-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.role === "user"
                              ? "bg-gradient-to-r from-primary to-accent text-white"
                              : "glass border border-primary/20"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role === "user" && (
                      <div className="flex justify-start">
                        <div className="glass border border-primary/20 p-4 rounded-2xl">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {!showReport ? (
                  <>
                    <div className="flex gap-2">
                      <Button
                        onClick={toggleRecording}
                        variant={isRecording ? "destructive" : "outline"}
                        size="lg"
                        className="gap-2"
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="h-5 w-5" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Mic className="h-5 w-5" />
                            Voice
                          </>
                        )}
                      </Button>
                      <Textarea
                        placeholder="Or type your answer here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        className="min-h-[80px] resize-none"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        className="gap-2 hover-lift hover-glow bg-gradient-to-r from-primary to-accent"
                        size="lg"
                      >
                        {isLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    
                    {messages.length > 4 && (
                      <Button
                        onClick={() => endInterview()}
                        disabled={isGeneratingReport}
                        className="w-full gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                        size="lg"
                      >
                        {isGeneratingReport ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Generating Report...
                          </>
                        ) : (
                          <>End Interview & Get Report</>
                        )}
                      </Button>
                    )}
                  </>
                ) : interviewAnalysis ? (
                  <div className="space-y-6 animate-slide-up">
                    <div className="text-center p-6 glass rounded-lg border-2 border-primary/30">
                      <h3 className="text-3xl font-bold mb-2">Interview Performance</h3>
                      <div className="text-6xl font-bold gradient-text">
                        {interviewAnalysis.overallScore}/100
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="hover-lift">
                        <CardHeader>
                          <CardTitle className="text-sm">Technical Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-primary mb-2">
                            {interviewAnalysis.technicalSkills.rating}/10
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {interviewAnalysis.technicalSkills.feedback}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="hover-lift">
                        <CardHeader>
                          <CardTitle className="text-sm">Communication</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-primary mb-2">
                            {interviewAnalysis.communication.rating}/10
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {interviewAnalysis.communication.feedback}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="hover-lift">
                        <CardHeader>
                          <CardTitle className="text-sm">Problem Solving</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-primary mb-2">
                            {interviewAnalysis.problemSolving.rating}/10
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {interviewAnalysis.problemSolving.feedback}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border-green-500/30 hover-lift">
                      <CardHeader>
                        <CardTitle className="text-green-600 flex items-center gap-2">
                          ✓ Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {interviewAnalysis.strengths.map((strength, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-600 mt-1">•</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-orange-500/30 hover-lift">
                      <CardHeader>
                        <CardTitle className="text-orange-600 flex items-center gap-2">
                          ⚠ Areas Lacking
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {interviewAnalysis.weaknesses.map((weakness, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-orange-600 mt-1">•</span>
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-500/30 hover-lift">
                      <CardHeader>
                        <CardTitle className="text-blue-600 flex items-center gap-2">
                          💡 Improvement Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {interviewAnalysis.improvements.map((improvement, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-600 mt-1">•</span>
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="glass border-primary/30 hover-lift">
                      <CardHeader>
                        <CardTitle>Overall Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="leading-relaxed">{interviewAnalysis.summary}</p>
                      </CardContent>
                    </Card>

                    <Button
                      onClick={resetInterview}
                      className="w-full gap-2 hover-lift hover-glow"
                      size="lg"
                    >
                      <RotateCcw className="h-5 w-5" />
                      Start New Interview
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : showReport && interviewAnalysis ? (
            <div className="space-y-6 animate-slide-up">
              {/* ... keep existing code (report display) */}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MockInterviewPage;
