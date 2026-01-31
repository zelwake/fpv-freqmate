/**
 * Database helpers pro testy
 * Poskytuje funkce pro setup in-memory SQLite databáze a seed testovacích dat
 */

import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import migrations from '@/drizzle/migrations';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { bandFrequencies, deviceBands, devices, frequencyBands } from '@/db/schema';
import { TEST_BANDS } from './mock-data';
import type { CreateDeviceInput } from '@/types';
import { eq } from 'drizzle-orm';

type Database = ReturnType<typeof drizzle<Record<string, never>>>;

let testDbInstance: Database | null = null;
let testSqliteInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Vytvoří a inicializuje in-memory testovací databázi
 */
export async function setupTestDatabase(): Promise<Database> {
  // Každý test dostane unikátní in-memory databázi
  const dbName = `:memory:`;

  try {
    // Otevřít in-memory databázi
    testSqliteInstance = await SQLite.openDatabaseAsync(dbName);
    testDbInstance = drizzle(testSqliteInstance);

    // Spustit migrace
    await migrate(testDbInstance, migrations);

    console.log('[Test DB] In-memory database created and migrated');

    return testDbInstance;
  } catch (error) {
    console.error('[Test DB] Failed to setup database:', error);
    throw error;
  }
}

/**
 * Naplní databázi testovacími frekvenčními pásmy
 */
export async function seedTestBands(db: Database): Promise<void> {
  for (const band of TEST_BANDS) {
    // Vložit pásmo
    const [insertedBand] = await db
      .insert(frequencyBands)
      .values({
        bandSign: band.sign,
        name: band.name,
        shortName: band.shortName,
        isCustom: false,
      })
      .returning({ id: frequencyBands.id });

    // Vložit frekvence pro toto pásmo
    const frequencyValues = band.frequencies.map((freq, index) => ({
      bandId: insertedBand.id,
      channelNumber: index + 1,
      frequency: freq,
    }));

    await db.insert(bandFrequencies).values(frequencyValues);
  }

  console.log('[Test DB] Test bands seeded');
}

/**
 * Vytvoří testovací zařízení
 */
export async function createTestDevice(db: Database, input: CreateDeviceInput): Promise<number> {
  const [device] = await db
    .insert(devices)
    .values({
      name: input.name,
      type: input.type,
    })
    .returning({ id: devices.id });

  // Přidat bands
  if (input.bandIds.length > 0) {
    const deviceBandValues = input.bandIds.map((bandId) => ({
      deviceId: device.id,
      bandId,
      bandLabel: input.bandLabels?.[bandId] || `Band ${bandId}`,
    }));

    await db.insert(deviceBands).values(deviceBandValues);
  }

  console.log(`[Test DB] Created test device: ${input.name} (ID: ${device.id})`);

  return device.id;
}

/**
 * Vyčistí všechna data z databáze
 */
export async function clearDatabase(db: Database): Promise<void> {
  await db.delete(deviceBands);
  await db.delete(devices);
  await db.delete(bandFrequencies);
  await db.delete(frequencyBands);

  console.log('[Test DB] Database cleared');
}

/**
 * Zavře testovací databázi
 */
export async function closeTestDatabase(): Promise<void> {
  if (testSqliteInstance) {
    await testSqliteInstance.closeAsync();
    testSqliteInstance = null;
    testDbInstance = null;
    console.log('[Test DB] Database closed');
  }
}

/**
 * Vrátí aktuální testovací DB instanci
 */
export function getTestDb(): Database {
  if (!testDbInstance) {
    throw new Error('Test database not initialized. Call setupTestDatabase() first.');
  }
  return testDbInstance;
}

/**
 * Vrátí všechna pásma z testovací databáze
 */
export async function getTestBands(db: Database) {
  return await db.select().from(frequencyBands);
}

/**
 * Vrátí všechna zařízení z testovací databáze
 */
export async function getTestDevices(db: Database) {
  return await db.select().from(devices);
}

/**
 * Najde pásmo podle znaku (např. 'F', 'R')
 */
export async function findBandBySign(db: Database, sign: string) {
  const [band] = await db.select().from(frequencyBands).where(eq(frequencyBands.bandSign, sign));
  return band;
}
