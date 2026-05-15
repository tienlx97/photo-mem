"use client";

import { OverlayProvider } from "react-aria";

export function AriaProviders({ children }) {
  return <OverlayProvider>{children}</OverlayProvider>;
}
