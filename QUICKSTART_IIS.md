# Quick Start: Deploy to IIS

This is a quick reference for deploying this React app to IIS. For detailed instructions, see [IIS_DEPLOYMENT.md](./IIS_DEPLOYMENT.md).

## The Error You're Seeing

```
Managed handler is used; however, ASP.NET is not installed or is not installed completely.
```

## The Solution (5 Steps)

### 1. Install URL Rewrite Module
**Required!** Download and install: https://www.iis.net/downloads/microsoft/url-rewrite

### 2. Build the App
```bash
npm install --legacy-peer-deps
npm run build
```

### 3. Create IIS Site
- Open IIS Manager
- Right-click Sites → Add Website
- Set Physical Path to the `dist` folder
- Set port (e.g., 80)

### 4. Configure Application Pool
- Go to Application Pools
- Find your site's pool
- Right-click → Advanced Settings
- Set ".NET CLR Version" to **"No Managed Code"**

### 5. Browse Your Site
- Navigate to `http://localhost` (or your configured URL)
- The error should be gone!

## What's Included

The `web.config` file in `public/` folder (auto-copied to `dist/` during build) contains all necessary configuration:
- ✅ Disables ASP.NET managed modules
- ✅ Enables URL rewriting for React Router
- ✅ Sets proper MIME types for JS/CSS/fonts
- ✅ Adds security headers
- ✅ Enables compression

## Troubleshooting

### Still getting the error?
1. Verify URL Rewrite Module is installed (restart IIS after installing)
2. Check Application Pool .NET CLR Version is "No Managed Code"
3. Verify `dist/web.config` exists

### 404 on routes (e.g., /admin)?
1. URL Rewrite Module not installed
2. web.config not in the right location

### Static files not loading?
1. Physical Path in IIS doesn't point to `dist/` folder
2. Permissions issue (IIS_IUSRS needs Read access)

## Documentation

- **Full deployment guide**: [IIS_DEPLOYMENT.md](./IIS_DEPLOYMENT.md)
- **Validation checklist**: [IIS_VALIDATION.md](./IIS_VALIDATION.md)
- **Project README**: [README.md](./README.md)
