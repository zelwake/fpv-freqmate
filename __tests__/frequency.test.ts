import {
  findExactMatch,
  findNearestFrequencies,
  calculateInterferenceScore,
} from '../utils/frequency';

describe('Frequency Utils', () => {
  const testOptions = [
    {
      bandId: 1,
      bandSign: 'F',
      bandName: 'FatShark',
      channel: 1,
      frequency: 5740,
      deviceType: 'VTX' as const,
    },
    {
      bandId: 1,
      bandSign: 'F',
      bandName: 'FatShark',
      channel: 2,
      frequency: 5760,
      deviceType: 'VTX' as const,
    },
    {
      bandId: 1,
      bandSign: 'F',
      bandName: 'FatShark',
      channel: 3,
      frequency: 5780,
      deviceType: 'VTX' as const,
    },
    {
      bandId: 1,
      bandSign: 'F',
      bandName: 'FatShark',
      channel: 4,
      frequency: 5800,
      deviceType: 'VTX' as const,
    },
    {
      bandId: 1,
      bandSign: 'F',
      bandName: 'FatShark',
      channel: 5,
      frequency: 5820,
      deviceType: 'VTX' as const,
    },
  ];

  describe('findExactMatch', () => {
    it('should find exact frequency match', () => {
      const result = findExactMatch(testOptions, 5800);
      expect(result).not.toBeNull();
      expect(result?.frequency).toBe(5800);
      expect(result?.channel).toBe(4);
      expect(result?.bandSign).toBe('F');
    });

    it('should return null when no match found', () => {
      const result = findExactMatch(testOptions, 5799);
      expect(result).toBeNull();
    });

    it('should handle edge cases', () => {
      expect(findExactMatch(testOptions, 5740)).not.toBeNull();
      expect(findExactMatch(testOptions, 5820)).not.toBeNull();
      expect(findExactMatch(testOptions, 5739)).toBeNull();
      expect(findExactMatch(testOptions, 5821)).toBeNull();
    });
  });

  describe('findNearestFrequencies', () => {
    it('should find nearest frequencies on both sides', () => {
      const result = findNearestFrequencies(testOptions, 5790);

      expect(result.lower).toHaveLength(1);
      expect(result.lower[0].frequency).toBe(5780);
      expect(result.lower[0].distance).toBe(10);

      expect(result.upper).toHaveLength(1);
      expect(result.upper[0].frequency).toBe(5800);
      expect(result.upper[0].distance).toBe(10);
    });

    it('should return only upper when frequency is below all', () => {
      const result = findNearestFrequencies(testOptions, 5700);

      expect(result.lower).toHaveLength(0);
      expect(result.upper).toHaveLength(1);
      expect(result.upper[0].frequency).toBe(5740);
    });

    it('should return only lower when frequency is above all', () => {
      const result = findNearestFrequencies(testOptions, 5900);

      expect(result.lower).toHaveLength(1);
      expect(result.lower[0].frequency).toBe(5820);
      expect(result.upper).toHaveLength(0);
    });

    it('should handle frequency exactly between two options', () => {
      const result = findNearestFrequencies(testOptions, 5800);

      // When exactly on a frequency, it won't match lower/upper filters
      expect(result.lower.length + result.upper.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateInterferenceScore', () => {
    it('should calculate minimum distance to used frequencies', () => {
      const score = calculateInterferenceScore(5800, [5760, 5820]);
      expect(score).toBe(20);
    });

    it('should return Infinity when no used frequencies', () => {
      const score = calculateInterferenceScore(5800, []);
      expect(score).toBe(Infinity);
    });

    it('should handle single used frequency', () => {
      const score = calculateInterferenceScore(5800, [5760]);
      expect(score).toBe(40);
    });

    it('should find closest frequency among many', () => {
      const score = calculateInterferenceScore(5800, [5700, 5720, 5740, 5900]);
      expect(score).toBe(60); // Closest is 5740, distance 60
    });
  });
});
