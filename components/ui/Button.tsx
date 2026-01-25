import Layout from '@/constants/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({
  onPress,
  title,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const { colors } = useTheme();

  const content = title || children;

  const getBackgroundColor = () => {
    if (disabled) return colors.disabled;
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'danger':
        return colors.error;
      case 'secondary':
        return colors.card;
      case 'ghost':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;
    switch (variant) {
      case 'primary':
      case 'danger':
        return '#FFFFFF';
      case 'secondary':
      case 'ghost':
        return colors.text;
      default:
        return '#FFFFFF';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return Layout.spacing.sm;
      case 'md':
        return Layout.spacing.md;
      case 'lg':
        return Layout.spacing.lg;
      default:
        return Layout.spacing.md;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical: getPadding(),
          paddingHorizontal: getPadding() * 1.5,
          borderColor:
            variant === 'secondary' || variant === 'ghost' ? colors.border : 'transparent',
          borderWidth: variant === 'secondary' || variant === 'ghost' ? 1 : 0,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor(), fontSize: Layout.fontSize[size] }]}>
          {content}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Layout.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Layout.minTouchSize,
  },
  text: {
    fontWeight: '600',
  },
});
