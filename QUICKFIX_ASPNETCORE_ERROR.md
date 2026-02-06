# Quick Fix: AspNetCoreModuleV2 Error

## Error Message
```
HTTP Error 500.21 - Internal Server Error
Handler "aspNetCore" has a bad module "AspNetCoreModuleV2" in its module list
```

## Why This Error Occurs

**This is NOT an ASP.NET Core application!** This is a React/JavaScript frontend application that should be deployed as a static website.

The error occurs because IIS is trying to use the ASP.NET Core module, which is completely unnecessary for this application.

## Quick Fix (3 Steps)

### 1. Install URL Rewrite Module (Required)
Download and install: https://www.iis.net/downloads/microsoft/url-rewrite

### 2. Run the Setup Script (Automated)
Open PowerShell as Administrator and run:
```powershell
cd C:\path\to\DebridgeTestFrontend
.\setup-iis.ps1
```

This script will:
- ✓ Configure IIS correctly for static content
- ✓ Remove AspNetCoreModuleV2 references
- ✓ Set up URL rewriting for React Router
- ✓ Create the website on port 8080

### 3. Test
Browse to: http://localhost:8080

## Manual Fix (If Script Doesn't Work)

### Step 1: Build the Application
```bash
npm run build
```

### Step 2: Remove AspNetCore Handler
1. Open IIS Manager
2. Select your website
3. Double-click "Handler Mappings"
4. Find and REMOVE any handler named "aspNetCore"
5. Click "Apply"

### Step 3: Configure Application Pool
1. In IIS Manager, go to Application Pools
2. Select your application pool
3. Click "Basic Settings"
4. Set ".NET CLR Version" to "No Managed Code"
5. Click OK

### Step 4: Update Physical Path
1. Select your website in IIS
2. Click "Basic Settings"
3. Ensure Physical Path points to the `dist` folder
   - Example: `C:\Users\YourName\Documents\DebridgeTestFrontend\dist`
   - NOT the project root!
4. Click OK

### Step 5: Verify web.config
Ensure `web.config` exists in your `dist` folder. It should contain:
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <clear />
      <add name="StaticFile" path="*" verb="*" 
           modules="StaticFileModule,DefaultDocumentModule,DirectoryListingModule" 
           resourceType="Either" requireAccess="Read" />
    </handlers>
    <!-- ... more configuration ... -->
  </system.webServer>
</configuration>
```

### Step 6: Restart IIS
```powershell
iisreset
```

## What NOT to Do

❌ Do NOT install ASP.NET Core Hosting Bundle
❌ Do NOT try to configure AspNetCoreModuleV2
❌ Do NOT set .NET CLR version to anything other than "No Managed Code"
❌ Do NOT point IIS to the project root (must use the `dist` folder)

## What TO Do

✅ Install URL Rewrite Module
✅ Build the application (`npm run build`)
✅ Point IIS to the `dist` folder
✅ Use "No Managed Code" for the application pool
✅ Ensure web.config is in the `dist` folder

## Still Having Issues?

Check these:
1. **Physical Path:** Must point to `dist` folder, not project root
2. **Port Conflict:** Ensure port 8080 is not in use by another application
3. **Permissions:** IIS application pool identity needs read access to the `dist` folder
4. **URL Rewrite:** Must be installed for React Router to work
5. **IIS Logs:** Check `C:\inetpub\logs\LogFiles` for detailed errors

## Need More Help?

See the complete guide: [IIS_DEPLOYMENT.md](./IIS_DEPLOYMENT.md)

## Understanding the Architecture

```
Your Application:
┌─────────────────────────────────────┐
│  React Frontend (JavaScript)         │
│  - Built with Vite                   │
│  - Static HTML/CSS/JS files          │
│  - No server-side code               │
└─────────────────────────────────────┘
              ↓
        IIS serves as
   Static File Web Server
        (like nginx)
```

**NOT:**
```
ASP.NET Core Application:
┌─────────────────────────────────────┐
│  ASP.NET Core Backend (C#)          │
│  - Requires .NET Runtime             │
│  - Uses AspNetCoreModuleV2           │
│  - Server-side code execution        │
└─────────────────────────────────────┘
              ↓
    IIS with ASP.NET Core
      Hosting Bundle
```

This is why AspNetCoreModuleV2 is not needed!
