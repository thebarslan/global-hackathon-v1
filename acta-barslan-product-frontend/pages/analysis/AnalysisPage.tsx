"use client";
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
import { useState } from "react";
import { Analysis, CreateAnalysisRequest } from "@/types/analysis";
import { StartAnalysisModal } from "@/components/modals/StartAnalysisModal";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { useBrands } from "@/contexts/BrandsContext";
import { useToast } from "@/components/ui/toast";
import { LoadingSpinner } from "@/components/ui/loading";
import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";

export function AnalysisPage() {
   const router = useRouter();
   const [isStartAnalysisModalOpen, setIsStartAnalysisModalOpen] =
      useState(false);
   const [analysisHistoryPage, setAnalysisHistoryPage] = useState(1);

   const {
      analyses,
      createAnalysis,
      pauseAnalysis,
      cancelAnalysis,
      isLoading: analysesLoading,
   } = useAnalysis();
   const { brands, isLoading: brandsLoading } = useBrands();
   const { success, error } = useToast();

   const isLoading = analysesLoading || brandsLoading;

   const handleStartAnalysis = async (data: CreateAnalysisRequest) => {
      try {
         await createAnalysis(data);
         setIsStartAnalysisModalOpen(false);
      } catch (err) {
         console.error("Failed to start analysis:", err);
      }
   };

   const handlePauseAnalysis = async (analysisId: string) => {
      try {
         await pauseAnalysis(analysisId);
      } catch (err) {
         console.error("Failed to pause analysis:", err);
      }
   };

   const handleCancelAnalysis = async (analysisId: string) => {
      try {
         await cancelAnalysis(analysisId);
      } catch (err) {
         console.error("Failed to cancel analysis:", err);
      }
   };

   const handleViewResults = (analysisId: string) => {
      router.push(`/dashboard/analysis/${analysisId}`);
   };

   // Calculate stats from real data
   const totalAnalyses = analyses.length;
   const inProgressAnalyses = analyses.filter(
      (a) => a.status === "in_progress"
   ).length;
   const completedAnalyses = analyses.filter(
      (a) => a.status === "completed"
   ).length;
   const failedAnalyses = analyses.filter((a) => a.status === "failed").length;

   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner text="Loading analyses..." size="lg" />
         </div>
      );
   }

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
            <Button
               className="flex items-center gap-2"
               onClick={() => setIsStartAnalysisModalOpen(true)}
            >
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
                        <p className="text-2xl font-bold">{totalAnalyses}</p>
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
                        <p className="text-2xl font-bold">
                           {inProgressAnalyses}
                        </p>
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
                        <p className="text-2xl font-bold">
                           {completedAnalyses}
                        </p>
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
                        <p className="text-2xl font-bold">{failedAnalyses}</p>
                        <p className="text-sm text-muted-foreground">Failed</p>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

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
                  {analyses.length > 0 ? (
                     (() => {
                        const sortedAnalyses = analyses.sort(
                           (a, b) =>
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime()
                        );

                        const itemsPerPage = 10;
                        const totalPages = Math.ceil(
                           sortedAnalyses.length / itemsPerPage
                        );
                        const startIndex =
                           (analysisHistoryPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedAnalyses = sortedAnalyses.slice(
                           startIndex,
                           endIndex
                        );

                        const renderAnalysisItem = (analysis: Analysis) => (
                           <div
                              key={analysis.id}
                              className="flex flex-col gap-3 p-4 rounded-lg border"
                           >
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                    <div>
                                       <p className="font-medium">
                                          {analysis.brandName} Analysis
                                       </p>
                                       <p className="text-sm text-muted-foreground">
                                          {analysis.status === "completed"
                                             ? `Completed ${
                                                  analysis.completedAt
                                                     ? new Date(
                                                          analysis.completedAt
                                                       ).toLocaleString()
                                                     : "recently"
                                               }`
                                             : analysis.status === "in_progress"
                                             ? `In progress`
                                             : analysis.status === "failed"
                                             ? "Failed"
                                             : "Pending"}
                                       </p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    {analysis.status === "completed" ? (
                                       <>
                                          <Badge
                                             variant="default"
                                             className={
                                                analysis.averageSentiment ===
                                                "positive"
                                                   ? "bg-green-600"
                                                   : analysis.averageSentiment ===
                                                     "neutral"
                                                   ? "bg-blue-600"
                                                   : analysis.averageSentiment ===
                                                     "negative"
                                                   ? "bg-red-600"
                                                   : analysis.averageSentiment ===
                                                     "not applicable"
                                                   ? "bg-gray-600"
                                                   : "bg-orange-600"
                                             }
                                          >
                                             {analysis.averageSentiment
                                                ? analysis.averageSentiment
                                                     .charAt(0)
                                                     .toUpperCase() +
                                                  analysis.averageSentiment.slice(
                                                     1
                                                  )
                                                : "Unknown"}
                                          </Badge>
                                          <Button
                                             size="sm"
                                             variant="outline"
                                             onClick={() =>
                                                handleViewResults(analysis.id)
                                             }
                                          >
                                             View Results
                                          </Button>
                                       </>
                                    ) : analysis.status === "in_progress" ? (
                                       <Badge
                                          variant="default"
                                          className="bg-yellow-600"
                                       >
                                          In Progress
                                       </Badge>
                                    ) : analysis.status === "failed" ? (
                                       <Badge variant="destructive">
                                          Failed
                                       </Badge>
                                    ) : (
                                       <Badge variant="outline">Pending</Badge>
                                    )}
                                 </div>
                              </div>
                           </div>
                        );

                        return (
                           <>
                              {paginatedAnalyses.map(renderAnalysisItem)}

                              {/* Pagination if more than 10 items */}
                              {totalPages > 1 && (
                                 <div className="mt-6">
                                    <Pagination>
                                       <PaginationContent>
                                          <PaginationItem>
                                             <PaginationPrevious
                                                onClick={() =>
                                                   setAnalysisHistoryPage(
                                                      Math.max(
                                                         1,
                                                         analysisHistoryPage - 1
                                                      )
                                                   )
                                                }
                                                className={
                                                   analysisHistoryPage === 1
                                                      ? "pointer-events-none opacity-50"
                                                      : "cursor-pointer"
                                                }
                                             />
                                          </PaginationItem>

                                          {Array.from(
                                             { length: totalPages },
                                             (_, i) => i + 1
                                          ).map((page) => (
                                             <PaginationItem key={page}>
                                                <PaginationLink
                                                   onClick={() =>
                                                      setAnalysisHistoryPage(
                                                         page
                                                      )
                                                   }
                                                   isActive={
                                                      page ===
                                                      analysisHistoryPage
                                                   }
                                                   className="cursor-pointer"
                                                >
                                                   {page}
                                                </PaginationLink>
                                             </PaginationItem>
                                          ))}

                                          <PaginationItem>
                                             <PaginationNext
                                                onClick={() =>
                                                   setAnalysisHistoryPage(
                                                      Math.min(
                                                         totalPages,
                                                         analysisHistoryPage + 1
                                                      )
                                                   )
                                                }
                                                className={
                                                   analysisHistoryPage ===
                                                   totalPages
                                                      ? "pointer-events-none opacity-50"
                                                      : "cursor-pointer"
                                                }
                                             />
                                          </PaginationItem>
                                       </PaginationContent>
                                    </Pagination>
                                 </div>
                              )}
                           </>
                        );
                     })()
                  ) : (
                     <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No analysis history</p>
                        <p className="text-sm">
                           Start your first analysis to see history here
                        </p>
                     </div>
                  )}
               </div>
            </CardContent>
         </Card>

         {/* Modal */}
         <StartAnalysisModal
            isOpen={isStartAnalysisModalOpen}
            onClose={() => setIsStartAnalysisModalOpen(false)}
            onSubmit={handleStartAnalysis}
            brands={brands}
         />
      </div>
   );
}
