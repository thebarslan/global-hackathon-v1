import {
   BarChart3,
   Building2,
   Home,
   LogOut,
   TrendingUp,
   Users,
} from "lucide-react";

import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/components/ui/sidebar";

// Main navigation items
const mainItems = [
   {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
   },
   {
      title: "Brands",
      url: "/dashboard/brands",
      icon: Building2,
   },
   {
      title: "Analysis",
      url: "/dashboard/analysis",
      icon: BarChart3,
   },
   {
      title: "Reports",
      url: "/dashboard/reports",
      icon: TrendingUp,
   },
];

// Settings section
const settingsItems = [
   {
      title: "Account",
      url: "/dashboard/settings",
      icon: Users,
   },
];

export function AppSidebar() {
   return (
      <Sidebar collapsible="icon">
         <SidebarHeader>
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0 px-2 py-2 group-data-[collapsible=icon]:justify-center">
               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BarChart3 className="h-4 w-4" />
               </div>
               <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-semibold">ActaBarslan</span>
                  <span className="text-xs text-muted-foreground">
                     Brand Analytics
                  </span>
               </div>
            </div>
         </SidebarHeader>

         <SidebarContent>
            {/* Main Navigation */}
            <SidebarGroup>
               <SidebarGroupLabel>Main</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {mainItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                           <SidebarMenuButton asChild>
                              <a href={item.url}>
                                 <item.icon />
                                 <span>{item.title}</span>
                              </a>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>

            {/* Settings */}
            <SidebarGroup>
               <SidebarGroupLabel>Settings</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {settingsItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                           <SidebarMenuButton asChild>
                              <a href={item.url}>
                                 <item.icon />
                                 <span>{item.title}</span>
                              </a>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))}

                     {/* Logout Button */}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
         <SidebarFooter>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                     <a
                        href="/logout"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                     >
                        <LogOut />
                        <span>Logout</span>
                     </a>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarFooter>
      </Sidebar>
   );
}
