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
}

export default nextConfig
