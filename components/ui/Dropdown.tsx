import Layout from '@/constants/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

interface DropdownItem {
  label: string;
  value: string | number;
}

interface DropdownProps {
  label?: string;
  value: string | number;
  onChange?: (value: string | number) => void;
  onValueChange?: (value: string | number) => void;
  items?: DropdownItem[];
  options?: DropdownItem[];
  placeholder?: string;
  enabled?: boolean;
}

export function Dropdown({
  label,
  value,
  onChange,
  onValueChange,
  items,
  options,
  placeholder = 'Select...',
  enabled = true,
}: DropdownProps) {
  const { colors } = useTheme();

  const dropdownItems = items || options || [];
  const handleChange = onChange || onValueChange || (() => {});

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <View
        style={[
          styles.pickerContainer,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
      >
        <Picker
          selectedValue={value}
          onValueChange={handleChange}
          enabled={enabled}
          style={[styles.picker, { color: colors.text }]}
          dropdownIconColor={colors.textSecondary}
        >
          <Picker.Item label={placeholder} value="" color={colors.textSecondary} />
          {dropdownItems.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.md,
  },
  label: {
    fontSize: Layout.fontSize.sm,
    marginBottom: Layout.spacing.xs,
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: Layout.borderRadius.sm,
    overflow: 'hidden',
    minHeight: Layout.minTouchSize,
    justifyContent: 'center',
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : Layout.minTouchSize,
  },
});
