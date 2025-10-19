import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Sparkles, Briefcase, LayoutDashboard, Moon, Sun, MessageSquare, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { signOut, isAuthenticated } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold hover-scale"
        >
          <div className="relative">
            <GraduationCap className="h-6 w-6 text-primary animate-float" />
            <div className="absolute inset-0 blur-lg bg-primary/20 animate-pulse"></div>
          </div>
          <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Lynco
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            to="/recommendations" 
            className={`text-sm font-medium transition-all hover:text-primary hover-lift group ${
              isActive("/recommendations") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Sparkles className="inline h-4 w-4 mr-1 group-hover:animate-spin" />
            AI Recommendations
          </Link>
          <Link 
            to="/internships" 
            className={`text-sm font-medium transition-all hover:text-primary hover-lift group ${
              isActive("/internships") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Briefcase className="inline h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
            Internships
          </Link>
          <Link 
            to="/mock-interview" 
            className={`text-sm font-medium transition-all hover:text-primary hover-lift group ${
              isActive("/mock-interview") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <MessageSquare className="inline h-4 w-4 mr-1 group-hover:rotate-12 transition-transform" />
            Mock Interview
          </Link>
          <Link 
            to="/dashboard" 
            className={`text-sm font-medium transition-all hover:text-primary hover-lift group ${
              isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <LayoutDashboard className="inline h-4 w-4 mr-1 group-hover:rotate-12 transition-transform" />
            Dashboard
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mr-2"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          {isAuthenticated ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut}
              className="gap-2 hover-scale"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm" className="hover-scale shadow-md hover:shadow-lg">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
