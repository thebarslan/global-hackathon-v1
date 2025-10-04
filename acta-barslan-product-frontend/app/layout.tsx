import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";

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
            {children}
         </body>
      </html>
   );
}
