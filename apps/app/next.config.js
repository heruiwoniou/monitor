const withTwin = require("./withTwin");

/** @type {import('next').NextConfig} */
module.exports = withTwin({
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  async rewrites() {
    return [
      {
        source: "/zp/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/api/:path*`,
      },
    ];
  },
});
