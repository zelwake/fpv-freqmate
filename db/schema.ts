import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Frekvenční pásma (A, B, E, F, R, D, U, O, L, H)
export const frequencyBands = sqliteTable('frequency_band', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bandSign: text('band_sign').notNull(),
  name: text('name').notNull(),
  shortName: text('short_name'),
  isCustom: integer('is_custom', { mode: 'boolean' }).notNull().default(false),
});

// Frekvence pro každé pásmo (1-8 kanálů)
export const bandFrequencies = sqliteTable(
  'band_frequency',
  {
    bandId: integer('band_id')
      .notNull()
      .references(() => frequencyBands.id, { onDelete: 'cascade' }),
    channelNumber: integer('channel_number').notNull(),
    frequency: integer('frequency').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.bandId, table.channelNumber] }),
  })
);

// Zařízení (VTX/VRX) - vždy uživatelská
export const devices = sqliteTable('device', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  type: text('type', { enum: ['VTX', 'VRX'] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

// Mapování zařízení na pásma
export const deviceBands = sqliteTable(
  'device_band',
  {
    deviceId: integer('device_id')
      .notNull()
      .references(() => devices.id, { onDelete: 'cascade' }),
    bandId: integer('band_id')
      .notNull()
      .references(() => frequencyBands.id, { onDelete: 'cascade' }),
    bandLabel: text('band_label').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.deviceId, table.bandId] }),
  })
);

// Oblíbené konfigurace
export const favorites = sqliteTable('favorite', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
  vtxDeviceId: integer('vtx_device_id').references(() => devices.id, {
    onDelete: 'set null',
  }),
  vrxDeviceId: integer('vrx_device_id').references(() => devices.id, {
    onDelete: 'set null',
  }),
  frequency: integer('frequency').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

// Historie použití
export const history = sqliteTable('history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vtxDeviceId: integer('vtx_device_id').references(() => devices.id, {
    onDelete: 'set null',
  }),
  vrxDeviceId: integer('vrx_device_id').references(() => devices.id, {
    onDelete: 'set null',
  }),
  frequency: integer('frequency').notNull(),
  usedAt: integer('used_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

// Export types pro použití v aplikaci
export type FrequencyBand = typeof frequencyBands.$inferSelect;
export type BandFrequency = typeof bandFrequencies.$inferSelect;
export type Device = typeof devices.$inferSelect;
export type DeviceBand = typeof deviceBands.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type History = typeof history.$inferSelect;

export type NewFrequencyBand = typeof frequencyBands.$inferInsert;
export type NewBandFrequency = typeof bandFrequencies.$inferInsert;
export type NewDevice = typeof devices.$inferInsert;
export type NewDeviceBand = typeof deviceBands.$inferInsert;
export type NewFavorite = typeof favorites.$inferInsert;
export type NewHistory = typeof history.$inferInsert;
