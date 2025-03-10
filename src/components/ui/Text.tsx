import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

interface TextProps extends RNTextProps {
  variant?: 'default' | 'title' | 'subtitle' | 'caption' | 'label';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export function Text({
  children,
  variant = 'default',
  weight = 'normal',
  style,
  ...props
}: TextProps) {
  const getTextStyle = () => {
    const baseStyle = [styles.base];

    // Add variant styles
    switch (variant) {
      case 'title':
        baseStyle.push(styles.title);
        break;
      case 'subtitle':
        baseStyle.push(styles.subtitle);
        break;
      case 'caption':
        baseStyle.push(styles.caption);
        break;
      case 'label':
        baseStyle.push(styles.label);
        break;
    }

    // Add weight styles
    switch (weight) {
      case 'medium':
        baseStyle.push(styles.medium);
        break;
      case 'semibold':
        baseStyle.push(styles.semibold);
        break;
      case 'bold':
        baseStyle.push(styles.bold);
        break;
    }

    return [...baseStyle, style];
  };

  return (
    <RNText style={getTextStyle()} {...props}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    color: '#1f2937',
    fontFamily: 'System',
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 28,
    color: '#4b5563',
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6b7280',
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#374151',
  },
  medium: {
    fontWeight: '500',
  },
  semibold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
});