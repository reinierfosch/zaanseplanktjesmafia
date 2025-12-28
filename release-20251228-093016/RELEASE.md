# Release Versie - De Zaanse Plankjes Maffia

## ✅ Build Status

De release versie is succesvol gebouwd!

## 📦 Wat is Inbegrepen

### Build Output (`dist/`)
- ✅ `dist/index.js` - Backend server (Express)
- ✅ `dist/public/` - Frontend build (React + Vite)
  - `index.html`
  - `assets/` - Gecompileerde CSS en JavaScript
  - `images/` - Alle kunstwerk afbeeldingen

### Data Bestanden
- ✅ `server/data/artworks.json` - Kunstwerken database
- ✅ `server/data/orders.json` - Bestellingen database

### Configuratie
- ✅ `package.json` - Dependencies
- ✅ `pnpm-lock.yaml` - Lock file
- ✅ `.env.example` - Environment variables template

## 🚀 Upload Instructies

### Stap 1: Upload Bestanden

Upload de volgende mappen/bestanden naar je server:

```
📁 dist/                    → /opt/plankjes-maffia/dist/
📁 server/data/             → /opt/plankjes-maffia/server/data/
📁 server/uploads/          → /opt/plankjes-maffia/server/uploads/ (als bestaat)
📁 client/public/images/    → /opt/plankjes-maffia/client/public/images/
📄 package.json             → /opt/plankjes-maffia/package.json
📄 pnpm-lock.yaml           → /opt/plankjes-maffia/pnpm-lock.yaml
📄 .env.example             → /opt/plankjes-maffia/.env.example
```

### Stap 2: Server Setup

```bash
# 1. Ga naar de server directory
cd /opt/plankjes-maffia

# 2. Installeer dependencies
pnpm install --prod

# 3. Maak .env bestand
cp .env.example .env
nano .env  # Wijzig ADMIN_PASSWORD en ALLOWED_ORIGINS

# 4. Maak directories
mkdir -p server/uploads/digital
chmod 755 server/uploads/digital

# 5. Start server
NODE_ENV=production node dist/index.js
```

### Stap 3: Verifieer

1. Test health endpoint: `http://your-server:3000/health`
2. Test homepage: `http://your-server:3000/`
3. Test admin login: `http://your-server:3000/admin` (wachtwoord: zie .env)

## 📋 Checklist voor Productie

- [ ] `.env` bestand aangemaakt met productie waarden
- [ ] `ADMIN_PASSWORD` gewijzigd van standaard waarde
- [ ] `ALLOWED_ORIGINS` geconfigureerd met je domain(s)
- [ ] `server/uploads/digital/` directory bestaat en heeft schrijfrechten
- [ ] Alle images gekopieerd naar `client/public/images/`
- [ ] Data bestanden (`artworks.json`, `orders.json`) aanwezig
- [ ] Reverse proxy (Nginx) geconfigureerd (zie DEPLOYMENT.md)
- [ ] SSL certificaat geïnstalleerd
- [ ] Firewall geconfigureerd
- [ ] Backups ingesteld

## 🔒 Security

**BELANGRIJK:**
- Wijzig `ADMIN_PASSWORD` in `.env` voordat je naar productie gaat!
- Zorg dat `.env` niet publiek toegankelijk is
- Gebruik HTTPS in productie
- Configureer CORS correct met `ALLOWED_ORIGINS

## 📖 Meer Informatie

Zie `DEPLOYMENT.md` voor uitgebreide deployment instructies.

## 🐛 Troubleshooting

### Server start niet
- Check logs: `pm2 logs` of `journalctl -u plankjes-maffia`
- Verifieer `.env` bestand
- Check poort beschikbaarheid: `netstat -tulpn | grep 3000`

### Images laden niet
- Verifieer dat images in `client/public/images/` staan
- Check file permissions
- Check Nginx configuratie

### Uploads werken niet
- Check `server/uploads/digital/` permissions
- Check Nginx `client_max_body_size` (minimaal 50M)

## 📞 Support

Voor vragen: info@plankjesmaffia.nl

---

**Build Datum:** $(date)
**Versie:** 1.0.0
**Node.js:** 18+
**pnpm:** 10+

