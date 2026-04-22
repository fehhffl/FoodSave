import 'react-native-gesture-handler';
import React, { useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts as useFraunces,
  Fraunces_500Medium,
  Fraunces_500Medium_Italic,
  Fraunces_700Bold,
  Fraunces_700Bold_Italic,
} from '@expo-google-fonts/fraunces';
import {
  useFonts as useInter,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ToastHost } from './src/components/ToastHost';
import { colors } from './src/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [frauncesLoaded] = useFraunces({
    Fraunces_500Medium,
    Fraunces_500Medium_Italic,
    Fraunces_700Bold,
    Fraunces_700Bold_Italic,
  });
  const [interLoaded] = useInter({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const ready = frauncesLoaded && interLoaded;

  const onLayoutRoot = useCallback(async () => {
    if (ready) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) {
    return (
      <View style={[styles.fallback, { backgroundColor: colors.cream }]}>
        <ActivityIndicator color={colors.forest} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider onLayout={onLayoutRoot}>
        <StatusBar style="dark" backgroundColor={colors.cream} translucent={false} />
        <RootNavigator />
        <ToastHost />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
