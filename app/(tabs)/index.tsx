import { DeviceSelector } from '@/components/DeviceSelector';
import { FrequencyInput } from '@/components/FrequencyInput';
import { FrequencySuggestions } from '@/components/FrequencySuggestions';
import { SettingResult } from '@/components/SettingResult';
import { Button } from '@/components/ui/Button';
import { spacing } from '@/constants/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useFrequencyLookup } from '@/hooks/useFrequencyLookup';

import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
  const { colors } = useTheme();
  const {
    vtxDeviceId,
    vrxDeviceId,
    frequency,
    vtxResult,
    vrxResult,
    suggestions,
    isLoading,
    setVtxDeviceId,
    setVrxDeviceId,
    setFrequency,
    handleLookup,
  } = useFrequencyLookup();

  const [hasSearched, setHasSearched] = useState(false);

  const onLookup = () => {
    if (!vtxDeviceId && !vrxDeviceId) {
      Alert.alert('Error', 'Please select at least one device (VTX or VRX)');
      return;
    }

    if (!frequency || frequency < 1000 || frequency > 6000) {
      Alert.alert('Error', 'Please enter a valid frequency (1000-6000 MHz)');
      return;
    }

    handleLookup();
    setHasSearched(true);
  };

  const handleAddToFavorites = () => {
    Alert.alert('Coming Soon', 'Favorites feature will be implemented in a future update');
  };

  const hasExactMatch =
    (vtxResult && vtxResult.isExactMatch) || (vrxResult && vrxResult.isExactMatch);
  const showSuggestions = hasSearched && !hasExactMatch && suggestions.length > 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>Frequency Lookup</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Select your devices and enter a frequency to find the correct band and channel settings.
      </Text>

      <View style={styles.deviceRow}>
        <View style={styles.deviceColumn}>
          <DeviceSelector type="VTX" value={vtxDeviceId} onChange={setVtxDeviceId} />
        </View>
        <View style={styles.deviceColumn}>
          <DeviceSelector type="VRX" value={vrxDeviceId} onChange={setVrxDeviceId} />
        </View>
      </View>

      <FrequencyInput value={frequency} onChange={setFrequency} />

      <Button
        title={isLoading ? 'Looking up...' : 'Find Settings'}
        onPress={onLookup}
        disabled={isLoading}
        style={styles.lookupButton}
      />

      {hasSearched && (
        <View style={styles.resultsContainer}>
          {vtxDeviceId && vtxResult && (
            <SettingResult type="vtx" result={vtxResult} style={styles.resultCard} />
          )}

          {vrxDeviceId && vrxResult && (
            <SettingResult type="vrx" result={vrxResult} style={styles.resultCard} />
          )}

          {!vtxResult && !vrxResult && !isLoading && (
            <View style={[styles.noResultCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.noResultText, { color: colors.textSecondary }]}>
                No matching band/channel found for the selected frequency.
              </Text>
            </View>
          )}

          {showSuggestions && (
            <FrequencySuggestions
              suggestions={suggestions}
              onSelect={(freq) => {
                setFrequency(freq);
                handleLookup();
              }}
              style={styles.suggestions}
            />
          )}

          {hasExactMatch && (
            <Button
              title="Add to Favorites"
              onPress={handleAddToFavorites}
              variant="secondary"
              style={styles.favoriteButton}
            />
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  deviceRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  deviceColumn: {
    flex: 1,
  },
  lookupButton: {
    marginTop: spacing.md,
  },
  resultsContainer: {
    marginTop: spacing.xl,
  },
  resultCard: {
    marginBottom: spacing.md,
  },
  noResultCard: {
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  noResultText: {
    fontSize: 14,
    textAlign: 'center',
  },
  suggestions: {
    marginTop: spacing.md,
  },
  favoriteButton: {
    marginTop: spacing.lg,
  },
});

export default HomeScreen;
