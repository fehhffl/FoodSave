import React from 'react';
import { View, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Screen, Text, Card, IconButton, Thumbnail, Button } from '../../components';
import { colors, spacing, fontFamilies } from '../../theme';
import { useStore } from '../../store/useStore';
import { formatBRL, formatTimeRange } from '../../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'ReservationQR'>;

export function ReservationQRScreen({ route, navigation }: Props) {
  const reservation = useStore((s) =>
    s.reservations.find((r) => r.id === route.params.reservationId),
  );
  const cancel = useStore((s) => s.cancelReservation);
  const showToast = useStore((s) => s.showToast);

  if (!reservation) return null;

  return (
    <Screen bg={colors.cream}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
        <View style={{ alignItems: 'flex-end' }}>
          <IconButton onPress={() => navigation.goBack()}>
            <X size={20} color={colors.ink} strokeWidth={2.2} />
          </IconButton>
        </View>

        <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
          <Text variant="serifLg" italic color={colors.smoke}>
            seu código
          </Text>
          <Text
            style={{
              fontFamily: fontFamilies.serifBold,
              fontSize: 36,
              lineHeight: 46,
              color: colors.ink,
              letterSpacing: 1.6,
              marginTop: 8,
              includeFontPadding: false,
            }}
          >
            {reservation.code}
          </Text>
        </View>

        <View style={styles.qrCard}>
          <QRCode
            value={`FOODSAVE|${reservation.id}|${reservation.code}`}
            size={220}
            color={colors.ink}
            backgroundColor={colors.paper}
          />
        </View>

        <Card padding={spacing.base} bg={colors.paper} style={{ marginTop: spacing.lg }}>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <Thumbnail letter={reservation.establishmentInitial} size={48} variant={reservation.thumbVariant} />
            <View style={{ flex: 1 }}>
              <Text variant="bodyMedium" color={colors.ink}>
                {reservation.productName}
              </Text>
              <Text variant="bodySm" color={colors.smoke}>
                {reservation.establishmentName} · {formatBRL(reservation.price)}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: spacing.md }}>
            <Text variant="label" color={colors.smoke}>
              JANELA DE RETIRADA
            </Text>
            <Text variant="serifMd" color={colors.ink} italic style={{ marginTop: 4 }}>
              {formatTimeRange(reservation.pickupFrom, reservation.pickupUntil)}
            </Text>
          </View>
        </Card>

        <Button
          label="Cancelar reserva"
          variant="ghost"
          style={{ marginTop: spacing.xl }}
          onPress={() => {
            cancel(reservation.id);
            showToast('Reserva cancelada.', 'warn');
            navigation.goBack();
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  qrCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
    padding: spacing.xl,
    borderRadius: 24,
    marginTop: spacing.xl,
    alignSelf: 'center',
  },
});
