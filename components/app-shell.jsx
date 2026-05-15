"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Studio", icon: "⌂" },
  { href: "/checkins", label: "Thư viện", icon: "▥" },
  { href: "/checkins/new", label: "Thêm", icon: "+" },
  { href: "/profile", label: "Không gian", icon: "♡" }
];

export function AppShell({ children }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Điều hướng chính">
        <Link href="/" className="brand" aria-label="Our Memory Map">
          <span className="brand-mark">O</span>
          <span>
            <strong>Our Memory Map</strong>
            <small>Private photo atlas</small>
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
          <span className="note-kicker">Photo-first</span>
          <p>Ảnh, video, địa điểm và ghi chú nằm trong một không gian riêng cho hai người.</p>
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
