import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { Text } from './Text';

export function Divider({ label, color = colors.fog }: { label?: string; color?: string }) {
  if (!label) return <View style={[styles.line, { backgroundColor: color }]} />;
  return (
    <View style={styles.row}>
      <View style={[styles.line, { backgroundColor: color, flex: 1 }]} />
      <Text variant="label" color={colors.smoke} style={{ marginHorizontal: 12 }}>
        {label}
      </Text>
      <View style={[styles.line, { backgroundColor: color, flex: 1 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  line: { height: 1 },
});
