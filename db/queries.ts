import { drizzle } from 'drizzle-orm/expo-sqlite';
import { eq, desc, and, sql } from 'drizzle-orm';
import {
  frequencyBands,
  bandFrequencies,
  devices,
  deviceBands,
  favorites,
  history,
  type NewDevice,
  type NewDeviceBand,
  type NewFavorite,
  type NewHistory,
  type NewFrequencyBand,
  type NewBandFrequency,
} from './schema';
import type {
  BandWithFrequencies,
  DeviceWithBands,
  FrequencyMatch,
  NearestFrequenciesResult,
  CreateDeviceData,
  CreateCustomBandData,
} from '@/types';
import { findExactMatch, findNearestFrequencies } from '@/utils/frequency';

type Database = ReturnType<typeof drizzle<Record<string, never>>>;

// ========== BANDS ==========

/**
 * Získat všechna pásma včetně frekvencí
 */
export async function getAllBands(db: Database): Promise<BandWithFrequencies[]> {
  const bands = await db.select().from(frequencyBands);

  const bandsWithFrequencies = await Promise.all(
    bands.map(async (band) => {
      const freqs = await db
        .select()
        .from(bandFrequencies)
        .where(eq(bandFrequencies.bandId, band.id))
        .orderBy(bandFrequencies.channelNumber);

      return {
        ...band,
        frequencies: freqs.map((f) => ({
          channel: f.channelNumber,
          frequency: f.frequency,
        })),
      };
    })
  );

  return bandsWithFrequencies;
}

/**
 * Získat pouze oficiální pásma (ne custom)
 */
export async function getOfficialBands(db: Database): Promise<BandWithFrequencies[]> {
  const bands = await db.select().from(frequencyBands).where(eq(frequencyBands.isCustom, false));

  const bandsWithFrequencies = await Promise.all(
    bands.map(async (band) => {
      const freqs = await db
        .select()
        .from(bandFrequencies)
        .where(eq(bandFrequencies.bandId, band.id))
        .orderBy(bandFrequencies.channelNumber);

      return {
        ...band,
        frequencies: freqs.map((f) => ({
          channel: f.channelNumber,
          frequency: f.frequency,
        })),
      };
    })
  );

  return bandsWithFrequencies;
}

/**
 * Vytvořit custom pásmo
 */
export async function createCustomBand(db: Database, data: CreateCustomBandData): Promise<number> {
  const [band] = await db
    .insert(frequencyBands)
    .values({
      bandSign: data.bandSign,
      name: data.name,
      shortName: data.shortName || null,
      isCustom: true,
    })
    .returning({ id: frequencyBands.id });

  // Vložit frekvence
  const frequencyValues: NewBandFrequency[] = data.frequencies.map((freq, index) => ({
    bandId: band.id,
    channelNumber: index + 1,
    frequency: freq,
  }));

  await db.insert(bandFrequencies).values(frequencyValues);

  return band.id;
}

/**
 * Smazat custom pásmo (pouze custom, ne oficiální!)
 */
export async function deleteCustomBand(db: Database, bandId: number): Promise<boolean> {
  // Zkontrolovat že je to custom pásmo
  const [band] = await db
    .select()
    .from(frequencyBands)
    .where(and(eq(frequencyBands.id, bandId), eq(frequencyBands.isCustom, true)));

  if (!band) {
    throw new Error('Cannot delete official band or band not found');
  }

  await db.delete(frequencyBands).where(eq(frequencyBands.id, bandId));
  return true;
}

// ========== DEVICES ==========

/**
 * Získat všechna zařízení podle typu
 */
export async function getDevicesByType(
  db: Database,
  type?: 'VTX' | 'VRX'
): Promise<DeviceWithBands[]> {
  const devicesQuery = type
    ? db.select().from(devices).where(eq(devices.type, type))
    : db.select().from(devices);

  const allDevices = await devicesQuery;

  const devicesWithBands = await Promise.all(
    allDevices.map(async (device) => {
      const deviceBandsList = await db
        .select({
          bandId: deviceBands.bandId,
          bandLabel: deviceBands.bandLabel,
          bandSign: frequencyBands.bandSign,
          bandName: frequencyBands.name,
        })
        .from(deviceBands)
        .innerJoin(frequencyBands, eq(deviceBands.bandId, frequencyBands.id))
        .where(eq(deviceBands.deviceId, device.id));

      const bandsWithChannels = await Promise.all(
        deviceBandsList.map(async (band) => {
          const channels = await db
            .select({
              number: bandFrequencies.channelNumber,
              frequency: bandFrequencies.frequency,
            })
            .from(bandFrequencies)
            .where(eq(bandFrequencies.bandId, band.bandId))
            .orderBy(bandFrequencies.channelNumber);

          return {
            bandId: band.bandId,
            bandSign: band.bandSign,
            bandName: band.bandName,
            bandLabel: band.bandLabel,
            channels,
          };
        })
      );

      return {
        ...device,
        bands: bandsWithChannels,
      };
    })
  );

  return devicesWithBands;
}

/**
 * Získat jedno zařízení podle ID
 */
export async function getDevice(db: Database, deviceId: number): Promise<DeviceWithBands | null> {
  const [device] = await db.select().from(devices).where(eq(devices.id, deviceId));

  if (!device) return null;

  const deviceBandsList = await db
    .select({
      bandId: deviceBands.bandId,
      bandLabel: deviceBands.bandLabel,
      bandSign: frequencyBands.bandSign,
      bandName: frequencyBands.name,
    })
    .from(deviceBands)
    .innerJoin(frequencyBands, eq(deviceBands.bandId, frequencyBands.id))
    .where(eq(deviceBands.deviceId, device.id));

  const bandsWithChannels = await Promise.all(
    deviceBandsList.map(async (band) => {
      const channels = await db
        .select({
          number: bandFrequencies.channelNumber,
          frequency: bandFrequencies.frequency,
        })
        .from(bandFrequencies)
        .where(eq(bandFrequencies.bandId, band.bandId))
        .orderBy(bandFrequencies.channelNumber);

      return {
        bandId: band.bandId,
        bandSign: band.bandSign,
        bandName: band.bandName,
        bandLabel: band.bandLabel,
        channels,
      };
    })
  );

  return {
    ...device,
    bands: bandsWithChannels,
  };
}

/**
 * Vytvořit nové zařízení s pásmy
 */
export async function createDevice(db: Database, data: CreateDeviceData): Promise<number> {
  const [device] = await db
    .insert(devices)
    .values({
      name: data.name,
      type: data.type,
    })
    .returning({ id: devices.id });

  // Přidat pásma k zařízení
  if (data.bands.length > 0) {
    const deviceBandValues: NewDeviceBand[] = data.bands.map((band) => ({
      deviceId: device.id,
      bandId: band.bandId,
      bandLabel: band.label,
    }));

    await db.insert(deviceBands).values(deviceBandValues);
  }

  return device.id;
}

/**
 * Aktualizovat zařízení
 */
export async function updateDevice(
  db: Database,
  deviceId: number,
  data: Partial<CreateDeviceData>
): Promise<void> {
  if (data.name || data.type) {
    await db
      .update(devices)
      .set({
        ...(data.name && { name: data.name }),
        ...(data.type && { type: data.type }),
      })
      .where(eq(devices.id, deviceId));
  }

  if (data.bands) {
    // Smazat stávající pásma
    await db.delete(deviceBands).where(eq(deviceBands.deviceId, deviceId));

    // Přidat nová pásma
    if (data.bands.length > 0) {
      const deviceBandValues: NewDeviceBand[] = data.bands.map((band) => ({
        deviceId,
        bandId: band.bandId,
        bandLabel: band.label,
      }));

      await db.insert(deviceBands).values(deviceBandValues);
    }
  }
}

/**
 * Smazat zařízení
 */
export async function deleteDevice(db: Database, deviceId: number): Promise<void> {
  await db.delete(devices).where(eq(devices.id, deviceId));
}

// ========== FREQUENCY LOOKUP ==========

/**
 * Hlavní funkce pro vyhledání nastavení podle frekvence
 */
export async function findChannelByFrequency(
  db: Database,
  vtxDeviceId: number | undefined,
  vrxDeviceId: number | undefined,
  frequency: number
): Promise<
  { vtx?: FrequencyMatch; vrx?: FrequencyMatch; exact: true } | NearestFrequenciesResult | null
> {
  const vtxDevice = vtxDeviceId ? await getDevice(db, vtxDeviceId) : null;
  const vrxDevice = vrxDeviceId ? await getDevice(db, vrxDeviceId) : null;

  if (!vtxDevice && !vrxDevice) return null;

  // Získat všechny možné frekvence pro VTX
  const vtxOptions = vtxDevice
    ? vtxDevice.bands.flatMap((band) =>
        band.channels.map((ch) => ({
          bandId: band.bandId,
          bandSign: band.bandSign,
          bandName: band.bandName,
          bandLabel: band.bandLabel,
          channel: ch.number,
          frequency: ch.frequency,
          deviceType: 'VTX' as const,
        }))
      )
    : [];

  // Získat všechny možné frekvence pro VRX
  const vrxOptions = vrxDevice
    ? vrxDevice.bands.flatMap((band) =>
        band.channels.map((ch) => ({
          bandId: band.bandId,
          bandSign: band.bandSign,
          bandName: band.bandName,
          bandLabel: band.bandLabel,
          channel: ch.number,
          frequency: ch.frequency,
          deviceType: 'VRX' as const,
        }))
      )
    : [];

  // Hledat exact match
  const vtxMatch = vtxOptions.length > 0 ? findExactMatch(vtxOptions, frequency) : null;
  const vrxMatch = vrxOptions.length > 0 ? findExactMatch(vrxOptions, frequency) : null;

  if (vtxMatch || vrxMatch) {
    return {
      ...(vtxMatch && { vtx: vtxMatch }),
      ...(vrxMatch && { vrx: vrxMatch }),
      exact: true,
    };
  }

  // Pokud není exact match, najít nearest
  const allOptions = [...vtxOptions, ...vrxOptions];
  const nearest = findNearestFrequencies(allOptions, frequency);

  return {
    lower: nearest.lower,
    upper: nearest.upper,
    exact: false,
  };
}

// ========== FAVORITES ==========

/**
 * Přidat oblíbenou konfiguraci
 */
export async function addFavorite(
  db: Database,
  data: {
    name?: string;
    vtxDeviceId?: number;
    vrxDeviceId?: number;
    frequency: number;
  }
): Promise<number> {
  const [favorite] = await db
    .insert(favorites)
    .values({
      name: data.name || null,
      vtxDeviceId: data.vtxDeviceId || null,
      vrxDeviceId: data.vrxDeviceId || null,
      frequency: data.frequency,
    })
    .returning({ id: favorites.id });

  return favorite.id;
}

/**
 * Získat všechny oblíbené
 */
export async function getFavorites(db: Database) {
  return await db.select().from(favorites).orderBy(desc(favorites.createdAt));
}

/**
 * Smazat oblíbenou
 */
export async function deleteFavorite(db: Database, favoriteId: number): Promise<void> {
  await db.delete(favorites).where(eq(favorites.id, favoriteId));
}

// ========== HISTORY ==========

/**
 * Přidat do historie
 */
export async function addToHistory(
  db: Database,
  data: {
    vtxDeviceId?: number;
    vrxDeviceId?: number;
    frequency: number;
  }
): Promise<number> {
  const [historyEntry] = await db
    .insert(history)
    .values({
      vtxDeviceId: data.vtxDeviceId || null,
      vrxDeviceId: data.vrxDeviceId || null,
      frequency: data.frequency,
    })
    .returning({ id: history.id });

  return historyEntry.id;
}

/**
 * Získat nedávnou historii
 */
export async function getHistory(db: Database, limit: number = 10) {
  return await db.select().from(history).orderBy(desc(history.usedAt)).limit(limit);
}

/**
 * Vyčistit starou historii (ponechat pouze posledních N záznamů)
 */
export async function cleanOldHistory(db: Database, keepLast: number = 100): Promise<void> {
  // Získat ID starých záznamů
  const oldEntries = await db
    .select({ id: history.id })
    .from(history)
    .orderBy(desc(history.usedAt))
    .limit(1000)
    .offset(keepLast);

  if (oldEntries.length > 0) {
    const idsToDelete = oldEntries.map((e) => e.id);
    // Smazat staré záznamy
    for (const id of idsToDelete) {
      await db.delete(history).where(eq(history.id, id));
    }
  }
}
