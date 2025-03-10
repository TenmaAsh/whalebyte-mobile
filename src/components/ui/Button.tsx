import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'default',
  size = 'medium',
  icon,
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const getContainerStyle = () => {
    const baseStyle = [styles.container, styles[size]];

    switch (variant) {
      case 'outline':
        baseStyle.push(styles.outline);
        break;
      case 'ghost':
        baseStyle.push(styles.ghost);
        break;
      default:
        baseStyle.push(styles.default);
    }

    if (disabled) {
      baseStyle.push(styles.disabled);
    }

    return [...baseStyle, style];
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];

    switch (variant) {
      case 'outline':
      case 'ghost':
        baseStyle.push(styles.outlineText);
        break;
      default:
        baseStyle.push(styles.defaultText);
    }

    if (disabled) {
      baseStyle.push(styles.disabledText);
    }

    return [...baseStyle, textStyle];
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'default' ? '#ffffff' : '#2563eb'}
          size="small"
        />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon as any}
              size={size === 'small' ? 16 : 20}
              color={variant === 'default' ? '#ffffff' : '#2563eb'}
              style={styles.icon}
            />
          )}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  default: {
    backgroundColor: '#2563eb',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  medium: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  text: {
    fontWeight: '600',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  defaultText: {
    color: '#ffffff',
  },
  outlineText: {
    color: '#2563eb',
  },
  disabledText: {
    opacity: 0.7,
  },
  icon: {
    marginRight: 8,
  },
});