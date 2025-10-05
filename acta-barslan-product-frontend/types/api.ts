// API Response Types
export interface ApiResponse<T = any> {
   success: boolean;
   data?: T;
   message?: string;
   error?: string;
   count?: number;
}

// Auth API Types
export interface LoginResponse {
   token: string;
   user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      subscription?: {
         isSubscribed: boolean;
         plan: string;
         startDate: string;
         endDate: string;
         autoRenew: boolean;
         status: string;
         features: {
            maxBrands: number;
            maxAnalyses: number;
            maxReports: number;
            redditApiCalls: number;
            geminiApiCalls: number;
         };
      };
   };
}

export interface RegisterResponse {
   token: string;
   user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      subscription?: {
         isSubscribed: boolean;
         plan: string;
         startDate: string;
         endDate: string;
         autoRenew: boolean;
         status: string;
         features: {
            maxBrands: number;
            maxAnalyses: number;
            maxReports: number;
            redditApiCalls: number;
            geminiApiCalls: number;
         };
      };
   };
}

export interface ProfileResponse {
   user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      subscription?: {
         isSubscribed: boolean;
         plan: string;
         startDate: string;
         endDate: string;
         autoRenew: boolean;
         status: string;
         features: {
            maxBrands: number;
            maxAnalyses: number;
            maxReports: number;
            redditApiCalls: number;
            geminiApiCalls: number;
         };
      };
   };
}

// Brand API Types
export interface BrandApiData {
   _id: string;
   name: string;
   keywords: string[];
   status: string;
   createdAt: string;
   updatedAt: string;
   totalAnalyses?: number;
   averageSentiment?: string;
   sentimentScore?: number;
   lastAnalysisAt?: string;
}

// Analysis API Types
export interface AnalysisApiData {
   _id: string;
   brandId: string;
   brandName: string;
   status: string;
   progress?: number;
   redditPosts?: any[];
   sentimentResults?: any[];
   createdAt: string;
   startedAt?: string;
   completedAt?: string;
   totalPosts?: number;
   analyzedPosts?: number;
   averageSentiment?: string;
   sentimentScore?: number;
}

// Report API Types
export interface ReportApiData {
   _id: string;
   analysisId: string;
   brandName: string;
   title: string;
   type: string;
   status: string;
   createdAt: string;
   completedAt?: string;
   filePath?: string;
   downloadUrl?: string;
   shareUrl?: string;
   summary?: any;
   charts?: any[];
   insights?: any[];
   metadata?: {
      generationTime: number;
      fileSize: number;
      chartCount: number;
      insightCount: number;
   };
   error?: {
      message: string;
      code: string;
      timestamp: string;
   };
}
