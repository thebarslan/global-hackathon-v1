"use client";

import { useState } from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import { LoadingSpinner } from "@/components/ui/loading";
import { BarChart3 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const { login, isLoading } = useAuth();
   const { error } = useToast();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         await login(email, password);
         // Success message and redirect handled in AuthContext
      } catch (err) {
         console.error("Login failed:", err);
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
         <Card className="w-full max-w-md">
            <CardHeader className="text-center">
               <div className="flex items-center justify-center mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                     <BarChart3 className="h-6 w-6" />
                  </div>
               </div>
               <CardTitle className="text-2xl">
                  Welcome to ActaBarslan
               </CardTitle>
               <CardDescription>
                  Sign in to your account to continue
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="password">Password</Label>
                     <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                     />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                     {isLoading ? <LoadingSpinner size="sm" /> : "Sign In"}
                  </Button>
               </form>
               <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                     Don't have an account?{" "}
                     <Link
                        href="/register"
                        className="text-primary hover:underline font-medium"
                     >
                        Create one
                     </Link>
                  </p>
               </div>

               <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Demo credentials:</p>
                  <p>Email: demo@example.com</p>
                  <p>Password: Demo123!</p>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
