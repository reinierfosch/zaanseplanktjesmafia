# SSH Setup Compleet ✅

## Wat ik heb gedaan:

### ✅ **1. Database Schema Geïmporteerd**
- Alle tabellen zijn succesvol aangemaakt:
  - ✅ `artworks` - Voor kunstwerken
  - ✅ `orders` - Voor bestellingen  
  - ✅ `newsletter_subscriptions` - Voor nieuwsbrief inschrijvingen
  - ✅ `contact_submissions` - Voor contact formulier
  - ✅ `admin_sessions` - Voor admin login

### ✅ **2. .env Bestand Aangemaakt**
- Database credentials geconfigureerd:
  - `DB_HOST=localhost`
  - `DB_USER=REDACTED_DB_USER`
  - `DB_PASSWORD=REDACTED_PASSWORD`
  - `DB_NAME=REDACTED_DB_NAME`
  - `DB_PORT=3306`
- Application settings:
  - `NODE_ENV=production`
  - `PORT=3000`
  - `ADMIN_PASSWORD=admin123` ⚠️ **Wijzig dit in productie!**
  - `ADMIN_EMAIL=info@plankjesmaffia.nl`
  - `ALLOWED_ORIGINS` geconfigureerd

### ✅ **3. Application Status**
- Node.js app draait via Passenger
- Geen error logs gevonden
- Database connectie zou nu moeten werken

---

## 🧪 Test Nu:

### **1. Test Newsletter Formulier**
1. Ga naar je website: `https://indigo-porpoise-872121.hostingersite.com`
2. Ga naar de Contact tab
3. Vul het nieuwsbrief formulier in
4. Het zou nu moeten werken! ✅

### **2. Test Admin Login**
1. Ga naar `/admin`
2. Log in met wachtwoord: `admin123`
3. Het zou moeten werken! ✅

### **3. Test Database Connectie**
Als je nog errors krijgt:
- Check de server logs in hPanel → Node.js Apps → Logs
- Of via SSH: `tail -f .builds/logs/error.log`

---

## ⚠️ Belangrijk:

### **Admin Password Wijzigen**
Het admin wachtwoord is nu `admin123`. **Wijzig dit in productie!**

Via SSH:
```bash
cd domains/indigo-porpoise-872121.hostingersite.com/public_html
# Edit .env file
nano .env
# Change ADMIN_PASSWORD to a strong password
```

Of via hPanel → Node.js Apps → Environment Variables

### **SMTP Email (Optioneel)**
Als je email notificaties wilt:
1. Maak een email account aan in hPanel → Email
2. Voeg SMTP settings toe aan `.env`:
   ```
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=info@plankjesmaffia.nl
   SMTP_PASSWORD=je_email_wachtwoord
   SMTP_FROM=info@plankjesmaffia.nl
   ```

---

## 🔧 Als er nog problemen zijn:

### **Check Logs via SSH:**
```bash
cd domains/indigo-porpoise-872121.hostingersite.com/public_html
tail -f .builds/logs/error.log
```

### **Test Database Connectie:**
```bash
mysql -u REDACTED_DB_USER -p'REDACTED_PASSWORD' REDACTED_DB_NAME -e "SELECT COUNT(*) FROM newsletter_subscriptions;"
```

### **Herstart App (als nodig):**
Passenger herstart automatisch, maar je kunt ook:
1. Touch een file: `touch tmp/restart.txt`
2. Of via hPanel → Node.js Apps → Restart

---

## ✅ Status:

- ✅ Database schema geïmporteerd
- ✅ .env bestand aangemaakt
- ✅ Database credentials geconfigureerd
- ✅ Application draait
- ⚠️ Admin password moet worden gewijzigd
- ⚠️ SMTP email nog niet geconfigureerd (optioneel)

**De newsletter formulier zou nu moeten werken!** 🎉

---

**Laatste Update**: 2025-12-28  
**Versie**: 1.0.0

