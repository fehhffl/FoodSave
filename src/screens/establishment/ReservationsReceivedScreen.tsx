import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  EstablishmentTabParamList,
  RootStackParamList,
} from '../../navigation/types';
import { Screen, Text, Card, Thumbnail, Badge, Chip, Button } from '../../components';
import { colors, spacing, radius, fontFamilies } from '../../theme';
import { useStore } from '../../store/useStore';
import { formatBRL, formatTimeRange } from '../../utils/format';
import { Reservation } from '../../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<EstablishmentTabParamList, 'Reservations'>,
  NativeStackScreenProps<RootStackParamList>
>;

type Filter = 'pending' | 'completed';

export function ReservationsReceivedScreen() {
  const establishment = useStore((s) => s.establishment);
  const allReservations = useStore((s) => s.reservations);
  const confirmPickup = useStore((s) => s.confirmPickup);
  const showToast = useStore((s) => s.showToast);
  const [filter, setFilter] = useState<Filter>('pending');
  const reservations = useMemo(
    () =>
      allReservations.filter(
        (r) => !establishment?.id || r.establishmentId === establishment.id,
      ),
    [allReservations, establishment?.id],
  );

  const data = useMemo(() => {
    if (filter === 'pending')
      return reservations.filter((r) =>
        ['active', 'today', 'tomorrow'].includes(r.status),
      );
    return reservations.filter((r) => r.status === 'completed');
  }, [reservations, filter]);

  const onConfirm = (r: Reservation) => {
    confirmPickup(r.id);
    showToast(`Retirada de ${r.code} confirmada.`, 'success');
  };

  return (
    <Screen bg={colors.cream}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
        <Text variant="displayMd" color={colors.ink}>
          Reservas{' '}
          <Text variant="displayMd" italic color={colors.forest}>
            recebidas
          </Text>
        </Text>
        <Text variant="bodyLg" color={colors.smoke} style={{ marginTop: 4 }}>
          Confirme a retirada quando o cliente apresentar o código.
        </Text>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: spacing.lg }}>
          <Chip
            label={`Pendentes · ${reservations.filter((r) => ['active', 'today', 'tomorrow'].includes(r.status)).length}`}
            active={filter === 'pending'}
            onPress={() => setFilter('pending')}
            variant="forest"
          />
          <Chip
            label="Concluídas"
            active={filter === 'completed'}
            onPress={() => setFilter('completed')}
            variant="forest"
          />
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.xxxl,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={{ paddingTop: 48, alignItems: 'center' }}>
            <Text variant="body" color={colors.smoke}>
              {filter === 'pending'
                ? 'Sem reservas pendentes no momento.'
                : 'Sem retiradas concluídas ainda.'}
            </Text>
          </View>
        }
        renderItem={({ item: r }) => (
          <Card padding={14} bg={colors.paper}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text
                style={{
                  fontFamily: fontFamilies.serifBold,
                  fontSize: 18,
                  color: colors.ink,
                  letterSpacing: 0.8,
                }}
              >
                {r.code}
              </Text>
              {r.status === 'completed' ? (
                <Badge label="Retirado" tone="success" />
              ) : (
                <Badge
                  label={
                    r.status === 'today'
                      ? 'Hoje'
                      : r.status === 'tomorrow'
                      ? 'Amanhã'
                      : 'Agendada'
                  }
                  tone="amber"
                />
              )}
            </View>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Thumbnail letter={r.establishmentInitial} size={56} variant={r.thumbVariant} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="serifMd" color={colors.ink}>
                  {r.productName}
                </Text>
                <Text variant="bodySm" color={colors.smoke}>
                  Lucas Andrade · {r.quantity} un.
                </Text>
                <Text variant="bodySm" color={colors.smoke}>
                  {formatTimeRange(r.pickupFrom, r.pickupUntil)}
                </Text>
              </View>
              <Text variant="serifMd" color={colors.forest}>
                {formatBRL(r.price * r.quantity)}
              </Text>
            </View>
            {r.status !== 'completed' ? (
              <Button
                label="Confirmar retirada"
                icon={<CheckCircle2 size={18} color={colors.white} strokeWidth={2.4} />}
                onPress={() => onConfirm(r)}
                style={{ marginTop: spacing.md }}
              />
            ) : null}
          </Card>
        )}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});
