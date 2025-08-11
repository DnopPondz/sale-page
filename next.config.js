/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Placeholder
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      // Storage ของคุณ (ตัวอย่าง R2)
      // เปลี่ยน hostname ให้ตรงของจริง เช่น cdn.yourdomain.com, xxx.r2.cloudflarestorage.com
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com', pathname: '/**' },
      { protocol: 'https', hostname: 'your-public-bucket-host.com', pathname: '/**' },
    ],
  },
  experimental: { serverActions: { bodySizeLimit: '10mb' } },
  i18n: { locales: ['en', 'th'], defaultLocale: 'en' },
  experimental: { serverActions: { bodySizeLimit: '5mb' } },
};

export default nextConfig;
