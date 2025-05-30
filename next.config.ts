

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  webpack: (config: Configuration) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;


