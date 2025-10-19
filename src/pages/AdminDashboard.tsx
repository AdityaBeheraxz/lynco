import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Building2, 
  Download,
  BarChart3,
  GraduationCap,
  AlertTriangle
} from "lucide-react";

const AdminDashboard = () => {
  // Mock data for demonstration
  const stats = {
    totalStudents: 5432,
    placedStudents: 4345,
    activeInternships: 245,
    partnerCompanies: 87,
    placementRate: 80
  };

  const branchWiseData = [
    { branch: "CSE", students: 1200, placed: 1050, percentage: 87.5 },
    { branch: "IT", students: 800, placed: 720, percentage: 90 },
    { branch: "ECE", students: 900, placed: 702, percentage: 78 },
    { branch: "EEE", students: 700, placed: 525, percentage: 75 },
    { branch: "Mechanical", students: 1100, placed: 770, percentage: 70 },
    { branch: "Civil", students: 732, placed: 578, percentage: 79 },
  ];

  const skillGapAnalysis = [
    { skill: "Cloud Computing", gap: "High", affectedStudents: 2100, priority: "Critical" },
    { skill: "System Design", gap: "High", affectedStudents: 1800, priority: "Critical" },
    { skill: "DevOps Tools", gap: "Medium", affectedStudents: 1500, priority: "High" },
    { skill: "Data Structures", gap: "Medium", affectedStudents: 1200, priority: "High" },
    { skill: "Soft Skills", gap: "Medium", affectedStudents: 2500, priority: "Medium" },
  ];

  const topRecruiters = [
    { company: "TCS", hires: 450, avgPackage: "₹3.5 LPA" },
    { company: "Infosys", hires: 380, avgPackage: "₹4.0 LPA" },
    { company: "Wipro", hires: 320, avgPackage: "₹3.8 LPA" },
    { company: "Tech Mahindra", hires: 250, avgPackage: "₹4.2 LPA" },
    { company: "Cognizant", hires: 200, avgPackage: "₹4.5 LPA" },
  ];

  const industryDemand = [
    { sector: "IT Services", demand: "Very High", growth: "+28%" },
    { sector: "Product Development", demand: "High", growth: "+35%" },
    { sector: "Data Analytics", demand: "High", growth: "+42%" },
    { sector: "Cloud Services", demand: "Very High", growth: "+45%" },
    { sector: "Manufacturing", demand: "Medium", growth: "+12%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">BPUT Placement Analytics Dashboard</h1>
              <p className="text-muted-foreground text-lg">
                Comprehensive employability insights and placement trends across all affiliated colleges
              </p>
            </div>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{stats.placedStudents.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Placed Students</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{stats.activeInternships}</div>
                <div className="text-sm text-muted-foreground">Active Internships</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">{stats.partnerCompanies}</div>
                <div className="text-sm text-muted-foreground">Partner Companies</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-600">{stats.placementRate}%</div>
                <div className="text-sm text-muted-foreground">Placement Rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="branches" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="branches">Branch-wise Analysis</TabsTrigger>
              <TabsTrigger value="skills">Skill Gap Analysis</TabsTrigger>
              <TabsTrigger value="recruiters">Top Recruiters</TabsTrigger>
              <TabsTrigger value="trends">Industry Trends</TabsTrigger>
            </TabsList>

            {/* Branch-wise Analysis */}
            <TabsContent value="branches" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Placement Statistics by Branch
                  </CardTitle>
                  <CardDescription>
                    Comparative analysis of placement rates across different engineering disciplines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {branchWiseData.map((branch) => (
                      <div key={branch.branch} className="border-b pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-semibold text-lg">{branch.branch}</div>
                            <div className="text-sm text-muted-foreground">
                              {branch.placed} of {branch.students} students placed
                            </div>
                          </div>
                          <Badge 
                            variant={branch.percentage >= 85 ? "default" : branch.percentage >= 75 ? "secondary" : "destructive"}
                            className="text-base px-3 py-1"
                          >
                            {branch.percentage}%
                          </Badge>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${branch.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skill Gap Analysis */}
            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Critical Skill Gaps Identified
                  </CardTitle>
                  <CardDescription>
                    Areas requiring immediate intervention and training programs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {skillGapAnalysis.map((item, idx) => (
                      <div key={idx} className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="font-semibold text-lg">{item.skill}</div>
                            <Badge variant={item.gap === "High" ? "destructive" : "secondary"}>
                              {item.gap} Gap
                            </Badge>
                            <Badge variant="outline">
                              {item.priority} Priority
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.affectedStudents.toLocaleString()} students affected
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Launch Training Program
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Top Recruiters */}
            <TabsContent value="recruiters" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Top Hiring Partners
                  </CardTitle>
                  <CardDescription>
                    Companies with highest recruitment numbers and package trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topRecruiters.map((recruiter, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{recruiter.company}</div>
                            <div className="text-sm text-muted-foreground">
                              {recruiter.hires} hires • Avg Package: {recruiter.avgPackage}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline">View Details</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Industry Trends */}
            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Industry Demand Forecast
                  </CardTitle>
                  <CardDescription>
                    Sector-wise hiring trends and growth projections for strategic planning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {industryDemand.map((industry, idx) => (
                      <div key={idx} className="p-4 border rounded-lg hover:border-primary/50 transition-all">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-lg">{industry.sector}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={industry.demand === "Very High" ? "default" : "secondary"}>
                                {industry.demand} Demand
                              </Badge>
                              <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                {industry.growth}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View Recommendations
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI-Powered Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-medium text-blue-900">
                      💡 Increase focus on Cloud Computing and DevOps training programs
                    </div>
                    <div className="text-sm text-blue-700 mt-1">
                      High industry demand with 45% growth. 2,100 students need upskilling.
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="font-medium text-orange-900">
                      ⚠️ Mechanical & Civil branches need intervention
                    </div>
                    <div className="text-sm text-orange-700 mt-1">
                      Below average placement rates. Consider industry-specific skill programs.
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="font-medium text-green-900">
                      ✅ IT/CSE branches performing excellently
                    </div>
                    <div className="text-sm text-green-700 mt-1">
                      90% placement rate. Maintain current curriculum and industry partnerships.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
