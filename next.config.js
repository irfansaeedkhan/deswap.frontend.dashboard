try {
  require("./scripts/compile-page-css.js");
} catch (err) {
  console.warn("[compile-page-css]", err && err.message ? err.message : err);
}

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  compress: true,
  sassOptions: {
    quietDeps: true,
    silenceDeprecations: [
      "import",
      "legacy-js-api",
      "global-builtin",
      "color-functions",
    ],
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 50,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "deswap.s3.eu-west-3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "infura-ipfs.io",
      },
      {
        protocol: "https",
        hostname: "deswap.infura-ipfs.io",
      },
    ],
  },
  serverExternalPackages: [
    "mongoose",
    "bcryptjs",
    "ioredis",
    "aws-sdk",
    "nodemailer",
    "ejs",
    "ipfs-http-client",
    "web3",
  ],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        encoding: false,
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
        process: require.resolve("process/browser"),
      };
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
