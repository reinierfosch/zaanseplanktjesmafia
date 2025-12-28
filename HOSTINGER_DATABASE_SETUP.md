# Hostinger Database Setup - Praktische Handleiding

## 🎯 Het Probleem

Je moet database gegevens invullen in Hostinger, maar je weet niet waar je ze vandaan haalt. Deze handleiding legt **exact** uit waar je alles vindt.

---

## 📍 Stap 1: Ga naar Databases in hPanel

1. Log in op **hPanel** (bijv. `https://hpanel.hostinger.com`)
2. In het linkermenu, zoek naar **"Databases"** of **"MySQL Databases"**
3. Klik erop

**Je ziet nu een lijst met databases (of een lege lijst als je er nog geen hebt).**

---

## 📍 Stap 2: Maak een Database (als je die nog niet hebt)

### Als je nog GEEN database hebt:

1. Klik op de knop **"Create Database"** of **"Add Database"** (meestal rechtsboven)
2. Je ziet een formulier met velden:
   - **Database Name**: Typ hier bijvoorbeeld `plankjes` (zonder prefix!)
   - **Database User**: Kies een bestaande gebruiker OF maak een nieuwe aan
   - **Password**: Kies een sterk wachtwoord (of laat Hostinger er een genereren)

3. **BELANGRIJK**: Na het aanmaken toont Hostinger de **volledige** namen, bijvoorbeeld:
   - Database naam: `u123456789_plankjes` (met prefix!)
   - Database gebruiker: `u123456789_admin` (met prefix!)

4. **Noteer deze volledige namen!** Kopieer ze naar een tekstbestand.

### Als je AL een database hebt:

1. Zoek je database in de lijst
2. Klik op de database naam of op **"Manage"** / **"Details"**

---

## 📍 Stap 3: Vind de Exacte Database Gegevens

Na het klikken op je database zie je een scherm met alle details. Dit kan er zo uitzien:

```
┌─────────────────────────────────────────────────────────┐
│ Database Details                                        │
├─────────────────────────────────────────────────────────┤
│ Database Name:  u123456789_plankjes                    │
│ Database User:  u123456789_admin                        │
│ Database Host: localhost                               │
│ Database Port: 3306                                     │
│                                                          │
│ [Show Password] [Change Password]                       │
└─────────────────────────────────────────────────────────┘
```

**Kopieer de volgende waarden:**

1. **Database Name**: Bijv. `u123456789_plankjes` (met prefix!)
2. **Database User**: Bijv. `u123456789_admin` (met prefix!)
3. **Database Host**: Meestal `localhost` (soms `127.0.0.1`)
4. **Database Port**: Meestal `3306`
5. **Password**: Klik op "Show Password" om je wachtwoord te zien

---

## 📝 Stap 4: Vul de Gegevens in bij Node.js App

Ga terug naar je **Node.js App** configuratie in hPanel en voeg deze environment variables toe:

### In het "Environment Variables" veld:

Klik op **"Add Variable"** of de **"+"** knop en voeg één voor één toe:

#### Variable 1: DB_HOST
- **Name**: `DB_HOST`
- **Value**: `localhost` (of wat je zag in Database Host)

#### Variable 2: DB_USER
- **Name**: `DB_USER`
- **Value**: `u123456789_admin` (de EXACTE waarde die je zag, inclusief prefix!)

#### Variable 3: DB_PASSWORD
- **Name**: `DB_PASSWORD`
- **Value**: `jouw_wachtwoord_hier` (het wachtwoord dat je zag of instelde)

#### Variable 4: DB_NAME
- **Name**: `DB_NAME`
- **Value**: `u123456789_plankjes` (de EXACTE waarde die je zag, inclusief prefix!)

#### Variable 5: DB_PORT
- **Name**: `DB_PORT`
- **Value**: `3306` (of wat je zag in Database Port)

---

## ✅ Voorbeeld: Wat je ziet vs. Wat je invult

### Wat je ziet in hPanel Databases:

```
Database Name:  u123456789_plankjes
Database User:  u123456789_admin
Database Host:  localhost
Database Port:  3306
Password:       MySecurePass123!
```

### Wat je invult in Node.js Environment Variables:

| Name | Value |
|------|-------|
| `DB_HOST` | `localhost` |
| `DB_USER` | `u123456789_admin` |
| `DB_PASSWORD` | `MySecurePass123!` |
| `DB_NAME` | `u123456789_plankjes` |
| `DB_PORT` | `3306` |

**Let op**: 
- ✅ Kopieer de waarden **exact** zoals ze zijn (inclusief prefix!)
- ✅ Gebruik geen aanhalingstekens in de Value velden
- ✅ De prefix (zoals `u123456789_`) is verplicht!

---

## 🚨 Veelvoorkomende Fouten

### ❌ Fout 1: Prefix vergeten
- **Fout**: `DB_NAME=plankjes` (zonder prefix)
- **Goed**: `DB_NAME=u123456789_plankjes` (met prefix!)

### ❌ Fout 2: Aanhalingstekens gebruiken
- **Fout**: `DB_HOST="localhost"` (met quotes)
- **Goed**: `DB_HOST=localhost` (zonder quotes)

### ❌ Fout 3: Verkeerde host
- **Fout**: `DB_HOST=mysql.hostinger.com` (als het niet klopt)
- **Goed**: `DB_HOST=localhost` (zoals getoond in hPanel)

---

## 🔍 Als je de gegevens niet kunt vinden

### Optie 1: Check phpMyAdmin
1. Ga naar **hPanel → Databases → phpMyAdmin**
2. Log in met je database gebruiker en wachtwoord
3. De database naam staat bovenaan in phpMyAdmin

### Optie 2: Contact Hostinger Support
Als je de gegevens echt niet kunt vinden:
1. Ga naar **hPanel → Support**
2. Open een ticket met de vraag: "Ik heb mijn MySQL database credentials nodig"
3. Ze kunnen je de exacte waarden geven

---

## ✅ Test of het werkt

Na het invullen van alle environment variables:

1. Klik op **"Save and redeploy"** in je Node.js app configuratie
2. Wacht tot de app is gedeployed
3. Check de logs in **hPanel → Node.js Apps → Logs**
4. Zoek naar errors zoals:
   - `ECONNREFUSED` = Database host/port is verkeerd
   - `Access denied` = Database user/password is verkeerd
   - `Unknown database` = Database naam is verkeerd

Als er geen errors zijn, werkt de database connectie! 🎉

---

## 📞 Hulp Nodig?

Als je nog steeds problemen hebt:
1. Check of je de **exacte** waarden hebt gekopieerd (inclusief prefix)
2. Check of je geen aanhalingstekens hebt gebruikt
3. Check of je wachtwoord correct is (let op hoofdletters/kleine letters)
4. Contact Hostinger support als het nog steeds niet werkt

---

**Laatste Update**: 2025-12-28  
**Versie**: 1.0.0
