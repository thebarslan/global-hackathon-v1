import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrandsProvider } from "@/contexts/BrandsContext";
import { AnalysisProvider } from "@/contexts/AnalysisContext";
import { ReportsProvider } from "@/contexts/ReportsContext";
import { ToastProvider } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const montserrat = Montserrat({
   subsets: ["latin"],
   variable: "--font-montserrat",
   display: "swap",
   weight: "400",
});

export const metadata: Metadata = {
   title: "ActaBarslan - Brand Analytics",
   description: "Advanced brand sentiment analysis powered by Reddit and AI",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" className="dark">
         <body className={`${montserrat.className} antialiased`}>
            <ErrorBoundary>
               <ToastProvider>
                  <AuthProvider>
                     <BrandsProvider>
                        <AnalysisProvider>
                           <ReportsProvider>{children}</ReportsProvider>
                        </AnalysisProvider>
                     </BrandsProvider>
                  </AuthProvider>
               </ToastProvider>
            </ErrorBoundary>
         </body>
      </html>
   );
}
