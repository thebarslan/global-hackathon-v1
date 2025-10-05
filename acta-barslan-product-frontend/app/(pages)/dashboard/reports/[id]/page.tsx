"use client";

import { ReportViewPage } from "@/pages/reports/ReportViewPage";

interface PageProps {
   params: Promise<{
      id: string;
   }>;
}

export default async function Page({ params }: PageProps) {
   const { id } = await params;
   return <ReportViewPage reportId={id} />;
}
