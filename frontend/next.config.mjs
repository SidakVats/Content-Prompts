/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    // Add small sizes so Next.js generates srcset entries that match
    // the actual rendered dimensions of marquee and stats images
    imageSizes: [64, 128, 192, 256, 320],
  },
};

export default nextConfig;
