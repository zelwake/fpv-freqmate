// Oficiální frekvenční pásma pro FPV (z data/bands.csv)
// Formát: každé pásmo má 1-8 kanálů s frekvencemi v MHz

export interface BandData {
  sign: string;
  name: string;
  shortName: string;
  frequencies: number[];
}

export const OFFICIAL_BANDS: readonly BandData[] = [
  {
    sign: 'A',
    name: 'Boscam A',
    shortName: 'Boscam',
    frequencies: [5865, 5845, 5825, 5805, 5785, 5765, 5745, 5725],
  },
  {
    sign: 'B',
    name: 'Boscam B',
    shortName: 'Boscam',
    frequencies: [5733, 5752, 5771, 5790, 5809, 5828, 5847, 5866],
  },
  {
    sign: 'E',
    name: 'Boscam E',
    shortName: 'Boscam',
    frequencies: [5705, 5685, 5665, 5645, 5885, 5905, 5925, 5945],
  },
  {
    sign: 'F',
    name: 'FatShark / NexWave',
    shortName: 'FatShark',
    frequencies: [5740, 5760, 5780, 5800, 5820, 5840, 5860, 5880],
  },
  {
    sign: 'R',
    name: 'Race Band',
    shortName: 'Race',
    frequencies: [5658, 5695, 5732, 5769, 5806, 5843, 5880, 5917],
  },
  {
    sign: 'D',
    name: 'Boscam D / DJI',
    shortName: 'Boscam/DJI',
    frequencies: [5362, 5399, 5436, 5473, 5510, 5547, 5584, 5621],
  },
  {
    sign: 'U',
    name: 'U Band',
    shortName: 'U Band',
    frequencies: [5325, 5348, 5366, 5384, 5402, 5420, 5438, 5456],
  },
  {
    sign: 'O',
    name: 'O Band',
    shortName: 'O Band',
    frequencies: [5474, 5492, 5510, 5528, 5546, 5564, 5582, 5600],
  },
  {
    sign: 'L',
    name: 'Low Band',
    shortName: 'Low',
    frequencies: [5333, 5373, 5413, 5453, 5493, 5533, 5573, 5613],
  },
  {
    sign: 'H',
    name: 'High Band',
    shortName: 'High',
    frequencies: [5653, 5693, 5733, 5773, 5813, 5853, 5893, 5933],
  },
] as const;
