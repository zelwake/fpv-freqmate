// Základní typy pro aplikaci

export interface FrequencyMatch {
  bandId: number;
  bandSign: string;
  bandName: string;
  channel: number;
  frequency: number;
}

export interface DeviceWithBands {
  id: number;
  name: string;
  type: 'VTX' | 'VRX';
  bands: {
    bandId: number;
    bandSign: string;
    bandName: string;
    bandLabel: string;
    channels: { number: number; frequency: number }[];
  }[];
}

export interface FrequencyLookupResult {
  vtx: FrequencyMatch | null;
  vrx: FrequencyMatch | null;
  exact: boolean;
}

export interface NearestFrequency {
  frequency: number;
  bandId: number;
  bandSign: string;
  bandName: string;
  channel: number;
  deviceType: 'VTX' | 'VRX';
  distance: number;
}

export interface NearestFrequenciesResult {
  lower: NearestFrequency[];
  upper: NearestFrequency[];
  exact: false;
}

export interface BandWithFrequencies {
  id: number;
  bandSign: string;
  name: string;
  shortName: string | null;
  isCustom: boolean;
  frequencies: { channel: number; frequency: number }[];
}

export interface CreateDeviceData {
  name: string;
  type: 'VTX' | 'VRX';
  bands: { bandId: number; label: string }[];
}

export interface CreateCustomBandData {
  bandSign: string;
  name: string;
  shortName?: string;
  frequencies: number[]; // 1-8 frequencies
}
