/**
 * Jest setup file
 * Global mocks a konfigurace pro testy
 */

import '@testing-library/react-native';
import { Alert } from 'react-native';

// ========== Mock Expo SQLite ==========
// Mock implementace pro in-memory databázi v testech
const mockSQLiteDatabase = {
  execAsync: jest.fn(() => Promise.resolve({ rows: [] })),
  runAsync: jest.fn(() => Promise.resolve({ lastInsertRowId: 1, changes: 1 })),
  getFirstAsync: jest.fn(() => Promise.resolve(null)),
  getAllAsync: jest.fn(() => Promise.resolve([])),
  prepareAsync: jest.fn(() =>
    Promise.resolve({
      executeAsync: jest.fn(() => Promise.resolve({ rows: [] })),
      finalizeAsync: jest.fn(() => Promise.resolve()),
    })
  ),
  closeAsync: jest.fn(() => Promise.resolve()),
  withTransactionAsync: jest.fn((cb) => cb()),
};

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(() => Promise.resolve(mockSQLiteDatabase)),
  openDatabaseSync: jest.fn(() => mockSQLiteDatabase),
  SQLiteProvider: ({ children }: { children: React.ReactNode }) => children,
  useSQLiteContext: jest.fn(() => mockSQLiteDatabase),
}));

// ========== Mock AsyncStorage ==========
jest.mock('expo-sqlite/kv-store', () => ({
  getItem: jest.fn((key: string) => Promise.resolve(null)),
  setItem: jest.fn((key: string, value: string) => Promise.resolve()),
  removeItem: jest.fn((key: string) => Promise.resolve()),
}));

// ========== Mock Alert ==========
jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons, options) => {
  // Pro testování můžeme rovnou zavolat onPress callback prvního tlačítka
  // Test může Alert.alert mockovat specifičtěji podle potřeby
  console.log(`[Mock Alert] ${title}: ${message}`);
});

// ========== Mock Expo Router ==========
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => true),
  setParams: jest.fn(),
};

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: jest.fn(() => ({})),
  useSegments: jest.fn(() => []),
  usePathname: jest.fn(() => '/'),
  Stack: {
    Screen: ({ children }: { children: React.ReactNode }) => children,
  },
  Tabs: {
    Screen: ({ children }: { children: React.ReactNode }) => children,
  },
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

// ========== Mock Expo Haptics ==========
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
}));

// ========== Mock Expo Font ==========
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
}));

// ========== Mock @expo/vector-icons ==========
jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return {
    Ionicons: Text,
    MaterialIcons: Text,
    FontAwesome: Text,
  };
});

// ========== Globální cleanup ==========
afterEach(() => {
  jest.clearAllMocks();
});

// Export mock router pro použití v testech
export { mockRouter };
