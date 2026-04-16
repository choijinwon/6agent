"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "홈" },
  { href: "/career-resume", label: "경력기술서" },
  { href: "/dev-tools", label: "개발툴" },
  { href: "/projects", label: "프로젝트" },
  { href: "/timeline", label: "타임라인" },
  { href: "/agents", label: "에이전트" },
  { href: "/prd-playbook", label: "PRD 노하우" },
  { href: "/ui-ai-components", label: "UI AI 컴포넌트" },
  { href: "/ai-chart-components", label: "AI 차트 컴포넌트" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const navItemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const activeRef = navItemRefs.current[pathname];
    if (!activeRef) {
      return;
    }

    activeRef.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [pathname]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

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
  }, [isMobileMenuOpen]);

  return (
    <header className={`site-header ${isMobileMenuOpen ? "is-menu-open" : ""}`}>
      <div className="site-header-inner section">
        <Link href="/" className="brand">
          6 Agents Lab
        </Link>

        <div className="site-header-actions">
          <button
            type="button"
            className="site-menu-btn"
            aria-label="메뉴 열기"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-site-nav"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className="site-nav" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                ref={(node) => {
                  navItemRefs.current[item.href] = node;
                }}
                className={pathname === item.href ? "is-active" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <nav
        id="mobile-site-nav"
        className={`site-mobile-nav ${isMobileMenuOpen ? "is-open" : ""}`}
        aria-label="Mobile primary"
      >
        <div className="site-nav-drawer-head">
          <strong>메뉴</strong>
          <button
            type="button"
            className="site-nav-close-btn"
            aria-label="메뉴 닫기"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            닫기
          </button>
        </div>
        {NAV_ITEMS.map((item) => (
          <Link
            key={`mobile-${item.href}`}
            href={item.href}
            className={pathname === item.href ? "is-active" : undefined}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        aria-label="메뉴 닫기"
        className={`site-nav-overlay ${isMobileMenuOpen ? "is-open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}
