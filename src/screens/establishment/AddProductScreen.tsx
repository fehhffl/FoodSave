import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import {
  Screen,
  Text,
  Button,
  Input,
  IconButton,
  Card,
  Chip,
  Thumbnail,
} from '../../components';
import { colors, spacing, radius, fontFamilies } from '../../theme';
import { useStore } from '../../store/useStore';
import { discountPct, formatBRL } from '../../utils/format';
import { ProductCategory } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddProduct'>;

const categories: { key: ProductCategory; label: string; thumb: any }[] = [
  { key: 'pizza', label: 'Pizza', thumb: 'pizza' },
  { key: 'padaria', label: 'Padaria', thumb: 'bread' },
  { key: 'marmita', label: 'Marmita', thumb: 'meal' },
  { key: 'doces', label: 'Doces', thumb: 'amber' },
  { key: 'hortifruti', label: 'Hortifruti', thumb: 'sage' },
  { key: 'laticinios', label: 'Laticínios', thumb: 'neutral' },
  { key: 'mercado', label: 'Mercado', thumb: 'forest' },
];

const validityOptions = [
  { label: 'Hoje', days: 0 },
  { label: 'Amanhã', days: 1 },
  { label: '+2 dias', days: 2 },
  { label: '+3 dias', days: 3 },
  { label: '+7 dias', days: 7 },
];

export function AddProductScreen({ navigation }: Props) {
  const establishment = useStore((s) => s.establishment);
  const addProduct = useStore((s) => s.addProduct);
  const showToast = useStore((s) => s.showToast);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('marmita');
  const [originalPrice, setOriginalPrice] = useState('');
  const [promoPrice, setPromoPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [weight, setWeight] = useState('0.5');
  const [validity, setValidity] = useState(0);

  const pct = useMemo(() => {
    const o = parseFloat(originalPrice.replace(',', '.')) || 0;
    const p = parseFloat(promoPrice.replace(',', '.')) || 0;
    if (!o || !p || p >= o) return 0;
    return discountPct(o, p);
  }, [originalPrice, promoPrice]);

  const thumbVariant = categories.find((c) => c.key === category)?.thumb ?? 'meal';

  const submit = () => {
    const o = parseFloat(originalPrice.replace(',', '.'));
    const p = parseFloat(promoPrice.replace(',', '.'));
    const q = parseInt(quantity, 10);
    const w = parseFloat(weight.replace(',', '.'));

    if (!name.trim() || isNaN(o) || isNaN(p) || isNaN(q) || isNaN(w) || p >= o) {
      showToast('Preencha todos os campos com valores válidos.', 'danger');
      return;
    }

    const pickup = new Date();
    pickup.setDate(pickup.getDate() + validity);
    pickup.setHours(20, 0, 0, 0);

    const valid = new Date(pickup);
    valid.setHours(22, 0, 0, 0);

    addProduct({
      establishmentId: establishment!.id,
      name: name.trim(),
      italicWord: name.split(' ').slice(-1)[0],
      description: description.trim() || `${name.trim()} a preço promocional.`,
      category,
      originalPrice: o,
      promoPrice: p,
      quantity: q,
      pickupUntil: pickup.toISOString(),
      validUntil: valid.toISOString(),
      weightKg: w,
      thumbVariant,
    });

    showToast(`${name.trim()} cadastrado!`, 'success');
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

        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <Text variant="displayMd" color={colors.ink}>
            Novo{' '}
            <Text variant="displayMd" italic color={colors.forest}>
              produto
            </Text>
          </Text>

          <View style={styles.thumbBox}>
            <Thumbnail letter={establishment?.initial ?? '?'} size={84} variant={thumbVariant} />
            <Pressable style={styles.cameraBtn} onPress={() => showToast('Câmera em breve', 'info')}>
              <Camera size={16} color={colors.white} strokeWidth={2.4} />
            </Pressable>
          </View>

          <View style={{ gap: spacing.lg, marginTop: spacing.lg }}>
            <Input label="Nome do produto" value={name} onChangeText={setName} placeholder="Ex.: Pizza Margherita" />
            <Input
              label="Descrição"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              placeholder="Detalhes, ingredientes, validade…"
              underline={false}
            />

            <View>
              <Text variant="label" color={colors.smoke}>
                CATEGORIA
              </Text>
              <View style={styles.chipRow}>
                {categories.map((c) => (
                  <Chip
                    key={c.key}
                    label={c.label}
                    active={category === c.key}
                    onPress={() => setCategory(c.key)}
                    variant="forest"
                    style={{ marginRight: 8, marginBottom: 8 }}
                  />
                ))}
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.base }}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Preço original"
                  value={originalPrice}
                  onChangeText={setOriginalPrice}
                  placeholder="0,00"
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Preço promo"
                  value={promoPrice}
                  onChangeText={setPromoPrice}
                  placeholder="0,00"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {pct > 0 ? (
              <Card elevated={false} bg={colors.amberPale} padding={12}>
                <Text variant="bodyMedium" color={colors.amberDeep}>
                  Desconto calculado:{' '}
                  <Text variant="bodyMedium" italic color={colors.amberDeep} weight="semibold">
                    -{pct}%
                  </Text>
                  {' · cliente economiza '}
                  {formatBRL(parseFloat(originalPrice.replace(',', '.')) - parseFloat(promoPrice.replace(',', '.')))}
                </Text>
              </Card>
            ) : null}

            <View style={{ flexDirection: 'row', gap: spacing.base }}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Quantidade"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="number-pad"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Peso por unidade (kg)"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View>
              <Text variant="label" color={colors.smoke}>
                VALIDADE / RETIRADA
              </Text>
              <View style={styles.chipRow}>
                {validityOptions.map((v) => (
                  <Chip
                    key={v.days}
                    label={v.label}
                    active={validity === v.days}
                    onPress={() => setValidity(v.days)}
                    variant="forest"
                    style={{ marginRight: 8, marginBottom: 8 }}
                  />
                ))}
              </View>
            </View>
          </View>

          <Button label="Publicar produto" onPress={submit} style={{ marginTop: spacing.xl }} />
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
  thumbBox: {
    alignSelf: 'center',
    marginTop: spacing.xl,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.cream,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
});
