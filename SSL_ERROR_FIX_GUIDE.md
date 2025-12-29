# ERR_SSL_PROTOCOL_ERROR Fix Guide

## 🔍 Probleem

Je krijgt de foutmelding:
```
ERR_SSL_PROTOCOL_ERROR
The connection for this site is not secure
zaanse-plankjesmaffia.nl sent an invalid response.
```

## 🔍 Oorzaak

De SSL handshake faalt omdat:
1. ❌ **SSL is niet geactiveerd bij Hostinger** voor `zaanse-plankjesmaffia.nl`
2. ❌ **Domein staat niet in ALLOWED_ORIGINS** (nu gefixt)
3. ⚠️ **Domein moet worden toegevoegd aan Hostinger** en SSL moet worden geactiveerd

---

## ✅ Fix Stap 1: Domein Toevoegen aan Hostinger

### Via hPanel:

1. **Log in op hPanel**: https://hpanel.hostinger.com
2. Ga naar **Domains → Manage** of **Domains → Add Domain**
3. Klik **"Add Domain"** of **"Connect Domain"**
4. Voer in: `zaanse-plankjesmaffia.nl`
5. Kies **"Use existing domain"** (niet "Register new domain")
6. Klik **"Add"** of **"Connect"**

**Belangrijk**: Wacht tot het domein is toegevoegd (kan 1-5 minuten duren)

---

## ✅ Fix Stap 2: SSL Activeren bij Hostinger

### Via hPanel:

1. Ga naar **SSL → Free SSL** of **SSL Certificates**
2. Zoek `zaanse-plankjesmaffia.nl` in de lijst
3. Klik **"Activate Free SSL"** of **"Install SSL"**
4. Wacht 5-30 minuten tot het certificaat is geïnstalleerd

**Let op**: SSL werkt alleen als:
- ✅ DNS correct is geconfigureerd (wijst naar Hostinger IP)
- ✅ Domein is toegevoegd aan Hostinger
- ✅ Je wacht tot certificaat is geïnstalleerd

---

## ✅ Fix Stap 3: ALLOWED_ORIGINS Updaten (GEFIXT)

Ik heb al `zaanse-plankjesmaffia.nl` toegevoegd aan `ALLOWED_ORIGINS` in `.env`:

```env
ALLOWED_ORIGINS=https://indigo-porpoise-872121.hostingersite.com,https://plankjesmaffia.nl,https://www.plankjesmaffia.nl,https://zaanse-plankjesmaffia.nl,https://www.zaanse-plankjesmaffia.nl
```

**Status**: ✅ Gefixt via SSH

---

## 🧪 Test na Fix

### **Na SSL activatie (wacht 5-30 minuten):**

```bash
# Test SSL certificaat
openssl s_client -connect zaanse-plankjesmaffia.nl:443 -servername zaanse-plankjesmaffia.nl < /dev/null 2>&1 | grep -E "(subject=|issuer=|Verify return code)"

# Test HTTPS
curl -I https://zaanse-plankjesmaffia.nl
# Moet returnen: HTTP/2 200 (geen SSL error)
```

### **In Browser:**
1. Ga naar: `https://zaanse-plankjesmaffia.nl`
2. Check of er geen SSL error is
3. Check of het slot icoon groen is

---

## ⚠️ Veelvoorkomende Problemen

### **Probleem 1: "SSL certificate not found"**
**Oplossing**:
- Check of domein is toegevoegd aan Hostinger
- Activeer SSL in hPanel → SSL
- Wacht 5-30 minuten

### **Probleem 2: "ERR_SSL_PROTOCOL_ERROR" blijft bestaan**
**Oplossing**:
1. Check of DNS correct is (wijst naar 46.202.156.148)
2. Check of SSL is geactiveerd bij Hostinger
3. Wacht langer (tot 1 uur) voor SSL installatie
4. Probeer SSL opnieuw te activeren

### **Probleem 3: "Mixed content" warning**
**Oplossing**:
- Zorg dat alle resources (images, CSS, JS) via HTTPS worden geladen
- Check browser console voor mixed content warnings

---

## 📋 Checklist

- [x] DNS wijst naar Hostinger IP (46.202.156.148) ✅
- [x] `zaanse-plankjesmaffia.nl` toegevoegd aan ALLOWED_ORIGINS ✅
- [ ] Domein toegevoegd aan Hostinger (hPanel → Domains)
- [ ] SSL geactiveerd bij Hostinger (hPanel → SSL → Free SSL)
- [ ] SSL certificaat geïnstalleerd (5-30 minuten gewacht)
- [ ] Website getest via HTTPS: `https://zaanse-plankjesmaffia.nl`
- [ ] Geen SSL errors in browser

---

## 🚀 Snelle Fix Samenvatting

1. **hPanel → Domains → Add Domain** → `zaanse-plankjesmaffia.nl`
2. **hPanel → SSL → Free SSL** → Activeer voor `zaanse-plankjesmaffia.nl`
3. **Wacht 5-30 minuten**
4. **Test**: `https://zaanse-plankjesmaffia.nl`

---

## 📞 Hulp Nodig?

### **Hostinger Support:**
- **Live Chat**: Via hPanel
- **Help Center**: https://support.hostinger.com/

### **Als SSL niet werkt na 1 uur:**
1. Check of DNS correct is: `dig zaanse-plankjesmaffia.nl`
2. Check of domein is toegevoegd: hPanel → Domains
3. Probeer SSL opnieuw te activeren
4. Contact Hostinger support

---

**Laatste Update**: 2025-12-29  
**Status**: ⚠️ SSL moet worden geactiveerd bij Hostinger  
**Action Required**: 
1. Voeg domein toe aan Hostinger (hPanel → Domains)
2. Activeer SSL (hPanel → SSL → Free SSL)
3. Wacht 5-30 minuten


