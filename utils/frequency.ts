import type { FrequencyMatch, NearestFrequency } from '@/types';

/**
 * Najde přesnou shodu frekvence v seznamu možností
 */
export function findExactMatch(
  options: {
    bandId: number;
    bandSign: string;
    bandName: string;
    channel: number;
    frequency: number;
  }[],
  targetFrequency: number
): FrequencyMatch | null {
  const match = options.find((opt) => opt.frequency === targetFrequency);
  return match || null;
}

/**
 * Najde nejbližší frekvence k cílové frekvenci
 */
export function findNearestFrequencies(
  options: {
    bandId: number;
    bandSign: string;
    bandName: string;
    channel: number;
    frequency: number;
    deviceType: 'VTX' | 'VRX';
  }[],
  targetFrequency: number
): { lower: NearestFrequency[]; upper: NearestFrequency[] } {
  // Najít všechny nižší frekvence
  const lowerOptions = options
    .filter((opt) => opt.frequency < targetFrequency)
    .map((opt) => ({
      ...opt,
      distance: targetFrequency - opt.frequency,
    }))
    .sort((a, b) => a.distance - b.distance);

  // Najít všechny vyšší frekvence
  const upperOptions = options
    .filter((opt) => opt.frequency > targetFrequency)
    .map((opt) => ({
      ...opt,
      distance: opt.frequency - targetFrequency,
    }))
    .sort((a, b) => a.distance - b.distance);

  // Vrátit nejbližší z každé strany (může být více se stejnou vzdáleností)
  const minLowerDistance = lowerOptions[0]?.distance;
  const minUpperDistance = upperOptions[0]?.distance;

  const lower =
    minLowerDistance !== undefined
      ? lowerOptions.filter((opt) => opt.distance === minLowerDistance)
      : [];

  const upper =
    minUpperDistance !== undefined
      ? upperOptions.filter((opt) => opt.distance === minUpperDistance)
      : [];

  return { lower, upper };
}

/**
 * Vypočítá interference score mezi používanými frekvencemi
 * Vyšší score = lepší (větší odstup)
 */
export function calculateInterferenceScore(
  targetFrequency: number,
  usedFrequencies: number[]
): number {
  if (usedFrequencies.length === 0) return Infinity;

  const minDistance = Math.min(...usedFrequencies.map((freq) => Math.abs(targetFrequency - freq)));

  return minDistance;
}

/**
 * Kontrola jestli je frekvence validní (v rozumném rozsahu)
 */
export function isValidFrequency(frequency: number): boolean {
  // Akceptujeme široký rozsah pro různá pásma (1.2 GHz - 6 GHz)
  return frequency >= 1000 && frequency <= 6000;
}

/**
 * Formátování frekvence pro zobrazení
 */
export function formatFrequency(frequency: number): string {
  return `${frequency} MHz`;
}
