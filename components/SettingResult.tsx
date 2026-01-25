import { fontSize, spacing } from '@/constants/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import type { DeviceType, FrequencyMatch } from '@/types';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Card } from './ui/Card';

interface SettingResultProps {
  type: DeviceType;
  result: FrequencyMatch | null;
  style?: StyleProp<ViewStyle>;
}

export function SettingResult({ type, result, style }: SettingResultProps) {
  const { colors } = useTheme();

  if (!result) {
    return null;
  }

  const showBandLabel = result.bandSign !== result.bandLabel;

  return (
    <Card style={[styles.card, { backgroundColor: colors.successLight }, style]}>
      <Text style={[styles.title, { color: colors.text }]}>✓ {type} Setting</Text>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Band:</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {result.bandSign} ({result.bandName})
        </Text>
      </View>
      {showBandLabel && (
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Band Alias:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{result.bandLabel}</Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Channel:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{result.channel}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Frequency:</Text>
        <Text style={[styles.value, { color: colors.text }]}>{result.frequency} MHz</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
  },
  value: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
});
