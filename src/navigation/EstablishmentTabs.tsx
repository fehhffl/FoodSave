import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Package, ClipboardList, Bell } from 'lucide-react-native';
import { EstablishmentTabParamList } from './types';
import { DashboardScreen } from '../screens/establishment/DashboardScreen';
import { MyProductsScreen } from '../screens/establishment/MyProductsScreen';
import { ReservationsReceivedScreen } from '../screens/establishment/ReservationsReceivedScreen';
import { AlertsScreen } from '../screens/establishment/AlertsScreen';
import { colors, fontFamilies } from '../theme';

const Tab = createBottomTabNavigator<EstablishmentTabParamList>();

export function EstablishmentTabs() {
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
          if (route.name === 'Dashboard')
            return <LayoutDashboard size={size} color={color} strokeWidth={stroke} />;
          if (route.name === 'Products')
            return <Package size={size} color={color} strokeWidth={stroke} />;
          if (route.name === 'Reservations')
            return <ClipboardList size={size} color={color} strokeWidth={stroke} />;
          return <Bell size={size} color={color} strokeWidth={stroke} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Painel' }} />
      <Tab.Screen
        name="Products"
        component={MyProductsScreen}
        options={{ tabBarLabel: 'Produtos' }}
      />
      <Tab.Screen
        name="Reservations"
        component={ReservationsReceivedScreen}
        options={{ tabBarLabel: 'Reservas' }}
      />
      <Tab.Screen name="Alerts" component={AlertsScreen} options={{ tabBarLabel: 'Alertas' }} />
    </Tab.Navigator>
  );
}
