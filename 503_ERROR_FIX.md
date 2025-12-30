# 503 Service Unavailable - Fix Guide

## 🔍 Probleem Gevonden

De website geeft een **503 Service Unavailable** error. Dit betekent dat de Node.js applicatie niet kan starten.

## ✅ Wat ik heb gefixed:

### 1. **.htaccess Path Correctie - FIXED**
Het `.htaccess` bestand verwees naar het verkeerde pad:
- **Oud**: `/home/u127066462/domains/indigo-porpoise-872121.hostingersite.com/public_html`
- **Nieuw**: `/home/u127066462/domains/zaanse-plankjesmaffia.nl/public_html`

✅ **Gefixed**: `.htaccess` is bijgewerkt met het correcte pad.

### 2. **.env File Database Credentials - NEEDS FIX**
Het `.env` bestand bevatte `REDACTED_*` placeholders in plaats van echte database credentials.

✅ **Gefixed**: `.env` is bijgewerkt met database credentials, maar de database connectie test faalt nog.

## ⚠️ Huidige Probleem: Database Access Denied

De database connectie test geeft:
```
ERROR 1045 (28000): Access denied for user 'u127066462_admin'@'localhost' (using password: YES)
```

Dit betekent dat:
- De database credentials in `.env` zijn mogelijk onjuist
- OF de credentials zijn gewijzigd in hPanel environment variables
- OF het wachtwoord heeft speciale karakters die verkeerd geëscaped zijn

---

## 🔧 Oplossing: Check hPanel Environment Variables

**Belangrijk**: Hostinger Node.js apps gebruiken **hPanel Environment Variables** die de `.env` file kunnen overschrijven!

### Stap 1: Check hPanel Environment Variables

1. Log in op **hPanel**: https://hpanel.hostinger.com
2. Ga naar: **Websites → Node.js Apps**
3. Klik op je app (waarschijnlijk `zaanse-plankjesmaffia.nl`)
4. Scroll naar **"Environment Variables"**
5. Check of de volgende variabelen zijn ingesteld:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `DB_PORT`

### Stap 2: Update Database Credentials

Als de environment variables in hPanel zijn ingesteld:
- **Gebruik die waarden** (ze overschrijven de `.env` file)
- Check of ze correct zijn

Als de environment variables NIET zijn ingesteld:
- **Voeg ze toe** in hPanel met de correcte database credentials
- OF update de `.env` file op de server met de juiste credentials

### Stap 3: Vind Correcte Database Credentials

1. Ga naar **hPanel → Databases → MySQL Databases**
2. Klik op je database (waarschijnlijk `u127066462_plankjes`)
3. Kopieer de **exacte** waarden:
   - Database Name: `u127066462_plankjes` (met prefix!)
   - Database User: `u127066462_admin` (met prefix!)
   - Database Host: `localhost`
   - Database Port: `3306`
   - Password: Klik op "Show Password"

### Stap 4: Update Credentials

**Optie A: Via hPanel Environment Variables (Aanbevolen)**
1. Ga naar **Node.js Apps → [Je App] → Environment Variables**
2. Update of voeg toe:
   - `DB_HOST` = `localhost`
   - `DB_USER` = `u127066462_admin` (exact zoals getoond)
   - `DB_PASSWORD` = `[je_wachtwoord]` (exact zoals getoond)
   - `DB_NAME` = `u127066462_plankjes` (exact zoals getoond)
   - `DB_PORT` = `3306`
3. Klik **"Save and redeploy"**

**Optie B: Via SSH .env File**
Als je via SSH wilt updaten, gebruik dan een script dat de credentials correct escaped.

---

## 🧪 Test Database Connectie

Na het updaten van de credentials, test de connectie:

**Via SSH:**
```bash
cd /home/u127066462/domains/zaanse-plankjesmaffia.nl/public_html
mysql -u u127066462_admin -p'[JE_WACHTWOORD]' u127066462_plankjes -e "SELECT 1;"
```

Als dit werkt, zou de app moeten starten!

---

## 🔄 Restart Passenger

Na het updaten van de credentials:

1. **Via SSH:**
   ```bash
   cd /home/u127066462/domains/zaanse-plankjesmaffia.nl/public_html
   touch tmp/restart.txt
   ```

2. **OF via hPanel:**
   - Ga naar **Node.js Apps → [Je App]**
   - Klik **"Restart"**

---

## 📋 Checklist

- [x] `.htaccess` pad gecorrigeerd
- [x] `.env` file bijgewerkt (maar credentials mogelijk onjuist)
- [ ] Database credentials geverifieerd in hPanel
- [ ] Database connectie getest
- [ ] Passenger herstart
- [ ] Website getest

---

## 🚨 Als het nog steeds niet werkt

1. **Check Passenger Logs:**
   ```bash
   tail -50 .builds/logs/error.log
   ```

2. **Check hPanel Logs:**
   - Ga naar **Node.js Apps → [Je App] → Logs**
   - Zoek naar database connectie errors

3. **Test App Manually:**
   ```bash
   cd /home/u127066462/domains/zaanse-plankjesmaffia.nl/public_html
   /opt/alt/alt-nodejs24/root/bin/node dist/index.js
   ```
   Dit toont de exacte error.

---

**Laatste Update**: 2025-12-30  
**Status**: ⚠️ Wachtend op correcte database credentials

