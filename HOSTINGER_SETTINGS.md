# Hostinger Node.js App Instellingen

## 📋 Configuratie voor hPanel Node.js App

Gebaseerd op de screenshot van je Hostinger configuratie interface.

---

## ✅ Correcte Instellingen

### **Build Configuration**

| Instelling | Waarde | Opmerking |
|------------|--------|-----------|
| **Framework preset** | `Express` | ✅ Correct (al ingesteld) |
| **Branch** | `main` | ✅ Correct (al ingesteld) |
| **Node version** | `24.x` | ✅ Correct (al ingesteld) |
| **Root directory** | `./` | ✅ Correct (al ingesteld) |

### **Build and Output Settings**

| Instelling | Huidige Waarde | **Correcte Waarde** | Opmerking |
|------------|----------------|---------------------|-----------|
| **Entry file** | `server.js` | **`dist/index.js`** | ⚠️ **MOET WORDEN AANGEPAST!** |
| **Package manager** | `pnpm` | `pnpm` | ✅ Correct (al ingesteld) |

### **Environment Variables**

⚠️ **KRITIEK**: Deze zijn nu "None" maar moeten allemaal worden ingesteld!

---

## 🔧 Aanpassingen Nodig

### 1. **Entry File Aanpassen**

**Huidig**: `server.js`  
**Moet zijn**: `dist/index.js`

**Waarom**: 
- Je build proces (`pnpm build`) compileert de TypeScript naar `dist/index.js`
- De `package.json` start script gebruikt ook `dist/index.js`
- `server.js` bestaat niet in je project

**Actie**: Wijzig "Entry file" van `server.js` naar `dist/index.js`

---

## 🔐 Environment Variables (Verplicht)

Voeg ALLE onderstaande environment variables toe in de "Environment Variables" sectie:

### **Server Configuration**

```env
NODE_ENV=production
PORT=3000
```

**Opmerking**: `PORT` wordt automatisch door Hostinger ingesteld, maar je kunt het expliciet zetten voor duidelijkheid.

### **CORS Configuration**

```env
ALLOWED_ORIGINS=https://plankjesmaffia.nl,https://www.plankjesmaffia.nl,https://admin.plankjesmaffia.nl,https://staging.plankjesmaffia.nl
```

**Opmerking**: Vervang `plankjesmaffia.nl` met je eigen domain. Voeg alle subdomains toe die je gebruikt.

### **Admin Configuration**

```env
ADMIN_PASSWORD=je_sterke_wachtwoord_hier
ADMIN_EMAIL=info@plankjesmaffia.nl
```

**⚠️ BELANGRIJK**: 
- Wijzig `ADMIN_PASSWORD` naar een sterk wachtwoord!
- Gebruik minimaal 12 karakters, mix van letters, cijfers en symbolen
- Gebruik NIET het standaard `admin123` in productie!

### **Database Configuration (MySQL)**

```env
DB_HOST=localhost
DB_USER=u123456789_admin
DB_PASSWORD=je_database_wachtwoord
DB_NAME=u123456789_plankjes
DB_PORT=3306
```

**⚠️ BELANGRIJK**: 
- **DB_HOST**: Check in hPanel → Databases voor de exacte hostname (meestal `localhost`)
- **DB_USER**: Check in hPanel → Databases (meestal met prefix zoals `u123456789_`)
- **DB_NAME**: Check in hPanel → Databases (meestal met prefix zoals `u123456789_`)
- **DB_PASSWORD**: Het wachtwoord dat je hebt ingesteld voor de database gebruiker
- **DB_PORT**: Meestal `3306`, maar check in hPanel

**Hoe te vinden**:
1. Ga naar **hPanel → Databases → MySQL Databases**
2. Klik op je database naam
3. Kopieer de exacte waarden voor:
   - Database naam
   - Database gebruiker
   - Database host (meestal `localhost`)

### **Email Configuration (SMTP)**

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@plankjesmaffia.nl
SMTP_PASSWORD=je_email_wachtwoord
SMTP_FROM=info@plankjesmaffia.nl
```

**⚠️ BELANGRIJK**: 
- **SMTP_HOST**: Check in hPanel → Email → SMTP Settings (meestal `smtp.hostinger.com` of `smtp.titan.email`)
- **SMTP_PORT**: `587` voor TLS, `465` voor SSL
- **SMTP_SECURE**: `false` voor port 587, `true` voor port 465
- **SMTP_USER**: Je email adres (bijv. `info@plankjesmaffia.nl`)
- **SMTP_PASSWORD**: Het wachtwoord voor je email account
- **SMTP_FROM**: Het "from" adres voor emails (meestal hetzelfde als SMTP_USER)

**Hoe te vinden**:
1. Ga naar **hPanel → Email → Email Accounts**
2. Maak een email account aan (bijv. `info@plankjesmaffia.nl`)
3. Ga naar **hPanel → Email → SMTP Settings**
4. Kopieer de SMTP instellingen

**Alternatief**: Als je geen SMTP configureert, gebruikt de app automatisch `mailto:` links als fallback.

### **Subdomain Configuration (Optioneel)**

```env
ADMIN_SUBDOMAIN=admin.plankjesmaffia.nl
STAGING_SUBDOMAIN=staging.plankjesmaffia.nl
API_SUBDOMAIN=api.plankjesmaffia.nl
```

**Opmerking**: Alleen nodig als je subdomains gebruikt. Vervang met je eigen domains.

---

## 📝 Stap-voor-stap Instructies

### Stap 1: Entry File Aanpassen

1. In de "Build and output settings" sectie
2. Wijzig "Entry file" van `server.js` naar `dist/index.js`
3. Klik op "Save" (niet "Save and redeploy" nog)

### Stap 2: Environment Variables Toevoegen

1. Scroll naar "Environment Variables" sectie
2. Klik op "Add Variable" of "+" knop
3. Voeg elke variabele één voor één toe:

   **Voor elke variabele**:
   - **Name**: Bijv. `NODE_ENV`
   - **Value**: Bijv. `production`
   - Klik "Add" of "Save"

4. Herhaal voor alle variabelen uit de lijst hierboven

### Stap 3: Database Setup (Eerst!)

**VOOR je de app start**, zorg dat:

1. **Database aanmaken**:
   - Ga naar **hPanel → Databases → MySQL Databases**
   - Klik "Create Database"
   - Noteer de database naam, gebruiker en wachtwoord

2. **Schema importeren**:
   - Upload `server/scripts/create-schema.sql` naar je server
   - Importeer via **hPanel → Databases → phpMyAdmin**:
     - Selecteer je database
     - Klik "Import"
     - Upload `create-schema.sql`
     - Klik "Go"

3. **Data migreren** (als je bestaande data hebt):
   - Upload `server/scripts/migrate-to-mysql.ts` naar server
   - Run via SSH: `pnpm migrate` (of pas aan voor productie)

### Stap 4: Save and Redeploy

1. Controleer dat alle instellingen correct zijn:
   - ✅ Entry file: `dist/index.js`
   - ✅ Package manager: `pnpm`
   - ✅ Alle environment variables zijn toegevoegd

2. Klik op **"Save and redeploy"** (paarse knop)

3. Wacht tot de deployment klaar is

4. Check de logs voor errors:
   - Ga naar **hPanel → Node.js Apps → Logs**
   - Zoek naar errors of warnings

---

## ✅ Checklist Na Deployment

- [ ] Entry file is `dist/index.js` (niet `server.js`)
- [ ] Alle environment variables zijn toegevoegd
- [ ] Database is aangemaakt en schema is geïmporteerd
- [ ] Database credentials zijn correct in environment variables
- [ ] SMTP credentials zijn correct (of optioneel)
- [ ] Admin password is gewijzigd (niet `admin123`)
- [ ] App start zonder errors (check logs)
- [ ] Health check werkt: `https://jouw-domain.nl/health`
- [ ] Admin login werkt: `https://jouw-domain.nl/admin`
- [ ] File uploads werken (test digitale bestand upload)
- [ ] Images worden geladen
- [ ] API endpoints werken

---

## 🐛 Troubleshooting

### App Start Niet

**Check**:
1. **Logs**: Ga naar hPanel → Node.js Apps → Logs
2. **Entry file**: Is het `dist/index.js`?
3. **Environment variables**: Zijn alle verplichte vars aanwezig?
4. **Database**: Is de database connectie correct?

**Veelvoorkomende errors**:
- `Cannot find module`: Entry file is verkeerd of dependencies niet geïnstalleerd
- `ECONNREFUSED`: Database host/port is verkeerd
- `Access denied`: Database user/password is verkeerd

### Database Connectie Fails

**Check**:
1. Database bestaat in hPanel
2. Database user heeft rechten op de database
3. `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` zijn correct
4. Database schema is geïmporteerd

**Test connectie**:
```bash
# Via SSH (als beschikbaar)
mysql -h localhost -u DB_USER -p DB_NAME
```

### SMTP Email Werkt Niet

**Check**:
1. Email account bestaat in hPanel
2. SMTP credentials zijn correct
3. `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` zijn correct

**Fallback**: Als SMTP niet werkt, gebruikt de app automatisch `mailto:` links.

---

## 📞 Support

Als je problemen hebt:
1. Check de logs in hPanel → Node.js Apps → Logs
2. Verifieer alle environment variables
3. Test database connectie
4. Contact Hostinger support als nodig

---

**Laatste Update**: 2025-12-28  
**Versie**: 1.0.0

