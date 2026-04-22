import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ChevronLeft, Heart, Star, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import {
  Screen,
  Text,
  Button,
  Badge,
  Card,
  IconButton,
  Thumbnail,
} from '../../components';
import { colors, spacing, radius, shadows, fontFamilies } from '../../theme';
import { useStore } from '../../store/useStore';
import { formatBRL, discountPct, formatHour, daysUntil } from '../../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const heroPalettes: Record<string, [string, string, string]> = {
  pizza: ['#e8825a', '#c44a3d', '#8a3725'],
  bread: ['#d9a86a', '#a26f33', '#704a1f'],
  meal: ['#3a5a36', '#1f3520', '#16261a'],
  sage: ['#a8c098', '#6e8a64', '#445a3d'],
  amber: ['#e8a45a', '#b85e2d', '#8a4520'],
  forest: ['#3a5a36', '#1f3520', '#16261a'],
  neutral: ['#dcd0b8', '#a8946e', '#705e3e'],
};

export function ProductDetailScreen({ route, navigation }: Props) {
  const { productId } = route.params;
  const product = useStore((s) => s.products.find((p) => p.id === productId));
  const establishment = useStore((s) =>
    s.establishments.find((e) => e.id === product?.establishmentId),
  );
  const createReservation = useStore((s) => s.createReservation);
  const showToast = useStore((s) => s.showToast);
  const [favorite, setFavorite] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!product || !establishment) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Produto não encontrado.</Text>
        </View>
      </Screen>
    );
  }

  const palette = heroPalettes[product.thumbVariant] ?? heroPalettes.sage;
  const pct = discountPct(product.originalPrice, product.promoPrice);
  const renderName = () => {
    if (product.italicWord && product.name.includes(product.italicWord)) {
      const idx = product.name.indexOf(product.italicWord);
      const pre = product.name.slice(0, idx);
      const post = product.name.slice(idx + product.italicWord.length);
      return (
        <Text variant="displayMd" color={colors.ink}>
          {pre}
          <Text variant="displayMd" italic color={colors.forest}>
            {product.italicWord}
          </Text>
          {post}
        </Text>
      );
    }
    return (
      <Text variant="displayMd" color={colors.ink}>
        {product.name}
      </Text>
    );
  };

  const onReserve = () => {
    setSubmitting(true);
    setTimeout(() => {
      const reservation = createReservation(productId);
      setSubmitting(false);
      if (reservation) {
        navigation.replace('ReservationConfirmed', { reservationId: reservation.id });
      } else {
        showToast('Não foi possível reservar — produto indisponível.', 'danger');
      }
    }, 380);
  };

  const dDays = daysUntil(product.validUntil);

  return (
    <Screen bg={colors.cream} edges={['top']} statusBar="light">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={palette} style={styles.hero} start={{ x: 0.3, y: 0 }} end={{ x: 0.7, y: 1 }}>
          <View style={styles.heroTop}>
            <IconButton onPress={() => navigation.goBack()} bg={colors.paper}>
              <ChevronLeft size={22} color={colors.ink} strokeWidth={2.4} />
            </IconButton>
            <IconButton onPress={() => setFavorite((v) => !v)} bg={colors.paper}>
              <Heart
                size={20}
                color={favorite ? colors.amber : colors.ink}
                fill={favorite ? colors.amber : 'transparent'}
                strokeWidth={2.2}
              />
            </IconButton>
          </View>
          <ProductIllustration variant={product.thumbVariant} />
        </LinearGradient>

        <View style={styles.body}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Badge label="✓ Disponível" tone="success" />
            <Badge label={`Retira até ${formatHour(product.pickupUntil)}`} tone="amber" />
          </View>

          <View style={{ marginTop: spacing.base }}>{renderName()}</View>

          <Card padding={14} bg={colors.sageMuted} elevated={false} style={{ marginTop: spacing.base }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={styles.estInitial}>
                <Text variant="serifMd" color={colors.cream}>
                  {establishment.initial}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium" color={colors.ink}>
                  {establishment.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Star size={12} color={colors.amber} fill={colors.amber} strokeWidth={0} />
                  <Text variant="bodySm" color={colors.smoke}>
                    {establishment.rating} · {establishment.distanceKm.toFixed(1)} km · {establishment.address}
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          <Text variant="bodyLg" color={colors.ash} style={{ marginTop: spacing.lg, lineHeight: 22 }}>
            {product.description}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text variant="label" color={colors.smoke}>
                QUANTIDADE
              </Text>
              <Text variant="serifMd" color={colors.ink} style={{ marginTop: 4 }}>
                {product.quantity} {product.quantity === 1 ? 'unidade' : 'unidades'}
              </Text>
            </View>
            <View style={[styles.metaItem, { borderLeftWidth: 1, borderLeftColor: colors.fog, paddingLeft: 16 }]}>
              <Text variant="label" color={colors.smoke}>
                VALIDADE
              </Text>
              <Text variant="serifMd" color={colors.ink} style={{ marginTop: 4 }}>
                {dDays <= 0 ? 'Hoje' : dDays === 1 ? 'Amanhã' : `Em ${dDays} dias`}
              </Text>
            </View>
          </View>

          <View style={styles.priceBlock}>
            <View style={{ flex: 1 }}>
              <Text variant="label" color={colors.smoke}>
                VALOR COM DESCONTO
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                <Text style={{ fontFamily: fontFamilies.serifBold, fontSize: 32, color: colors.forest }}>
                  {formatBRL(product.promoPrice)}
                </Text>
                <Text
                  variant="bodyMedium"
                  color={colors.smoke}
                  style={{ textDecorationLine: 'line-through' }}
                >
                  {formatBRL(product.originalPrice)}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text variant="serifMd" italic color={colors.amber}>
                –{pct}%
              </Text>
              <Text variant="bodySm" italic color={colors.smoke}>
                você economiza
              </Text>
            </View>
          </View>

          <Card
            elevated={false}
            padding={14}
            bg={colors.amberPale}
            style={{ marginTop: spacing.base, flexDirection: 'row', alignItems: 'center', gap: 12 }}
          >
            <Clock size={18} color={colors.amberDeep} strokeWidth={2.2} />
            <Text variant="bodySm" color={colors.amberDeep} style={{ flex: 1 }}>
              Retire entre {formatHour(product.pickupUntil)} de hoje em {establishment.address}.
              Apresente o QR Code da reserva.
            </Text>
          </Card>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={submitting ? 'Reservando…' : 'Reservar agora'}
          onPress={onReserve}
          loading={submitting}
        />
      </View>
    </Screen>
  );
}

function ProductIllustration({ variant }: { variant: string }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Svg width={220} height={220} viewBox="0 0 220 220">
        <Circle cx={110} cy={110} r={88} fill="#f5d8a4" stroke="#1f3520" strokeWidth={2} />
        <Circle cx={80} cy={88} r={11} fill="#c44a3d" />
        <Circle cx={140} cy={92} r={12} fill="#c44a3d" />
        <Circle cx={108} cy={132} r={9} fill="#3a5a36" />
        <Circle cx={142} cy={148} r={8} fill="#3a5a36" />
        <Circle cx={92} cy={150} r={7} fill="#faf6ee" />
        <Circle cx={120} cy={108} r={5} fill="#3a5a36" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 360,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  body: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  estInitial: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  metaItem: {
    flex: 1,
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: spacing.lg,
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.fog,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.base,
    paddingBottom: spacing.xl,
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderTopColor: colors.fog,
    ...shadows.raised,
  },
});
