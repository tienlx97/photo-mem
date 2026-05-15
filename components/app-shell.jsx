"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Tổng quan", icon: "⌂" },
  { href: "/checkins", label: "Kỷ niệm", icon: "▤" },
  { href: "/checkins/new", label: "Thêm", icon: "+" },
  { href: "/profile", label: "Chúng mình", icon: "♡" }
];

export function AppShell({ children }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Điều hướng chính">
        <Link href="/" className="brand" aria-label="Our Memory Map">
          <span className="brand-mark">M</span>
          <span>
            <strong>Our Memory Map</strong>
            <small>Minh & An</small>
          </span>
        </Link>

        <nav className="nav-list">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? "nav-item active" : "nav-item"}
              >
                <span className="nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-note">
          <span className="note-kicker">Riêng tư</span>
          <p>Chỉ hai người trong không gian này. Không feed, không like, không người lạ.</p>
        </div>
      </aside>

      <main className="main-panel">{children}</main>

      <nav className="bottom-nav" aria-label="Điều hướng nhanh">
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
