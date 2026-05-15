import "leaflet/dist/leaflet.css";
import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { AriaProviders } from "@/components/aria-providers";
import { AppShell } from "@/components/app-shell";

export const metadata = {
  title: "Our Memory Map",
  description: "Không gian kỷ niệm riêng tư dành cho hai người."
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <AriaProviders>
          <AppShell>{children}</AppShell>
        </AriaProviders>
      </body>
    </html>
  );
}
