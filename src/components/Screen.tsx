import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  bg?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  statusBar?: 'light' | 'dark';
}

export function Screen({
  children,
  scroll = false,
  bg = colors.cream,
  edges = ['top', 'left', 'right'],
  style,
  contentStyle,
  statusBar = 'dark',
}: Props) {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: bg }, style]} edges={edges}>
      <StatusBar barStyle={statusBar === 'light' ? 'light-content' : 'dark-content'} />
      {scroll ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[{ flexGrow: 1 }, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}
