import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius } from '../theme';
import { Text } from './Text';

interface Props {
  letter?: string;
  icon?: React.ReactNode;
  size?: number;
  variant?: 'pizza' | 'bread' | 'meal' | 'sage' | 'amber' | 'forest' | 'neutral';
  style?: ViewStyle;
}

const palettes: Record<NonNullable<Props['variant']>, [string, string]> = {
  pizza: ['#e8825a', '#c44a3d'],
  bread: ['#d9a86a', '#a26f33'],
  meal: ['#3a5a36', '#1f3520'],
  sage: ['#c8d5c0', '#9bb293'],
  amber: ['#e8a45a', '#b85e2d'],
  forest: ['#3a5a36', '#1f3520'],
  neutral: ['#ede4d3', '#c8b896'],
};

export function Thumbnail({
  letter,
  icon,
  size = 64,
  variant = 'sage',
  style,
}: Props) {
  const palette = palettes[variant];
  const isDark = ['meal', 'forest'].includes(variant);

  return (
    <LinearGradient
      colors={palette}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.base,
        { width: size, height: size, borderRadius: radius.lg },
        style,
      ]}
    >
      {/* decorative dots reminiscent of mockup illustrations */}
      <View
        style={{
          position: 'absolute',
          top: size * 0.2,
          left: size * 0.18,
          width: size * 0.18,
          height: size * 0.18,
          borderRadius: 999,
          backgroundColor: isDark ? '#e8a45a' : '#3a5a36',
          opacity: 0.85,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.55,
          left: size * 0.55,
          width: size * 0.14,
          height: size * 0.14,
          borderRadius: 999,
          backgroundColor: isDark ? '#c44a3d' : '#1f3520',
          opacity: 0.7,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.32,
          left: size * 0.62,
          width: size * 0.12,
          height: size * 0.12,
          borderRadius: 999,
          backgroundColor: isDark ? '#dde6d6' : '#c44a3d',
          opacity: 0.65,
        }}
      />
      {icon ? (
        <View style={{ zIndex: 2 }}>{icon}</View>
      ) : letter ? (
        <Text
          variant="serifLg"
          color={isDark ? colors.cream : colors.forestDeep}
          style={{ fontSize: size * 0.42, lineHeight: size * 0.5, zIndex: 2 }}
        >
          {letter}
        </Text>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
