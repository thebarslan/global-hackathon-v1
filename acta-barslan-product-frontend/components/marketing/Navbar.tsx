"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
   const [open, setOpen] = useState(false);

   return (
      <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
            <div className="flex h-16 items-center justify-between">
               <div className="flex items-center gap-3">
                  <Link href="/" className="flex items-center gap-2">
                     <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
                        A
                     </span>
                     <span className="text-lg font-semibold tracking-tight">
                        ActaBarslan
                     </span>
                  </Link>
               </div>

               <nav className="hidden md:flex items-center gap-8 text-sm">
                  <Link
                     href="#features"
                     className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                     Features
                  </Link>
                  <Link
                     href="#pricing"
                     className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                     Pricing
                  </Link>
                  <Link
                     href="#faq"
                     className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                     FAQ
                  </Link>
               </nav>

               <div className="hidden md:flex items-center gap-3">
                  <Link
                     href="/login"
                     className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                     Log in
                  </Link>
                  <Link
                     href="/register"
                     className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90"
                  >
                     Get started
                  </Link>
               </div>

               <button
                  aria-label="Toggle menu"
                  className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md "
                  onClick={() => setOpen((v) => !v)}
               >
                  {open ? (
                     <X className="h-5 w-5" />
                  ) : (
                     <Menu className="h-5 w-5" />
                  )}
               </button>
            </div>
         </div>

         {open && (
            <div className="md:hidden border-t border-border">
               <div className="mx-auto max-w-7xl px-4 py-4 space-y-4">
                  <div className="grid gap-2">
                     <Link
                        href="#features"
                        className="block text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setOpen(false)}
                     >
                        Features
                     </Link>
                     <Link
                        href="#pricing"
                        className="block text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setOpen(false)}
                     >
                        Pricing
                     </Link>
                     <Link
                        href="#faq"
                        className="block text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setOpen(false)}
                     >
                        FAQ
                     </Link>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                     <Link
                        href="/login"
                        className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                        onClick={() => setOpen(false)}
                     >
                        Log in
                     </Link>
                     <Link
                        href="/register"
                        className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90"
                        onClick={() => setOpen(false)}
                     >
                        Get started
                     </Link>
                  </div>
               </div>
            </div>
         )}
      </header>
   );
}

export default Navbar;
