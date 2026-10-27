#!/bin/bash
set -e

echo "=== Fit Code verification ==="
echo "Test command: node verify.mjs"

node --check app.js
node --check data.js
node --check api/meal-plan.mjs
node --check dev-server.mjs

node verify.mjs

echo ""
echo "=== Structural score ==="
node ../.harness/validate.mjs --target . --min-score 70

echo ""
echo "=== Verification complete ==="
echo "Run node dev-server.mjs and open http://127.0.0.1:4173"
