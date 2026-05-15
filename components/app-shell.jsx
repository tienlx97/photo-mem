"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const navItems = [
  { href: "/", label: "Studio", icon: "⌂" },
  { href: "/checkins", label: "Thư viện", icon: "▥" },
  { href: "/checkins/new", label: "Thêm", icon: "+" },
  { href: "/profile", label: "Không gian", icon: "♡" }
];

export function AppShell({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <div className="app-shell">
      <main className="main-panel">{children}</main>

      <nav className="bottom-nav" aria-label="Điều hướng chính">
        {navItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? "bottom-nav-item active" : "bottom-nav-item"}
            >
              <span aria-hidden="true">{item.icon}</span>
              <small>{item.label}</small>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
