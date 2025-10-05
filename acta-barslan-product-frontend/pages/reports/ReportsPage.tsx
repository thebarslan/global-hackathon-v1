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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
   FileText,
   Download,
   Plus,
   Search,
   Calendar,
   Building2,
   BarChart3,
   Eye,
   Trash2,
   Filter,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Report, CreateReportRequest } from "@/types/report";
import { GenerateReportModal } from "@/components/modals/GenerateReportModal";
import { useReports } from "@/contexts/ReportsContext";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { useAuth } from "@/contexts/AuthContext";
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

export function ReportsPage() {
   const router = useRouter();
   const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] =
      useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [reportsPage, setReportsPage] = useState(1);
   const [filteredReports, setFilteredReports] = useState<Report[]>([]);

   const {
      reports,
      createReport,
      downloadReport,
      searchReports,
      isLoading: reportsLoading,
   } = useReports();
   const { analyses, isLoading: analysesLoading } = useAnalysis();
   const { isAuthenticated, isLoading: authLoading } = useAuth();
   const { success, error } = useToast();

   const isLoading = reportsLoading || analysesLoading || authLoading;

   // Redirect to login if not authenticated (only after auth loading is complete)
   useEffect(() => {
      if (!authLoading && !isAuthenticated) {
         router.push("/login");
         return;
      }
   }, [isAuthenticated, authLoading, router]);

   // Update filtered reports when reports change
   useEffect(() => {
      if (searchTerm.trim() === "") {
         setFilteredReports(reports);
      } else {
         setFilteredReports(searchReports(searchTerm));
      }
   }, [reports, searchTerm, searchReports]);

   const handleGenerateReport = async (data: CreateReportRequest) => {
      try {
         await createReport(data);
         setIsGenerateReportModalOpen(false);
      } catch (err) {
         console.error("Failed to generate report:", err);
      }
   };

   const handleViewReport = (reportId: string) => {
      router.push(`/dashboard/reports/${reportId}`);
   };

   const handleDownloadReport = async (reportId: string) => {
      try {
         await downloadReport(reportId);
      } catch (err) {
         console.error("Failed to download report:", err);
      }
   };

   // Calculate stats from real data
   const totalReports = reports.length;
   const completedReports = reports.filter(
      (r) => r.status === "completed"
   ).length;
   const generatingReports = reports.filter(
      (r) => r.status === "generating"
   ).length;
   const failedReports = reports.filter((r) => r.status === "failed").length;

   const handleDeleteReport = (reportId: string) => {
      console.log("Deleting report:", reportId);
      // TODO: Implement API call to delete report
   };

   const handleSearch = (term: string) => {
      setSearchTerm(term);
   };

   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner text="Loading reports..." size="lg" />
         </div>
      );
   }

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
            <Button
               className="flex items-center gap-2"
               onClick={() => setIsGenerateReportModalOpen(true)}
            >
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
                        <p className="text-2xl font-bold">{totalReports}</p>
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
                        <p className="text-2xl font-bold">{completedReports}</p>
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
                     <FileText className="h-5 w-5 text-blue-600" />
                     <div>
                        <p className="text-2xl font-bold">{completedReports}</p>
                        <p className="text-sm text-muted-foreground">
                           Available
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                     <Calendar className="h-5 w-5 text-orange-600" />
                     <div>
                        <p className="text-2xl font-bold">
                           {generatingReports}
                        </p>
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
                  <Input
                     placeholder="Search reports..."
                     className="flex-1"
                     value={searchTerm}
                     onChange={(e) => handleSearch(e.target.value)}
                  />
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
               {filteredReports.slice(0, 3).map((report: Report) => (
                  <div key={report.id} className="p-4 rounded-lg border">
                     <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                           <Building2 className="h-5 w-5 text-primary" />
                           <div>
                              <p className="font-medium">{report.title}</p>
                              <p className="text-sm text-muted-foreground">
                                 Generated:{" "}
                                 {new Date(report.createdAt).toLocaleString()} •{" "}
                                 {report.summary.analyzedPosts} posts analyzed
                              </p>
                           </div>
                        </div>
                        <Badge
                           variant="default"
                           className={
                              report.summary.averageSentiment === "positive"
                                 ? "bg-green-600"
                                 : report.summary.averageSentiment === "neutral"
                                 ? "bg-blue-600"
                                 : report.summary.averageSentiment ===
                                   "negative"
                                 ? "bg-red-600"
                                 : "bg-orange-600"
                           }
                        >
                           {report.summary.averageSentiment
                              .charAt(0)
                              .toUpperCase() +
                              report.summary.averageSentiment.slice(1)}
                        </Badge>
                     </div>
                     <div className="flex items-center gap-2">
                        <Button
                           size="sm"
                           variant="outline"
                           onClick={() => handleViewReport(report.id)}
                        >
                           <Eye className="h-4 w-4 mr-1" />
                           View
                        </Button>
                        <Button
                           size="sm"
                           variant="outline"
                           onClick={() => handleDownloadReport(report.id)}
                        >
                           <Download className="h-4 w-4 mr-1" />
                           Download PDF
                        </Button>
                     </div>
                  </div>
               ))}
               {filteredReports.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                     No reports found.
                  </p>
               )}
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
                     <Button
                        size="sm"
                        className="w-full"
                        onClick={() =>
                           handleGenerateReport({
                              analysisId: "analysis1",
                              type: "executive_summary",
                           })
                        }
                     >
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
                     <Button
                        size="sm"
                        className="w-full"
                        onClick={() =>
                           handleGenerateReport({
                              analysisId: "analysis1",
                              type: "detailed_analysis",
                           })
                        }
                     >
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
               {(() => {
                  const itemsPerPage = 10;
                  const totalPages = Math.ceil(
                     filteredReports.length / itemsPerPage
                  );
                  const startIndex = (reportsPage - 1) * itemsPerPage;
                  const endIndex = startIndex + itemsPerPage;
                  const paginatedReports = filteredReports.slice(
                     startIndex,
                     endIndex
                  );

                  return (
                     <>
                        {paginatedReports.map((report: Report) => (
                           <div
                              key={report.id}
                              className="flex items-center justify-between p-3 rounded-lg border"
                           >
                              <div className="flex items-center gap-3">
                                 <FileText className="h-4 w-4 text-primary" />
                                 <div>
                                    <p className="font-medium">
                                       {report.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                       Generated:{" "}
                                       {new Date(
                                          report.createdAt
                                       ).toLocaleDateString()}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                 <Badge
                                    variant="default"
                                    className={
                                       report.summary.averageSentiment ===
                                       "positive"
                                          ? "bg-green-600"
                                          : report.summary.averageSentiment ===
                                            "neutral"
                                          ? "bg-blue-600"
                                          : report.summary.averageSentiment ===
                                            "negative"
                                          ? "bg-red-600"
                                          : "bg-orange-600"
                                    }
                                 >
                                    {report.summary.averageSentiment
                                       .charAt(0)
                                       .toUpperCase() +
                                       report.summary.averageSentiment.slice(1)}
                                 </Badge>
                                 <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                       handleDownloadReport(report.id)
                                    }
                                 >
                                    <Download className="h-4 w-4" />
                                 </Button>
                                 <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                       handleDeleteReport(report.id)
                                    }
                                 >
                                    <Trash2 className="h-4 w-4" />
                                 </Button>
                              </div>
                           </div>
                        ))}

                        {/* Pagination for reports */}
                        {totalPages > 1 && (
                           <div className="mt-6">
                              <Pagination>
                                 <PaginationContent>
                                    <PaginationItem>
                                       <PaginationPrevious
                                          onClick={() =>
                                             setReportsPage(
                                                Math.max(1, reportsPage - 1)
                                             )
                                          }
                                          className={
                                             reportsPage === 1
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
                                                setReportsPage(page)
                                             }
                                             isActive={page === reportsPage}
                                             className="cursor-pointer"
                                          >
                                             {page}
                                          </PaginationLink>
                                       </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                       <PaginationNext
                                          onClick={() =>
                                             setReportsPage(
                                                Math.min(
                                                   totalPages,
                                                   reportsPage + 1
                                                )
                                             )
                                          }
                                          className={
                                             reportsPage === totalPages
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

               {filteredReports.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                     No reports found.
                  </p>
               )}
            </CardContent>
         </Card>

         {/* Modal */}
         <GenerateReportModal
            isOpen={isGenerateReportModalOpen}
            onClose={() => setIsGenerateReportModalOpen(false)}
            onSubmit={handleGenerateReport}
            analyses={analyses}
         />
      </div>
   );
}
