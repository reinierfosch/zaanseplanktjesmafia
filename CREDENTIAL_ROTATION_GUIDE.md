# Credential Rotation Guide

## 🚨 URGENT: Rotate Exposed Credentials

Deze credentials zijn publiekelijk zichtbaar geweest in de GitHub repository en **MOETEN** onmiddellijk worden gewijzigd.

---

## 📋 Credentials die Geroteerd Moeten Worden

### 1. Database Password
- **Type**: MySQL Database Password
- **Exposed**: Database password was zichtbaar in repository
- **Impact**: Volledige database toegang
- **Urgentie**: 🔴 **KRITIEK**

### 2. Admin Password
- **Type**: Application Admin Password
- **Exposed**: Admin password was zichtbaar in repository
- **Impact**: Volledige admin toegang tot applicatie
- **Urgentie**: 🔴 **KRITIEK**

### 3. SSH Credentials (Optioneel)
- **Type**: Hostinger SSH Password
- **Exposed**: SSH password was zichtbaar in scripts
- **Impact**: Server toegang
- **Urgentie**: 🟡 **HOOG** (als scripts in git stonden)

---

## 🔄 Stap 1: Database Password Wijzigen

### Via Hostinger hPanel:

1. **Log in op hPanel**: https://hpanel.hostinger.com
2. Ga naar: **Databases → MySQL Databases**
3. Klik op je database (bijv. `u123456789_plankjes` - vervang met je eigen database naam)
4. Klik op: **"Change Password"** of **"Wachtwoord wijzigen"**
5. **Genereer een nieuw sterk wachtwoord**:
   - Minimaal 16 karakters
   - Mix van hoofdletters, kleine letters, cijfers en symbolen
   - Gebruik een password manager om het op te slaan
6. **Kopieer het nieuwe wachtwoord** (je ziet het maar één keer!)
7. Klik **"Save"** of **"Opslaan"**

### Update .env Bestand:

**Via SSH:**
```bash
cd domains/indigo-porpoise-872121.hostingersite.com/public_html
nano .env
# Update DB_PASSWORD met het nieuwe wachtwoord
# Save and exit (Ctrl+X, Y, Enter)
```

**Of via hPanel → Node.js Apps → Environment Variables:**
1. Ga naar **Node.js Apps → [Je App]**
2. Scroll naar **"Environment Variables"**
3. Klik op **DB_PASSWORD**
4. Update met het nieuwe wachtwoord
5. Klik **"Save and redeploy"**

### Verifieer Database Connectie:

**Via SSH:**
```bash
mysql -u REDACTED_DB_USER -p'NIEUW_WACHTWOORD' REDACTED_DB_NAME -e "SELECT 1;"
```

**Of test via de applicatie:**
- Ga naar je website
- Test het newsletter formulier
- Check logs voor database errors

---

## 🔄 Stap 2: Admin Password Wijzigen

### Genereer een Sterk Wachtwoord:

Gebruik een password manager of genereer een sterk wachtwoord:
- Minimaal 16 karakters
- Mix van hoofdletters, kleine letters, cijfers en symbolen
- Uniek (niet gebruikt voor andere accounts)

**Voorbeeld sterk wachtwoord** (gebruik dit NIET, genereer je eigen):
```
Kx9#mP2$vL8@nQ5!rT3
```

### Update .env Bestand:

**Via SSH:**
```bash
cd domains/indigo-porpoise-872121.hostingersite.com/public_html
nano .env
# Update ADMIN_PASSWORD met het nieuwe wachtwoord
# Save and exit (Ctrl+X, Y, Enter)
```

**Of via hPanel → Node.js Apps → Environment Variables:**
1. Ga naar **Node.js Apps → [Je App]**
2. Scroll naar **"Environment Variables"**
3. Klik op **ADMIN_PASSWORD**
4. Update met het nieuwe wachtwoord
5. Klik **"Save and redeploy"**

### Verifieer Admin Login:

1. Wacht 1-2 minuten (voor app restart)
2. Ga naar: `https://indigo-porpoise-872121.hostingersite.com/admin`
3. Log in met het nieuwe wachtwoord
4. Het zou moeten werken! ✅

---

## 🔄 Stap 3: SSH Password Wijzigen (Optioneel)

Als je SSH password ook exposed was:

### Via Hostinger hPanel:

1. **Log in op hPanel**: https://hpanel.hostinger.com
2. Ga naar: **Advanced → SSH Access**
3. Klik op: **"Change Password"** of **"Wachtwoord wijzigen"**
4. Genereer een nieuw sterk wachtwoord
5. Kopieer en sla het op in een password manager
6. Klik **"Save"**

### Update Lokale SSH Scripts:

Als je lokale SSH scripts hebt:
1. Open het script (bijv. `ssh_connect.exp`)
2. Update de `pass` variabele met het nieuwe wachtwoord
3. Sla op (lokaal, niet in git!)

---

## ✅ Verificatie Checklist

Na credential rotation:

- [ ] Database password gewijzigd in hPanel
- [ ] Database password geüpdatet in `.env` of hPanel environment variables
- [ ] Database connectie getest (geen errors in logs)
- [ ] Admin password gewijzigd in `.env` of hPanel environment variables
- [ ] Admin login getest met nieuw wachtwoord
- [ ] SSH password gewijzigd (als nodig)
- [ ] Alle nieuwe wachtwoorden opgeslagen in password manager
- [ ] Oude wachtwoorden verwijderd uit password manager
- [ ] Team geïnformeerd over nieuwe credentials (als van toepassing)

---

## 🔍 Test Database Connectie

### Via SSH:
```bash
cd domains/indigo-porpoise-872121.hostingersite.com/public_html
mysql -u REDACTED_DB_USER -p'NIEUW_WACHTWOORD' REDACTED_DB_NAME -e "SELECT COUNT(*) FROM newsletter_subscriptions;"
```

### Via Application:
1. Ga naar je website
2. Test het newsletter formulier
3. Check logs: `tail -f .builds/logs/error.log`

---

## 🔍 Test Admin Login

1. Ga naar: `https://indigo-porpoise-872121.hostingersite.com/admin`
2. Log in met het nieuwe admin wachtwoord
3. Je zou toegang moeten hebben tot het admin panel

---

## 🚨 Als er Problemen zijn

### Database Connectie Fails:

1. **Check wachtwoord**: Is het correct gekopieerd? (geen extra spaties)
2. **Check gebruiker**: Is `DB_USER` correct?
3. **Check database naam**: Is `DB_NAME` correct?
4. **Check logs**: `tail -f .builds/logs/error.log`
5. **Test direct**: `mysql -u USER -p PASSWORD DATABASE -e "SELECT 1;"`

### Admin Login Fails:

1. **Check wachtwoord**: Is het correct in `.env`?
2. **Check environment variables**: Zijn ze geüpdatet in hPanel?
3. **Check app restart**: Heeft de app herstart na wijziging?
4. **Check logs**: Zijn er errors in de logs?

---

## 📝 Best Practices voor Toekomst

### 1. Gebruik een Password Manager
- **Aanbevolen**: Bitwarden, 1Password, LastPass
- Sla alle credentials op in een password manager
- Genereer unieke, sterke wachtwoorden

### 2. Rotate Credentials Regelmatig
- **Database password**: Elke 3-6 maanden
- **Admin password**: Elke 3 maanden
- **SSH password**: Elke 6 maanden

### 3. Gebruik Environment Variables
- **NOOIT** hardcode credentials in code
- Gebruik altijd `.env` bestanden
- Gebruik `.env.example` als template

### 4. Monitor voor Exposed Secrets
- Gebruik GitHub secret scanning
- Installeer pre-commit hooks (detect-secrets)
- Review code voordat je commit

---

## 📞 Hulp Nodig?

### Hostinger Support:
- **Live Chat**: Via hPanel
- **Email**: support@hostinger.com
- **Help Center**: https://support.hostinger.com/

### Als Credentials Niet Werken:
1. Check alle stappen opnieuw
2. Verifieer dat wachtwoorden correct zijn gekopieerd
3. Check logs voor specifieke errors
4. Contact Hostinger support als nodig

---

**Laatste Update**: 2025-12-28  
**Versie**: 1.0.0  
**Urgentie**: 🔴 **ROTEER ONMIDDELLIJK**

