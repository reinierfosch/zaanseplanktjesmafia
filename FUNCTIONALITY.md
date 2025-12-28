# Functionaliteit Documentatie - De Zaanse Plankjes Maffia

## Overzicht

De Zaanse Plankjes Maffia is een platform waar bezoekers kunstwerken kunnen bekijken en bestellen. Het platform ondersteunt verschillende bestelopties: originele werken, afgeleide versies, custom werken, en print-on-demand producten.

## Hoofdfunctionaliteit

### 1. Gallery (Kunstgalerij)

**Locatie**: `/` → KUNSTGALERIE tab

**Functionaliteit**:
- Toont alle beschikbare kunstwerken in een grid layout
- Elke artwork card bevat:
  - Afbeelding (met rotatie ondersteuning)
  - Titel
  - Categorie badge (Grafische Kunst, Gedichten, Tekst, Combinatie)
  - Beschrijving (optioneel)
  - Product type icons (als beschikbaar)
  - "Bestel / Vraag Offerte" knop

**Product Type Icons**:
- Worden alleen getoond als `availableProducts` is ingesteld in admin
- Ondersteunde types: T-shirt, Mok, Notebook, Poster, Canvas, Sticker, Tote bag
- Icons worden weergegeven als kleine badges met icon en tekst

**API**: `GET /api/artworks`

### 2. Admin Panel

**Locatie**: `/admin`

**Authenticatie**:
- Wachtwoord: `admin123`
- Session-based authenticatie
- Session expires na 24 uur

**Functionaliteit**:

#### Kunstwerken Beheren
- **Lijst weergave**: Alle kunstwerken met edit/delete knoppen
- **Nieuw kunstwerk**: Formulier met:
  - Titel (verplicht)
  - Afbeelding bestandsnaam (verplicht)
  - Categorie (verplicht): Grafische Kunst, Gedichten, Tekst, Combinatie
  - Beschrijving (optioneel)
  - Rotatie (graden, optioneel)
  - Beschikbaar voor bestelling (checkbox)
  - **Product types** (checkboxes):
    - T-shirt
    - Mok
    - Notebook
    - Poster
    - Canvas
    - Sticker
    - Tote bag
  - **Image preview**: Dynamische preview met rotatie

- **Bewerken**: Zelfde formulier, pre-filled met bestaande data
- **Verwijderen**: Bevestiging dialoog

**API Endpoints**:
- `GET /api/artworks` - Lijst alle kunstwerken
- `GET /api/artworks/:id` - Haal specifiek kunstwerk op
- `POST /api/artworks` - Maak nieuw kunstwerk (admin)
- `PUT /api/artworks/:id` - Update kunstwerk (admin)
- `DELETE /api/artworks/:id` - Verwijder kunstwerk (admin)
- `POST /api/admin/login` - Login
- `GET /api/admin/me` - Check session
- `POST /api/admin/logout` - Logout

### 3. Order Wizard

**Trigger**: "Bestel / Vraag Offerte" knop op artwork card

**Functionaliteit**:
Multi-step wizard voor het plaatsen van bestellingen:

#### Stap 1: Type Selectie
- **Origineel werk**: Het originele kunstwerk zoals getoond
- **Afgeleide versie**: Variant met opties (dunner hout, andere afwerking, minder kleuren)
- **Custom origineel**: Nieuw werk gebaseerd op inspiratie
- **Product types**: Als beschikbaar, getoond als extra opties met icons
  - T-shirt print
  - Mok print
  - Notebook print
  - Poster print
  - Canvas print
  - Sticker print
  - Tote bag print

#### Stap 2: Opties (alleen voor afgeleide versie)
- Dunner hout
- Andere afwerking
- Minder kleuren

#### Stap 3: Inspiratie (alleen voor custom)
- Tekstveld voor inspiratie/verzoek

#### Stap 4: Contactgegevens
- Naam (verplicht)
- Email (verplicht, validatie)
- Telefoon (optioneel)
- Bericht (optioneel)

#### Stap 5: Bevestiging
- Success message
- Email link knop (opent email client met vooraf ingevulde email)

**API**: `POST /api/orders`

**Data Model**:
```typescript
{
  artworkId?: string;
  orderType: "original" | "derivative" | "custom" | ProductType;
  options?: {
    thinnerWood?: boolean;
    differentFinish?: boolean;
    fewerColors?: boolean;
  };
  inspiration?: string;
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
  };
}
```

### 4. Home Tab

**Functionaliteit**:
- Hero sectie met call-to-action knoppen
- Navigatie naar gallery
- Informatie over het platform

### 5. Workshops Tab

**Functionaliteit**:
- Toont beschikbare workshops
- Workshop details (prijs, duur, features)

### 6. Contact Tab

**Functionaliteit**:
- Contactformulier
- Newsletter inschrijving
- Social media links

## Data Modellen

### Artwork
```typescript
{
  id: string;
  title: string;
  image: string; // Bestandsnaam in /public/images/
  category: "grafische-kunst" | "gedichten" | "tekst" | "combinatie";
  description?: string;
  available: boolean;
  rotation?: number; // Graden voor image rotatie
  availableProducts?: ProductType[]; // Array van beschikbare product types
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
```

### ProductType
```typescript
"tshirt" | "mug" | "notebook" | "poster" | "canvas" | "sticker" | "tote-bag"
```

### OrderRequest
```typescript
{
  id: string;
  artworkId?: string;
  orderType: "original" | "derivative" | "custom" | ProductType;
  options?: {
    thinnerWood?: boolean;
    differentFinish?: boolean;
    fewerColors?: boolean;
  };
  inspiration?: string;
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
  };
  createdAt: string;
}
```

## Technische Details

### Frontend
- **Framework**: React 19 met TypeScript
- **Build tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **Form handling**: React Hook Form + Zod
- **Routing**: Wouter

### Backend
- **Framework**: Express.js
- **Data storage**: JSON files in `server/data/`
- **Authentication**: Session-based (simple password check)

### Development Setup
- Frontend: `pnpm dev` (port 3000)
- Backend: `pnpm dev:server` (port 3001)
- Vite proxy: `/api/*` → `http://localhost:3001`

## Bekende Beperkingen

1. **Image upload**: Momenteel alleen bestandsnaam invoer, geen file upload
2. **Email service**: Orders worden opgeslagen maar niet automatisch gemaild (email link wordt gegenereerd)
3. **Session storage**: Sessions worden in-memory opgeslagen (verloren bij server restart)
4. **Data persistence**: JSON files (niet geschikt voor productie)

## Toekomstige Verbeteringen

1. File upload functionaliteit voor images
2. Echte email service integratie
3. Database integratie (bijv. PostgreSQL)
4. Payment gateway integratie
5. Order tracking voor klanten
6. Admin dashboard met statistieken

