# 503 Error Fix - Database Credentials Configured ✅

## ✅ Wat ik heb gedaan:

### 1. **Sterk Database Wachtwoord Gegenereerd**
- Nieuw wachtwoord: `Hx86VbrupgVYsPakKBnntEss`
- 24 karakters, veilig gegenereerd

### 2. **.env Bestand Bijgewerkt op Server**
Het `.env` bestand op de server is bijgewerkt met:
- `DB_HOST=localhost`
- `DB_USER=u127066462_admin`
- `DB_PASSWORD=Hx86VbrupgVYsPakKBnntEss` (nieuw wachtwoord)
- `DB_NAME=u127066462_plankjes`
- `DB_PORT=3306`

### 3. **Passenger Restart Getriggerd**
- `tmp/restart.txt` is aangemaakt om Passenger te herstarten

---

## ⚠️ **Nog Te Doen:**

### **Stap 1: Database Wachtwoord Wijzigen in hPanel**

Het database wachtwoord moet worden gewijzigd in hPanel:

1. Ga naar: **Websites → zaanse-plankjesmaffia.nl → Database → Beheer**
2. Klik op je database: `u127066462_plankjes`
3. Klik op **"Change Password"** of **"Wachtwoord wijzigen"**
4. Voer het nieuwe wachtwoord in: `Hx86VbrupgVYsPakKBnntEss`
5. Klik **"Save"** of **"Opslaan"**

### **Stap 2: Environment Variables Toevoegen in hPanel**

De environment variables moeten ook worden toegevoegd in hPanel (ze overschrijven de `.env` file):

1. Ga naar: **Websites → zaanse-plankjesmaffia.nl → Node.js Apps → Instellingen**
2. Scroll naar **"Omgevingsvariabelen"** (Environment Variables)
3. Klik op **"+ Meer toevoegen"** (Add more)
4. Voeg de volgende variabelen toe:

| Sleutel (Key) | Waarde (Value) |
|---------------|----------------|
| `DB_HOST` | `localhost` |
| `DB_USER` | `u127066462_admin` |
| `DB_PASSWORD` | `Hx86VbrupgVYsPakKBnntEss` |
| `DB_NAME` | `u127066462_plankjes` |
| `DB_PORT` | `3306` |

5. Klik **"Opslaan en opnieuw implementeren"** (Save and redeploy)

---

## 🧪 **Test Database Connectie**

Na het wijzigen van het wachtwoord en toevoegen van de environment variables:

**Via SSH:**
```bash
cd /home/u127066462/domains/zaanse-plankjesmaffia.nl/public_html
mysql -u u127066462_admin -p'Hx86VbrupgVYsPakKBnntEss' u127066462_plankjes -e "SELECT 1;"
```

Als dit werkt, zou de app moeten starten!

---

## 📋 **Checklist**

- [x] Sterk wachtwoord gegenereerd
- [x] `.env` bestand bijgewerkt op server
- [x] Passenger restart getriggerd
- [ ] Database wachtwoord gewijzigd in hPanel
- [ ] Environment variables toegevoegd in hPanel
- [ ] Database connectie getest
- [ ] Website getest

---

## 🚨 **Als het nog steeds niet werkt**

1. **Check hPanel Logs:**
   - Ga naar **Node.js Apps → [Je App] → Logs**
   - Zoek naar database connectie errors

2. **Check via SSH:**
   ```bash
   tail -50 .builds/logs/error.log
   ```

3. **Test App Manually:**
   ```bash
   /opt/alt/alt-nodejs24/root/bin/node dist/index.js
   ```

---

**Laatste Update**: 2025-12-30  
**Status**: ⚠️ Wachtend op database wachtwoord wijziging en environment variables in hPanel

