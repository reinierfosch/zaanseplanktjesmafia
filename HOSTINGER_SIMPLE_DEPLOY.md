# Eenvoudige Hostinger Deployment - Gebaseerd op Werkende Setup

## 🎯 Wat Hostinger Automatisch Doet

Hostinger hPanel Node.js Apps werken met **automatische GitHub deployment**:
1. Je koppelt je GitHub repository
2. Je selecteert een branch (bijv. `main`, `dev`, `test`)
3. Hostinger haalt automatisch de code op
4. Hostinger runt automatisch `pnpm install` en `pnpm build`
5. Hostinger start je app met `node dist/index.js`

**Je hoeft NIET handmatig te uploaden!**

---

## 🚀 Stappen voor Dev & Test Branches

### Stap 1: Zorg dat je Branches Bestaan

```bash
# Check of dev en test branches bestaan
git branch -a

# Als ze niet bestaan, maak ze aan:
git checkout -b dev
git push origin dev

git checkout -b test  
git push origin test
```

### Stap 2: Maak Nieuwe Node.js Apps in hPanel

**Voor Dev:**
1. Ga naar **hPanel → Node.js Apps**
2. Klik **"Create Node.js App"** of **"Add App"**
3. **Koppel GitHub repository:**
   - Klik op **"Connect GitHub"** of **"Link Repository"**
   - Selecteer je repository: `zaanseplanktjesmafia`
   - Selecteer branch: **`dev`** ⚠️ **BELANGRIJK!**
4. **Basic Settings:**
   - **App Name**: `plankjes-maffia-dev`
   - **Framework preset**: `Express` (of `Custom`)
   - **Node version**: `24.x`
   - **Root directory**: `./` (root van repository)
   - **Package manager**: `pnpm`
5. **Build Settings:**
   - **Entry file**: `dist/index.js` ⚠️ **Niet `server.js`!**
   - **Build command**: (laat leeg - Hostinger doet automatisch `pnpm build`)
6. Klik **"Create"** of **"Save"**

**Voor Test:**
- Herhaal dezelfde stappen, maar:
  - **App Name**: `plankjes-maffia-test`
  - **Branch**: **`test`** ⚠️ **BELANGRIJK!**

### Stap 3: Noteer Tijdelijke URLs

Na het aanmaken krijg je automatisch tijdelijke URLs:
- Dev: `random-name-dev-123456.hostingersite.com`
- Test: `random-name-test-789012.hostingersite.com`

**Noteer deze URLs!**

### Stap 4: Stel Environment Variables in

**Voor elke app (dev en test):**

1. Ga naar je app in hPanel → Node.js Apps → [Je App]
2. Scroll naar **"Environment Variables"**
3. Klik **"Add Variable"** of **"+"**
4. Voeg deze variabelen toe (één voor één):

**Minimale Setup (zonder database):**
```env
NODE_ENV=development  # of 'staging' voor test
PORT=3000
ALLOWED_ORIGINS=https://jouw-tijdelijke-url.hostingersite.com,http://jouw-tijdelijke-url.hostingersite.com
ADMIN_PASSWORD=dev_password_123  # of test_password_123 voor test
```

**Volledige Setup (met database):**
```env
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=https://jouw-tijdelijke-url.hostingersite.com,http://jouw-tijdelijke-url.hostingersite.com
ADMIN_PASSWORD=dev_password_123
ADMIN_EMAIL=dev@plankjesmaffia.nl
DB_HOST=localhost
DB_USER=u123456789_admin
DB_PASSWORD=je_db_wachtwoord
DB_NAME=u123456789_plankjes_dev  # of _test voor test app
DB_PORT=3306
```

**⚠️ BELANGRIJK:**
- Vervang `jouw-tijdelijke-url.hostingersite.com` met je ECHTE tijdelijke URL
- Voeg ZOWEL `http://` als `https://` toe aan `ALLOWED_ORIGINS`
- Geen trailing slash (`/`) in URLs!

### Stap 5: Deploy

1. Klik **"Save and redeploy"** (paarse knop)
2. Wacht 2-5 minuten
3. Check de **Build Logs** en **App Logs** voor errors

### Stap 6: Test

Open je tijdelijke URL:
- `https://jouw-dev-url.hostingersite.com/health` → Moet `{"status":"ok"}` geven
- `https://jouw-dev-url.hostingersite.com/admin` → Admin login pagina

---

## 🔄 Automatische Deployment

**Hostinger deployt automatisch wanneer je pusht naar de branch:**
- Push naar `dev` → Dev app wordt automatisch gedeployed
- Push naar `test` → Test app wordt automatisch gedeployed

**Hoe het werkt:**
1. Je pusht code naar GitHub (bijv. `git push origin dev`)
2. Hostinger detecteert de nieuwe commit (kan 1-2 minuten duren)
3. Hostinger runt automatisch:
   - `pnpm install`
   - `pnpm build`
   - `node dist/index.js`
4. Je app is live!

**Je hoeft NIET handmatig te redeployen na elke push!**

---

## 📋 Checklist

### Voor Dev App:
- [ ] Dev branch bestaat op GitHub
- [ ] Node.js app aangemaakt in hPanel
- [ ] GitHub repository gekoppeld
- [ ] Branch ingesteld op `dev`
- [ ] Entry file: `dist/index.js`
- [ ] Tijdelijke URL genoteerd
- [ ] Environment variables ingesteld
- [ ] `ALLOWED_ORIGINS` bevat tijdelijke URL (zowel http:// als https://)
- [ ] App gedeployed
- [ ] Health check werkt: `/health`

### Voor Test App:
- [ ] Test branch bestaat op GitHub
- [ ] Node.js app aangemaakt in hPanel
- [ ] GitHub repository gekoppeld
- [ ] Branch ingesteld op `test`
- [ ] Entry file: `dist/index.js`
- [ ] Tijdelijke URL genoteerd
- [ ] Environment variables ingesteld
- [ ] `ALLOWED_ORIGINS` bevat tijdelijke URL (zowel http:// als https://)
- [ ] App gedeployed
- [ ] Health check werkt: `/health`

---

## ⚠️ Veelvoorkomende Fouten

### ❌ Fout 1: Verkeerde Branch
- **Fout**: App deployt `main` in plaats van `dev`/`test`
- **Oplossing**: Check in hPanel → Node.js Apps → [Je App] → Build Configuration → Branch

### ❌ Fout 2: Entry File Verkeerd
- **Fout**: `server.js` in plaats van `dist/index.js`
- **Oplossing**: Wijzig naar `dist/index.js` in Build Settings

### ❌ Fout 3: CORS Errors
- **Fout**: `Access-Control-Allow-Origin` errors
- **Oplossing**: Zorg dat `ALLOWED_ORIGINS` je tijdelijke URL bevat (zowel http:// als https://)

### ❌ Fout 4: Build Fails
- **Fout**: `vite: command not found` of andere build errors
- **Oplossing**: Check Build Logs in hPanel, zorg dat `package.json` correct is

---

## 🔍 Waar Vind Je Alles in hPanel?

### Node.js Apps:
**hPanel → Node.js Apps**

Hier zie je:
- Lijst van alle apps
- Status (Running, Stopped, Building)
- Tijdelijke URLs
- Knoppen: Edit, Redeploy, Logs, Delete

### Environment Variables:
**hPanel → Node.js Apps → [Je App] → Environment Variables**

Hier voeg je toe:
- Alle environment variables
- Één variabele per keer
- Name + Value

### Logs:
**hPanel → Node.js Apps → [Je App] → Logs**

Hier zie je:
- **Build Logs**: Output van `pnpm install` en `pnpm build`
- **App Logs**: Runtime logs van je Node.js app
- **Errors**: Rode errors in de logs

### Build Configuration:
**hPanel → Node.js Apps → [Je App] → Build Configuration**

Hier stel je in:
- GitHub repository
- Branch
- Node version
- Package manager
- Root directory

### Build and Output Settings:
**hPanel → Node.js Apps → [Je App] → Build and Output Settings**

Hier stel je in:
- Entry file (`dist/index.js`)
- Build command (meestal leeg)

---

## 🎉 Klaar!

Je hebt nu:
- ✅ Dev app op tijdelijke URL (deployt automatisch bij push naar `dev`)
- ✅ Test app op tijdelijke URL (deployt automatisch bij push naar `test`)
- ✅ Automatische deployment bij elke push

**Test het:**
1. Maak een kleine wijziging in je code
2. Push naar `dev` branch: `git push origin dev`
3. Wacht 2-3 minuten
4. Check je dev URL - je wijziging zou zichtbaar moeten zijn!

---

**Laatste Update**: 2025-12-30  
**Versie**: 1.0.0

