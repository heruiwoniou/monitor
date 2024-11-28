const withTwin = require("./withTwin");

/** @type {import('next').NextConfig} */
module.exports = withTwin({
  reactStrictMode: true,
  output: "standalone",
  transpilePackages: ["@monitor/ui"],
  async rewrites() {
    return [
      {
        source: "/zp/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/api/:path*`,
      },
      {
        source: "/zp/image/:path*",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/image/:path*`,
      },
    ];
  },
});
