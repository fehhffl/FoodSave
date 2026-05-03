import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Check, Clock, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Screen, Text, Button, Card } from '../../components';
import { colors, spacing, radius, shadows, fontFamilies } from '../../theme';
import { useStore } from '../../store/useStore';
import { formatTimeRange } from '../../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'ReservationConfirmed'>;

export function ReservationConfirmedScreen({ route, navigation }: Props) {
  const reservation = useStore((s) =>
    s.reservations.find((r) => r.id === route.params.reservationId),
  );
  const establishment = useStore((s) =>
    s.establishments.find((e) => e.id === reservation?.establishmentId),
  );

  if (!reservation) return null;

  return (
    <Screen bg={colors.cream} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#3a5a36', '#1f3520', '#16261a']}
          style={styles.hero}
          start={{ x: 0.3, y: 0 }}
          end={{ x: 0.7, y: 1 }}
        >
          <View style={styles.heroGlow} />
          <View style={styles.checkCircle}>
            <Check size={36} color={colors.ink} strokeWidth={3} />
          </View>
          <Text variant="displayMd" color={colors.cream} align="center">
            Reserva{' '}
            <Text variant="displayMd" italic color={colors.amberSoft}>
              confirmada!
            </Text>
          </Text>
          <Text
            variant="bodyLg"
            color={colors.cream}
            align="center"
            style={{ marginTop: spacing.sm, paddingHorizontal: spacing.xl, opacity: 0.92 }}
          >
            Apresente o código abaixo no estabelecimento para retirar o seu pedido.
          </Text>
        </LinearGradient>

        <View style={styles.body}>
          <Card padding={spacing.xl} bg={colors.paper}>
            <Text variant="label" color={colors.smoke} align="center">
              SEU CÓDIGO
            </Text>
            <Text
              align="center"
              style={{
                fontFamily: fontFamilies.serifBold,
                fontSize: 30,
                lineHeight: 40,
                color: colors.ink,
                marginTop: 6,
                letterSpacing: 1.4,
                includeFontPadding: false,
              }}
            >
              {reservation.code}
            </Text>
            <View style={styles.qrWrap}>
              <QRCode
                value={`FOODSAVE|${reservation.id}|${reservation.code}`}
                size={170}
                color={colors.ink}
                backgroundColor={colors.paper}
              />
            </View>
          </Card>

          <Card padding={0} bg={colors.paper} style={{ marginTop: spacing.base }}>
            <View style={styles.row}>
              <Clock size={18} color={colors.amber} strokeWidth={2.2} />
              <Text variant="bodyMedium" color={colors.ink} style={{ flex: 1 }}>
                Retirada
              </Text>
              <Text variant="bodyMedium" italic color={colors.forest}>
                {formatTimeRange(reservation.pickupFrom, reservation.pickupUntil)}, hoje
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <MapPin size={18} color={colors.amber} strokeWidth={2.2} />
              <Text variant="bodyMedium" color={colors.ink} style={{ flex: 1 }}>
                Endereço
              </Text>
              <Text variant="bodyMedium" italic color={colors.forest}>
                {establishment?.address}
              </Text>
            </View>
          </Card>

          <Button
            label="Abrir no mapa"
            variant="amber"
            onPress={() =>
              Linking.openURL(
                `https://maps.apple.com/?q=${encodeURIComponent(
                  establishment?.address ?? '',
                )}`,
              )
            }
            style={{ marginTop: spacing.xl }}
          />
          <Button
            label="Voltar para minhas reservas"
            variant="ghost"
            onPress={() => navigation.replace('ConsumerRoot', { screen: 'Reservations' })}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroGlow: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor: '#e5a23a',
    opacity: 0.22,
  },
  checkCircle: {
    width: 90,
    height: 60,
    borderRadius: 45,
    backgroundColor: colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  body: {
    paddingHorizontal: spacing.lg,
    marginTop: -20,
  },
  qrWrap: {
    alignItems: 'center',
    marginTop: spacing.lg,
    padding: 12,
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.fog,
    marginHorizontal: 16,
  },
});
