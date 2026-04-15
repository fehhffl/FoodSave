import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadows } from '../theme';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  size?: number;
  bg?: string;
  style?: ViewStyle;
  elevated?: boolean;
}

export function IconButton({
  children,
  onPress,
  size = 44,
  bg = colors.paper,
  style,
  elevated = true,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: radius.pill,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.85 : 1,
        },
        elevated && shadows.card,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}
