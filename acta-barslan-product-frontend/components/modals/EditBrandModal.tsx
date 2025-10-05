"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Brand, UpdateBrandRequest } from "@/types/brand";

interface EditBrandModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSubmit: (data: UpdateBrandRequest) => void;
   brand: Brand | null;
}

export function EditBrandModal({
   isOpen,
   onClose,
   onSubmit,
   brand,
}: EditBrandModalProps) {
   const [formData, setFormData] = useState<UpdateBrandRequest>({
      name: "",
      keywords: [],
      status: "active",
   });
   const [keywordInput, setKeywordInput] = useState("");

   useEffect(() => {
      if (brand) {
         setFormData({
            name: brand.name,
            keywords: brand.keywords,
            status: brand.status,
         });
      }
   }, [brand]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (
         formData.name?.trim() &&
         formData.keywords &&
         formData.keywords.length > 0
      ) {
         onSubmit(formData);
         setFormData({ name: "", keywords: [], status: "active" });
         setKeywordInput("");
         onClose();
      }
   };

   const addKeyword = () => {
      if (
         keywordInput.trim() &&
         !formData.keywords?.includes(keywordInput.trim())
      ) {
         setFormData({
            ...formData,
            keywords: [...(formData.keywords || []), keywordInput.trim()],
         });
         setKeywordInput("");
      }
   };

   const removeKeyword = (keyword: string) => {
      setFormData({
         ...formData,
         keywords: formData.keywords?.filter((k) => k !== keyword),
      });
   };

   const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
         e.preventDefault();
         addKeyword();
      }
   };

   if (!brand) return null;

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
               <DialogTitle>Edit Brand</DialogTitle>
               <DialogDescription>
                  Update brand information and monitoring settings.
               </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                  <label htmlFor="brandName" className="text-sm font-medium">
                     Brand Name
                  </label>
                  <Input
                     id="brandName"
                     placeholder="Enter brand name (e.g., Yahoo)"
                     value={formData.name || ""}
                     onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                     }
                     required
                  />
               </div>

               <div className="space-y-2">
                  <label htmlFor="keywords" className="text-sm font-medium">
                     Keywords
                  </label>
                  <div className="flex gap-2">
                     <Input
                        id="keywords"
                        placeholder="Enter keyword (e.g., yahoo mail)"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                     />
                     <Button type="button" onClick={addKeyword} size="sm">
                        <Plus className="h-4 w-4" />
                     </Button>
                  </div>

                  {formData.keywords && formData.keywords.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-2">
                        {formData.keywords.map((keyword) => (
                           <Badge
                              key={keyword}
                              variant="secondary"
                              className="flex items-center gap-1"
                           >
                              {keyword}
                              <X
                                 className="h-3 w-3 cursor-pointer"
                                 onClick={() => removeKeyword(keyword)}
                              />
                           </Badge>
                        ))}
                     </div>
                  )}
               </div>

               <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                     Status
                  </label>
                  <select
                     id="status"
                     value={formData.status || "active"}
                     onChange={(e) =>
                        setFormData({
                           ...formData,
                           status: e.target.value as
                              | "active"
                              | "monitoring"
                              | "inactive",
                        })
                     }
                     className="w-full p-2 border rounded-md bg-background"
                  >
                     <option value="active">Active</option>
                     <option value="monitoring">Monitoring</option>
                     <option value="inactive">Inactive</option>
                  </select>
               </div>

               <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     disabled={
                        !formData.name?.trim() ||
                        !formData.keywords ||
                        formData.keywords.length === 0
                     }
                  >
                     Update Brand
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
