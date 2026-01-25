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

**Status**: 🚧 Work in Progress

**Verze**: 1.0.0 (MVP in development)

**Poslední update**: 2026-01-25
