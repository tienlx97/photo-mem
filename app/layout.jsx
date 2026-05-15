import "leaflet/dist/leaflet.css";
import "./globals.css";
import { Be_Vietnam_Pro } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { AriaProviders } from "@/components/aria-providers";
import { AppShell } from "@/components/app-shell";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-app-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap"
});

export const metadata = {
  title: "Our Memory Map",
  description: "Không gian kỷ niệm riêng tư dành cho hai người."
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${GeistMono.variable}`}>
      <body>
        <AriaProviders>
          <AppShell>{children}</AppShell>
        </AriaProviders>
      </body>
    </html>
  );
}
