import { spacing } from '@/constants/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useBands } from '@/hooks/useBands';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BandSelectorProps {
  selectedBandIds: number[];
  onChange: (bandIds: number[]) => void;
  label?: string;
  error?: string;
}

export const BandSelector = ({ selectedBandIds, onChange, label, error }: BandSelectorProps) => {
  const { colors } = useTheme();
  const { data: bands = [], isLoading } = useBands();

  const toggleBand = (bandId: number) => {
    if (selectedBandIds.includes(bandId)) {
      onChange(selectedBandIds.filter((id) => id !== bandId));
    } else {
      onChange([...selectedBandIds, bandId]);
    }
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {bands.map((band) => {
          const isSelected = selectedBandIds.includes(band.id);
          return (
            <TouchableOpacity
              key={band.id}
              onPress={() => toggleBand(band.id)}
              style={[
                styles.bandChip,
                {
                  backgroundColor: isSelected ? colors.primary : colors.background,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.bandLabel,
                  {
                    color: isSelected ? '#FFFFFF' : colors.text,
                  },
                ]}
              >
                {band.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

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
  scrollContent: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  bandChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 2,
  },
  bandLabel: {
    fontSize: 16,
    fontWeight: '600',
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
