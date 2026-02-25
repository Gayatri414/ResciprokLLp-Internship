import { Link } from "react-router-dom";

const FEATURES = [
  {
    title: "Smart job search",
    desc: "Filter by title, location, and skills. Find the right role in seconds.",
    icon: "🔍",
  },
  {
    title: "AI recommendations",
    desc: "Get matched to roles that fit your profile and preferences.",
    icon: "✨",
  },
  {
    title: "Easy apply",
    desc: "One-click apply with your saved resume. Track all applications in one place.",
    icon: "📄",
  },
  {
    title: "Company dashboard",
    desc: "Post jobs, review applicants, and accept or reject with a single click.",
    icon: "🏢",
  },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "For job seekers getting started.",
    features: ["Browse unlimited jobs", "Apply to 10 jobs/month", "Basic profile", "Email support"],
    cta: "Get Started",
    to: "/register",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    desc: "For serious candidates.",
    features: ["Unlimited applications", "Resume builder", "Application tracking", "Priority support"],
    cta: "Start free trial",
    to: "/register",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For companies at scale.",
    features: ["Unlimited job posts", "Applicant CRM", "API access", "Dedicated success manager"],
    cta: "Contact sales",
    to: "/register",
    highlight: false,
  },
];

const LOGOS = ["Stripe", "Notion", "Vercel", "Linear", "Figma"];

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-dark-gradient">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-500/15 rounded-full blur-[128px] pointer-events-none" />

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-in">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.1]">
              Find your dream job{" "}
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">faster</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-xl leading-relaxed">
              One platform for job seekers and employers. Search roles, apply in one click, or post jobs and hire the best talent.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-3.5">
                Get Started
              </Link>
              <Link to="/jobs" className="btn-secondary text-lg px-8 py-3.5">
                Browse Jobs
              </Link>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="relative animate-slide-up lg:pl-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 to-accent-500/30 rounded-2xl blur-xl opacity-60" />
              <div className="relative card-glass p-6 sm:p-8 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-4 text-slate-500 text-sm">JobSphere Dashboard</span>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-10 h-10 rounded-lg bg-white/10" />
                      <div className="flex-1">
                        <div className="h-3 w-3/4 rounded bg-white/20" />
                        <div className="h-2 w-1/2 rounded bg-white/10 mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Floating stat cards */}
              <div className="absolute -right-2 top-1/4 card-glass px-4 py-3 rounded-xl border border-white/10 animate-float shadow-glow-sm">
                <p className="text-xs text-slate-400">Applications</p>
                <p className="text-xl font-display font-bold text-white">127</p>
              </div>
              <div className="absolute -left-2 bottom-1/4 card-glass px-4 py-3 rounded-xl border border-white/10 animate-float shadow-glow-sm" style={{ animationDelay: "1s" }}>
                <p className="text-xs text-slate-400">New jobs today</p>
                <p className="text-xl font-display font-bold text-white">42</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company logos strip */}
      <section className="relative border-y border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-500 text-sm mb-6">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60">
            {LOGOS.map((name) => (
              <span key={name} className="font-display font-semibold text-slate-400 text-lg">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Everything you need to hire or get hired</h2>
          <p className="mt-4 text-slate-400 text-lg">One platform for job search and recruitment.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="card-glass p-6 rounded-xl hover:border-primary-500/30 transition-colors">
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="font-display font-semibold text-lg text-white">{f.title}</h3>
              <p className="mt-2 text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Built for modern teams</h2>
            <p className="mt-4 text-slate-400 text-lg leading-relaxed">
              Manage jobs and applicants from one dashboard. Post roles, review candidates, and accept or reject with a single click.
            </p>
            <ul className="mt-8 space-y-4">
              {["Unlimited job posts", "Applicant tracking", "One-click apply", "Resume storage"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-primary-500/30 flex items-center justify-center text-primary-300 text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-2xl blur-2xl" />
            <div className="relative card-glass p-8 rounded-2xl border border-white/10">
              <div className="h-48 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 text-sm">Dashboard preview</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trial CTA */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10 p-12 lg:p-16 text-center">
          <div className="absolute inset-0 bg-card-glow pointer-events-none" />
          <h2 className="relative font-display text-3xl sm:text-4xl font-bold text-white">Start your free trial today</h2>
          <p className="relative mt-4 text-slate-400 text-lg max-w-xl mx-auto">No credit card required. Get started in under a minute.</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-3.5">Get Started</Link>
            <Link to="/jobs" className="btn-secondary text-lg px-8 py-3.5">Browse Jobs</Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Simple, transparent pricing</h2>
          <p className="mt-4 text-slate-400 text-lg">Choose the plan that fits you.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 flex flex-col ${plan.highlight ? "border-primary-500/50 bg-primary-500/5 shadow-glow" : "card-glass border-white/10"}`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium">Popular</div>
              )}
              <h3 className="font-display font-semibold text-xl text-white">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-display font-bold text-white">{plan.price}</span>
                <span className="text-slate-400">{plan.period}</span>
              </div>
              <p className="mt-2 text-slate-400 text-sm">{plan.desc}</p>
              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-slate-300 text-sm">
                    <span className="text-primary-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to={plan.to} className={`mt-8 w-full py-3 rounded-xl font-medium text-center transition ${plan.highlight ? "btn-primary" : "btn-secondary"}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-display font-bold text-lg text-white">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm">J</span>
              JobSphere
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-slate-400 text-sm">
              <Link to="/jobs" className="hover:text-white transition">Jobs</Link>
              <button type="button" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition">Features</button>
              <button type="button" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition">Pricing</button>
              <Link to="/login" className="hover:text-white transition">Login</Link>
              <Link to="/register" className="hover:text-white transition">Get Started</Link>
            </div>
          </div>
          <p className="mt-8 text-center text-slate-500 text-sm">© {new Date().getFullYear()} JobSphere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
