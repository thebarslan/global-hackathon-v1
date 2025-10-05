import Link from "next/link";

export function Footer() {
   return (
      <footer className="border-t border-border/60">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
               <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                     <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
                        A
                     </span>
                     <span className="text-lg font-semibold tracking-tight">
                        ActaBarslan
                     </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground max-w-sm">
                     AI-powered brand sentiment analysis using Reddit data and
                     Gemini.
                  </p>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                  <div>
                     <p className="mb-2 font-medium">Product</p>
                     <ul className="space-y-2 text-muted-foreground">
                        <li>
                           <Link
                              href="#features"
                              className="hover:text-foreground"
                           >
                              Features
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="#pricing"
                              className="hover:text-foreground"
                           >
                              Pricing
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/login"
                              className="hover:text-foreground"
                           >
                              Login
                           </Link>
                        </li>
                     </ul>
                  </div>
                  <div>
                     <p className="mb-2 font-medium">Company</p>
                     <ul className="space-y-2 text-muted-foreground">
                        <li>
                           <Link href="#faq" className="hover:text-foreground">
                              FAQ
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/register"
                              className="hover:text-foreground"
                           >
                              Get started
                           </Link>
                        </li>
                     </ul>
                  </div>
                  <div>
                     <p className="mb-2 font-medium">Legal</p>
                     <ul className="space-y-2 text-muted-foreground">
                        <li>
                           <Link
                              href="/terms"
                              className="hover:text-foreground"
                           >
                              Terms
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/privacy"
                              className="hover:text-foreground"
                           >
                              Privacy
                           </Link>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
               <p>
                  © {new Date().getFullYear()} ActaBarslan. All rights reserved.
               </p>
               <div className="flex items-center gap-4">
                  <Link
                     href="https://x.com"
                     className="hover:text-foreground"
                     target="_blank"
                  >
                     Twitter
                  </Link>
                  <Link
                     href="https://github.com"
                     className="hover:text-foreground"
                     target="_blank"
                  >
                     GitHub
                  </Link>
                  <Link
                     href="mailto:hello@example.com"
                     className="hover:text-foreground"
                  >
                     Contact
                  </Link>
               </div>
            </div>
         </div>
      </footer>
   );
}

export default Footer;
