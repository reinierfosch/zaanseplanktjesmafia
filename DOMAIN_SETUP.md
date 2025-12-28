# Domain Setup - plankjesmaffia.nl naar Hostinger

## 🎯 Doel

Je eigen domein `plankjesmaffia.nl` koppelen aan je Hostinger website, zodat:
- ✅ `plankjesmaffia.nl` werkt (niet `indigo-porpoise-872121.hostingersite.com`)
- ✅ `www.plankjesmaffia.nl` werkt
- ✅ Je eigen domein wordt getoond in de adresbalk (geen redirect)

---

## 📋 Stap 1: Domein Toevoegen aan Hostinger

### Via hPanel:

1. **Log in op hPanel**: https://hpanel.hostinger.com
2. Ga naar **Domains → Add Domain** of **Domains → Manage**
3. Klik op **"Add Domain"** of **"Connect Domain"**
4. Voer in: `plankjesmaffia.nl`
5. Kies **"Use existing domain"** (niet "Register new domain")
6. Hostinger geeft je nu **DNS records** die je nodig hebt:
   - **A Record** of **Nameservers**
   - Noteer deze informatie!

---

## 📋 Stap 2: DNS Records Instellen bij Strato

### Optie A: Nameservers Gebruiken (Aanbevolen)

Als Hostinger nameservers geeft:

1. **Log in op Strato**: https://www.strato.nl
2. Ga naar **Mijn Strato → Domeinen → plankjesmaffia.nl**
3. Klik op **"DNS beheer"** of **"Nameservers"**
4. Wijzig de nameservers naar die van Hostinger (bijv.):
   ```
   ns1.dns-parking.com
   ns2.dns-parking.com
   ```
   (Vervang met de exacte nameservers die Hostinger geeft)

5. **Sla op** en wacht 24-48 uur voor DNS propagatie

### Optie B: A Record Gebruiken (Alternatief)

Als Hostinger alleen een A record geeft:

1. **Log in op Strato**: https://www.strato.nl
2. Ga naar **Mijn Strato → Domeinen → plankjesmaffia.nl**
3. Klik op **"DNS beheer"** of **"DNS records"**
4. Voeg toe of wijzig:

   **A Record voor hoofddomein:**
   ```
   Type: A
   Name: @ (of leeg)
   Value: [IP adres van Hostinger - bijv. 46.202.156.148]
   TTL: 3600
   ```

   **A Record voor www subdomein:**
   ```
   Type: A
   Name: www
   Value: [Zelfde IP adres]
   TTL: 3600
   ```

   **Of CNAME voor www:**
   ```
   Type: CNAME
   Name: www
   Value: plankjesmaffia.nl (of indigo-porpoise-872121.hostingersite.com)
   TTL: 3600
   ```

5. **Sla op** en wacht 24-48 uur voor DNS propagatie

---

## 📋 Stap 3: Domein Koppelen in Hostinger

### Via hPanel:

1. Ga naar **Domains → Manage**
2. Klik op je domein `plankjesmaffia.nl`
3. Kies **"Point to Website"** of **"Connect to Website"**
4. Selecteer: `indigo-porpoise-872121.hostingersite.com`
5. Klik **"Save"** of **"Connect"**

---

## 📋 Stap 4: SSL Certificaat Activeren

### Via hPanel:

1. Ga naar **SSL → Free SSL** of **SSL Certificates**
2. Selecteer `plankjesmaffia.nl`
3. Klik **"Activate Free SSL"** of **"Install SSL"**
4. Wacht tot het certificaat is geïnstalleerd (kan 5-30 minuten duren)

**Belangrijk**: SSL werkt alleen als DNS correct is geconfigureerd!

---

## 📋 Stap 5: Environment Variables Updaten

### Via SSH (of hPanel):

Update de `ALLOWED_ORIGINS` in je `.env` bestand:

```env
ALLOWED_ORIGINS=https://plankjesmaffia.nl,https://www.plankjesmaffia.nl,https://indigo-porpoise-872121.hostingersite.com
```

**Via SSH:**
```bash
cd domains/indigo-porpoise-872121.hostingersite.com/public_html
nano .env
# Update ALLOWED_ORIGINS
# Save and exit (Ctrl+X, Y, Enter)
```

**Of via hPanel → Node.js Apps → Environment Variables:**
- Update `ALLOWED_ORIGINS` met je nieuwe domein

---

## 📋 Stap 6: Test DNS Propagatie

### Check of DNS werkt:

1. **Online DNS Checker**: https://www.whatsmydns.net/
   - Voer in: `plankjesmaffia.nl`
   - Check of het naar Hostinger IP wijst

2. **Via Command Line:**
   ```bash
   dig plankjesmaffia.nl
   nslookup plankjesmaffia.nl
   ```

3. **Test Website:**
   - Ga naar: `http://plankjesmaffia.nl` (zonder https eerst)
   - Check of het werkt
   - Daarna: `https://plankjesmaffia.nl`

---

## ⚠️ Veelvoorkomende Problemen

### Probleem 1: "DNS not propagated"
**Oplossing**: 
- Wacht 24-48 uur
- Check DNS met whatsmydns.net
- Verifieer dat DNS records correct zijn ingesteld

### Probleem 2: "SSL certificate not working"
**Oplossing**:
- Wacht tot DNS volledig is gepropageerd
- Check of domein correct is gekoppeld in Hostinger
- Probeer SSL opnieuw te activeren

### Probleem 3: "Website shows Hostinger URL"
**Oplossing**:
- Check of domein correct is gekoppeld in Hostinger
- Verifieer dat je naar `plankjesmaffia.nl` gaat (niet de Hostinger URL)
- Check `.htaccess` of redirects

### Probleem 4: "www.plankjesmaffia.nl werkt niet"
**Oplossing**:
- Voeg CNAME record toe voor `www` subdomein
- Of voeg A record toe voor `www` met zelfde IP
- Wacht op DNS propagatie

---

## 🔧 Extra: .htaccess voor www Redirect (Optioneel)

Als je altijd `www.plankjesmaffia.nl` wilt gebruiken:

Maak/update `.htaccess` in `public_html/`:

```apache
# Redirect non-www to www
RewriteEngine On
RewriteCond %{HTTP_HOST} ^plankjesmaffia\.nl$ [NC]
RewriteRule ^(.*)$ https://www.plankjesmaffia.nl/$1 [R=301,L]

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

**Of andersom (www naar non-www):**
```apache
# Redirect www to non-www
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\.plankjesmaffia\.nl$ [NC]
RewriteRule ^(.*)$ https://plankjesmaffia.nl/$1 [R=301,L]

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 📝 Checklist

- [ ] Domein toegevoegd aan Hostinger
- [ ] DNS records ingesteld bij Strato (A records of Nameservers)
- [ ] Domein gekoppeld aan website in Hostinger
- [ ] SSL certificaat geactiveerd
- [ ] Environment variables geüpdatet (ALLOWED_ORIGINS)
- [ ] DNS propagatie gecontroleerd (24-48 uur gewacht)
- [ ] Website getest op `https://plankjesmaffia.nl`
- [ ] Website getest op `https://www.plankjesmaffia.nl`
- [ ] Eigen domein wordt getoond in adresbalk (geen Hostinger URL)

---

## 🚀 Snelle Setup via SSH (Als DNS al werkt)

Als DNS al correct is ingesteld, kun je via SSH:

```bash
# Connect via SSH
ssh -p 65002 u127066462@46.202.156.148

# Update .env
cd domains/indigo-porpoise-872121.hostingersite.com/public_html
nano .env
# Update ALLOWED_ORIGINS
# Save and exit
```

---

## 📞 Hulp Nodig?

### Strato Support:
- **Email**: support@strato.nl
- **Telefoon**: Check Strato website
- **Help**: https://www.strato.nl/help/

### Hostinger Support:
- **Live Chat**: Via hPanel
- **Help Center**: https://support.hostinger.com/

---

**Belangrijk**: 
- ⏰ DNS propagatie duurt **24-48 uur**
- 🔒 SSL werkt alleen als DNS correct is
- 🌐 Test altijd eerst zonder `www`, daarna met `www`

---

**Laatste Update**: 2025-12-28  
**Versie**: 1.0.0

