import Layout from '@/constants/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
}

export function Input({ label, error, keyboardType = 'default', ...props }: InputProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.background,
            borderColor: error ? colors.error : colors.border,
            color: colors.text,
          },
        ]}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType}
        {...props}
      />
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
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
  input: {
    borderWidth: 1,
    borderRadius: Layout.borderRadius.sm,
    padding: Layout.spacing.md,
    fontSize: Layout.fontSize.md,
    minHeight: Layout.minTouchSize,
  },
  error: {
    fontSize: Layout.fontSize.xs,
    marginTop: Layout.spacing.xs,
  },
});
