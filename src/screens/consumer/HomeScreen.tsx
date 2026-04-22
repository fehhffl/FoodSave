import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Bell, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConsumerTabParamList, RootStackParamList } from '../../navigation/types';
import { Screen, Text, Chip, Card, Thumbnail, Badge, IconButton } from '../../components';
import { colors, spacing, radius, shadows } from '../../theme';
import { useStore, selectCompletedForConsumer } from '../../store/useStore';
import { greetingForHour, formatBRL, discountPct } from '../../utils/format';
import { ProductCategory } from '../../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ConsumerTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const categoryFilters: { key: 'nearby' | ProductCategory; label: string }[] = [
  { key: 'nearby', label: 'Perto de mim' },
  { key: 'padaria', label: 'Padarias' },
  { key: 'mercado', label: 'Mercados' },
  { key: 'pizza', label: 'Restaurantes' },
  { key: 'hortifruti', label: 'Hortifruti' },
];

export function HomeScreen({ navigation }: Props) {
  const consumer = useStore((s) => s.consumer);
  const products = useStore((s) => s.products);
  const establishments = useStore((s) => s.establishments);
  const completed = useStore(selectCompletedForConsumer(consumer?.id));
  const [filter, setFilter] = useState<typeof categoryFilters[number]['key']>('nearby');

  const greeting = greetingForHour(new Date().getHours());
  const firstName = consumer?.name.split(' ')[0] ?? 'Visitante';

  const monthSavedKg = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return completed
      .filter((r) => {
        const d = new Date(r.completedAt ?? r.createdAt);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((acc, r) => acc + r.weightKg * r.quantity, 0);
  }, [completed]);

  const filtered = useMemo(() => {
    const active = products.filter((p) => p.status === 'active' && p.quantity > 0);
    if (filter === 'nearby') return active;
    if (filter === 'pizza')
      return active.filter((p) => ['pizza', 'marmita'].includes(p.category));
    if (filter === 'padaria')
      return active.filter((p) => ['padaria', 'doces'].includes(p.category));
    if (filter === 'mercado')
      return active.filter((p) => ['laticinios', 'bebidas'].includes(p.category));
    if (filter === 'hortifruti')
      return active.filter((p) => p.category === 'hortifruti');
    return active;
  }, [products, filter]);

  return (
    <Screen bg={colors.cream}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text variant="serifMd" italic color={colors.smoke}>
                  {greeting},
                </Text>
                <Text variant="displayMd" color={colors.ink}>
                  {firstName}
                </Text>
                <View style={styles.locationRow}>
                  <MapPin size={14} color={colors.amber} strokeWidth={2.4} />
                  <Text variant="bodyMedium" color={colors.smoke}>
                    {consumer?.city ?? 'Sorocaba, SP'}
                  </Text>
                </View>
              </View>
              <IconButton onPress={() => {}}>
                <View>
                  <Bell size={20} color={colors.ink} strokeWidth={2.2} />
                  <View style={styles.bellDot} />
                </View>
              </IconButton>
            </View>

            <ImpactBanner kg={monthSavedKg} />

            <View style={styles.chipRow}>
              {categoryFilters.map((c) => (
                <Chip
                  key={c.key}
                  label={c.label}
                  active={filter === c.key}
                  onPress={() => setFilter(c.key)}
                  style={{ marginRight: 8 }}
                />
              ))}
            </View>

            <View style={styles.sectionRow}>
              <Text variant="serifLg" color={colors.ink}>
                Ofertas{' '}
                <Text variant="serifLg" italic color={colors.amber}>
                  de hoje
                </Text>
              </Text>
              <Pressable onPress={() => navigation.navigate('Map')}>
                <Text variant="label" color={colors.smoke}>
                  VER TODAS
                </Text>
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const est = establishments.find((e) => e.id === item.establishmentId);
          return (
            <ProductCard
              name={item.name}
              italicWord={item.italicWord}
              establishmentName={est?.name ?? ''}
              distanceKm={est?.distanceKm ?? 0}
              promo={item.promoPrice}
              original={item.originalPrice}
              variant={item.thumbVariant}
              letter={est?.initial ?? ''}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            />
          );
        }}
        ListEmptyComponent={
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Text variant="body" color={colors.smoke}>
              Nenhuma oferta ativa nessa categoria por aqui.
            </Text>
          </View>
        }
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </Screen>
  );
}

function ImpactBanner({ kg }: { kg: number }) {
  return (
    <LinearGradient
      colors={['#3a5a36', '#1f3520', '#16261a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.banner}
    >
      <View style={styles.bannerGlow} />
      <View style={{ flex: 1 }}>
        <Text
          variant="displayLg"
          color={colors.cream}
          style={{ fontSize: 36, lineHeight: 40 }}
        >
          {kg.toFixed(1)}
          <Text variant="displayMd" color={colors.cream}>
            kg
          </Text>
        </Text>
      </View>
      <View style={{ flex: 1.2 }}>
        <Text variant="bodyMedium" color={colors.cream}>
          de alimentos você já salvou este mês.
        </Text>
        <Text
          variant="bodyMedium"
          italic
          color={colors.amberSoft}
          style={{ marginTop: 4 }}
        >
          Continue assim.
        </Text>
      </View>
    </LinearGradient>
  );
}

interface ProductCardProps {
  name: string;
  italicWord?: string;
  establishmentName: string;
  distanceKm: number;
  promo: number;
  original: number;
  variant: any;
  letter: string;
  onPress: () => void;
}

export function ProductCard({
  name,
  italicWord,
  establishmentName,
  distanceKm,
  promo,
  original,
  variant,
  letter,
  onPress,
}: ProductCardProps) {
  const pct = discountPct(original, promo);
  const renderName = () => {
    if (italicWord && name.includes(italicWord)) {
      const idx = name.indexOf(italicWord);
      const pre = name.slice(0, idx);
      const post = name.slice(idx + italicWord.length);
      return (
        <Text variant="serifMd" color={colors.ink}>
          {pre}
          <Text variant="serifMd" italic color={colors.forest}>
            {italicWord}
          </Text>
          {post}
        </Text>
      );
    }
    return (
      <Text variant="serifMd" color={colors.ink}>
        {name}
      </Text>
    );
  };
  return (
    <Card onPress={onPress} padding={14} bg={colors.paper}>
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
        <Thumbnail letter={letter} size={72} variant={variant} />
        <View style={{ flex: 1, gap: 4 }}>
          {renderName()}
          <Text variant="bodySm" color={colors.smoke}>
            {establishmentName} · {distanceKm.toFixed(1)} km
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 4,
              gap: 8,
            }}
          >
            <Text variant="serifMd" color={colors.forest}>
              {formatBRL(promo)}
            </Text>
            <Text
              variant="bodySm"
              color={colors.smoke}
              style={{ textDecorationLine: 'line-through' }}
            >
              {formatBRL(original)}
            </Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Badge label={`-${pct}%`} tone="amber" />
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: spacing.md,
    paddingBottom: spacing.base,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  bellDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
    opacity: 0.32,
  },
  chipRow: {
    flexDirection: 'row',
    marginTop: spacing.base,
    paddingVertical: 4,
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});
