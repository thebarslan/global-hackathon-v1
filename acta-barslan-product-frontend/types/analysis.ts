export interface Analysis {
   id: string;
   brandId: string;
   brandName: string;
   status: "pending" | "in_progress" | "completed" | "failed";
   progress: number; // 0-100
   redditPosts: RedditPost[];
   sentimentResults: SentimentResult[];
   createdAt: Date;
   startedAt?: Date;
   completedAt?: Date;
   totalPosts: number;
   analyzedPosts: number;
   averageSentiment:
      | "positive"
      | "neutral"
      | "negative"
      | "mixed"
      | "not applicable";
   sentimentScore: number; // 0-100
}

export interface RedditPost {
   id: string;
   title: string;
   content: string;
   author: string;
   subreddit: string;
   score: number;
   numComments: number;
   upvoteRatio: number;
   createdAt: Date;
   url: string;
   permalink: string;
}

export interface SentimentResult {
   postId: string;
   sentiment: "positive" | "neutral" | "negative" | "mixed" | "not applicable";
   confidence: number; // 0-1
   keywords: string[];
   summary: string;
}

export interface CreateAnalysisRequest {
   brandId: string;
   keyword: string;
   maxPosts?: number;
}

export interface AnalysisStats {
   totalAnalyses: number;
   inProgress: number;
   completed: number;
   failed: number;
}
