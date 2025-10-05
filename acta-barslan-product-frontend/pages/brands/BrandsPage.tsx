"use client";

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
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   Building2,
   Plus,
   Search,
   BarChart3,
   Calendar,
   TrendingUp,
} from "lucide-react";

import { useState, useEffect } from "react";
import { Brand, CreateBrandRequest, UpdateBrandRequest } from "@/types/brand";
import { CreateAnalysisRequest } from "@/types/analysis";
import { AddBrandModal } from "@/components/modals/AddBrandModal";
import { StartAnalysisModal } from "@/components/modals/StartAnalysisModal";
import { EditBrandModal } from "@/components/modals/EditBrandModal";
import { useBrands } from "@/contexts/BrandsContext";
import { useAnalysis } from "@/contexts/AnalysisContext";
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

export function BrandsPage() {
   const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
   const [isStartAnalysisModalOpen, setIsStartAnalysisModalOpen] =
      useState(false);
   const [brandsPage, setBrandsPage] = useState(1);
   const [isEditBrandModalOpen, setIsEditBrandModalOpen] = useState(false);
   const [selectedBrandForAnalysis, setSelectedBrandForAnalysis] =
      useState<Brand | null>(null);
   const [selectedBrandForEdit, setSelectedBrandForEdit] =
      useState<Brand | null>(null);
   const [searchTerm, setSearchTerm] = useState("");
   const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);

   const {
      brands,
      createBrand,
      updateBrand,
      searchBrands,
      isLoading: brandsLoading,
   } = useBrands();
   const {
      analyses,
      createAnalysis,
      isLoading: analysesLoading,
   } = useAnalysis();
   const { success, error } = useToast();

   const isLoading = brandsLoading || analysesLoading;

   // Update filtered brands when brands change
   useEffect(() => {
      if (searchTerm.trim() === "") {
         setFilteredBrands(brands);
      } else {
         setFilteredBrands(searchBrands(searchTerm));
      }
   }, [brands, searchTerm, searchBrands]);

   const handleAddBrand = async (data: CreateBrandRequest) => {
      try {
         await createBrand(data);
         setIsAddBrandModalOpen(false);
      } catch (err) {
         console.error("Failed to add brand:", err);
      }
   };

   const handleStartAnalysis = async (data: CreateAnalysisRequest) => {
      try {
         await createAnalysis(data);
         setIsStartAnalysisModalOpen(false);
         setSelectedBrandForAnalysis(null);
      } catch (err) {
         console.error("Failed to start analysis:", err);
      }
   };

   const handleAnalyzeBrand = (brand: Brand) => {
      setSelectedBrandForAnalysis(brand);
      setIsStartAnalysisModalOpen(true);
   };

   const handleEditBrand = (brand: Brand) => {
      setSelectedBrandForEdit(brand);
      setIsEditBrandModalOpen(true);
   };

   const handleUpdateBrand = async (data: UpdateBrandRequest) => {
      if (!selectedBrandForEdit) return;

      try {
         await updateBrand(selectedBrandForEdit.id, data);
         setIsEditBrandModalOpen(false);
         setSelectedBrandForEdit(null);
      } catch (err) {
         console.error("Failed to update brand:", err);
      }
   };

   const handleSearch = (term: string) => {
      setSearchTerm(term);
   };

   // Calculate stats from real data
   const totalBrands = brands.length;
   const activeAnalyses = analyses.filter(
      (a) => a.status === "in_progress"
   ).length;
   const completedAnalyses = analyses.filter((a) => a.status === "completed");
   const positiveSentiment =
      completedAnalyses.length > 0
         ? Math.round(
              (completedAnalyses.filter(
                 (a) => a.averageSentiment === "positive"
              ).length /
                 completedAnalyses.length) *
                 100
           )
         : 0;
   const analysesToday = analyses.filter((a) => {
      const today = new Date();
      const analysisDate = new Date(a.createdAt);
      return analysisDate.toDateString() === today.toDateString();
   }).length;

   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner text="Loading brands..." size="lg" />
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Brands</h1>
               <p className="text-muted-foreground">
                  Manage your brand monitoring and analysis
               </p>
            </div>
            <Button
               className="flex items-center gap-2"
               onClick={() => setIsAddBrandModalOpen(true)}
            >
               <Plus className="h-4 w-4" />
               Add Brand
            </Button>
         </div>

         {/* Search and Filters */}
         <Card>
            <CardHeader className="pb-3">
               <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Brands
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex gap-4">
                  <Input
                     placeholder="Search brands..."
                     className="flex-1"
                     value={searchTerm}
                     onChange={(e) => handleSearch(e.target.value)}
                  />
                  <Button variant="outline">Filter</Button>
               </div>
            </CardContent>
         </Card>

         {/* Brand Stats */}
         <div className="grid gap-4 md:grid-cols-4">
            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                     <Building2 className="h-5 w-5 text-primary" />
                     <div>
                        <p className="text-2xl font-bold">{totalBrands}</p>
                        <p className="text-sm text-muted-foreground">
                           Total Brands
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                     <BarChart3 className="h-5 w-5 text-green-600" />
                     <div>
                        <p className="text-2xl font-bold">{activeAnalyses}</p>
                        <p className="text-sm text-muted-foreground">
                           Active Analyses
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                     <TrendingUp className="h-5 w-5 text-blue-600" />
                     <div>
                        <p className="text-2xl font-bold">
                           {positiveSentiment}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                           Positive Sentiment
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
                        <p className="text-2xl font-bold">{analysesToday}</p>
                        <p className="text-sm text-muted-foreground">
                           Analyses Today
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Brand List */}
         <Card>
            <CardHeader>
               <CardTitle>Brand List</CardTitle>
               <CardDescription>
                  All your monitored brands and their current status
               </CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Brand Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Analysis</TableHead>
                        <TableHead>Sentiment</TableHead>
                        <TableHead>Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {(() => {
                        const itemsPerPage = 10;
                        const totalPages = Math.ceil(
                           filteredBrands.length / itemsPerPage
                        );
                        const startIndex = (brandsPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedBrands = filteredBrands.slice(
                           startIndex,
                           endIndex
                        );

                        return (
                           <>
                              {paginatedBrands.map((brand: Brand) => (
                                 <TableRow key={brand.id}>
                                    <TableCell className="font-medium">
                                       {brand.name}
                                    </TableCell>
                                    <TableCell>
                                       <Badge
                                          variant={
                                             brand.status === "active"
                                                ? "secondary"
                                                : brand.status === "monitoring"
                                                ? "outline"
                                                : "destructive"
                                          }
                                       >
                                          {brand.status
                                             .charAt(0)
                                             .toUpperCase() +
                                             brand.status.slice(1)}
                                       </Badge>
                                    </TableCell>
                                    <TableCell>
                                       {brand.lastAnalysisAt
                                          ? new Date(
                                               brand.lastAnalysisAt
                                            ).toLocaleString()
                                          : "Never"}
                                    </TableCell>
                                    <TableCell>
                                       <Badge
                                          variant="default"
                                          className={
                                             brand.averageSentiment ===
                                             "positive"
                                                ? "bg-green-600"
                                                : brand.averageSentiment ===
                                                  "neutral"
                                                ? "bg-blue-600"
                                                : brand.averageSentiment ===
                                                  "negative"
                                                ? "bg-red-600"
                                                : "bg-orange-600"
                                          }
                                       >
                                          {brand.averageSentiment
                                             .charAt(0)
                                             .toUpperCase() +
                                             brand.averageSentiment.slice(1)}
                                       </Badge>
                                    </TableCell>
                                    <TableCell>
                                       <div className="flex gap-2">
                                          <Button
                                             size="sm"
                                             variant="outline"
                                             onClick={() =>
                                                handleAnalyzeBrand(brand)
                                             }
                                          >
                                             <BarChart3 className="h-4 w-4 mr-1" />
                                             Analyze
                                          </Button>
                                          <Button
                                             size="sm"
                                             variant="outline"
                                             onClick={() =>
                                                handleEditBrand(brand)
                                             }
                                          >
                                             Edit
                                          </Button>
                                       </div>
                                    </TableCell>
                                 </TableRow>
                              ))}

                              {/* Pagination for brands table */}
                              {totalPages > 1 && (
                                 <TableRow>
                                    <TableCell
                                       colSpan={5}
                                       className="text-center py-6"
                                    >
                                       <Pagination>
                                          <PaginationContent>
                                             <PaginationItem>
                                                <PaginationPrevious
                                                   onClick={() =>
                                                      setBrandsPage(
                                                         Math.max(
                                                            1,
                                                            brandsPage - 1
                                                         )
                                                      )
                                                   }
                                                   className={
                                                      brandsPage === 1
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
                                                         setBrandsPage(page)
                                                      }
                                                      isActive={
                                                         page === brandsPage
                                                      }
                                                      className="cursor-pointer"
                                                   >
                                                      {page}
                                                   </PaginationLink>
                                                </PaginationItem>
                                             ))}

                                             <PaginationItem>
                                                <PaginationNext
                                                   onClick={() =>
                                                      setBrandsPage(
                                                         Math.min(
                                                            totalPages,
                                                            brandsPage + 1
                                                         )
                                                      )
                                                   }
                                                   className={
                                                      brandsPage === totalPages
                                                         ? "pointer-events-none opacity-50"
                                                         : "cursor-pointer"
                                                   }
                                                />
                                             </PaginationItem>
                                          </PaginationContent>
                                       </Pagination>
                                    </TableCell>
                                 </TableRow>
                              )}
                           </>
                        );
                     })()}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>

         {/* Modals */}
         <AddBrandModal
            isOpen={isAddBrandModalOpen}
            onClose={() => setIsAddBrandModalOpen(false)}
            onSubmit={handleAddBrand}
         />

         <StartAnalysisModal
            isOpen={isStartAnalysisModalOpen}
            onClose={() => {
               setIsStartAnalysisModalOpen(false);
               setSelectedBrandForAnalysis(null);
            }}
            onSubmit={handleStartAnalysis}
            brands={
               selectedBrandForAnalysis ? [selectedBrandForAnalysis] : brands
            }
         />

         <EditBrandModal
            isOpen={isEditBrandModalOpen}
            onClose={() => {
               setIsEditBrandModalOpen(false);
               setSelectedBrandForEdit(null);
            }}
            onSubmit={handleUpdateBrand}
            brand={selectedBrandForEdit}
         />
      </div>
   );
}
