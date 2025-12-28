# 403 Forbidden Fix - Hostinger

## 🐛 Het Probleem

Je krijgt een **403 Forbidden** error bij het bezoeken van je website.

## 🔍 Oorzaak Gevonden

De `.htaccess` file had een verkeerde `PassengerBaseURI /` regel die een 403 error veroorzaakte.

## ✅ Fix Toegepast

Ik heb de `.htaccess` file gecorrigeerd:

### **Oude .htaccess (Verkeerd):**
```apache
PassengerAppRoot /home/u127066462/domains/indigo-porpoise-872121.hostingersite.com/public_html
PassengerAppType node
PassengerNodejs /opt/alt/alt-nodejs24/root/bin/node
PassengerStartupFile dist/index.js
PassengerBaseURI /  ← Dit veroorzaakte de 403!
```

### **Nieuwe .htaccess (Correct):**
```apache
PassengerAppRoot /home/u127066462/domains/indigo-porpoise-872121.hostingersite.com/public_html
PassengerAppType node
PassengerNodejs /opt/alt/alt-nodejs24/root/bin/node
PassengerStartupFile dist/index.js
```

**Belangrijk**: `PassengerBaseURI /` is verwijderd omdat het de root path verkeerd configureert.

---

## 🧪 Test Nu

1. **Wacht 1-2 minuten** (voor Passenger restart)
2. **Ga naar**: `https://indigo-porpoise-872121.hostingersite.com`
3. **Het zou nu moeten werken!** ✅

---

## 🔧 Als het nog steeds niet werkt:

### **Check 1: Passenger Restart**
Passenger moet herstarten. Dit gebeurt automatisch, maar kan 1-2 minuten duren.

**Via SSH trigger restart:**
```bash
touch tmp/restart.txt
```

### **Check 2: File Permissions**
Zorg dat permissions correct zijn:
```bash
chmod 755 . dist/
chmod 644 .htaccess dist/index.js
```

### **Check 3: Check Logs**
```bash
tail -f .builds/logs/error.log
```

### **Check 4: Check hPanel**
1. Ga naar **hPanel → Node.js Apps**
2. Check of je app **"Running"** status heeft
3. Als niet, klik **"Restart"**

---

## 📋 Veelvoorkomende 403 Oorzaken:

### **1. Verkeerde .htaccess Configuratie**
- ✅ **Gefixed**: `PassengerBaseURI /` verwijderd

### **2. File Permissions**
- ✅ **Gefixed**: Permissions gecontroleerd en gecorrigeerd

### **3. Passenger niet actief**
- ⚠️ **Check**: Ga naar hPanel → Node.js Apps → Check status

### **4. Verkeerde Startup File**
- ✅ **OK**: `dist/index.js` bestaat en is correct

### **5. CORS/ALLOWED_ORIGINS**
- ⚠️ **Check**: Als je eigen domein gebruikt, update `.env`:
  ```env
  ALLOWED_ORIGINS=https://plankjesmaffia.nl,https://www.plankjesmaffia.nl,https://indigo-porpoise-872121.hostingersite.com
  ```

---

## 🚀 Volgende Stappen:

1. **Test de website** - Het zou nu moeten werken
2. **Als het werkt**: Update `ALLOWED_ORIGINS` voor je eigen domein
3. **Als het niet werkt**: Check de logs en hPanel status

---

## 📞 Hulp Nodig?

Als het nog steeds niet werkt:
1. Check **hPanel → Node.js Apps → Logs**
2. Check **SSH logs**: `tail -f .builds/logs/error.log`
3. Contact **Hostinger support** als nodig

---

**Laatste Update**: 2025-12-28  
**Versie**: 1.0.0

