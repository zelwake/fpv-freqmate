import Layout from '@/constants/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import type { FrequencyMatch } from '@/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from './ui/Card';

interface SettingResultProps {
  type: 'VTX' | 'VRX';
  result: FrequencyMatch | null;
}

export function SettingResult({ type, result }: SettingResultProps) {
  const { colors } = useTheme();

  if (!result) {
    return null;
  }

  return (
    <Card style={[styles.card, { backgroundColor: colors.successLight }]}>
      <Text style={[styles.title, { color: colors.text }]}>✓ {type} Setting</Text>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Band:</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {result.bandSign} ({result.bandName})
        </Text>
      </View>
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
    marginBottom: Layout.spacing.md,
  },
  title: {
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
    marginBottom: Layout.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.xs,
  },
  label: {
    fontSize: Layout.fontSize.sm,
  },
  value: {
    fontSize: Layout.fontSize.sm,
    fontWeight: '500',
  },
});
