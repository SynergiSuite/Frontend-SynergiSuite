"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Building2,
  LogOut,
  Settings,
  ShieldCheck,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { gsap } from "gsap";
import { toast } from "sonner";

import NotificationBell from "@/components/notifications/NotificationBell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CookieManager } from "@/lib/cookieManager";
import { cn } from "@/lib/utils";
import { socket } from "@/lib/socket";

type NavItem = {
  name: string;
  param: string;
  route: string;
};

type UserDetails = {
  name: string;
  email: string;
  business: string;
  role: string;
};

const EMPTY_USER: UserDetails = {
  name: "",
  email: "",
  business: "",
  role: "",
};

const PEOPLE_NAVIGATION: NavItem[] = [
  { name: "Employees", param: "employees", route: "/employees" },
  { name: "Teams", param: "teams", route: "/teams" },
  { name: "Projects", param: "projects", route: "/projects" },
];

function formatRole(role: string) {
  if (!role) {
    return "Workspace member";
  }

  return role
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getInitials(name: string, email: string) {
  const source = name.trim() || email.split("@")[0] || "User";
  const parts = source.split(/\s+/).filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ projectName?: string | string[] }>();
  const navbarRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<UserDetails>(EMPTY_USER);

  const rawProjectName = Array.isArray(params.projectName)
    ? params.projectName[0]
    : params.projectName ?? "";
  const projectName = decodeURIComponent(rawProjectName);
  const isClient = user.role.toLowerCase() === "client";
  const initials = getInitials(user.name, user.email);

  useEffect(() => {
    setUser({
      name: String(CookieManager("get", "user") || ""),
      email: String(CookieManager("get", "user-email") || ""),
      business: String(CookieManager("get", "business-name") || ""),
      role: String(
        CookieManager("get", "primary_role") ||
          CookieManager("get", "role") ||
          "",
      ),
    });
  }, []);

  useLayoutEffect(() => {
    const navbar = navbarRef.current;

    if (
      !navbar ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.from("[data-navbar-item]", {
        autoAlpha: 0,
        y: -6,
        duration: 0.4,
        stagger: 0.055,
        ease: "power3.out",
      });
    }, navbar);

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    if (!isProfileOpen || !drawerRef.current || !backdropRef.current) {
      return;
    }

    closeButtonRef.current?.focus();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const drawer = drawerRef.current;
    const backdrop = backdropRef.current;
    const isDesktop = window.matchMedia("(min-width: 640px)").matches;
    const context = gsap.context(() => {
      gsap.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22 });
      gsap.fromTo(
        drawer,
        isDesktop ? { xPercent: 100 } : { yPercent: 100 },
        {
          xPercent: 0,
          yPercent: 0,
          duration: 0.48,
          ease: "power3.out",
        },
      );
      gsap.from("[data-profile-item]", {
        autoAlpha: 0,
        y: 10,
        duration: 0.35,
        stagger: 0.055,
        delay: 0.16,
        ease: "power2.out",
      });
    }, drawer);

    return () => context.revert();
  }, [isProfileOpen]);

  const closeProfile = useCallback(() => {
    const drawer = drawerRef.current;
    const backdrop = backdropRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!drawer || !backdrop || reduceMotion) {
      setIsProfileOpen(false);
      return;
    }

    const isDesktop = window.matchMedia("(min-width: 640px)").matches;
    gsap.to(backdrop, { autoAlpha: 0, duration: 0.18 });
    gsap.to(drawer, {
      xPercent: isDesktop ? 100 : 0,
      yPercent: isDesktop ? 0 : 100,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => setIsProfileOpen(false),
    });
  }, []);

  useEffect(() => {
    if (!isProfileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeProfile();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeProfile, isProfileOpen]);

  const links = useMemo<NavItem[]>(() => {
    if (pathname.startsWith("/projects/")) {
      if (!rawProjectName) {
        return [];
      }

      if (isClient) {
        return [
          {
            name: "Tasks",
            param: "task",
            route: `/projects/${rawProjectName}/task`,
          },
        ];
      }

      return [
        {
          name: projectName ? `${projectName} overview` : "Overview",
          param: "overview",
          route: `/projects/${rawProjectName}/overview`,
        },
        {
          name: "Tasks",
          param: "task",
          route: `/projects/${rawProjectName}/task`,
        },
      ];
    }

    if (isClient) {
      return [];
    }

    if (
      pathname === "/employees" ||
      pathname === "/teams" ||
      pathname === "/projects"
    ) {
      return PEOPLE_NAVIGATION;
    }

    return [];
  }, [isClient, pathname, projectName, rawProjectName]);

  const activeTab = [...links]
    .sort((first, second) => second.route.length - first.route.length)
    .find((link) => pathname.startsWith(link.route))?.param;

  const logout = () => {
    const token = CookieManager("get", "access-token");
    const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

    [
      "access-token",
      "user-email",
      "user",
      "business-name",
      "business-id",
      "user-id",
      "user_id",
      "role",
      "primary_role",
      "verify-token",
      "register-token",
    ].forEach((cookie) => CookieManager("delete", cookie));

    socket.disconnect();
    router.replace("/sessions?form=signin");
    toast.success("Logged out successfully");

    if (token && requestBaseUrl) {
      fetch(`${requestBaseUrl}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "1",
        },
      }).catch(() => undefined);
    }
  };

  const openSettings = () => {
    setIsProfileOpen(false);
    router.push("/settings");
  };

  return (
    <>
      <header ref={navbarRef} className="relative w-full bg-v2-neutral-500 text-v2-neutral-100">
        <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
          <Link
            data-navbar-item
            href={isClient ? "/projects" : "/dashboard"}
            aria-label="Go to SynergiSuite home"
            className="group flex min-w-0 items-center gap-3 rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-v2-neutral-300/25"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-v2-neutral-100 text-v2-neutral-600 shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
              <Zap className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-[-0.02em] sm:text-base">
                SynergiSuite
              </span>
              <span className="hidden truncate text-[11px] text-v2-neutral-400 sm:block">
                {user.business || "Business workspace"}
              </span>
            </span>
          </Link>

          <div data-navbar-item className="flex shrink-0 items-center gap-2 sm:gap-3">
            <NotificationBell />
            <button
              type="button"
              className="group flex h-10 items-center gap-2.5 rounded-xl border border-v2-neutral-400/70 bg-v2-neutral-600/15 p-1 pr-1 text-left outline-none transition-colors hover:bg-v2-neutral-600/25 focus-visible:ring-[3px] focus-visible:ring-v2-neutral-300/25 sm:pr-3"
              onClick={() => setIsProfileOpen(true)}
              aria-label="Open account menu"
              aria-haspopup="dialog"
              aria-expanded={isProfileOpen}
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-v2-neutral-100 text-xs font-semibold text-v2-neutral-600">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden min-w-0 sm:block">
                <span className="block max-w-32 truncate text-xs font-medium text-v2-neutral-100">
                  {user.name || "Your account"}
                </span>
                <span className="mt-0.5 block max-w-32 truncate text-[10px] text-v2-neutral-400">
                  {formatRole(user.role)}
                </span>
              </span>
            </button>
          </div>
        </div>

        {links.length > 0 && (
          <div data-navbar-item className="border-t border-v2-neutral-400/70 px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Section navigation"
              className="flex gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {links.map((item) => {
                const isActive = activeTab === item.param;

                return (
                  <Link
                    key={item.param}
                    href={item.route}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative shrink-0 py-3 text-xs font-medium outline-none transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors focus-visible:text-v2-neutral-100",
                      isActive
                        ? "text-v2-neutral-100 after:bg-v2-neutral-100"
                        : "text-v2-neutral-400 after:bg-transparent hover:text-v2-neutral-200",
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {isProfileOpen && (
        <div className="fixed inset-0 z-[110]" role="presentation">
          <button
            ref={backdropRef}
            type="button"
            className="absolute inset-0 h-full w-full bg-v2-neutral-500/65 backdrop-blur-sm"
            aria-label="Close account menu"
            onClick={closeProfile}
          />

          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-panel-title"
            className="absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-3xl border border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-[0_-20px_70px_rgba(8,8,8,0.24)] sm:inset-y-0 sm:left-auto sm:w-[min(100%,420px)] sm:max-h-none sm:rounded-l-3xl sm:rounded-tr-none sm:shadow-[-20px_0_70px_rgba(8,8,8,0.24)]"
          >
            <div className="flex min-h-full flex-col p-5 sm:p-7">
              <div data-profile-item className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-v2-neutral-400">
                    Account
                  </p>
                  <h2 id="account-panel-title" className="mt-1 text-lg font-semibold tracking-[-0.025em]">
                    Your profile
                  </h2>
                </div>
                <Button
                  ref={closeButtonRef}
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Close account menu"
                  onClick={closeProfile}
                >
                  <X aria-hidden="true" />
                </Button>
              </div>

              <div data-profile-item className="mt-8 flex items-center gap-4">
                <Avatar className="size-16 rounded-2xl shadow-sm">
                  <AvatarFallback className="rounded-2xl bg-v2-neutral-500 text-lg font-semibold text-v2-neutral-100">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="truncate text-xl font-semibold tracking-[-0.03em]">
                    {user.name || "SynergiSuite user"}
                  </h3>
                  <p className="mt-1 truncate text-sm text-v2-neutral-400">
                    {user.email || "No email available"}
                  </p>
                </div>
              </div>

              <div data-profile-item className="mt-8 grid gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-v2-neutral-200 bg-v2-neutral-200/35 p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-v2-neutral-100 text-v2-neutral-500">
                    <Building2 className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-v2-neutral-400">Workspace</span>
                    <span className="mt-0.5 block truncate text-sm font-medium">
                      {user.business || "No workspace selected"}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-v2-neutral-200 bg-v2-neutral-200/35 p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-v2-neutral-100 text-v2-neutral-500">
                    <UserRound className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-v2-neutral-400">Access level</span>
                    <span className="mt-0.5 block truncate text-sm font-medium">
                      {formatRole(user.role)}
                    </span>
                  </span>
                </div>
              </div>

              <div data-profile-item className="mt-auto pt-10">
                <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-v2-neutral-200/45 px-3.5 py-3 text-xs leading-5 text-v2-neutral-400">
                  <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-v2-neutral-500" aria-hidden="true" />
                  Your profile and workspace access are protected by your authenticated session.
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button type="button" variant="outline" size="lg" onClick={openSettings}>
                    <Settings aria-hidden="true" />
                    Settings
                  </Button>
                  <Button type="button" variant="destructive" size="lg" onClick={logout}>
                    <LogOut aria-hidden="true" />
                    Sign out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
