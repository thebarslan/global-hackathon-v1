import { cn } from "@/lib/utils";

interface LoadingProps {
   size?: "sm" | "md" | "lg";
   className?: string;
}

export function Loading({ size = "md", className }: LoadingProps) {
   const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
   };

   return (
      <div
         className={cn(
            "animate-spin rounded-full border-2 border-muted border-t-primary",
            sizeClasses[size],
            className
         )}
      />
   );
}

interface LoadingSpinnerProps {
   text?: string;
   size?: "sm" | "md" | "lg";
   className?: string;
}

export function LoadingSpinner({
   text = "Loading...",
   size = "md",
   className,
}: LoadingSpinnerProps) {
   return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
         <Loading size={size} />
         <span className="text-sm text-muted-foreground">{text}</span>
      </div>
   );
}

interface LoadingOverlayProps {
   isLoading: boolean;
   children: React.ReactNode;
   text?: string;
}

export function LoadingOverlay({
   isLoading,
   children,
   text = "Loading...",
}: LoadingOverlayProps) {
   return (
      <div className="relative">
         {children}
         {isLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
               <LoadingSpinner text={text} />
            </div>
         )}
      </div>
   );
}
