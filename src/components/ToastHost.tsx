import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Easing } from 'react-native';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react-native';
import { useStore } from '../store/useStore';
import { colors, radius, shadows, spacing } from '../theme';
import { Text } from './Text';

export function ToastHost() {
  const toast = useStore((s) => s.toast);
  const clearToast = useStore((s) => s.clearToast);
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (!toast) return;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    const t = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(() => clearToast());
    }, 2200);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;

  const tone = toast.tone ?? 'info';
  const palette =
    tone === 'success'
      ? { bg: colors.forest, fg: colors.white, icon: <CheckCircle2 size={18} color={colors.amberSoft} /> }
      : tone === 'warn'
      ? { bg: colors.amber, fg: colors.white, icon: <AlertTriangle size={18} color="#fff" /> }
      : tone === 'danger'
      ? { bg: colors.danger, fg: colors.white, icon: <AlertTriangle size={18} color="#fff" /> }
      : { bg: colors.ink, fg: colors.white, icon: <Info size={18} color="#fff" /> };

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        { opacity, transform: [{ translateY: translate }] },
      ]}
    >
      <View style={[styles.toast, { backgroundColor: palette.bg }, shadows.raised]}>
        {palette.icon}
        <Text variant="bodyMedium" color={palette.fg} style={{ flex: 1 }}>
          {toast.message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radius.pill,
    maxWidth: 360,
  },
});
