# Development Workflow - Zaanse Plankjes Maffia

## Overzicht

Dit document beschrijft de development workflow voor het Zaanse Plankjes Maffia project, inclusief branch strategie, deployment procedures, en lessons learned van eerdere deployments en de Kunststreken project.

**Laatste Update**: 2025-12-30  
**Versie**: 1.0.0

---

## 1. Branch Strategie

### 1.1 Branches

| Branch | Doel | Deployment | Environment |
|--------|------|------------|-------------|
| `main` | Productie code | Automatisch naar productie | `production` |
| `dev` | Development code | Automatisch naar dev URL | `development` |
| `test` | Test/staging code | Automatisch naar test URL | `staging` |

### 1.2 Branch Workflow

```
main (production)
  ↑
  └── test (staging)
       ↑
       └── dev (development)
            ↑
            └── feature branches (optioneel)
```

**Regels**:
- ✅ **main**: Alleen geteste, stabiele code
- ✅ **test**: Code die klaar is voor staging testing
- ✅ **dev**: Actieve development, kan instabiel zijn
- ❌ **NOOIT** direct naar `main` pushen zonder via `dev` en `test` te gaan

### 1.3 Branch Naming

- **Feature branches**: `feature/naam-van-feature`
- **Bug fixes**: `fix/naam-van-bug`
- **Hotfixes**: `hotfix/kritieke-fix` (direct naar main, daarna naar dev/test)

---

## 2. Development Workflow

### 2.1 Lokaal Development

**Stappen**:

1. **Clone repository**:
   ```bash
   git clone https://github.com/reinierfosch/zaanseplanktjesmafia.git
   cd zaanseplanktjesmafia
   ```

2. **Checkout dev branch**:
   ```bash
   git checkout dev
   git pull origin dev
   ```

3. **Installeer dependencies**:
   ```bash
   pnpm install
   ```

4. **Start development server**:
   ```bash
   pnpm dev
   ```

5. **Maak wijzigingen** en test lokaal

6. **Commit en push**:
   ```bash
   git add .
   git commit -m "Beschrijving van wijzigingen"
   git push origin dev
   ```

### 2.2 Pre-Commit Checks

**Voordat je commit**:

- [ ] Code getest lokaal (`pnpm dev` werkt)
- [ ] Geen console errors
- [ ] TypeScript check: `pnpm check` (geen type errors)
- [ ] Build succesvol: `pnpm build` (test build)
- [ ] Geen credentials in code (check `.env.example`)
- [ ] Geen grote bestanden (check `.gitignore`)

**Automatische checks** (als geconfigureerd):
- TypeScript type checking
- ESLint (als geconfigureerd)
- Prettier formatting (als geconfigureerd)

### 2.3 Commit Messages

**Format**: `type: beschrijving`

**Types**:
- `feat`: Nieuwe feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentatie updates
- `style`: Styling wijzigingen
- `test`: Test toevoegingen
- `chore`: Build/config wijzigingen

**Voorbeelden**:
```
feat: Add dashboard statistics to admin panel
fix: Center Roshism logo in collaboration section
refactor: Move services to server/services directory
docs: Update development workflow procedure
```

---

## 3. Testing Workflow

### 3.1 Lokaal Testen

**Voor elke wijziging**:

1. **Start dev server**:
   ```bash
   pnpm dev
   ```

2. **Test functionaliteit**:
   - Open `http://localhost:3000`
   - Test alle relevante features
   - Check browser console voor errors
   - Test op verschillende browsers (Chrome, Firefox, Safari)

3. **Test build**:
   ```bash
   pnpm build
   pnpm start  # Test production build lokaal
   ```

### 3.2 Test Checklist

**Functionele Tests**:
- [ ] Homepage laadt correct
- [ ] Navigation werkt
- [ ] Admin login werkt
- [ ] API endpoints werken
- [ ] Forms werken (newsletter, contact, orders)
- [ ] File uploads werken (als van toepassing)
- [ ] Database operaties werken

**Visuele Tests**:
- [ ] Responsive design werkt (mobile, tablet, desktop)
- [ ] Styling consistent
- [ ] Geen layout breaks
- [ ] Images laden correct

**Performance Tests**:
- [ ] Pagina laadt snel (< 3 seconden)
- [ ] Geen grote bundle sizes
- [ ] Images geoptimaliseerd

---

## 4. Deployment Workflow

### 4.1 Automatische Deployment

**Hostinger deployt automatisch** wanneer je pusht naar:
- `dev` branch → Dev app (`deepskyblue-hare-963276.hostingersite.com`)
- `test` branch → Test app (tijdelijke URL)
- `main` branch → Productie app (`zaanse-plankjesmaffia.nl`)

**Hoe het werkt**:
1. Je pusht code naar GitHub
2. Hostinger detecteert nieuwe commit (1-2 minuten)
3. Hostinger runt automatisch:
   - `pnpm install`
   - `pnpm build`
   - `node dist/index.js`
4. App is live!

### 4.2 Deployment Stappen

**Voor Dev Deployment**:

1. **Commit en push naar dev**:
   ```bash
   git checkout dev
   git add .
   git commit -m "feat: Beschrijving"
   git push origin dev
   ```

2. **Wacht 2-5 minuten** voor automatische deployment

3. **Verifieer**:
   - Check dev URL: `https://deepskyblue-hare-963276.hostingersite.com/health`
   - Test functionaliteit op dev URL

**Voor Test Deployment**:

1. **Merge dev naar test**:
   ```bash
   git checkout test
   git merge dev
   git push origin test
   ```

2. **Wacht 2-5 minuten** voor automatische deployment

3. **Verifieer** op test URL

**Voor Productie Deployment**:

1. **Merge test naar main** (alleen na volledige testing):
   ```bash
   git checkout main
   git merge test
   git push origin main
   ```

2. **Wacht 2-5 minuten** voor automatische deployment

3. **Verifieer** op productie URL: `https://zaanse-plankjesmaffia.nl`

### 4.3 Handmatige Deployment

**Als automatische deployment niet werkt**:

1. Ga naar **hPanel → Node.js Apps → [Je App]**
2. Klik **"Redeploy"** of **"Save and redeploy"**
3. Wacht tot deployment klaar is

---

## 5. Pre-Deployment Checklist

### 5.1 Code Review

- [ ] Code getest lokaal
- [ ] Build succesvol (`pnpm build`)
- [ ] Geen console errors
- [ ] TypeScript check geslaagd (`pnpm check`)
- [ ] Geen credentials in code
- [ ] Environment variables gedocumenteerd in `.env.example`

### 5.2 Database

- [ ] Database migrations getest (als van toepassing)
- [ ] Database schema up-to-date
- [ ] Backup gemaakt (voor productie)

### 5.3 Security

- [ ] Geen hardcoded credentials
- [ ] Environment variables correct ingesteld
- [ ] CORS correct geconfigureerd
- [ ] Rate limiting actief
- [ ] Admin password sterk en uniek per omgeving

### 5.4 Performance

- [ ] Build output geoptimaliseerd
- [ ] Images geoptimaliseerd
- [ ] Geen grote bundle sizes
- [ ] Lazy loading waar mogelijk

---

## 6. Post-Deployment Verification

### 6.1 Health Check

**Test health endpoint**:
```bash
curl https://jouw-url.hostingersite.com/health
```

**Verwacht resultaat**:
```json
{
  "status": "ok",
  "timestamp": "2025-12-30T...",
  "uptime": 123.45
}
```

### 6.2 Functional Checks

- [ ] **Homepage**: Laadt correct, geen errors
- [ ] **Admin login**: Werkt, kan inloggen
- [ ] **API endpoints**: Werken (test met browser/Postman)
- [ ] **Static files**: Images, CSS, JS laden correct
- [ ] **Database**: Connectie werkt, queries werken
- [ ] **Forms**: Newsletter, contact, orders werken

### 6.3 Environment-Specific Checks

**Dev Environment**:
- [ ] `NODE_ENV=development`
- [ ] Dev database gebruikt (als aparte database)
- [ ] Dev admin password gebruikt

**Test Environment**:
- [ ] `NODE_ENV=staging`
- [ ] Test database gebruikt (als aparte database)
- [ ] Test admin password gebruikt

**Production Environment**:
- [ ] `NODE_ENV=production`
- [ ] Productie database gebruikt
- [ ] Sterk admin password gebruikt
- [ ] SSL actief (HTTPS)
- [ ] CORS correct geconfigureerd voor productie domain

---

## 7. Rollback Procedures

### 7.1 Quick Rollback (Git)

**Als deployment mislukt**:

1. **Revert laatste commit**:
   ```bash
   git revert HEAD
   git push origin [branch]
   ```

2. **Of checkout vorige commit**:
   ```bash
   git log  # Vind goede commit hash
   git checkout [commit-hash]
   git push origin [branch] --force  # ⚠️ Alleen in noodgeval!
   ```

### 7.2 Hostinger Rollback

**Via hPanel**:

1. Ga naar **hPanel → Node.js Apps → [Je App]**
2. Klik **"Redeploy"** (deployt laatste commit opnieuw)
3. Of wijzig **Branch** naar vorige commit (als mogelijk)

### 7.3 Database Rollback

**Als database wijzigingen problemen veroorzaken**:

1. **Restore backup** (als beschikbaar):
   ```bash
   mysql -u DB_USER -p DB_NAME < backup.sql
   ```

2. **Of revert migration** (als migration script):
   ```bash
   # Run reverse migration
   ```

---

## 8. Troubleshooting

### 8.1 Deployment Fails

**Symptomen**: App start niet, 503 error, build fails

**Oplossingen**:

1. **Check build logs** in hPanel → Node.js Apps → [Je App] → Build Logs
2. **Check app logs** in hPanel → Node.js Apps → [Je App] → Logs
3. **Veelvoorkomende problemen**:
   - Dependencies niet geïnstalleerd → Check `package.json`
   - Build errors → Check TypeScript errors lokaal
   - Environment variables ontbreken → Check hPanel config
   - Database connectie fails → Check database credentials

### 8.2 Database Connectie Fails

**Symptomen**: `ECONNREFUSED`, `Access denied`, database errors

**Oplossingen**:

1. **Check database credentials** in hPanel → Databases
2. **Check environment variables** in hPanel → Node.js Apps → [Je App] → Environment Variables
3. **Test connectie**:
   ```bash
   mysql -h DB_HOST -u DB_USER -p DB_NAME
   ```
4. **Check database bestaat** en schema is geïmporteerd

### 8.3 CORS Errors

**Symptomen**: `CORS policy`, API calls falen

**Oplossingen**:

1. **Check `ALLOWED_ORIGINS`** in hPanel environment variables
2. **Voeg URL toe** (zowel `http://` als `https://`, geen trailing slash)
3. **Voorbeeld**:
   ```env
   ALLOWED_ORIGINS=https://jouw-url.hostingersite.com,http://jouw-url.hostingersite.com
   ```

### 8.4 File Upload Fails

**Symptomen**: Uploads werken niet, `413 Payload Too Large`

**Oplossingen**:

1. **Check file size limits**:
   - Multer limit: 50MB (in code)
   - Server limit: Check Hostinger limits
2. **Check file permissions**:
   ```bash
   chmod 755 server/uploads/digital
   ```
3. **Check disk space** in hPanel

### 8.5 Build Errors

**Symptomen**: `npm error`, `vite: command not found`, permission errors

**Oplossingen**:

1. **Check `package.json`** - alle dependencies aanwezig?
2. **Check `.npmrc`** - `legacy-peer-deps=true` aanwezig?
3. **Check `postinstall` script** - fix permissions voor `node_modules/.bin`
4. **Check Node.js versie** in hPanel (moet 18+ zijn)

---

## 9. Lessons Learned

### 9.1 Van Kunststreken Project

**Structuur**:
- ✅ Gescheiden routes (`admin.js`, `api.js`, `auth.js`)
- ✅ Middleware structuur (`auth.js`, `errorHandler.js`)
- ✅ Services layer (`emailService.js`, etc.)
- ✅ Dashboard met statistieken
- ✅ Traffic light status indicators

**Branch Management**:
- ✅ Main voor static versie
- ✅ Nodejs-version branch voor Node.js versie
- ✅ Duidelijke scheiding tussen static en Node.js

**Deployment**:
- ✅ Static versie voor Hostinger static hosting
- ✅ Node.js versie voor Node.js hosting
- ✅ Duidelijke deployment instructies per versie

### 9.2 Van Eerdere Deployments

**Postinstall Script** (commit b8c1535):
- ✅ Fix voor `node_modules/.bin` permissions
- ✅ Voeg toe aan `package.json`:
  ```json
  "postinstall": "chmod +x node_modules/.bin/* 2>/dev/null || true"
  ```

**.npmrc Config** (commit 40231cf):
- ✅ `legacy-peer-deps=true` voor dependency resolution
- ✅ Voorkomt `ERESOLVE` errors

**403 Forbidden** (commits 5adc936, bcb88c4):
- ✅ Check `.htaccess` voor verkeerde `PassengerBaseURI`
- ✅ Verwijder `PassengerBaseURI /` als niet nodig

**Path Resolution** (commit 3f8aec5):
- ✅ Fix voor bundled code path resolution
- ✅ Gebruik `BASE_DIR` voor production vs development

**Environment Variables**:
- ✅ **ALTIJD** in hPanel instellen, niet alleen in `.env`
- ✅ `.env` werkt niet automatisch op Hostinger
- ✅ Check hPanel → Node.js Apps → [Je App] → Environment Variables

### 9.3 Gotchas om te Vermijden

**✅ DO**:
- Check `node_modules/.bin` permissions (postinstall script)
- Use `legacy-peer-deps` voor dependencies (`.npmrc`)
- Environment variables in hPanel, niet alleen `.env`
- Test path resolution in production builds
- Check `PassengerBaseURI` in `.htaccess`
- Test database connectie na deployment
- Check CORS configuratie voor alle URLs
- Maak backups voor database wijzigingen

**❌ DON'T**:
- Push credentials naar Git
- Deploy zonder testing
- Skip dev/test branches
- Vergeet environment variables in hPanel
- Vergeet database migrations
- Deploy op vrijdagavond (als mogelijk)
- Force push naar main (tenzij hotfix)

---

## 10. Best Practices

### 10.1 Code Quality

- **TypeScript**: Gebruik types, geen `any` waar mogelijk
- **Error Handling**: Altijd try/catch voor async operaties
- **Logging**: Gebruik console.log voor debugging, verwijder in productie
- **Comments**: Documenteer complexe logica
- **Naming**: Duidelijke, beschrijvende namen

### 10.2 Security

- **Credentials**: Nooit in code, altijd environment variables
- **Passwords**: Sterk, uniek per omgeving
- **CORS**: Alleen toegestane origins
- **Rate Limiting**: Actief op alle endpoints
- **Input Validation**: Valideer alle user input

### 10.3 Performance

- **Build Optimization**: Gebruik production build
- **Image Optimization**: Compress images, gebruik moderne formaten
- **Code Splitting**: Lazy load waar mogelijk
- **Caching**: Cache static assets
- **Database**: Gebruik indexes, optimaliseer queries

### 10.4 Documentation

- **README**: Up-to-date met setup instructies
- **Code Comments**: Documenteer complexe logica
- **API Docs**: Documenteer endpoints (als van toepassing)
- **Changelog**: Houd bij wat er verandert

---

## 11. Contact & Support

**Voor vragen over development workflow**:
- Check dit document eerst
- Check `HOSTINGER_GOTCHAS.md` voor deployment gotchas
- Check GitHub issues (als van toepassing)

**Voor Hostinger-specifieke problemen**:
- Check Hostinger documentatie
- Contact Hostinger support
- Check hPanel logs

---

**Laatste Update**: 2025-12-30  
**Versie**: 1.0.0  
**Auteur**: Development Team

