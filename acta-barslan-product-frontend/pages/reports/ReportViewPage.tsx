"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
   ArrowLeft,
   Download,
   FileText,
   BarChart3,
   TrendingUp,
   AlertTriangle,
   Lightbulb,
   Calendar,
   Building2,
   Eye,
   Clock,
} from "lucide-react";
import { Report } from "@/types/report";
import { useReports } from "@/contexts/ReportsContext";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading";
import { useToast } from "@/components/ui/toast";

interface ReportViewPageProps {
   reportId: string;
}

export function ReportViewPage({ reportId }: ReportViewPageProps) {
   const router = useRouter();
   const { getReport, downloadReport } = useReports();
   const { isAuthenticated, isLoading: authLoading } = useAuth();
   const { success, error } = useToast();
   const [report, setReport] = useState<Report | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      // Redirect to login if not authenticated (only after auth loading is complete)
      if (!authLoading && !isAuthenticated) {
         router.push("/login");
         return;
      }

      const loadReport = () => {
         const foundReport = getReport(reportId);
         if (foundReport) {
            setReport(foundReport);
         } else {
            error("Report not found");
            router.push("/dashboard/reports");
         }
         setIsLoading(false);
      };

      loadReport();
   }, [reportId, isAuthenticated, authLoading, router]); // Add authLoading dependency

   const handleDownload = async () => {
      try {
         await downloadReport(reportId);
      } catch (err) {
         console.error("Failed to download report:", err);
      }
   };

   const getInsightIcon = (type: string) => {
      switch (type) {
         case "trend":
            return <TrendingUp className="h-4 w-4 text-blue-500" />;
         case "warning":
            return <AlertTriangle className="h-4 w-4 text-red-500" />;
         case "recommendation":
            return <Lightbulb className="h-4 w-4 text-yellow-500" />;
         case "anomaly":
            return <AlertTriangle className="h-4 w-4 text-orange-500" />;
         default:
            return <Lightbulb className="h-4 w-4 text-gray-500" />;
      }
   };

   const getInsightColor = (type: string) => {
      switch (type) {
         case "trend":
            return "bg-blue-50 border-blue-200 text-blue-800";
         case "warning":
            return "bg-red-50 border-red-200 text-red-800";
         case "recommendation":
            return "bg-yellow-50 border-yellow-200 text-yellow-800";
         case "anomaly":
            return "bg-orange-50 border-orange-200 text-orange-800";
         default:
            return "bg-gray-50 border-gray-200 text-gray-800";
      }
   };

   if (isLoading || authLoading) {
      return (
         <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner text="Loading report..." size="lg" />
         </div>
      );
   }

   if (!report) {
      return (
         <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
               Report Not Found
            </h2>
            <p className="text-gray-600 mb-4">
               The report you're looking for doesn't exist.
            </p>
            <Button onClick={() => router.push("/dashboard/reports")}>
               <ArrowLeft className="h-4 w-4 mr-2" />
               Back to Reports
            </Button>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/dashboard/reports")}
               >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
               </Button>
               <div>
                  <h1 className="text-3xl font-bold">{report.title}</h1>
                  <p className="text-muted-foreground">
                     Generated on{" "}
                     {new Date(report.createdAt).toLocaleDateString()}
                  </p>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <Badge
                  variant="default"
                  className={
                     report.status === "completed"
                        ? "bg-green-600"
                        : report.status === "generating"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                  }
               >
                  {report.status === "completed"
                     ? "Completed"
                     : report.status === "generating"
                     ? "Generating"
                     : "Failed"}
               </Badge>
               {report.status === "completed" && (
                  <Button onClick={handleDownload}>
                     <Download className="h-4 w-4 mr-2" />
                     Download PDF
                  </Button>
               )}
            </div>
         </div>

         {/* Generation Progress */}
         {report.status === "generating" && (
            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                     <Clock className="h-8 w-8 text-yellow-600" />
                     <div className="flex-1">
                        <h3 className="font-semibold">Generating Report</h3>
                        <p className="text-sm text-muted-foreground">
                           Your report is being generated. This may take a few
                           minutes.
                        </p>
                        <Progress value={33} className="mt-2" />
                     </div>
                  </div>
               </CardContent>
            </Card>
         )}

         {/* Executive Summary */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Executive Summary
               </CardTitle>
               <CardDescription>
                  Overview of {report.brandName} analysis results
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                     <p className="text-2xl font-bold">
                        {report.summary.totalPosts}
                     </p>
                     <p className="text-sm text-muted-foreground">
                        Total Posts
                     </p>
                  </div>
                  <div className="text-center">
                     <p className="text-2xl font-bold">
                        {report.summary.analyzedPosts}
                     </p>
                     <p className="text-sm text-muted-foreground">Analyzed</p>
                  </div>
                  <div className="text-center">
                     <p className="text-2xl font-bold">
                        {report.summary.sentimentScore}%
                     </p>
                     <p className="text-sm text-muted-foreground">
                        Sentiment Score
                     </p>
                  </div>
                  <div className="text-center">
                     <Badge
                        variant="default"
                        className={
                           report.summary.averageSentiment === "positive"
                              ? "bg-green-600"
                              : report.summary.averageSentiment === "neutral"
                              ? "bg-blue-600"
                              : report.summary.averageSentiment === "negative"
                              ? "bg-red-600"
                              : "bg-orange-600"
                        }
                     >
                        {report.summary.averageSentiment}
                     </Badge>
                     <p className="text-sm text-muted-foreground mt-1">
                        Overall Sentiment
                     </p>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Sentiment Distribution */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sentiment Distribution
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                     <p className="text-2xl font-bold text-green-600">
                        {report.summary.sentimentDistribution.positive}
                     </p>
                     <p className="text-sm text-green-800">Positive</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                     <p className="text-2xl font-bold text-blue-600">
                        {report.summary.sentimentDistribution.neutral}
                     </p>
                     <p className="text-sm text-blue-800">Neutral</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                     <p className="text-2xl font-bold text-red-600">
                        {report.summary.sentimentDistribution.negative}
                     </p>
                     <p className="text-sm text-red-800">Negative</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                     <p className="text-2xl font-bold text-orange-600">
                        {report.summary.sentimentDistribution.mixed}
                     </p>
                     <p className="text-sm text-orange-800">Mixed</p>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Key Insights */}
         {report.insights && report.insights.length > 0 && (
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Lightbulb className="h-5 w-5" />
                     Key Insights
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  {report.insights.map((insight, index) => (
                     <div
                        key={index}
                        className={`p-4 rounded-lg border ${getInsightColor(
                           insight.type
                        )}`}
                     >
                        <div className="flex items-start gap-3">
                           {getInsightIcon(insight.type)}
                           <div className="flex-1">
                              <h4 className="font-semibold mb-1">
                                 {insight.title}
                              </h4>
                              <p className="text-sm mb-2">
                                 {insight.description}
                              </p>
                              <div className="flex items-center gap-2">
                                 <Badge variant="outline" className="text-xs">
                                    {insight.severity}
                                 </Badge>
                                 <span className="text-xs text-muted-foreground">
                                    Confidence:{" "}
                                    {Math.round(insight.confidence * 100)}%
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </CardContent>
            </Card>
         )}

         {/* Charts */}
         {report.charts && report.charts.length > 0 && (
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <BarChart3 className="h-5 w-5" />
                     Charts & Visualizations
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  {report.charts.map((chart, index) => (
                     <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">{chart.title}</h4>
                        <div className="text-sm text-muted-foreground">
                           Chart data available for visualization
                        </div>
                     </div>
                  ))}
               </CardContent>
            </Card>
         )}

         {/* Metadata */}
         {report.metadata && (
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <FileText className="h-5 w-5" />
                     Report Details
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                     <div>
                        <p className="font-medium">Generation Time</p>
                        <p className="text-muted-foreground">
                           {Math.round(report.metadata.generationTime / 1000)}s
                        </p>
                     </div>
                     <div>
                        <p className="font-medium">File Size</p>
                        <p className="text-muted-foreground">
                           {(report.metadata.fileSize / 1024).toFixed(1)} KB
                        </p>
                     </div>
                     <div>
                        <p className="font-medium">Charts</p>
                        <p className="text-muted-foreground">
                           {report.metadata.chartCount}
                        </p>
                     </div>
                     <div>
                        <p className="font-medium">Insights</p>
                        <p className="text-muted-foreground">
                           {report.metadata.insightCount}
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>
         )}
      </div>
   );
}
