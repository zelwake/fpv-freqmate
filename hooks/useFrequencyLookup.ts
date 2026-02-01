import * as queries from '@/db/queries';
import type { NearestFrequency } from '@/types';
import { findNearestFrequencies } from '@/utils/frequency';
import { logger } from '@/utils/logger';
import AsyncStorage from 'expo-sqlite/kv-store';
import { useCallback, useEffect, useState } from 'react';
import { useDatabase } from './useDatabase';

const LAST_SELECTION_KEY = '@dronefrequency:lastSelection';

interface LastSelection {
  vtxDeviceId: number | null;
  vrxDeviceId: number | null;
  frequency: string;
}

interface LookupResult {
  bandId: number;
  bandSign: string;
  bandName: string;
  bandLabel?: string;
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
        } catch (error) {
          logger.error('Failed to parse last selection:', { error });
        }
      }
    });
  }, []);

  const handleLookup = useCallback(async () => {
    // Validace - musí být zadaná frekvence a alespoň jedno zařízení
    if (!frequency || (!vtxDeviceId && !vrxDeviceId)) {
      logger.warn('Lookup skipped: missing frequency or no device selected', {
        frequency,
        vtxDeviceId,
        vrxDeviceId,
      });
      return;
    }

    logger.debug('Starting frequency lookup', { frequency, vtxDeviceId, vrxDeviceId });

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
      const result = await queries.findChannelByFrequency(
        db,
        vtxDeviceId ?? undefined,
        vrxDeviceId ?? undefined,
        frequency
      );
      logger.debug('Lookup result:', { result });

      if (result) {
        if ('vtx' in result && result.vtx) {
          logger.debug('VTX match found:', { vtxResult: result.vtx });
          setVtxResult({
            bandId: result.vtx.bandId,
            bandSign: result.vtx.bandSign,
            bandName: result.vtx.bandName,
            bandLabel: result.vtx.bandLabel,
            channel: result.vtx.channel,
            frequency: result.vtx.frequency,
            isExactMatch: result.exact,
          });
        } else if (vtxDeviceId) {
          logger.debug(`No VTX match found for device${vtxDeviceId}`);
        }

        if ('vrx' in result && result.vrx) {
          logger.debug('VRX match found:', { vrxResult: result.vrx });
          setVrxResult({
            bandId: result.vrx.bandId,
            bandSign: result.vrx.bandSign,
            bandName: result.vrx.bandName,
            bandLabel: result.vrx.bandLabel,
            channel: result.vrx.channel,
            frequency: result.vrx.frequency,
            isExactMatch: result.exact,
          });
        } else if (vrxDeviceId) {
          logger.debug(`No VRX match found for device ${vrxDeviceId}`);
        }

        // Pokud není exact match, najít nejbližší frekvence
        if (!result.exact) {
          logger.debug('No exact match, finding nearest frequencies');
          // Získat všechny dostupné frekvence pro oba devices
          const allFrequencies: NearestFrequency[] = [];

          if (vtxDeviceId) {
            const vtxDevice = await queries.getDevice(db, vtxDeviceId);
            if (vtxDevice) {
              logger.debug(`VTX device loaded: ${vtxDevice.name} bands: ${vtxDevice.bands.length}`);
              for (const band of vtxDevice.bands) {
                for (const channel of band.channels) {
                  allFrequencies.push({
                    frequency: channel.frequency,
                    bandId: band.bandId,
                    bandSign: band.bandSign,
                    bandName: band.bandName,
                    channel: channel.number,
                    deviceType: 'VTX',
                    distance: Math.abs(channel.frequency - frequency),
                  });
                }
              }
            } else {
              logger.warn(`VTX device not found: ${vtxDeviceId}`);
            }
          }

          if (vrxDeviceId) {
            const vrxDevice = await queries.getDevice(db, vrxDeviceId);
            if (vrxDevice) {
              logger.debug(`VRX device loaded: ${vrxDevice.name} bands: ${vrxDevice.bands.length}`);
              for (const band of vrxDevice.bands) {
                for (const channel of band.channels) {
                  allFrequencies.push({
                    frequency: channel.frequency,
                    bandId: band.bandId,
                    bandSign: band.bandSign,
                    bandName: band.bandName,
                    channel: channel.number,
                    deviceType: 'VRX',
                    distance: Math.abs(channel.frequency - frequency),
                  });
                }
              }
            } else {
              logger.warn(`VRX device not found: ${vrxDeviceId}`);
            }
          }

          logger.debug(`Total frequencies available: ${allFrequencies.length}`);

          const nearest = findNearestFrequencies(allFrequencies, frequency);
          if (nearest) {
            const nearestFreqs = [
              ...nearest.lower.map((f: NearestFrequency) => f.frequency),
              ...nearest.upper.map((f: NearestFrequency) => f.frequency),
            ];
            const uniqueSuggestions = [...new Set(nearestFreqs)].sort((a, b) => a - b).slice(0, 5);
            logger.debug(`Suggestions: ${uniqueSuggestions}`);
            setSuggestions(uniqueSuggestions);
          }
        }
      } else {
        logger.debug('No result returned from findChannelByFrequency');
      }

      // Přidat do historie
      await queries.addToHistory(db, {
        vtxDeviceId: vtxDeviceId ?? undefined,
        vrxDeviceId: vrxDeviceId ?? undefined,
        frequency: frequency,
      });
    } catch (error) {
      logger.error('handleLookup error:', { error });
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
