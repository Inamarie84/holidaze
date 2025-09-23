// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  // ✅ Put this at the top level (not under `experimental`)
  outputFileTracingRoot: __dirname,
}

export default nextConfig
