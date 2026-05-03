import React from 'react';
import { Text as RNText, TextProps, StyleSheet, TextStyle } from 'react-native';
import { colors, fontFamilies, text } from '../theme';

type Variant = keyof typeof text;

interface Props extends TextProps {
  variant?: Variant;
  italic?: boolean;
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  style?: TextStyle | TextStyle[];
}

export function Text({
  variant = 'body',
  italic,
  color = colors.ink,
  weight,
  align,
  style,
  children,
  ...rest
}: Props) {
  const base = text[variant];
  const isSerif = base.fontFamily?.startsWith('Fraunces');

  let fontFamily = base.fontFamily;
  if (italic && isSerif) {
    fontFamily =
      fontFamily === fontFamilies.serifBold
        ? fontFamilies.serifBoldItalic
        : fontFamilies.serifItalic;
  }
  if (weight && !isSerif) {
    fontFamily =
      weight === 'medium'
        ? fontFamilies.sansMedium
        : weight === 'semibold'
        ? fontFamilies.sansSemibold
        : weight === 'bold'
        ? fontFamilies.sansBold
        : fontFamilies.sans;
  }

  return (
    <RNText
      {...rest}
      style={[
        base,
        { fontFamily, color, textAlign: align, includeFontPadding: false },
        style as TextStyle,
      ]}
    >
      {children}
    </RNText>
  );
}
