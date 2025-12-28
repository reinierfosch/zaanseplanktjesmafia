#!/bin/bash
# SSH connection script for Hostinger server

HOST="46.202.156.148"
PORT="65002"
USER="u127066462"
PASS="uy4282o398ru23jd238hr28*G"

echo "Connecting to $USER@$HOST:$PORT..."
echo ""

# Try to connect and run commands
ssh -o StrictHostKeyChecking=no -p $PORT $USER@$HOST << 'EOF'
echo "=== System Information ==="
pwd
whoami
echo ""
echo "=== Home Directory Contents ==="
ls -la
echo ""
echo "=== Disk Space ==="
df -h
echo ""
echo "=== Node.js Version ==="
node --version 2>/dev/null || echo "Node.js not found"
echo ""
echo "=== NPM/Pnpm Version ==="
npm --version 2>/dev/null || echo "NPM not found"
pnpm --version 2>/dev/null || echo "PNPM not found"
echo ""
echo "=== Environment Variables ==="
env | grep -E "(NODE|DB_|SMTP_|PORT)" | head -20
echo ""
echo "=== Find Application Directory ==="
find ~ -maxdepth 3 -name "package.json" -o -name "dist" -type d 2>/dev/null | head -10
echo ""
echo "=== Check for .env files ==="
find ~ -maxdepth 3 -name ".env*" 2>/dev/null
echo ""
echo "=== Check for Node.js processes ==="
ps aux | grep node | grep -v grep || echo "No Node.js processes running"
EOF

