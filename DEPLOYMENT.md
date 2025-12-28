# Deployment Guide - De Zaanse Plankjes Maffia

## Release Versie

Deze guide beschrijft hoe je de release versie kunt deployen naar productie.

## Build Output

Na het uitvoeren van `pnpm build` worden de volgende bestanden gegenereerd:

```
dist/
├── index.js          # Backend server (Express)
└── public/           # Frontend build (React)
    ├── index.html
    └── assets/
        ├── index-*.css
        └── index-*.js
```

## Vereisten voor Productie

### 1. Node.js
- Node.js 18+ of hoger
- pnpm 10+ (of npm/yarn)

### 2. Server Vereisten
- Minimaal 512MB RAM
- Minimaal 1GB vrije schijfruimte
- Toegang tot poort 3000 (of configureerbaar via PORT environment variable)
- MySQL database (optioneel, JSON fallback beschikbaar)
- SMTP email configuratie (optioneel, mailto fallback beschikbaar)

### 3. Bestandsstructuur op Server

```
/opt/plankjes-maffia/
├── dist/              # Build output (kopieer van lokale dist/)
├── server/
│   ├── data/          # JSON data bestanden (backup, optioneel met MySQL)
│   ├── uploads/       # Geüploade digitale bestanden
│   │   └── digital/   # Digitale kunstwerk bestanden
│   └── scripts/       # Database scripts
├── client/
│   └── public/
│       └── images/    # Kunstwerk afbeeldingen
├── package.json
├── pnpm-lock.yaml
└── .env               # Environment variables
```

## Deployment Stappen

### Stap 1: Build Lokaal

```bash
# Installeer dependencies (als nog niet gedaan)
pnpm install

# Maak productie build
pnpm build
```

### Stap 2: Upload naar Server

Upload de volgende bestanden/mappen naar je server:

**Verplicht:**
- `dist/` - Complete build output
- `package.json` - Dependencies
- `pnpm-lock.yaml` - Lock file voor exacte versies
- `server/data/` - Data bestanden (artworks.json, orders.json)
- `client/public/images/` - Alle kunstwerk afbeeldingen
- `.env` - Environment variables (zie hieronder)

**Optioneel (voor nieuwe uploads):**
- `server/uploads/` - Als je al digitale bestanden hebt geüpload

### Stap 3: Server Setup

#### 3.1 Installeer Dependencies op Server

```bash
cd /opt/plankjes-maffia
pnpm install --prod
```

#### 3.2 Maak Vereiste Directories

```bash
mkdir -p server/data
mkdir -p server/uploads/digital
mkdir -p client/public/images
```

#### 3.3 Database Setup (MySQL)

Als je MySQL gebruikt (aanbevolen):

1. Maak database aan (zie `DEPLOYMENT_MYSQL.md` voor details):
```bash
mysql -u root -p -e "CREATE DATABASE plankjes_maffia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

2. Importeer schema:
```bash
mysql -u root -p plankjes_maffia < server/scripts/create-schema.sql
```

3. Migreer bestaande data (als je JSON files hebt):
```bash
pnpm migrate
```

**Alternatief:** Als je geen MySQL gebruikt, worden JSON files automatisch gebruikt als fallback.

#### 3.4 Kopieer Images

Kopieer alle afbeeldingen van `client/public/images/` naar de server.

### Stap 4: Environment Variables

Maak een `.env` bestand op de server:

```env
# Server Configuration
NODE_ENV=production
PORT=3000

# CORS Configuration (vervang met je eigen domain)
ALLOWED_ORIGINS=https://zaanse-plankjesmaffia.nl,https://www.zaanse-plankjesmaffia.nl,https://admin.zaanse-plankjesmaffia.nl,https://staging.zaanse-plankjesmaffia.nl

# Admin Password (wijzig dit!)
ADMIN_PASSWORD=je_sterke_wachtwoord_hier
ADMIN_EMAIL=info@plankjesmaffia.nl

# Database Configuration (MySQL - optioneel, JSON fallback beschikbaar)
DB_HOST=localhost
DB_USER=plankjes_user
DB_PASSWORD=je_db_wachtwoord
DB_NAME=plankjes_maffia
DB_PORT=3306

# Email (SMTP) Configuration (optioneel, mailto fallback beschikbaar)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=info@plankjesmaffia.nl
SMTP_PASSWORD=je_smtp_wachtwoord
SMTP_FROM=info@plankjesmaffia.nl

# Subdomains
ADMIN_SUBDOMAIN=admin.plankjesmaffia.nl
STAGING_SUBDOMAIN=staging.plankjesmaffia.nl
API_SUBDOMAIN=api.plankjesmaffia.nl
```

**Belangrijk:**
- Wijzig het admin wachtwoord in productie!
- Update ALLOWED_ORIGINS met je eigen domain(s)
- Zorg dat .env niet publiek toegankelijk is (niet in git!)

### Stap 5: Start de Server

#### Met PM2 (Aanbevolen)

```bash
# Installeer PM2 globaal
npm install -g pm2

# Start de applicatie
pm2 start dist/index.js --name plankjes-maffia

# Start bij reboot
pm2 startup
pm2 save
```

#### Met systemd

Maak `/etc/systemd/system/plankjes-maffia.service`:

```ini
[Unit]
Description=De Zaanse Plankjes Maffia
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/plankjes-maffia
Environment="NODE_ENV=production"
Environment="PORT=3000"
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Start de service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable plankjes-maffia
sudo systemctl start plankjes-maffia
```

#### Handmatig

```bash
cd /opt/plankjes-maffia
NODE_ENV=production node dist/index.js
```

### Stap 6: Reverse Proxy (Nginx)

Voor productie gebruik je een reverse proxy. Voorbeeld Nginx configuratie:

```nginx
server {
    listen 80;
    server_name zaanse-plankjesmaffia.nl www.zaanse-plankjesmaffia.nl;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name zaanse-plankjesmaffia.nl www.zaanse-plankjesmaffia.nl;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    # Max upload size (voor digitale bestanden)
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Data Backup

### Belangrijke Bestanden om te Backuppen

1. **Data Bestanden:**
   - `server/data/artworks.json` - Alle kunstwerken
   - `server/data/orders.json` - Alle bestellingen

2. **Uploads:**
   - `server/uploads/digital/` - Alle digitale bestanden

3. **Images:**
   - `client/public/images/` - Alle kunstwerk afbeeldingen

### Backup Script

```bash
#!/bin/bash
BACKUP_DIR="/backups/plankjes-maffia"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

# Backup data
tar -czf "$BACKUP_DIR/data_$DATE.tar.gz" \
  server/data/ \
  server/uploads/ \
  client/public/images/

# Bewaar laatste 30 dagen
find "$BACKUP_DIR" -name "data_*.tar.gz" -mtime +30 -delete
```

## Updates Uitvoeren

### Stap 1: Backup

```bash
# Maak backup van huidige versie
cp -r server/data server/data.backup
cp -r server/uploads server/uploads.backup
```

### Stap 2: Upload Nieuwe Build

```bash
# Stop server
pm2 stop plankjes-maffia
# of
sudo systemctl stop plankjes-maffia

# Upload nieuwe dist/ folder
# (vervang oude dist/ met nieuwe)

# Start server
pm2 start plankjes-maffia
# of
sudo systemctl start plankjes-maffia
```

### Stap 3: Verifieer

- Check `/health` endpoint
- Test admin login
- Test kunstwerk bewerking
- Test order wizard

## Troubleshooting

### Server Start Niet

1. Check logs:
   ```bash
   pm2 logs plankjes-maffia
   # of
   sudo journalctl -u plankjes-maffia -f
   ```

2. Check of poort beschikbaar is:
   ```bash
   netstat -tulpn | grep 3000
   ```

3. Check permissions:
   ```bash
   ls -la server/data/
   ls -la server/uploads/
   ```

### Images Laden Niet

1. Check of images bestaan in `client/public/images/`
2. Check Nginx configuratie voor static file serving
3. Check file permissions

### Uploads Werken Niet

1. Check of `server/uploads/digital/` bestaat en schrijfrechten heeft
2. Check Nginx `client_max_body_size` (minimaal 50M)
3. Check server logs voor errors

### Admin Login Werkt Niet

1. Check `.env` bestand voor ADMIN_PASSWORD (als gebruikt)
2. Check session service logs
3. Check of cookies worden geaccepteerd

## Security Checklist

- [ ] Admin wachtwoord gewijzigd in productie
- [ ] `.env` bestand niet publiek toegankelijk
- [ ] HTTPS geconfigureerd (SSL certificaat)
- [ ] CORS correct geconfigureerd (ALLOWED_ORIGINS)
- [ ] Firewall geconfigureerd (alleen poort 80/443 open)
- [ ] Regular backups ingesteld (database + files)
- [ ] File upload directory heeft juiste permissions
- [ ] Rate limiting actief (standaard ingebouwd)
- [ ] Database gebruiker heeft alleen benodigde rechten
- [ ] SMTP wachtwoord is sterk en uniek

## Monitoring

### Health Check

De applicatie heeft een health check endpoint:

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-27T...",
  "uptime": 12345
}
```

### Logs

Logs worden naar stdout geschreven. Met PM2:

```bash
pm2 logs plankjes-maffia
```

Met systemd:

```bash
sudo journalctl -u plankjes-maffia -f
```

## Performance Tips

1. **Static Files**: Serve images via Nginx direct (niet via Node.js)
2. **Caching**: Configureer browser caching voor static assets
3. **CDN**: Overweeg CDN voor images (Cloudflare, AWS CloudFront, etc.)
4. **Database**: MySQL wordt automatisch gebruikt als geconfigureerd (betere performance)
5. **Email**: SMTP wordt automatisch gebruikt als geconfigureerd (betere gebruikerservaring)

## Nieuwe Features

### MySQL Database
- Automatische fallback naar JSON als database niet beschikbaar is
- Betere performance en schaalbaarheid
- Zie `DEPLOYMENT_MYSQL.md` voor setup instructies

### Email Service (SMTP)
- Automatische admin notificaties bij nieuwe orders
- Newsletter bevestigingsemails
- Contact formulier notificaties
- Automatische fallback naar mailto links als SMTP niet geconfigureerd is

### Subdomains
- `admin.plankjesmaffia.nl` - Admin panel
- `staging.plankjesmaffia.nl` - Staging omgeving
- `api.plankjesmaffia.nl` - API documentation

### Staging Omgeving
- Aparte database voor testing
- Zie `server/scripts/create-staging-schema.sql` voor setup

## Support

Voor vragen of problemen:
- Email: info@plankjesmaffia.nl
- Check logs voor error messages
- Verifieer alle environment variables

