# SSL Setup - zaanse-plankjesmaffia.nl (Strato + Hostinger)

## 🔍 Huidige Situatie

Je hebt aangegeven dat **SSL aan staat bij Strato** voor `zaanse-plankjesmaffia.nl`. Dit is goed, maar er zijn een paar belangrijke punten:

---

## ⚠️ Belangrijk: SSL bij Strato vs Hostinger

### **Het Probleem:**
- ✅ **SSL bij Strato**: SSL is actief bij Strato (domein registrar)
- ⚠️ **SSL bij Hostinger**: SSL moet **ook** actief zijn bij Hostinger (waar je website draait)

### **Waarom beide nodig zijn:**
1. **Strato SSL**: Beveiligt de DNS/domain configuratie
2. **Hostinger SSL**: Beveiligt de daadwerkelijke website/server

**Als je website op Hostinger draait, moet SSL bij Hostinger actief zijn!**

---

## 🔧 Stap 1: SSL Activeren bij Hostinger

### **Via hPanel:**

1. **Log in op hPanel**: https://hpanel.hostinger.com
2. Ga naar **SSL → Free SSL** of **SSL Certificates**
3. Zoek `zaanse-plankjesmaffia.nl` in de lijst
4. Klik **"Activate Free SSL"** of **"Install SSL"**
5. Wacht 5-30 minuten tot het certificaat is geïnstalleerd

### **Als het domein niet in de lijst staat:**

1. Ga naar **Domains → Manage**
2. Check of `zaanse-plankjesmaffia.nl` is toegevoegd
3. Als niet, voeg het toe:
   - Klik **"Add Domain"** of **"Connect Domain"**
   - Voer in: `zaanse-plankjesmaffia.nl`
   - Kies **"Use existing domain"**
4. Daarna: Ga terug naar **SSL** en activeer SSL

---

## 🔧 Stap 2: DNS Configuratie Controleren

### **Check of DNS correct is:**

```bash
# Test DNS
dig zaanse-plankjesmaffia.nl
# Moet wijzen naar: 46.202.156.148 (Hostinger IP)
```

### **Als DNS niet correct is:**

**Bij Strato (via web interface):**
1. Log in: https://www.strato.nl
2. Ga naar: **Mijn Strato → Domeinen → zaanse-plankjesmaffia.nl**
3. Klik: **"DNS beheer"** of **"DNS-instellingen"**
4. Voeg toe/wijzig:
   - **A Record** voor `@` → `46.202.156.148`
   - **A Record** voor `www` → `46.202.156.148`
5. Sla op

---

## 🔧 Stap 3: SSL Certificaat Verificatie

### **Test SSL Certificaat:**

```bash
# Test SSL connectie
openssl s_client -connect zaanse-plankjesmaffia.nl:443 -servername zaanse-plankjesmaffia.nl < /dev/null 2>&1 | grep -E "(subject=|issuer=|Verify return code)"

# Test HTTPS
curl -I https://zaanse-plankjesmaffia.nl
```

### **Verwachte Resultaten:**
- ✅ **Verify return code: 0 (ok)** → Certificaat is geldig
- ✅ **HTTP/2 200** → Website werkt via HTTPS
- ❌ **SSL error** → Certificaat probleem (zie troubleshooting)

---

## 🔧 Stap 4: Environment Variables Updaten

### **Update ALLOWED_ORIGINS in .env:**

**Via SSH:**
```bash
ssh -p 65002 u127066462@46.202.156.148
cd domains/indigo-porpoise-872121.hostingersite.com/public_html
nano .env
# Update ALLOWED_ORIGINS:
# ALLOWED_ORIGINS=https://zaanse-plankjesmaffia.nl,https://www.zaanse-plankjesmaffia.nl,https://indigo-porpoise-872121.hostingersite.com
# Save and exit (Ctrl+X, Y, Enter)
touch tmp/restart.txt  # Restart Passenger
```

**Of via hPanel → Node.js Apps → Environment Variables:**
- Update `ALLOWED_ORIGINS` met `https://zaanse-plankjesmaffia.nl,https://www.zaanse-plankjesmaffia.nl`

---

## 🐛 Troubleshooting

### **Probleem 1: SSL Error bij curl**
```
curl: (35) LibreSSL/3.3.6: error:1404B438:SSL routines:ST_CONNECT:tlsv1 alert internal error
```

**Oplossing:**
1. Check of SSL is geactiveerd bij Hostinger (niet alleen Strato)
2. Wacht 5-30 minuten na SSL activatie
3. Test opnieuw: `curl -I https://zaanse-plankjesmaffia.nl`

### **Probleem 2: "SSL certificate not found"**
**Oplossing:**
1. Check of domein is toegevoegd aan Hostinger
2. Activeer SSL in hPanel → SSL
3. Wacht tot certificaat is geïnstalleerd

### **Probleem 3: "Mixed content" of "Insecure connection"**
**Oplossing:**
1. Zorg dat alle resources (images, CSS, JS) via HTTPS worden geladen
2. Check `.htaccess` voor HTTPS redirects
3. Update `ALLOWED_ORIGINS` in `.env`

### **Probleem 4: SSL werkt maar website niet**
**Oplossing:**
1. Check of domein is gekoppeld aan website in Hostinger
2. Verifieer DNS wijst naar Hostinger IP
3. Check `.htaccess` configuratie
4. Check application logs

---

## 📋 Checklist

- [ ] DNS wijst naar Hostinger IP (46.202.156.148)
- [ ] Domein toegevoegd aan Hostinger
- [ ] SSL geactiveerd bij Hostinger (niet alleen Strato)
- [ ] SSL certificaat geïnstalleerd (5-30 minuten gewacht)
- [ ] `ALLOWED_ORIGINS` geüpdatet in `.env`
- [ ] Website getest via HTTPS: `https://zaanse-plankjesmaffia.nl`
- [ ] SSL certificaat geverifieerd (Verify return code: 0)
- [ ] Geen SSL errors in browser console

---

## 🔍 SSL Status Checken

### **Via Browser:**
1. Ga naar: `https://zaanse-plankjesmaffia.nl`
2. Klik op het **slot icoon** in de adresbalk
3. Check certificaat details:
   - **Geldig**: Certificaat is geldig
   - **Uitgegeven door**: Let's Encrypt of vergelijkbaar
   - **Geldig tot**: Datum in de toekomst

### **Via Command Line:**
```bash
# Check SSL certificaat
echo | openssl s_client -connect zaanse-plankjesmaffia.nl:443 -servername zaanse-plankjesmaffia.nl 2>/dev/null | openssl x509 -noout -dates

# Test HTTPS
curl -I https://zaanse-plankjesmaffia.nl
```

---

## ⚠️ Belangrijk: Strato SSL vs Hostinger SSL

### **Strato SSL:**
- Beveiligt DNS/domain configuratie
- **Niet voldoende** voor website op Hostinger

### **Hostinger SSL:**
- Beveiligt de daadwerkelijke website
- **Vereist** als website op Hostinger draait
- Moet worden geactiveerd in hPanel

### **Beide nodig:**
- ✅ SSL bij Strato (voor domain)
- ✅ SSL bij Hostinger (voor website)

---

## 🚀 Snelle Fix

Als SSL bij Strato al aan staat, maar website nog niet werkt:

1. **Activeer SSL bij Hostinger**:
   - hPanel → SSL → Free SSL → Activate voor `zaanse-plankjesmaffia.nl`

2. **Update .env**:
   ```env
   ALLOWED_ORIGINS=https://zaanse-plankjesmaffia.nl,https://www.zaanse-plankjesmaffia.nl,https://indigo-porpoise-872121.hostingersite.com
   ```

3. **Test**:
   ```bash
   curl -I https://zaanse-plankjesmaffia.nl
   # Moet returnen: HTTP/2 200
   ```

---

## 📞 Hulp Nodig?

### **Hostinger Support:**
- **Live Chat**: Via hPanel
- **Help Center**: https://support.hostinger.com/

### **Strato Support:**
- **Email**: support@strato.nl
- **Help**: https://www.strato.nl/help/

---

**Laatste Update**: 2025-12-29  
**Status**: ⚠️ SSL bij Strato actief, moet ook bij Hostinger worden geactiveerd  
**Action Required**: Activeer SSL bij Hostinger via hPanel



