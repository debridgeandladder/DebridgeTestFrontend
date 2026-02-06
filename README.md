# DebridgeTestFrontend

A modern React + Vite frontend application for BridgeX platform.

## Quick Start

### Development

```bash
# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### IIS Deployment (Windows Server)

**⚠️ Important:** This is a static React application, NOT an ASP.NET Core application.

If you're seeing an error about AspNetCoreModuleV2, please see the [IIS Deployment Guide](./IIS_DEPLOYMENT.md) for detailed instructions.

**Quick Setup:**
1. Install [URL Rewrite Module for IIS](https://www.iis.net/downloads/microsoft/url-rewrite)
2. Build the application: `npm run build`
3. Run the PowerShell script as Administrator:
   ```powershell
   .\setup-iis.ps1 -SiteName "YourSiteName" -Port 8080
   ```
4. Browse to `http://localhost:8080`

For detailed troubleshooting and manual configuration steps, see [IIS_DEPLOYMENT.md](./IIS_DEPLOYMENT.md).

### Other Deployment Options

- **Vercel:** `npm run deploy` (configured in package.json)
- **Node.js:** `npx serve -s dist -l 8080`
- **GitHub Pages:** Pre-configured for this repository

## Technology Stack

- **Framework:** React 19
- **Build Tool:** Vite 6.3
- **UI Library:** Radix UI + Tailwind CSS
- **Router:** React Router DOM v7
- **Package Manager:** PNPM

## Project Structure

```
├── dist/              # Production build output (for IIS deployment)
├── public/            # Static assets
├── src/               # Source code
│   ├── components/    # React components
│   ├── pages/         # Page components
│   └── main.jsx       # Application entry point
├── IIS_DEPLOYMENT.md  # IIS deployment guide
├── setup-iis.ps1      # IIS setup script
└── package.json       # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## License

Private repository - All rights reserved

## Support

For deployment issues, especially IIS-related problems, consult [IIS_DEPLOYMENT.md](./IIS_DEPLOYMENT.md).
