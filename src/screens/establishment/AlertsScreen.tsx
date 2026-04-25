import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { AlertTriangle, Sparkles, TrendingDown } from 'lucide-react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  EstablishmentTabParamList,
  RootStackParamList,
} from '../../navigation/types';
import { Screen, Text, Card, Badge, Button, Thumbnail } from '../../components';
import { colors, spacing, radius } from '../../theme';
import {
  useStore,
  selectProductsForEstablishment,
  selectReservationsForEstablishment,
} from '../../store/useStore';
import { formatBRL, daysUntil, discountPct } from '../../utils/format';
import { Product } from '../../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<EstablishmentTabParamList, 'Alerts'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface Alert {
  product: Product;
  severity: 'critical' | 'warning';
  reason: string;
  suggestedDiscount: number;
}

export function AlertsScreen() {
  const establishment = useStore((s) => s.establishment);
  const products = useStore(selectProductsForEstablishment(establishment?.id));
  const reservations = useStore(selectReservationsForEstablishment(establishment?.id));
  const updateProduct = useStore((s) => s.updateProduct);
  const showToast = useStore((s) => s.showToast);

  const alerts = useMemo<Alert[]>(() => {
    return products
      .filter((p) => p.status === 'active')
      .map<Alert | null>((p) => {
        const days = daysUntil(p.validUntil);
        const reservationsForProduct = reservations.filter((r) => r.productId === p.id);
        const currentDiscount = discountPct(p.originalPrice, p.promoPrice);

        if (days <= 1 && reservationsForProduct.length === 0) {
          return {
            product: p,
            severity: 'critical',
            reason: `Vence em ${days <= 0 ? 'horas' : '1 dia'} e ainda não foi reservado.`,
            suggestedDiscount: Math.min(80, currentDiscount + 15),
          };
        }
        if (days <= 3 && reservationsForProduct.length === 0) {
          return {
            product: p,
            severity: 'warning',
            reason: `Estoque sem reservas há ${days} dias.`,
            suggestedDiscount: Math.min(70, currentDiscount + 8),
          };
        }
        return null;
      })
      .filter((a): a is Alert => a !== null)
      .sort((a, b) => (a.severity === 'critical' ? -1 : 1));
  }, [products, reservations]);

  const applyDiscount = (a: Alert) => {
    const newPromo = +(a.product.originalPrice * (1 - a.suggestedDiscount / 100)).toFixed(2);
    updateProduct(a.product.id, { promoPrice: newPromo });
    showToast(
      `Desconto de ${a.suggestedDiscount}% aplicado em ${a.product.name}.`,
      'success',
    );
  };

  return (
    <Screen bg={colors.cream}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
        <Text variant="displayMd" color={colors.ink}>
          Alertas{' '}
          <Text variant="displayMd" italic color={colors.amber}>
            preditivos
          </Text>
        </Text>
        <Text variant="bodyLg" color={colors.smoke} style={{ marginTop: 4 }}>
          Identificamos produtos em risco e sugerimos descontos para você manter o giro.
        </Text>

        <Card padding={spacing.base} bg={colors.sageMuted} elevated={false} style={{ marginTop: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Sparkles size={18} color={colors.forest} strokeWidth={2.4} />
            <Text variant="bodyMedium" color={colors.forest} style={{ flex: 1 }}>
              {alerts.filter((a) => a.severity === 'critical').length} alertas críticos · {alerts.filter((a) => a.severity === 'warning').length} avisos preventivos
            </Text>
          </View>
        </Card>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(a) => a.product.id}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.xxxl,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={{ paddingTop: 48, alignItems: 'center' }}>
            <Text variant="body" color={colors.smoke}>
              Tudo tranquilo. Nenhum alerta no momento.
            </Text>
          </View>
        }
        renderItem={({ item: a }) => {
          const isCritical = a.severity === 'critical';
          return (
            <Card
              padding={spacing.base}
              bg={isCritical ? colors.amberPale : colors.paper}
              elevated={!isCritical}
            >
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Thumbnail letter={establishment?.initial ?? ''} variant={a.product.thumbVariant} size={56} />
                <View style={{ flex: 1 }}>
                  <Badge
                    label={isCritical ? 'CRÍTICO' : 'AVISO'}
                    tone={isCritical ? 'orange' : 'amber'}
                  />
                  <Text variant="serifMd" color={colors.ink} style={{ marginTop: 6 }}>
                    {a.product.name}
                  </Text>
                  <Text variant="bodySm" color={colors.smoke}>
                    {a.reason}
                  </Text>
                </View>
              </View>

              <View style={styles.suggestionBox}>
                <View style={{ flex: 1 }}>
                  <Text variant="label" color={colors.smoke}>
                    DESCONTO SUGERIDO
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                    <Text variant="serifLg" color={colors.amberDeep}>
                      {a.suggestedDiscount}%
                    </Text>
                    <Text variant="bodySm" color={colors.smoke}>
                      → {formatBRL(+(a.product.originalPrice * (1 - a.suggestedDiscount / 100)).toFixed(2))}
                    </Text>
                  </View>
                </View>
                <Button
                  label="Aplicar"
                  icon={<TrendingDown size={16} color={colors.white} strokeWidth={2.4} />}
                  variant="amber"
                  fullWidth={false}
                  size="sm"
                  onPress={() => applyDiscount(a)}
                />
              </View>
            </Card>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  suggestionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.fog,
  },
});
