#!/bin/bash
# Script om een release package te maken

set -e

echo "🚀 Creating release package for De Zaanse Plankjes Maffia..."

# Build de applicatie
echo "📦 Building application..."
pnpm build

# Maak release directory
RELEASE_DIR="release-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$RELEASE_DIR"

echo "📁 Copying files to release directory..."

# Kopieer build output
cp -r dist "$RELEASE_DIR/"

# Kopieer data bestanden
mkdir -p "$RELEASE_DIR/server/data"
cp -r server/data/*.json "$RELEASE_DIR/server/data/" 2>/dev/null || true

# Kopieer images
mkdir -p "$RELEASE_DIR/client/public/images"
cp -r client/public/images/* "$RELEASE_DIR/client/public/images/" 2>/dev/null || true

# Kopieer configuratie bestanden
cp package.json "$RELEASE_DIR/"
cp pnpm-lock.yaml "$RELEASE_DIR/"
[ -f .env.example ] && cp .env.example "$RELEASE_DIR/" || echo "# Environment variables template" > "$RELEASE_DIR/.env.example"
[ -f DEPLOYMENT.md ] && cp DEPLOYMENT.md "$RELEASE_DIR/"
[ -f RELEASE.md ] && cp RELEASE.md "$RELEASE_DIR/"

# Maak uploads directory structuur
mkdir -p "$RELEASE_DIR/server/uploads/digital"

# Maak een README voor de release
cat > "$RELEASE_DIR/README.txt" << EOF
De Zaanse Plankjes Maffia - Release Package
===========================================

Build Date: $(date)
Version: 1.0.0

INSTRUCTIES:
============

1. Upload alle bestanden in deze directory naar je server
2. Zie RELEASE.md voor upload instructies
3. Zie DEPLOYMENT.md voor uitgebreide deployment guide

BELANGRIJK:
===========

- Wijzig ADMIN_PASSWORD in .env voordat je naar productie gaat!
- Configureer ALLOWED_ORIGINS met je eigen domain(s)
- Zorg dat server/uploads/digital/ schrijfrechten heeft

STRUCTUUR:
==========

dist/                    - Build output (backend + frontend)
server/data/             - Data bestanden (artworks.json, orders.json)
server/uploads/digital/   - Directory voor digitale uploads
client/public/images/    - Kunstwerk afbeeldingen
package.json             - Dependencies
pnpm-lock.yaml           - Lock file
.env.example             - Environment variables template

EOF

echo "✅ Release package created in: $RELEASE_DIR"
echo ""
echo "📦 Package size:"
du -sh "$RELEASE_DIR"
echo ""
echo "📋 Contents:"
ls -lh "$RELEASE_DIR"
echo ""
echo "🎉 Done! Upload de $RELEASE_DIR directory naar je server."

