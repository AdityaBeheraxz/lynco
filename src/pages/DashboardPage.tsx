import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { User, Briefcase, Target, Award, TrendingUp, CheckCircle2, Circle } from "lucide-react";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>({});
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // Fetch skills
      const { data: skills } = await supabase
        .from("skills")
        .select("skill_name")
        .eq("user_id", user.id);

      // Fetch certifications
      const { data: certs } = await supabase
        .from("certifications")
        .select("certification_name")
        .eq("user_id", user.id);

      // Fetch projects
      const { data: projects } = await supabase
        .from("projects")
        .select("description")
        .eq("user_id", user.id);

      // Fetch preferences
      const { data: prefs } = await supabase
        .from("career_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // Fetch applications
      const { data: apps } = await supabase
        .from("internship_applications")
        .select("*")
        .eq("user_id", user.id)
        .order("applied_at", { ascending: false });

      setUserProfile({
        ...profile,
        skills: skills?.map(s => s.skill_name) || [],
        certifications: certs?.map(c => c.certification_name) || [],
        projects: projects?.[0]?.description || "",
        interests: prefs?.interests || "",
        preferredLocations: prefs?.preferred_locations || []
      });
      
      setApplications(apps || []);
    };

    fetchData();
  }, []);

  const profileCompletion = useMemo(() => {
    let score = 0;
    let completed = {
      basic: false,
      skills: false,
      projects: false,
      certifications: false
    };

    if (userProfile.name && userProfile.branch && userProfile.year && userProfile.cgpa) {
      score += 40;
      completed.basic = true;
    }
    if (userProfile.skills && userProfile.skills.length > 0) {
      score += 30;
      completed.skills = true;
    }
    if (userProfile.interests && userProfile.interests.length > 0) {
      score += 15;
    }
    if (userProfile.projects && userProfile.projects.length > 0) {
      score += 10;
      completed.projects = true;
    }
    if (userProfile.certifications && userProfile.certifications.length > 0) {
      score += 5;
      completed.certifications = true;
    }

    return { score, completed };
  }, [userProfile]);

  const careerMatches = useMemo(() => {
    if (!userProfile.skills || userProfile.skills.length === 0) return 0;
    return Math.min(userProfile.skills.length, 8);
  }, [userProfile]);

  return (
    <div className="min-h-screen bg-background mesh-gradient">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-slide-up">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome back, {userProfile.name || "Student"}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your career journey and internship applications
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="cursor-pointer hover-lift hover-glow transition-all animate-scale-in group" onClick={() => navigate("/recommendations")}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="relative">
                    <Target className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 blur-lg bg-primary/20 group-hover:bg-primary/40 transition-colors"></div>
                  </div>
                  <Badge variant="secondary" className="animate-pulse">Active</Badge>
                </div>
                <div className="text-2xl font-bold gradient-text">{careerMatches}</div>
                <div className="text-sm text-muted-foreground">Career Matches</div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover-lift hover-glow transition-all animate-scale-in animation-delay-100 group" onClick={() => navigate("/internships")}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="relative">
                    <Briefcase className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 blur-lg bg-primary/20 group-hover:bg-primary/40 transition-colors"></div>
                  </div>
                  <Badge variant="secondary">
                    {applications.length > 0 ? "In Progress" : "Start"}
                  </Badge>
                </div>
                <div className="text-2xl font-bold gradient-text">{applications.length}</div>
                <div className="text-sm text-muted-foreground">Applications</div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover-lift hover-glow transition-all animate-scale-in animation-delay-200 group" onClick={() => navigate("/profile")}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="relative">
                    <Award className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 blur-lg bg-primary/20 group-hover:bg-primary/40 transition-colors"></div>
                  </div>
                  <Badge variant="secondary">Verified</Badge>
                </div>
                <div className="text-2xl font-bold gradient-text">{userProfile.skills?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Skills Added</div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover-lift hover-glow transition-all animate-scale-in animation-delay-300 group" onClick={() => navigate("/profile")}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="relative">
                    <TrendingUp className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 blur-lg bg-primary/20 group-hover:bg-primary/40 transition-colors"></div>
                  </div>
                  <Badge variant="secondary">
                    {profileCompletion.score >= 80 ? "Excellent" : profileCompletion.score >= 50 ? "Good" : "Growing"}
                  </Badge>
                </div>
                <div className="text-2xl font-bold gradient-text">{profileCompletion.score}%</div>
                <div className="text-sm text-muted-foreground">Profile Score</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Completion */}
            <div className="lg:col-span-2">
              <Card className="mb-6 hover-lift transition-all animate-fade-in">
                <CardHeader>
                  <CardTitle>Profile Completion</CardTitle>
                  <CardDescription>Complete your profile to get better matches</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm text-muted-foreground">{profileCompletion.score}%</span>
                      </div>
                      <Progress value={profileCompletion.score} className="h-2" />
                    </div>

                    <div className="space-y-3 pt-4">
                      <div className={`flex items-center gap-3 ${!profileCompletion.completed.basic && "opacity-50"}`}>
                        {profileCompletion.completed.basic ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span className="text-sm">Basic Information</span>
                      </div>
                      <div className={`flex items-center gap-3 ${!profileCompletion.completed.skills && "opacity-50"}`}>
                        {profileCompletion.completed.skills ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span className="text-sm">Skills & Interests</span>
                      </div>
                      <div className={`flex items-center gap-3 ${!profileCompletion.completed.projects && "opacity-50"}`}>
                        {profileCompletion.completed.projects ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span className="text-sm">Projects Portfolio</span>
                      </div>
                      <div className={`flex items-center gap-3 ${!profileCompletion.completed.certifications && "opacity-50"}`}>
                        {profileCompletion.completed.certifications ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span className="text-sm">Certifications</span>
                      </div>
                    </div>

                    <Button className="w-full mt-4" onClick={() => navigate("/profile")}>
                      Complete Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card className="hover-lift transition-all animate-fade-in animation-delay-200">
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Track your internship applications</CardDescription>
                </CardHeader>
                <CardContent>
                  {applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.slice(0, 5).map((app, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                          <div>
                            <div className="font-medium">{app.company}</div>
                            <div className="text-sm text-muted-foreground">{app.role}</div>
                          </div>
                          <Badge variant="outline">Applied</Badge>
                        </div>
                      ))}
                      {applications.length > 5 && (
                        <Button 
                          variant="ghost" 
                          className="w-full" 
                          onClick={() => navigate("/internships")}
                        >
                          View All {applications.length} Applications
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground mb-4">No applications yet</p>
                      <Button onClick={() => navigate("/internships")}>
                        Browse Internships
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Profile */}
              <Card className="hover-lift transition-all animate-fade-in animation-delay-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Branch</div>
                    <div className="font-medium">{userProfile.branch || "Not Set"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Year</div>
                    <div className="font-medium">{userProfile.year || "Not Set"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">CGPA</div>
                    <div className="font-medium">{userProfile.cgpa || "Not Set"}</div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    onClick={() => navigate("/profile")}
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="hover-lift transition-all animate-fade-in animation-delay-300">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/recommendations")}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    View Recommendations
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/internships")}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Browse Internships
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/profile")}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Update Skills
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
