export function ReportsPage() {
   return (
      <div className="space-y-6">
         <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">
               Generate and download detailed analysis reports
            </p>
         </div>

         {/* Reports content will be added here */}
         <div className="grid gap-6">
            <div className="rounded-lg border p-6">
               <h2 className="text-xl font-semibold mb-4">Report Generator</h2>
               <p className="text-muted-foreground">
                  Report generation tools will be available here.
               </p>
            </div>
         </div>
      </div>
   );
}
