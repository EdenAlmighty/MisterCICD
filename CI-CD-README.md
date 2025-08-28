# 🚀 CI/CD Pipeline Documentation

## Overview

This project uses GitHub Actions to implement a comprehensive CI/CD pipeline that automatically tests, builds, and deploys your Vue.js todo application to **both Vercel and GitHub Pages**.

## 🏗️ Pipeline Architecture

### **Workflow Structure**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Code Push     │───▶│   CI Pipeline   │───▶│  CD Pipeline   │
│   or PR         │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Test Stage    │    │  Deploy Stage  │
                       │                 │    │                 │
                       │ • Unit Tests    │    │ • Vercel        │
                       │ • E2E Tests     │    │ • GitHub Pages  │
                       │ • Type Check    │    │ • Rollback      │
                       └─────────────────┘    └─────────────────┘
```

## 📋 Workflows

### **1. Main CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)

- **Triggers**: Push to `main`/`develop`, Pull Requests
- **Jobs**: Test, Build, Security, Deploy
- **Runs**: On every code change

### **2. Pull Request Checks** (`.github/workflows/pull-request.yml`)

- **Triggers**: PR opened, updated, reopened
- **Jobs**: Quality, Coverage, Bundle Size, Security, Performance
- **Features**: Automated PR comments, coverage reports

### **3. Deployment Pipeline** (`.github/workflows/deploy.yml`)

- **Triggers**: After successful CI/CD pipeline
- **Jobs**: Development, Production, Rollback
- **Environments**: Separate deployment targets
- **Platforms**: Vercel (primary) + GitHub Pages (fallback)

## 🚀 Getting Started

### **Prerequisites**

1. **GitHub Repository** with your Vue.js app
2. **GitHub Actions** enabled
3. **Environment Secrets** configured (see below)

### **Step 1: Push Your Code**

```bash
git add .
git commit -m "feat: add CI/CD pipeline with Vercel & GitHub Pages"
git push origin main
```

### **Step 2: Monitor Workflows**

- Go to your GitHub repository
- Click **Actions** tab
- Watch the workflows run automatically

## 🔐 Environment Setup

### **Required Secrets**

Add these in your GitHub repository settings:

#### **Vercel Deployment (Primary)**

```
VERCEL_TOKEN=your_vercel_token
VERCEL_PROJECT_ID_DEV=your_dev_project_id
VERCEL_PROJECT_ID_PROD=your_prod_project_id
VERCEL_TEAM_ID=your_team_id
VERCEL_SCOPE=your_team_scope
```

#### **GitHub Pages Deployment (Fallback)**

```
GITHUB_TOKEN=your_github_token
GH_PAGES_CNAME=your-custom-domain.com
GH_PAGES_CUSTOM_DOMAIN_DEV=dev.your-domain.com
GH_PAGES_CUSTOM_DOMAIN_PROD=your-domain.com
```

### **Environment Protection**

- **Development**: Auto-deploy, 1 approval required
- **Production**: Manual approval, 2 approvals required
- **Staging**: Auto-deploy, 1 approval required

## 🧪 Testing Strategy

### **Test Stages**

1. **Unit Tests**: Vitest with coverage
2. **E2E Tests**: Playwright across browsers
3. **Type Checking**: TypeScript compilation
4. **Linting**: ESLint + Oxlint
5. **Formatting**: Prettier validation

### **Coverage Requirements**

- **Unit Tests**: Minimum 80% coverage
- **E2E Tests**: All critical user flows
- **Type Coverage**: 100% TypeScript coverage

## 🏗️ Build Process

### **Build Stages**

1. **Dependency Installation**: pnpm with caching
2. **Type Checking**: TypeScript compilation
3. **Linting**: Code quality checks
4. **Building**: Vite production build
5. **Bundle Analysis**: Size optimization checks

### **Build Artifacts**

- **Production Build**: `dist/` directory
- **Bundle Analysis**: `dist/stats.html`
- **Source Maps**: Disabled for production

## 🚀 Deployment Options

### **Platform Support**

- ✅ **Vercel** (Primary - Recommended)
- ✅ **GitHub Pages** (Fallback - Automatic)

### **Deployment Strategy**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Feature   │───▶│  Staging    │───▶│ Production  │
│   Branch    │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Vercel    │    │   Vercel    │    │   Vercel    │
│   (Primary) │    │   (Primary) │    │   (Primary) │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ GitHub Pages│    │ GitHub Pages│    │ GitHub Pages│
│ (Fallback)  │    │ (Fallback)  │    │ (Fallback)  │
└─────────────┘    └─────────────┘    └─────────────┘
```

### **Fallback Deployment**

- **Vercel Fails** → Automatically deploys to GitHub Pages
- **GitHub Pages Fails** → Vercel deployment continues
- **Both Succeed** → Vercel is primary, GitHub Pages is backup

## 📊 Monitoring & Analytics

### **Performance Metrics**

- **Bundle Size**: Automatic tracking
- **Lighthouse Scores**: Performance monitoring
- **Test Coverage**: Coverage reports
- **Build Times**: Performance tracking

### **Quality Gates**

- ✅ All tests must pass
- ✅ No security vulnerabilities
- ✅ Bundle size within limits
- ✅ Performance scores above threshold

## 🔧 Customization

### **Modify Workflows**

1. Edit `.github/workflows/*.yml` files
2. Update `deploy.config.js` for deployment settings
3. Modify `.github/actions.yml` for permissions

### **Add New Jobs**

```yaml
new-job:
  name: 🆕 New Job
  runs-on: ubuntu-latest
  needs: [test]
  steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4
    # Add your steps here
```

### **Environment Variables**

```yaml
env:
  CUSTOM_VAR: 'value'
  NODE_ENV: 'production'
```

## 🚨 Troubleshooting

### **Common Issues**

#### **Workflow Fails on Tests**

```bash
# Run tests locally first
npm run test:unit -- --run
npm run test:e2e --reporter=list
```

#### **Build Fails**

```bash
# Check build locally
npm run build
npm run build:analyze
```

#### **Deployment Issues**

1. Check environment secrets
2. Verify deployment platform configuration
3. Check environment protection rules

### **Debug Workflows**

1. Enable debug logging in repository settings
2. Check workflow run logs
3. Use `actions/github-script` for debugging

## 📈 Best Practices

### **Code Quality**

- ✅ Write comprehensive tests
- ✅ Use TypeScript strictly
- ✅ Follow linting rules
- ✅ Keep bundle size small

### **Security**

- ✅ Regular dependency updates
- ✅ Security audits enabled
- ✅ Environment secrets protected
- ✅ Code review required

### **Performance**

- ✅ Monitor bundle size
- ✅ Track performance metrics
- ✅ Optimize build times
- ✅ Cache dependencies

## 🔗 Useful Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI](https://vercel.com/docs/cli)
- [GitHub Pages](https://pages.github.com/)
- [Vue.js Deployment Guide](https://vuejs.org/guide/best-practices/production-deployment.html)

## 📞 Support

If you encounter issues:

1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Check GitHub Actions status page
4. Open an issue in the repository

---

**Happy Deploying! 🚀**
