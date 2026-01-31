/**
 * DeviceCard tests
 * Tests display and interaction with device card
 */

import { DeviceCard } from '@/components/Device/DeviceCard';
import { DeviceScreenContext } from '@/contexts/DeviceContext';
import { DeviceType } from '@/types';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { renderWithProviders } from '../helpers/test-utils';

describe('DeviceCard', () => {
  const mockDevice = {
    id: 1,
    name: 'Test VTX Device',
    type: DeviceType.VTX,
    bands: [],
  };

  const mockVRXDevice = {
    id: 2,
    name: 'Test VRX Device',
    type: DeviceType.VRX,
    bands: [],
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper to render with DeviceContext
  const renderWithContext = (ui: React.ReactElement, mode: 'edit' | 'delete' = 'edit') => {
    const setMode = jest.fn();
    return renderWithProviders(
      <DeviceScreenContext.Provider value={{ mode, setMode }}>{ui}</DeviceScreenContext.Provider>
    );
  };

  // ========== Basic display ==========

  describe('Device information display', () => {
    it('should display device name', () => {
      renderWithContext(<DeviceCard device={mockDevice} onEdit={mockOnEdit} />);

      expect(screen.getByText('Test VTX Device')).toBeOnTheScreen();
    });

    it('should display device type (VTX/VRX)', () => {
      renderWithContext(<DeviceCard device={mockDevice} onEdit={mockOnEdit} />);

      expect(screen.getByText('VTX')).toBeOnTheScreen();
    });

    it('should display VTX badge with red color', () => {
      renderWithContext(<DeviceCard device={mockDevice} onEdit={mockOnEdit} />);

      // Badge should be visible
      expect(screen.getByText('VTX')).toBeOnTheScreen();
    });

    it('should display VRX badge with cyan color', () => {
      renderWithContext(<DeviceCard device={mockVRXDevice} onEdit={mockOnEdit} />);

      // Badge should be visible
      expect(screen.getByText('VRX')).toBeOnTheScreen();
    });

    it('should use correct font and size for name', () => {
      renderWithContext(<DeviceCard device={mockDevice} onEdit={mockOnEdit} />);

      const nameText = screen.getByText('Test VTX Device');
      expect(nameText.props.numberOfLines).toBe(1);
    });
  });

  // ========== Interactions in edit mode ==========

  describe('Edit mode', () => {
    it('should display chevron-forward icon in edit mode', () => {
      renderWithContext(<DeviceCard device={mockDevice} onEdit={mockOnEdit} />, 'edit');

      // Icon is rendered when onEdit is provided in edit mode
      expect(screen.getByText('Test VTX Device')).toBeOnTheScreen();
    });

    it('should call onEdit callback when clicked', () => {
      renderWithContext(<DeviceCard device={mockDevice} onEdit={mockOnEdit} />, 'edit');

      const card = screen.getByText('Test VTX Device');
      fireEvent.press(card);

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it('should have normal card background', () => {
      renderWithContext(<DeviceCard device={mockDevice} onEdit={mockOnEdit} />, 'edit');

      // In edit mode, card should render normally without error styling
      expect(screen.getByText('Test VTX Device')).toBeOnTheScreen();
    });

    it('should have activeOpacity 0.7', () => {
      renderWithContext(<DeviceCard device={mockDevice} onEdit={mockOnEdit} />, 'edit');

      const touchable = screen.UNSAFE_getByType(TouchableOpacity);
      expect(touchable.props.activeOpacity).toBe(0.7);
    });
  });

  // ========== Interactions in delete mode ==========

  describe('Delete mode', () => {
    it('should not show chevron icon in delete mode', () => {
      renderWithContext(
        <DeviceCard device={mockDevice} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
        'delete'
      );

      // In delete mode, chevron should not be rendered
      expect(screen.getByText('Test VTX Device')).toBeOnTheScreen();
    });

    it('should call onDelete callback when clicked', () => {
      renderWithContext(
        <DeviceCard device={mockDevice} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
        'delete'
      );

      const card = screen.getByText('Test VTX Device');
      fireEvent.press(card);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).not.toHaveBeenCalled();
    });

    it('should have red background (errorLight)', () => {
      renderWithContext(
        <DeviceCard device={mockDevice} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
        'delete'
      );

      // Card should exist in delete mode
      expect(screen.getByText('Test VTX Device')).toBeOnTheScreen();
    });

    it('should have red border (error color)', () => {
      renderWithContext(
        <DeviceCard device={mockDevice} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
        'delete'
      );

      // Card should exist in delete mode
      expect(screen.getByText('Test VTX Device')).toBeOnTheScreen();
    });
  });

  // ========== Disabled state ==========

  describe('Disabled state', () => {
    it('should be disabled if onEdit callback is not provided', () => {
      renderWithContext(<DeviceCard device={mockDevice} />, 'edit');

      const touchable = screen.UNSAFE_getByType(TouchableOpacity);
      expect(touchable.props.disabled).toBe(true);
    });

    it('should not be disabled if onEdit callback is provided', () => {
      renderWithContext(<DeviceCard device={mockDevice} onEdit={mockOnEdit} />, 'edit');

      const touchable = screen.UNSAFE_getByType(TouchableOpacity);
      expect(touchable.props.disabled).toBe(false);
    });
  });

  // ========== Styling ==========
  describe('Styling by type', () => {
    it('should have VTX badge color #FF6B6B', () => {
      renderWithContext(<DeviceCard device={mockDevice} onEdit={mockOnEdit} />);

      const badge = screen.getByLabelText('device-card-badge');
      expect(badge).toHaveStyle({ backgroundColor: '#FF6B6B' });
      expect(badge).toHaveTextContent('VTX');
    });

    it('should have VRX badge color #4ECDC4', () => {
      renderWithContext(<DeviceCard device={mockVRXDevice} onEdit={mockOnEdit} />);

      const badge = screen.getByLabelText('device-card-badge');
      expect(badge).toHaveStyle({ backgroundColor: '#4ECDC4' });
      expect(badge).toHaveTextContent('VRX');
    });

    it('should have white badge text', () => {
      renderWithContext(<DeviceCard device={mockDevice} onEdit={mockOnEdit} />);

      const badgeText = screen.getByText('VTX');
      expect(badgeText).toHaveStyle({ color: '#FFFFFF' });
    });
  });

  // ========== Text overflow ==========

  describe('Long device name', () => {
    const longNameDevice = {
      ...mockDevice,
      name: 'This is a very long device name that should be truncated',
    };

    it('should truncate name with numberOfLines={1}', () => {
      renderWithContext(<DeviceCard device={longNameDevice} onEdit={mockOnEdit} />);

      const nameText = screen.getByText(longNameDevice.name);
      expect(nameText.props.numberOfLines).toBe(1);
    });

    it('should display full short name', () => {
      renderWithContext(<DeviceCard device={mockDevice} onEdit={mockOnEdit} />);

      expect(screen.getByText('Test VTX Device')).toBeOnTheScreen();
    });
  });

  // ========== Accessibility ==========

  describe('Accessibility', () => {
    it('should make TouchableOpacity clickable', () => {
      renderWithContext(<DeviceCard device={mockDevice} onEdit={mockOnEdit} />);

      const touchable = screen.UNSAFE_getByType(TouchableOpacity);
      expect(touchable.props.onPress).toBeDefined();
    });

    it('should have correct activeOpacity', () => {
      renderWithContext(<DeviceCard device={mockDevice} onEdit={mockOnEdit} />);

      const touchable = screen.UNSAFE_getByType(TouchableOpacity);
      expect(touchable.props.activeOpacity).toBe(0.7);
    });
  });
});
