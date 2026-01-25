import * as queries from '@/db/queries';
import type { CreateDeviceData, CreateDeviceInput } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDatabase } from './useDatabase';

/**
 * Hook pro získání všech zařízení podle typu
 */
export function useDevices(type?: 'VTX' | 'VRX') {
  const db = useDatabase();

  return useQuery({
    queryKey: ['devices', type, db],
    queryFn: () => queries.getDevicesByType(db, type),
  });
}

/**
 * Hook pro získání jednoho zařízení
 */
export function useDevice(deviceId: number | null) {
  const db = useDatabase();

  return useQuery({
    queryKey: ['device', deviceId, db],
    queryFn: () => (deviceId ? queries.getDevice(db, deviceId) : null),
    enabled: deviceId !== null,
  });
}

/**
 * Hook pro vytvoření zařízení
 */
export function useCreateDevice() {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateDeviceInput) => {
      // Get band info to create labels
      const allBands = await queries.getAllBands(db);
      const bands = input.bandIds.map((bandId) => {
        const band = allBands.find((b) => b.id === bandId);
        // Use custom label if provided, otherwise use bandSign
        const label = input.bandLabels?.[bandId] || band?.bandSign || `Band ${bandId}`;
        return {
          bandId,
          label,
        };
      });

      const data: CreateDeviceData = {
        name: input.name,
        type: input.type,
        bands,
      };

      return queries.createDevice(db, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
}

/**
 * Hook pro aktualizaci zařízení
 */
export function useUpdateDevice() {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      deviceId,
      input,
    }: {
      deviceId: number;
      input: Partial<CreateDeviceInput>;
    }) => {
      let data: Partial<CreateDeviceData> = {
        name: input.name,
        type: input.type,
      };

      // Convert bandIds to bands if provided
      if (input.bandIds) {
        const allBands = await queries.getAllBands(db);
        const bands = input.bandIds.map((bandId) => {
          const band = allBands.find((b) => b.id === bandId);
          // Use custom label if provided, otherwise use bandSign
          const label = input.bandLabels?.[bandId] || band?.bandSign || `Band ${bandId}`;
          return {
            bandId,
            label,
          };
        });
        data.bands = bands;
      }

      return queries.updateDevice(db, deviceId, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['device', variables.deviceId] });
    },
  });
}

/**
 * Hook pro smazání zařízení
 */
export function useDeleteDevice() {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deviceId: number) => queries.deleteDevice(db, deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
}
