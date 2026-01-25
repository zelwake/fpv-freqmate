import { spacing } from '@/constants/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useBands } from '@/hooks/useBands';
import { StyleSheet, Text, View } from 'react-native';
import { Input } from './ui/Input';

interface BandLabelEditorProps {
  selectedBandIds: number[];
  bandLabels: Record<number, string>;
  onChange: (bandLabels: Record<number, string>) => void;
  label?: string;
}

export const BandLabelEditor = ({
  selectedBandIds,
  bandLabels,
  onChange,
  label,
}: BandLabelEditorProps) => {
  const { colors } = useTheme();
  const { data: allBands = [], isLoading } = useBands();

  if (isLoading || selectedBandIds.length === 0) {
    return null;
  }

  const selectedBands = allBands.filter((band) => selectedBandIds.includes(band.id));

  const handleLabelChange = (bandId: number, value: string) => {
    onChange({
      ...bandLabels,
      [bandId]: value,
    });
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}

      {selectedBands.map((band) => {
        // Get first and last frequency for the band
        const frequencies = band.frequencies || [];
        const hint =
          frequencies.length > 0
            ? `${band.bandSign} (${frequencies[0]?.frequency}-${frequencies[frequencies.length - 1]?.frequency} MHz)`
            : band.bandSign;

        return (
          <Input
            key={band.id}
            label={`Label for ${band.name}`}
            placeholder={hint}
            value={bandLabels[band.id] || ''}
            onChangeText={(value) => handleLabelChange(band.id, value)}
          />
        );
      })}
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
});
