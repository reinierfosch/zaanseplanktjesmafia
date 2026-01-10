# Security Policy

<<<<<<< HEAD
## 🔒 Secret Management

### ⚠️ NOOIT Committen naar Git:

- ❌ `.env` bestanden
- ❌ Hardcoded passwords in code
- ❌ API keys
- ❌ Database credentials
- ❌ SSH passwords
- ❌ SMTP credentials
- ❌ Private keys

### ✅ WEL Committen:

- ✅ `.env.example` (met placeholders)
- ✅ Documentatie (zonder echte credentials)
- ✅ Code (zonder hardcoded secrets)

---

## 📋 Environment Variables

### Gebruik `.env` Bestanden

**Lokaal (Development):**
```bash
cp .env.example .env
# Edit .env with your local credentials
```

**Productie:**
- Gebruik hPanel → Node.js Apps → Environment Variables
- Of `.env` bestand op server (niet in git!)

### Template

Zie `.env.example` voor een complete template met alle benodigde environment variables.

---

## 🛡️ Best Practices

### 1. Password Strength

**Minimale Vereisten:**
- Minimaal 16 karakters
- Mix van hoofdletters, kleine letters, cijfers en symbolen
- Uniek per service/account
- Gebruik een password manager

**Voorbeelden van Sterke Wachtwoorden:**
```
✅ Kx9#mP2$vL8@nQ5!rT3
✅ M7@nK2#pL9$vR4!tQ6
❌ password123
❌ admin123
❌ wachtwoord
```

### 2. Credential Rotation

**Rotatie Schema:**
- **Database password**: Elke 3-6 maanden
- **Admin password**: Elke 3 maanden
- **SSH password**: Elke 6 maanden
- **API keys**: Elke 6-12 maanden
- **SMTP password**: Elke 6 maanden

**Na Security Incident:**
- 🔴 **ONMIDDELLIJK** roteren van alle exposed credentials
- Zie `CREDENTIAL_ROTATION_GUIDE.md` voor instructies

### 3. Secret Storage

**Aanbevolen Tools:**
- **Password Manager**: Bitwarden, 1Password, LastPass
- **Secrets Management**: HashiCorp Vault, AWS Secrets Manager
- **Environment Variables**: `.env` files (niet in git!)

**NIET Gebruiken:**
- ❌ Plain text bestanden in git
- ❌ Hardcoded in code
- ❌ Email/chat voor credentials delen
- ❌ Screenshots van credentials

---

## 🔍 Secret Detection

### Pre-commit Hooks

**Installeer detect-secrets:**
```bash
pip install detect-secrets
detect-secrets scan --baseline .secrets.baseline
```

**GitHub Secret Scanning:**
- Automatisch ingeschakeld voor GitHub repositories
- Scant commits voor exposed secrets
- Alert bij detectie

### Manual Checks

**Voor elke commit:**
1. Check of er hardcoded credentials zijn
2. Check of `.env` niet wordt gecommit
3. Review alle nieuwe bestanden
4. Check documentatie voor exposed secrets

---

## 🚨 Incident Response

### Als Secrets Exposed Zijn:

1. **ONMIDDELLIJK**:
   - Verwijder secrets uit code/documentatie
   - Commit fix naar repository
   - Force push (als nodig voor git history cleanup)

2. **Binnen 1 Uur**:
   - Roteer alle exposed credentials
   - Zie `CREDENTIAL_ROTATION_GUIDE.md`
   - Monitor logs voor suspicious activity

3. **Binnen 24 Uur**:
   - Review git history (gebruik `git-filter-repo` indien nodig)
   - Update security procedures
   - Document incident

4. **Follow-up**:
   - Implementeer preventieve maatregelen
   - Train team op security best practices
   - Setup automated secret scanning

---

## 📝 Code Review Checklist

**Voor elke Pull Request:**

- [ ] Geen hardcoded credentials
- [ ] Geen `.env` bestanden
- [ ] Geen API keys in code
- [ ] Geen database passwords
- [ ] Documentatie gebruikt placeholders
- [ ] Environment variables gebruikt waar nodig
- [ ] Secrets niet in commit messages

---

## 🔐 SSH Security

### Best Practices:

1. **Gebruik SSH Keys** (in plaats van passwords):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ssh-copy-id user@host
   ```

2. **Disable Password Authentication** (als mogelijk):
   - Configureer SSH server
   - Gebruik alleen key-based authentication

3. **SSH Scripts Lokaal Behouden**:
   - SSH scripts met credentials NIET in git
   - Gebruik `.gitignore` om ze uit te sluiten
   - Sla op in lokale directory (niet in repository)

---

## 🗄️ Database Security

### Best Practices:

1. **Sterke Wachtwoorden**:
   - Minimaal 16 karakters
   - Uniek per database
   - Gebruik password manager

2. **Minimale Rechten**:
   - Database user heeft alleen benodigde rechten
   - Geen root access voor applicatie
   - Separate users voor verschillende doeleinden

3. **Connection Security**:
   - Gebruik SSL/TLS waar mogelijk
   - Beperk database toegang tot localhost
   - Gebruik connection pooling

---

## 📧 Email Security

### SMTP Best Practices:

1. **Sterke Wachtwoorden**:
   - Uniek voor email account
   - Niet hetzelfde als andere accounts
   - Gebruik app-specific passwords waar mogelijk

2. **Secure Connections**:
   - Gebruik TLS/SSL (SMTP_PORT=587 met SMTP_SECURE=false)
   - Of SSL (SMTP_PORT=465 met SMTP_SECURE=true)

3. **Environment Variables**:
   - Sla SMTP credentials op in `.env`
   - Gebruik nooit hardcoded in code

---

## 🔄 Regular Security Tasks

### Maandelijks:

- [ ] Review exposed secrets (GitHub alerts)
- [ ] Check voor updates in dependencies
- [ ] Review access logs voor suspicious activity
- [ ] Update security documentatie

### Kwartaal:

- [ ] Rotate admin passwords
- [ ] Review database access
- [ ] Audit environment variables
- [ ] Security training voor team

### Halfjaarlijks:

- [ ] Rotate database passwords
- [ ] Rotate SSH passwords
- [ ] Review security policies
- [ ] Penetration testing (optioneel)

---

## 📚 Resources

### Tools:

- **detect-secrets**: Pre-commit secret detection
- **git-secrets**: AWS secret prevention
- **GitGuardian**: Automated secret scanning
- **Bitwarden/1Password**: Password management

### Documentation:

- **GitHub Secret Scanning**: https://docs.github.com/en/code-security/secret-scanning
- **OWASP Secrets Management**: https://owasp.org/
- **git-filter-repo**: https://github.com/newren/git-filter-repo

---

## 📞 Reporting Security Issues

### Als je een Security Issue Vindt:

1. **NIET** openbaar maken
2. **Email**: security@plankjesmaffia.nl (of je security contact)
3. **Beschrijf**:
   - Type issue
   - Locatie (bestand, regel)
   - Impact
   - Stappen om te reproduceren

### Response Time:

- **Kritieke issues**: Binnen 24 uur
- **Hoge prioriteit**: Binnen 48 uur
- **Medium prioriteit**: Binnen 1 week

---

## ✅ Security Checklist voor Deployment

**Voor elke deployment:**

- [ ] Geen credentials in code
- [ ] `.env` bestand correct geconfigureerd
- [ ] Environment variables ingesteld in hPanel
- [ ] Sterke wachtwoorden gebruikt
- [ ] Database toegang beperkt
- [ ] SSL/TLS geconfigureerd
- [ ] CORS correct geconfigureerd
- [ ] Rate limiting actief
- [ ] Logs gemonitord
- [ ] Backups ingesteld

---

**Laatste Update**: 2025-12-28  
**Versie**: 1.0.0  
**Contact**: security@plankjesmaffia.nl

=======
## Reporting Security Issues

If you discover a security vulnerability in this project, please report it by emailing info@plankjesmaffia.nl.

## Secret Management

### Environment Variables

This project uses environment variables for sensitive configuration. **NEVER** commit actual credentials to Git.

### Setup Instructions

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual credentials in `.env`

3. Verify `.env` is in `.gitignore` (it should be by default)

### What NOT to Commit

- ❌ Database passwords
- ❌ SMTP/Email passwords
- ❌ Admin passwords
- ❌ API keys
- ❌ Any `.env` files with real credentials

### If You Accidentally Commit Secrets

1. **Immediately rotate** all exposed credentials
2. Remove secrets from Git history using tools like:
   - `git-filter-repo`
   - `BFG Repo-Cleaner`
3. Force push the cleaned repository
4. Notify all team members

### Best Practices

- Use strong, unique passwords for each service
- Enable 2FA where available
- Regularly rotate credentials
- Use environment variables for all sensitive data
- Review commits before pushing to ensure no secrets are included

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Updates

Security updates will be released as needed. Please keep your installation up to date.
>>>>>>> 63cb53105062b99635d83e33815ba6aea7b8c0ff


