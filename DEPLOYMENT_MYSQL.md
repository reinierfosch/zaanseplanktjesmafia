# MySQL Database Setup Guide

## Database Initialisatie

### Stap 1: Maak Database Aan

Log in op je MySQL server en maak de database aan:

```sql
CREATE DATABASE plankjes_maffia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Stap 2: Maak Database Gebruiker

```sql
CREATE USER 'plankjes_user'@'localhost' IDENTIFIED BY 'sterk_wachtwoord_hier';
GRANT ALL PRIVILEGES ON plankjes_maffia.* TO 'plankjes_user'@'localhost';
FLUSH PRIVILEGES;
```

### Stap 3: Importeer Schema

```bash
mysql -u plankjes_user -p plankjes_maffia < server/scripts/create-schema.sql
```

Of via MySQL command line:

```sql
USE plankjes_maffia;
SOURCE server/scripts/create-schema.sql;
```

### Stap 4: Configureer Environment Variables

Update je `.env` bestand:

```env
DB_HOST=localhost
DB_USER=plankjes_user
DB_PASSWORD=sterk_wachtwoord_hier
DB_NAME=plankjes_maffia
DB_PORT=3306
```

### Stap 5: Migreer Bestaande Data

```bash
pnpm migrate
```

Dit migreert alle bestaande data van JSON files naar MySQL.

## Staging Database Setup

Voor staging omgeving:

```sql
CREATE DATABASE staging_plankjes_maffia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON staging_plankjes_maffia.* TO 'plankjes_user'@'localhost';
```

```bash
mysql -u plankjes_user -p staging_plankjes_maffia < server/scripts/create-staging-schema.sql
```

## Verificatie

Test de database connectie:

```bash
mysql -u plankjes_user -p plankjes_maffia -e "SHOW TABLES;"
```

Je zou de volgende tabellen moeten zien:
- artworks
- orders
- newsletter_subscriptions
- contact_submissions
- admin_sessions

## Backup

Maak regelmatig backups:

```bash
mysqldump -u plankjes_user -p plankjes_maffia > backup_$(date +%Y%m%d).sql
```

## Rollback naar JSON

Als je terug wilt naar JSON files:
1. Verwijder DB_* environment variables
2. De applicatie valt automatisch terug naar JSON files
3. Bestaande JSON files blijven intact als backup

