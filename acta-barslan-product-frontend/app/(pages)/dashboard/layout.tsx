import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/layout/app-sidebar";

export default function DashboardLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <SidebarProvider>
         <AppSidebar />
         <main className="flex-1 overflow-auto">
            <div className="flex h-full">
               <div className="flex-1 p-6">
                  <div className="mb-4">
                     <SidebarTrigger />
                  </div>
                  {children}
               </div>
            </div>
         </main>
      </SidebarProvider>
   );
}
