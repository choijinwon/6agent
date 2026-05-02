"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "홈" },
  { href: "/career-resume", label: "경력기술서" },
  { href: "/dev-tools", label: "개발툴" },
  { href: "/html-audit", label: "HTML 감사" },
  { href: "/design-md", label: "Design MD" },
  { href: "/productivity", label: "생산성" },
  { href: "/projects", label: "프로젝트" },
  { href: "/timeline", label: "타임라인" },
  { href: "/agents", label: "에이전트" },
  { href: "/prd-playbook", label: "PRD 노하우" },
  { href: "/ui-ai-components", label: "UI AI 컴포넌트" },
  { href: "/ai-chart-components", label: "AI 차트 컴포넌트" },
];

const MQ_DESKTOP = "(min-width: 1024px)";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const navRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const sidebarRef = useRef<HTMLElement>(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MQ_DESKTOP);
    const apply = () => {
      const desktop = mq.matches;
      setIsDesktop(desktop);
      if (!desktop) {
        setSidebarOpen(false);
      }
    };
    apply();
    if (mq.matches) {
      setSidebarOpen(true);
    }
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  }, [pathname, isDesktop]);

  useEffect(() => {
    const active = navRefs.current[pathname];
    if (!active || !sidebarRef.current?.contains(active)) return;
    active.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [pathname, sidebarOpen, isDesktop]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((v) => !v);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    if (!isDesktop) setSidebarOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    if (!sidebarOpen || isDesktop) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen, isDesktop]);

  useEffect(() => {
    if (isDesktop || !sidebarOpen) return;

    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      window.scrollTo({ top: scrollY });
    };
  }, [isDesktop, sidebarOpen]);

  const shellClass = useMemo(
    () =>
      [
        "site-shell",
        isDesktop ? "site-shell-desktop" : "site-shell-mobile",
        sidebarOpen ? "is-sidebar-open" : "is-sidebar-closed",
      ].join(" "),
    [isDesktop, sidebarOpen],
  );

  return (
    <div className={shellClass}>
      <aside
        ref={sidebarRef}
        id="site-sidebar"
        className="site-sidebar"
        aria-hidden={!sidebarOpen}
        aria-label="사이트 메뉴"
        {...(!sidebarOpen ? { inert: true as const } : {})}
      >
        <div className="site-sidebar-inner">
          <div className="site-sidebar-head">
            <Link href="/" className="site-sidebar-brand" onClick={closeMobileSidebar}>
              6 Agents Lab
            </Link>
          </div>
          <nav className="site-sidebar-nav" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                ref={(node) => {
                  navRefs.current[item.href] = node;
                }}
                className={pathname === item.href ? "is-active" : undefined}
                onClick={closeMobileSidebar}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {!isDesktop && sidebarOpen ? (
        <button
          type="button"
          className="site-sidebar-scrim is-visible"
          aria-label="메뉴 닫기"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="site-main-column">
        <header className="site-topbar">
          <div className="site-topbar-inner section">
            <button
              type="button"
              className="site-sidebar-toggle"
              aria-label={sidebarOpen ? "메뉴 접기" : "메뉴 펼치기"}
              aria-expanded={sidebarOpen}
              aria-controls="site-sidebar"
              onClick={toggleSidebar}
            >
              <span className="site-sidebar-toggle-bar" aria-hidden />
              <span className="site-sidebar-toggle-bar" aria-hidden />
              <span className="site-sidebar-toggle-bar" aria-hidden />
            </button>
            <Link href="/" className="site-topbar-brand">
              6 Agents Lab
            </Link>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
