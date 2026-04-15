import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius } from '../theme';
import { Text } from './Text';

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'dark' | 'forest';
}

export function Chip({ label, active, onPress, style, variant = 'dark' }: Props) {
  const activeBg = variant === 'forest' ? colors.forest : colors.ink;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: active ? activeBg : 'transparent',
          borderColor: active ? activeBg : colors.fog,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text
        variant="bodyMedium"
        color={active ? colors.white : colors.ash}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
