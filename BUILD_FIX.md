# Build Permission Fix - Hostinger

## 🔍 Probleem Gevonden

De build faalt met:
```
sh: line 1: /home/u127066462/domains/zaanse-plankjesmaffia.nl/public_html/node_modules/.bin/vite: Permission denied
```

## ✅ Oplossing Toegepast

### 1. **postinstall Script Toegevoegd**
Een `postinstall` script is toegevoegd aan `package.json` dat automatisch execute permissions geeft aan alle executables in `node_modules/.bin` na installatie.

```json
"postinstall": "chmod +x node_modules/.bin/* 2>/dev/null || true"
```

Dit script wordt automatisch uitgevoerd na `npm install` of `pnpm install`.

### 2. **Permissions Gefixed op Server**
De permissions zijn handmatig gefixed via SSH:
- `chmod -R +x node_modules/.bin`
- `chmod -R 755 node_modules`

---

## 🚀 Volgende Stappen

### **Optie 1: Push naar GitHub (Aanbevolen)**
1. Commit de wijziging in `package.json`:
   ```bash
   git add package.json
   git commit -m "Fix: Add postinstall script to fix node_modules/.bin permissions"
   git push
   ```

2. Hostinger zal automatisch een nieuwe deployment starten
3. Het `postinstall` script zal automatisch de permissions fixen

### **Optie 2: Handmatig Fixen op Server**
Als je niet wilt pushen, kun je de permissions handmatig fixen via SSH (al gedaan).

---

## 📋 Checklist

- [x] `postinstall` script toegevoegd aan `package.json`
- [x] Permissions gefixed op server via SSH
- [ ] Wijziging gepusht naar GitHub (optioneel)
- [ ] Nieuwe deployment getest

---

**Laatste Update**: 2025-12-30  
**Status**: ✅ Permissions gefixed, wachtend op nieuwe deployment

