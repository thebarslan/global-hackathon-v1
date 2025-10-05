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
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { CreateBrandRequest } from "@/types/brand";

interface AddBrandModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSubmit: (data: CreateBrandRequest) => void;
}

export function AddBrandModal({
   isOpen,
   onClose,
   onSubmit,
}: AddBrandModalProps) {
   const [formData, setFormData] = useState<CreateBrandRequest>({
      name: "",
      keywords: [],
   });
   const [keywordInput, setKeywordInput] = useState("");

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.name.trim() && formData.keywords.length > 0) {
         onSubmit(formData);
         setFormData({ name: "", keywords: [] });
         setKeywordInput("");
         onClose();
      }
   };

   const addKeyword = () => {
      if (
         keywordInput.trim() &&
         !formData.keywords.includes(keywordInput.trim())
      ) {
         setFormData({
            ...formData,
            keywords: [...formData.keywords, keywordInput.trim()],
         });
         setKeywordInput("");
      }
   };

   const removeKeyword = (keyword: string) => {
      setFormData({
         ...formData,
         keywords: formData.keywords.filter((k) => k !== keyword),
      });
   };

   const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
         e.preventDefault();
         addKeyword();
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
               <DialogTitle>Add New Brand</DialogTitle>
               <DialogDescription>
                  Add a new brand to monitor and analyze sentiment.
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
                     value={formData.name}
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

                  {formData.keywords.length > 0 && (
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

               <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     disabled={
                        !formData.name.trim() || formData.keywords.length === 0
                     }
                  >
                     Add Brand
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
