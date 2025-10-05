import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
   icon?: ReactNode;
   title: string;
   description?: string;
   action?: {
      label: string;
      onClick: () => void;
   };
   className?: string;
}

export function EmptyState({
   icon,
   title,
   description,
   action,
   className,
}: EmptyStateProps) {
   return (
      <div
         className={cn(
            "flex flex-col items-center justify-center py-12 px-4 text-center",
            className
         )}
      >
         {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
         <h3 className="text-lg font-semibold mb-2">{title}</h3>
         {description && (
            <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
         )}
         {action && <Button onClick={action.onClick}>{action.label}</Button>}
      </div>
   );
}

interface EmptyStateWithIconProps {
   icon: ReactNode;
   title: string;
   description?: string;
   action?: {
      label: string;
      onClick: () => void;
   };
   className?: string;
}

export function EmptyStateWithIcon({
   icon,
   title,
   description,
   action,
   className,
}: EmptyStateWithIconProps) {
   return (
      <EmptyState
         icon={
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
               {icon}
            </div>
         }
         title={title}
         description={description}
         action={action}
         className={className}
      />
   );
}
