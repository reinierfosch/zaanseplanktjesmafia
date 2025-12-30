# SSL Status - zaanse-plankjesmaffia.nl ✅

## ✅ **Huidige Status**

### **DNS Configuratie:**
- ✅ `zaanse-plankjesmaffia.nl` → `46.202.156.148` (Hostinger IP)
- ✅ `www.zaanse-plankjesmaffia.nl` → `46.202.156.148` (Hostinger IP)
- ✅ DNS is correct geconfigureerd

### **SSL Certificaat:**
- ✅ SSL certificaat is **geldig** (Verify return code: 0)
- ✅ SSL is actief bij Strato (zoals je hebt aangegeven)
- ⚠️ **Check**: SSL moet ook actief zijn bij Hostinger

---

## 🔍 **Wat te Controleren**

### **1. SSL bij Hostinger Activeren**

Als je website op Hostinger draait, moet SSL **ook** bij Hostinger actief zijn:

**Via hPanel:**
1. Log in: https://hpanel.hostinger.com
2. Ga naar: **SSL → Free SSL**
3. Zoek: `zaanse-plankjesmaffia.nl`
4. Klik: **"Activate Free SSL"** of **"Install SSL"**
5. Wacht 5-30 minuten

### **2. Test Website**

```bash
# Test HTTPS
curl -I https://zaanse-plankjesmaffia.nl
# Moet returnen: HTTP/2 200
```

### **3. Update Environment Variables**

Zorg dat `ALLOWED_ORIGINS` in `.env` het nieuwe domein bevat:

```env
ALLOWED_ORIGINS=https://zaanse-plankjesmaffia.nl,https://www.zaanse-plankjesmaffia.nl,https://indigo-porpoise-872121.hostingersite.com
```

---

## 📋 **Checklist**

- [x] DNS wijst naar Hostinger IP (46.202.156.148)
- [x] SSL certificaat is geldig (Verify return code: 0)
- [x] SSL is actief bij Strato
- [ ] SSL is actief bij Hostinger (check in hPanel)
- [ ] Website werkt via HTTPS: `https://zaanse-plankjesmaffia.nl`
- [ ] `ALLOWED_ORIGINS` bevat het nieuwe domein

---

## 🚀 **Volgende Stappen**

1. **Check SSL bij Hostinger**:
   - Ga naar hPanel → SSL → Free SSL
   - Check of `zaanse-plankjesmaffia.nl` SSL heeft
   - Zo niet, activeer het

2. **Test Website**:
   - Open: `https://zaanse-plankjesmaffia.nl` in je browser
   - Check of het werkt (geen SSL errors)

3. **Update .env** (als nodig):
   - Voeg `https://zaanse-plankjesmaffia.nl` toe aan `ALLOWED_ORIGINS`

---

**Status**: ✅ DNS correct, ✅ SSL certificaat geldig, ⚠️ Check SSL bij Hostinger



