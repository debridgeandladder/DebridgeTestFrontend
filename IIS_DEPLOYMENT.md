# IIS Deployment Guide for BridgeX Frontend

This guide explains how to deploy the BridgeX React application to IIS (Internet Information Services).

## Prerequisites

Before deploying to IIS, ensure you have:

1. **IIS installed** on your Windows Server
2. **URL Rewrite Module** installed for IIS
   - Download from: https://www.iis.net/downloads/microsoft/url-rewrite
   - This is **required** for the web.config rewrite rules to work
3. **Build the application** by running `npm run build`

## The Problem This Solves

When deploying a React/Vite Single Page Application (SPA) to IIS, you may encounter this error:

```
Managed handler is used; however, ASP.NET is not installed or is not installed completely.
```

This error occurs because:
- IIS tries to use ASP.NET managed handlers by default
- React apps are static sites that don't need ASP.NET
- Without proper configuration, IIS doesn't know how to handle client-side routing

## The Solution

The included `web.config` file in the `public/` directory (automatically copied to `dist/` during build) solves these issues by:

1. **Disabling managed modules** - Sets `runAllManagedModulesForAllRequests="false"` so IIS treats this as a static site
2. **Configuring URL rewriting** - Redirects all requests to `index.html` to support React Router
3. **Setting proper MIME types** - Ensures JavaScript, JSON, and font files are served correctly
4. **Adding security headers** - Includes basic security headers for production

## Deployment Steps

### 1. Build the Application

```bash
npm install --legacy-peer-deps
npm run build
```

This creates a `dist/` folder with all compiled files, including `web.config`.

### 2. Install URL Rewrite Module (If Not Already Installed)

1. Download the URL Rewrite Module from https://www.iis.net/downloads/microsoft/url-rewrite
2. Run the installer
3. Restart IIS Manager

### 3. Create a New Site in IIS

1. Open **IIS Manager**
2. Right-click on **Sites** → **Add Website**
3. Configure:
   - **Site name**: BridgeX (or your preferred name)
   - **Physical path**: Point to the `dist` folder of your build
   - **Port**: 80 (or your preferred port)
   - **Host name**: Your domain (optional)
4. Click **OK**

### 4. Configure Application Pool (Optional but Recommended)

1. In IIS Manager, click on **Application Pools**
2. Find the pool for your site
3. Right-click → **Advanced Settings**
4. Set **.NET CLR Version** to **No Managed Code** (since this is a static site)
5. Click **OK**

### 5. Verify Deployment

1. Browse to your site: `http://localhost` (or your configured domain/port)
2. Test navigation between routes to ensure URL rewriting works
3. Check browser console for any errors

## Troubleshooting

### "HTTP Error 500.19" or "Cannot read configuration"
- **Cause**: URL Rewrite Module not installed
- **Solution**: Install the URL Rewrite Module (see Prerequisites)

### "HTTP Error 404.0" on navigation
- **Cause**: URL Rewrite rules not working
- **Solution**: Verify web.config is in the root of your site and URL Rewrite Module is installed

### Static files (JS/CSS) not loading
- **Cause**: Incorrect MIME types or physical path
- **Solution**: 
  - Verify the Physical Path in IIS points to the `dist` folder
  - Check that web.config MIME type mappings are present

### "Managed handler" error persists
- **Cause**: Application pool still trying to use .NET
- **Solution**: Set Application Pool .NET CLR Version to "No Managed Code"

## Web.Config Explanation

The `web.config` file includes:

- **URL Rewrite Rules**: Redirect all non-file requests to index.html (for React Router)
- **Static Content**: Proper MIME types for .js, .json, .woff, .woff2, .svg files
- **Disabled Managed Modules**: Prevents ASP.NET from interfering with static content
- **Default Document**: Sets index.html as the default page
- **Security Headers**: Adds X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **Compression**: Enables gzip compression for better performance

## Additional Notes

### For Subdirectory Deployments

If deploying to a subdirectory (e.g., `http://yoursite.com/bridgex/`), you may need to:

1. Update the `base` property in `vite.config.js`:
```javascript
export default defineConfig({
  base: '/bridgex/',  // Update this to match your subdirectory
  // ... rest of config
})
```

2. Rebuild the application

### For HTTPS

For HTTPS deployments:
1. Install an SSL certificate in IIS
2. Add HTTPS binding to your site
3. Optionally add HTTP to HTTPS redirect rule in web.config

## Support

For more information:
- IIS URL Rewrite: https://www.iis.net/downloads/microsoft/url-rewrite
- React Router and Server Configuration: https://reactrouter.com/web/guides/deployment
- Vite Static Deployment: https://vitejs.dev/guide/static-deploy.html
