# SSH Server Report - Hostinger Server

## ✅ Wat ik heb gevonden:

### **Server Informatie:**
- **Host**: 46.202.156.148:65002
- **User**: u127066462
- **Home Directory**: `/home/u127066462`
- **Application Path**: `/home/u127066462/domains/indigo-porpoise-872121.hostingersite.com/public_html/`
- **Node.js**: Via Passenger (alt-nodejs24)
- **MySQL Client**: Beschikbaar (MariaDB 11.8.3)

### **Application Status:**
- ✅ Application is deployed in `public_html/`
- ✅ `dist/index.js` bestaat (46KB)
- ✅ `package.json` aanwezig
- ✅ `node_modules` geïnstalleerd
- ✅ Database scripts aanwezig: `server/scripts/create-schema.sql`
- ✅ Server directory met alle services
- ✅ Passenger configuratie correct (`.htaccess`)

### **Node.js App Configuratie:**
```
PassengerAppRoot: /home/u127066462/domains/indigo-porpoise-872121.hostingersite.com/public_html
PassengerAppType: node
PassengerNodejs: /opt/alt/alt-nodejs24/root/bin/node
PassengerStartupFile: dist/index.js
```

### **Problemen Gevonden:**
1. ❌ **Database niet gevonden**: `REDACTED_DB_NAME` bestaat niet of geen toegang
2. ❌ **Geen .env bestand**: Environment variables niet gevonden
3. ❌ **MySQL toegang**: Kan databases niet bekijken zonder credentials

---

## 🔧 Wat ik kan doen via SSH:

### **1. Database Setup**
- ✅ Database schema importeren
- ✅ Database tabellen aanmaken
- ✅ Database connectie testen

### **2. Application Management**
- ✅ Logs bekijken (`.builds/logs/`)
- ✅ Files uploaden/downloaden
- ✅ Environment variables instellen
- ✅ Node.js app herstarten

### **3. Troubleshooting**
- ✅ Error logs analyseren
- ✅ Database queries uitvoeren
- ✅ File permissions checken
- ✅ Process status checken

---

## 📋 Volgende Stappen:

### **Stap 1: Database Aanmaken en Schema Importeren**

Via SSH kunnen we:
1. Database aanmaken (als we credentials hebben)
2. Schema importeren vanuit `server/scripts/create-schema.sql`
3. Database connectie testen

### **Stap 2: Environment Variables Instellen**

We kunnen een `.env` bestand aanmaken met:
- Database credentials
- SMTP settings
- Admin password
- CORS settings

### **Stap 3: Application Logs Bekijken**

Check `.builds/logs/` voor:
- Startup errors
- Database connection errors
- Runtime errors

---

## 🚀 Commands die ik kan uitvoeren:

### **Database Commands:**
```bash
# Check databases
mysql -u USER -p -e "SHOW DATABASES;"

# Import schema
mysql -u USER -p DATABASE_NAME < server/scripts/create-schema.sql

# Check tables
mysql -u USER -p DATABASE_NAME -e "SHOW TABLES;"
```

### **Application Commands:**
```bash
# Check logs
tail -f .builds/logs/error.log
tail -f .builds/logs/access.log

# Check Node.js process
ps aux | grep node

# Check file permissions
ls -la dist/
ls -la server/
```

### **Environment Setup:**
```bash
# Create .env file
cat > .env << EOF
NODE_ENV=production
DB_HOST=localhost
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
EOF
```

---

## ⚠️ Wat ik nodig heb:

1. **Database Credentials**:
   - Database naam (waarschijnlijk `REDACTED_DB_NAME` of vergelijkbaar)
   - Database gebruiker
   - Database wachtwoord
   - Database host (waarschijnlijk `localhost`)

2. **Environment Variables**:
   - Admin password
   - SMTP settings (als gebruikt)
   - CORS origins

3. **Toegang tot hPanel**:
   - Om database credentials te vinden
   - Om Node.js app configuratie te checken

---

## 📝 Aanbevolen Acties:

1. **Check hPanel → Databases** voor exacte database credentials
2. **Import database schema** via SSH of phpMyAdmin
3. **Maak .env bestand** met alle environment variables
4. **Check application logs** voor specifieke errors
5. **Test database connectie** na setup

---

**Laatste Update**: 2025-12-28  
**Versie**: 1.0.0

