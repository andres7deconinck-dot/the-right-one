# GlutenGo — Deploy to Lovable
# Gebruik: .\deploy.ps1
# Of met bericht: .\deploy.ps1 -message "Wat je hebt gewijzigd"

param(
  [string]$message = ""
)

$git = "C:\Users\andre\AppData\Local\GitHubDesktop\app-3.5.8\resources\app\git\cmd\git.exe"
$projectDir = "c:\Users\andre\OneDrive\Documenten\GitHub\gluten-free-wander"

Set-Location $projectDir

# Check if there are changes
$status = & $git status --short
if (-not $status) {
  Write-Host "Geen wijzigingen gevonden." -ForegroundColor Yellow
  exit 0
}

Write-Host "Wijzigingen gevonden:" -ForegroundColor Cyan
Write-Host $status

# Build commit message
if (-not $message) {
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
  $message = "Update: $timestamp"
}

# Stage all
& $git add -A

# Commit
& $git commit -m $message
if ($LASTEXITCODE -ne 0) { Write-Host "Commit mislukt." -ForegroundColor Red; exit 1 }

# Push to origin (backup)
Write-Host "`nPush naar GitHub (gluten-free-wander)..." -ForegroundColor Cyan
& $git push origin main
if ($LASTEXITCODE -ne 0) { Write-Host "Push naar origin mislukt." -ForegroundColor Red; exit 1 }

# Push to Lovable (glutengo v2)
Write-Host "Push naar Lovable (glutengo/v2)..." -ForegroundColor Cyan
& $git push lovable main:v2 --force
if ($LASTEXITCODE -ne 0) { Write-Host "Push naar Lovable mislukt." -ForegroundColor Red; exit 1 }

Write-Host "`nKlaar! Lovable deployt automatisch." -ForegroundColor Green
