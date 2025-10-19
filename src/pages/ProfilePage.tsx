import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, Code, Target, X } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    branch: "",
    year: "",
    cgpa: "",
    skills: [] as string[],
    certifications: [] as string[],
    projects: "",
    linkedinUrl: "",
    githubUrl: "",
    resumeUrl: "",
    interests: "",
    preferredLocations: [] as string[],
  });
  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const { data: skills } = await supabase
        .from("skills")
        .select("skill_name")
        .eq("user_id", user.id);

      const { data: certs } = await supabase
        .from("certifications")
        .select("certification_name")
        .eq("user_id", user.id);

      const { data: projects } = await supabase
        .from("projects")
        .select("description")
        .eq("user_id", user.id)
        .maybeSingle();

      const { data: prefs } = await supabase
        .from("career_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile) {
        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          college: profile.college || "",
          branch: profile.branch || "",
          year: profile.year || "",
          cgpa: profile.cgpa?.toString() || "",
          skills: skills?.map(s => s.skill_name) || [],
          certifications: certs?.map(c => c.certification_name) || [],
          projects: projects?.description || "",
          linkedinUrl: profile.linkedin_url || "",
          githubUrl: profile.github_url || "",
          resumeUrl: profile.resume_url || "",
          interests: prefs?.interests || "",
          preferredLocations: prefs?.preferred_locations || []
        });
      }
    };

    fetchProfile();
  }, []);

  const branches = ["CSE", "IT", "ECE", "EEE", "Mechanical", "Civil", "MBA", "MCA"];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year"];
  const bputColleges = [
    "CET Bhubaneswar", 
    "VSSUT Burla", 
    "IGIT Sarang", 
    "UCE Burla",
    "NIST Berhampur",
    "Other BPUT Affiliated College"
  ];

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const addCertification = () => {
    if (certInput.trim() && !formData.certifications.includes(certInput.trim())) {
      setFormData({ ...formData, certifications: [...formData.certifications, certInput.trim()] });
      setCertInput("");
    }
  };

  const removeCertification = (cert: string) => {
    setFormData({ ...formData, certifications: formData.certifications.filter(c => c !== cert) });
  };

  const addLocation = () => {
    if (locationInput.trim() && !formData.preferredLocations.includes(locationInput.trim())) {
      setFormData({ ...formData, preferredLocations: [...formData.preferredLocations, locationInput.trim()] });
      setLocationInput("");
    }
  };

  const removeLocation = (location: string) => {
    setFormData({ ...formData, preferredLocations: formData.preferredLocations.filter(l => l !== location) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.college || !formData.branch || !formData.year) {
      toast.error("Please fill in all required fields");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    try {
      // Update profile
      await supabase
        .from("profiles")
        .update({
          name: formData.name,
          email: formData.email,
          college: formData.college,
          branch: formData.branch,
          year: formData.year,
          cgpa: formData.cgpa ? parseFloat(formData.cgpa) : null,
          linkedin_url: formData.linkedinUrl,
          github_url: formData.githubUrl
        })
        .eq("user_id", user.id);

      // Delete existing skills and insert new ones
      await supabase.from("skills").delete().eq("user_id", user.id);
      if (formData.skills.length > 0) {
        await supabase.from("skills").insert(
          formData.skills.map(skill => ({ user_id: user.id, skill_name: skill }))
        );
      }

      // Delete existing certifications and insert new ones
      await supabase.from("certifications").delete().eq("user_id", user.id);
      if (formData.certifications.length > 0) {
        await supabase.from("certifications").insert(
          formData.certifications.map(cert => ({ user_id: user.id, certification_name: cert }))
        );
      }

      // Upsert projects
      if (formData.projects) {
        await supabase.from("projects").upsert({
          user_id: user.id,
          description: formData.projects
        });
      }

      // Upsert career preferences
      await supabase.from("career_preferences").upsert({
        user_id: user.id,
        interests: formData.interests,
        preferred_locations: formData.preferredLocations
      });

      toast.success("Profile created successfully! Generating AI recommendations...");
      navigate("/recommendations");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Build Your AI-Powered Profile</h1>
            <p className="text-muted-foreground">
              Create your comprehensive student profile for personalized career recommendations and internship matching
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>
                Complete your profile to get AI-powered career recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Basic Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="college">College / Institution *</Label>
                    <select
                      id="college"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    >
                      <option value="">Select Your College</option>
                      {bputColleges.map(college => (
                        <option key={college} value={college}>{college}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch *</Label>
                      <select
                        id="branch"
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      >
                        <option value="">Select Branch</option>
                        {branches.map(branch => (
                          <option key={branch} value={branch}>{branch}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year *</Label>
                      <select
                        id="year"
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      >
                        <option value="">Select Year</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cgpa">CGPA / Percentage</Label>
                      <Input
                        id="cgpa"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 8.5"
                        value={formData.cgpa}
                        onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Skills & Competencies */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Skills & Competencies
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Technical Skills</Label>
                    <div className="flex gap-2">
                    <Input
                      id="skills"
                      placeholder="e.g., Python, React, Machine Learning"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill} variant="secondary">
                      <Code className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                    </div>
                    {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="gap-1">
                          {skill}
                          <X 
                            className="h-3 w-3 cursor-pointer hover:text-destructive" 
                            onClick={() => removeSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                    )}
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="certifications">Certifications</Label>
                    <div className="flex gap-2">
                      <Input
                        id="certifications"
                        placeholder="e.g., AWS Certified, Google Analytics"
                        value={certInput}
                        onChange={(e) => setCertInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                      />
                      <Button type="button" onClick={addCertification} variant="secondary">
                        Add
                      </Button>
                    </div>
                    {formData.certifications.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.certifications.map(cert => (
                          <Badge key={cert} variant="outline" className="gap-1">
                            {cert}
                            <X 
                              className="h-3 w-3 cursor-pointer hover:text-destructive" 
                              onClick={() => removeCertification(cert)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Projects & Portfolio */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Projects & Portfolio
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="projects">Projects Description</Label>
                    <Textarea
                      id="projects"
                      placeholder="Describe your key projects, achievements, and technical work..."
                      rows={3}
                      value={formData.projects}
                      onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub Profile URL</Label>
                      <Input
                        id="github"
                        placeholder="https://github.com/yourusername"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Career Preferences */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold">Career Preferences</h3>

                  <div className="space-y-2">
                    <Label htmlFor="interests">Career Interests & Goals</Label>
                    <Textarea
                      id="interests"
                      placeholder="Describe your career interests, aspirations, and preferred industries..."
                      rows={4}
                      value={formData.interests}
                      onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="locations">Preferred Job Locations</Label>
                    <div className="flex gap-2">
                      <Input
                        id="locations"
                        placeholder="e.g., Bangalore, Hyderabad, Remote"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
                      />
                      <Button type="button" onClick={addLocation} variant="secondary">
                        Add
                      </Button>
                    </div>
                    {formData.preferredLocations.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.preferredLocations.map(location => (
                          <Badge key={location} variant="secondary" className="gap-1">
                            {location}
                            <X 
                              className="h-3 w-3 cursor-pointer hover:text-destructive" 
                              onClick={() => removeLocation(location)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full gap-2">
                  <Target className="h-5 w-5" />
                  Get AI Recommendations
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
