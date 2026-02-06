# IIS Deployment Guide for DebridgeTestFrontend

## Overview
This is a React + Vite frontend application that needs to be deployed as a **static website** on IIS, not as an ASP.NET Core application.

## The Issue You're Experiencing

**Error:** HTTP Error 500.21 - Handler "aspNetCore" has a bad module "AspNetCoreModuleV2"

**Root Cause:** This error occurs because:
1. This is a React/JavaScript application (not ASP.NET Core)
2. The IIS site is incorrectly configured to use AspNetCoreModuleV2
3. AspNetCoreModuleV2 is only needed for ASP.NET Core backend applications

## Solution: Deploy as a Static Website

### Prerequisites
1. **Windows Server** with IIS installed
2. **URL Rewrite Module** for IIS (Required for React Router support)
   - Download: https://www.iis.net/downloads/microsoft/url-rewrite
   - Install the URL Rewrite Module 2.1 or later

### Step 1: Install IIS URL Rewrite Module

1. Download the URL Rewrite Module from: https://www.iis.net/downloads/microsoft/url-rewrite
2. Run the installer (rewrite_amd64_en-US.msi or rewrite_x86_en-US.msi)
3. Follow the installation wizard
4. Restart IIS after installation:
   ```powershell
   iisreset
   ```

### Step 2: Build the Application

1. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   bun install
   ```

2. Build the production version:
   ```bash
   npm run build
   # or
   pnpm run build
   # or
   bun run build
   ```

3. The build output will be in the `dist` folder

### Step 3: Configure IIS

#### Option A: Create a New Site (Recommended)

1. Open **IIS Manager**
2. Right-click on **Sites** → **Add Website**
3. Configure the site:
   - **Site name:** DebridgeTestFrontend (or your preferred name)
   - **Physical path:** Point to the `dist` folder (e.g., `C:\path\to\DebridgeTestFrontend\dist`)
   - **Port:** 8080 (or your preferred port)
4. Click **OK**

#### Option B: Fix Existing Site Configuration

If you already have a site configured:

1. Open **IIS Manager**
2. Select your site
3. Double-click **Handler Mappings**
4. **Remove** any handler named "aspNetCore" or references to AspNetCoreModuleV2
5. Make sure the following handlers are present:
   - StaticFileModule
   - DefaultDocumentModule
   - DirectoryListingModule

### Step 4: Verify web.config

The `web.config` file in the `dist` folder should already be present (it's included in the build). This file:
- Removes ASP.NET Core handlers
- Enables static file serving
- Configures URL rewriting for React Router
- Sets up proper MIME types

### Step 5: Test the Application

1. Browse to `http://localhost:8080` (or your configured URL)
2. The application should load without the AspNetCoreModuleV2 error
3. Test navigation to ensure React Router works correctly

## Troubleshooting

### If you still see the AspNetCoreModuleV2 error:

1. **Check the physical path:**
   - Ensure IIS is pointing to the `dist` folder (where the built files are)
   - NOT pointing to the root project folder

2. **Verify web.config:**
   ```bash
   # Ensure web.config exists in the dist folder
   ls dist/web.config
   ```

3. **Check IIS Application Pool:**
   - Open IIS Manager
   - Go to **Application Pools**
   - Select your application pool
   - Ensure **.NET CLR Version** is set to "No Managed Code"
   - This is a static site, not a .NET application

4. **Remove any aspNetCore handlers manually:**
   - In IIS Manager, select your site
   - Double-click **Handler Mappings**
   - Remove any entries related to "aspNetCore"

5. **Restart IIS:**
   ```powershell
   iisreset
   ```

### Common Issues

**Issue:** Pages other than home page show 404 errors
- **Solution:** Install the URL Rewrite Module (see Step 1)

**Issue:** JavaScript or CSS files not loading
- **Solution:** Check MIME types are configured correctly in web.config

**Issue:** Permission errors
- **Solution:** Ensure the IIS application pool identity has read access to the dist folder

## Alternative Deployment Options

If you prefer not to use IIS, consider these alternatives:

1. **Node.js Server:**
   ```bash
   npm install -g serve
   serve -s dist -l 8080
   ```

2. **Nginx:** Better suited for static sites
3. **Azure Static Web Apps**
4. **Vercel/Netlify:** Already configured in package.json

## Architecture Notes

- **Frontend:** React 19 + Vite
- **Build Tool:** Vite 6.3.5
- **Package Manager:** PNPM (configured)
- **Deployment Type:** Static website (no backend required)

## Important: This is NOT an ASP.NET Core Application

Remember:
- ❌ Do NOT install ASP.NET Core Hosting Bundle
- ❌ Do NOT use AspNetCoreModuleV2
- ❌ Do NOT configure as a .NET application
- ✅ DO treat this as a static website
- ✅ DO install URL Rewrite Module
- ✅ DO use StaticFileModule

## Need Help?

If you continue to experience issues:
1. Check the IIS logs at: `C:\inetpub\logs\LogFiles`
2. Verify the web.config is in the dist folder
3. Ensure URL Rewrite Module is installed
4. Confirm the physical path points to the dist folder (not the project root)
