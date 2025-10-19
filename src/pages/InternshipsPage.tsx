import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, MapPin, Clock, Building2, Search, Filter, X, CheckCircle2, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Internship {
  id: number;
  company: string;
  role: string;
  location: string;
  duration: string;
  stipend: string;
  skills: string[];
  type: string;
  postedDate: string;
}

const InternshipsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [appliedInternships, setAppliedInternships] = useState<number[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const { toast } = useToast();
  const internships: Internship[] = [
    {
      id: 1,
      company: "TechCorp India",
      role: "Software Development Intern",
      location: "Bangalore",
      duration: "6 months",
      stipend: "₹15,000/month",
      skills: ["React", "Node.js", "MongoDB"],
      type: "Full-time",
      postedDate: "2 days ago"
    },
    {
      id: 2,
      company: "DataMinds",
      role: "Data Science Intern",
      location: "Hyderabad",
      duration: "3 months",
      stipend: "₹12,000/month",
      skills: ["Python", "Machine Learning", "SQL"],
      type: "Full-time",
      postedDate: "1 week ago"
    },
    {
      id: 3,
      company: "CloudTech Solutions",
      role: "DevOps Intern",
      location: "Pune",
      duration: "4 months",
      stipend: "₹18,000/month",
      skills: ["Docker", "Kubernetes", "AWS"],
      type: "Full-time",
      postedDate: "3 days ago"
    },
    {
      id: 4,
      company: "AppVentures",
      role: "Mobile Development Intern",
      location: "Remote",
      duration: "6 months",
      stipend: "₹10,000/month",
      skills: ["Flutter", "React Native", "Firebase"],
      type: "Remote",
      postedDate: "5 days ago"
    },
    {
      id: 5,
      company: "WebFlow Studios",
      role: "Frontend Developer Intern",
      location: "Bhubaneswar",
      duration: "3 months",
      stipend: "₹8,000/month",
      skills: ["React", "TypeScript", "Tailwind CSS"],
      type: "Full-time",
      postedDate: "1 day ago"
    },
    {
      id: 6,
      company: "AI Innovations",
      role: "Machine Learning Intern",
      location: "Delhi",
      duration: "5 months",
      stipend: "₹20,000/month",
      skills: ["TensorFlow", "PyTorch", "NLP"],
      type: "Hybrid",
      postedDate: "4 days ago"
    },
    {
      id: 7,
      company: "InfoTech Ltd",
      role: "Backend Developer Intern",
      location: "Mumbai",
      duration: "4 months",
      stipend: "₹14,000/month",
      skills: ["Java", "Spring Boot", "MySQL"],
      type: "Full-time",
      postedDate: "6 days ago"
    },
    {
      id: 8,
      company: "CyberSec Solutions",
      role: "Cybersecurity Intern",
      location: "Bangalore",
      duration: "6 months",
      stipend: "₹16,000/month",
      skills: ["Network Security", "Ethical Hacking", "Linux"],
      type: "Hybrid",
      postedDate: "3 days ago"
    }
  ];

  const handleApply = (internship: Internship) => {
    if (appliedInternships.includes(internship.id)) {
      toast({
        title: "Already Applied",
        description: "You have already applied to this internship.",
        variant: "destructive"
      });
      return;
    }

    setAppliedInternships([...appliedInternships, internship.id]);
    toast({
      title: "Application Submitted!",
      description: `Your application for ${internship.role} at ${internship.company} has been submitted successfully.`,
    });
    setSelectedInternship(null);
  };

  const clearFilters = () => {
    setLocationFilter("all");
    setTypeFilter("all");
    setDurationFilter("all");
    setSearchQuery("");
  };

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = 
      internship.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = locationFilter === "all" || internship.location === locationFilter;
    const matchesType = typeFilter === "all" || internship.type === typeFilter;
    const matchesDuration = durationFilter === "all" || internship.duration.includes(durationFilter);

    return matchesSearch && matchesLocation && matchesType && matchesDuration;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Internship Opportunities</h1>
            <p className="text-muted-foreground text-lg">
              Discover internships tailored to your skills and interests
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by role, company, or skills..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {(locationFilter !== "all" || typeFilter !== "all" || durationFilter !== "all") && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {[locationFilter, typeFilter, durationFilter].filter(f => f !== "all").length}
                      </Badge>
                    )}
                  </Button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                  <div className="pt-4 border-t space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Location</label>
                        <Select value={locationFilter} onValueChange={setLocationFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Locations" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            <SelectItem value="Bangalore">Bangalore</SelectItem>
                            <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                            <SelectItem value="Pune">Pune</SelectItem>
                            <SelectItem value="Mumbai">Mumbai</SelectItem>
                            <SelectItem value="Delhi">Delhi</SelectItem>
                            <SelectItem value="Bhubaneswar">Bhubaneswar</SelectItem>
                            <SelectItem value="Remote">Remote</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Type</label>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Remote">Remote</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Duration</label>
                        <Select value={durationFilter} onValueChange={setDurationFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Durations" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Durations</SelectItem>
                            <SelectItem value="3">3 months</SelectItem>
                            <SelectItem value="4">4 months</SelectItem>
                            <SelectItem value="5">5 months</SelectItem>
                            <SelectItem value="6">6 months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredInternships.length} internship{filteredInternships.length !== 1 ? 's' : ''}
          </div>

          {/* Internship Listings */}
          <div className="grid gap-4">
            {filteredInternships.map((internship) => (
              <Card key={internship.id} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {internship.company}
                        </span>
                        <Badge variant="secondary" className="ml-auto">{internship.type}</Badge>
                      </div>
                      <CardTitle className="text-xl mb-1">{internship.role}</CardTitle>
                      <CardDescription className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {internship.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {internship.duration}
                        </span>
                        <span className="font-semibold text-primary">
                          {internship.stipend}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Required Skills:</div>
                    <div className="flex flex-wrap gap-2">
                      {internship.skills.map(skill => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Posted {internship.postedDate}</span>
                    <Dialog open={selectedInternship?.id === internship.id} onOpenChange={(open) => !open && setSelectedInternship(null)}>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => setSelectedInternship(internship)}
                          disabled={appliedInternships.includes(internship.id)}
                          className="gap-2"
                        >
                          {appliedInternships.includes(internship.id) ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Applied
                            </>
                          ) : (
                            "Apply Now"
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{internship.role}</DialogTitle>
                          <DialogDescription className="text-base">
                            <div className="flex items-center gap-2 mt-2">
                              <Building2 className="h-4 w-4" />
                              {internship.company}
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">Location</div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-primary" />
                                  <span>{internship.location}</span>
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">Duration</div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-primary" />
                                  <span>{internship.duration}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">Stipend</div>
                                <div className="flex items-center gap-2">
                                  <IndianRupee className="h-4 w-4 text-primary" />
                                  <span className="font-semibold text-lg">{internship.stipend}</span>
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">Type</div>
                                <Badge variant="secondary">{internship.type}</Badge>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-2">Required Skills</div>
                            <div className="flex flex-wrap gap-2">
                              {internship.skills.map(skill => (
                                <Badge key={skill} variant="outline" className="text-sm">{skill}</Badge>
                              ))}
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">About the Internship</h4>
                            <p className="text-sm text-muted-foreground">
                              Join our team as a {internship.role} and gain hands-on experience in a dynamic work environment. 
                              This internship offers excellent learning opportunities and exposure to real-world projects. 
                              You'll work alongside experienced professionals and contribute to meaningful work.
                            </p>
                          </div>

                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Responsibilities</h4>
                            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                              <li>Work on assigned projects and deliverables</li>
                              <li>Collaborate with team members and stakeholders</li>
                              <li>Learn and apply new technologies and methodologies</li>
                              <li>Participate in team meetings and code reviews</li>
                            </ul>
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button 
                              className="flex-1" 
                              onClick={() => handleApply(internship)}
                              disabled={appliedInternships.includes(internship.id)}
                            >
                              {appliedInternships.includes(internship.id) ? "Already Applied" : "Submit Application"}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedInternship(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredInternships.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No internships found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipsPage;
