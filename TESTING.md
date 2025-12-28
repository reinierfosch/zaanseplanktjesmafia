# Testing Documentatie - De Zaanse Plankjes Maffia

## Test Plan

### 1. Admin Authenticatie
- [x] Login met correct wachtwoord
- [ ] Login met incorrect wachtwoord
- [ ] Session persistence
- [ ] Logout functionaliteit

### 2. Kunstwerk CRUD Operaties
- [ ] Nieuw kunstwerk aanmaken
- [ ] Kunstwerk bewerken
- [ ] Kunstwerk verwijderen
- [ ] Kunstwerk lijst weergave
- [ ] Image preview functionaliteit

### 3. Product Types Functionaliteit
- [ ] Product types selecteren in admin
- [ ] Product types opslaan
- [ ] Product types weergave in gallery
- [ ] Product types in order wizard

### 4. Gallery Functionaliteit
- [ ] Kunstwerken ophalen via API
- [ ] Image loading states
- [ ] Category badges
- [ ] Product type icons
- [ ] Order wizard trigger

### 5. Order Wizard
- [ ] Wizard openen
- [ ] Order type selectie
- [ ] Derivative options
- [ ] Custom inspiration input
- [ ] Contact formulier
- [ ] Order submission
- [ ] Email link generatie

### 6. API Endpoints
- [ ] GET /api/artworks
- [ ] GET /api/artworks/:id
- [ ] POST /api/artworks (admin)
- [ ] PUT /api/artworks/:id (admin)
- [ ] DELETE /api/artworks/:id (admin)
- [ ] POST /api/admin/login
- [ ] POST /api/orders

## Gevonden Issues

### Issue 1: availableProducts veld ontbreekt in bestaande data
**Status**: ✅ Opgelost
**Beschrijving**: Bestaande kunstwerken hebben geen `availableProducts` veld
**Impact**: Laag - veld is optioneel
**Oplossing**: Veld wordt automatisch toegevoegd bij eerste update

### Issue 2: availableProducts niet meegenomen in API endpoints
**Status**: ✅ Opgelost
**Beschrijving**: De POST en PUT endpoints voor artworks namen `availableProducts` niet mee in de request body
**Impact**: Hoog - product types konden niet worden opgeslagen
**Oplossing**: `availableProducts` toegevoegd aan POST en PUT endpoints in `server/index.ts`

### Issue 3: OrderWizard gebruikte altijd "tshirt" voor alle product types
**Status**: ✅ Opgelost
**Beschrijving**: Bij het selecteren van product types (mug, notebook, etc.) werd altijd "tshirt" als orderType gebruikt
**Impact**: Hoog - verkeerde order types werden opgeslagen
**Oplossing**: 
- `OrderType` uitgebreid om alle `ProductType` waarden te bevatten
- `OrderWizard` aangepast om het daadwerkelijke product type te gebruiken
- Backend `orderService` aangepast om alle product types te ondersteunen

## Test Resultaten

### Test 1: Admin Login
**Datum**: 2025-12-27
**Resultaat**: ✅ Succesvol
**Notities**: Login werkt met wachtwoord "admin123", session wordt correct opgeslagen

### Test 2: API Endpoints - GET /api/artworks
**Datum**: 2025-12-27
**Resultaat**: ✅ Succesvol
**Notities**: GET /api/artworks werkt correct, retourneert alle kunstwerken

### Test 3: API Endpoints - PUT /api/artworks/:id
**Datum**: 2025-12-27
**Resultaat**: ✅ Succesvol
**Notities**: Update van kunstwerk met `availableProducts` werkt correct na fix

### Test 4: API Endpoints - POST /api/orders
**Datum**: 2025-12-27
**Resultaat**: ✅ Succesvol
**Notities**: Order submission werkt, email link wordt correct gegenereerd

### Test 5: Product Types - Admin Interface
**Datum**: 2025-12-27
**Resultaat**: ✅ Succesvol
**Notities**: Checkboxes voor product types werken, opslaan werkt na fix

### Test 6: Product Types - Gallery Display
**Datum**: 2025-12-27
**Resultaat**: ✅ Succesvol
**Notities**: Product type icons worden correct weergegeven in gallery (getest via API)

### Test 7: Order Wizard - Product Type Selection
**Datum**: 2025-12-27
**Resultaat**: ✅ Succesvol (na fix)
**Notities**: Product types worden nu correct opgeslagen als order type na fix

