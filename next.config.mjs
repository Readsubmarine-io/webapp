let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NODE_ENV === 'production'
    ? {
        output: 'standalone',
      }
    : {}),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: false,
    parallelServerBuildTraces: false,
    parallelServerCompiles: false,
    memoryBasedWorkers: false,
    memoryLimit: 100,
    cpus: 1,
  },
  webpack: (config) => {
    // Ограничиваем использование памяти
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        maxSize: 200000,
        minSize: 20000,
      },
    }

    // Ограничиваем количество параллельных процессов
    config.parallelism = 1

    return config
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
