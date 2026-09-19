const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];
module.exports = {
  reactStrictMode: true,
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  images: {
    domains: [
      "deswap.s3.eu-west-3.amazonaws.com",
      "infura-ipfs.io",
      "deswap.infura-ipfs.io",
    ],
    //domains:['https://deswap.infura-ipfs.io/ipfs/QmPcddN4Rp9mvKR57LkWXgsB3U17kiznXvgEZc73kACd4P']
    //if you want get details from infura
    //domains: ['ipfs.infura.io']
  },
  // matcher: [
  //   /*
  //    * Match all request paths except for the ones starting with:
  //    * - api (API routes)
  //    * - static (static files)
  //    * - favicon.ico (favicon file)
  //    */
  //   "/((?!api|static|favicon.ico).*)",
  // ],
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  future: {
    webpack5: true, // by default, if you customize webpack config, they switch back to version 4.
    // Looks like backward compatibility approach.
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
    };

    return config;
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});
module.exports = withBundleAnalyzer({});
