/** @type {import('next').NextConfig} */
import { createCivicAuthPlugin } from "@civic/auth/nextjs";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  experimental: {
    esmExternals: true,
  },
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "90d82aa0-34a1-464d-b0e1-66313ddcf0f1"
});

export default withCivicAuth(nextConfig);