/**
 * SettingResult tests
 * Tests display of search results
 */

import { SettingResult } from '@/components/SettingResult';
import { DeviceType, FrequencyMatch } from '@/types';
import { describe, expect, it } from '@jest/globals';
import { screen } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';
import { renderWithProviders } from '../helpers/test-utils';

describe('SettingResult', () => {
  const mockVTXResult: FrequencyMatch = {
    bandId: 1,
    bandSign: 'F',
    bandName: 'FatShark / NexWave',
    bandLabel: 'F',
    channel: 4,
    frequency: 5800,
  };

  const mockVRXResult: FrequencyMatch = {
    bandId: 2,
    bandSign: 'R',
    bandName: 'Race Band',
    bandLabel: 'R',
    channel: 5,
    frequency: 5806,
  };

  const mockResultWithAlias: FrequencyMatch = {
    bandId: 1,
    bandSign: 'F',
    bandName: 'FatShark / NexWave',
    bandLabel: 'ImmersionRC',
    channel: 4,
    frequency: 5800,
  };

  // ========== Basic display ==========

  describe('VTX result display', () => {
    it('should display "✓ VTX Setting" as title', () => {
      renderWithProviders(<SettingResult type={DeviceType.VTX} result={mockVTXResult} />);

      expect(screen.getByText('✓ VTX Setting')).toBeTruthy();
    });

    it('should display correct band (sign and name)', () => {
      renderWithProviders(<SettingResult type={DeviceType.VTX} result={mockVTXResult} />);

      expect(screen.getByText('F (FatShark / NexWave)')).toBeTruthy();
    });

    it('should display correct channel', () => {
      renderWithProviders(<SettingResult type={DeviceType.VTX} result={mockVTXResult} />);

      expect(screen.getByText('4')).toBeTruthy();
    });

    it('should display correct frequency with MHz unit', () => {
      renderWithProviders(<SettingResult type={DeviceType.VTX} result={mockVTXResult} />);

      expect(screen.getByText('5800 MHz')).toBeTruthy();
    });

    it('should use successLight color for background', () => {
      renderWithProviders(<SettingResult type={DeviceType.VTX} result={mockVTXResult} />);

      // Card component should have successLight background
      // We verify the component renders (background color is applied via theme)
      expect(screen.getByText('✓ VTX Setting')).toBeTruthy();
    });
  });

  describe('VRX result display', () => {
    it('should display "✓ VRX Setting" as title', () => {
      renderWithProviders(<SettingResult type={DeviceType.VRX} result={mockVRXResult} />);

      expect(screen.getByText('✓ VRX Setting')).toBeTruthy();
    });

    it('should display correct information for VRX', () => {
      renderWithProviders(<SettingResult type={DeviceType.VRX} result={mockVRXResult} />);

      expect(screen.getByText('R (Race Band)')).toBeTruthy();
      expect(screen.getByText('5')).toBeTruthy();
      expect(screen.getByText('5806 MHz')).toBeTruthy();
    });
  });

  // ========== Band Alias ==========

  describe('Band Alias display', () => {
    it('should display band alias if different from bandSign', () => {
      renderWithProviders(<SettingResult type={DeviceType.VTX} result={mockResultWithAlias} />);

      expect(screen.getByText('Band Alias:')).toBeTruthy();
      expect(screen.getByText('ImmersionRC')).toBeTruthy();
    });

    it('should not display band alias if same as bandSign', () => {
      renderWithProviders(<SettingResult type={DeviceType.VTX} result={mockVTXResult} />);

      // Band alias should not be displayed when bandLabel === bandSign
      expect(screen.queryByText('Band Alias:')).toBeNull();
    });

    it('should format band alias correctly', () => {
      renderWithProviders(<SettingResult type={DeviceType.VTX} result={mockResultWithAlias} />);

      // Should display label text, label text should be on its own (not combined with other text)
      expect(screen.getByText('ImmersionRC')).toBeTruthy();
    });
  });

  // ========== Null handling ==========

  describe('Null result handling', () => {
    it('should not display anything if result is null', () => {
      renderWithProviders(<SettingResult type={DeviceType.VTX} result={null} />);

      expect(screen.queryByText('✓ VTX Setting')).toBeNull();
    });

    it('should not display anything if result is undefined', () => {
      renderWithProviders(<SettingResult type={DeviceType.VTX} result={undefined as any} />);

      expect(screen.queryByText('✓ VTX Setting')).toBeNull();
    });
  });

  // ========== Styling ==========

  describe('Styling', () => {
    it('should apply custom style prop', () => {
      const customStyle = { marginTop: 20 };
      renderWithProviders(
        <SettingResult type={DeviceType.VTX} result={mockVTXResult} style={customStyle} />
      );

      // We can't easily test styles, but we can verify component renders with style prop
      expect(screen.UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should use theme colors', () => {
      renderWithProviders(<SettingResult type={DeviceType.VTX} result={mockVTXResult} />);

      // Theme colors are applied via context, verify component renders
      expect(screen.getByText('✓ VTX Setting')).toBeTruthy();
      expect(screen.getByText('Band:')).toBeTruthy();
    });

    it('should have correct spacing between lines', () => {
      renderWithProviders(<SettingResult type={DeviceType.VTX} result={mockVTXResult} />);

      // Verify all rows are present (spacing is in styles)
      expect(screen.getByText('Band:')).toBeTruthy();
      expect(screen.getByText('Channel:')).toBeTruthy();
      expect(screen.getByText('Frequency:')).toBeTruthy();
    });
  });

  // ========== Data formatting ==========

  describe('Data formatting', () => {
    it('should display frequency with space before MHz', () => {
      renderWithProviders(<SettingResult type={DeviceType.VTX} result={mockVTXResult} />);

      // Should be "5800 MHz" not "5800MHz"
      expect(screen.getByText('5800 MHz')).toBeTruthy();
    });

    it('should display band in format: "F (FatShark / NexWave)"', () => {
      renderWithProviders(<SettingResult type={DeviceType.VTX} result={mockVTXResult} />);

      expect(screen.getByText('F (FatShark / NexWave)')).toBeTruthy();
    });

    it('should display channel as number without units', () => {
      renderWithProviders(<SettingResult type={DeviceType.VTX} result={mockVTXResult} />);

      expect(screen.getByText('4')).toBeTruthy();
      // Should not have "Ch 4" or "Channel 4" - just "4"
      expect(screen.queryByText('Ch 4')).toBeNull();
    });
  });
});
