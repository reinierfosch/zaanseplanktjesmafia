De Zaanse Plankjes Maffia - Release Package
===========================================

Build Date: Sun Dec 28 09:30:16 CET 2025
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

