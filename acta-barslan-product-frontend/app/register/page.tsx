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
import { BarChart3, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
   const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
   });
   const { register, isLoading } = useAuth();
   const { success, error } = useToast();

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (formData.password !== formData.confirmPassword) {
         error("Password mismatch", "Passwords do not match");
         return;
      }

      if (formData.password.length < 6) {
         error("Invalid password", "Password must be at least 6 characters");
         return;
      }

      // Check password complexity
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(formData.password)) {
         error(
            "Invalid password",
            "Password must contain at least one lowercase letter, one uppercase letter, and one number"
         );
         return;
      }

      try {
         await register(
            `${formData.firstName} ${formData.lastName}`,
            formData.email,
            formData.password
         );
         // Success message and redirect handled in AuthContext
      } catch (err) {
         console.error("Registration failed:", err);
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
               <CardTitle className="text-2xl">Create your account</CardTitle>
               <CardDescription>
                  Join ActaBarslan to start analyzing your brand
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                           id="firstName"
                           name="firstName"
                           type="text"
                           placeholder="John"
                           value={formData.firstName}
                           onChange={handleChange}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                           id="lastName"
                           name="lastName"
                           type="text"
                           placeholder="Doe"
                           value={formData.lastName}
                           onChange={handleChange}
                           required
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="password">Password</Label>
                     <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                     />
                     <p className="text-xs text-muted-foreground">
                        Must contain at least 6 characters with uppercase,
                        lowercase, and number
                     </p>
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="confirmPassword">Confirm Password</Label>
                     <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                     />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                     {isLoading ? (
                        <LoadingSpinner size="sm" />
                     ) : (
                        "Create Account"
                     )}
                  </Button>
               </form>

               <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                     Already have an account?{" "}
                     <Link
                        href="/login"
                        className="text-primary hover:underline font-medium"
                     >
                        Sign in
                     </Link>
                  </p>
               </div>

               <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Demo Account:</p>
                  <p>Email: demo@example.com</p>
                  <p>Password: Demo123!</p>
                  <Link
                     href="/login"
                     className="inline-flex items-center gap-1 text-primary hover:underline mt-2"
                  >
                     <ArrowLeft className="h-3 w-3" />
                     Use demo account
                  </Link>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
