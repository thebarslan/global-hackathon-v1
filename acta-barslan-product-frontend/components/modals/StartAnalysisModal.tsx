"use client";

import { useState } from "react";
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
// import { Label } from "@/components/ui/label";
// import {
//    Select,
//    SelectContent,
//    SelectItem,
//    SelectTrigger,
//    SelectValue,
// } from "@/components/ui/select";
import { CreateAnalysisRequest } from "@/types/analysis";
import { Brand } from "@/types/brand";

interface StartAnalysisModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSubmit: (data: CreateAnalysisRequest) => void;
   brands: Brand[];
}

export function StartAnalysisModal({
   isOpen,
   onClose,
   onSubmit,
   brands,
}: StartAnalysisModalProps) {
   const [formData, setFormData] = useState<CreateAnalysisRequest>({
      brandId: "",
      keyword: "",
      maxPosts: 20,
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.brandId) {
         const selectedBrand = brands.find(
            (brand) => brand.id === formData.brandId
         );
         if (selectedBrand) {
            // Use the first keyword from the selected brand
            const keyword = selectedBrand.keywords[0] || selectedBrand.name;
            onSubmit({
               brandId: formData.brandId,
               keyword: keyword,
               maxPosts: formData.maxPosts || 20,
            });
            setFormData({ brandId: "", keyword: "", maxPosts: 20 });
            onClose();
         }
      }
   };

   const selectedBrand = brands.find((brand) => brand.id === formData.brandId);

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
               <DialogTitle>Start New Analysis</DialogTitle>
               <DialogDescription>
                  Start sentiment analysis for a brand using Reddit data.
               </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                  <label htmlFor="brand" className="text-sm font-medium">
                     Select Brand
                  </label>
                  <select
                     id="brand"
                     value={formData.brandId}
                     onChange={(e) =>
                        setFormData({ ...formData, brandId: e.target.value })
                     }
                     className="w-full p-2 border rounded-md bg-background"
                  >
                     <option value="">Choose a brand to analyze</option>
                     {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                           {brand.name}
                        </option>
                     ))}
                  </select>
               </div>

               {selectedBrand && (
                  <div className="p-3 bg-muted rounded-lg">
                     <p className="text-sm font-medium">
                        Selected Brand: {selectedBrand.name}
                     </p>
                     <p className="text-sm text-muted-foreground">
                        Keywords: {selectedBrand.keywords.join(", ")}
                     </p>
                  </div>
               )}

               <div className="space-y-2">
                  <label htmlFor="maxPosts" className="text-sm font-medium">
                     Maximum Posts to Analyze
                  </label>
                  <select
                     id="maxPosts"
                     value={formData.maxPosts?.toString()}
                     onChange={(e) =>
                        setFormData({
                           ...formData,
                           maxPosts: parseInt(e.target.value),
                        })
                     }
                     className="w-full p-2 border rounded-md bg-background"
                  >
                     <option value="100">100 posts</option>
                  </select>
               </div>

               <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                     <strong>Note:</strong> Analysis will fetch Reddit posts
                     containing your brand keywords and analyze sentiment using
                     AI. This process may take a few minutes.
                  </p>
               </div>

               <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                     Cancel
                  </Button>
                  <Button type="submit" disabled={!formData.brandId}>
                     Start Analysis
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
