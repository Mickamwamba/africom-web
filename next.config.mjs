

const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // On a CPU-constrained build container, Next's "Collecting page data" phase
  // forks jest-worker child processes whose IPC can deadlock and hang forever.
  // Forcing single-process (no worker threads, 1 cpu) makes it run in-process.
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  // The webpack filesystem cache serializes large strings into memory, pushing
  // low-RAM build runners over the heap limit. Disable it for production builds.
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
