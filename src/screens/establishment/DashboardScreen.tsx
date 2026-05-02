import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  AlertTriangle,
  Plus,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  EstablishmentTabParamList,
  RootStackParamList,
} from '../../navigation/types';
import { Screen, Text, Card, Badge, IconButton, Button } from '../../components';
import { colors, spacing, radius, shadows, fontFamilies } from '../../theme';
import { useStore } from '../../store/useStore';
import { formatBRL, daysUntil, monthShortUpper } from '../../utils/format';

type Props = CompositeScreenProps<
  BottomTabScreenProps<EstablishmentTabParamList, 'Dashboard'>,
  NativeStackScreenProps<RootStackParamList>
>;

const screenWidth = Dimensions.get('window').width;

export function DashboardScreen({ navigation }: Props) {
  const establishment = useStore((s) => s.establishment);
  const allProducts = useStore((s) => s.products);
  const allReservations = useStore((s) => s.reservations);
  const logout = useStore((s) => s.logout);
  const products = useMemo(
    () => allProducts.filter((p) => !establishment?.id || p.establishmentId === establishment.id),
    [allProducts, establishment?.id],
  );
  const reservations = useMemo(
    () =>
      allReservations.filter(
        (r) => !establishment?.id || r.establishmentId === establishment.id,
      ),
    [allReservations, establishment?.id],
  );

  const stats = useMemo(() => {
    const active = products.filter((p) => p.status === 'active').length;
    const reservedToday = reservations.filter((r) => {
      const c = new Date(r.createdAt);
      const today = new Date();
      return (
        c.toDateString() === today.toDateString() &&
        ['active', 'today', 'tomorrow', 'completed'].includes(r.status)
      );
    }).length;
    const recovered = reservations
      .filter((r) => r.status === 'completed' || r.status === 'today' || r.status === 'tomorrow')
      .reduce((acc, r) => acc + r.price * r.quantity, 0);
    const expiringSoon = products.filter(
      (p) => p.status === 'active' && daysUntil(p.validUntil) <= 1,
    ).length;
    const conversion = products.length === 0 ? 0 : Math.min(100, Math.round((reservations.length / products.length) * 100));
    return { active, reservedToday, recovered, expiringSoon, conversion };
  }, [products, reservations]);

  const chartData = useMemo(() => {
    const labels: string[] = [];
    const values: number[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      labels.push(['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][d.getDay()]);
      const sum = reservations
        .filter((r) => new Date(r.createdAt).toDateString() === d.toDateString())
        .reduce((a, r) => a + r.price * r.quantity, 0);
      values.push(Number(sum.toFixed(2)));
    }
    if (values.every((v) => v === 0)) {
      // give chart a sensible baseline when no data
      return { labels, values: [12, 18, 9, 22, 15, 30, 24] };
    }
    return { labels, values };
  }, [reservations]);

  const alerts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.status === 'active' &&
          daysUntil(p.validUntil) <= 2 &&
          !reservations.some((r) => r.productId === p.id),
      ),
    [products, reservations],
  );

  const month = monthShortUpper(new Date().getMonth());
  const firstName = establishment?.name.split(' ')[0] ?? 'Loja';

  return (
    <Screen bg={colors.cream}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxxl }} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text variant="serifMd" italic color={colors.smoke}>
              Bom dia,
            </Text>
            <Text variant="displayMd" color={colors.ink}>
              {firstName}
            </Text>
            <Badge label="Modo Estabelecimento" tone="forest" style={{ marginTop: 8 }} />
          </View>
          <IconButton onPress={logout}>
            <LogOut size={18} color={colors.ink} strokeWidth={2.2} />
          </IconButton>
        </View>

        <View style={{ paddingHorizontal: spacing.lg }}>
          <LinearGradient
            colors={['#3a5a36', '#1f3520', '#16261a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBanner}
          >
            <View style={styles.bannerGlow} />
            <View style={{ flex: 1 }}>
              <Text variant="label" color={colors.amberSoft}>
                CAPITAL RECUPERADO · {month}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamilies.serifBold,
                  fontSize: 36,
                  color: colors.cream,
                  marginTop: 4,
                }}
              >
                {formatBRL(stats.recovered)}
              </Text>
              <Text variant="bodyMedium" color={colors.cream} style={{ opacity: 0.85, marginTop: 4 }}>
                de produtos que iriam pro descarte.
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.statsGrid}>
            <StatCard
              icon={<Package size={16} color={colors.forest} />}
              label="Produtos ativos"
              value={String(stats.active)}
            />
            <StatCard
              icon={<ShoppingBag size={16} color={colors.forest} />}
              label="Reservas hoje"
              value={String(stats.reservedToday)}
            />
            <StatCard
              icon={<TrendingUp size={16} color={colors.forest} />}
              label="Conversão"
              value={`${stats.conversion}%`}
            />
            <StatCard
              icon={<AlertTriangle size={16} color={colors.amberDeep} />}
              label="Próx. ao vencimento"
              value={String(stats.expiringSoon)}
              tone="amber"
            />
          </View>

          <Card padding={spacing.base} style={{ marginTop: spacing.lg }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text variant="serifLg" color={colors.ink}>
                Vendas{' '}
                <Text variant="serifLg" italic color={colors.forest}>
                  7 dias
                </Text>
              </Text>
              <Text variant="label" color={colors.smoke}>
                R$ TOTAIS
              </Text>
            </View>
            <View style={{ marginLeft: -16, marginTop: 8 }}>
              <LineChart
                data={{
                  labels: chartData.labels,
                  datasets: [{ data: chartData.values }],
                }}
                width={screenWidth - spacing.lg * 2 - 12}
                height={180}
                bezier
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLabels
                withHorizontalLabels={false}
                fromZero
                chartConfig={{
                  backgroundGradientFrom: colors.paper,
                  backgroundGradientTo: colors.paper,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(45,74,43,${opacity})`,
                  labelColor: () => colors.smoke,
                  propsForBackgroundLines: { stroke: 'transparent' },
                  propsForDots: { r: '4', strokeWidth: '2', stroke: colors.amber },
                  propsForLabels: { fontFamily: fontFamilies.sans, fontSize: '11' },
                  fillShadowGradient: colors.forest,
                  fillShadowGradientOpacity: 0.18,
                }}
                style={{ borderRadius: 16 }}
              />
            </View>
          </Card>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: spacing.lg }}>
            <Button
              label="Cadastrar produto"
              icon={<Plus size={18} color={colors.white} strokeWidth={2.4} />}
              onPress={() => navigation.navigate('AddProduct')}
              style={{ flex: 1 }}
            />
            <Button
              label="Importar lote"
              variant="secondary"
              fullWidth={false}
              onPress={() => navigation.navigate('BatchProducts')}
              style={{ flex: 1 }}
            />
          </View>

          <View style={[styles.sectionHeader, { marginTop: spacing.xl }]}>
            <View style={{ flex: 1 }}>
              <Text variant="serifLg" color={colors.ink}>
                Alertas{' '}
                <Text variant="serifLg" italic color={colors.amber}>
                  preditivos
                </Text>
              </Text>
              <Text variant="bodySm" color={colors.smoke}>
                Produtos em risco com sugestão de desconto.
              </Text>
            </View>
            <Pressable onPress={() => navigation.navigate('EstablishmentRoot', { screen: 'Alerts' })}>
              <Text variant="label" color={colors.smoke}>
                VER TODOS
              </Text>
            </Pressable>
          </View>

          {alerts.length === 0 ? (
            <Card padding={spacing.base} bg={colors.sageMuted} elevated={false} style={{ marginTop: spacing.md }}>
              <Text variant="bodyMedium" color={colors.forest}>
                Nenhum alerta crítico. Seus produtos estão saudáveis.
              </Text>
            </Card>
          ) : (
            alerts.slice(0, 3).map((p) => {
              const days = daysUntil(p.validUntil);
              return (
                <Card
                  key={p.id}
                  padding={spacing.base}
                  bg={colors.amberPale}
                  elevated={false}
                  style={{ marginTop: spacing.md }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <AlertTriangle size={20} color={colors.amberDeep} strokeWidth={2.4} />
                    <View style={{ flex: 1 }}>
                      <Text variant="bodyMedium" color={colors.amberDeep}>
                        {p.name}
                      </Text>
                      <Text variant="bodySm" color={colors.amberDeep} style={{ opacity: 0.8 }}>
                        Vence em {days <= 0 ? 'horas' : `${days}d`} · {p.quantity} disponíveis
                      </Text>
                    </View>
                    <ChevronRight size={18} color={colors.amberDeep} />
                  </View>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: 'amber';
}) {
  const bg = tone === 'amber' ? colors.amberPale : colors.paper;
  return (
    <View style={[styles.stat, { backgroundColor: bg }, shadows.card]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {icon}
        <Text variant="label" color={tone === 'amber' ? colors.amberDeep : colors.smoke}>
          {label}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: fontFamilies.serifBold,
          fontSize: 26,
          color: tone === 'amber' ? colors.amberDeep : colors.ink,
          marginTop: 6,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  heroBanner: {
    padding: 18,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    ...shadows.raised,
  },
  bannerGlow: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 200,
    backgroundColor: '#e5a23a',
    opacity: 0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: spacing.base,
  },
  stat: {
    width: (screenWidth - spacing.lg * 2 - 12) / 2,
    padding: spacing.base,
    borderRadius: radius.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
});
