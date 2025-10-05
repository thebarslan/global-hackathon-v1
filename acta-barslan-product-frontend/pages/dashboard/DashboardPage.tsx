"use client";
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
import { useState } from "react";
import { Analysis } from "@/types/analysis";
import { CreateBrandRequest } from "@/types/brand";
import { CreateAnalysisRequest } from "@/types/analysis";
import { AddBrandModal } from "@/components/modals/AddBrandModal";
import { StartAnalysisModal } from "@/components/modals/StartAnalysisModal";
import { useBrands } from "@/contexts/BrandsContext";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { useReports } from "@/contexts/ReportsContext";
import { useToast } from "@/components/ui/toast";
import { LoadingSpinner } from "@/components/ui/loading";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardPage() {
   const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
   const [isStartAnalysisModalOpen, setIsStartAnalysisModalOpen] =
      useState(false);

   const { brands, createBrand, isLoading: brandsLoading } = useBrands();
   const {
      analyses,
      createAnalysis,
      isLoading: analysesLoading,
   } = useAnalysis();
   const { reports, isLoading: reportsLoading } = useReports();
   const { success, error } = useToast();
   const { isAuthenticated, isLoading: authLoading } = useAuth();

   const isLoading =
      brandsLoading || analysesLoading || reportsLoading || authLoading;

   // Show loading while checking authentication
   if (authLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading dashboard..." />
         </div>
      );
   }

   // Redirect to login if not authenticated
   if (!isAuthenticated) {
      if (typeof window !== "undefined") {
         window.location.href = "/login";
      }
      return null;
   }

   const handleAddBrand = async (data: CreateBrandRequest) => {
      try {
         await createBrand(data);
         setIsAddBrandModalOpen(false);
      } catch (err) {
         console.error("Failed to add brand:", err);
      }
   };

   const handleStartAnalysis = async (data: CreateAnalysisRequest) => {
      try {
         await createAnalysis(data);
         setIsStartAnalysisModalOpen(false);
      } catch (err) {
         console.error("Failed to start analysis:", err);
      }
   };

   // Calculate stats from real data
   const totalBrands = brands.length;
   const totalAnalyses = analyses.length;
   const totalReports = reports.length;
   const completedAnalyses = analyses.filter((a) => a.status === "completed");
   const positiveSentiment =
      completedAnalyses.length > 0
         ? Math.round(
              (completedAnalyses.filter(
                 (a) => a.averageSentiment === "positive"
              ).length /
                 completedAnalyses.length) *
                 100
           )
         : 0;

   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner text="Loading dashboard..." size="lg" />
         </div>
      );
   }

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
                  <Button
                     className="w-full justify-start"
                     variant="outline"
                     onClick={() => setIsAddBrandModalOpen(true)}
                  >
                     <Building2 className="mr-2 h-4 w-4" />
                     Add New Brand
                  </Button>
                  <Button
                     className="w-full justify-start"
                     variant="outline"
                     onClick={() => setIsStartAnalysisModalOpen(true)}
                  >
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
                           {totalBrands}
                        </div>
                        <div className="text-sm text-muted-foreground">
                           Brands
                        </div>
                     </div>
                     <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                           {totalAnalyses}
                        </div>
                        <div className="text-sm text-muted-foreground">
                           Analyses
                        </div>
                     </div>
                     <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                           {totalReports}
                        </div>
                        <div className="text-sm text-muted-foreground">
                           Reports
                        </div>
                     </div>
                     <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                           {positiveSentiment}%
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
               {completedAnalyses
                  .slice(0, 3)
                  .map((analysis: Analysis, index: number) => (
                     <div key={analysis.id}>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div
                                 className={`h-2 w-2 rounded-full ${
                                    analysis.averageSentiment === "positive"
                                       ? "bg-green-500"
                                       : analysis.averageSentiment === "neutral"
                                       ? "bg-blue-500"
                                       : analysis.averageSentiment ===
                                         "negative"
                                       ? "bg-red-500"
                                       : "bg-orange-500"
                                 }`}
                              ></div>
                              <div>
                                 <p className="font-medium">
                                    Analysis completed for {analysis.brandName}
                                 </p>
                                 <p className="text-sm text-muted-foreground">
                                    {analysis.completedAt
                                       ? new Date(
                                            analysis.completedAt
                                         ).toLocaleString()
                                       : "Recently completed"}
                                 </p>
                              </div>
                           </div>
                           <Badge
                              variant="secondary"
                              className={
                                 analysis.averageSentiment === "positive"
                                    ? "bg-green-600"
                                    : analysis.averageSentiment === "neutral"
                                    ? "bg-blue-600"
                                    : analysis.averageSentiment === "negative"
                                    ? "bg-red-600"
                                    : "bg-orange-600"
                              }
                           >
                              {analysis.averageSentiment
                                 .charAt(0)
                                 .toUpperCase() +
                                 analysis.averageSentiment.slice(1)}
                           </Badge>
                        </div>
                        {index < 2 && <Separator />}
                     </div>
                  ))}
            </CardContent>
         </Card>

         {/* Quick Access */}
         <div className="grid gap-4 md:grid-cols-3">
            <Card
               className="hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => (window.location.href = "/dashboard/brands")}
            >
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

            <Card
               className="hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => (window.location.href = "/dashboard/analysis")}
            >
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

            <Card
               className="hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => (window.location.href = "/dashboard/reports")}
            >
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

         {/* Modals */}
         <AddBrandModal
            isOpen={isAddBrandModalOpen}
            onClose={() => setIsAddBrandModalOpen(false)}
            onSubmit={handleAddBrand}
         />

         <StartAnalysisModal
            isOpen={isStartAnalysisModalOpen}
            onClose={() => setIsStartAnalysisModalOpen(false)}
            onSubmit={handleStartAnalysis}
            brands={brands}
         />
      </div>
   );
}
