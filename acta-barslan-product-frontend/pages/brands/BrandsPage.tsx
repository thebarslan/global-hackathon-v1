import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   Building2,
   Plus,
   Search,
   BarChart3,
   Calendar,
   TrendingUp,
} from "lucide-react";

export function BrandsPage() {
   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Brands</h1>
               <p className="text-muted-foreground">
                  Manage your brand monitoring and analysis
               </p>
            </div>
            <Button className="flex items-center gap-2">
               <Plus className="h-4 w-4" />
               Add Brand
            </Button>
         </div>

         {/* Search and Filters */}
         <Card>
            <CardHeader className="pb-3">
               <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Brands
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex gap-4">
                  <Input placeholder="Search brands..." className="flex-1" />
                  <Button variant="outline">Filter</Button>
               </div>
            </CardContent>
         </Card>

         {/* Brand Stats */}
         <div className="grid gap-4 md:grid-cols-4">
            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                     <Building2 className="h-5 w-5 text-primary" />
                     <div>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-sm text-muted-foreground">
                           Total Brands
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                     <BarChart3 className="h-5 w-5 text-green-600" />
                     <div>
                        <p className="text-2xl font-bold">8</p>
                        <p className="text-sm text-muted-foreground">
                           Active Analyses
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                     <TrendingUp className="h-5 w-5 text-blue-600" />
                     <div>
                        <p className="text-2xl font-bold">85%</p>
                        <p className="text-sm text-muted-foreground">
                           Positive Sentiment
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                     <Calendar className="h-5 w-5 text-orange-600" />
                     <div>
                        <p className="text-2xl font-bold">24</p>
                        <p className="text-sm text-muted-foreground">
                           Analyses Today
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Brand List */}
         <Card>
            <CardHeader>
               <CardTitle>Brand List</CardTitle>
               <CardDescription>
                  All your monitored brands and their current status
               </CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Brand Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Analysis</TableHead>
                        <TableHead>Sentiment</TableHead>
                        <TableHead>Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     <TableRow>
                        <TableCell className="font-medium">Yahoo</TableCell>
                        <TableCell>
                           <Badge variant="secondary">Active</Badge>
                        </TableCell>
                        <TableCell>2 minutes ago</TableCell>
                        <TableCell>
                           <Badge variant="default" className="bg-green-600">
                              Positive
                           </Badge>
                        </TableCell>
                        <TableCell>
                           <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                 <BarChart3 className="h-4 w-4 mr-1" />
                                 Analyze
                              </Button>
                              <Button size="sm" variant="outline">
                                 Edit
                              </Button>
                           </div>
                        </TableCell>
                     </TableRow>

                     <TableRow>
                        <TableCell className="font-medium">Microsoft</TableCell>
                        <TableCell>
                           <Badge variant="outline">Monitoring</Badge>
                        </TableCell>
                        <TableCell>1 hour ago</TableCell>
                        <TableCell>
                           <Badge variant="default" className="bg-blue-600">
                              Neutral
                           </Badge>
                        </TableCell>
                        <TableCell>
                           <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                 <BarChart3 className="h-4 w-4 mr-1" />
                                 Analyze
                              </Button>
                              <Button size="sm" variant="outline">
                                 Edit
                              </Button>
                           </div>
                        </TableCell>
                     </TableRow>

                     <TableRow>
                        <TableCell className="font-medium">Apple</TableCell>
                        <TableCell>
                           <Badge variant="secondary">Active</Badge>
                        </TableCell>
                        <TableCell>3 hours ago</TableCell>
                        <TableCell>
                           <Badge variant="default" className="bg-green-600">
                              Positive
                           </Badge>
                        </TableCell>
                        <TableCell>
                           <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                 <BarChart3 className="h-4 w-4 mr-1" />
                                 Analyze
                              </Button>
                              <Button size="sm" variant="outline">
                                 Edit
                              </Button>
                           </div>
                        </TableCell>
                     </TableRow>

                     <TableRow>
                        <TableCell className="font-medium">Google</TableCell>
                        <TableCell>
                           <Badge variant="outline">Monitoring</Badge>
                        </TableCell>
                        <TableCell>6 hours ago</TableCell>
                        <TableCell>
                           <Badge variant="default" className="bg-orange-600">
                              Mixed
                           </Badge>
                        </TableCell>
                        <TableCell>
                           <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                 <BarChart3 className="h-4 w-4 mr-1" />
                                 Analyze
                              </Button>
                              <Button size="sm" variant="outline">
                                 Edit
                              </Button>
                           </div>
                        </TableCell>
                     </TableRow>
                  </TableBody>
               </Table>
            </CardContent>
         </Card>

         {/* Recent Brand Activity */}
         <Card>
            <CardHeader>
               <CardTitle>Recent Brand Activity</CardTitle>
               <CardDescription>
                  Latest updates and analyses for your brands
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                     <div className="h-2 w-2 rounded-full bg-green-500"></div>
                     <div>
                        <p className="font-medium">Yahoo analysis completed</p>
                        <p className="text-sm text-muted-foreground">
                           Sentiment: Positive (85%)
                        </p>
                     </div>
                  </div>
                  <Badge variant="secondary">2 min ago</Badge>
               </div>

               <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                     <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                     <div>
                        <p className="font-medium">
                           Microsoft monitoring started
                        </p>
                        <p className="text-sm text-muted-foreground">
                           New brand added to tracking
                        </p>
                     </div>
                  </div>
                  <Badge variant="outline">1 hour ago</Badge>
               </div>

               <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                     <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                     <div>
                        <p className="font-medium">Apple report generated</p>
                        <p className="text-sm text-muted-foreground">
                           PDF report ready for download
                        </p>
                     </div>
                  </div>
                  <Badge variant="secondary">3 hours ago</Badge>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
