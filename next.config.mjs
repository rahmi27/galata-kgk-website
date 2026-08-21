import { createRequire } from "node:module";
import createNextIntlPlugin from "next-intl/plugin";

const require = createRequire(import.meta.url);
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const isDevelopment = process.env.NODE_ENV === "development";
const nextLegacyPolyfills = require.resolve(
  "next/dist/build/polyfills/polyfill-module",
);
const modernBrowserPolyfills = require.resolve(
  "./lib/modern-browser-polyfills.js",
);

const developmentTunnelOrigins = (
  process.env.DEV_TUNNEL_ORIGINS ??
  "*.ngrok-free.dev,*.ngrok.app,*.ngrok.io,*.trycloudflare.com"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "frame-src https://www.google.com https://maps.google.com https://maps.googleapis.com",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.blob.vercel-storage.com https://*.googleapis.com https://*.gstatic.com",
  "font-src 'self' data:",
  `connect-src 'self'${isDevelopment ? " ws: wss:" : ""}`,
  "media-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "X-Permitted-Cross-Domain-Policies",
    value: "none",
  },
  {
    key: "Origin-Agent-Cluster",
    value: "?1",
  },
  ...(!isDevelopment
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.blob.vercel-storage.com",
      },
    ],
  },
  ...(isDevelopment
    ? {
        allowedDevOrigins: developmentTunnelOrigins,
      }
    : {}),
  experimental: {
    inlineCss: true,
    serverActions: {
      bodySizeLimit: "6mb",
      ...(isDevelopment
        ? {
            allowedOrigins: developmentTunnelOrigins,
          }
        : {}),
    },
  },
  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      config.resolve.alias[nextLegacyPolyfills] = modernBrowserPolyfills;
    }

    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
