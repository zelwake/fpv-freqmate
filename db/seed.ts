import { drizzle } from 'drizzle-orm/expo-sqlite';
import { eq } from 'drizzle-orm';
import { bandFrequencies, frequencyBands } from './schema';
import { OFFICIAL_BANDS } from './seedData';

/**
 * Naplní databázi oficiálními frekvenčními pásmy při prvním spuštění
 * @param db Drizzle database instance
 * @returns true pokud byl seed úspěšný, false pokud data už existují
 */
export async function seedOfficialBands(
  db: ReturnType<typeof drizzle<Record<string, never>>>
): Promise<boolean> {
  try {
    // Zkontrolovat jestli už existují oficiální pásma
    const existingBands = await db.select().from(frequencyBands).limit(1);

    if (existingBands.length > 0) {
      console.log('[Seed] Official bands already exist, skipping seed');
      return false;
    }

    console.log('[Seed] Seeding official bands...');

    // Naplnit pásma a jejich frekvence
    for (const band of OFFICIAL_BANDS) {
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

      // Vložit frekvence pro toto pásmo (kanály 1-8)
      const frequencyValues = band.frequencies.map((freq, index) => ({
        bandId: insertedBand.id,
        channelNumber: index + 1, // 1-based indexing
        frequency: freq,
      }));

      await db.insert(bandFrequencies).values(frequencyValues);

      console.log(
        `[Seed] Added band ${band.sign} (${band.name}) with ${band.frequencies.length} channels`
      );
    }

    console.log('[Seed] Official bands seeded successfully!');
    return true;
  } catch (error) {
    console.error('[Seed] Error seeding official bands:', error);
    throw error;
  }
}

/**
 * Pomocná funkce pro získání počtu oficiálních pásem
 */
export async function getOfficialBandsCount(
  db: ReturnType<typeof drizzle<Record<string, never>>>
): Promise<number> {
  const bands = await db.select().from(frequencyBands).where(eq(frequencyBands.isCustom, false));
  return bands.length;
}
