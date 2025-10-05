"use client";

import {
   createContext,
   useContext,
   useState,
   useEffect,
   useCallback,
   ReactNode,
} from "react";
import { Analysis, CreateAnalysisRequest } from "@/types/analysis";
import { mockAnalyses } from "@/data/mockAnalyses";
import { apiService } from "@/services/api";
import { useToast } from "@/components/ui/toast";
import { AnalysisApiData } from "@/types/api";
import { useAuth } from "@/contexts/AuthContext";

interface AnalysisContextType {
   analyses: Analysis[];
   isLoading: boolean;
   error: string | null;
   createAnalysis: (data: CreateAnalysisRequest) => Promise<Analysis>;
   updateAnalysis: (id: string, data: Partial<Analysis>) => Promise<Analysis>;
   deleteAnalysis: (id: string) => Promise<void>;
   getAnalysis: (id: string) => Analysis | undefined;
   pauseAnalysis: (id: string) => Promise<void>;
   cancelAnalysis: (id: string) => Promise<void>;
   resumeAnalysis: (id: string) => Promise<void>;
   getAnalysesByBrand: (brandId: string) => Analysis[];
   getActiveAnalyses: () => Analysis[];
   getCompletedAnalyses: () => Analysis[];
   refreshAnalyses: () => Promise<void>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(
   undefined
);

export function AnalysisProvider({ children }: { children: ReactNode }) {
   const [analyses, setAnalyses] = useState<Analysis[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [pollingInterval, setPollingInterval] =
      useState<NodeJS.Timeout | null>(null);
   const { success, error: showError } = useToast();
   const { isAuthenticated } = useAuth();

   const refreshAnalyses = useCallback(async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
         console.log("Refreshing analyses");
         const response = await apiService.getAnalyses();

         if (response.success && response.data) {
            const analysesData = response.data as AnalysisApiData[];
            const formattedAnalyses: Analysis[] = analysesData.map(
               (analysisData) => {
                  console.log(
                     `Analysis ${analysisData._id} progress: ${analysisData.progress}% (status: ${analysisData.status})`
                  );
                  return {
                     id: analysisData._id,
                     brandId: analysisData.brandId,
                     brandName: analysisData.brandName,
                     status: analysisData.status as
                        | "pending"
                        | "in_progress"
                        | "completed"
                        | "failed",
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
                     averageSentiment: (analysisData.averageSentiment ||
                        "neutral") as
                        | "positive"
                        | "negative"
                        | "neutral"
                        | "mixed"
                        | "not applicable",
                     sentimentScore: analysisData.sentimentScore || 50,
                  };
               }
            );
            setAnalyses(formattedAnalyses);
         } else {
            setAnalyses([]);
         }
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Failed to refresh analyses";
         setError(errorMessage);
         console.error("Failed to refresh analyses:", err);
         setAnalyses([]);
      } finally {
         setIsLoading(false);
      }
   }, []);

   // Load analyses on mount only if authenticated
   useEffect(() => {
      if (isAuthenticated) {
         refreshAnalyses();
      } else {
         setIsLoading(false);
      }
   }, [isAuthenticated, refreshAnalyses]);

   // Real-time polling for in-progress analyses
   useEffect(() => {
      if (isAuthenticated && analyses.length > 0) {
         const hasInProgressAnalyses = analyses.some(
            (analysis) =>
               analysis.status === "pending" ||
               analysis.status === "in_progress"
         );

         if (hasInProgressAnalyses && !pollingInterval) {
            const interval = setInterval(() => {
               refreshAnalyses();
            }, 5000); // Poll every 5 seconds

            setPollingInterval(interval);
         } else if (!hasInProgressAnalyses && pollingInterval) {
            // Clear interval if no in-progress analyses
            clearInterval(pollingInterval);
            setPollingInterval(null);
         }
      }

      return () => {
         if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
         }
      };
   }, [isAuthenticated, analyses, refreshAnalyses]);

   const createAnalysis = async (
      data: CreateAnalysisRequest
   ): Promise<Analysis> => {
      setIsLoading(true);
      setError(null);

      try {
         const response = await apiService.createAnalysis(data);

         if (response.success && response.data) {
            const analysisData = response.data as AnalysisApiData;
            const newAnalysis: Analysis = {
               id: analysisData._id,
               brandId: analysisData.brandId,
               brandName: analysisData.brandName,
               status: analysisData.status as
                  | "pending"
                  | "in_progress"
                  | "completed"
                  | "failed",
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
               averageSentiment: (analysisData.averageSentiment ||
                  "neutral") as
                  | "positive"
                  | "negative"
                  | "neutral"
                  | "mixed"
                  | "not applicable",
               sentimentScore: analysisData.sentimentScore || 50,
            };

            setAnalyses((prev) => [newAnalysis, ...prev]);
            success(
               `Analysis started Analysis for ${analysisData.brandName} has been initiated!`
            );
            return newAnalysis;
         } else {
            throw new Error("Failed to create analysis");
         }
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Failed to create analysis";
         setError(errorMessage);
         showError(`Failed to create analysis ${errorMessage}`);
         throw err;
      } finally {
         setIsLoading(false);
      }
   };

   const updateAnalysis = async (
      id: string,
      data: Partial<Analysis>
   ): Promise<Analysis> => {
      setIsLoading(true);
      setError(null);

      try {
         // TODO: Implement actual API call
         console.log("Updating analysis:", id, data);

         const updatedAnalysis = analyses.find((a) => a.id === id);
         if (!updatedAnalysis) {
            throw new Error("Analysis not found");
         }

         const newAnalysis = { ...updatedAnalysis, ...data };
         setAnalyses((prev) =>
            prev.map((analysis) =>
               analysis.id === id ? newAnalysis : analysis
            )
         );

         return newAnalysis;
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Failed to update analysis";
         setError(errorMessage);
         throw err;
      } finally {
         setIsLoading(false);
      }
   };

   const deleteAnalysis = async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
         // TODO: Implement actual API call
         console.log("Deleting analysis:", id);

         setAnalyses((prev) => prev.filter((analysis) => analysis.id !== id));
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Failed to delete analysis";
         setError(errorMessage);
         throw err;
      } finally {
         setIsLoading(false);
      }
   };

   const getAnalysis = (id: string): Analysis | undefined => {
      return analyses.find((analysis) => analysis.id === id);
   };

   const pauseAnalysis = async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
         // TODO: Implement actual API call
         console.log("Pausing analysis:", id);

         setAnalyses((prev) =>
            prev.map((analysis) =>
               analysis.id === id
                  ? { ...analysis, status: "pending" }
                  : analysis
            )
         );
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Failed to pause analysis";
         setError(errorMessage);
         throw err;
      } finally {
         setIsLoading(false);
      }
   };

   const cancelAnalysis = async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
         // TODO: Implement actual API call
         console.log("Cancelling analysis:", id);

         setAnalyses((prev) =>
            prev.map((analysis) =>
               analysis.id === id ? { ...analysis, status: "failed" } : analysis
            )
         );
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Failed to cancel analysis";
         setError(errorMessage);
         throw err;
      } finally {
         setIsLoading(false);
      }
   };

   const resumeAnalysis = async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
         // TODO: Implement actual API call
         console.log("Resuming analysis:", id);

         setAnalyses((prev) =>
            prev.map((analysis) =>
               analysis.id === id
                  ? { ...analysis, status: "in_progress" }
                  : analysis
            )
         );
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Failed to resume analysis";
         setError(errorMessage);
         throw err;
      } finally {
         setIsLoading(false);
      }
   };

   const getAnalysesByBrand = (brandId: string): Analysis[] => {
      return analyses.filter((analysis) => analysis.brandId === brandId);
   };

   const getActiveAnalyses = (): Analysis[] => {
      return analyses.filter((analysis) => analysis.status === "in_progress");
   };

   const getCompletedAnalyses = (): Analysis[] => {
      return analyses.filter((analysis) => analysis.status === "completed");
   };

   const value: AnalysisContextType = {
      analyses,
      isLoading,
      error,
      createAnalysis,
      updateAnalysis,
      deleteAnalysis,
      getAnalysis,
      pauseAnalysis,
      cancelAnalysis,
      resumeAnalysis,
      getAnalysesByBrand,
      getActiveAnalyses,
      getCompletedAnalyses,
      refreshAnalyses,
   };

   return (
      <AnalysisContext.Provider value={value}>
         {children}
      </AnalysisContext.Provider>
   );
}

export function useAnalysis() {
   const context = useContext(AnalysisContext);
   if (context === undefined) {
      throw new Error("useAnalysis must be used within an AnalysisProvider");
   }
   return context;
}
