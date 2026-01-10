# Quick Start: Deploy Dev & Test naar Hostinger

## 🚀 Snelle Stappen

### 1. Maak Node.js Apps aan in hPanel

**Voor Dev:**
- hPanel → Node.js Apps → Create App
- **Branch**: `dev`
- **Entry file**: `dist/index.js`
- **Package manager**: `pnpm`
- **Node version**: `24.x`

**Voor Test:**
- hPanel → Node.js Apps → Create App
- **Branch**: `test`
- **Entry file**: `dist/index.js`
- **Package manager**: `pnpm`
- **Node version**: `24.x`

### 2. Noteer Tijdelijke URLs

Na aanmaken krijg je URLs zoals:
- Dev: `random-name-dev-123456.hostingersite.com`
- Test: `random-name-test-789012.hostingersite.com`

### 3. Stel Environment Variables in

**Voor Dev App:**
- Gebruik `env.dev.template` als referentie
- Vervang `jouw-dev-url.hostingersite.com` met je echte dev URL
- Stel `ALLOWED_ORIGINS` in met je dev URL (zowel http:// als https://)

**Voor Test App:**
- Gebruik `env.test.template` als referentie
- Vervang `jouw-test-url.hostingersite.com` met je echte test URL
- Stel `ALLOWED_ORIGINS` in met je test URL (zowel http:// als https://)

### 4. Deploy

- Klik "Save and redeploy" in beide apps
- Wacht 2-5 minuten
- Test je URLs: `https://jouw-dev-url.hostingersite.com/health`

### 5. Automatische Deployment

Hostinger deployt automatisch bij elke push naar:
- `dev` branch → Dev app
- `test` branch → Test app

---

## 📋 Checklist

- [ ] Dev app aangemaakt (branch: `dev`)
- [ ] Test app aangemaakt (branch: `test`)
- [ ] Entry file: `dist/index.js` (niet `server.js`!)
- [ ] Tijdelijke URLs genoteerd
- [ ] Environment variables ingesteld (zie templates)
- [ ] `ALLOWED_ORIGINS` bevat je tijdelijke URLs
- [ ] Apps gedeployed
- [ ] Health check werkt: `/health`

---

## 🔗 Handige Links

- **Volledige guide**: `HOSTINGER_DEV_TEST_DEPLOYMENT.md`
- **Dev env template**: `env.dev.template`
- **Test env template**: `env.test.template`

---

## ⚠️ Belangrijk

1. **Entry file** moet `dist/index.js` zijn (niet `server.js`)
2. **ALLOWED_ORIGINS** moet je tijdelijke URL bevatten (zowel http:// als https://)
3. **Geen trailing slash** in URLs
4. **Aparte databases** voor dev/test (optioneel maar aanbevolen)

---

**Meer details?** Zie `HOSTINGER_DEV_TEST_DEPLOYMENT.md`

