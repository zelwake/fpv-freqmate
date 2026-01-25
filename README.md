# DroneFrequency 🚁

React Native aplikace pro snadné nastavování VTX/VRX kanálů na dronech a přijímačích.

## ✨ Funkce

- 📡 **Hlavní průvodce**: Výběr VTX + VRX zařízení → zadání frekvence → zobrazení nastavení (Band + Channel)
- 🔧 **Správa zařízení**: Přidávání vlastních VTX/VRX zařízení s mapováním pásem
- 📊 **Vizualizace spektra**: Graf frekvencí + mřížka všech kanálů
- 🔍 **Hledání volných kanálů**: Detekce konfliktů a doporučení volných frekvencí
- ⭐ **Oblíbené**: Rychlý přístup k často používaným konfiguracím
- 📜 **Historie**: Automatické zaznamenávání posledních vyhledání

## 🚀 Quick Start

```bash
# Instalace závislostí
pnpm install

# Spuštění development serveru
pnpm start

# Android
pnpm android

# iOS
pnpm ios
```

## 📋 Požadavky

- Node.js 18+
- pnpm 10+
- Expo CLI
- Android Studio (pro Android) nebo Xcode (pro iOS)

## 🏗️ Tech Stack

- **Framework**: React Native 0.81.5 + Expo SDK 54
- **Routing**: Expo Router 6 (file-based)
- **Database**: SQLite + Drizzle ORM
- **State Management**: TanStack Query v5
- **TypeScript**: 5.9.2 (strict mode)
- **Testing**: Jest + React Testing Library

## 📚 Dokumentace

- [Developer Documentation](./docs/README.md) - Kompletní dokumentace pro vývojáře
- [Manual Testing Plan](./docs/MANUAL_TESTING.md) - Test plány pro manuální testování
- [Agents Guidelines](./AGENTS.md) - Pokyny pro AI coding agenty

## 🧪 Testing

```bash
# Spustit všechny testy
pnpm test

# Testy v watch módu
pnpm test:watch

# Lint
pnpm lint
```

## 📖 Oficiální pásma

Aplikace obsahuje 10 předpřipravených FPV pásem:

- **A** - Boscam A
- **B** - Boscam B
- **E** - Boscam E
- **F** - FatShark / NexWave
- **R** - Race Band
- **D** - Boscam D / DJI
- **U** - U Band
- **O** - O Band
- **L** - Low Band
- **H** - High Band

## 🗂️ Struktura projektu

```
DroneFrequency/
├── app/              # Expo Router screens
├── components/       # React komponenty
├── db/               # Databáze (schema, queries, seed)
├── hooks/            # Custom React hooks
├── utils/            # Utility funkce
├── types/            # TypeScript types
├── docs/             # Dokumentace
└── __tests__/        # Testy
```

## 🔄 Databáze

Aplikace používá SQLite s Drizzle ORM. Při prvním spuštění se automaticky:

1. Vytvoří databáze `frequencies.db`
2. Spustí migrace
3. Naplní oficiálními FPV pásmy

```bash
# Vygenerovat novou migraci
npx drizzle-kit generate

# Zobrazit Drizzle Studio
npx drizzle-kit studio
```

## 🎨 Screenshoty

_TODO: Přidat screenshoty po dokončení UI_

## 🤝 Contributing

1. Fork repository
2. Vytvořte feature branch (`git checkout -b feature/amazing-feature`)
3. Commit změny (`git commit -m 'feat: add amazing feature'`)
4. Push do branch (`git push origin feature/amazing-feature`)
5. Otevřete Pull Request

## 📝 License

MIT

## 🙏 Acknowledgments

- Expo team za skvělý framework
- FPV komunita za data oficiálních pásem
- Drizzle ORM team

---

## 🎯 Stav projektu

**Verze**: 1.0.0 (MVP in development)  
**Poslední update**: 2026-01-25

### ✅ Hotové funkce (MVP Core)

- **Database & Schema**
  - ✅ SQLite databáze s Drizzle ORM
  - ✅ Migrace a seed data (10 oficiálních FPV pásem)
  - ✅ Schema pro zařízení, pásma, frekvence, historii

- **Device Management**
  - ✅ Přidávání/úprava/mazání VTX/VRX zařízení
  - ✅ Mapování pásem k zařízením
  - ✅ Vlastní labely pro pásma (band aliases)
  - ✅ Zobrazení frekvencí u každého pásma

- **Frequency Lookup**
  - ✅ Hlavní vyhledávací obrazovka
  - ✅ Výběr VTX a/nebo VRX zařízení
  - ✅ Zadání frekvence a nalezení kanálu
  - ✅ Zobrazení nejbližších frekvencí při nepřesné shodě
  - ✅ Uložení posledního výběru
  - ✅ Zobrazení vlastních band labelů ve výsledcích
  - ✅ Historie vyhledávání (ukládání do DB)

- **UI/UX**
  - ✅ Light/Dark mode s přepínačem
  - ✅ Tab navigace (Home, Devices, Favorites, Settings)
  - ✅ Vertikální BandSelector s checkboxy a inline editorem
  - ✅ Responzivní komponenty (Input, Button, Dropdown, Card)
  - ✅ Edge-to-edge podpora (Android)

- **Code Quality**
  - ✅ TypeScript strict mode
  - ✅ ESLint + Prettier konfigurace
  - ✅ Type-safe routing (Expo Router)
  - ✅ TanStack Query pro state management

### 🚧 Rozpracované funkce

- **Favorites**
  - ⏳ UI připraveno, funkčnost zatím placeholder
  - ⏳ Databázová struktura existuje, chybí implementace

- **Settings**
  - ⏳ Základní obrazovka s theme switcherem
  - ⏳ Chybí další nastavení (jednotky, jazyk, atd.)

### 📋 TODO - Core Features

- [ ] **Spektrum vizualizace**
  - [ ] Graf zobrazující všechny frekvence
  - [ ] Mřížka kanálů s označením obsazených
  - [ ] Vizuální detekce konfliktů

- [ ] **Hledání volných kanálů**
  - [ ] Algoritmus pro detekci konfliktů
  - [ ] Doporučení volných frekvencí
  - [ ] Zobrazení vzdálenosti mezi kanály

- [ ] **Favorites (dokončení)**
  - [ ] Implementace CRUD operací
  - [ ] Rychlý přístup z hlavní obrazovky
  - [ ] Sdílení/export oblíbených konfigurací

- [ ] **Historie (rozšíření)**
  - [ ] UI pro zobrazení historie
  - [ ] Filtrování a vyhledávání
  - [ ] Možnost obnovit předchozí vyhledání

- [ ] **Custom Bands**
  - [ ] UI pro vytváření vlastních pásem
  - [ ] Validace frekvencí (8 kanálů max)
  - [ ] Import/export vlastních pásem

### 🎨 Nice to Have

- [ ] **Reverse lookup** - Zadání frekvence → okamžité zobrazení kanálu bez výběru zařízení
- [ ] **Partial device selection** - Indikátor když kanál lze nastavit jen na jednom ze zařízení (VTX nebo VRX)
- [ ] **Multi-device comparison** - Porovnání frekvencí mezi více zařízeními najednou
- [ ] **Export/Import** - Backup/restore všech dat (zařízení, oblíbené, vlastní pásma)
- [ ] **QR Code** - Sdílení konfigurace přes QR kód
- [ ] **Voice input** - Hlasové zadání frekvence
- [ ] **Widgets** - Home screen widget pro rychlý přístup
- [ ] **Apple Watch/WearOS** - Companion aplikace
- [ ] **Offline maps** - Mapa FPV pilotů poblíž s jejich frekvencemi

### 🐛 Známé problémy

_Zatím žádné reportované_

---

**Status**: 🚧 MVP Core Complete - Moving to Phase 2
