"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
   children: ReactNode;
   fallback?: ReactNode;
}

interface State {
   hasError: boolean;
   error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
   constructor(props: Props) {
      super(props);
      this.state = { hasError: false };
   }

   static getDerivedStateFromError(error: Error): State {
      return { hasError: true, error };
   }

   componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
   }

   handleReset = () => {
      this.setState({ hasError: false, error: undefined });
   };

   render() {
      if (this.state.hasError) {
         if (this.props.fallback) {
            return this.props.fallback;
         }

         return (
            <div className="min-h-screen flex items-center justify-center p-4">
               <Card className="w-full max-w-md">
                  <CardHeader className="text-center">
                     <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                     </div>
                     <CardTitle className="text-xl">
                        Something went wrong
                     </CardTitle>
                     <CardDescription>
                        An unexpected error occurred. Please try refreshing the
                        page.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {this.state.error && (
                        <div className="rounded-md bg-muted p-3">
                           <p className="text-sm font-medium text-muted-foreground">
                              Error details:
                           </p>
                           <p className="text-sm text-muted-foreground mt-1">
                              {this.state.error.message}
                           </p>
                        </div>
                     )}
                     <div className="flex gap-2">
                        <Button onClick={this.handleReset} className="flex-1">
                           <RefreshCw className="mr-2 h-4 w-4" />
                           Try Again
                        </Button>
                        <Button
                           variant="outline"
                           onClick={() => window.location.reload()}
                           className="flex-1"
                        >
                           Refresh Page
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </div>
         );
      }

      return this.props.children;
   }
}

interface ErrorFallbackProps {
   error: Error;
   resetError: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
   return (
      <div className="min-h-screen flex items-center justify-center p-4">
         <Card className="w-full max-w-md">
            <CardHeader className="text-center">
               <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
               </div>
               <CardTitle className="text-xl">Something went wrong</CardTitle>
               <CardDescription>
                  An unexpected error occurred. Please try again.
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="rounded-md bg-muted p-3">
                  <p className="text-sm font-medium text-muted-foreground">
                     Error details:
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                     {error.message}
                  </p>
               </div>
               <Button onClick={resetError} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
               </Button>
            </CardContent>
         </Card>
      </div>
   );
}
