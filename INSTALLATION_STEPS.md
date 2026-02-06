# 🚀 Installation Steps - Fix AspNetCoreModuleV2 Error

## Quick Summary
Your application is a **React frontend** (not ASP.NET Core), so you need to configure IIS as a **static file server**.

---

## ⚡ Fast Track (3 Steps)

### Step 1: Install URL Rewrite Module ⏱️ 2 minutes
1. Download: https://www.iis.net/downloads/microsoft/url-rewrite
2. Run the installer
3. Restart IIS:
   ```powershell
   iisreset
   ```

### Step 2: Build Your Application ⏱️ 1 minute
```bash
cd C:\Users\Lateef.Adewumi\Documents\credit360\product
npm install --legacy-peer-deps
npm run build
```

### Step 3: Run Setup Script ⏱️ 1 minute
```powershell
# Open PowerShell as Administrator
cd C:\Users\Lateef.Adewumi\Documents\credit360\product
.\setup-iis.ps1
```

**Done!** Browse to http://localhost:8080

---

## 📋 What the Setup Script Does

✅ Checks for URL Rewrite Module  
✅ Creates Application Pool with "No Managed Code"  
✅ Creates IIS Website pointing to `dist` folder  
✅ Configures static file serving  
✅ Removes AspNetCore handlers  
✅ Validates web.config  
✅ Starts the website  

---

## 🔍 Manual Setup (If Automated Fails)

### 1. Build Application
```bash
npm run build
```

### 2. Open IIS Manager
- Press `Win + R`
- Type `inetmgr`
- Press Enter

### 3. Remove AspNetCore Handler
- Select your site
- Double-click "Handler Mappings"
- Find "aspNetCore" handler
- Right-click → Remove
- Click "Yes" to confirm

### 4. Create New Site
- Right-click "Sites" → "Add Website"
- **Site name:** DebridgeTestFrontend
- **Physical path:** `C:\Users\Lateef.Adewumi\Documents\credit360\product\dist`
- **Port:** 8080
- Click OK

### 5. Configure Application Pool
- Go to "Application Pools"
- Select your pool
- Click "Basic Settings"
- Set ".NET CLR Version" to **"No Managed Code"**
- Click OK

### 6. Restart IIS
```powershell
iisreset
```

### 7. Test
- Open browser
- Go to http://localhost:8080
- Application should load without errors

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Application loads at http://localhost:8080
- [ ] No AspNetCoreModuleV2 error
- [ ] No 404 errors when navigating
- [ ] CSS and JavaScript load correctly
- [ ] Images display properly
- [ ] React Router navigation works

---

## ❓ Troubleshooting

### Error: "Cannot GET /"
**Solution:** Ensure IIS points to the `dist` folder, not project root

### Error: 404 on navigation
**Solution:** Install URL Rewrite Module (Step 1)

### Error: Still seeing AspNetCore error
**Solution:** Manually remove aspNetCore handler (Manual Setup Step 3)

### Error: Permission denied
**Solution:** Run PowerShell as Administrator

### Error: Port 8080 already in use
**Solution:** Change port in setup script:
```powershell
.\setup-iis.ps1 -Port 8090
```

---

## 📚 More Help

- **Full Guide:** [IIS_DEPLOYMENT.md](./IIS_DEPLOYMENT.md)
- **Quick Reference:** [QUICKFIX_ASPNETCORE_ERROR.md](./QUICKFIX_ASPNETCORE_ERROR.md)
- **Complete Solution:** [SOLUTION_SUMMARY.md](./SOLUTION_SUMMARY.md)

---

## 🎯 Key Points to Remember

### ❌ Don't Do This
- ❌ Install ASP.NET Core Hosting Bundle
- ❌ Use AspNetCoreModuleV2
- ❌ Configure as .NET application
- ❌ Point IIS to project root

### ✅ Do This Instead
- ✅ Install URL Rewrite Module
- ✅ Use StaticFileModule
- ✅ Set "No Managed Code"
- ✅ Point IIS to `dist` folder

---

## 🏗️ Architecture

```
Your Setup (React Frontend):
┌────────────────────────┐
│   React Application    │  Built with npm run build
│   (Static Files)       │  
└────────────────────────┘
           ↓
    ┌──────────────┐
    │     IIS      │  Serves static files
    │  (Web Server)│  Like Apache/Nginx
    └──────────────┘
           ↓
    User's Browser

NOT This (ASP.NET Core):
┌────────────────────────┐
│  ASP.NET Core Backend  │  Requires .NET Runtime
│  (C# Application)      │  Uses AspNetCoreModuleV2
└────────────────────────┘
```

---

## 🆘 Need More Help?

1. Check IIS logs: `C:\inetpub\logs\LogFiles`
2. Verify web.config: `dist\web.config` must exist
3. Review detailed guide: `IIS_DEPLOYMENT.md`
4. Check application pool is running
5. Ensure correct physical path

---

**Remember:** This is a JavaScript/React app, not a .NET app! 🎯
