import Layout from '@/constants/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import type { NearestFrequency } from '@/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface FrequencySuggestionsProps {
  lower: NearestFrequency[];
  upper: NearestFrequency[];
  onSelect: (frequency: number) => void;
}

export function FrequencySuggestions({ lower, upper, onSelect }: FrequencySuggestionsProps) {
  const { colors } = useTheme();

  if (lower.length === 0 && upper.length === 0) {
    return null;
  }

  return (
    <Card style={[styles.card, { backgroundColor: colors.warningLight }]}>
      <Text style={[styles.title, { color: colors.text }]}>⚠️ Exact frequency not found</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Nearest frequencies:</Text>

      {lower.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Lower ({lower[0].distance} MHz away):
          </Text>
          {lower.map((freq, index) => (
            <Button
              key={index}
              variant="secondary"
              size="sm"
              onPress={() => onSelect(freq.frequency)}
              style={styles.button}
            >
              {freq.frequency} MHz ({freq.bandSign}
              {freq.channel})
            </Button>
          ))}
        </View>
      )}

      {upper.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Higher ({upper[0].distance} MHz away):
          </Text>
          {upper.map((freq, index) => (
            <Button
              key={index}
              variant="secondary"
              size="sm"
              onPress={() => onSelect(freq.frequency)}
              style={styles.button}
            >
              {freq.frequency} MHz ({freq.bandSign}
              {freq.channel})
            </Button>
          ))}
        </View>
      )}
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
    marginBottom: Layout.spacing.xs,
  },
  subtitle: {
    fontSize: Layout.fontSize.sm,
    marginBottom: Layout.spacing.md,
  },
  section: {
    marginBottom: Layout.spacing.sm,
  },
  sectionTitle: {
    fontSize: Layout.fontSize.xs,
    marginBottom: Layout.spacing.xs,
  },
  button: {
    marginBottom: Layout.spacing.xs,
  },
});
