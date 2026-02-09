# PowerShell build script for production deployment

Write-Host "Building PDF Revision Scheduler for production..." -ForegroundColor Cyan

# Build backend
Write-Host "`nBuilding backend..." -ForegroundColor Yellow
Set-Location backend
npm install
npm run build
npm run generate
Write-Host "Backend build complete!" -ForegroundColor Green

# Build frontend
Write-Host "`nBuilding frontend..." -ForegroundColor Yellow
Set-Location ../frontend
npm install
npm run build
Write-Host "Frontend build complete!" -ForegroundColor Green

Set-Location ..

Write-Host "`n✅ Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend: backend/dist/" -ForegroundColor Cyan
Write-Host "Frontend: frontend/dist/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Set up environment variables (see .env.production.example files)"
Write-Host "2. Deploy backend and frontend to your chosen platform"
Write-Host "3. See DEPLOYMENT.md for detailed instructions"
