# init.ps1 - Windows verification entrypoint for the Fit Code prototype.
#
# Fails fast. Runs the same checks as ./init.sh.

$ErrorActionPreference = 'Stop'

Write-Host '=== Fit Code verification ==='
Write-Host 'Test command: node verify.mjs'

node --check app.js
if ($LASTEXITCODE -ne 0) { throw "app.js failed syntax check" }

node --check data.js
if ($LASTEXITCODE -ne 0) { throw "data.js failed syntax check" }

node --check api/meal-plan.mjs
if ($LASTEXITCODE -ne 0) { throw "api/meal-plan.mjs failed syntax check" }

node --check dev-server.mjs
if ($LASTEXITCODE -ne 0) { throw "dev-server.mjs failed syntax check" }

node verify.mjs
if ($LASTEXITCODE -ne 0) { throw "verify.mjs failed" }

Write-Host ''
Write-Host '=== Structural score ==='
node ..\.harness\validate.mjs --target . --min-score 70
if ($LASTEXITCODE -ne 0) { throw "structural validation failed" }

Write-Host ''
Write-Host '=== Verification complete ==='
Write-Host 'Run node dev-server.mjs and open http://127.0.0.1:4173'
