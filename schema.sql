CREATE TABLE "device" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "type" "enum(VTX,VRX)" NOT NULL
);

CREATE TABLE "band" (
  "band_sign" integer PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "channel" (
  "channel_number" integer PRIMARY KEY
);

CREATE TABLE "band_channel_frequency" (
  "band_sign" integer NOT NULL,
  "channel_number" integer NOT NULL,
  "frequency" integer,
  PRIMARY KEY ("band_sign", "channel_number")
);

CREATE TABLE "device_band" (
  "device_id" integer NOT NULL,
  "band_sign" integer NOT NULL,
  "band_alias" varchar,
  PRIMARY KEY ("device_id", "band_sign")
);

ALTER TABLE "band_channel_frequency" ADD FOREIGN KEY ("band_sign") REFERENCES "band" ("band_sign");

ALTER TABLE "band_channel_frequency" ADD FOREIGN KEY ("channel_number") REFERENCES "channel" ("channel_number");

ALTER TABLE "device_band" ADD FOREIGN KEY ("device_id") REFERENCES "device" ("id");

ALTER TABLE "device_band" ADD FOREIGN KEY ("band_sign") REFERENCES "band" ("band_sign");

PRAGMA journal_mode = WAL;
