import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  ConsumerRoot: NavigatorScreenParams<ConsumerTabParamList> | undefined;
  EstablishmentRoot: NavigatorScreenParams<EstablishmentTabParamList> | undefined;
  ProductDetail: { productId: string };
  ReservationConfirmed: { reservationId: string };
  ReservationQR: { reservationId: string };
  AddProduct: undefined;
  BatchProducts: undefined;
};

export type ConsumerTabParamList = {
  Home: undefined;
  Map: undefined;
  Reservations: undefined;
  Profile: undefined;
};

export type EstablishmentTabParamList = {
  Dashboard: undefined;
  Products: undefined;
  Reservations: undefined;
  Alerts: undefined;
};
