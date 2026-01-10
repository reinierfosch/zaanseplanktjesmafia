# Hostinger Deployment voor Dev en Test Branches

## 🎯 Doel

Deze guide beschrijft hoe je de `dev` en `test` branches kunt deployen naar Hostinger met tijdelijke URLs voor testing.

---

## 📋 Overzicht

Hostinger hPanel ondersteunt meerdere Node.js apps, elk met:
- Eigen GitHub branch
- Eigen tijdelijke URL (bijv. `random-name-123456.hostingersite.com`)
- Eigen environment variables
- Eigen database (optioneel)

---

## 🚀 Stap 1: Nieuwe Node.js Apps Aanmaken in hPanel

### Voor Dev Branch

1. **Ga naar hPanel → Node.js Apps**
2. **Klik op "Create Node.js App"** of **"Add App"**
3. **Vul in:**
   - **App Name**: `plankjes-maffia-dev` (of een andere naam)
   - **Framework preset**: `Express`
   - **Branch**: `dev` ⚠️ **BELANGRIJK: Selecteer `dev` branch!**
   - **Node version**: `24.x`
   - **Root directory**: `./`
   - **Package manager**: `pnpm`

4. **Build and Output Settings:**
   - **Entry file**: `dist/index.js` ⚠️ **Niet `server.js`!**
   - **Build command**: (laat leeg, Hostinger doet automatisch `pnpm install` en `pnpm build`)

5. **Klik op "Create"** of **"Save"**

### Voor Test Branch

Herhaal dezelfde stappen, maar met:
- **App Name**: `plankjes-maffia-test`
- **Branch**: `test` ⚠️ **Selecteer `test` branch!**

---

## 🔗 Stap 2: Tijdelijke URLs Noteren

Na het aanmaken van de apps krijg je automatisch tijdelijke URLs, bijvoorbeeld:
- **Dev app**: `random-name-dev-123456.hostingersite.com`
- **Test app**: `random-name-test-789012.hostingersite.com`

**Noteer deze URLs!** Je hebt ze nodig voor de environment variables.

---

## 🔐 Stap 3: Environment Variables Instellen

### Voor Dev App

Ga naar je **dev app** in hPanel → Node.js Apps → Klik op je dev app → **Environment Variables**

Voeg de volgende variabelen toe:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# CORS Configuration (vervang met je tijdelijke dev URL)
ALLOWED_ORIGINS=https://random-name-dev-123456.hostingersite.com,http://random-name-dev-123456.hostingersite.com

# Admin Configuration
ADMIN_PASSWORD=dev_admin_password_123
ADMIN_EMAIL=dev@plankjesmaffia.nl

# Database Configuration (optioneel - gebruik aparte dev database)
DB_HOST=localhost
DB_USER=u123456789_admin
DB_PASSWORD=je_dev_db_wachtwoord
DB_NAME=u123456789_plankjes_dev
DB_PORT=3306

# Email Configuration (optioneel - kan uit staan voor dev)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=dev@plankjesmaffia.nl
SMTP_PASSWORD=je_email_wachtwoord
SMTP_FROM=dev@plankjesmaffia.nl

# Subdomain Configuration (niet nodig voor tijdelijke URLs)
# Laat deze leeg of verwijder ze
```

### Voor Test App

Ga naar je **test app** in hPanel → Node.js Apps → Klik op je test app → **Environment Variables**

Voeg de volgende variabelen toe:

```env
# Server Configuration
NODE_ENV=staging
PORT=3000

# CORS Configuration (vervang met je tijdelijke test URL)
ALLOWED_ORIGINS=https://random-name-test-789012.hostingersite.com,http://random-name-test-789012.hostingersite.com

# Admin Configuration
ADMIN_PASSWORD=test_admin_password_123
ADMIN_EMAIL=test@plankjesmaffia.nl

# Database Configuration (optioneel - gebruik aparte test database)
DB_HOST=localhost
DB_USER=u123456789_admin
DB_PASSWORD=je_test_db_wachtwoord
DB_NAME=u123456789_plankjes_test
DB_PORT=3306

# Email Configuration (optioneel)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=test@plankjesmaffia.nl
SMTP_PASSWORD=je_email_wachtwoord
SMTP_FROM=test@plankjesmaffia.nl
```

---

## 🗄️ Stap 4: Databases Aanmaken (Optioneel)

### Dev Database

1. **Ga naar hPanel → Databases → MySQL Databases**
2. **Klik "Create Database"**
3. **Vul in:**
   - **Database Name**: `plankjes_dev` (Hostinger voegt automatisch prefix toe)
   - **Database User**: Kies een gebruiker of maak nieuwe aan
   - **Password**: Kies een sterk wachtwoord
4. **Noteer de volledige database naam** (bijv. `u123456789_plankjes_dev`)
5. **Importeer schema** (optioneel):
   - Upload `server/scripts/create-schema.sql` via phpMyAdmin
   - Of gebruik hetzelfde schema als productie

### Test Database

Herhaal dezelfde stappen voor test:
- **Database Name**: `plankjes_test`
- **Noteer**: `u123456789_plankjes_test`

**Of gebruik staging schema:**
- Upload `server/scripts/create-staging-schema.sql` via phpMyAdmin

---

## 🚀 Stap 5: Deploy

### Eerste Deployment

1. **Voor Dev App:**
   - Ga naar je dev app in hPanel
   - Klik op **"Save and redeploy"** (paarse knop)
   - Wacht tot deployment klaar is (kan 2-5 minuten duren)

2. **Voor Test App:**
   - Ga naar je test app in hPanel
   - Klik op **"Save and redeploy"** (paarse knop)
   - Wacht tot deployment klaar is

### Automatische Deployment

Hostinger deployt automatisch wanneer je pusht naar de geconfigureerde branch:
- **Dev app**: Deployt automatisch bij push naar `dev` branch
- **Test app**: Deployt automatisch bij push naar `test` branch

---

## ✅ Stap 6: Verificatie

### Check Dev App

1. **Open je tijdelijke dev URL**: `https://random-name-dev-123456.hostingersite.com`
2. **Test endpoints:**
   - `/health` - Moet `{"status":"ok"}` teruggeven
   - `/admin` - Admin login pagina
   - `/` - Homepage

### Check Test App

1. **Open je tijdelijke test URL**: `https://random-name-test-789012.hostingersite.com`
2. **Test endpoints:**
   - `/health` - Moet `{"status":"ok"}` teruggeven
   - `/admin` - Admin login pagina
   - `/` - Homepage

### Check Logs

1. **Ga naar hPanel → Node.js Apps → [Je App] → Logs**
2. **Zoek naar errors:**
   - `ECONNREFUSED` = Database connectie probleem
   - `Access denied` = Database credentials verkeerd
   - `Cannot find module` = Dependencies probleem

---

## 🔄 Updates Uitvoeren

### Handmatige Update

1. **Push naar branch** (bijv. `dev` of `test`)
2. **Ga naar hPanel → Node.js Apps → [Je App]**
3. **Klik "Redeploy"** (als automatische deployment niet werkt)

### Automatische Update

Hostinger detecteert automatisch nieuwe commits en deployt:
- **Dev app**: Bij elke push naar `dev` branch
- **Test app**: Bij elke push naar `test` branch

**Let op**: Soms duurt het 1-2 minuten voordat Hostinger de nieuwe commit detecteert.

---

## 🐛 Troubleshooting

### App Start Niet

**Check:**
1. **Logs**: hPanel → Node.js Apps → [Je App] → Logs
2. **Entry file**: Moet `dist/index.js` zijn (niet `server.js`)
3. **Environment variables**: Zijn alle verplichte vars aanwezig?
4. **Database**: Is de database connectie correct?

**Veelvoorkomende errors:**
- `Cannot find module`: Dependencies niet geïnstalleerd → Check build logs
- `ECONNREFUSED`: Database host/port verkeerd
- `Access denied`: Database user/password verkeerd

### Database Connectie Fails

**Check:**
1. Database bestaat in hPanel
2. Database user heeft rechten op de database
3. `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` zijn correct
4. Database schema is geïmporteerd (als je database gebruikt)

**Test connectie:**
- Check logs voor database errors
- Test via phpMyAdmin of je kunt inloggen

### CORS Errors

**Check:**
1. `ALLOWED_ORIGINS` bevat je tijdelijke URL (zowel `http://` als `https://`)
2. URL is exact zoals getoond in hPanel (inclusief subdomain)
3. Geen trailing slash in URL

**Voorbeeld:**
```env
# ✅ Goed
ALLOWED_ORIGINS=https://random-name-dev-123456.hostingersite.com,http://random-name-dev-123456.hostingersite.com

# ❌ Fout (trailing slash)
ALLOWED_ORIGINS=https://random-name-dev-123456.hostingersite.com/
```

### Build Fails

**Check:**
1. **Build logs**: hPanel → Node.js Apps → [Je App] → Build Logs
2. **Dependencies**: Zijn alle dependencies in `package.json`?
3. **Node version**: Is Node.js 24.x geselecteerd?
4. **Package manager**: Is `pnpm` geselecteerd?

**Veelvoorkomende build errors:**
- `vite: command not found` → Check of `vite` in `devDependencies` staat
- `Module not found` → Check of alle dependencies in `package.json` staan

---

## 📊 Overzicht: Drie Omgevingen

| Omgeving | Branch | URL Type | Database | NODE_ENV |
|----------|--------|----------|----------|----------|
| **Production** | `main` | Productie domain | `u123456789_plankjes` | `production` |
| **Dev** | `dev` | Tijdelijk (Hostinger) | `u123456789_plankjes_dev` | `development` |
| **Test** | `test` | Tijdelijk (Hostinger) | `u123456789_plankjes_test` | `staging` |

---

## 🔒 Security Best Practices

### Voor Dev/Test Omgevingen

1. **Andere admin wachtwoorden** gebruiken dan productie
2. **Test data** gebruiken (geen echte klantgegevens)
3. **Geen echte email** versturen (of test email account gebruiken)
4. **CORS** alleen voor tijdelijke URLs instellen
5. **Database** apart houden van productie

### Environment Variables

- ✅ **Wel**: Test wachtwoorden, test database credentials
- ❌ **Niet**: Productie wachtwoorden, echte klantgegevens

---

## 📝 Checklist

### Dev App Setup
- [ ] Node.js app aangemaakt in hPanel
- [ ] Branch ingesteld op `dev`
- [ ] Entry file: `dist/index.js`
- [ ] Tijdelijke URL genoteerd
- [ ] Environment variables ingesteld
- [ ] Database aangemaakt (optioneel)
- [ ] Database schema geïmporteerd (optioneel)
- [ ] App gedeployed
- [ ] Health check werkt: `/health`
- [ ] Admin login werkt: `/admin`

### Test App Setup
- [ ] Node.js app aangemaakt in hPanel
- [ ] Branch ingesteld op `test`
- [ ] Entry file: `dist/index.js`
- [ ] Tijdelijke URL genoteerd
- [ ] Environment variables ingesteld
- [ ] Database aangemaakt (optioneel)
- [ ] Database schema geïmporteerd (optioneel)
- [ ] App gedeployed
- [ ] Health check werkt: `/health`
- [ ] Admin login werkt: `/admin`

---

## 🎉 Klaar!

Je hebt nu:
- ✅ Dev app op tijdelijke URL (deployt automatisch bij push naar `dev`)
- ✅ Test app op tijdelijke URL (deployt automatisch bij push naar `test`)
- ✅ Aparte databases voor dev/test (optioneel)
- ✅ Aparte environment variables voor elke omgeving

**Volgende stappen:**
1. Test je dev app door te pushen naar `dev` branch
2. Test je test app door te pushen naar `test` branch
3. Verifieer dat automatische deployment werkt

---

**Laatste Update**: 2025-12-28  
**Versie**: 1.0.0

