import { ApiResponse, LoginResponse, RegisterResponse } from "@/types/api";

const API_BASE_URL =
   process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiService {
   private baseURL: string;
   private token: string | null = null;

   constructor(baseURL: string = API_BASE_URL) {
      this.baseURL = baseURL;
      this.token =
         typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;
   }

   private async request<T>(
      endpoint: string,
      options: RequestInit = {}
   ): Promise<ApiResponse<T>> {
      const url = `${this.baseURL}${endpoint}`;

      const config: RequestInit = {
         headers: {
            "Content-Type": "application/json",
            ...(this.token && { Authorization: `Bearer ${this.token}` }),
            ...options.headers,
         },
         ...options,
      };

      try {
         const response = await fetch(url, config);
         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.message || data.error || "Request failed");
         }

         return data;
      } catch (error) {
         console.error(`API request failed for ${endpoint}:`, error);
         throw error;
      }
   }

   // Auth endpoints
   async login(
      email: string,
      password: string
   ): Promise<ApiResponse<LoginResponse>> {
      const response = await this.request<LoginResponse>("/auth/login", {
         method: "POST",
         body: JSON.stringify({ email, password }),
      });

      if (response.success && response.data?.token) {
         this.setToken(response.data.token);
      }

      return response;
   }

   async register(
      firstName: string,
      lastName: string,
      email: string,
      password: string
   ): Promise<ApiResponse<RegisterResponse>> {
      const response = await this.request<RegisterResponse>("/auth/register", {
         method: "POST",
         body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (response.success && response.data?.token) {
         this.setToken(response.data.token);
      }

      return response;
   }

   async logout() {
      const response = await this.request("/auth/logout", {
         method: "POST",
      });

      this.setToken(null);
      return response;
   }

   async getProfile() {
      return this.request("/auth/profile");
   }

   // Brand endpoints
   async getBrands() {
      return this.request("/brands");
   }

   async getBrand(id: string) {
      return this.request(`/brands/${id}`);
   }

   async createBrand(data: any) {
      return this.request("/brands", {
         method: "POST",
         body: JSON.stringify(data),
      });
   }

   async updateBrand(id: string, data: any) {
      return this.request(`/brands/${id}`, {
         method: "PUT",
         body: JSON.stringify(data),
      });
   }

   async deleteBrand(id: string) {
      return this.request(`/brands/${id}`, {
         method: "DELETE",
      });
   }

   // Analysis endpoints
   async getAnalyses() {
      return this.request("/analyses");
   }

   async getAnalysis(id: string) {
      return this.request(`/analyses/${id}`);
   }

   async createAnalysis(data: any) {
      return this.request("/analyses", {
         method: "POST",
         body: JSON.stringify(data),
      });
   }

   async updateAnalysis(id: string, data: any) {
      return this.request(`/analyses/${id}`, {
         method: "PUT",
         body: JSON.stringify(data),
      });
   }

   async deleteAnalysis(id: string) {
      return this.request(`/analyses/${id}`, {
         method: "DELETE",
      });
   }

   async pauseAnalysis(id: string) {
      return this.request(`/analyses/${id}/pause`, {
         method: "POST",
      });
   }

   async cancelAnalysis(id: string) {
      return this.request(`/analyses/${id}/cancel`, {
         method: "POST",
      });
   }

   async resumeAnalysis(id: string) {
      return this.request(`/analyses/${id}/resume`, {
         method: "POST",
      });
   }

   // Report endpoints
   async getReports() {
      return this.request("/reports");
   }

   async getReport(id: string) {
      return this.request(`/reports/${id}`);
   }

   async createReport(data: any) {
      return this.request("/reports", {
         method: "POST",
         body: JSON.stringify(data),
      });
   }

   async updateReport(id: string, data: any) {
      return this.request(`/reports/${id}`, {
         method: "PUT",
         body: JSON.stringify(data),
      });
   }

   async deleteReport(id: string) {
      return this.request(`/reports/${id}`, {
         method: "DELETE",
      });
   }

   async downloadReport(id: string) {
      return this.request(`/reports/${id}/download`, {
         method: "GET",
      });
   }

   async shareReport(id: string) {
      return this.request(`/reports/${id}/share`, {
         method: "POST",
      });
   }

   // Health check
   async healthCheck() {
      return this.request("/health");
   }

   // Set auth token
   setToken(token: string | null) {
      this.token = token;
      if (typeof window !== "undefined") {
         if (token) {
            localStorage.setItem("authToken", token);
         } else {
            localStorage.removeItem("authToken");
         }
      }
   }

   // Get auth token
   getToken(): string | null {
      return this.token;
   }
}

// Create singleton instance
export const apiService = new ApiService();
export default apiService;
