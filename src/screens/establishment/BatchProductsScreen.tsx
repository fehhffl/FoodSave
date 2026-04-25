import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Screen, Text, Button, Input, IconButton, Card, Chip } from '../../components';
import { colors, spacing, radius } from '../../theme';
import { useStore } from '../../store/useStore';
import { ProductCategory } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'BatchProducts'>;

interface BatchRow {
  id: string;
  name: string;
  category: ProductCategory;
  originalPrice: string;
  promoPrice: string;
  quantity: string;
  weight: string;
}

const blank = (id: string): BatchRow => ({
  id,
  name: '',
  category: 'marmita',
  originalPrice: '',
  promoPrice: '',
  quantity: '1',
  weight: '0.4',
});

const categoryOptions: ProductCategory[] = ['marmita', 'padaria', 'pizza', 'doces', 'hortifruti', 'laticinios'];

export function BatchProductsScreen({ navigation }: Props) {
  const establishment = useStore((s) => s.establishment);
  const addProduct = useStore((s) => s.addProduct);
  const showToast = useStore((s) => s.showToast);

  const [rows, setRows] = useState<BatchRow[]>([
    {
      ...blank('r1'),
      name: 'Sopa de mandioquinha',
      category: 'marmita',
      originalPrice: '24',
      promoPrice: '11',
    },
    {
      ...blank('r2'),
      name: 'Croissants amanteigados',
      category: 'padaria',
      originalPrice: '18',
      promoPrice: '8',
    },
    {
      ...blank('r3'),
      name: 'Caixa de tomates',
      category: 'hortifruti',
      originalPrice: '20',
      promoPrice: '8',
    },
  ]);

  const update = (id: string, patch: Partial<BatchRow>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addRow = () => setRows((rs) => [...rs, blank(`r${Date.now()}`)]);
  const removeRow = (id: string) => setRows((rs) => rs.filter((r) => r.id !== id));

  const submit = () => {
    let added = 0;
    for (const r of rows) {
      const o = parseFloat(r.originalPrice.replace(',', '.'));
      const p = parseFloat(r.promoPrice.replace(',', '.'));
      const q = parseInt(r.quantity, 10);
      const w = parseFloat(r.weight.replace(',', '.'));
      if (!r.name.trim() || isNaN(o) || isNaN(p) || isNaN(q) || isNaN(w) || p >= o) continue;

      const pickup = new Date();
      pickup.setDate(pickup.getDate() + 1);
      pickup.setHours(20, 0, 0, 0);

      const valid = new Date(pickup);
      valid.setHours(22, 0, 0, 0);

      const thumbVariant: any =
        r.category === 'pizza'
          ? 'pizza'
          : r.category === 'padaria'
          ? 'bread'
          : r.category === 'doces'
          ? 'amber'
          : r.category === 'hortifruti'
          ? 'sage'
          : r.category === 'laticinios'
          ? 'neutral'
          : 'meal';

      addProduct({
        establishmentId: establishment!.id,
        name: r.name.trim(),
        italicWord: r.name.split(' ').slice(-1)[0],
        description: `${r.name.trim()} — cadastrado via importação em lote.`,
        category: r.category,
        originalPrice: o,
        promoPrice: p,
        quantity: q,
        pickupUntil: pickup.toISOString(),
        validUntil: valid.toISOString(),
        weightKg: w,
        thumbVariant,
      });
      added++;
    }
    if (added === 0) {
      showToast('Nenhum produto válido para cadastrar.', 'danger');
      return;
    }
    showToast(`${added} produtos cadastrados em lote.`, 'success');
    navigation.goBack();
  };

  return (
    <Screen bg={colors.cream} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <IconButton onPress={() => navigation.goBack()}>
            <ChevronLeft size={22} color={colors.ink} strokeWidth={2.4} />
          </IconButton>
        </View>

        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
          <Text variant="displayMd" color={colors.ink}>
            Cadastro{' '}
            <Text variant="displayMd" italic color={colors.forest}>
              em lote
            </Text>
          </Text>
          <Text variant="bodyLg" color={colors.smoke} style={{ marginTop: 4 }}>
            Edite os cards abaixo simulando uma importação de planilha. Linhas inválidas são ignoradas.
          </Text>

          <View style={{ gap: spacing.base, marginTop: spacing.xl }}>
            {rows.map((r, idx) => (
              <Card key={r.id} padding={spacing.base} bg={colors.paper}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text variant="label" color={colors.smoke} style={{ flex: 1 }}>
                    LINHA {String(idx + 1).padStart(2, '0')}
                  </Text>
                  <Pressable onPress={() => removeRow(r.id)} hitSlop={6}>
                    <Trash2 size={16} color={colors.smoke} strokeWidth={2.2} />
                  </Pressable>
                </View>

                <Input
                  label="Nome"
                  value={r.name}
                  onChangeText={(v) => update(r.id, { name: v })}
                  placeholder="Nome do produto"
                />

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md }}>
                  {categoryOptions.map((c) => (
                    <Chip
                      key={c}
                      label={c}
                      active={r.category === c}
                      onPress={() => update(r.id, { category: c })}
                      variant="forest"
                      style={{ marginRight: 6, marginBottom: 6 }}
                    />
                  ))}
                </View>

                <View style={{ flexDirection: 'row', gap: spacing.base, marginTop: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Input
                      label="Original"
                      value={r.originalPrice}
                      onChangeText={(v) => update(r.id, { originalPrice: v })}
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input
                      label="Promo"
                      value={r.promoPrice}
                      onChangeText={(v) => update(r.id, { promoPrice: v })}
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <View style={{ flex: 0.7 }}>
                    <Input
                      label="Qtd"
                      value={r.quantity}
                      onChangeText={(v) => update(r.id, { quantity: v })}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
              </Card>
            ))}
          </View>

          <Pressable onPress={addRow} style={styles.addRow}>
            <Plus size={16} color={colors.forest} strokeWidth={2.4} />
            <Text variant="bodyMedium" color={colors.forest}>
              Adicionar linha
            </Text>
          </Pressable>

          <Button label="Cadastrar todos" onPress={submit} style={{ marginTop: spacing.xl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  addRow: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.forest,
    borderStyle: 'dashed',
  },
});
