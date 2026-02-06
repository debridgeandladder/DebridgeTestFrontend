# IIS Deployment Validation Checklist

Use this checklist to verify your IIS deployment is configured correctly.

## Pre-Deployment Checklist

- [ ] **Node.js installed** (version 18 or higher)
- [ ] **Dependencies installed**: Run `npm install --legacy-peer-deps`
- [ ] **Build successful**: Run `npm run build` and verify `dist/` folder is created
- [ ] **web.config present**: Verify `dist/web.config` exists after build
- [ ] **IIS installed** on your Windows Server
- [ ] **URL Rewrite Module installed** (Download from: https://www.iis.net/downloads/microsoft/url-rewrite)

## IIS Configuration Checklist

- [ ] **IIS Site created** pointing to the `dist/` folder
- [ ] **Application Pool configured**:
  - [ ] .NET CLR Version set to "No Managed Code"
  - [ ] Managed Pipeline Mode can be "Integrated" or "Classic"
- [ ] **Bindings configured** (port, host name, etc.)
- [ ] **Permissions set**: IIS user (IIS_IUSRS) has read access to the `dist/` folder

## Post-Deployment Validation

### 1. Basic Site Loading
- [ ] Navigate to your site's URL (e.g., `http://localhost` or `http://yoursite.com`)
- [ ] Site loads without errors
- [ ] No "Managed handler" error appears

### 2. Static Files Loading
- [ ] Open browser developer tools (F12)
- [ ] Check Network tab
- [ ] Verify JavaScript files (.js) load with HTTP 200 status
- [ ] Verify CSS files (.css) load with HTTP 200 status
- [ ] Check Console tab for any errors

### 3. Client-Side Routing
- [ ] Navigate to the admin page (e.g., `http://yoursite.com/admin`)
- [ ] Page loads correctly (no 404 error)
- [ ] Refresh the page while on `/admin` route
- [ ] Page still loads correctly after refresh (URL rewriting working)

### 4. web.config Applied
- [ ] In IIS Manager, select your site
- [ ] Click on "URL Rewrite" module
- [ ] Verify "React Routes" rule appears in the list
- [ ] Rule should be enabled

### 5. Security Headers
- [ ] Open browser developer tools (F12)
- [ ] Go to Network tab
- [ ] Refresh the page
- [ ] Click on the main document request (usually index.html)
- [ ] Check Response Headers section
- [ ] Verify these headers are present:
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `X-Frame-Options: SAMEORIGIN`
  - [ ] `X-XSS-Protection: 1; mode=block`

## Common Issues and Solutions

### Issue: "HTTP Error 500.19 - Internal Server Error"
**Symptoms:** Cannot read configuration section 'system.webServer/rewrite/rules'

**Solution:**
1. URL Rewrite Module is not installed
2. Install from: https://www.iis.net/downloads/microsoft/url-rewrite
3. Restart IIS after installation

### Issue: "Managed handler is used" Error
**Symptoms:** Error message about ASP.NET not being installed

**Solution:**
1. Application Pool is trying to use .NET managed code
2. In IIS Manager, go to Application Pools
3. Find your site's pool, right-click → Advanced Settings
4. Set ".NET CLR Version" to "No Managed Code"
5. Click OK and restart the site

### Issue: 404 Error on Routes
**Symptoms:** Direct navigation to routes like `/admin` returns 404

**Solution:**
1. web.config not being read or URL Rewrite not working
2. Verify web.config is in the root of your site (same folder as index.html)
3. Verify URL Rewrite Module is installed
4. Check IIS Manager → Your Site → URL Rewrite → should show "React Routes" rule

### Issue: Static Files Not Loading
**Symptoms:** JavaScript/CSS files return 404 or 403 errors

**Solution:**
1. Physical path in IIS might be incorrect
2. In IIS Manager, right-click your site → Manage Website → Advanced Settings
3. Verify Physical Path points to your `dist/` folder
4. Check folder permissions (IIS_IUSRS needs Read access)

### Issue: Can't Browse to Site
**Symptoms:** "This site can't be reached" or "Connection refused"

**Solution:**
1. Check site bindings (port might be in use)
2. In IIS Manager, select your site
3. Click Bindings in the Actions panel
4. Verify port is correct and not used by another application
5. If using port 80, make sure no other site is using it
6. Check Windows Firewall settings

## Performance Validation

- [ ] **Compression enabled**: Check Response Headers for `Content-Encoding: gzip`
- [ ] **Caching working**: Second page load should use cached resources (check Network tab, status 304 or "from cache")
- [ ] **Page load time**: First load should be under 3 seconds on a good connection

## Production Readiness

Before going to production, ensure:

- [ ] **HTTPS configured**: SSL certificate installed and HTTPS binding added
- [ ] **HTTP to HTTPS redirect**: Optional but recommended
- [ ] **Custom domain configured**: If not using localhost
- [ ] **Error pages configured**: Custom 404/500 error pages
- [ ] **Monitoring setup**: IIS logs and application monitoring
- [ ] **Backup plan**: Backup of dist folder and configuration

## Need Help?

If you're still experiencing issues after following this checklist:

1. Check IIS logs at: `C:\inetpub\logs\LogFiles\`
2. Check Windows Event Viewer for IIS errors
3. Refer to [IIS_DEPLOYMENT.md](./IIS_DEPLOYMENT.md) for detailed instructions
4. Consult the [README.md](./README.md) for project-specific information

## Automated Validation Script (PowerShell)

You can run this PowerShell script on your IIS server to validate the setup:

```powershell
# Run as Administrator
Write-Host "Checking IIS Configuration..." -ForegroundColor Green

# Check if URL Rewrite Module is installed
$rewriteModule = Get-WindowsFeature -Name Web-Server | Get-WindowsFeature -Name Web-Url-Rewrite
if ($rewriteModule.Installed) {
    Write-Host "✓ URL Rewrite Module is installed" -ForegroundColor Green
} else {
    Write-Host "✗ URL Rewrite Module is NOT installed" -ForegroundColor Red
    Write-Host "  Download from: https://www.iis.net/downloads/microsoft/url-rewrite" -ForegroundColor Yellow
}

# Check if web.config exists in dist
$webConfigPath = ".\dist\web.config"
if (Test-Path $webConfigPath) {
    Write-Host "✓ web.config found in dist folder" -ForegroundColor Green
} else {
    Write-Host "✗ web.config NOT found in dist folder" -ForegroundColor Red
    Write-Host "  Run 'npm run build' to generate it" -ForegroundColor Yellow
}

Write-Host "`nValidation complete!" -ForegroundColor Green
```

Save this as `validate-iis-setup.ps1` and run it in the project directory.
