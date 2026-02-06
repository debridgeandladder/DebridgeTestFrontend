# PowerShell Script to Configure IIS for DebridgeTestFrontend
# Run this script as Administrator

param(
    [string]$SiteName = "DebridgeTestFrontend",
    [string]$Port = "8080",
    [string]$PhysicalPath = "",
    [switch]$Help
)

function Show-Help {
    Write-Host "IIS Configuration Script for DebridgeTestFrontend" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\setup-iis.ps1 [-SiteName <name>] [-Port <port>] [-PhysicalPath <path>]"
    Write-Host ""
    Write-Host "Parameters:" -ForegroundColor Yellow
    Write-Host "  -SiteName      : Name of the IIS site (default: DebridgeTestFrontend)"
    Write-Host "  -Port          : Port number for the site (default: 8080)"
    Write-Host "  -PhysicalPath  : Full path to the dist folder (default: current directory\dist)"
    Write-Host "  -Help          : Show this help message"
    Write-Host ""
    Write-Host "Example:" -ForegroundColor Yellow
    Write-Host "  .\setup-iis.ps1 -SiteName 'MyApp' -Port 80 -PhysicalPath 'C:\Projects\MyApp\dist'"
    exit
}

if ($Help) {
    Show-Help
}

# Check if running as Administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

# Import IIS module
Import-Module WebAdministration -ErrorAction Stop

# Set default physical path if not provided
if ([string]::IsNullOrEmpty($PhysicalPath)) {
    $PhysicalPath = Join-Path $PSScriptRoot "dist"
}

# Verify physical path exists
if (-not (Test-Path $PhysicalPath)) {
    Write-Host "ERROR: Physical path does not exist: $PhysicalPath" -ForegroundColor Red
    Write-Host "Please build the application first using: npm run build" -ForegroundColor Yellow
    exit 1
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "IIS Configuration for DebridgeTestFrontend" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if URL Rewrite Module is installed
Write-Host "[1/6] Checking URL Rewrite Module..." -ForegroundColor Yellow
$urlRewriteInstalled = Test-Path "HKLM:\SOFTWARE\Microsoft\IIS Extensions\URL Rewrite"

if (-not $urlRewriteInstalled) {
    Write-Host "WARNING: URL Rewrite Module is not installed" -ForegroundColor Red
    Write-Host "Download it from: https://www.iis.net/downloads/microsoft/url-rewrite" -ForegroundColor Yellow
    Write-Host "The application will work but React Router may not function correctly" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne 'y') {
        exit 1
    }
} else {
    Write-Host "URL Rewrite Module is installed ✓" -ForegroundColor Green
}

# Step 2: Create Application Pool
Write-Host ""
Write-Host "[2/6] Creating/Configuring Application Pool..." -ForegroundColor Yellow
$appPoolName = "${SiteName}AppPool"

if (Test-Path "IIS:\AppPools\$appPoolName") {
    Write-Host "Application Pool '$appPoolName' already exists, updating configuration..." -ForegroundColor Yellow
    Remove-WebAppPool -Name $appPoolName -ErrorAction SilentlyContinue
}

$appPool = New-WebAppPool -Name $appPoolName
$appPool.managedRuntimeVersion = ''
$appPool.managedPipelineMode = 'Integrated'
$appPool | Set-Item

Write-Host "Application Pool created: $appPoolName ✓" -ForegroundColor Green
Write-Host "  - .NET CLR Version: No Managed Code (Static content only)" -ForegroundColor Gray

# Step 3: Remove existing site if it exists
Write-Host ""
Write-Host "[3/6] Checking for existing site..." -ForegroundColor Yellow
if (Test-Path "IIS:\Sites\$SiteName") {
    Write-Host "Site '$SiteName' already exists, removing..." -ForegroundColor Yellow
    Remove-Website -Name $SiteName
    Write-Host "Existing site removed ✓" -ForegroundColor Green
}

# Step 4: Create new website
Write-Host ""
Write-Host "[4/6] Creating IIS Website..." -ForegroundColor Yellow
$site = New-Website -Name $SiteName `
    -PhysicalPath $PhysicalPath `
    -ApplicationPool $appPoolName `
    -Port $Port

Write-Host "Website created: $SiteName ✓" -ForegroundColor Green
Write-Host "  - Physical Path: $PhysicalPath" -ForegroundColor Gray
Write-Host "  - Port: $Port" -ForegroundColor Gray
Write-Host "  - Application Pool: $appPoolName" -ForegroundColor Gray

# Step 5: Verify web.config exists
Write-Host ""
Write-Host "[5/6] Verifying web.config..." -ForegroundColor Yellow
$webConfigPath = Join-Path $PhysicalPath "web.config"

if (Test-Path $webConfigPath) {
    Write-Host "web.config found ✓" -ForegroundColor Green
} else {
    Write-Host "WARNING: web.config not found in dist folder" -ForegroundColor Red
    Write-Host "Expected location: $webConfigPath" -ForegroundColor Yellow
    Write-Host "The site may not work correctly without web.config" -ForegroundColor Yellow
}

# Step 6: Start the website
Write-Host ""
Write-Host "[6/6] Starting website..." -ForegroundColor Yellow
Start-Website -Name $SiteName
Write-Host "Website started ✓" -ForegroundColor Green

# Display summary
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Configuration Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Site Details:" -ForegroundColor Yellow
Write-Host "  - Name: $SiteName"
Write-Host "  - URL: http://localhost:$Port"
Write-Host "  - Physical Path: $PhysicalPath"
Write-Host "  - Application Pool: $appPoolName (No Managed Code)"
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Open your browser and navigate to: http://localhost:$Port"
Write-Host "  2. If you see errors, check the IIS logs at: C:\inetpub\logs\LogFiles"
Write-Host "  3. Review the troubleshooting guide in IIS_DEPLOYMENT.md"
Write-Host ""
Write-Host "Important Notes:" -ForegroundColor Yellow
Write-Host "  - This is a STATIC website (no ASP.NET Core runtime needed)"
Write-Host "  - Do NOT install ASP.NET Core Hosting Bundle"
Write-Host "  - Do NOT use AspNetCoreModuleV2"
Write-Host "  - URL Rewrite Module is recommended for React Router support"
Write-Host ""

# Optional: Open browser
$openBrowser = Read-Host "Open browser now? (y/n)"
if ($openBrowser -eq 'y') {
    Start-Process "http://localhost:$Port"
}

Write-Host ""
Write-Host "Setup completed successfully!" -ForegroundColor Green
