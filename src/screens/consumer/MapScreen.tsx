import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Pressable, TextInput } from 'react-native';
import { Search, SlidersHorizontal, MapPin, ChevronRight } from 'lucide-react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Line } from 'react-native-svg';
import { ConsumerTabParamList, RootStackParamList } from '../../navigation/types';
import { Screen, Text, Card, Thumbnail, Badge } from '../../components';
import { colors, spacing, radius, shadows, fontFamilies } from '../../theme';
import { useStore } from '../../store/useStore';
import { formatBRL, discountPct } from '../../utils/format';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ConsumerTabParamList, 'Map'>,
  NativeStackScreenProps<RootStackParamList>
>;

const { width } = Dimensions.get('window');
const MAP_WIDTH = width - spacing.lg * 2;
const MAP_HEIGHT = 360;

export function MapScreen({ navigation }: Props) {
  const products = useStore((s) => s.products);
  const establishments = useStore((s) => s.establishments);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const visibleProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.status === 'active' &&
          p.quantity > 0 &&
          (!query.trim() ||
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            establishments
              .find((e) => e.id === p.establishmentId)
              ?.name.toLowerCase()
              .includes(query.toLowerCase())),
      ),
    [products, query, establishments],
  );

  const pins = useMemo(() => {
    return visibleProducts.slice(0, 8).map((p, i) => {
      const est = establishments.find((e) => e.id === p.establishmentId);
      const offsetX = (i % 3) * 0.05 - 0.05;
      const offsetY = ((i % 4) - 1) * 0.04;
      return {
        productId: p.id,
        x: Math.min(0.92, Math.max(0.08, (est?.mapX ?? 0.5) + offsetX)),
        y: Math.min(0.88, Math.max(0.08, (est?.mapY ?? 0.5) + offsetY)),
        price: p.promoPrice,
        product: p,
        est,
      };
    });
  }, [visibleProducts, establishments]);

  const selectedPin = pins.find((p) => p.productId === selected) ?? pins[0];

  return (
    <Screen bg={colors.cream}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, flex: 1 }}>
        <Text variant="displayMd" color={colors.ink}>
          Explorar
        </Text>
        <View style={styles.subtitleRow}>
          <MapPin size={14} color={colors.amber} strokeWidth={2.4} />
          <Text variant="bodyMedium" color={colors.smoke}>
            {visibleProducts.length} ofertas próximas
          </Text>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchInput}>
            <Search size={18} color={colors.smoke} strokeWidth={2.2} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar restaurante ou comida"
              placeholderTextColor={colors.haze}
              style={styles.searchText}
            />
          </View>
          <Pressable style={styles.filterBtn} onPress={() => {}}>
            <SlidersHorizontal size={18} color={colors.cream} strokeWidth={2.2} />
          </Pressable>
        </View>

        <View style={styles.mapWrap}>
          <MapBackground />
          {pins.map((pin) => {
            const isSelected = (selected ?? pins[0]?.productId) === pin.productId;
            return (
              <Pressable
                key={pin.productId}
                onPress={() => setSelected(pin.productId)}
                style={[
                  styles.pin,
                  {
                    left: pin.x * MAP_WIDTH - 36,
                    top: pin.y * MAP_HEIGHT - 18,
                    backgroundColor: isSelected
                      ? colors.ink
                      : pin.product.category === 'pizza' || pin.product.category === 'doces'
                      ? colors.amber
                      : colors.forest,
                  },
                ]}
              >
                <Text variant="bodySm" weight="semibold" color={colors.white}>
                  {formatBRL(pin.price)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {selectedPin ? (
        <View style={styles.floatingCard}>
          <Card
            onPress={() =>
              navigation.navigate('ProductDetail', { productId: selectedPin.product.id })
            }
            padding={14}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Thumbnail
                letter={selectedPin.est?.initial ?? ''}
                size={56}
                variant={selectedPin.product.thumbVariant}
              />
              <View style={{ flex: 1 }}>
                <Text variant="serifMd" color={colors.ink}>
                  {selectedPin.product.name}
                </Text>
                <Text variant="bodySm" color={colors.smoke}>
                  {selectedPin.est?.name} · {selectedPin.est?.distanceKm.toFixed(1)} km
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <Text variant="serifMd" color={colors.forest}>
                    {formatBRL(selectedPin.product.promoPrice)}
                  </Text>
                  <Badge
                    label={`-${discountPct(
                      selectedPin.product.originalPrice,
                      selectedPin.product.promoPrice,
                    )}%`}
                    tone="amber"
                  />
                </View>
              </View>
              <ChevronRight size={20} color={colors.smoke} />
            </View>
          </Card>
        </View>
      ) : null}
    </Screen>
  );
}

function MapBackground() {
  return (
    <View style={styles.mapBg}>
      <Svg width={MAP_WIDTH} height={MAP_HEIGHT}>
        {[0.18, 0.36, 0.54, 0.72, 0.9].map((y, i) => (
          <Line
            key={`h-${i}`}
            x1={0}
            x2={MAP_WIDTH}
            y1={y * MAP_HEIGHT}
            y2={y * MAP_HEIGHT}
            stroke="#fff"
            strokeWidth={4}
            opacity={0.7}
          />
        ))}
        {[0.16, 0.4, 0.66, 0.84].map((x, i) => (
          <Line
            key={`v-${i}`}
            x1={x * MAP_WIDTH}
            x2={x * MAP_WIDTH}
            y1={0}
            y2={MAP_HEIGHT}
            stroke="#fff"
            strokeWidth={4}
            opacity={0.7}
          />
        ))}
        <Line
          x1={0}
          y1={MAP_HEIGHT * 0.25}
          x2={MAP_WIDTH}
          y2={MAP_HEIGHT * 0.85}
          stroke="#c8d5c0"
          strokeWidth={6}
          opacity={0.7}
        />
      </Svg>
      <View style={[styles.dotMarker, { left: MAP_WIDTH * 0.5 - 8, top: MAP_HEIGHT * 0.5 - 8 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.paper,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: radius.pill,
    ...shadows.card,
  },
  searchText: {
    flex: 1,
    fontFamily: fontFamilies.sans,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 0,
  },
  filterBtn: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  mapWrap: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    marginTop: spacing.base,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    backgroundColor: '#dde6d6',
  },
  mapBg: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    backgroundColor: '#dde6d6',
  },
  dotMarker: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: colors.forest,
    backgroundColor: colors.cream,
  },
  pin: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    minWidth: 72,
    alignItems: 'center',
    ...shadows.raised,
  },
  floatingCard: {
    position: 'absolute',
    bottom: 100,
    left: spacing.lg,
    right: spacing.lg,
  },
});
