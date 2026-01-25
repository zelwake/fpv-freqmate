import { useState, useCallback, useEffect } from 'react';
import { useDatabase } from './useDatabase';
import * as queries from '@/db/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_SELECTION_KEY = '@dronefrequency:lastSelection';

interface LastSelection {
  vtxDeviceId: number | null;
  vrxDeviceId: number | null;
  frequency: string;
}

interface LookupResult {
  bandSign: string;
  bandName: string;
  channel: number;
  frequency: number;
  isExactMatch: boolean;
}

/**
 * Hlavní hook pro frequency lookup s state managementem
 */
export function useFrequencyLookup() {
  const db = useDatabase();
  const [vtxDeviceId, setVtxDeviceId] = useState<number | null>(null);
  const [vrxDeviceId, setVrxDeviceId] = useState<number | null>(null);
  const [frequency, setFrequency] = useState<number | null>(null);
  const [vtxResult, setVtxResult] = useState<LookupResult | null>(null);
  const [vrxResult, setVrxResult] = useState<LookupResult | null>(null);
  const [suggestions, setSuggestions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Načíst poslední výběr při startu
  useEffect(() => {
    AsyncStorage.getItem(LAST_SELECTION_KEY).then((saved) => {
      if (saved) {
        try {
          const parsed: LastSelection = JSON.parse(saved);
          setVtxDeviceId(parsed.vtxDeviceId);
          setVrxDeviceId(parsed.vrxDeviceId);
          if (parsed.frequency) {
            setFrequency(parseInt(parsed.frequency, 10));
          }
        } catch (e) {
          console.error('Failed to parse last selection:', e);
        }
      }
    });
  }, []);

  const handleLookup = useCallback(async () => {
    if (!frequency) return;

    setIsLoading(true);
    setVtxResult(null);
    setVrxResult(null);
    setSuggestions([]);

    try {
      // Uložit výběr
      const selection: LastSelection = {
        vtxDeviceId,
        vrxDeviceId,
        frequency: frequency.toString(),
      };
      await AsyncStorage.setItem(LAST_SELECTION_KEY, JSON.stringify(selection));

      // Najít frekvenci
      const result = await queries.findChannelByFrequency(db, vtxDeviceId, vrxDeviceId, frequency);

      if (result) {
        if (result.vtx) {
          setVtxResult({
            bandSign: result.vtx.bandSign,
            bandName: result.vtx.bandName,
            channel: result.vtx.channel,
            frequency: result.vtx.frequency,
            isExactMatch: result.exact,
          });
        }

        if (result.vrx) {
          setVrxResult({
            bandSign: result.vrx.bandSign,
            bandName: result.vrx.bandName,
            channel: result.vrx.channel,
            frequency: result.vrx.frequency,
            isExactMatch: result.exact,
          });
        }

        // Pokud není exact match, najít nejbližší frekvence
        if (!result.exact) {
          const nearest = await queries.findNearestFrequencies(
            db,
            vtxDeviceId,
            vrxDeviceId,
            frequency
          );

          if (nearest && !nearest.exact) {
            const nearestFreqs = [
              ...nearest.lower.map((f) => f.frequency),
              ...nearest.upper.map((f) => f.frequency),
            ];
            setSuggestions([...new Set(nearestFreqs)].sort((a, b) => a - b).slice(0, 5));
          }
        }
      }

      // Přidat do historie
      await queries.addToHistory(db, {
        vtxDeviceId: vtxDeviceId || undefined,
        vrxDeviceId: vrxDeviceId || undefined,
        frequency,
      });
    } catch (error) {
      console.error('Lookup error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [db, vtxDeviceId, vrxDeviceId, frequency]);

  return {
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
  };
}
