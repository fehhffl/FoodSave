import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { QrCode } from 'lucide-react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConsumerTabParamList, RootStackParamList } from '../../navigation/types';
import { Screen, Text, Card, Thumbnail } from '../../components';
import { colors, spacing, radius, fontFamilies } from '../../theme';
import { useStore, selectActiveReservations, selectHistoryReservations } from '../../store/useStore';
import { formatBRL, formatTimeRange, formatHour, hoursUntil } from '../../utils/format';
import { Reservation } from '../../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ConsumerTabParamList, 'Reservations'>,
  NativeStackScreenProps<RootStackParamList>
>;

type Tab = 'active' | 'history';

export function ReservationsScreen({ navigation }: Props) {
  const consumer = useStore((s) => s.consumer);
  const active = useStore(selectActiveReservations(consumer?.id));
  const history = useStore(selectHistoryReservations(consumer?.id));
  const [tab, setTab] = useState<Tab>('active');

  const data = tab === 'active' ? active : history;

  return (
    <Screen bg={colors.cream}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
        <Text variant="displayMd" color={colors.ink}>
          Suas{' '}
          <Text variant="displayMd" italic color={colors.forest}>
            reservas
          </Text>
        </Text>
        <Text variant="bodyLg" color={colors.smoke} style={{ marginTop: 4 }}>
          Gerencie seus pedidos ativos e veja seu histórico.
        </Text>

        <View style={styles.tabs}>
          <Pressable
            onPress={() => setTab('active')}
            style={[styles.tab, tab === 'active' && styles.tabActive]}
          >
            <Text
              variant="bodyMedium"
              color={tab === 'active' ? colors.white : colors.ash}
            >
              Ativas · {active.length}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setTab('history')}
            style={[styles.tab, tab === 'history' && styles.tabActive]}
          >
            <Text
              variant="bodyMedium"
              color={tab === 'history' ? colors.white : colors.ash}
            >
              Histórico
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.xxxl,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        renderItem={({ item }) => (
          <ReservationCard
            r={item}
            onPress={() => navigation.navigate('ReservationQR', { reservationId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={{ paddingVertical: 48, alignItems: 'center' }}>
            <Text variant="body" color={colors.smoke}>
              {tab === 'active'
                ? 'Você ainda não tem reservas ativas.'
                : 'Seu histórico aparecerá aqui.'}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

function ReservationCard({ r, onPress }: { r: Reservation; onPress: () => void }) {
  const accentByStatus: Record<string, string> = {
    today: colors.amber,
    tomorrow: colors.warning,
    active: colors.forest,
    completed: colors.haze,
    cancelled: colors.danger,
  };
  const accent = accentByStatus[r.status] ?? colors.haze;

  const pickupFromDate = new Date(r.pickupFrom);
  const isPast = r.status === 'completed' || r.status === 'cancelled';

  let timeLabel = '';
  if (r.status === 'today') {
    const h = hoursUntil(r.pickupFrom);
    timeLabel = `RETIRA EM ${h}H`;
  } else if (r.status === 'tomorrow') {
    timeLabel = 'AMANHÃ';
  } else if (r.status === 'completed') {
    const days = Math.round((Date.now() - new Date(r.completedAt ?? r.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    timeLabel = days === 0 ? '✓ RETIRADO · HOJE' : days === 1 ? '✓ RETIRADO · ONTEM' : `✓ RETIRADO · ${days}D ATRÁS`;
  } else if (r.status === 'cancelled') {
    timeLabel = '✕ CANCELADO';
  } else {
    timeLabel = 'AGENDADO';
  }

  const timeRange =
    r.status === 'tomorrow'
      ? formatTimeRange(r.pickupFrom, r.pickupUntil)
      : `até ${formatHour(r.pickupUntil).replace('h', ':00')}`;

  return (
    <Card onPress={onPress} padding={0} bg={colors.paper}>
      {!isPast ? <View style={[styles.statusBar, { backgroundColor: accent }]} /> : null}
      <View style={{ padding: 14 }}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusDot, { backgroundColor: accent }]} />
          <Text variant="label" color={accent}>
            {timeLabel}
          </Text>
          <View style={{ flex: 1 }} />
          {!isPast ? (
            <Text variant="bodyMedium" italic color={colors.smoke}>
              {timeRange}
            </Text>
          ) : null}
        </View>

        <View style={styles.row}>
          <Thumbnail letter={r.establishmentInitial} size={56} variant={r.thumbVariant} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="serifMd" color={colors.ink}>
              {r.productName}
            </Text>
            <Text variant="bodySm" color={colors.smoke}>
              {r.establishmentName} · {r.quantity} un.
            </Text>
          </View>
          <Text variant="serifMd" color={colors.forest}>
            {formatBRL(r.price)}
          </Text>
        </View>

        {!isPast ? (
          <View style={styles.qrFooter}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <QrCode size={14} color={colors.smoke} strokeWidth={2.2} />
              <Text variant="label" color={colors.smoke}>
                MOSTRAR QR
              </Text>
            </View>
            <Text style={{ fontFamily: fontFamilies.serifItalic, fontSize: 14, color: colors.smoke }}>
              {r.code}
            </Text>
          </View>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.sageMuted,
    padding: 4,
    borderRadius: radius.pill,
    marginTop: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radius.pill,
  },
  tabActive: {
    backgroundColor: colors.ink,
  },
  statusBar: {
    height: 4,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qrFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.fog,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
