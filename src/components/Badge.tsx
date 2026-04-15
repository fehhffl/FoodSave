import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius } from '../theme';
import { Text } from './Text';

type Tone = 'success' | 'amber' | 'orange' | 'forest' | 'neutral' | 'danger';

interface Props {
  label: string;
  tone?: Tone;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const tones: Record<Tone, { bg: string; fg: string }> = {
  success: { bg: '#dde6d6', fg: '#3c5a39' },
  amber: { bg: '#f8e4c5', fg: '#8a4f1f' },
  orange: { bg: '#fbdcc2', fg: '#a14a1d' },
  forest: { bg: '#2d4a2b', fg: '#ffffff' },
  neutral: { bg: '#ede4d3', fg: '#3d3d3d' },
  danger: { bg: '#f3cfc8', fg: '#7a2519' },
};

export function Badge({ label, tone = 'success', icon, style }: Props) {
  const t = tones[tone];
  return (
    <View style={[styles.base, { backgroundColor: t.bg }, style]}>
      {icon}
      <Text variant="bodySm" weight="semibold" color={t.fg}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    gap: 4,
    alignSelf: 'flex-start',
  },
});
