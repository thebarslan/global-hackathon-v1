export interface Report {
   id: string;
   analysisId: string;
   brandName: string;
   title: string;
   type: "executive_summary" | "detailed_analysis" | "custom";
   status: "generating" | "completed" | "failed";
   createdAt: Date;
   completedAt?: Date;
   filePath?: string;
   downloadUrl?: string;
   shareUrl?: string;
   summary: ReportSummary;
   charts: Chart[];
   insights: Insight[];
   metadata?: ReportMetadata;
   error?: ReportError;
}

export interface ReportMetadata {
   generationTime: number;
   fileSize: number;
   chartCount: number;
   insightCount: number;
}

export interface ReportError {
   message: string;
   code: string;
   timestamp: Date;
}

export interface ReportSummary {
   totalPosts: number;
   analyzedPosts: number;
   averageSentiment: "positive" | "neutral" | "negative" | "mixed";
   sentimentScore: number; // 0-100
   topKeywords: KeywordFrequency[];
   sentimentDistribution: SentimentDistribution;
   timeRange: {
      start: Date;
      end: Date;
   };
}

export interface KeywordFrequency {
   keyword: string;
   frequency: number;
   sentiment: "positive" | "neutral" | "negative" | "mixed";
}

export interface SentimentDistribution {
   positive: number;
   neutral: number;
   negative: number;
   mixed: number;
}

export interface Chart {
   id: string;
   type:
      | "sentiment_pie"
      | "sentiment_timeline"
      | "keyword_cloud"
      | "subreddit_distribution";
   title: string;
   data: any;
   config: any;
}

export interface Insight {
   id: string;
   type: "trend" | "anomaly" | "recommendation" | "warning";
   title: string;
   description: string;
   severity: "low" | "medium" | "high";
   confidence: number; // 0-1
}

export interface CreateReportRequest {
   analysisId: string;
   type: "executive_summary" | "detailed_analysis" | "custom";
   title?: string;
   includeCharts?: boolean;
   includeInsights?: boolean;
}

export interface ReportStats {
   totalReports: number;
   downloaded: number;
   shared: number;
   thisWeek: number;
}
