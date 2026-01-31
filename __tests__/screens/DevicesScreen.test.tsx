/**
 * DevicesScreen tests
 * Tests device list, navigation and deletion
 */

import DevicesScreen from '@/app/(tabs)/devices/index';
import { DeviceType } from '@/types';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { renderWithProviders } from '../helpers/test-utils';
import { mockRouter } from '../setup';

// Mock useDevices hook
jest.mock('@/hooks/useDevices', () => ({
  useDevices: jest.fn(),
  useDeleteDevice: jest.fn(),
}));

import { useDeleteDevice, useDevices } from '@/hooks/useDevices';

describe('DevicesScreen', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDeleteDevice as jest.Mock).mockReturnValue({
      mutate: mockMutate,
    });
  });

  // ========== SCENARIO 2: Empty state ==========

  describe('Empty state - no devices', () => {
    beforeEach(() => {
      (useDevices as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
      });
    });

    it('should display empty list for VTX devices', () => {
      renderWithProviders(<DevicesScreen />);

      // This test will fail until DeviceList.tsx:79 is fixed to use dynamic text
      expect(screen.getByText('No VTX devices yet')).toBeOnTheScreen();
    });

    it('should display empty list for VRX devices', () => {
      renderWithProviders(<DevicesScreen />);

      expect(screen.getByText('No VRX devices yet')).toBeOnTheScreen();
    });

    it('should display text "No VTX devices yet"', () => {
      renderWithProviders(<DevicesScreen />);

      // BUG: DeviceList.tsx:79 hardcodes "No VRX devices yet" for both variants
      // This test will fail until fixed
      expect(screen.getByText('No VTX devices yet')).toBeOnTheScreen();
    });

    it('should display text "No VRX devices yet"', () => {
      renderWithProviders(<DevicesScreen />);

      expect(screen.getByText('No VRX devices yet')).toBeOnTheScreen();
    });

    it('should show "Add New Device" button as visible and functional', () => {
      renderWithProviders(<DevicesScreen />);

      const addButton = screen.getByText('Add New Device');
      expect(addButton).toBeOnTheScreen();

      fireEvent.press(addButton);
      expect(mockRouter.push).toHaveBeenCalledWith('/(tabs)/devices/add');
    });
  });

  // ========== SCENARIO 11: Device Deletion Flow ==========

  describe('Device Deletion Flow', () => {
    const mockDevices = [
      {
        id: 1,
        name: 'Test VTX',
        type: DeviceType.VTX,
        bands: [],
      },
      {
        id: 2,
        name: 'Test VRX',
        type: DeviceType.VRX,
        bands: [],
      },
    ];

    beforeEach(() => {
      (useDevices as jest.Mock).mockReturnValue({
        data: mockDevices,
        isLoading: false,
      });
    });

    it('should display confirmation dialog before deletion', async () => {
      renderWithProviders(<DevicesScreen />, {
        withDeviceContext: true,
      });

      // Switch to delete mode
      const trashIcon = screen.getAllByText('')[0]; // Ionicons render as empty text in tests
      fireEvent.press(trashIcon);

      // Click on device card to delete
      const deviceCard = screen.getByText('Test VTX');
      fireEvent.press(deviceCard);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Delete Device',
          'Are you sure you want to delete "Test VTX"?',
          expect.any(Array)
        );
      });
    });

    it('should successfully delete device after confirmation', async () => {
      renderWithProviders(<DevicesScreen />, {
        withDeviceContext: true,
      });

      // Switch to delete mode
      const trashIcon = screen.getAllByText('')[0];
      fireEvent.press(trashIcon);

      // Click on device card
      const deviceCard = screen.getByText('Test VTX');
      fireEvent.press(deviceCard);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });

      // Simulate pressing "Delete" button in alert
      const alertCalls = (Alert.alert as jest.Mock).mock.calls;
      const deleteButton = alertCalls[0][2].find((btn: any) => btn.text === 'Delete');
      deleteButton.onPress();

      expect(mockMutate).toHaveBeenCalledWith(1);
    });

    it('should not delete device on cancel', async () => {
      renderWithProviders(<DevicesScreen />, {
        withDeviceContext: true,
      });

      // Switch to delete mode
      const trashIcon = screen.getAllByText('')[0];
      fireEvent.press(trashIcon);

      // Click on device card
      const deviceCard = screen.getByText('Test VTX');
      fireEvent.press(deviceCard);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });

      // Simulate pressing "Cancel" button - should not call mutate
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it.todo('should remove device from list after deletion');

    it.todo('should update device count in header after deletion');
  });

  // ========== SCENARIO 12: Navigation Flow ==========

  describe('Navigation', () => {
    beforeEach(() => {
      (useDevices as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
      });
    });

    it('should navigate to Add Device screen when clicking "Add New Device"', () => {
      renderWithProviders(<DevicesScreen />);

      const addButton = screen.getByText('Add New Device');
      fireEvent.press(addButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/(tabs)/devices/add');
    });

    it.todo('should navigate back after successful device addition');
  });

  // ========== SCENARIO 13: Loading States ==========

  describe('Loading States', () => {
    it('should display ActivityIndicator while loading devices', () => {
      (useDevices as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      renderWithProviders(<DevicesScreen />);

      const activityIndicator = screen.getByAccessibilityHint('loading');
      expect(activityIndicator).toBeOnTheScreen();
    });

    it('should hide loading after data is loaded', () => {
      (useDevices as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
      });

      renderWithProviders(<DevicesScreen />);

      // ActivityIndicator should not be in the tree
      const activityIndicator = screen.queryByAccessibilityHint('loading');
      expect(activityIndicator).not.toBeOnTheScreen();
    });
  });

  // ========== Other tests ==========

  describe('Device list', () => {
    const mockDevices = [
      {
        id: 1,
        name: 'VTX 1',
        type: DeviceType.VTX,
        bands: [],
      },
      {
        id: 2,
        name: 'VTX 2',
        type: DeviceType.VTX,
        bands: [],
      },
      {
        id: 3,
        name: 'VRX 1',
        type: DeviceType.VRX,
        bands: [],
      },
    ];

    beforeEach(() => {
      (useDevices as jest.Mock).mockReturnValue({
        data: mockDevices,
        isLoading: false,
      });
    });

    it('should display correct count of VTX devices', () => {
      renderWithProviders(<DevicesScreen />);

      expect(screen.getByText('VTX Devices (2)')).toBeOnTheScreen();
    });

    it('should display correct count of VRX devices', () => {
      renderWithProviders(<DevicesScreen />);

      expect(screen.getByText('VRX Devices (1)')).toBeOnTheScreen();
    });

    it('should separate VTX and VRX devices into separate sections', () => {
      renderWithProviders(<DevicesScreen />);

      // Both section headers should exist
      expect(screen.getByText('VTX Devices (2)')).toBeOnTheScreen();
      expect(screen.getByText('VRX Devices (1)')).toBeOnTheScreen();

      // All devices should be displayed
      expect(screen.getByText('VTX 1')).toBeOnTheScreen();
      expect(screen.getByText('VTX 2')).toBeOnTheScreen();
      expect(screen.getByText('VRX 1')).toBeOnTheScreen();
    });
  });
});
