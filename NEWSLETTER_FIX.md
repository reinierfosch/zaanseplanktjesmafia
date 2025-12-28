# Newsletter Formulier Fix

## 🐛 Het Probleem

Je krijgt een "Internal server error" bij het invullen van het nieuwsbrief formulier.

## 🔍 Oorzaak

De database tabel `newsletter_subscriptions` bestaat waarschijnlijk niet. Dit gebeurt als:
1. De database schema niet is geïmporteerd
2. De database niet is aangemaakt
3. De database connectie niet werkt

## ✅ Oplossing

### Stap 1: Check of Database bestaat

1. Ga naar **hPanel → Databases → MySQL Databases**
2. Check of je database bestaat
3. Als niet, maak een nieuwe database aan (zie `HOSTINGER_DATABASE_SETUP.md`)

### Stap 2: Importeer Database Schema

1. Ga naar **hPanel → Databases → phpMyAdmin**
2. Selecteer je database (bijv. `u123456789_plankjes`)
3. Klik op het tabblad **"SQL"**
4. Upload of plak het schema bestand `server/scripts/create-schema.sql`

**Of via command line** (als je SSH toegang hebt):
```bash
mysql -h localhost -u DB_USER -p DB_NAME < server/scripts/create-schema.sql
```

### Stap 3: Verifieer dat Tabel bestaat

In phpMyAdmin:
1. Selecteer je database
2. Check of de tabel `newsletter_subscriptions` bestaat
3. Check of de tabel `contact_submissions` bestaat

### Stap 4: Test opnieuw

1. Ga naar je website
2. Vul het nieuwsbrief formulier in
3. Het zou nu moeten werken!

## 🔧 Alternatieve Oplossing (Tijdelijk)

Als je de database niet kunt instellen, kun je tijdelijk een fallback toevoegen die de subscriptions opslaat in een JSON bestand. Dit is echter niet aanbevolen voor productie.

## 📋 Database Schema Check

De volgende tabellen moeten bestaan:
- ✅ `artworks` - Voor kunstwerken
- ✅ `orders` - Voor bestellingen
- ✅ `newsletter_subscriptions` - Voor nieuwsbrief inschrijvingen
- ✅ `contact_submissions` - Voor contact formulier inzendingen
- ✅ `admin_sessions` - Voor admin login sessies

## 🚨 Veelvoorkomende Fouten

### Fout 1: "Table doesn't exist"
**Oplossing**: Importeer het database schema (zie Stap 2)

### Fout 2: "Access denied"
**Oplossing**: Check je database credentials in environment variables

### Fout 3: "Connection refused"
**Oplossing**: Check of `DB_HOST` correct is (meestal `localhost`)

## 📞 Hulp Nodig?

Als het nog steeds niet werkt:
1. Check de server logs in hPanel → Node.js Apps → Logs
2. Zoek naar specifieke error messages
3. Verifieer dat alle environment variables correct zijn ingesteld
4. Contact Hostinger support als database problemen blijven bestaan

---

**Laatste Update**: 2025-12-28  
**Versie**: 1.0.0

