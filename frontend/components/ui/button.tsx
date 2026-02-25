import React from 'react';
import {
  TouchableOpacity,
  type TouchableOpacityProps,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from './text';

export type ButtonProps = TouchableOpacityProps & {
  variant?: 'default' | 'outline' | 'ghost' | 'icon';
  label?: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  loading?: boolean;
  color?: string;
};

export const Button = ({
  variant = 'default',
  label,
  icon,
  loading,
  color,
  disabled,
  style,
  children,
  ...rest
}: ButtonProps) => {
  if (variant === 'icon') {
    return (
      <TouchableOpacity
        style={[styles.iconButton, style]}
        activeOpacity={0.7}
        hitSlop={8}
        disabled={disabled}
        {...rest}
      >
        <MaterialCommunityIcons name={icon!} size={16} color="#000000" />
      </TouchableOpacity>
    );
  }

  if (children) {
    return (
      <TouchableOpacity
        style={style}
        disabled={disabled || loading}
        activeOpacity={0.7}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  }

  const buttonStyle =
    variant === 'outline'
      ? styles.outlineButton
      : variant === 'ghost'
        ? styles.ghostButton
        : styles.button;

  const textStyle =
    variant === 'outline'
      ? styles.outlineLabel
      : variant === 'ghost'
        ? styles.ghostLabel
        : styles.label;

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'default' ? '#FFFFFF' : '#1C1C1E'} />
      ) : label ? (
        <Text style={[textStyle, color ? { color } : undefined]}>{label}</Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#1C1C1E',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  ghostButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
