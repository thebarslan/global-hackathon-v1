"use client";

import {
   createContext,
   useContext,
   useState,
   useEffect,
   ReactNode,
} from "react";
import { apiService } from "@/services/api";
import { useToast } from "@/components/ui/toast";
import { LoginResponse, RegisterResponse, ProfileResponse } from "@/types/api";

interface User {
   id: string;
   name: string;
   email: string;
   role: string;
   subscription?: {
      isSubscribed: boolean;
      plan: string;
      startDate: string;
      endDate: string;
      autoRenew: boolean;
      status: string;
      features: {
         maxBrands: number;
         maxAnalyses: number;
         maxReports: number;
         redditApiCalls: number;
         geminiApiCalls: number;
      };
   };
}

interface AuthContextType {
   user: User | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   login: (email: string, password: string) => Promise<void>;
   register: (name: string, email: string, password: string) => Promise<void>;
   logout: () => void;
   updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const { success, error } = useToast();

   useEffect(() => {
      // Check for existing session on mount
      const checkAuth = async () => {
         try {
            // Check if we're in browser environment
            if (typeof window !== "undefined") {
               const token = localStorage.getItem("authToken");
               if (token) {
                  apiService.setToken(token);

                  // Verify token with backend by calling profile endpoint
                  try {
                     const response = await apiService.getProfile();
                     if (response.success && response.data) {
                        const profileData = response.data as ProfileResponse;
                        const userData = profileData.user;
                        setUser({
                           id: userData._id,
                           name: `${userData.firstName} ${userData.lastName}`,
                           email: userData.email,
                           role: userData.role || "user",
                           subscription: userData.subscription,
                        });
                     } else {
                        throw new Error("Invalid token");
                     }
                  } catch (tokenError) {
                     console.error("Token verification failed:", tokenError);
                     localStorage.removeItem("authToken");
                     apiService.setToken(null);
                  }
               }
            }
         } catch (error) {
            console.error("Auth check failed:", error);
            if (typeof window !== "undefined") {
               localStorage.removeItem("authToken");
            }
            apiService.setToken(null);
         } finally {
            setIsLoading(false);
         }
      };

      checkAuth();
   }, []);

   const login = async (email: string, password: string) => {
      setIsLoading(true);
      try {
         const response = await apiService.login(email, password);

         if (response.success && response.data) {
            const loginData = response.data as LoginResponse;
            const userData: User = {
               id: loginData.user.id,
               name: `${loginData.user.firstName} ${loginData.user.lastName}`,
               email: loginData.user.email,
               role: loginData.user.role || "user",
               subscription: loginData.user.subscription,
            };

            setUser(userData);
            success("Login successful", "Welcome back!");

            // Redirect to dashboard after successful login
            if (typeof window !== "undefined") {
               setTimeout(() => {
                  window.location.href = "/dashboard";
               }, 1000); // 1 second delay to show success message
            }
         } else {
            throw new Error(response.message || "Login failed");
         }
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Login failed";
         error("Login failed", errorMessage);
         throw err;
      } finally {
         setIsLoading(false);
      }
   };

   const register = async (name: string, email: string, password: string) => {
      setIsLoading(true);
      try {
         // Split name into firstName and lastName
         const nameParts = name.trim().split(" ");
         const firstName = nameParts[0] || "";
         const lastName = nameParts.slice(1).join(" ") || "";

         const response = await apiService.register(
            firstName,
            lastName,
            email,
            password
         );

         if (response.success && response.data) {
            const registerData = response.data as RegisterResponse;
            const userData: User = {
               id: registerData.user.id,
               name: `${registerData.user.firstName} ${registerData.user.lastName}`,
               email: registerData.user.email,
               role: registerData.user.role || "user",
               subscription: registerData.user.subscription,
            };

            setUser(userData);
            success("Registration successful", "Welcome to ActaBarslan!");

            // Redirect to dashboard after successful registration
            if (typeof window !== "undefined") {
               setTimeout(() => {
                  window.location.href = "/dashboard";
               }, 1000); // 1 second delay to show success message
            }
         } else {
            throw new Error(response.message || "Registration failed");
         }
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : "Registration failed";
         error("Registration failed", errorMessage);
         throw err;
      } finally {
         setIsLoading(false);
      }
   };

   const logout = async () => {
      try {
         await apiService.logout();
      } catch (err) {
         console.error("Logout error:", err);
      } finally {
         setUser(null);
         if (typeof window !== "undefined") {
            localStorage.removeItem("authToken");
         }
         apiService.setToken(null);
      }
   };

   const updateProfile = async (data: Partial<User>) => {
      if (!user) return;

      try {
         // TODO: Implement actual API call
         console.log("Update profile:", data);

         setUser({ ...user, ...data });
      } catch (error) {
         console.error("Profile update failed:", error);
         throw error;
      }
   };

   const value: AuthContextType = {
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
}
