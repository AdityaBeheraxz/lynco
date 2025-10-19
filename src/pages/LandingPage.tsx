import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { ArrowRight, Target, Sparkles, TrendingUp, Users, Briefcase, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Github, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-bg.jpg";
import aiIcon from "@/assets/ai-icon.png";
import internshipIcon from "@/assets/internship-icon.png";
import skillsIcon from "@/assets/skills-icon.png";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="absolute inset-0 mesh-gradient opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-float animation-delay-300"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-primary text-sm font-medium mb-6 backdrop-blur-xl shadow-lg shadow-primary/20 animate-slide-up hover-scale">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <Sparkles className="h-4 w-4 animate-pulse" />
              AI-Powered Career Guidance for BPUT Students
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-slide-up animation-delay-100">
              Empower Careers with AI —{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Smart Pathways for Every Student
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up animation-delay-200 leading-relaxed">
              AI-powered career recommendation and internship matching platform designed exclusively for 
              BPUT students. Discover your perfect career path with intelligent profiling and data-driven insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-300">
              <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl hover-lift hover-glow bg-gradient-to-r from-primary to-accent">
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Now"}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="gap-2 hover-lift glass border-primary/20 hover:border-primary/40">
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Launch Your Career
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with comprehensive career resources
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-all hover-lift hover-glow animate-scale-in group">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <img src={aiIcon} alt="AI Recommendations" className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Career Recommendations</h3>
                <p className="text-muted-foreground">
                  Get personalized career path suggestions based on your skills, interests, and market trends
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary/50 transition-all hover-lift hover-glow animate-scale-in animation-delay-100 group">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <img src={internshipIcon} alt="Internship Matching" className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Internship Matching</h3>
                <p className="text-muted-foreground">
                  Find internships that perfectly align with your profile and career aspirations
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary/50 transition-all hover-lift hover-glow animate-scale-in animation-delay-200 group">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <img src={skillsIcon} alt="Skills Assessment" className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Skills Assessment</h3>
                <p className="text-muted-foreground">
                  Comprehensive evaluation of your strengths and areas for improvement
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Users, value: "5000+", label: "Active Students" },
              { icon: Briefcase, value: "500+", label: "Internship Partners" },
              { icon: Target, value: "95%", label: "Match Accuracy" },
              { icon: TrendingUp, value: "80%", label: "Placement Rate" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center group animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="relative inline-block mb-4">
                  <stat.icon className="h-10 w-10 mx-auto text-primary group-hover:scale-125 transition-transform" />
                  <div className="absolute inset-0 blur-xl bg-primary/20 group-hover:bg-primary/30 transition-colors"></div>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary-glow to-accent text-white relative overflow-hidden animate-gradient">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-float animation-delay-300"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-up">
            Ready to Discover Your Perfect Career Path?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto animate-slide-up animation-delay-100">
            Join thousands of BPUT students who have already found their dream internships
          </p>
          <Link to="/profile">
            <Button size="lg" variant="secondary" className="gap-2 hover-lift shadow-2xl animate-slide-up animation-delay-200">
              Start Your Journey
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* About & Footer Section */}
      <footer className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* About Section */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Lynco
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                An AI-powered career guidance platform. 
                We leverage cutting-edge artificial intelligence to match students with personalized 
                career recommendations and internship opportunities based on their unique skills, 
                interests, and aspirations.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span>BPUT Campus, Rourkela, Odisha</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span>support@bputcareerhub.edu</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span>+91 1234567890</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                    Create Profile
                  </Link>
                </li>
                <li>
                  <Link to="/recommendations" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                    Get Recommendations
                  </Link>
                </li>
                <li>
                  <Link to="/internships" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                    Browse Internships
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                    Student Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                    Admin Dashboard
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                    Career Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="border-t pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-muted-foreground text-sm">
                © 2024 Lynco. All rights reserved.
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Follow Us:</span>
                <div className="flex gap-3">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all hover:scale-110 hover:shadow-lg"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all hover:scale-110 hover:shadow-lg"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all hover:scale-110 hover:shadow-lg"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all hover:scale-110 hover:shadow-lg"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all hover:scale-110 hover:shadow-lg"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
