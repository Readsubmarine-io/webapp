/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "img-cdn.magiceden.dev",
      "images.unsplash.com",
      "m.media-amazon.com",
      "encrypted-tbn2.gstatic.com",
      "d28hgpri8am2if.cloudfront.net",
      "i.pravatar.cc",
      "www.gravatar.com",
      "hebbkx1anhila5yf.public.blob.vercel-storage.com",
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    })
    config.module.rules.push({
      test: /\.css$/,
      use: [
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: ["tailwindcss", "autoprefixer"],
            },
          },
        },
      ],
    })
    return config
  },
}

module.exports = nextConfig

