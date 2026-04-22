import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MapPin, Calendar, User } from 'lucide-react-native';
import { ConsumerTabParamList } from './types';
import { HomeScreen } from '../screens/consumer/HomeScreen';
import { MapScreen } from '../screens/consumer/MapScreen';
import { ReservationsScreen } from '../screens/consumer/ReservationsScreen';
import { ProfileScreen } from '../screens/consumer/ProfileScreen';
import { colors, fontFamilies } from '../theme';

const Tab = createBottomTabNavigator<ConsumerTabParamList>();

export function ConsumerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.paper,
          borderTopColor: colors.fog,
          height: 86,
          paddingTop: 8,
          paddingBottom: 24,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamilies.sansMedium,
          fontSize: 11,
          marginTop: 4,
          letterSpacing: 0.2,
        },
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.smoke,
        tabBarIcon: ({ color, focused }) => {
          const size = 22;
          const stroke = focused ? 2.4 : 1.8;
          if (route.name === 'Home') return <Home size={size} color={color} strokeWidth={stroke} />;
          if (route.name === 'Map') return <MapPin size={size} color={color} strokeWidth={stroke} />;
          if (route.name === 'Reservations')
            return <Calendar size={size} color={color} strokeWidth={stroke} />;
          return <User size={size} color={color} strokeWidth={stroke} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ tabBarLabel: 'Mapa' }} />
      <Tab.Screen
        name="Reservations"
        component={ReservationsScreen}
        options={{ tabBarLabel: 'Reservas' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
}
