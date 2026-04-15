import React from 'react';
import { View, ViewStyle, StyleSheet, Pressable } from 'react-native';
import { colors, radius, shadows, spacing } from '../theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  padding?: number;
  bg?: string;
  elevated?: boolean;
}

export function Card({
  children,
  style,
  onPress,
  padding = spacing.base,
  bg = colors.paper,
  elevated = true,
}: Props) {
  const cardStyle = [
    styles.base,
    elevated && shadows.card,
    { backgroundColor: bg, padding },
    style as ViewStyle,
  ];

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [cardStyle, pressed && { opacity: 0.92 }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
  },
});
