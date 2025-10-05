import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
   title: string;
   description?: string;
   children?: ReactNode;
   className?: string;
}

export function PageHeader({
   title,
   description,
   children,
   className,
}: PageHeaderProps) {
   return (
      <div className={cn("flex items-center justify-between mb-6", className)}>
         <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {description && (
               <p className="text-muted-foreground mt-1">{description}</p>
            )}
         </div>
         {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
   );
}
