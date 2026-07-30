import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // A stray lockfile in the home directory makes Next guess the wrong workspace root.
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // @sparticuz/chromium (app/api/export-pdf) locates its binary files via
  // relative paths at runtime, which breaks if Next's build bundles/traces
  // the package instead of leaving it as a plain node_modules dependency —
  // its own README calls this out for every bundler. Without this, the route
  // 500s in production (works locally, since local dev never takes that
  // code path) with the binary missing from the deployed function.
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
}

export default nextConfig
