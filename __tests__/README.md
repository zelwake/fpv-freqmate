# DroneFrequency - Testovací dokumentace

> **Note:** All test descriptions, test names, and code comments should be written in **English** to maintain consistency with the codebase.

## 📁 Struktura testů

```
__tests__/
├── helpers/                     # Pomocné utility pro testy
│   ├── test-utils.tsx          # Custom render s providery
│   ├── db-helpers.ts           # In-memory DB setup (připraveno pro budoucí použití)
│   └── mock-data.ts            # Testovací data (bands, devices, frequencies)
├── screens/                    # Testy pro obrazovky
│   ├── HomeScreen.test.tsx     # Hlavní vyhledávací obrazovka
│   ├── DevicesScreen.test.tsx  # Seznam zařízení
│   ├── AddDeviceScreen.test.tsx # Formulář přidání zařízení
│   └── EditDeviceScreen.test.tsx # Formulář editace zařízení
├── components/                 # Testy pro komponenty
│   ├── DeviceList.test.tsx     # Seznam + přepínání režimů
│   ├── DeviceCard.test.tsx     # Karta zařízení
│   ├── SettingResult.test.tsx  # Zobrazení výsledku vyhledávání
│   └── FrequencySuggestions.test.tsx # Návrhy frekvencí
├── frequency.test.ts           # Unit testy pro frequency utils
└── setup.ts                    # Globální setup a mocky
```

## 🚀 Spuštění testů

```bash
# Všechny testy
pnpm test

# Watch režim (sleduje změny)
pnpm test:watch

# Konkrétní test file
pnpm test HomeScreen

# S code coverage
pnpm test -- --coverage
```

## 📋 Testovací scénáře

### ✅ Implementované testy

#### **HomeScreen**

- ✅ Alert při vyhledávání bez vybraného zařízení
- 📝 Todo: Validace frekvence, vyhledávání s VTX/VRX, suggestions

#### **Utility testy (frequency.test.ts)**

- ✅ findExactMatch - nalezení přesné frekvence
- ✅ findNearestFrequencies - nalezení nejbližších frekvencí
- ✅ calculateInterferenceScore - výpočet interference

### 📝 TODO testy (připravené scénáře)

#### **DevicesScreen** (28 todo testů)

- Prázdný stav
- Mazání zařízení
- Navigace
- Loading states

#### **AddDeviceScreen** (41 todo testů)

- Validace formuláře
- Úspěšné vytvoření
- Navigation
- Loading states
- BandSelector interakce

#### **EditDeviceScreen** (35 todo testů)

- Načtení dat
- Validace
- Update zařízení
- Error handling

#### **DeviceList** (24 todo testů)

- Přepínání edit/delete režimů
- Vizuální změny
- Navigation
- Mazání

#### **SettingResult** (14 todo testů)

- Zobrazení VTX/VRX výsledků
- Band alias
- Styling

#### **FrequencySuggestions** (17 todo testů)

- Zobrazení návrhů
- Interakce
- Edge cases

#### **DeviceCard** (14 todo testů)

- Zobrazení informací
- Edit/delete režimy
- Styling

**Celkem: 168 připravených TODO testů + 12 implementovaných = 180 testů**

## 🛠️ Struktura testu

### Základní šablona

```typescript
import { renderWithProviders } from '../helpers/test-utils';
import { TEST_DATA } from '../helpers/mock-data';

describe('MyComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByText } = renderWithProviders(<MyComponent />);
    expect(getByText('Hello')).toBeTruthy();
  });
});
```

### S mockem databázových queries

```typescript
// Na začátku souboru
jest.mock('@/db/queries', () => ({
  getDevices: jest.fn(() => Promise.resolve([])),
  createDevice: jest.fn(() => Promise.resolve(1)),
}));

// V testu
import * as queries from '@/db/queries';

it('should fetch devices', async () => {
  (queries.getDevices as jest.Mock).mockResolvedValue([...testDevices]);

  const { getByText } = renderWithProviders(<DeviceList />);

  await waitFor(() => {
    expect(getByText('Test Device')).toBeTruthy();
  });
});
```

### S testováním alertů

```typescript
import { Alert } from 'react-native';

it('should show alert on error', async () => {
  const { getByText } = renderWithProviders(<MyScreen />);

  fireEvent.press(getByText('Delete'));

  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      expect.stringContaining('failed')
    );
  });
});
```

## 🔧 Mocky a konfigurace

### Globální mocky (setup.ts)

- **Expo SQLite** - Mock in-memory databáze
- **AsyncStorage** - Mock key-value storage
- **Alert** - Mock s console.log výstupem
- **Expo Router** - Mock navigace
- **Expo Haptics** - Mock haptické zpětné vazby
- **@expo/vector-icons** - Mock jako Text komponenta

### Custom render (test-utils.tsx)

`renderWithProviders()` automaticky obalí komponentu:

- `QueryClientProvider` - s fresh QueryClient pro každý test
- `ThemeProvider` - pro theme colors
- `DeviceScreenProvider` - volitelně pro device context

```typescript
const { getByText, queryClient } = renderWithProviders(
  <MyComponent />,
  { withDeviceContext: true }
);
```

## 📊 Pokrytí kódem

Pro generování code coverage reportu:

```bash
pnpm test -- --coverage --collectCoverageFrom="app/**/*.{ts,tsx}" --collectCoverageFrom="components/**/*.{ts,tsx}"
```

## ⚠️ Známé problémy

### Act warnings

Warnings typu "not wrapped in act(...)" od TanStack Query jsou známý problém a nejsou kritické.
Souvisí s asynchronními updates při načítání dat. Lze ignorovat nebo vyřešit správnou konfigurací notifyManager.

## 🔄 Další kroky

1. **Implementovat zbývající testy** - postupně dokončit TODO testy
2. **E2E testy** - zvážit Detox nebo Maestro pro end-to-end testy
3. **Snapshot testy** - pro UI komponenty pokud bude potřeba
4. **Performance testy** - pro kritické operace (vyhledávání frekvencí)

## 📚 Užitečné odkazy

- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest](https://jestjs.io/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
