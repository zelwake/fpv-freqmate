import { fontSize, spacing } from '@/constants/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface FrequencySuggestionsProps {
  suggestions: number[];
  onSelect: (frequency: number) => void;
  style?: StyleProp<ViewStyle>;
}

export function FrequencySuggestions({ suggestions, onSelect, style }: FrequencySuggestionsProps) {
  const { colors } = useTheme();

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card style={[styles.card, { backgroundColor: colors.warningLight }, style]}>
      <Text style={[styles.title, { color: colors.text }]}>⚠️ Exact frequency not found</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Try these nearby frequencies:
      </Text>

      <View style={styles.suggestionsContainer}>
        {suggestions.map((freq) => (
          <Button
            key={freq}
            title={`${freq} MHz`}
            onPress={() => onSelect(freq)}
            variant="secondary"
            size="sm"
            style={styles.suggestionButton}
          />
        ))}
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
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  suggestionButton: {
    flexGrow: 0,
    flexShrink: 0,
  },
});
