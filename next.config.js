/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com', 'i.scdn.co', 'static-cdn.jtvnw.net'],
  },
  output: 'standalone',
}

module.exports = nextConfig
