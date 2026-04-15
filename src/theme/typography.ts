import { TextStyle } from 'react-native';

export const fontFamilies = {
  serif: 'Fraunces_500Medium',
  serifBold: 'Fraunces_700Bold',
  serifItalic: 'Fraunces_500Medium_Italic',
  serifBoldItalic: 'Fraunces_700Bold_Italic',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemibold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
};

type Variant = TextStyle;

export const text = {
  displayXl: {
    fontFamily: fontFamilies.serifBold,
    fontSize: 44,
    lineHeight: 50,
    letterSpacing: -0.5,
  } as Variant,
  displayLg: {
    fontFamily: fontFamilies.serifBold,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.4,
  } as Variant,
  displayMd: {
    fontFamily: fontFamilies.serifBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.3,
  } as Variant,
  serifLg: {
    fontFamily: fontFamilies.serifBold,
    fontSize: 22,
    lineHeight: 28,
  } as Variant,
  serifMd: {
    fontFamily: fontFamilies.serifBold,
    fontSize: 18,
    lineHeight: 24,
  } as Variant,
  serifItalic: {
    fontFamily: fontFamilies.serifBoldItalic,
  } as Variant,

  bodyLg: {
    fontFamily: fontFamilies.sans,
    fontSize: 16,
    lineHeight: 24,
  } as Variant,
  body: {
    fontFamily: fontFamilies.sans,
    fontSize: 14,
    lineHeight: 20,
  } as Variant,
  bodySm: {
    fontFamily: fontFamilies.sans,
    fontSize: 12,
    lineHeight: 16,
  } as Variant,
  bodyMedium: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 14,
    lineHeight: 20,
  } as Variant,
  label: {
    fontFamily: fontFamilies.sansSemibold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as Variant,
  caption: {
    fontFamily: fontFamilies.sans,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.4,
  } as Variant,
  button: {
    fontFamily: fontFamilies.sansSemibold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.2,
  } as Variant,
};
