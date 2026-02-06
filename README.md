# BridgeX Frontend

A React-based single-page application (SPA) for BridgeX, built with Vite, React Router, and Tailwind CSS.

## Features

- 🎨 Modern UI with Tailwind CSS and shadcn/ui components
- 🚀 Fast development with Vite
- 🔄 Client-side routing with React Router
- 📱 Responsive design
- 👤 Admin dashboard with waitlist management
- 🎯 Landing page with early access signup

## Development

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### IIS Deployment

This application is configured for deployment to IIS (Internet Information Services). See [IIS_DEPLOYMENT.md](./IIS_DEPLOYMENT.md) for detailed instructions.

**Quick Start for IIS:**
1. Install the [URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite) for IIS
2. Build the application: `npm run build`
3. Copy the `dist/` folder to your IIS server
4. Point IIS to the `dist/` folder as the physical path
5. The included `web.config` file handles all necessary configuration

### Other Deployment Options

- **Vercel**: Configured with `vercel.json` - supports automatic deployment
- **GitHub Pages**: Run `npm run deploy` (configured in package.json)
- **Any static hosting**: Build and upload the `dist/` folder

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   └── Logo.jsx       # Logo component
├── pages/             # Page components
│   ├── LandingPage.jsx
│   └── AdminDashboard.jsx
├── lib/               # Utilities and configuration
│   ├── api.js         # API configuration
│   └── utils.js       # Helper functions
├── App.jsx            # Main app component with routing
└── main.jsx           # Application entry point
```

## Configuration

### Vite Configuration

See `vite.config.js` for build configuration. The app uses path aliases (`@/`) for cleaner imports.

### Environment Variables

Create a `.env` file for local development (see `.env.example` if available).

## Troubleshooting

### ASP.NET Core Error on IIS

If you see "Managed handler is used; however, ASP.NET is not installed", this means:
- The `web.config` file is missing or not in the root of your IIS site
- The URL Rewrite Module is not installed on your IIS server
- See [IIS_DEPLOYMENT.md](./IIS_DEPLOYMENT.md) for the complete solution

### Dependency Installation Issues

If you encounter peer dependency conflicts, use:
```bash
npm install --legacy-peer-deps
```

## License

[Your License Here]

## Support

For deployment issues or questions, please refer to:
- [IIS Deployment Guide](./IIS_DEPLOYMENT.md)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
