import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
   Building2,
   BarChart3,
   FileText,
   TrendingUp,
   Plus,
   Zap,
} from "lucide-react";

export function DashboardPage() {
   return (
      <div className="space-y-6">
         {/* Header */}
         <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
               Welcome to ActaBarslan Brand Analytics
            </p>
         </div>

         {/* Quick Actions */}
         <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-primary/20 bg-primary/5">
               <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                     <Plus className="h-5 w-5 text-primary" />
                     Quick Actions
                  </CardTitle>
                  <CardDescription>
                     Start monitoring a new brand or begin analysis
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                     <Building2 className="mr-2 h-4 w-4" />
                     Add New Brand
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                     <Zap className="mr-2 h-4 w-4" />
                     Start Analysis
                  </Button>
               </CardContent>
            </Card>

            {/* Stats Overview */}
            <Card>
               <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                     <BarChart3 className="h-5 w-5" />
                     Overview
                  </CardTitle>
                  <CardDescription>Your analytics at a glance</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                           12
                        </div>
                        <div className="text-sm text-muted-foreground">
                           Brands
                        </div>
                     </div>
                     <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                           48
                        </div>
                        <div className="text-sm text-muted-foreground">
                           Analyses
                        </div>
                     </div>
                     <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                           24
                        </div>
                        <div className="text-sm text-muted-foreground">
                           Reports
                        </div>
                     </div>
                     <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                           85%
                        </div>
                        <div className="text-sm text-muted-foreground">
                           Positive
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Recent Activity */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
               </CardTitle>
               <CardDescription>
                  Latest analyses and brand updates
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="h-2 w-2 rounded-full bg-green-500"></div>
                     <div>
                        <p className="font-medium">
                           Analysis completed for Yahoo
                        </p>
                        <p className="text-sm text-muted-foreground">
                           2 minutes ago
                        </p>
                     </div>
                  </div>
                  <Badge variant="secondary">Positive</Badge>
               </div>

               <Separator />

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                     <div>
                        <p className="font-medium">
                           New brand added: Microsoft
                        </p>
                        <p className="text-sm text-muted-foreground">
                           1 hour ago
                        </p>
                     </div>
                  </div>
                  <Badge variant="outline">New</Badge>
               </div>

               <Separator />

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                     <div>
                        <p className="font-medium">
                           Report generated for Apple
                        </p>
                        <p className="text-sm text-muted-foreground">
                           3 hours ago
                        </p>
                     </div>
                  </div>
                  <Badge variant="secondary">Report</Badge>
               </div>
            </CardContent>
         </Card>

         {/* Quick Access */}
         <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
               <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                     <Building2 className="h-5 w-5" />
                     Brands
                  </CardTitle>
                  <CardDescription>
                     Manage your monitored brands
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <p className="text-sm text-muted-foreground">
                     View and manage all your brand monitoring settings
                  </p>
               </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
               <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                     <BarChart3 className="h-5 w-5" />
                     Analysis
                  </CardTitle>
                  <CardDescription>Start new analyses</CardDescription>
               </CardHeader>
               <CardContent>
                  <p className="text-sm text-muted-foreground">
                     Launch sentiment analysis for your brands
                  </p>
               </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
               <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                     <FileText className="h-5 w-5" />
                     Reports
                  </CardTitle>
                  <CardDescription>View and download reports</CardDescription>
               </CardHeader>
               <CardContent>
                  <p className="text-sm text-muted-foreground">
                     Access your analysis reports and insights
                  </p>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
