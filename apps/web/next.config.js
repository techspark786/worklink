/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS || false;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (isGithubActions ? '/worklink' : '');
const isExport = process.env.NEXT_EXPORT === 'true' || Boolean(isGithubActions);

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
  output: isExport ? 'export' : undefined,
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

