"use client";

import React, { useState } from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateReportRequest } from "@/types/report";
import { Analysis } from "@/types/analysis";

interface GenerateReportModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSubmit: (data: CreateReportRequest) => void;
   analyses: Analysis[];
}

export function GenerateReportModal({
   isOpen,
   onClose,
   onSubmit,
   analyses,
}: GenerateReportModalProps) {
   const [formData, setFormData] = useState<CreateReportRequest>({
      analysisId: "",
      type: "executive_summary",
      title: "",
      includeCharts: true,
      includeInsights: true,
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.analysisId) {
         onSubmit(formData);
         setFormData({
            analysisId: "",
            type: "executive_summary",
            title: "",
            includeCharts: true,
            includeInsights: true,
         });
         onClose();
      }
   };

   const selectedAnalysis = analyses.find(
      (analysis) => analysis.id === formData.analysisId
   );

   // Auto-fill title when analysis is selected
   React.useEffect(() => {
      if (selectedAnalysis && !formData.title) {
         setFormData((prev) => ({
            ...prev,
            title: `${selectedAnalysis.brandName} Analysis Report`,
         }));
      }
   }, [selectedAnalysis, formData.title]);

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
               <DialogTitle>Generate Report</DialogTitle>
               <DialogDescription>
                  Create a new report from analysis data.
               </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                  <label htmlFor="analysis" className="text-sm font-medium">
                     Select Analysis
                  </label>
                  <select
                     id="analysis"
                     value={formData.analysisId}
                     onChange={(e) =>
                        setFormData({ ...formData, analysisId: e.target.value })
                     }
                     className="w-full p-2 border rounded-md bg-background"
                  >
                     <option value="">Choose an analysis</option>
                     {analyses
                        .filter((analysis) => analysis.status === "completed")
                        .map((analysis) => (
                           <option key={analysis.id} value={analysis.id}>
                              {analysis.brandName} - {analysis.averageSentiment}{" "}
                              ({analysis.sentimentScore}%)
                              {analysis.completedAt?.toLocaleString()}
                           </option>
                        ))}
                  </select>
               </div>

               {selectedAnalysis && (
                  <div className="p-3 bg-muted rounded-lg">
                     <p className="text-sm font-medium">
                        Selected Analysis: {selectedAnalysis.brandName}
                     </p>
                     <p className="text-sm text-muted-foreground">
                        Status: {selectedAnalysis.status} | Posts:{" "}
                        {selectedAnalysis.analyzedPosts}/
                        {selectedAnalysis.totalPosts}
                     </p>
                  </div>
               )}

               <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                     Report Title
                  </label>
                  <Input
                     id="title"
                     placeholder="Enter report title (optional)"
                     value={formData.title || ""}
                     onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                     }
                  />
               </div>

               <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                     <strong>Note:</strong> Report generation may take a few
                     minutes depending on the amount of data and selected
                     options.
                  </p>
               </div>

               <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                     Cancel
                  </Button>
                  <Button type="submit" disabled={!formData.analysisId}>
                     Generate Report
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
