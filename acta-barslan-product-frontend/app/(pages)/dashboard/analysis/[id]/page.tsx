"use client";

import { useParams } from "next/navigation";
import { AnalysisResultsPage } from "@/pages/analysis/AnalysisResultsPage";

export default function AnalysisResultsRoutePage() {
   const params = useParams();
   const analysisId = params?.id as string;

   if (!analysisId) {
      return <div>Analysis ID not found</div>;
   }

   return <AnalysisResultsPage analysisId={analysisId} />;
}
