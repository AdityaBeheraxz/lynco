import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingUp, Award, ExternalLink, Loader2, Target, BookOpen, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CareerRecommendation {
  title: string;
  matchScore: number;
  description: string;
  keySkills: string[];
  growthRate: string;
  salaryRange: string;
  learningPath: string[];
}

interface SkillGap {
  skill: string;
  importance: "high" | "medium" | "low";
  resource: string;
}

const RecommendationsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [careerReadinessScore, setCareerReadinessScore] = useState(0);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);

  useEffect(() => {
    const fetchProfileAndGenerateRecommendations = async () => {
      try {
        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          toast.error("Please sign in to view recommendations");
          navigate("/auth");
          return;
        }

        // Fetch profile from database
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          toast.error("Failed to load profile");
          return;
        }

        if (!profile) {
          toast.error("Please complete your profile first");
          navigate("/profile");
          return;
        }

        // Simulate AI processing
        setTimeout(() => {
          const mockRecommendations: CareerRecommendation[] = [
            {
              title: "Full Stack Developer",
              matchScore: 95,
              description: "Build end-to-end web applications using modern frameworks and cloud technologies",
              keySkills: ["React", "Node.js", "MongoDB", "AWS"],
              growthRate: "22% annually",
              salaryRange: "₹6-12 LPA",
              learningPath: ["Master React Advanced Patterns", "Learn Node.js Backend Development", "AWS Cloud Certification"]
            },
            {
              title: "Data Scientist",
              matchScore: 88,
              description: "Extract insights from data using machine learning and statistical analysis",
              keySkills: ["Python", "TensorFlow", "Pandas", "SQL"],
              growthRate: "28% annually",
              salaryRange: "₹7-15 LPA",
              learningPath: ["Python for Data Science", "Machine Learning Fundamentals", "Advanced Statistics"]
            },
            {
              title: "DevOps Engineer",
              matchScore: 82,
              description: "Streamline development and deployment processes with automation and CI/CD",
              keySkills: ["Docker", "Kubernetes", "Jenkins", "Linux"],
              growthRate: "25% annually",
              salaryRange: "₹6-14 LPA",
              learningPath: ["Docker & Containerization", "Kubernetes Orchestration", "CI/CD Pipeline Setup"]
            },
            {
              title: "Mobile App Developer",
              matchScore: 78,
              description: "Create engaging mobile experiences for iOS and Android platforms",
              keySkills: ["React Native", "Flutter", "Swift", "Kotlin"],
              growthRate: "19% annually",
              salaryRange: "₹5-11 LPA",
              learningPath: ["Flutter Development", "Mobile UI/UX Design", "App Store Deployment"]
            }
          ];
          
          const mockSkillGaps: SkillGap[] = [
            { skill: "Cloud Computing (AWS/Azure)", importance: "high", resource: "AWS Certified Solutions Architect" },
            { skill: "System Design", importance: "high", resource: "System Design Interview Course" },
            { skill: "Docker & Kubernetes", importance: "medium", resource: "Docker Mastery Course" },
            { skill: "Agile Methodologies", importance: "medium", resource: "Scrum Master Certification" },
            { skill: "Communication Skills", importance: "low", resource: "Professional Communication Workshop" },
          ];
          
          setRecommendations(mockRecommendations);
          setCareerReadinessScore(75);
          setSkillGaps(mockSkillGaps);
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
        setLoading(false);
      }
    };

    fetchProfileAndGenerateRecommendations();
  }, [navigate]);

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 80) return "text-blue-600 bg-blue-50 border-blue-200";
    return "text-purple-600 bg-purple-50 border-purple-200";
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getImportanceColor = (importance: string) => {
    if (importance === "high") return "destructive";
    if (importance === "medium") return "default";
    return "secondary";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-12 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Analyzing Your Profile with AI</h2>
            <p className="text-muted-foreground">Mapping your skills to industry demands and generating personalized career paths...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Your AI-Powered Career Analysis</h1>
            <p className="text-muted-foreground text-lg">
              Personalized recommendations based on your profile, industry trends, and skill assessment
            </p>
          </div>

          {/* Career Readiness Score */}
          <Card className="mb-8 border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    Career Readiness Score
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Your overall employability assessment based on skills, experience, and market demands
                  </CardDescription>
                </div>
                <div className={`text-5xl font-bold ${getReadinessColor(careerReadinessScore)}`}>
                  {careerReadinessScore}%
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={careerReadinessScore} className="h-3 mb-6" />
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Profile Completeness</div>
                    <div className="text-sm text-muted-foreground">Strong foundation</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium">Skill Relevance</div>
                    <div className="text-sm text-muted-foreground">Needs improvement</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Market Alignment</div>
                    <div className="text-sm text-muted-foreground">Good match</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skill Gap Analysis */}
          <Card className="mb-8 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Recommended Skills to Learn
              </CardTitle>
              <CardDescription>
                Bridge these skill gaps to improve your career prospects and competitiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {skillGaps.map((gap, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{gap.skill}</div>
                        <Badge variant={getImportanceColor(gap.importance)}>
                          {gap.importance} priority
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Recommended: {gap.resource}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Start Learning
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Career Recommendations */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Top Career Matches</h2>
            <p className="text-muted-foreground">
              AI-curated career paths tailored to your unique profile and aspirations
            </p>
          </div>

          <div className="grid gap-6">
            {recommendations.map((rec, idx) => (
              <Card key={idx} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-2xl">{rec.title}</CardTitle>
                        <Badge className={`${getMatchColor(rec.matchScore)} border`}>
                          {rec.matchScore}% Match
                        </Badge>
                      </div>
                      <CardDescription className="text-base">{rec.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Growth Rate</div>
                        <div className="font-semibold">{rec.growthRate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Salary Range</div>
                        <div className="font-semibold">{rec.salaryRange}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Key Skills Required:</div>
                    <div className="flex flex-wrap gap-2">
                      {rec.keySkills.map(skill => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Personalized Learning Path:</div>
                    <div className="space-y-2">
                      {rec.learningPath.map((step, stepIdx) => (
                        <div key={stepIdx} className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                            {stepIdx + 1}
                          </div>
                          <span className="text-muted-foreground">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full sm:w-auto">
                    View Career Roadmap
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center space-y-4">
            <Button size="lg" onClick={() => navigate("/internships")}>
              Find Matching Internships
            </Button>
            <p className="text-sm text-muted-foreground">
              Explore internship opportunities aligned with your career recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
