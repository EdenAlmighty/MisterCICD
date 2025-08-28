// Deployment Configuration for Vercel & GitHub Pages
// This file contains deployment settings for both platforms

module.exports = {
  // Development Environment
  development: {
    name: 'Development',
    url: 'https://dev-your-app.vercel.app',
    branch: 'develop',
    autoDeploy: true,
    requiredChecks: ['🧪 Run Tests', '🏗️ Build Application', '🔒 Security & Quality'],
    deployment: {
      platform: 'vercel', // Primary platform
      fallback: 'github-pages', // Fallback option
      config: {
        vercel: {
          projectId: process.env.VERCEL_PROJECT_ID_DEV,
          token: process.env.VERCEL_TOKEN,
          teamId: process.env.VERCEL_TEAM_ID,
          scope: process.env.VERCEL_SCOPE || process.env.VERCEL_TEAM_ID,
          alias: ['dev-your-app.vercel.app'],
          buildCommand: 'npm run build',
          outputDirectory: 'dist',
          installCommand: 'npm install --frozen-lockfile',
          devCommand: 'npm run dev',
          framework: 'vite',
        },
        'github-pages': {
          branch: 'gh-pages-dev',
          token: process.env.GITHUB_TOKEN,
          domain: 'dev-your-app.github.io',
          customDomain: process.env.GH_PAGES_CUSTOM_DOMAIN_DEV,
        },
      },
    },
  },

  // Production Environment
  production: {
    name: 'Production',
    url: 'https://your-app.vercel.app',
    branch: 'main',
    autoDeploy: false, // Requires manual approval
    requiredChecks: [
      '🧪 Run Tests',
      '🏗️ Build Application',
      '🔒 Security & Quality',
      '📦 Bundle Size',
      '📊 Performance Check',
    ],
    deployment: {
      platform: 'vercel', // Primary platform
      fallback: 'github-pages', // Fallback option
      config: {
        vercel: {
          projectId: process.env.VERCEL_PROJECT_ID_PROD,
          token: process.env.VERCEL_TOKEN,
          teamId: process.env.VERCEL_TEAM_ID,
          scope: process.env.VERCEL_SCOPE || process.env.VERCEL_TEAM_ID,
          alias: ['your-app.vercel.app', 'your-app.com'],
          buildCommand: 'npm run build',
          outputDirectory: 'dist',
          installCommand: 'npm install --frozen-lockfile',
          devCommand: 'npm run dev',
          framework: 'vite',
          functions: {
            'api/*.js': {
              runtime: 'nodejs20.x',
            },
          },
        },
        'github-pages': {
          branch: 'gh-pages',
          token: process.env.GITHUB_TOKEN,
          domain: 'your-app.github.io',
          customDomain: process.env.GH_PAGES_CUSTOM_DOMAIN_PROD,
          cname: process.env.GH_PAGES_CNAME,
        },
      },
    },
  },

  // Staging Environment
  staging: {
    name: 'Staging',
    url: 'https://staging-your-app.vercel.app',
    branch: 'staging',
    autoDeploy: true,
    requiredChecks: ['🧪 Run Tests', '🏗️ Build Application', '🔒 Security & Quality'],
    deployment: {
      platform: 'vercel', // Primary platform
      fallback: 'github-pages', // Fallback option
      config: {
        vercel: {
          projectId: process.env.VERCEL_PROJECT_ID_STAGING,
          token: process.env.VERCEL_TOKEN,
          teamId: process.env.VERCEL_TEAM_ID,
          scope: process.env.VERCEL_SCOPE || process.env.VERCEL_TEAM_ID,
          alias: ['staging-your-app.vercel.app'],
          buildCommand: 'npm run build',
          outputDirectory: 'dist',
          installCommand: 'npm install --frozen-lockfile',
          devCommand: 'npm run dev',
          framework: 'vite',
        },
        'github-pages': {
          branch: 'gh-pages-staging',
          token: process.env.GITHUB_TOKEN,
          domain: 'staging-your-app.github.io',
        },
      },
    },
  },

  // Common deployment settings
  common: {
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    installCommand: 'npm install --frozen-lockfile',
    nodeVersion: '20',
    cacheDirectories: ['node_modules', '.pnpm-store'],
    environmentVariables: {
      NODE_ENV: 'production',
      VITE_APP_ENV: 'production',
    },
    // Vercel-specific settings
    vercel: {
      buildCache: true,
      analytics: true,
      speedInsights: true,
      webAnalytics: true,
    },
    // GitHub Pages specific settings
    'github-pages': {
      enableJekyll: false, // Disable Jekyll for SPA routing
      preserveCname: true,
      forcePush: true,
    },
  },
}
