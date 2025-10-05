export interface Brand {
   id: string;
   name: string;
   keywords: string[];
   status: "active" | "monitoring" | "inactive";
   createdAt: Date;
   updatedAt: Date;
   lastAnalysisAt?: Date;
   totalAnalyses: number;
   averageSentiment: "positive" | "neutral" | "negative" | "mixed";
   sentimentScore: number; // 0-100
}

export interface CreateBrandRequest {
   name: string;
   keywords: string[];
}

export interface UpdateBrandRequest {
   name?: string;
   keywords?: string[];
   status?: "active" | "monitoring" | "inactive";
}

export interface BrandStats {
   totalBrands: number;
   activeAnalyses: number;
   positiveSentiment: number;
   analysesToday: number;
}
