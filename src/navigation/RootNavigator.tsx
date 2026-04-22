import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ConsumerTabs } from './ConsumerTabs';
import { EstablishmentTabs } from './EstablishmentTabs';
import { ProductDetailScreen } from '../screens/consumer/ProductDetailScreen';
import { ReservationConfirmedScreen } from '../screens/consumer/ReservationConfirmedScreen';
import { ReservationQRScreen } from '../screens/consumer/ReservationQRScreen';
import { AddProductScreen } from '../screens/establishment/AddProductScreen';
import { BatchProductsScreen } from '../screens/establishment/BatchProductsScreen';
import { useStore } from '../store/useStore';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const profile = useStore((s) => s.profile);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.cream },
          animation: 'slide_from_right',
        }}
      >
        {profile === null && (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
        {profile === 'consumer' && (
          <>
            <Stack.Screen name="ConsumerRoot" component={ConsumerTabs} />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="ReservationConfirmed"
              component={ReservationConfirmedScreen}
              options={{ animation: 'fade' }}
            />
            <Stack.Screen
              name="ReservationQR"
              component={ReservationQRScreen}
              options={{ presentation: 'modal' }}
            />
          </>
        )}
        {profile === 'establishment' && (
          <>
            <Stack.Screen name="EstablishmentRoot" component={EstablishmentTabs} />
            <Stack.Screen
              name="AddProduct"
              component={AddProductScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="BatchProducts"
              component={BatchProductsScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
