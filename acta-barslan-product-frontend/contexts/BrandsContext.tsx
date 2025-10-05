"use client";

import {
   createContext,
   useContext,
   useState,
   useEffect,
   ReactNode,
} from "react";
import { Brand, CreateBrandRequest, UpdateBrandRequest } from "@/types/brand";
import { mockBrands } from "@/data/mockBrands";
import { apiService } from "@/services/api";
import { useToast } from "@/components/ui/toast";
import { BrandApiData } from "@/types/api";
import { useAuth } from "@/contexts/AuthContext";

interface BrandsContextType {
   brands: Brand[];
   isLoading: boolean;
   error: string | null;
   createBrand: (data: CreateBrandRequest) => Promise<Brand>;
   updateBrand: (id: string, data: UpdateBrandRequest) => Promise<Brand>;
   deleteBrand: (id: string) => Promise<void>;
   getBrand: (id: string) => Brand | undefined;
   searchBrands: (query: string) => Brand[];
   refreshBrands: () => Promise<void>;
}

const BrandsContext = createContext<BrandsContextType | undefined>(undefined);

export function BrandsProvider({ children }: { children: ReactNode }) {
   const [brands, setBrands] = useState<Brand[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const { success, error: showError } = useToast();
   const { isAuthenticated } = useAuth();

   // Load brands on mount only if authenticated
   useEffect(() => {
      if (isAuthenticated) {
         refreshBrands();
      } else {
         setIsLoading(false);
      }
   }, [isAuthenticated]);

   const createBrand = async (data: CreateBrandRequest): Promise<Brand> => {
      setIsLoading(true);
      setError(null);

      try {
         const response = await apiService.createBrand(data);

         if (response.success && response.data) {
            const brandData = response.data as BrandApiData;
            const newBrand: Brand = {
               id: brandData._id,
               name: brandData.name,
               keywords: brandData.keywords,
               status: brandData.status as "active" | "inactive" | "monitoring",
               createdAt: new Date(brandData.createdAt),
               updatedAt: new Date(brandData.updatedAt),
               totalAnalyses: brandData.totalAnalyses || 0,
               averageSentiment: (brandData.averageSentiment || "neutral") as
                  | "positive"
                  | "negative"
                  | "neutral"
                  | "mixed",
               sentimentScore: brandData.sentimentScore || 50,
               lastAnalysisAt: brandData.lastAnalysisAt
                  ? new Date(brandData.lastAnalysisAt)
                  : undefined,
            };

            setBrands((prev) => [newBrand, ...prev]);
            success(
               "Brand created",
               `${brandData.name} has been added successfully!`
            );
            return newBrand;
         } else {
            throw new Error(response.message || "Failed to create brand");
         }
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Failed to create brand";
         setError(errorMessage);
         showError("Failed to create brand", errorMessage);
         throw err;
      } finally {
         setIsLoading(false);
      }
   };

   const updateBrand = async (
      id: string,
      data: UpdateBrandRequest
   ): Promise<Brand> => {
      setIsLoading(true);
      setError(null);

      try {
         // TODO: Implement actual API call
         console.log("Updating brand:", { id, data });

         setBrands((prev) =>
            prev.map((brand) =>
               brand.id === id
                  ? { ...brand, ...data, updatedAt: new Date() }
                  : brand
            )
         );

         const updatedBrand = brands.find((b) => b.id === id);
         if (!updatedBrand) throw new Error("Brand not found");

         return { ...updatedBrand, ...data, updatedAt: new Date() };
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Failed to update brand";
         setError(errorMessage);
         throw err;
      } finally {
         setIsLoading(false);
      }
   };

   const deleteBrand = async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
         // TODO: Implement actual API call
         console.log("Deleting brand:", id);

         setBrands((prev) => prev.filter((brand) => brand.id !== id));
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Failed to delete brand";
         setError(errorMessage);
         throw err;
      } finally {
         setIsLoading(false);
      }
   };

   const getBrand = (id: string): Brand | undefined => {
      return brands.find((brand) => brand.id === id);
   };

   const searchBrands = (query: string): Brand[] => {
      if (!query.trim()) return brands;

      const lowercaseQuery = query.toLowerCase();
      return brands.filter(
         (brand) =>
            brand.name.toLowerCase().includes(lowercaseQuery) ||
            brand.keywords.some((keyword) =>
               keyword.toLowerCase().includes(lowercaseQuery)
            )
      );
   };

   const refreshBrands = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
         const response = await apiService.getBrands();

         if (response.success && response.data) {
            const brandsData: Brand[] = (response.data as BrandApiData[]).map(
               (brand) => ({
                  id: brand._id,
                  name: brand.name,
                  keywords: brand.keywords,
                  status: brand.status as "active" | "inactive" | "monitoring",
                  createdAt: new Date(brand.createdAt),
                  updatedAt: new Date(brand.updatedAt),
                  totalAnalyses: brand.totalAnalyses || 0,
                  averageSentiment: (brand.averageSentiment || "neutral") as
                     | "positive"
                     | "negative"
                     | "neutral"
                     | "mixed",
                  sentimentScore: brand.sentimentScore || 50,
                  lastAnalysisAt: brand.lastAnalysisAt
                     ? new Date(brand.lastAnalysisAt)
                     : undefined,
               })
            );

            setBrands(brandsData);
         } else {
            // No data from API
            setBrands([]);
         }
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Failed to refresh brands";
         setError(errorMessage);
         // Keep empty array on error
         setBrands([]);
         console.warn("Failed to load brands:", errorMessage);
      } finally {
         setIsLoading(false);
      }
   };

   const value: BrandsContextType = {
      brands,
      isLoading,
      error,
      createBrand,
      updateBrand,
      deleteBrand,
      getBrand,
      searchBrands,
      refreshBrands,
   };

   return (
      <BrandsContext.Provider value={value}>{children}</BrandsContext.Provider>
   );
}

export function useBrands() {
   const context = useContext(BrandsContext);
   if (context === undefined) {
      throw new Error("useBrands must be used within a BrandsProvider");
   }
   return context;
}
