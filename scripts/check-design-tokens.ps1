# Prevent dark-mode regressions: forbid bg-white outside hero light section
# Allowlist: hero badge (light hero bg) — marked with hero-badge
$pattern = 'bg-white'
$allowPattern = 'hero-badge'
$files = Get-ChildItem -Path "src" -Recurse -Include *.tsx,*.ts -File
$violations = @()
foreach ($f in $files) {
  $hits = Select-String -Path $f.FullName -Pattern $pattern -ErrorAction SilentlyContinue
  foreach ($h in $hits) {
    if ($h.Line -match $allowPattern) { continue }
    # also allow in comments
    if ($h.Line.Trim().StartsWith("//") -or $h.Line.Trim().StartsWith("*")) { continue }
    $violations += "$($f.FullName):$($h.LineNumber): $($h.Line.Trim())"
  }
}
if ($violations.Count -gt 0) {
  Write-Host "DESIGN TOKEN VIOLATION: found bg-white outside allowlist (use bg-[var(--card)] instead):" -ForegroundColor Red
  $violations | ForEach-Object { Write-Host $_ -ForegroundColor Red }
  Write-Host "Fix: replace bg-white with bg-[var(--card)] and text with text-[var(--card-foreground)] or text-[var(--primary-foreground)] for primary pills." -ForegroundColor Yellow
  exit 1
} else {
  Write-Host "tokens ok - no bg-white outside hero-badge allowlist" -ForegroundColor Green
}
