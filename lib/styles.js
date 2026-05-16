import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  "app-shell": {
    minHeight: "100vh",
    gridTemplateColumns: {
      default: null,
      "@media (max-width: 1100px)": "1fr"
    }
  },
  "main-panel": {
    minWidth: 0,
    paddingTop: {
      default: 28,
      "@media (max-width: 1100px)": 22,
      "@media (max-width: 820px)": 16,
      "@media (max-width: 520px)": 12
    },
    paddingRight: {
      default: 28,
      "@media (max-width: 1100px)": 16,
      "@media (max-width: 820px)": 12,
      "@media (max-width: 520px)": 10
    },
    paddingBottom: {
      default: 104,
      "@media (max-width: 1100px)": 92,
      "@media (max-width: 820px)": 98,
      "@media (max-width: 520px)": 94
    },
    paddingLeft: {
      default: 28,
      "@media (max-width: 1100px)": 16,
      "@media (max-width: 820px)": 12,
      "@media (max-width: 520px)": 10
    }
  },
  "bottom-nav": {
    position: "fixed",
    right: {
      default: "max(16px, env(safe-area-inset-right))",
      "@media (min-width: 960px)": 18,
      "@media (max-width: 520px)": "max(8px, env(safe-area-inset-right))"
    },
    bottom: {
      default: "max(16px, env(safe-area-inset-bottom))",
      "@media (max-width: 520px)": "max(8px, env(safe-area-inset-bottom))"
    },
    left: {
      default: "max(16px, env(safe-area-inset-left))",
      "@media (min-width: 960px)": "auto",
      "@media (max-width: 520px)": "max(8px, env(safe-area-inset-left))"
    },
    zIndex: 1000,
    display: "grid",
    maxWidth: {
      default: 520,
      "@media (min-width: 960px)": 390,
      "@media (max-width: 820px)": 440
    },
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 6,
    marginTop: 0,
    marginRight: "auto",
    marginBottom: 0,
    marginLeft: "auto",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(213, 228, 222, 0.86)",
    borderRadius: {
      default: 20,
      "@media (max-width: 820px)": 28
    },
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    padding: 8,
    boxShadow: "0 18px 58px rgba(28, 46, 42, 0.16)",
    backdropFilter: "blur(22px) saturate(1.12)"
  },
  "bottom-nav-item": {
    display: "flex",
    minWidth: 0,
    minHeight: {
      default: 58,
      "@media (max-width: 820px)": 54,
      "@media (max-width: 520px)": 52
    },
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: {
      default: 8,
      "@media (max-width: 820px)": 22
    },
    color: "var(--muted)",
    paddingTop: 8,
    paddingRight: 4,
    paddingBottom: 8,
    paddingLeft: 4,
    fontWeight: 800
  },
  "route-skeleton": {
    position: "fixed",
    inset: 0,
    zIndex: 900,
    display: "grid",
    gridTemplateRows: "auto minmax(0, 1fr)",
    gap: {
      default: 14,
      "@media (max-width: 820px)": 10
    },
    backgroundColor: "rgba(238, 242, 246, 0.82)",
    paddingTop: {
      default: "max(18px, env(safe-area-inset-top))",
      "@media (max-width: 820px)": "max(12px, env(safe-area-inset-top))"
    },
    paddingRight: {
      default: "max(18px, env(safe-area-inset-right))",
      "@media (max-width: 820px)": "max(10px, env(safe-area-inset-right))"
    },
    paddingBottom: {
      default: "calc(102px + env(safe-area-inset-bottom))",
      "@media (max-width: 820px)": "calc(94px + env(safe-area-inset-bottom))"
    },
    paddingLeft: {
      default: "max(18px, env(safe-area-inset-left))",
      "@media (max-width: 820px)": "max(10px, env(safe-area-inset-left))"
    },
    pointerEvents: "none",
    backdropFilter: "blur(10px)"
  },
  "route-skeleton-top": {
    display: "grid",
    maxWidth: 1180,
    width: "100%",
    gridTemplateColumns: {
      default: "minmax(0, 1fr) 160px",
      "@media (max-width: 820px)": "1fr"
    },
    gap: 12,
    marginTop: 0,
    marginRight: "auto",
    marginBottom: 0,
    marginLeft: "auto"
  },
  "route-skeleton-body": {
    display: "grid",
    maxWidth: 1180,
    width: "100%",
    gridTemplateColumns: {
      default: "1fr 0.72fr",
      "@media (max-width: 820px)": "1fr"
    },
    gridTemplateRows: {
      default: "minmax(220px, 0.8fr) minmax(180px, 0.6fr)",
      "@media (max-width: 820px)": "190px 150px 150px"
    },
    gap: {
      default: 14,
      "@media (max-width: 820px)": 10
    },
    marginTop: 0,
    marginRight: "auto",
    marginBottom: 0,
    marginLeft: "auto"
  },
  "sr-only": {
    position: "absolute",
    width: 1,
    height: 1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap"
  }
});

export function cx(...values) {
  const tokens = [];

  for (const value of values.flat(Infinity)) {
    if (!value) {
      continue;
    }

    if (typeof value === "string") {
      tokens.push(...value.split(/\s+/).filter(Boolean));
      continue;
    }

    if (typeof value === "object") {
      for (const [token, enabled] of Object.entries(value)) {
        if (enabled) {
          tokens.push(token);
        }
      }
    }
  }

  const stylexClassName = stylex.props(...tokens.map((token) => styles[token]).filter(Boolean)).className;

  return [stylexClassName, ...tokens].filter(Boolean).join(" ");
}
