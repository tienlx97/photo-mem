import stylex from "@stylexjs/unplugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  },
  webpack(config) {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      (warning) => warning.message?.includes("[stylex] No CSS asset found to inject into")
    ];

    config.plugins.push(
      stylex.webpack({
        useCSSLayers: true,
        unstable_moduleResolution: {
          type: "commonJS",
          rootDir: process.cwd()
        }
      })
    );

    return config;
  }
};

export default nextConfig;
