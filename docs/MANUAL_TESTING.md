# DroneFrequency - Manual Testing Plan

Tento dokument obsahuje kompletní test plány pro manuální testování aplikace na fyzickém zařízení.

## Předpoklady

- Aplikace nainstalována na fyzickém Android/iOS zařízení
- První spuštění proběhlo úspěšně (databáze inicializována, oficiální pásma načtena)
- Zařízení má funkční displej a dotyková obrazovka

---

## Test Plan 1: První spuštění aplikace

### Cíl

Ověřit, že aplikace se správně inicializuje při prvním spuštění.

### Kroky

1. Nainstalovat aplikaci na čisté zařízení (nebo vymazat data aplikace)
2. Spustit aplikaci
3. Počkat na dokončení inicializace

### Očekávaný výsledek

- ✅ Zobrazí se loading obrazovka s textem "Running migrations..."
- ✅ Následně "Initializing database..."
- ✅ Po dokončení se aplikace přepne na hlavní obrazovku
- ✅ Žádné chybové hlášky
- ✅ Aplikace nepadá

### Poznámky

- Inicializace by měla trvat max 2-3 sekundy
- V konzoli (metro bundler) by měly být logy o seedování databáze

---

## Test Plan 2: Hlavní průvodce - Základní workflow

### Cíl

Otestovat hlavní funkci aplikace - výběr VTX/VRX a zadání frekvence.

### Předpoklady

- Alespoň 1 VTX zařízení vytvořeno
- Alespoň 1 VRX zařízení vytvořeno

### Scénář A: Exact Match (Frekvence existuje)

**Kroky:**

1. Otevřít aplikaci (měla by se otevřít hlavní obrazovka - Home tab)
2. Vybrat VTX zařízení z dropdownu
3. Vybrat VRX zařízení z dropdownu
4. Zadat frekvenci 5800 MHz
5. Stisknout Enter nebo kliknout mimo input

**Očekávaný výsledek:**

- ✅ VTX Setting zobrazí: Band (např. "F"), Název pásma (např. "FatShark"), Channel (např. "4")
- ✅ VRX Setting zobrazí: Odpovídající band a channel pro VRX zařízení
- ✅ Výsledky se zobrazí okamžitě
- ✅ Tlačítko "Add to Favorites" je aktivní

### Scénář B: Nearest Match (Frekvence neexistuje)

**Kroky:**

1. Zadat frekvenci 5803 MHz (neexistuje v pásmu)
2. Stisknout Enter

**Očekávaný výsledek:**

- ✅ Zobrazí se upozornění "Exact frequency not found"
- ✅ Zobrazí se 2 tlačítka s nejbližšími frekvencemi:
  - "5800 MHz" (3 MHz lower)
  - "5805 MHz" (2 MHz higher)
- ✅ Po kliknutí na některou frekvenci se automaticky vyplní input a zobrazí se nastavení

### Scénář C: Frekvence mimo rozsah

**Kroky:**

1. Zadat frekvenci 5330 MHz (velmi nízká, pod většinou pásem)
2. Stisknout Enter

**Očekávaný výsledek:**

- ✅ Zobrazí se upozornění "Exact frequency not found"
- ✅ Zobrazí se pouze tlačítko s vyšší frekvencí (např. "5333 MHz")
- ✅ Nižší frekvence se nezobrazuje (neexistuje)

---

## Test Plan 3: Přidání VTX zařízení

### Cíl

Otestovat vytvoření nového VTX zařízení s výběrem pásem.

### Kroky

1. Otevřít tab "Devices"
2. V sekci "VTX Devices" kliknout na "[+ Add]"
3. Zadat název: "My Whoop VTX"
4. Vybrat typ: VTX (radio button)
5. Vybrat pásma:
   - ☑ Race Band (R) → Label: "R"
   - ☑ FatShark (F) → Label: "F"
   - ☑ Boscam A → Label: "A"
6. Kliknout "Save Device"

### Očekávaný výsledek

- ✅ Formulář se zobrazí správně
- ✅ Všechna oficiální pásma (A, B, E, F, R, D, U, O, L, H) jsou k dispozici
- ✅ Lze vybrat více pásem
- ✅ Pro každé pásmo lze zadat label
- ✅ Po uložení se zařízení objeví v seznamu VTX Devices
- ✅ Zařízení má správný název a zobrazené pásma

### Edge Cases

**Test 1: Uložení bez vybraných pásem**

- Kroky: Zkusit uložit zařízení bez vybraných pásem
- Očekávaný výsledek: ✅ Validační chyba "Musí být vybráno alespoň jedno pásmo"

**Test 2: Duplicitní labely**

- Kroky: Vybrat 2 pásma a dát jim stejný label (např. oba "A")
- Očekávaný výsledek: ✅ Validační chyba "Labely musí být unikátní"

---

## Test Plan 4: Vytvoření custom pásma

### Cíl

Otestovat vytvoření vlastního frekvenčního pásma.

### Kroky

1. V "Add Device" formuláři kliknout na "[+ Create Custom Band]"
2. Zadat název: "My Custom Band"
3. Zadat Band Sign: "X"
4. Vybrat počet kanálů: 4
5. Zadat frekvence:
   - CH 1: 5300
   - CH 2: 5350
   - CH 3: 5400
   - CH 4: 5450
6. Kliknout "Create"

### Očekávaný výsledek

- ✅ Modal se zobrazí správně
- ✅ Počet inputů pro frekvence odpovídá vybranému počtu kanálů (4)
- ✅ Po uložení se custom pásmo objeví v seznamu dostupných pásem
- ✅ Custom pásmo lze vybrat pro zařízení
- ✅ Custom pásmo funguje v hlavním průvodci

### Edge Cases

**Test 1: Prázdné frekvence**

- Kroky: Zkusit vytvořit pásmo s nevyplněnými frekvencemi
- Očekávaný výsledek: ✅ Validační chyba "Všechny frekvence musí být vyplněny"

---

## Test Plan 5: Editace zařízení

### Cíl

Otestovat úpravu existujícího zařízení.

### Kroky

1. V seznamu zařízení kliknout na [⋮] (menu) u nějakého zařízení
2. Vybrat "Edit"
3. Změnit název zařízení
4. Přidat/odebrat nějaké pásmo
5. Změnit label některého pásma
6. Kliknout "Save"

### Očekávaný výsledek

- ✅ Formulář se předvyplní aktuálními daty
- ✅ Změny se uloží správně
- ✅ Zařízení se aktualizuje v seznamu
- ✅ Pokud je zařízení použité v hlavním průvodci, změny se projeví okamžitě

---

## Test Plan 6: Smazání zařízení

### Cíl

Otestovat smazání zařízení.

### Kroky

1. V seznamu zařízení kliknout na [⋮] u nějakého zařízení
2. Vybrat "Delete"
3. Potvrdit smazání

### Očekávaný výsledek

- ✅ Zobrazí se potvrzovací dialog
- ✅ Po potvrzení se zařízení smaže ze seznamu
- ✅ Pokud bylo zařízení použité v hlavním průvodci, dropdown se vyprázdní

---

## Test Plan 7: Oblíbené konfigurace

### Cíl

Otestovat ukládání a používání oblíbených konfigurací.

### Kroky

1. V hlavním průvodci nastavit VTX, VRX a frekvenci
2. Kliknout na "⭐ Add to Favorites"
3. Zadat název (volitelné): "Race setup"
4. Uložit
5. Otevřít tab "Settings"
6. V sekci "Favorites" by měla být nová položka
7. Kliknout na položku

### Očekávaný výsledek

- ✅ Po uložení se zobrazí potvrzení
- ✅ V Settings/Favorites se objeví nová položka
- ✅ Položka obsahuje název, VTX, VRX a frekvenci
- ✅ Po kliknutí na položku se aplikace přepne na Home tab a předvyplní data
- ✅ Lze smazat oblíbenou položku

---

## Test Plan 8: Historie použití

### Cíl

Ověřit že aplikace zaznamenává historii vyhledávání.

### Kroky

1. V hlavním průvodci provést několik vyhledání (3-5x různé frekvence)
2. Otevřít tab "Settings"
3. Zkontrolovat sekci "History"

### Očekávaný výsledek

- ✅ V historii se objevují všechna provedená vyhledání
- ✅ Nejnovější vyhledání je nahoře
- ✅ Každá položka obsahuje VTX, VRX, frekvenci a timestamp
- ✅ Po kliknutí na položku se předvyplní data v hlavním průvodci
- ✅ Historie obsahuje max 10 položek (starší se automaticky mažou)

---

## Test Plan 9: Přepínání tématu

### Cíl

Otestovat přepínání mezi světlým a tmavým režimem.

### Kroky

1. Otevřít tab "Settings"
2. V sekci "Appearance" vybrat "Dark"
3. Zkontrolovat, že se celá aplikace přepne na tmavý režim
4. Vybrat "Light"
5. Zkontrolovat, že se aplikace přepne na světlý režim
6. Vybrat "System"
7. Změnit systémové nastavení telefonu

### Očekávaný výsledek

- ✅ Přepínání mezi režimy funguje okamžitě
- ✅ Všechny obrazovky používají správné barvy
- ✅ Volba se uloží a obnoví po restartu aplikace
- ✅ "System" mód respektuje systémové nastavení telefonu

---

## Test Plan 10: Vizualizace spektra (Spectrum tab)

### Cíl

Otestovat zobrazení grafu a mřížky frekvencí.

### Kroky

1. Otevřít tab "Spectrum"
2. Zkontrolovat graf frekvencí
3. Zkontrolovat Channel Grid
4. V hlavním průvodci nastavit nějakou frekvenci
5. Vrátit se na Spectrum tab

### Očekávaný výsledek

- ✅ Graf zobrazuje všechna frekvenční pásma
- ✅ Každé pásmo je označeno svým písmenem (A, B, E, F, R, D, U, O, L, H)
- ✅ Channel Grid zobrazuje mřížku všech kanálů
- ✅ Aktuálně vybraná frekvence je zvýrazněná
- ✅ Lze kliknout na kanál v gridu a nastavit ho jako aktivní

---

## Test Plan 11: Find Free Channel

### Cíl

Otestovat nástroj pro hledání volných kanálů.

### Kroky

1. Otevřít tab "Find"
2. Kliknout "[+ Add]" a přidat používanou frekvenci: 5800
3. Přidat další frekvenci: 5760
4. Přidat další frekvenci: 5880
5. Zkontrolovat seznam doporučených kanálů

### Očekávaný výsledek

- ✅ Lze přidat více používaných frekvencí
- ✅ Doporučené kanály jsou seřazené podle nejmenšího rušení
- ✅ Pro každý doporučený kanál je uvedena vzdálenost od nejbližší používané frekvence
- ✅ Kanály příliš blízko (< 40 MHz) jsou označeny ⚠️
- ✅ Bezpečné kanály (> 40 MHz) jsou označeny ✅
- ✅ Po kliknutí na doporučený kanál se nastaví v hlavním průvodci

---

## Test Plan 12: Persistence dat

### Cíl

Ověřit, že data přežijí restart aplikace.

### Kroky

1. Vytvořit VTX a VRX zařízení
2. Vytvořit custom pásmo
3. Přidat oblíbenou konfiguraci
4. Provést několik vyhledání (historie)
5. Zavřít aplikaci (force close)
6. Otevřít aplikaci znovu

### Očekávaný výsledek

- ✅ Všechna vytvořená zařízení jsou stále k dispozici
- ✅ Custom pásmo existuje
- ✅ Oblíbené konfigurace jsou zachovány
- ✅ Historie je zachována
- ✅ Poslední výběr v hlavním průvodci je předvyplněn

---

## Test Plan 13: Validace vstupů

### Cíl

Otestovat validaci všech vstupních polí.

### Test Cases

**Frekvence v hlavním průvodci:**

- Zadání písmen: ❌ Mělo by povolit pouze čísla
- Zadání záporného čísla: ❌ Mělo by zobrazit chybu
- Zadání 0: ❌ Mělo by zobrazit chybu
- Zadání velmi vysokého čísla (10000): ⚠️ Mělo by varovat ale povolit

**Název zařízení:**

- Prázdný název: ❌ Mělo by zobrazit chybu "Název je povinný"
- Velmi dlouhý název (200 znaků): ✅ Mělo by to fungovat

**Custom Band frekvence:**

- Prázdná frekvence: ❌ Mělo by zobrazit chybu
- Neplatná frekvence: ❌ Mělo by zobrazit chybu

---

## Test Plan 14: Performance a UX

### Cíl

Otestovat výkon a uživatelskou zkušenost.

### Test Cases

**Rychlost vyhledávání:**

- Čas od zadání frekvence do zobrazení výsledků: < 100ms
- Vyhledávání nereaguje na každý keystroke (debounce)

**Scroll performance:**

- Scrollování v seznamu zařízení: Plynulé, žádné zadrhávání
- Scrollování v Channel Grid: Plynulé

**Loading states:**

- Při načítání dat se zobrazuje loading indicator
- Tlačítka během operací jsou disabled

**Error handling:**

- Při chybě se zobrazí srozumitelná hláška
- Aplikace nepadá, lze pokračovat

---

## Checklist pro release

Po implementaci všech funkcí projít tento checklist:

### MVP Funkce

- [ ] Hlavní průvodce funguje (VTX + VRX výběr + frekvence)
- [ ] Nearest frequency suggestions fungují
- [ ] Přidání VTX zařízení funguje
- [ ] Přidání VRX zařízení funguje
- [ ] Editace zařízení funguje
- [ ] Smazání zařízení funguje
- [ ] Vytvoření custom pásma funguje
- [ ] Všech 10 oficiálních pásem je načteno

### Nice-to-have funkce

- [ ] Vizualizace spektra
- [ ] Find free channel
- [ ] Oblíbené konfigurace
- [ ] Historie použití
- [ ] Přepínání tématu
- [ ] Manuál/nápověda

### Kvalita a stabilita

- [ ] Aplikace nepadá při běžném používání
- [ ] Žádné memory leaky
- [ ] Rychlost < 100ms pro vyhledávání
- [ ] Všechny testy procházejí
- [ ] Lint nehlásí chyby

### UX a Design

- [ ] Konzistentní design napříč obrazovkami
- [ ] Jasné chybové hlášky
- [ ] Loading states všude kde je potřeba
- [ ] Tlačítka mají dostatečně velkou touch area (min 44x44)
- [ ] Text je čitelný na malých i velkých displejích

### Dokumentace

- [ ] README.md aktualizovaný
- [ ] AGENTS.md aktualizovaný
- [ ] Tento test plán odpovídá aktuálnímu stavu

---

## Reporting Bugů

Při nalezení bugu prosím zaznamenejte:

1. **Název**: Stručný popis problému
2. **Kroky k reprodukci**: Přesné kroky jak problém vyvolat
3. **Očekávané chování**: Co by se mělo stát
4. **Aktuální chování**: Co se skutečně děje
5. **Prostředí**:
   - Platforma (Android/iOS)
   - Verze OS
   - Model zařízení
6. **Screenshot/Video**: Pokud možno
7. **Konzole logy**: Z Metro bundleru

---

## Poznámky k testování

- Testujte na **reálném zařízení**, ne pouze na emulátoru
- Testujte na **různých velikostech obrazovek** (malý telefon, tablet)
- Testujte v **obou orientacích** (portrait i landscape)
- Testujte při **špatném připojení** (airplane mode pro offline test)
- Testujte s **velkým množstvím dat** (10+ zařízení, 100+ položek historie)
