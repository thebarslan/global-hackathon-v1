"use client";

import {
   createContext,
   useContext,
   useState,
   useEffect,
   useCallback,
   ReactNode,
} from "react";
import { Report, CreateReportRequest } from "@/types/report";
import { mockReports } from "@/data/mockReports";
import { apiService } from "@/services/api";
import { useToast } from "@/components/ui/toast";
import { ReportApiData } from "@/types/api";
import { useAuth } from "@/contexts/AuthContext";

interface ReportsContextType {
   reports: Report[];
   isLoading: boolean;
   error: string | null;
   createReport: (data: CreateReportRequest) => Promise<Report>;
   updateReport: (id: string, data: Partial<Report>) => Promise<Report>;
   deleteReport: (id: string) => Promise<void>;
   getReport: (id: string) => Report | undefined;
   downloadReport: (id: string) => Promise<void>;
   getReportsByAnalysis: (analysisId: string) => Report[];
   getReportsByBrand: (brandName: string) => Report[];
   searchReports: (query: string) => Report[];
   refreshReports: () => Promise<void>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
   const [reports, setReports] = useState<Report[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const { success, error: showError } = useToast();
   const { isAuthenticated } = useAuth();

   const createReport = async (data: CreateReportRequest): Promise<Report> => {
      setIsLoading(true);
      setError(null);

      try {
         const response = await apiService.createReport(data);

         if (response.success && response.data) {
            const reportData = response.data as ReportApiData;
            const newReport: Report = {
               id: reportData._id,
               analysisId: reportData.analysisId,
               brandName: reportData.brandName,
               title: reportData.title,
               type: reportData.type as
                  | "executive_summary"
                  | "detailed_analysis"
                  | "custom",
               status: reportData.status as
                  | "generating"
                  | "completed"
                  | "failed",
               createdAt: new Date(reportData.createdAt),
               completedAt: reportData.completedAt
                  ? new Date(reportData.completedAt)
                  : undefined,
               summary: reportData.summary || {
                  totalPosts: 0,
                  analyzedPosts: 0,
                  averageSentiment: "neutral",
                  sentimentScore: 50,
                  topKeywords: [],
                  sentimentDistribution: {
                     positive: 0,
                     neutral: 0,
                     negative: 0,
                     mixed: 0,
                  },
                  timeRange: {
                     start: new Date(),
                     end: new Date(),
                  },
               },
               charts: reportData.charts || [],
               insights: reportData.insights || [],
               metadata: reportData.metadata,
               error: reportData.error
                  ? {
                       message: reportData.error.message,
                       code: reportData.error.code,
                       timestamp: new Date(reportData.error.timestamp),
                    }
                  : undefined,
            };

            setReports((prev) => [newReport, ...prev]);
            success(
               "Report generated",
               `${newReport.title} has been created successfully!`
            );
            return newReport;
         } else {
            throw new Error(response.message || "Failed to create report");
         }
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Failed to create report";
         setError(errorMessage);
         showError("Failed to create report", errorMessage);
         throw err;
      } finally {
         setIsLoading(false);
      }
   };

   const updateReport = async (
      id: string,
      data: Partial<Report>
   ): Promise<Report> => {
      setIsLoading(true);
      setError(null);

      try {
         // TODO: Implement actual API call
         console.log("Updating report:", { id, data });

         setReports((prev) =>
            prev.map((report) =>
               report.id === id ? { ...report, ...data } : report
            )
         );

         const updatedReport = reports.find((r) => r.id === id);
         if (!updatedReport) throw new Error("Report not found");

         return { ...updatedReport, ...data };
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Failed to update report";
         setError(errorMessage);
         throw err;
      } finally {
         setIsLoading(false);
      }
   };

   const deleteReport = async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
         // TODO: Implement actual API call
         console.log("Deleting report:", id);

         setReports((prev) => prev.filter((report) => report.id !== id));
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Failed to delete report";
         setError(errorMessage);
         throw err;
      } finally {
         setIsLoading(false);
      }
   };

   const getReport = (id: string): Report | undefined => {
      return reports.find((report) => report.id === id);
   };

   const downloadReport = async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
         // Check if user is authenticated
         if (!isAuthenticated) {
            window.location.href = "/login";
            return;
         }

         // Get the download URL from API service
         const downloadUrl = `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
         }/api/reports/${id}/download`;

         // Get authorization token from apiService
         const token = apiService.getToken();
         if (!token) {
            // Redirect to login if no token
            window.location.href = "/login";
            return;
         }

         // Use fetch to download with authorization
         const response = await fetch(downloadUrl, {
            method: "GET",
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Create download link
            const link = document.createElement("a");
            link.href = url;
            link.download = `report_${id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            success("Report downloaded successfully!");
         } else {
            throw new Error("Failed to download report");
         }
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Failed to download report";
         setError(errorMessage);
         throw err;
      } finally {
         setIsLoading(false);
      }
   };

   const getReportsByAnalysis = (analysisId: string): Report[] => {
      return reports.filter((report) => report.analysisId === analysisId);
   };

   const getReportsByBrand = (brandName: string): Report[] => {
      return reports.filter((report) =>
         report.brandName.toLowerCase().includes(brandName.toLowerCase())
      );
   };

   const searchReports = (query: string): Report[] => {
      if (!query.trim()) return reports;

      const lowercaseQuery = query.toLowerCase();
      return reports.filter(
         (report) =>
            report.title.toLowerCase().includes(lowercaseQuery) ||
            report.brandName.toLowerCase().includes(lowercaseQuery) ||
            report.type.toLowerCase().includes(lowercaseQuery)
      );
   };

   const refreshReports = useCallback(async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
         console.log("Refreshing reports");
         const response = await apiService.getReports();

         if (response.success && response.data) {
            const reportsData = response.data as ReportApiData[];
            const formattedReports: Report[] = reportsData.map((reportData) => {
               return {
                  id: reportData._id,
                  analysisId: reportData.analysisId,
                  brandName: reportData.brandName,
                  title: reportData.title,
                  type: reportData.type as
                     | "executive_summary"
                     | "detailed_analysis"
                     | "custom",
                  status: reportData.status as
                     | "generating"
                     | "completed"
                     | "failed",
                  createdAt: new Date(reportData.createdAt),
                  completedAt: reportData.completedAt
                     ? new Date(reportData.completedAt)
                     : undefined,
                  filePath: reportData.filePath,
                  downloadUrl: reportData.downloadUrl,
                  shareUrl: reportData.shareUrl,
                  summary: reportData.summary || {
                     totalPosts: 0,
                     analyzedPosts: 0,
                     averageSentiment: "neutral" as const,
                     sentimentScore: 50,
                     topKeywords: [],
                     sentimentDistribution: {
                        positive: 0,
                        neutral: 0,
                        negative: 0,
                        mixed: 0,
                     },
                     timeRange: {
                        start: new Date(),
                        end: new Date(),
                     },
                  },
                  charts: reportData.charts || [],
                  insights: reportData.insights || [],
                  metadata: reportData.metadata,
                  error: reportData.error
                     ? {
                          message: reportData.error.message,
                          code: reportData.error.code,
                          timestamp: new Date(reportData.error.timestamp),
                       }
                     : undefined,
               };
            });
            setReports(formattedReports);
         } else {
            setReports([]);
         }
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Failed to refresh reports";
         setError(errorMessage);
         console.error("Failed to refresh reports:", err);
         setReports([]);
      } finally {
         setIsLoading(false);
      }
   }, []); // Empty dependency array for useCallback

   // Load reports on mount only if authenticated
   useEffect(() => {
      if (isAuthenticated) {
         refreshReports();
      } else {
         setIsLoading(false);
      }
   }, [isAuthenticated, refreshReports]);

   const value: ReportsContextType = {
      reports,
      isLoading,
      error,
      createReport,
      updateReport,
      deleteReport,
      getReport,
      downloadReport,
      getReportsByAnalysis,
      getReportsByBrand,
      searchReports,
      refreshReports,
   };

   return (
      <ReportsContext.Provider value={value}>
         {children}
      </ReportsContext.Provider>
   );
}

export function useReports() {
   const context = useContext(ReportsContext);
   if (context === undefined) {
      throw new Error("useReports must be used within a ReportsProvider");
   }
   return context;
}
