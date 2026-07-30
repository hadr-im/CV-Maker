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
  // serverExternalPackages keeps the package's *imports* from being bundled,
  // but Vercel's separate file-tracing step (which decides which files
  // actually get uploaded for the function) still doesn't pick up
  // @sparticuz/chromium's binary assets on its own, since nothing statically
  // `require()`s them — the package reads them off disk by path at runtime.
  // Confirmed in production: "input directory .../chromium/bin does not
  // exist". This forces that directory to be included regardless.
  outputFileTracingIncludes: {
    '/api/export-pdf/**': ['./node_modules/@sparticuz/chromium/bin/**'],
  },
}

export default nextConfig
