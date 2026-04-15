import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, fontFamilies } from '../theme';
import { Text } from './Text';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  rightSlot?: React.ReactNode;
  underline?: boolean;
}

export function Input({
  label,
  error,
  rightSlot,
  underline = true,
  style,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ width: '100%' }}>
      {label ? (
        <Text variant="label" color={colors.smoke} style={{ marginBottom: 6 }}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.row,
          underline ? styles.underline : styles.box,
          {
            borderBottomColor: error
              ? colors.danger
              : focused
              ? colors.forest
              : colors.fog,
          },
        ]}
      >
        <TextInput
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          placeholderTextColor={colors.haze}
          style={[
            styles.input,
            { color: colors.ink, fontFamily: fontFamilies.sans },
            style,
          ]}
        />
        {rightSlot}
      </View>
      {error ? (
        <Text variant="bodySm" color={colors.danger} style={{ marginTop: 4 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  underline: {
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  box: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.paper,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
});
