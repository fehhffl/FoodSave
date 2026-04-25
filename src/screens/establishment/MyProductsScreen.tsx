import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { Plus, Pause, Play, Trash2, Edit3 } from 'lucide-react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  EstablishmentTabParamList,
  RootStackParamList,
} from '../../navigation/types';
import { Screen, Text, Card, Chip, Thumbnail, Badge, IconButton, Button } from '../../components';
import { colors, spacing, radius } from '../../theme';
import {
  useStore,
  selectProductsForEstablishment,
} from '../../store/useStore';
import { formatBRL, daysUntil, discountPct } from '../../utils/format';
import { Product } from '../../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<EstablishmentTabParamList, 'Products'>,
  NativeStackScreenProps<RootStackParamList>
>;

type Filter = 'all' | 'active' | 'paused' | 'sold' | 'expired';

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'active', label: 'Ativos' },
  { key: 'paused', label: 'Pausados' },
  { key: 'sold', label: 'Vendidos' },
];

export function MyProductsScreen({ navigation }: Props) {
  const establishment = useStore((s) => s.establishment);
  const products = useStore(selectProductsForEstablishment(establishment?.id));
  const updateProduct = useStore((s) => s.updateProduct);
  const removeProduct = useStore((s) => s.removeProduct);
  const showToast = useStore((s) => s.showToast);
  const [filter, setFilter] = useState<Filter>('all');

  const data = useMemo(() => {
    if (filter === 'all') return products;
    return products.filter((p) => p.status === filter);
  }, [products, filter]);

  const togglePause = (p: Product) => {
    updateProduct(p.id, { status: p.status === 'active' ? 'paused' : 'active' });
    showToast(
      p.status === 'active' ? 'Produto pausado' : 'Produto reativado',
      'info',
    );
  };

  const confirmDelete = (p: Product) => {
    Alert.alert('Remover produto?', `${p.name} será excluído da listagem.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          removeProduct(p.id);
          showToast('Produto removido', 'warn');
        },
      },
    ]);
  };

  return (
    <Screen bg={colors.cream}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text variant="displayMd" color={colors.ink}>
              Meus{' '}
              <Text variant="displayMd" italic color={colors.forest}>
                produtos
              </Text>
            </Text>
            <Text variant="bodyLg" color={colors.smoke} style={{ marginTop: 4 }}>
              Gerencie todo o seu catálogo em um só lugar.
            </Text>
          </View>
          <IconButton onPress={() => navigation.navigate('AddProduct')} bg={colors.forest}>
            <Plus size={20} color={colors.white} strokeWidth={2.4} />
          </IconButton>
        </View>

        <View style={styles.chipRow}>
          {filters.map((f) => (
            <Chip
              key={f.key}
              label={f.label}
              active={filter === f.key}
              onPress={() => setFilter(f.key)}
              style={{ marginRight: 8 }}
            />
          ))}
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.xxxl,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={{ paddingTop: 48, alignItems: 'center' }}>
            <Text variant="body" color={colors.smoke}>
              Nenhum produto neste filtro.
            </Text>
            <Button
              label="Cadastrar produto"
              onPress={() => navigation.navigate('AddProduct')}
              style={{ marginTop: spacing.lg }}
              fullWidth={false}
            />
          </View>
        }
        renderItem={({ item: p }) => {
          const days = daysUntil(p.validUntil);
          return (
            <Card padding={14} bg={colors.paper}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Thumbnail letter={establishment?.initial ?? ''} variant={p.thumbVariant} size={60} />
                <View style={{ flex: 1 }}>
                  <Text variant="serifMd" color={colors.ink}>
                    {p.name}
                  </Text>
                  <Text variant="bodySm" color={colors.smoke}>
                    {p.quantity} unidades · vence em {days <= 0 ? 'horas' : `${days}d`}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <Text variant="serifMd" color={colors.forest}>
                      {formatBRL(p.promoPrice)}
                    </Text>
                    <Text variant="bodySm" color={colors.smoke} style={{ textDecorationLine: 'line-through' }}>
                      {formatBRL(p.originalPrice)}
                    </Text>
                    <Badge label={`-${discountPct(p.originalPrice, p.promoPrice)}%`} tone="amber" />
                    {p.status === 'paused' ? (
                      <Badge label="Pausado" tone="neutral" />
                    ) : p.status === 'sold' ? (
                      <Badge label="Esgotado" tone="success" />
                    ) : null}
                  </View>
                </View>
              </View>
              <View style={styles.actionsRow}>
                <ActionBtn
                  icon={
                    p.status === 'active' ? (
                      <Pause size={16} color={colors.ink} strokeWidth={2.2} />
                    ) : (
                      <Play size={16} color={colors.ink} strokeWidth={2.2} />
                    )
                  }
                  label={p.status === 'active' ? 'Pausar' : 'Reativar'}
                  onPress={() => togglePause(p)}
                />
                <ActionBtn
                  icon={<Edit3 size={16} color={colors.ink} strokeWidth={2.2} />}
                  label="Editar"
                  onPress={() => showToast('Edição inline em breve', 'info')}
                />
                <ActionBtn
                  icon={<Trash2 size={16} color={colors.danger} strokeWidth={2.2} />}
                  label="Remover"
                  onPress={() => confirmDelete(p)}
                  danger
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

function ActionBtn({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionBtn,
        { borderColor: danger ? '#f3cfc8' : colors.fog, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      {icon}
      <Text variant="bodySm" weight="semibold" color={danger ? colors.danger : colors.ink}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    flexWrap: 'wrap',
    gap: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.fog,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingVertical: 8,
  },
});
