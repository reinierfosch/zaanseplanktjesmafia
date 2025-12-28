# GitHub Setup & Upload Guide

## 📦 Wat KAN naar GitHub?

### ✅ **Wat WEL naar GitHub moet:**

#### **1. Source Code**
- ✅ Alle TypeScript/JavaScript bestanden (`client/src/`, `server/`)
- ✅ Configuratie bestanden (`package.json`, `tsconfig.json`, `vite.config.ts`)
- ✅ Build scripts (`create-release.sh`)
- ✅ Database schema scripts (`server/scripts/*.sql`)
- ✅ Migratie scripts (`server/scripts/migrate-to-mysql.ts`)

#### **2. Documentatie**
- ✅ `README.md` - Project beschrijving
- ✅ `DEPLOYMENT.md` - Deployment instructies
- ✅ `HOSTINGER_SETTINGS.md` - Hostinger configuratie
- ✅ `HOSTINGER_GOTCHAS.md` - Deployment gotchas
- ✅ `FEATURES_IMPLEMENTATION.md` - Feature overzicht
- ✅ Alle andere `.md` bestanden

#### **3. Configuratie Bestanden**
- ✅ `.gitignore` - Wat NIET naar GitHub moet
- ✅ `pnpm-lock.yaml` - Dependency lock file
- ✅ `components.json` - UI component configuratie
- ✅ `patches/` - Dependency patches

#### **4. Static Assets (Kleine Bestanden)**
- ✅ `client/public/images/` - Kunstwerk afbeeldingen
- ✅ Icons, fonts, etc.

---

### ❌ **Wat NIET naar GitHub moet:**

#### **1. Gevoelige Informatie**
- ❌ `.env` - Environment variables met wachtwoorden
- ❌ `.env.local`, `.env.production` - Alle env bestanden
- ❌ Database wachtwoorden
- ❌ API keys, secrets
- ❌ SMTP wachtwoorden

**Oplossing**: Gebruik `.env.example` (zonder echte waarden)

#### **2. Build Outputs**
- ❌ `dist/` - Compiled code (wordt opnieuw gebouwd)
- ❌ `build/` - Build artifacts
- ❌ `*.tsbuildinfo` - TypeScript cache

#### **3. Dependencies**
- ❌ `node_modules/` - Te groot, wordt opnieuw geïnstalleerd
- ❌ `.pnpm-store/` - Package cache

#### **4. Tijdelijke Bestanden**
- ❌ `release-*.zip` - Release packages (te groot)
- ❌ `release-*/` - Release directories
- ❌ Screenshots (tenzij voor documentatie)
- ❌ Logs (`*.log`)
- ❌ Cache bestanden

#### **5. IDE/Editor Bestanden**
- ❌ `.vscode/` - VS Code settings (tenzij team-wide)
- ❌ `.idea/` - IntelliJ settings
- ❌ `*.swp`, `*.swo` - Vim swap files

#### **6. OS Bestanden**
- ❌ `.DS_Store` - macOS
- ❌ `Thumbs.db` - Windows
- ❌ `.Spotlight-V100` - macOS

---

## 🔧 GitHub Features die je kunt gebruiken:

### **1. GitHub Actions (CI/CD)**

**Wat het doet**: Automatische builds, tests, deployments

**Voorbeelden**:
- ✅ Automatisch builden bij elke commit
- ✅ Automatisch testen
- ✅ Automatisch deployen naar Hostinger
- ✅ Automatisch release packages maken

**Setup**: Maak `.github/workflows/` directory

---

### **2. GitHub Secrets**

**Wat het doet**: Veilig opslaan van gevoelige data

**Voorbeelden**:
- ✅ Database wachtwoorden
- ✅ SMTP credentials
- ✅ API keys
- ✅ Deployment tokens

**Hoe te gebruiken**:
1. Ga naar **Repository → Settings → Secrets and variables → Actions**
2. Klik "New repository secret"
3. Voeg secrets toe (bijv. `DB_PASSWORD`, `SMTP_PASSWORD`)

**Waarschuwing**: Secrets zijn alleen beschikbaar in GitHub Actions, NIET in code!

---

### **3. GitHub Environments**

**Wat het doet**: Verschillende configuraties voor staging/production

**Voorbeelden**:
- ✅ `production` - Live website
- ✅ `staging` - Test omgeving
- ✅ `development` - Lokale ontwikkeling

---

### **4. GitHub Releases**

**Wat het doet**: Gepubliceerde versies van je code

**Voorbeelden**:
- ✅ Versie 1.0.0
- ✅ Release notes
- ✅ Downloadbare zip files
- ✅ Changelog

**Hoe te maken**:
1. Ga naar **Releases → New release**
2. Tag: `v1.0.0`
3. Titel: "Version 1.0.0"
4. Beschrijving: Changelog
5. Upload release package (optioneel)

---

### **5. GitHub Issues**

**Wat het doet**: Bug tracking, feature requests

**Voorbeelden**:
- ✅ Bug reports
- ✅ Feature requests
- ✅ To-do lijsten
- ✅ Project management

---

### **6. GitHub Projects**

**Wat het doet**: Project management boards

**Voorbeelden**:
- ✅ Kanban board
- ✅ Sprint planning
- ✅ Task tracking

---

### **7. GitHub Wiki**

**Wat het doet**: Uitgebreide documentatie

**Voorbeelden**:
- ✅ API documentatie
- ✅ User guides
- ✅ Developer guides

---

### **8. GitHub Pages**

**Wat het doet**: Hosting van statische websites

**Voorbeelden**:
- ✅ Project website
- ✅ Documentatie site
- ✅ Portfolio

**Setup**: 
1. Ga naar **Settings → Pages**
2. Selecteer branch (bijv. `gh-pages`)
3. Selecteer folder (bijv. `/docs`)

---

### **9. GitHub Branch Protection**

**Wat het doet**: Beveiliging van belangrijke branches

**Voorbeelden**:
- ✅ `main` branch beschermen
- ✅ Code reviews vereisen
- ✅ Tests moeten slagen
- ✅ Geen directe pushes

**Setup**:
1. Ga naar **Settings → Branches**
2. Klik "Add rule"
3. Branch: `main`
4. Enable: "Require pull request reviews"

---

### **10. GitHub Templates**

**Wat het doet**: Standaard templates voor issues/PRs

**Voorbeelden**:
- ✅ Bug report template
- ✅ Feature request template
- ✅ Pull request template

**Setup**: Maak `.github/ISSUE_TEMPLATE/` directory

---

## 📝 Aanbevolen Bestanden om toe te voegen:

### **1. `.env.example`**

**Doel**: Template voor environment variables (zonder echte waarden)

```env
# Server Configuration
NODE_ENV=production
PORT=3000

# Admin Configuration
ADMIN_PASSWORD=change_this_in_production
ADMIN_EMAIL=info@example.com

# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=3306

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=your_email@example.com

# CORS Configuration
ALLOWED_ORIGINS=https://example.com,https://www.example.com
```

---

### **2. `.github/workflows/ci.yml`**

**Doel**: Automatische builds en tests

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - uses: pnpm/action-setup@v2
      with:
        version: 10
    - uses: actions/setup-node@v3
      with:
        node-version: '24'
        cache: 'pnpm'
    - run: pnpm install
    - run: pnpm build
    - run: pnpm check
```

---

### **3. `.github/workflows/deploy.yml`**

**Doel**: Automatische deployment naar Hostinger

```yaml
name: Deploy

on:
  push:
    branches: [ main ]
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - uses: pnpm/action-setup@v2
    - uses: actions/setup-node@v3
      with:
        node-version: '24'
        cache: 'pnpm'
    - run: pnpm install
    - run: pnpm build
    - name: Deploy to Hostinger
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.HOSTINGER_HOST }}
        username: ${{ secrets.HOSTINGER_USER }}
        key: ${{ secrets.HOSTINGER_SSH_KEY }}
        source: "dist/,package.json,pnpm-lock.yaml"
        target: "/path/to/app"
```

---

### **4. `CONTRIBUTING.md`**

**Doel**: Richtlijnen voor contributors

```markdown
# Contributing

## Development Setup

1. Clone repository
2. Install dependencies: `pnpm install`
3. Start dev server: `pnpm dev`

## Code Style

- Use TypeScript
- Follow ESLint rules
- Format with Prettier

## Pull Request Process

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR
```

---

### **5. `LICENSE`**

**Doel**: Licentie voor je code

**Opties**:
- MIT License (meest gebruikelijk voor open source)
- Apache 2.0
- GPL v3
- Proprietary (geen licentie = alle rechten voorbehouden)

---

### **6. `CHANGELOG.md`**

**Doel**: Overzicht van wijzigingen per versie

```markdown
# Changelog

## [1.0.0] - 2025-12-28

### Added
- MySQL database support
- SMTP email service
- Subdomain routing
- Digital file uploads

### Changed
- Migrated from JSON to MySQL

### Fixed
- Path resolution in production builds
```

---

### **7. `.github/ISSUE_TEMPLATE/bug_report.md`**

**Doel**: Template voor bug reports

```markdown
## Bug Description

## Steps to Reproduce

## Expected Behavior

## Actual Behavior

## Environment
- OS: 
- Browser: 
- Version: 
```

---

### **8. `.github/ISSUE_TEMPLATE/feature_request.md`**

**Doel**: Template voor feature requests

```markdown
## Feature Description

## Use Case

## Proposed Solution

## Alternatives Considered
```

---

## 🚀 Wat je NU kunt doen:

### **1. Cleanup oncommitted files**

```bash
# Verwijder release packages (te groot voor GitHub)
git rm release-*.zip release-*.zip.zip

# Verwijder screenshots (tenzij voor documentatie)
git rm "Screenshot*.png"

# Update .gitignore om deze te voorkomen
echo "release-*.zip" >> .gitignore
echo "release-*/" >> .gitignore
echo "Screenshot*.png" >> .gitignore
```

---

### **2. Maak .env.example**

```bash
# Kopieer template (zonder echte waarden)
cp .env.example .env.example  # Als het niet bestaat
```

---

### **3. Voeg GitHub Actions toe**

Maak `.github/workflows/` directory en voeg CI/CD workflows toe.

---

### **4. Update README.md**

Zorg dat `README.md` bevat:
- Project beschrijving
- Installation instructies
- Usage voorbeelden
- Contributing guidelines
- License

---

## 📊 Huidige Status:

### ✅ **Al in GitHub:**
- Source code
- Documentatie (DEPLOYMENT.md, etc.)
- Configuratie bestanden
- Build scripts

### ❌ **Nog NIET in GitHub (maar zou moeten):**
- `.env.example` - Template voor env vars
- `.github/workflows/` - CI/CD automation
- `CONTRIBUTING.md` - Contributing guidelines
- `LICENSE` - Licentie
- `CHANGELOG.md` - Versie geschiedenis

### ❌ **Niet naar GitHub (correct):**
- `.env` - Gevoelige data
- `dist/` - Build output
- `node_modules/` - Dependencies
- `release-*.zip` - Release packages (te groot)
- Screenshots (tenzij voor documentatie)

---

## 🎯 Aanbevolen Volgende Stappen:

1. **Maak `.env.example`** - Template voor environment variables
2. **Update `.gitignore`** - Voeg release packages en screenshots toe
3. **Cleanup uncommitted files** - Verwijder release zips en screenshots
4. **Maak `LICENSE`** - Kies een licentie (MIT aanbevolen)
5. **Update `README.md`** - Voeg installation en usage toe
6. **Maak `.github/workflows/ci.yml`** - Automatische builds
7. **Commit alles** - Push naar GitHub

---

**Laatste Update**: 2025-12-28  
**Versie**: 1.0.0

