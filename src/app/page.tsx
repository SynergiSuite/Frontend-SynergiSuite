import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  FolderKanban,
  Menu,
  MessageSquareText,
  TrendingUp,
  UserRoundCheck,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import LandingAnimations from "./landing-animations";

export const metadata: Metadata = {
  title: "SynergiSuite | One Workspace to Run Your Business",
  description:
    "Manage employees, teams, projects, clients, analytics, and AI-powered support from one connected business management platform.",
  keywords: [
    "business management software",
    "employee management",
    "project management",
    "client management",
    "team analytics",
    "AI business assistant",
  ],
  openGraph: {
    title: "SynergiSuite | One Workspace to Run Your Business",
    description:
      "A connected workspace for your people, projects, clients, insights, and AI assistance.",
    type: "website",
    siteName: "SynergiSuite",
  },
  twitter: {
    card: "summary_large_image",
    title: "SynergiSuite | One Workspace to Run Your Business",
    description:
      "Replace disconnected business tools with one clear, connected workspace.",
  },
  robots: { index: true, follow: true },
};

const navigation = [
  { label: "Platform", href: "#platform" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

const modules = [
  {
    title: "People",
    description: "Employee records, roles, availability, and performance in one reliable view.",
    icon: UserRoundCheck,
  },
  {
    title: "Teams",
    description: "Build capable teams, balance workloads, and keep everyone aligned.",
    icon: UsersRound,
  },
  {
    title: "Projects",
    description: "Plan milestones, track delivery, and surface risks before they slow you down.",
    icon: FolderKanban,
  },
  {
    title: "Clients",
    description: "Keep client context, feedback, and delivery communication close to the work.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Analytics",
    description: "Turn day-to-day activity into clear signals leaders can act on.",
    icon: BarChart3,
  },
  {
    title: "AI assistant",
    description: "Get personalized answers and find the right business context in seconds.",
    icon: Bot,
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "Bring your work together",
    description: "Set up your people, teams, projects, and clients in one structured workspace.",
  },
  {
    number: "02",
    title: "Run with shared context",
    description: "Give every team a clear view of ownership, progress, priorities, and deadlines.",
  },
  {
    number: "03",
    title: "Improve with real insight",
    description: "Use live analytics and AI-assisted answers to make faster, better decisions.",
  },
];

const benefits = [
  {
    title: "One source of truth",
    description: "Everyone works from the same reliable context.",
    icon: CircleCheck,
  },
  {
    title: "Fewer status meetings",
    description: "Progress stays visible without constant check-ins.",
    icon: MessageSquareText,
  },
  {
    title: "Better decisions",
    description: "Live insights turn activity into confident action.",
    icon: TrendingUp,
  },
];

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "For small teams building a better operating rhythm.",
    features: ["Up to 5 team members", "Projects and client management", "Core team analytics"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Business",
    price: "$12",
    description: "For growing businesses that need one source of truth.",
    features: ["Unlimited team members", "Advanced analytics", "Personalized AI assistant", "Priority support"],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with advanced control and support needs.",
    features: ["Custom roles and permissions", "Dedicated onboarding", "Advanced security controls"],
    cta: "Talk to sales",
    featured: false,
  },
];

function Brand() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="SynergiSuite home">
      <span className="grid size-9 place-items-center rounded-xl bg-v2-neutral-600 text-v2-neutral-100 transition-transform duration-300 group-hover:-rotate-3">
        <Zap className="size-4" aria-hidden="true" />
      </span>
      <span className="text-[15px] font-semibold tracking-[-0.02em] text-v2-neutral-600">
        SynergiSuite
      </span>
    </Link>
  );
}

function Header() {
  return (
    <header data-hero-reveal className="sticky top-0 z-50 border-b border-v2-neutral-200/80 bg-v2-neutral-100/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Brand />

        <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-v2-neutral-400 transition-colors hover:text-v2-neutral-600"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/sessions?form=signin"
            className="rounded-full px-4 py-2 text-sm font-medium text-v2-neutral-500 transition-colors hover:text-v2-neutral-600"
          >
            Sign in
          </Link>
          <Link
            href="/sessions?form=signup"
            className="inline-flex items-center gap-2 rounded-full bg-v2-neutral-600 px-5 py-2.5 text-sm font-medium text-v2-neutral-100 transition hover:bg-v2-neutral-500"
          >
            Get started
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        <details className="group relative md:hidden">
          <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-full border border-v2-neutral-200 text-v2-neutral-600 [&::-webkit-details-marker]:hidden">
            <Menu className="size-4 group-open:hidden" aria-hidden="true" />
            <X className="hidden size-4 group-open:block" aria-hidden="true" />
            <span className="sr-only">Toggle navigation</span>
          </summary>
          <div className="absolute right-0 top-12 w-64 rounded-2xl border border-v2-neutral-200 bg-v2-neutral-100 p-3 shadow-[0_24px_80px_rgba(8,8,8,0.16)]">
            <nav aria-label="Mobile navigation" className="flex flex-col">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-v2-neutral-500 hover:bg-v2-neutral-200/50 hover:text-v2-neutral-600"
                >
                  {item.label}
                </a>
              ))}
              <div className="my-2 h-px bg-v2-neutral-200" />
              <Link href="/sessions?form=signin" className="rounded-xl px-4 py-3 text-sm font-medium text-v2-neutral-500">
                Sign in
              </Link>
              <Link
                href="/sessions?form=signup"
                className="mt-1 rounded-xl bg-v2-neutral-600 px-4 py-3 text-center text-sm font-medium text-v2-neutral-100"
              >
                Get started
              </Link>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}

function ProductPreview() {
  const metrics = [
    ["Active projects", "18", "+3 this month"],
    ["Team utilization", "84%", "+6.2%"],
    ["Open tasks", "42", "11 due soon"],
    ["Client health", "92%", "+4.1%"],
  ];
  const events = [
    ["Product review", "10:30"],
    ["Client check-in", "13:00"],
    ["Sprint planning", "15:30"],
  ];

  return (
    <div data-product-preview className="relative mx-auto mt-16 max-w-6xl lg:mt-20">
      <div className="absolute -inset-5 rounded-[2.5rem] bg-v2-neutral-200/55 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-v2-neutral-300 bg-v2-neutral-600 p-2 shadow-[0_32px_80px_rgba(8,8,8,0.22)] sm:rounded-[1.75rem] sm:p-3">
        <div className="overflow-hidden rounded-xl border border-v2-neutral-500 bg-v2-neutral-100 sm:rounded-2xl">
          <div className="flex h-11 items-center justify-between border-b border-v2-neutral-200 px-4 sm:px-6">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="size-2 rounded-full bg-v2-neutral-300" />
              <span className="size-2 rounded-full bg-v2-neutral-300" />
              <span className="size-2 rounded-full bg-v2-neutral-300" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-v2-neutral-400">
              Workspace overview
            </span>
            <div className="size-5 rounded-full bg-v2-neutral-600" aria-hidden="true" />
          </div>

          <div className="grid min-h-[390px] grid-cols-1 md:grid-cols-[180px_1fr] lg:grid-cols-[210px_1fr]">
            <aside className="hidden border-r border-v2-neutral-200 p-5 md:block">
              <div className="mb-8 flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-v2-neutral-600 text-v2-neutral-100">
                  <Zap className="size-3" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold text-v2-neutral-600">SynergiSuite</span>
              </div>
              <div className="space-y-1.5">
                {["Overview", "Projects", "Team", "Clients", "Analytics"].map((item, index) => (
                  <div
                    key={item}
                    className={`rounded-lg px-3 py-2 text-xs ${index === 0 ? "bg-v2-neutral-600 font-medium text-v2-neutral-100" : "text-v2-neutral-400"}`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </aside>

            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="mb-1 text-xs font-medium text-v2-neutral-400">Monday, 12 May</p>
                  <h2 className="text-xl font-semibold tracking-[-0.03em] text-v2-neutral-600 sm:text-2xl">
                    Good morning, Alex
                  </h2>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-v2-neutral-200 px-3 py-1.5 text-[11px] font-medium text-v2-neutral-500">
                  <span className="size-1.5 rounded-full bg-v2-neutral-400" />
                  All systems on track
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {metrics.map(([label, value, detail]) => (
                  <div key={label} className="rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 p-3 sm:p-4">
                    <p className="truncate text-[10px] font-medium text-v2-neutral-400 sm:text-xs">{label}</p>
                    <p className="mt-3 text-xl font-semibold tracking-[-0.04em] text-v2-neutral-600 sm:text-2xl">{value}</p>
                    <p className="mt-1 text-[9px] text-v2-neutral-400 sm:text-[10px]">{detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid gap-3 lg:grid-cols-[1.45fr_1fr]">
                <div className="rounded-xl border border-v2-neutral-200 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-v2-neutral-600">Business momentum</p>
                      <p className="mt-1 text-[10px] text-v2-neutral-400">Performance across the last six months</p>
                    </div>
                    <TrendingUp className="size-4 text-v2-neutral-400" aria-hidden="true" />
                  </div>
                  <div className="mt-7 flex h-24 items-end gap-2 sm:gap-3">
                    {[38, 50, 43, 65, 73, 91].map((height, index) => (
                      <div key={height} className="flex h-full flex-1 items-end rounded-sm bg-v2-neutral-200/80">
                        <div
                          className={`w-full rounded-sm ${index === 5 ? "bg-v2-neutral-600" : "bg-v2-neutral-400"}`}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-v2-neutral-200 p-4 sm:p-5">
                  <p className="text-xs font-semibold text-v2-neutral-600">Today&apos;s focus</p>
                  <div className="mt-4 space-y-3">
                    {events.map(([event, time]) => (
                      <div key={event} className="flex items-center gap-3">
                        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-v2-neutral-200/70">
                          <Clock3 className="size-3 text-v2-neutral-500" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-v2-neutral-500">{event}</span>
                        <span className="text-[9px] text-v2-neutral-400">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:px-10 lg:pb-32 lg:pt-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[520px] max-w-5xl bg-[radial-gradient(circle_at_center,var(--color-v2-neutral-200),transparent_68%)] opacity-70" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <h1 data-hero-reveal className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.055em] text-v2-neutral-600 sm:text-6xl lg:text-[5rem]">
            Run your entire business with clarity.
          </h1>
          <p data-hero-reveal className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-v2-neutral-400 sm:text-lg sm:leading-8">
            SynergiSuite brings your people, projects, clients, analytics, and AI assistance into one calm workspace—so your team can focus on meaningful work.
          </p>
          <div data-hero-reveal className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sessions?form=signup"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-v2-neutral-600 px-6 py-3.5 text-sm font-medium text-v2-neutral-100 transition hover:bg-v2-neutral-500 sm:w-auto"
            >
              Start for free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <a
              href="#platform"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-v2-neutral-300 px-6 py-3.5 text-sm font-medium text-v2-neutral-500 transition hover:border-v2-neutral-400 hover:text-v2-neutral-600 sm:w-auto"
            >
              Explore the platform
              <ChevronRight className="size-4" aria-hidden="true" />
            </a>
          </div>
          <p data-hero-reveal className="mt-4 text-xs text-v2-neutral-400">No credit card required · Set up in minutes</p>
        </div>

        <ProductPreview />
      </div>
    </section>
  );
}

function Platform() {
  return (
    <section id="platform" className="scroll-mt-20 border-t border-v2-neutral-200 px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-v2-neutral-400">One connected platform</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-600 sm:text-5xl">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="mt-5 text-base leading-7 text-v2-neutral-400 sm:text-lg">
            Replace scattered tools and fragmented updates with a shared system designed around how modern teams actually work.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-v2-neutral-200 bg-v2-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <article data-reveal-card key={module.title} className="group bg-v2-neutral-100 p-6 transition-colors hover:bg-v2-neutral-200/45 sm:p-8">
                <div className="grid size-11 place-items-center rounded-xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-sm transition-transform group-hover:-translate-y-0.5">
                  <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
                </div>
                <h3 className="mt-8 text-lg font-semibold tracking-[-0.025em] text-v2-neutral-600">{module.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-v2-neutral-400">{module.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-v2-neutral-600 px-5 py-24 text-v2-neutral-100 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-v2-neutral-300">How it works</p>
            <h2 className="mt-4 max-w-md text-balance text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
              From scattered work to shared momentum.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-v2-neutral-300">
              SynergiSuite creates a simple operating layer across your business without adding more process for your team to manage.
            </p>
          </div>

          <div className="divide-y divide-v2-neutral-500">
            {workflowSteps.map((step) => (
              <article data-reveal key={step.number} className="grid gap-5 py-8 first:pt-0 sm:grid-cols-[70px_1fr] lg:py-10">
                <span className="font-mono text-xs text-v2-neutral-300">{step.number}</span>
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.025em] sm:text-2xl">{step.title}</h3>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-v2-neutral-300 sm:text-base sm:leading-7">{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-4 border-t border-v2-neutral-500 pt-8 sm:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div data-reveal-card key={benefit.title} className="rounded-2xl border border-v2-neutral-500 bg-v2-neutral-500/20 p-6">
                <Icon className="size-5 text-v2-neutral-200" strokeWidth={1.7} aria-hidden="true" />
                <h3 className="mt-8 text-sm font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-v2-neutral-300">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-v2-neutral-400">Simple pricing</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-600 sm:text-5xl">
            Start small. Scale when you&apos;re ready.
          </h2>
          <p className="mt-5 text-base leading-7 text-v2-neutral-400">
            Straightforward plans for every stage of your business. All prices are billed monthly.
          </p>
        </div>

        <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              data-reveal-card
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-6 sm:p-8 ${plan.featured ? "border-v2-neutral-600 bg-v2-neutral-600 text-v2-neutral-100 shadow-[0_24px_70px_rgba(8,8,8,0.18)]" : "border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600"}`}
            >
              {plan.featured && (
                <span className="absolute right-5 top-5 rounded-full bg-v2-neutral-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-v2-neutral-600">
                  Most popular
                </span>
              )}
              <p className={`text-sm font-semibold ${plan.featured ? "text-v2-neutral-200" : "text-v2-neutral-500"}`}>{plan.name}</p>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{plan.price}</span>
                {plan.price.startsWith("$") && (
                  <span className={`pb-1 text-sm ${plan.featured ? "text-v2-neutral-300" : "text-v2-neutral-400"}`}>/ user</span>
                )}
              </div>
              <p className={`mt-4 min-h-12 text-sm leading-6 ${plan.featured ? "text-v2-neutral-300" : "text-v2-neutral-400"}`}>{plan.description}</p>
              <ul className="mt-8 flex-1 space-y-3" aria-label={`${plan.name} features`}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className={`mt-0.5 size-4 shrink-0 ${plan.featured ? "text-v2-neutral-200" : "text-v2-neutral-500"}`} aria-hidden="true" />
                    <span className={plan.featured ? "text-v2-neutral-200" : "text-v2-neutral-500"}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/sessions?form=signup"
                className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition ${plan.featured ? "bg-v2-neutral-100 text-v2-neutral-600 hover:bg-v2-neutral-200" : "border border-v2-neutral-300 text-v2-neutral-600 hover:border-v2-neutral-500"}`}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-v2-neutral-400">
          Illustrative pricing for the SynergiSuite preview. Final pricing may vary.
        </p>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-5 pb-8 sm:px-8 lg:px-10 lg:pb-10">
      <div data-reveal className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-v2-neutral-200 px-6 py-16 text-center sm:px-12 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-v2-neutral-400">Ready when you are</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.045em] text-v2-neutral-600 sm:text-5xl">
          Give your business one clear place to move forward.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-v2-neutral-400">
          Bring your team, work, and decisions together with SynergiSuite.
        </p>
        <Link
          href="/sessions?form=signup"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-v2-neutral-600 px-6 py-3.5 text-sm font-medium text-v2-neutral-100 transition hover:bg-v2-neutral-500"
        >
          Get started for free
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 border-t border-v2-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Brand />
          <p className="mt-3 text-xs text-v2-neutral-400">One workspace. One shared direction.</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-v2-neutral-400">
          <Link href="/sessions?form=signin" className="transition-colors hover:text-v2-neutral-600">Sign in</Link>
          <a href="#platform" className="transition-colors hover:text-v2-neutral-600">Platform</a>
          <a href="#pricing" className="transition-colors hover:text-v2-neutral-600">Pricing</a>
          <span>© {new Date().getFullYear()} SynergiSuite</span>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <LandingAnimations>
      <Header />
      <div>
        <Hero />
        <Platform />
        <HowItWorks />
        <Pricing />
        <FinalCta />
      </div>
      <Footer />
    </LandingAnimations>
  );
}
