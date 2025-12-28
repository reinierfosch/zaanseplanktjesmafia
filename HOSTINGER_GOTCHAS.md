# Hostinger Deployment Gotchas & Best Practices

## ⚠️ Kritieke Gotchas voor Node.js Deployment

### 1. **Node.js App Configuration in hPanel**

**GOTCHA**: Hostinger vereist specifieke configuratie in hPanel voor Node.js apps.

**Oplossing**:
- Ga naar **hPanel → Node.js Apps**
- Maak een nieuwe Node.js app aan
- **Start Command**: `node dist/index.js` (of `NODE_ENV=production node dist/index.js`)
- **Port**: Hostinger wijst automatisch een poort toe (NIET 3000!)
- **Environment Variables**: Voeg alle `.env` variabelen toe via hPanel interface
- **Root Directory**: Stel in op de root van je project (waar `dist/` staat)

**BELANGRIJK**: 
- Gebruik de poort die Hostinger toewijst (check in hPanel)
- De poort wordt automatisch doorgegeven via `process.env.PORT`
- Je app luistert op `0.0.0.0`, niet `localhost`!

---

### 2. **File Upload Size Limits**

**GOTCHA**: Hostinger heeft standaard upload limits die lager kunnen zijn dan je verwacht.

**Limits**:
- **PHP upload_max_filesize**: Standaard 2MB (kan verhoogd worden)
- **Nginx client_max_body_size**: Check in server config
- **Node.js**: Je eigen multer limit (50MB) kan groter zijn dan server limit

**Oplossing**:
1. Check Hostinger documentatie voor exacte limits
2. Als je `.htaccess` kunt gebruiken, voeg toe:
   ```apache
   php_value upload_max_filesize 50M
   php_value post_max_size 50M
   ```
3. Voor Nginx (als je toegang hebt):
   ```nginx
   client_max_body_size 50M;
   ```
4. **Fallback**: Verlaag je multer limit naar 10MB als 50MB niet werkt

**Test**: Upload een groot bestand (bijv. 20MB) om te verifiëren.

---

### 3. **MySQL Database Connection**

**GOTCHA**: MySQL host is NIET altijd `localhost` op shared hosting!

**Oplossing**:
- **Check hPanel → Databases** voor de exacte hostname
- Meestal: `localhost` of `127.0.0.1`
- Soms: `mysql.hostinger.com` of specifieke hostname
- **Port**: Meestal `3306`, maar check in hPanel
- **Database naam**: Vaak met prefix (bijv. `u123456789_plankjes`)

**Environment Variables**:
```env
DB_HOST=localhost  # Check in hPanel!
DB_PORT=3306
DB_USER=u123456789_admin  # Check in hPanel!
DB_PASSWORD=je_wachtwoord
DB_NAME=u123456789_plankjes  # Check in hPanel!
```

**Test**: Test de database connectie direct na setup:
```bash
mysql -h localhost -u DB_USER -p DB_NAME
```

---

### 4. **File Permissions**

**GOTCHA**: File permissions kunnen problemen veroorzaken met uploads en writes.

**Oplossing**:
```bash
# Uploads directory moet schrijfbaar zijn
chmod 755 server/uploads/digital
chmod 644 server/uploads/digital/*

# Data directory (voor JSON fallback)
chmod 755 server/data
chmod 644 server/data/*.json

# Images directory
chmod 755 client/public/images
chmod 644 client/public/images/*
```

**Check**: Na upload, test of je bestanden kunt schrijven:
```bash
touch server/uploads/digital/test.txt
rm server/uploads/digital/test.txt
```

---

### 5. **Path Resolution in Production**

**GOTCHA**: `__dirname` werkt anders in gebundelde code (TypeScript → JavaScript).

**Oplossing**: 
✅ **AL GEFIXT** in `server/lib/artworkService.ts` en `server/index.ts`:
```typescript
const BASE_DIR = process.env.NODE_ENV === "production" 
  ? path.resolve(__dirname, "..")
  : __dirname;
```

**Verifieer**: Test dat uploads werken na deployment.

---

### 6. **Environment Variables**

**GOTCHA**: `.env` bestanden worden NIET automatisch geladen op Hostinger!

**Oplossing**:
1. **Via hPanel**: Voeg environment variables toe in Node.js app configuratie
2. **Via `.env`**: Zorg dat je `.env` in de root staat (niet in `dist/`)
3. **Load expliciet**: Gebruik `dotenv` package (al geïnstalleerd)

**Check**: Log alle env vars bij startup (zonder gevoelige data):
```typescript
console.log("Environment:", {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST ? "SET" : "MISSING",
  // etc.
});
```

---

### 7. **Static File Serving**

**GOTCHA**: Express static middleware kan traag zijn voor grote bestanden.

**Oplossing**:
1. **Optie 1**: Serve static files via Nginx/Apache (als beschikbaar)
2. **Optie 2**: Gebruik CDN voor images (Cloudflare, etc.)
3. **Optie 3**: Houd Express static, maar optimaliseer caching

**Nginx configuratie** (als je toegang hebt):
```nginx
location /images/ {
    alias /path/to/client/public/images/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

---

### 8. **Inode Limit (600,000)**

**GOTCHA**: `node_modules` kan duizenden bestanden bevatten!

**Oplossing**:
- ✅ **AL GEDAAN**: `node_modules` wordt NIET geüpload in release
- ✅ **Production build**: Alleen `dist/` en dependencies worden geüpload
- **Check**: Tel bestanden na upload:
  ```bash
  find . -type f | wc -l
  ```

**Schatting**:
- Release package: ~100-200 bestanden
- Met `node_modules` (na `pnpm install --prod`): ~5,000-10,000 bestanden
- **Status**: ✅ Veel ruimte over (600,000 limit)

---

### 9. **Subdomain Setup**

**GOTCHA**: Subdomains moeten handmatig worden geconfigureerd in hPanel.

**Oplossing**:
1. Ga naar **hPanel → Domains → Subdomains**
2. Maak subdomains aan:
   - `admin.plankjesmaffia.nl`
   - `staging.plankjesmaffia.nl`
   - `api.plankjesmaffia.nl`
3. **DNS**: Wacht 24-48 uur voor DNS propagatie
4. **Routing**: Je Express app detecteert subdomains automatisch (al geïmplementeerd)

**Test**: 
```bash
curl -H "Host: admin.plankjesmaffia.nl" http://your-server/
```

---

### 10. **SMTP Email Configuration**

**GOTCHA**: Hostinger SMTP instellingen kunnen verschillen van standaard.

**Oplossing**:
- **Check hPanel → Email → SMTP Settings**
- **Host**: Meestal `smtp.hostinger.com` of `smtp.titan.email`
- **Port**: `587` (TLS) of `465` (SSL)
- **Security**: `SMTP_SECURE=true` voor port 465, `false` voor 587

**Environment Variables**:
```env
SMTP_HOST=smtp.hostinger.com  # Check in hPanel!
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@plankjesmaffia.nl
SMTP_PASSWORD=je_email_wachtwoord
SMTP_FROM=info@plankjesmaffia.nl
```

**Test**: Stuur een test email na configuratie.

---

### 11. **Process Management**

**GOTCHA**: Node.js apps kunnen crashen zonder process manager.

**Oplossing**:
- **Hostinger hPanel**: Heeft ingebouwde process management
- **PM2**: Als je SSH toegang hebt, installeer PM2:
  ```bash
  npm install -g pm2
  pm2 start dist/index.js --name plankjes-maffia
  pm2 startup
  pm2 save
  ```

**Check**: Verifieer dat je app automatisch herstart na crash.

---

### 12. **CORS Configuration**

**GOTCHA**: CORS moet exacte domains bevatten, inclusief subdomains.

**Oplossing**:
```env
ALLOWED_ORIGINS=https://plankjesmaffia.nl,https://www.plankjesmaffia.nl,https://admin.plankjesmaffia.nl,https://staging.plankjesmaffia.nl
```

**Test**: Test API calls vanaf verschillende domains.

---

### 13. **SSL/HTTPS**

**GOTCHA**: HTTPS is verplicht voor productie (CORS, cookies, etc.).

**Oplossing**:
- **Hostinger**: Biedt gratis SSL certificaten (Let's Encrypt)
- **Activeren**: Ga naar **hPanel → SSL → Free SSL**
- **Auto-renewal**: Zorg dat auto-renewal is ingeschakeld

**Check**: Test dat HTTPS werkt:
```bash
curl -I https://plankjesmaffia.nl
```

---

### 14. **Database Connection Pooling**

**GOTCHA**: MySQL heeft max 75 connections, maar je app kan te veel connections openen.

**Oplossing**:
✅ **AL GEDAAN**: `mysql2` connection pool is geconfigureerd:
```typescript
export const pool = mysql.createPool({
  connectionLimit: 10,  // Max 10 connections per app instance
  // ...
});
```

**Check**: Monitor database connections:
```sql
SHOW PROCESSLIST;
```

---

### 15. **Build Process**

**GOTCHA**: TypeScript moet worden gecompileerd VOOR upload.

**Oplossing**:
✅ **AL GEDAAN**: `pnpm build` compileert alles naar `dist/`

**Checklist**:
- [ ] Run `pnpm build` lokaal
- [ ] Test `dist/index.js` lokaal
- [ ] Upload alleen `dist/`, `package.json`, `pnpm-lock.yaml`
- [ ] Run `pnpm install --prod` op server

---

### 16. **Dependencies (Production Only)**

**GOTCHA**: Dev dependencies worden geïnstalleerd, wat onnodig is.

**Oplossing**:
```bash
# Op server
pnpm install --prod
```

**Check**: Verifieer dat `node_modules` alleen production dependencies bevat:
```bash
ls node_modules/ | grep -E "(typescript|vite|@types)"  # Should be empty
```

---

### 17. **Logging**

**GOTCHA**: Logs kunnen groot worden en schijfruimte vullen.

**Oplossing**:
- **Console logs**: Gebruik console.log (wordt door Hostinger opgevangen)
- **File logs**: Implementeer log rotation (bijv. met `winston` + `winston-daily-rotate-file`)
- **PM2 logs**: Als je PM2 gebruikt:
  ```bash
  pm2 install pm2-logrotate
  ```

**Check**: Monitor schijfruimte:
```bash
df -h
```

---

### 18. **Session Storage**

**GOTCHA**: In-memory sessions gaan verloren bij server restart.

**Oplossing**:
✅ **AL GEDAAN**: Sessions worden opgeslagen in MySQL database

**Check**: Verifieer dat admin login blijft werken na server restart.

---

### 19. **Backup Strategy**

**GOTCHA**: Geen automatische backups = data verlies risico.

**Oplossing**:
1. **Database**: Gebruik MySQL backups (via hPanel of cron job)
2. **Files**: Backup `server/uploads/` en `client/public/images/`
3. **Automation**: Setup cron job voor dagelijkse backups

**Backup script** (cron job):
```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
mysqldump -u DB_USER -pDB_PASSWORD DB_NAME > /backups/db_$DATE.sql
tar -czf /backups/files_$DATE.tar.gz server/uploads/ client/public/images/
# Keep last 30 days
find /backups -name "*.sql" -mtime +30 -delete
find /backups -name "*.tar.gz" -mtime +30 -delete
```

---

### 20. **Rate Limiting**

**GOTCHA**: Geen rate limiting = DDoS risico.

**Oplossing**:
✅ **AL GEDAAN**: Express rate limiting is geïmplementeerd

**Check**: Test dat te veel requests worden geblokkeerd.

---

## 📋 Pre-Deployment Checklist

### Voor Upload:
- [ ] `pnpm build` succesvol uitgevoerd
- [ ] `dist/index.js` bestaat en is testbaar
- [ ] Alle environment variables gedocumenteerd
- [ ] `.env.example` is up-to-date
- [ ] Database schema scripts klaar
- [ ] Migratie script getest

### Na Upload:
- [ ] Node.js app geconfigureerd in hPanel
- [ ] Environment variables ingesteld in hPanel
- [ ] Database aangemaakt en schema geïmporteerd
- [ ] File permissions correct (755 voor dirs, 644 voor files)
- [ ] SSL certificaat geactiveerd
- [ ] Subdomains aangemaakt (als gebruikt)
- [ ] SMTP geconfigureerd en getest
- [ ] Health check endpoint werkt (`/health`)
- [ ] Admin login werkt
- [ ] File uploads werken
- [ ] Images worden correct geladen
- [ ] API endpoints werken
- [ ] CORS correct geconfigureerd

---

## 🔧 Troubleshooting Commands

### Check Node.js versie:
```bash
node --version  # Should be 18+
```

### Check process:
```bash
ps aux | grep node
```

### Check poort:
```bash
netstat -tulpn | grep node
```

### Check database connectie:
```bash
mysql -h localhost -u DB_USER -p DB_NAME -e "SELECT 1;"
```

### Check file permissions:
```bash
ls -la server/uploads/digital/
```

### Check disk space:
```bash
df -h
du -sh *
```

### Check logs:
```bash
# PM2
pm2 logs plankjes-maffia

# Systemd
journalctl -u plankjes-maffia -f

# Direct
tail -f /path/to/logs/app.log
```

---

## 📞 Hostinger Support

Als je problemen hebt:
1. **Check hPanel logs**: Ga naar hPanel → Logs
2. **Contact support**: Hostinger heeft 24/7 support
3. **Documentatie**: [Hostinger Help Center](https://support.hostinger.com)

---

**Laatste Update**: 2025-12-28
**Versie**: 1.0.0

