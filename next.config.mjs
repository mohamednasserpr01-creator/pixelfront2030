/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'via.placeholder.com' },
            { protocol: 'https', hostname: 'cdn3d.iconscout.com' },
            { protocol: 'https', hostname: 'api.dicebear.com' } /* 👈 تم إضافة الدومين هنا */
        ],
    },
};

export default nextConfig;