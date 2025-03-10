import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BadgeProps {
  label: string;
  color?: string;
  icon?: string;
  variant?: 'solid' | 'outline';
}

export function Badge({
  label,
  color = '#2563eb',
  icon,
  variant = 'solid',
}: BadgeProps) {
  const containerStyle = {
    backgroundColor: variant === 'solid' ? color : 'transparent',
    borderColor: color,
    borderWidth: variant === 'outline' ? 1 : 0,
  };

  const textStyle = {
    color: variant === 'solid' ? '#ffffff' : color,
  };

  const iconColor = variant === 'solid' ? '#ffffff' : color;

  return (
    <View style={[styles.container, containerStyle]}>
      {icon && (
        <Ionicons
          name={icon as any}
          size={12}
          color={iconColor}
          style={styles.icon}
        />
      )}
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  icon: {
    marginRight: 4,
  },
});