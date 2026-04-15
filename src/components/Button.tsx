import React from 'react';
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native';
import { colors, radius, shadows, spacing } from '../theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'amber' | 'dark';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  fullWidth = true,
  icon,
  iconRight,
  style,
}: Props) {
  const palette = palettes[variant];
  const sz = sizes[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border ?? 'transparent',
          borderWidth: palette.border ? 1 : 0,
          paddingVertical: sz.py,
          paddingHorizontal: sz.px,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        variant === 'primary' || variant === 'dark' || variant === 'amber'
          ? shadows.cta
          : null,
        style as ViewStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <View style={styles.row}>
          {icon ? <View style={{ marginRight: 8 }}>{icon}</View> : null}
          <Text variant="button" color={palette.fg}>
            {label}
          </Text>
          {iconRight ? <View style={{ marginLeft: 8 }}>{iconRight}</View> : null}
        </View>
      )}
    </Pressable>
  );
}

const palettes: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.forest, fg: colors.white },
  secondary: { bg: colors.cream, fg: colors.forest, border: colors.fog },
  ghost: { bg: 'transparent', fg: colors.forest, border: colors.fog },
  amber: { bg: colors.amber, fg: colors.white },
  dark: { bg: colors.ink, fg: colors.white },
};

const sizes: Record<Size, { py: number; px: number }> = {
  sm: { py: 10, px: 16 },
  md: { py: 14, px: 20 },
  lg: { py: 18, px: 24 },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
