

// next.config.mjs (ESM)
const nextConfig = {
  async rewrites() {
    return [
      { source: "/api/:path*", destination: "http://localhost:5000/api/:path*" },
      { source: "/auth/:path*", destination: "http://localhost:5000/api/auth/:path*" },
    ];
  },
};



export default nextConfig
