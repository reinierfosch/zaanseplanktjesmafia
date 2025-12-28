# Strato SSH Credentials - Stap voor Stap Handleiding

## 🎯 Hoe krijg je Strato SSH Gegevens?

Gebaseerd op de officiële Strato documentatie: https://www.strato.nl/faq/hosting/zo-gebruik-je-ssh-sftp/

---

## ✅ Stap 1: Check of je Pakket SSH Ondersteunt

**Belangrijk**: SSH-toegang is alleen beschikbaar vanaf het **PowerWeb-pakket** of hoger.

1. **Log in op Strato**: https://www.strato.nl
2. Ga naar: **Mijn Strato → Pakketten**
3. Check welk pakket je hebt:
   - ✅ **PowerWeb** of hoger → SSH beschikbaar
   - ❌ **Basis pakket** → Geen SSH toegang

**Als je geen PowerWeb hebt**: Upgrade je pakket of gebruik alleen de web interface voor DNS.

---

## ✅ Stap 2: Activeer SSH Toegang

1. **Log in op Strato**: https://www.strato.nl
2. Ga naar: **Mijn Strato → Beveiliging → SiteGuard**
3. **Check of SSH-toegang is ingeschakeld**:
   - Zoek naar "SSH toegang" of "SSH/SFTP"
   - Zorg dat het **ingeschakeld** is
   - Als het uitgeschakeld is, **activeer het**

**Let op**: SiteGuard kan SSH-toegang beperken. Zorg dat SSH is toegestaan.

---

## ✅ Stap 3: Vind je Master-ID (Gebruikersnaam)

Je **Master-ID** is je SSH gebruikersnaam. Je vindt het op 2 manieren:

### **Methode 1: Via Email**
- Check je email inbox voor de activeringsmail van Strato
- Je Master-ID staat daar in, bijvoorbeeld: `12345678.swh.strato-hosting.eu`

### **Methode 2: Via Strato Control Panel**
1. **Log in op Strato**: https://www.strato.nl
2. Ga naar: **Mijn Strato → Pakketten → [Je Pakket]**
3. Klik op: **"Instellingen"** of **"Pakketgegevens"**
4. Je **Master-ID** staat daar vermeld
5. **Kopieer deze** - dit is je SSH gebruikersnaam

**Voorbeeld Master-ID**: `12345678.swh.strato-hosting.eu`

---

## ✅ Stap 4: Vind je Masterwachtwoord

Je **Masterwachtwoord** is je SSH wachtwoord:

1. **Log in op Strato**: https://www.strato.nl
2. Ga naar: **Mijn Strato → Pakketten → [Je Pakket]**
3. Klik op: **"Instellingen" → "Wachtwoorden wijzigen"**
4. Je kunt hier je **Masterwachtwoord** zien of wijzigen

**Let op**: 
- Dit is het **masterwachtwoord** voor je hele Strato account
- Niet je domein-specifieke wachtwoord
- Als je het niet weet, kun je het hier resetten

---

## ✅ Stap 5: SSH Gegevens Samenvatting

Nu heb je alle gegevens:

| Gegeven | Waarde | Waar te vinden |
|---------|--------|----------------|
| **Host** | `ssh.strato.com` of `ssh.strato.de` | Vast (Strato server) |
| **Port** | `22` | Vast (standaard SSH port) |
| **Username** | `12345678.swh.strato-hosting.eu` | In Strato control panel → Pakketgegevens |
| **Password** | Je masterwachtwoord | In Strato control panel → Wachtwoorden |

---

## 🔧 Stap 6: Test SSH Verbinding

### **Via Command Line (Mac/Linux):**
```bash
ssh 12345678.swh.strato-hosting.eu@ssh.strato.com
# Of
ssh 12345678.swh.strato-hosting.eu@ssh.strato.de
```

### **Via PuTTY (Windows):**
1. Download PuTTY: https://www.chiark.greenend.org.uk/~sgtatham/putty/
2. Open PuTTY
3. Vul in:
   - **Host Name**: `ssh.strato.com`
   - **Port**: `22`
   - **Connection type**: SSH
4. Klik **"Open"**
5. Voer je Master-ID en Masterwachtwoord in

---

## ⚠️ Belangrijke Opmerkingen

### **1. SSH is alleen voor Hosting, niet voor DNS**
- SSH geeft toegang tot je **webspace** (bestanden, server)
- **DNS configuratie** gebeurt via de **web interface**
- Je kunt DNS records **niet** direct via SSH wijzigen

### **2. Alternatieve Gebruikersnaam**
Sommige Strato accounts gebruiken:
- `www.plankjesmaffia.nl` (domeinnaam als gebruikersnaam)
- In plaats van Master-ID

**Test beide** als de ene niet werkt!

### **3. SiteGuard Beperkingen**
- Als SiteGuard actief is, kan het SSH blokkeren
- Check **Beveiliging → SiteGuard** in Strato control panel
- Zorg dat SSH is toegestaan

---

## 🚀 Wat je Kunt Doen met SSH

### **✅ Wel:**
- Bestanden uploaden/downloaden
- File permissions wijzigen
- Logs bekijken
- Scripts uitvoeren
- Server configuratie beheren

### **❌ Niet:**
- DNS records direct wijzigen (moet via web interface)
- Database direct beheren (tenzij je VPS hebt)
- Server-instellingen wijzigen (beperkt op shared hosting)

---

## 📋 Checklist

Voordat je SSH gebruikt:

- [ ] Check of je PowerWeb pakket hebt (of hoger)
- [ ] SSH toegang is geactiveerd in Strato control panel
- [ ] Master-ID gevonden (in pakketgegevens)
- [ ] Masterwachtwoord bekend (of gereset)
- [ ] SiteGuard staat SSH toe
- [ ] SSH verbinding getest

---

## 🔍 Waar Vind je Alles in Strato Control Panel?

### **SSH Instellingen:**
1. Log in: https://www.strato.nl
2. **Mijn Strato → Beveiliging → SiteGuard**
3. Check "SSH toegang" of "SSH/SFTP"

### **Master-ID:**
1. **Mijn Strato → Pakketten → [Je Pakket]**
2. **"Instellingen"** of **"Pakketgegevens"**
3. Zoek naar "Master-ID" of "Gebruikers-ID"

### **Masterwachtwoord:**
1. **Mijn Strato → Pakketten → [Je Pakket]**
2. **"Instellingen" → "Wachtwoorden wijzigen"**
3. Je kunt het zien of resetten

---

## 🆘 Problemen?

### **"Permission denied"**
- Check of SSH is geactiveerd
- Verifieer Master-ID en wachtwoord
- Check SiteGuard instellingen

### **"Connection refused"**
- Check of je PowerWeb pakket hebt
- Verifieer host: `ssh.strato.com` of `ssh.strato.de`
- Check firewall instellingen

### **"Host key verification failed"**
- Accepteer de host key bij eerste verbinding
- Of verwijder oude key: `ssh-keygen -R ssh.strato.com`

---

## 📞 Strato Support

Als je problemen hebt:
- **FAQ**: https://www.strato.nl/faq/hosting/zo-gebruik-je-ssh-sftp/
- **Support**: Via Strato control panel → Support
- **Email**: support@strato.nl

---

## 🎯 Voor DNS Configuratie

**Onthoud**: DNS configuratie gebeurt via de **web interface**, niet via SSH!

1. **Mijn Strato → Domeinen → plankjesmaffia.nl**
2. **"DNS beheer"** of **"DNS-instellingen"**
3. Voeg A records toe daar

SSH is handig voor **server beheer**, maar DNS moet via de web interface.

---

**Laatste Update**: 2025-12-28  
**Versie**: 1.0.0  
**Bron**: https://www.strato.nl/faq/hosting/zo-gebruik-je-ssh-sftp/

