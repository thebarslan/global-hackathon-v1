import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
   BarChart3,
   Zap,
   Clock,
   CheckCircle,
   AlertCircle,
   Play,
   Pause,
   Building2,
   TrendingUp,
   Calendar,
} from "lucide-react";

export function AnalysisPage() {
   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Analysis Center</h1>
               <p className="text-muted-foreground">
                  Start new analyses and monitor ongoing processes
               </p>
            </div>
            <Button className="flex items-center gap-2">
               <Zap className="h-4 w-4" />
               Start New Analysis
            </Button>
         </div>

         {/* Analysis Stats */}
         <div className="grid gap-4 md:grid-cols-4">
            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                     <BarChart3 className="h-5 w-5 text-primary" />
                     <div>
                        <p className="text-2xl font-bold">48</p>
                        <p className="text-sm text-muted-foreground">
                           Total Analyses
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                     <Clock className="h-5 w-5 text-orange-600" />
                     <div>
                        <p className="text-2xl font-bold">3</p>
                        <p className="text-sm text-muted-foreground">
                           In Progress
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                     <CheckCircle className="h-5 w-5 text-green-600" />
                     <div>
                        <p className="text-2xl font-bold">42</p>
                        <p className="text-sm text-muted-foreground">
                           Completed
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                     <AlertCircle className="h-5 w-5 text-red-600" />
                     <div>
                        <p className="text-2xl font-bold">3</p>
                        <p className="text-sm text-muted-foreground">Failed</p>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Active Analyses */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Active Analyses
               </CardTitle>
               <CardDescription>
                  Currently running sentiment analyses
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                           <p className="font-medium">Yahoo Brand Analysis</p>
                           <p className="text-sm text-muted-foreground">
                              Started 2 minutes ago
                           </p>
                        </div>
                     </div>
                     <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <Progress value={65} className="mb-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                     <span>Processing Reddit posts...</span>
                     <span>65% complete</span>
                  </div>
               </div>

               <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                           <p className="font-medium">
                              Microsoft Brand Analysis
                           </p>
                           <p className="text-sm text-muted-foreground">
                              Started 5 minutes ago
                           </p>
                        </div>
                     </div>
                     <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <Progress value={30} className="mb-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                     <span>Fetching Reddit data...</span>
                     <span>30% complete</span>
                  </div>
               </div>

               <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                           <p className="font-medium">Apple Brand Analysis</p>
                           <p className="text-sm text-muted-foreground">
                              Started 8 minutes ago
                           </p>
                        </div>
                     </div>
                     <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <Progress value={85} className="mb-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                     <span>Generating sentiment report...</span>
                     <span>85% complete</span>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Recent Completed Analyses */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Recent Completed Analyses
               </CardTitle>
               <CardDescription>
                  Latest analysis results and insights
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                     <div className="h-2 w-2 rounded-full bg-green-500"></div>
                     <div>
                        <p className="font-medium">Google Brand Analysis</p>
                        <p className="text-sm text-muted-foreground">
                           Sentiment: Positive (78%) - 1,234 posts analyzed
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Badge variant="default" className="bg-green-600">
                        Positive
                     </Badge>
                     <Button size="sm" variant="outline">
                        View Results
                     </Button>
                  </div>
               </div>

               <Separator />

               <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                     <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                     <div>
                        <p className="font-medium">Meta Brand Analysis</p>
                        <p className="text-sm text-muted-foreground">
                           Sentiment: Neutral (52%) - 856 posts analyzed
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Badge variant="default" className="bg-blue-600">
                        Neutral
                     </Badge>
                     <Button size="sm" variant="outline">
                        View Results
                     </Button>
                  </div>
               </div>

               <Separator />

               <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                     <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                     <div>
                        <p className="font-medium">Twitter Brand Analysis</p>
                        <p className="text-sm text-muted-foreground">
                           Sentiment: Mixed (45%) - 2,156 posts analyzed
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Badge variant="default" className="bg-orange-600">
                        Mixed
                     </Badge>
                     <Button size="sm" variant="outline">
                        View Results
                     </Button>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Analysis History */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Analysis History
               </CardTitle>
               <CardDescription>
                  Complete history of all analyses
               </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                     <div className="flex items-center gap-3">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <div>
                           <p className="font-medium">Netflix Brand Analysis</p>
                           <p className="text-sm text-muted-foreground">
                              Completed 1 hour ago
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-600">
                           Positive
                        </Badge>
                        <Button size="sm" variant="outline">
                           Generate Report
                        </Button>
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                     <div className="flex items-center gap-3">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <div>
                           <p className="font-medium">Spotify Brand Analysis</p>
                           <p className="text-sm text-muted-foreground">
                              Completed 3 hours ago
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-blue-600">
                           Neutral
                        </Badge>
                        <Button size="sm" variant="outline">
                           Generate Report
                        </Button>
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                     <div className="flex items-center gap-3">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <div>
                           <p className="font-medium">Uber Brand Analysis</p>
                           <p className="text-sm text-muted-foreground">
                              Completed 6 hours ago
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-orange-600">
                           Mixed
                        </Badge>
                        <Button size="sm" variant="outline">
                           Generate Report
                        </Button>
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
