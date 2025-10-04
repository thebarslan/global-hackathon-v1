import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
   FileText,
   Download,
   Share2,
   Plus,
   Search,
   Calendar,
   Building2,
   BarChart3,
   Eye,
   Trash2,
   Filter,
} from "lucide-react";

export function ReportsPage() {
   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Reports</h1>
               <p className="text-muted-foreground">
                  Generate and manage your analysis reports
               </p>
            </div>
            <Button className="flex items-center gap-2">
               <Plus className="h-4 w-4" />
               Generate Report
            </Button>
         </div>

         {/* Report Stats */}
         <div className="grid gap-4 md:grid-cols-4">
            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                     <FileText className="h-5 w-5 text-primary" />
                     <div>
                        <p className="text-2xl font-bold">24</p>
                        <p className="text-sm text-muted-foreground">
                           Total Reports
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                     <Download className="h-5 w-5 text-green-600" />
                     <div>
                        <p className="text-2xl font-bold">18</p>
                        <p className="text-sm text-muted-foreground">
                           Downloaded
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                     <Share2 className="h-5 w-5 text-blue-600" />
                     <div>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-sm text-muted-foreground">Shared</p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                     <Calendar className="h-5 w-5 text-orange-600" />
                     <div>
                        <p className="text-2xl font-bold">5</p>
                        <p className="text-sm text-muted-foreground">
                           This Week
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Search and Filters */}
         <Card>
            <CardHeader className="pb-3">
               <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Reports
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex gap-4">
                  <Input placeholder="Search reports..." className="flex-1" />
                  <Button variant="outline" className="flex items-center gap-2">
                     <Filter className="h-4 w-4" />
                     Filter
                  </Button>
               </div>
            </CardContent>
         </Card>

         {/* Recent Reports */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Reports
               </CardTitle>
               <CardDescription>Your latest generated reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                           <p className="font-medium">
                              Yahoo Brand Analysis Report
                           </p>
                           <p className="text-sm text-muted-foreground">
                              Generated 2 minutes ago • 1,234 posts analyzed
                           </p>
                        </div>
                     </div>
                     <Badge variant="default" className="bg-green-600">
                        Positive
                     </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                     </Button>
                     <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                     </Button>
                     <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                     </Button>
                  </div>
               </div>

               <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                           <p className="font-medium">
                              Microsoft Brand Analysis Report
                           </p>
                           <p className="text-sm text-muted-foreground">
                              Generated 1 hour ago • 856 posts analyzed
                           </p>
                        </div>
                     </div>
                     <Badge variant="default" className="bg-blue-600">
                        Neutral
                     </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                     </Button>
                     <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                     </Button>
                     <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                     </Button>
                  </div>
               </div>

               <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                           <p className="font-medium">
                              Apple Brand Analysis Report
                           </p>
                           <p className="text-sm text-muted-foreground">
                              Generated 3 hours ago • 2,156 posts analyzed
                           </p>
                        </div>
                     </div>
                     <Badge variant="default" className="bg-green-600">
                        Positive
                     </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                     </Button>
                     <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                     </Button>
                     <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                     </Button>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Report Templates */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Report Templates
               </CardTitle>
               <CardDescription>
                  Quick report generation from analysis data
               </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                     <div className="flex items-center gap-3 mb-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                           <p className="font-medium">Executive Summary</p>
                           <p className="text-sm text-muted-foreground">
                              High-level overview with key insights
                           </p>
                        </div>
                     </div>
                     <Button size="sm" className="w-full">
                        Generate Report
                     </Button>
                  </div>

                  <div className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                     <div className="flex items-center gap-3 mb-3">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <div>
                           <p className="font-medium">Detailed Analysis</p>
                           <p className="text-sm text-muted-foreground">
                              Comprehensive report with charts and data
                           </p>
                        </div>
                     </div>
                     <Button size="sm" className="w-full">
                        Generate Report
                     </Button>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Report History */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Report History
               </CardTitle>
               <CardDescription>
                  Complete history of all generated reports
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                     <FileText className="h-4 w-4 text-primary" />
                     <div>
                        <p className="font-medium">
                           Google Brand Analysis Report
                        </p>
                        <p className="text-sm text-muted-foreground">
                           Generated 1 day ago
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Badge variant="default" className="bg-green-600">
                        Positive
                     </Badge>
                     <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                     </Button>
                     <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
               </div>

               <Separator />

               <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                     <FileText className="h-4 w-4 text-primary" />
                     <div>
                        <p className="font-medium">
                           Meta Brand Analysis Report
                        </p>
                        <p className="text-sm text-muted-foreground">
                           Generated 2 days ago
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Badge variant="default" className="bg-blue-600">
                        Neutral
                     </Badge>
                     <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                     </Button>
                     <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
               </div>

               <Separator />

               <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                     <FileText className="h-4 w-4 text-primary" />
                     <div>
                        <p className="font-medium">
                           Twitter Brand Analysis Report
                        </p>
                        <p className="text-sm text-muted-foreground">
                           Generated 3 days ago
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Badge variant="default" className="bg-orange-600">
                        Mixed
                     </Badge>
                     <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                     </Button>
                     <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
