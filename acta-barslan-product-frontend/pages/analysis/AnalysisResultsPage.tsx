"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import {
   ArrowLeft,
   Calendar,
   Clock,
   TrendingUp,
   TrendingDown,
   Minus,
   MessageSquare,
   Hash,
   BarChart3,
} from "lucide-react";
import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { apiService } from "@/services/api";
import { Analysis } from "@/types/analysis";

interface AnalysisResultsPageProps {
   analysisId: string;
}

export function AnalysisResultsPage({ analysisId }: AnalysisResultsPageProps) {
   const router = useRouter();
   const [analysis, setAnalysis] = useState<Analysis | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [detailedResultsPage, setDetailedResultsPage] = useState(1);
   const { analyses } = useAnalysis();

   useEffect(() => {
      loadAnalysis();
   }, [analysisId]);

   const loadAnalysis = async () => {
      try {
         setIsLoading(true);
         setError(null);

         // First try to get from context
         const contextAnalysis = analyses.find((a) => a.id === analysisId);
         if (contextAnalysis) {
            setAnalysis(contextAnalysis);
            setIsLoading(false);
            return;
         }

         // If not found in context, fetch from API
         const response = await apiService.getAnalysis(analysisId);
         if (response.success && response.data) {
            const analysisData = response.data as any; // Type assertion for API response
            const formattedAnalysis: Analysis = {
               id: analysisData._id,
               brandId: analysisData.brandId,
               brandName: analysisData.brandName,
               status: analysisData.status,
               progress: analysisData.progress || 0,
               redditPosts: analysisData.redditPosts || [],
               sentimentResults: analysisData.sentimentResults || [],
               createdAt: new Date(analysisData.createdAt),
               startedAt: analysisData.startedAt
                  ? new Date(analysisData.startedAt)
                  : undefined,
               completedAt: analysisData.completedAt
                  ? new Date(analysisData.completedAt)
                  : undefined,
               totalPosts: analysisData.totalPosts || 0,
               analyzedPosts: analysisData.analyzedPosts || 0,
               averageSentiment: analysisData.averageSentiment || "neutral",
               sentimentScore: analysisData.sentimentScore || 50,
            };
            setAnalysis(formattedAnalysis);
         } else {
            setError("Analysis not found");
         }
      } catch (err) {
         setError(
            err instanceof Error ? err.message : "Failed to load analysis"
         );
      } finally {
         setIsLoading(false);
      }
   };

   const getSentimentIcon = (sentiment: string) => {
      switch (sentiment) {
         case "positive":
            return <TrendingUp className="h-4 w-4 text-green-500" />;
         case "negative":
            return <TrendingDown className="h-4 w-4 text-red-500" />;
         case "mixed":
            return <BarChart3 className="h-4 w-4 text-yellow-500" />;
         case "not applicable":
            return <Minus className="h-4 w-4 text-gray-400" />;
         default:
            return <Minus className="h-4 w-4 text-gray-500" />;
      }
   };

   const getSentimentColor = (sentiment: string) => {
      switch (sentiment) {
         case "positive":
            return "bg-green-100 text-green-800 border-green-200";
         case "negative":
            return "bg-red-100 text-red-800 border-red-200";
         case "mixed":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
         case "not applicable":
            return "bg-gray-100 text-gray-600 border-gray-200";
         default:
            return "bg-gray-100 text-gray-800 border-gray-200";
      }
   };

   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
         </div>
      );
   }

   if (error || !analysis) {
      return (
         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <PageHeader
                  title="Analysis Results"
                  description="View detailed analysis results"
               />
               <Button variant="outline" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
               </Button>
            </div>
            <EmptyState
               title="Analysis Not Found"
               description={
                  error || "The analysis you're looking for doesn't exist."
               }
               action={{
                  label: "View All Analyses",
                  onClick: () => router.push("/dashboard/analysis"),
               }}
            />
         </div>
      );
   }

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <PageHeader
               title={`Analysis Results - ${analysis.brandName}`}
               description={`Sentiment analysis for "${analysis.brandName}"`}
            />
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="h-4 w-4 mr-2" />
               Back
            </Button>
         </div>

         {/* Analysis Overview */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analysis Overview
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Created
                     </div>
                     <p className="font-medium">
                        {analysis.createdAt.toLocaleDateString()}
                     </p>
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Status
                     </div>
                     <Badge variant="outline" className="capitalize">
                        {analysis.status.replace("_", " ")}
                     </Badge>
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Hash className="h-4 w-4" />
                        Posts Analyzed
                     </div>
                     <div className="space-y-1">
                        <p className="font-medium">
                           {analysis.analyzedPosts} / {analysis.totalPosts}{" "}
                           relevant
                        </p>
                        <p className="text-xs text-muted-foreground">
                           {(analysis as any).irrelevantPosts || 0} irrelevant
                           posts filtered out
                        </p>
                     </div>
                  </div>
               </div>

               <Separator />

               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="text-lg font-semibold">
                        Overall Sentiment
                     </h3>
                     <div className="flex items-center gap-2">
                        {getSentimentIcon(analysis.averageSentiment)}
                        <Badge
                           className={getSentimentColor(
                              analysis.averageSentiment
                           )}
                        >
                           {analysis.averageSentiment.charAt(0).toUpperCase() +
                              analysis.averageSentiment.slice(1)}
                        </Badge>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                        <span>Sentiment Score</span>
                        <span>{analysis.sentimentScore}%</span>
                     </div>
                     <Progress
                        value={analysis.sentimentScore}
                        className="h-2"
                     />
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Detailed Results */}
         {analysis.sentimentResults && analysis.sentimentResults.length > 0 && (
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <MessageSquare className="h-5 w-5" />
                     Detailed Results
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {(() => {
                        const itemsPerPage = 10;
                        const totalPages = Math.ceil(
                           analysis.sentimentResults.length / itemsPerPage
                        );
                        const startIndex =
                           (detailedResultsPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedResults =
                           analysis.sentimentResults.slice(
                              startIndex,
                              endIndex
                           );

                        const renderResultItem = (
                           result: any,
                           index: number
                        ) => (
                           <div
                              key={index}
                              className="border rounded-lg p-4 space-y-3"
                           >
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">
                                       Post #{result.postId}
                                    </span>
                                    <div className="flex items-center gap-2">
                                       {getSentimentIcon(result.sentiment)}
                                       <Badge
                                          variant="outline"
                                          className={getSentimentColor(
                                             result.sentiment
                                          )}
                                       >
                                          {result.sentiment
                                             .charAt(0)
                                             .toUpperCase() +
                                             result.sentiment.slice(1)}
                                       </Badge>
                                    </div>
                                 </div>
                                 <Badge variant="secondary">
                                    {result.confidence}% confidence
                                 </Badge>
                              </div>

                              {result.summary && (
                                 <p className="text-sm text-muted-foreground">
                                    {result.summary}
                                 </p>
                              )}

                              {(result as any).postTitle && (
                                 <div className="bg-muted/50 rounded p-3 space-y-1">
                                    <h5 className="text-sm font-medium">
                                       Original Post:
                                    </h5>
                                    <p className="text-sm text-muted-foreground">
                                       {(result as any).postTitle}
                                    </p>
                                    {(result as any).postContent && (
                                       <p className="text-xs text-muted-foreground line-clamp-2">
                                          {(result as any).postContent}
                                       </p>
                                    )}
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                       <span>
                                          r/
                                          {(result as any).subreddit ||
                                             "unknown"}
                                       </span>
                                       <span>
                                          Score: {(result as any).score || 0}
                                       </span>
                                    </div>
                                 </div>
                              )}

                              {result.keywords &&
                                 result.keywords.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                       {result.keywords.map(
                                          (
                                             keyword: string,
                                             keyIndex: number
                                          ) => (
                                             <Badge
                                                key={keyIndex}
                                                variant="outline"
                                                className="text-xs"
                                             >
                                                {keyword}
                                             </Badge>
                                          )
                                       )}
                                    </div>
                                 )}
                           </div>
                        );

                        return (
                           <>
                              {paginatedResults.map((result, index) =>
                                 renderResultItem(result, startIndex + index)
                              )}

                              {/* Pagination for detailed results */}
                              {totalPages > 1 && (
                                 <div className="mt-6">
                                    <Pagination>
                                       <PaginationContent>
                                          <PaginationItem>
                                             <PaginationPrevious
                                                onClick={() =>
                                                   setDetailedResultsPage(
                                                      Math.max(
                                                         1,
                                                         detailedResultsPage - 1
                                                      )
                                                   )
                                                }
                                                className={
                                                   detailedResultsPage === 1
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
                                                      setDetailedResultsPage(
                                                         page
                                                      )
                                                   }
                                                   isActive={
                                                      page ===
                                                      detailedResultsPage
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
                                                   setDetailedResultsPage(
                                                      Math.min(
                                                         totalPages,
                                                         detailedResultsPage + 1
                                                      )
                                                   )
                                                }
                                                className={
                                                   detailedResultsPage ===
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
                     })()}
                  </div>
               </CardContent>
            </Card>
         )}

         {/* Analysis Summary */}
         <Card>
            <CardHeader>
               <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                     <div className="text-2xl font-bold text-green-600">
                        {analysis.analyzedPosts}
                     </div>
                     <div className="text-sm text-muted-foreground">
                        Relevant Posts
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="text-2xl font-bold text-gray-600">
                        {analysis.totalPosts - analysis.analyzedPosts}
                     </div>
                     <div className="text-sm text-muted-foreground">
                        Irrelevant Posts
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="text-2xl font-bold text-blue-600">
                        {analysis.totalPosts}
                     </div>
                     <div className="text-sm text-muted-foreground">
                        Total Posts Analyzed
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
