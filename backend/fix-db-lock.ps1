# PowerShell script to fix database lock issues
Write-Host "Checking for database lock issues..." -ForegroundColor Yellow

# Navigate to backend directory
Set-Location $PSScriptRoot

# Step 1: Check for running Node processes
Write-Host "`nStep 1: Checking for running Node processes..." -ForegroundColor Cyan
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Found $($nodeProcesses.Count) Node process(es) running" -ForegroundColor Red
    Write-Host "Stopping Node processes..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force
    Start-Sleep -Seconds 2
} else {
    Write-Host "No Node processes found running" -ForegroundColor Green
}

# Step 2: Remove lock files
Write-Host "`nStep 2: Removing SQLite lock files..." -ForegroundColor Cyan
$lockFiles = @("dev.db-shm", "dev.db-wal", "dev.db-journal")
foreach ($file in $lockFiles) {
    if (Test-Path $file) {
        Write-Host "Removing $file..." -ForegroundColor Yellow
        Remove-Item $file -Force
    }
}

# Step 3: Check if database exists
Write-Host "`nStep 3: Checking database file..." -ForegroundColor Cyan
if (Test-Path "dev.db") {
    Write-Host "Database file exists" -ForegroundColor Green
} else {
    Write-Host "Database file does not exist (will be created)" -ForegroundColor Yellow
}

# Step 4: Try to run migration
Write-Host "`nStep 4: Attempting to run migration..." -ForegroundColor Cyan
Write-Host "Running: npm run migrate" -ForegroundColor Yellow
npm run migrate

Write-Host "`nDone!" -ForegroundColor Green
