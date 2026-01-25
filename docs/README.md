# DroneFrequency - Developer Documentation

Dokumentace pro vývojáře pracující na aplikaci DroneFrequency.

## Obsah

1. [Architektura](#architektura)
2. [Databáze](#databáze)
3. [API Reference](#api-reference)
4. [Komponenty](#komponenty)
5. [Testing](#testing)
6. [Deployment](#deployment)

---

## Architektura

### Tech Stack

- **Framework**: React Native 0.81.5 + Expo SDK 54
- **Routing**: Expo Router 6 (file-based)
- **Database**: SQLite (expo-sqlite) + Drizzle ORM
- **State Management**: TanStack Query v5
- **TypeScript**: 5.9.2 (strict mode)
- **Package Manager**: pnpm

### Struktura projektu

```
DroneFrequency/
├── app/                    # Expo Router file-based routing
│   ├── (tabs)/            # Bottom tabs navigation
│   │   ├── index.tsx      # Home - Hlavní průvodce
│   │   ├── devices/       # Správa zařízení
│   │   ├── spectrum.tsx   # Vizualizace spektra
│   │   ├── find.tsx       # Najdi volný kanál
│   │   └── settings.tsx   # Nastavení
│   └── _layout.tsx        # Root layout (DB init)
├── components/            # React komponenty
├── db/                    # Database layer
│   ├── schema.ts          # Drizzle ORM schema
│   ├── queries.ts         # Database queries
│   ├── seedData.ts        # Official bands data
│   └── seed.ts            # Seed funkcefunctions
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── types/                 # TypeScript types
├── constants/             # Constants
├── docs/                  # Documentation
└── __tests__/             # Tests
```

---

## Databáze

### Schema

Aplikace používá 6 hlavních tabulek:

#### 1. `frequency_band`

Frekvenční pásma (oficiální i custom).

```typescript
{
  id: number(PK, autoincrement);
  band_sign: string; // "A", "B", "R", "F"...
  name: string; // "Boscam A", "Race Band"
  short_name: string | null; // "Boscam", "Race"
  is_custom: boolean; // false = oficiální, true = uživatelské
}
```

#### 2. `band_frequency`

Frekvence pro každý kanál v pásmu (1-8 kanálů).

```typescript
{
  band_id: number (FK -> frequency_band.id)
  channel_number: number        // 1-8
  frequency: number             // MHz

  PK: (band_id, channel_number)
}
```

#### 3. `device`

VTX/VRX zařízení (vždy uživatelská).

```typescript
{
  id: number(PK, autoincrement);
  name: string;
  type: 'VTX' | 'VRX';
  created_at: timestamp;
}
```

#### 4. `device_band`

Mapování pásem na zařízení.

```typescript
{
  device_id: number (FK -> device.id)
  band_id: number (FK -> frequency_band.id)
  band_label: string            // Label na daném zařízení ("A", "B", "1"...)

  PK: (device_id, band_id)
}
```

#### 5. `favorite`

Oblíbené konfigurace.

```typescript
{
  id: number (PK, autoincrement)
  name: string | null
  vtx_device_id: number | null (FK -> device.id)
  vrx_device_id: number | null (FK -> device.id)
  frequency: number
  created_at: timestamp
}
```

#### 6. `history`

Historie vyhledávání.

```typescript
{
  id: number (PK, autoincrement)
  vtx_device_id: number | null (FK -> device.id)
  vrx_device_id: number | null (FK -> device.id)
  frequency: number
  used_at: timestamp
}
```

### Oficiální pásma

Při prvním spuštění se naplní 10 oficiálních pásem:

| Sign | Name         | Frequencies (MHz)                              |
| ---- | ------------ | ---------------------------------------------- |
| A    | Boscam A     | 5865, 5845, 5825, 5805, 5785, 5765, 5745, 5725 |
| B    | Boscam B     | 5733, 5752, 5771, 5790, 5809, 5828, 5847, 5866 |
| E    | Boscam E     | 5705, 5685, 5665, 5645, 5885, 5905, 5925, 5945 |
| F    | FatShark     | 5740, 5760, 5780, 5800, 5820, 5840, 5860, 5880 |
| R    | Race Band    | 5658, 5695, 5732, 5769, 5806, 5843, 5880, 5917 |
| D    | Boscam D/DJI | 5362, 5399, 5436, 5473, 5510, 5547, 5584, 5621 |
| U    | U Band       | 5325, 5348, 5366, 5384, 5402, 5420, 5438, 5456 |
| O    | O Band       | 5474, 5492, 5510, 5528, 5546, 5564, 5582, 5600 |
| L    | Low Band     | 5333, 5373, 5413, 5453, 5493, 5533, 5573, 5613 |
| H    | High Band    | 5653, 5693, 5733, 5773, 5813, 5853, 5893, 5933 |

### Migrace

```bash
# Vygenerovat novou migraci po změně schema.ts
npx drizzle-kit generate

# Zobrazit Drizzle Studio (GUI pro databázi)
npx drizzle-kit studio
```

---

## API Reference

### Database Queries (`db/queries.ts`)

#### Bands

```typescript
// Získat všechna pásma včetně frekvencí
getAllBands(db: Database): Promise<BandWithFrequencies[]>

// Získat pouze oficiální pásma
getOfficialBands(db: Database): Promise<BandWithFrequencies[]>

// Vytvořit custom pásmo
createCustomBand(db: Database, data: CreateCustomBandData): Promise<number>

// Smazat custom pásmo (nelze smazat oficiální!)
deleteCustomBand(db: Database, bandId: number): Promise<boolean>
```

#### Devices

```typescript
// Získat zařízení podle typu
getDevicesByType(db: Database, type?: 'VTX' | 'VRX'): Promise<DeviceWithBands[]>

// Získat jedno zařízení
getDevice(db: Database, deviceId: number): Promise<DeviceWithBands | null>

// Vytvořit zařízení
createDevice(db: Database, data: CreateDeviceData): Promise<number>

// Aktualizovat zařízení
updateDevice(db: Database, deviceId: number, data: Partial<CreateDeviceData>): Promise<void>

// Smazat zařízení
deleteDevice(db: Database, deviceId: number): Promise<void>
```

#### Frequency Lookup

```typescript
// Hlavní vyhledávací funkce
findChannelByFrequency(
  db: Database,
  vtxDeviceId: number,
  vrxDeviceId: number,
  frequency: number
): Promise<FrequencyLookupResult | NearestFrequenciesResult | null>
```

**Return types:**

Exact match:

```typescript
{
  vtx: { bandId, bandSign, bandName, channel, frequency },
  vrx: { bandId, bandSign, bandName, channel, frequency },
  exact: true
}
```

Nearest frequencies:

```typescript
{
  lower: NearestFrequency[],  // Frekvence nižší než hledaná
  upper: NearestFrequency[],  // Frekvence vyšší než hledaná
  exact: false
}
```

#### Favorites

```typescript
// Přidat oblíbenou
addFavorite(db: Database, data: {...}): Promise<number>

// Získat všechny oblíbené
getFavorites(db: Database): Promise<Favorite[]>

// Smazat oblíbenou
deleteFavorite(db: Database, favoriteId: number): Promise<void>
```

#### History

```typescript
// Přidat do historie
addToHistory(db: Database, data: {...}): Promise<number>

// Získat nedávnou historii
getHistory(db: Database, limit?: number): Promise<History[]>

// Vyčistit starou historii
cleanOldHistory(db: Database, keepLast?: number): Promise<void>
```

### Utility Functions (`utils/frequency.ts`)

```typescript
// Najít přesnou shodu frekvence
findExactMatch(options: {...}[], targetFrequency: number): FrequencyMatch | null

// Najít nejbližší frekvence
findNearestFrequencies(options: {...}[], targetFrequency: number): {
  lower: NearestFrequency[],
  upper: NearestFrequency[]
}

// Vypočítat interference score
calculateInterferenceScore(targetFrequency: number, usedFrequencies: number[]): number

// Validovat frekvenci
isValidFrequency(frequency: number): boolean

// Formátovat frekvenci
formatFrequency(frequency: number): string
```

---

## Komponenty

### Základní UI komponenty (`components/ui/`)

```typescript
// Button
<Button onPress={() => {}} variant="primary" size="lg">
  Text
</Button>

// Input
<Input
  value={value}
  onChangeText={setText}
  placeholder="Enter frequency"
  keyboardType="numeric"
/>

// Card
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Dropdown
<Dropdown
  value={selected}
  onValueChange={setSelected}
  items={[
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
  ]}
/>
```

### Doménové komponenty

```typescript
// Device Selector
<DeviceSelector
  type={DeviceType.VTX}
  value={deviceId}
  onChange={setDeviceId}
/>

// Frequency Input
<FrequencyInput
  value={frequency}
  onChange={setFrequency}
  onSubmit={handleSearch}
/>

// Setting Result
<SettingResult
  type={DeviceType.VTX}
  band="F"
  bandName="FatShark"
  channel={4}
  frequency={5800}
/>

// Frequency Suggestions
<FrequencySuggestions
  lower={[{ frequency: 5800, ...}]}
  upper={[{ frequency: 5805, ...}]}
  onSelect={(freq) => setFrequency(freq)}
/>
```

---

## Testing

### Unit Tests

Testy jsou v `__tests__/` složce.

```bash
# Spustit všechny testy
pnpm test

# Spustit testy v watch módu
pnpm test:watch

# Spustit konkrétní test
pnpm test frequency.test.ts
```

### Test Coverage

Aktuální pokrytí:

- ✅ `utils/frequency.ts` - 100%
- ⏳ `db/queries.ts` - TODO
- ⏳ Components - TODO

### Psaní testů

```typescript
// __tests__/example.test.ts
import { functionToTest } from '../path/to/function';

describe('Function Name', () => {
  it('should do something', () => {
    const result = functionToTest(input);
    expect(result).toBe(expected);
  });

  it('should handle edge case', () => {
    const result = functionToTest(edgeCaseInput);
    expect(result).toBeNull();
  });
});
```

### Manuální testování

Viz [MANUAL_TESTING.md](./MANUAL_TESTING.md) pro kompletní test plány.

---

## Deployment

### Build pro Android

```bash
# Development build
eas build --platform android --profile development

# Production build
eas build --platform android --profile production
```

### Build pro iOS

```bash
# Development build
eas build --platform ios --profile development

# Production build
eas build --platform ios --profile production
```

### Lokální development

```bash
# Spustit Metro bundler
pnpm start

# Android
pnpm android

# iOS
pnpm ios

# Web (pro rychlé prototypování)
pnpm web
```

---

## Best Practices

### TypeScript

- ✅ Používat strict mode
- ✅ Definovat typy pro všechny parametry a return values
- ✅ Používat `interface` pro objekty, `type` pro unions
- ✅ Vyhýbat se `any` - použít `unknown` pokud typ není znám

### React Hooks

- ✅ Vždy specifikovat dependency array
- ✅ Používat `useCallback` pro funkce předávané do child komponent
- ✅ Používat `useMemo` pro náročné výpočty
- ✅ Custom hooks začínají `use...`

### Database

- ✅ Vždy používat transactions pro více operací
- ✅ Indexovat sloupce které se často vyhledávají
- ✅ Používat foreign keys pro data integrity
- ✅ Čistit starou historii pravidelně

### Performance

- ✅ Používat `FlatList` místo `ScrollView` pro dlouhé seznamy
- ✅ Implementovat `React.memo` pro komponenty které se často re-renderují
- ✅ Lazy load obrazovky pomocí `React.lazy` a `Suspense`
- ✅ Debounce user input (např. search)

### Security

- ✅ Neukládat citlivá data v plain text
- ✅ Validovat všechny user inputy
- ✅ Používat prepared statements (Drizzle ORM je dělá automaticky)

---

## Troubleshooting

### Problém: Migrace selhávají

**Řešení:**

```bash
# Smazat databázi a začít znovu
rm -rf .expo
pnpm start --clear
```

### Problém: TypeScript chyby po update

**Řešení:**

```bash
# Vyčistit cache
pnpm install
rm -rf node_modules .expo
pnpm install
```

### Problém: Metro bundler nepickuje změny

**Řešení:**

```bash
# Restart s clear cache
pnpm start --clear
```

---

## Changelog

### v1.0.0 (2026-01-25)

**Added:**

- ✅ Databázové schéma s 6 tabulkami
- ✅ Seed oficiálních 10 FPV pásem
- ✅ Core business logic (queries, utils)
- ✅ Unit tests pro frequency utilities
- ✅ Dokumentace a test plány

**TODO:**

- ⏳ Home Screen UI
- ⏳ Devices Screen UI
- ⏳ Spectrum visualization
- ⏳ Find free channel feature
- ⏳ Settings screen

---

## Contributing

1. Vytvořte feature branch z `main`
2. Implementujte změny
3. Napište testy
4. Spusťte `pnpm lint` a `pnpm test`
5. Vytvořte commit s popisnou zprávou
6. Push a vytvořte pull request

### Commit Message Format

```
<type>: <short description>

<longer description if needed>
```

Types:

- `feat`: Nová funkce
- `fix`: Oprava bugu
- `docs`: Dokumentace
- `test`: Testy
- `refactor`: Refactoring
- `chore`: Build, dependencies, atd.

---

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
