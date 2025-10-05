import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
   title: string;
   value: string | number;
   description?: string;
   icon?: ReactNode;
   trend?: {
      value: number;
      label: string;
      isPositive?: boolean;
   };
   className?: string;
}

export function StatsCard({
   title,
   value,
   description,
   icon,
   trend,
   className,
}: StatsCardProps) {
   return (
      <Card className={cn("", className)}>
         <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
               {icon && <div className="text-muted-foreground">{icon}</div>}
               <p className="text-sm font-medium text-muted-foreground">
                  {title}
               </p>
            </div>
            <div className="space-y-1">
               <p className="text-2xl font-bold">{value}</p>
               {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
               )}
               {trend && (
                  <div className="flex items-center gap-1">
                     <span
                        className={cn(
                           "text-sm font-medium",
                           trend.isPositive ? "text-green-600" : "text-red-600"
                        )}
                     >
                        {trend.isPositive ? "+" : ""}
                        {trend.value}%
                     </span>
                     <span className="text-sm text-muted-foreground">
                        {trend.label}
                     </span>
                  </div>
               )}
            </div>
         </CardContent>
      </Card>
   );
}
