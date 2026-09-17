/** @type {import('next').NextConfig} */
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const githubPagesPath = process.env.GITHUB_ACTIONS === 'true' && repositoryName ? `/${repositoryName}` : '';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: githubPagesPath,
  assetPrefix: githubPagesPath ? `${githubPagesPath}/` : undefined,
};
export default nextConfig;
