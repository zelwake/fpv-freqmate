import { spacing } from '@/constants/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useBands } from '@/hooks/useBands';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Input } from './ui/Input';

interface BandSelectorProps {
  selectedBandIds: number[];
  onChange: (bandIds: number[]) => void;
  bandLabels: Record<number, string>;
  onLabelChange: (bandLabels: Record<number, string>) => void;
  label?: string;
  error?: string;
}

export const BandSelector = ({
  selectedBandIds,
  onChange,
  bandLabels,
  onLabelChange,
  label,
  error,
}: BandSelectorProps) => {
  const { colors } = useTheme();
  const { data: bands = [], isLoading } = useBands();

  const toggleBand = (bandId: number) => {
    if (selectedBandIds.includes(bandId)) {
      onChange(selectedBandIds.filter((id) => id !== bandId));
    } else {
      onChange([...selectedBandIds, bandId]);
    }
  };

  const handleLabelChange = (bandId: number, value: string) => {
    onLabelChange({
      ...bandLabels,
      [bandId]: value,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading bands...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}

      {bands.map((band) => {
        const isSelected = selectedBandIds.includes(band.id);
        const frequencies = band.frequencies || [];
        const freqRange =
          frequencies.length > 0
            ? `${frequencies[0]?.frequency}-${frequencies[frequencies.length - 1]?.frequency} MHz`
            : '';

        return (
          <View key={band.id} style={styles.bandItem}>
            <TouchableOpacity
              onPress={() => toggleBand(band.id)}
              style={[
                styles.bandRow,
                {
                  backgroundColor: colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? colors.primary : 'transparent',
                  },
                ]}
              >
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.bandInfo}>
                <Text style={[styles.bandName, { color: colors.text }]}>
                  {band.bandSign} - {band.name}
                </Text>
                {freqRange && (
                  <Text style={[styles.freqRange, { color: colors.textSecondary }]}>
                    {freqRange}
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            {isSelected && (
              <View style={styles.labelInputContainer}>
                <Input
                  placeholder={`Label (default: ${band.bandSign})`}
                  value={bandLabels[band.id] || ''}
                  onChangeText={(value) => handleLabelChange(band.id, value)}
                />
              </View>
            )}
          </View>
        );
      })}

      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        {selectedBandIds.length === 0
          ? 'Select at least one band'
          : `${selectedBandIds.length} band${selectedBandIds.length === 1 ? '' : 's'} selected`}
      </Text>

      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  bandItem: {
    marginBottom: spacing.sm,
  },
  bandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bandInfo: {
    flex: 1,
  },
  bandName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  freqRange: {
    fontSize: 12,
  },
  labelInputContainer: {
    marginTop: spacing.sm,
    marginLeft: 40,
  },
  hint: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  error: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  loadingText: {
    fontSize: 14,
  },
});
