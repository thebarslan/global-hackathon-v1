import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import Link from "next/link";
import { BarChart3, LineChart, PieChart } from "lucide-react";

export default function Home() {
   return (
      <>
         <Navbar />

         <main>
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-border/60">
               <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 py-20">
                  <div className="grid lg:grid-cols-2 gap-10 items-center">
                     <div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                           Understand your brand reputation with AI-powered
                           sentiment analysis
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                           Monitor Reddit conversations in real-time, analyze
                           sentiment with Gemini, and turn insights into
                           actionable strategies.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                           <Link
                              href="/register"
                              className="px-5 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90"
                           >
                              Get started
                           </Link>
                           <Link
                              href="#features"
                              className="px-5 py-3 rounded-md border border-border text-sm hover:bg-accent"
                           >
                              See features
                           </Link>
                        </div>
                        <div className="mt-6 text-xs text-muted-foreground">
                           No credit card required. Free trial included.
                        </div>
                     </div>
                     <div className="relative">
                        <div className="aspect-[4/3] rounded-xl border border-border bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
                        {/* Chart icon composition */}
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="relative">
                              <div className="absolute -inset-8 rounded-full bg-primary/10 blur-2xl" />
                              <BarChart3 className="relative h-28 w-28 text-primary" />
                           </div>
                        </div>
                        {/* Decorative small icons */}
                        <LineChart className="absolute top-6 left-6 h-8 w-8 text-primary/70" />
                        <PieChart className="absolute bottom-6 right-6 h-8 w-8 text-primary/70" />
                        <div className="absolute -inset-8 -z-10 bg-primary/10 blur-3xl rounded-full" />
                     </div>
                  </div>
               </div>
            </section>

            {/* Features */}
            <section id="features" className="border-b border-border/60">
               <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                  <div className="text-center max-w-2xl mx-auto">
                     <h2 className="text-3xl font-semibold tracking-tight">
                        Everything you need to track brand sentiment
                     </h2>
                     <p className="mt-3 text-muted-foreground">
                        Purpose-built for marketing teams and founders.
                     </p>
                  </div>

                  <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     <FeatureCard
                        title="Reddit monitoring"
                        desc="Fetch and analyze posts mentioning your brand or keywords across subreddits."
                     />
                     <FeatureCard
                        title="AI sentiment analysis"
                        desc="Batch process with Gemini, filter irrelevancies, and surface what matters."
                     />
                     <FeatureCard
                        title="Real-time status"
                        desc="Track analysis status and see when results are ready without refresh."
                     />
                     <FeatureCard
                        title="Actionable insights"
                        desc="Summaries, trends, and charts to share across the team."
                     />
                     <FeatureCard
                        title="PDF reports"
                        desc="Export executive summaries and detailed reports as professional PDFs."
                     />
                     <FeatureCard
                        title="Secure & private"
                        desc="Authentication, roles, and secure data handling by default."
                     />
                  </div>
               </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="border-b border-border/60">
               <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                  <div className="text-center max-w-2xl mx-auto">
                     <h2 className="text-3xl font-semibold tracking-tight">
                        Simple pricing
                     </h2>
                     <p className="mt-3 text-muted-foreground">
                        Start free. Upgrade as you grow.
                     </p>
                  </div>

                  <div className="mt-10 grid md:grid-cols-2 gap-6">
                     <PricingCard
                        name="Pro"
                        price="$29"
                        period="/mo"
                        features={[
                           "5 brands",
                           "Up to 500 analyses",
                           "Advanced reports",
                           "Priority processing",
                        ]}
                        cta={{ label: "Start Pro", href: "/register" }}
                        highlight={true}
                     />
                     <PricingCard
                        name="Business"
                        price="$99"
                        period="/mo"
                        features={[
                           "Unlimited brands",
                           "Unlimited analyses",
                           "Custom reports",
                           "SLAs & support",
                        ]}
                        cta={{ label: "Contact sales", href: "/register" }}
                        highlight={false}
                     />
                  </div>
               </div>
            </section>

            {/* FAQ */}
            <section id="faq">
               <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                  <div className="text-center max-w-2xl mx-auto">
                     <h2 className="text-3xl font-semibold tracking-tight">
                        Frequently asked questions
                     </h2>
                  </div>
                  <div className="mt-8 grid md:grid-cols-2 gap-6 text-sm">
                     <FAQ
                        q="How do you analyze sentiment?"
                        a="We use Google's Gemini to classify posts (positive, negative, neutral, not applicable) with confidence thresholds and relevance filters."
                     />
                     <FAQ
                        q="Which sources are supported?"
                        a="We start with Reddit. Roadmap includes Twitter/X, YouTube, and TikTok."
                     />
                     <FAQ
                        q="Can I export reports?"
                        a="Yes, you can generate and download branded PDF reports in one click."
                     />
                     <FAQ
                        q="Is my data secure?"
                        a="All requests are authenticated. We store only what's needed and never share your data."
                     />
                  </div>
               </div>
            </section>
         </main>

         <Footer />
      </>
   );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
   return (
      <div className="rounded-lg border border-border p-5">
         <p className="font-medium">{title}</p>
         <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      </div>
   );
}

function PricingCard({
   name,
   price,
   period,
   features,
   cta,
   highlight,
}: {
   name: string;
   price: string;
   period: string;
   features: string[];
   cta: { label: string; href: string };
   highlight?: boolean;
}) {
   return (
      <div
         className={`rounded-lg border p-6 ${
            highlight ? "border-primary/60 bg-primary/5" : "border-border"
         }`}
      >
         <p className="text-sm text-muted-foreground">{name}</p>
         <div className="mt-2 flex items-end gap-1">
            <span className="text-3xl font-bold">{price}</span>
            <span className="text-muted-foreground">{period}</span>
         </div>
         <ul className="mt-4 space-y-2 text-sm">
            {features.map((f) => (
               <li key={f} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary inline-block" />
                  <span>{f}</span>
               </li>
            ))}
         </ul>
         <Link
            href={cta.href}
            className={`mt-6 inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${
               highlight
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-accent"
            }`}
         >
            {cta.label}
         </Link>
      </div>
   );
}

function FAQ({ q, a }: { q: string; a: string }) {
   return (
      <div className="rounded-lg border border-border p-5">
         <p className="font-medium">{q}</p>
         <p className="mt-2 text-sm text-muted-foreground">{a}</p>
      </div>
   );
}
