import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import {
  Settings,
  Wallet,
  Bell,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  LogOut,
  Sparkles,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConsumerTabParamList, RootStackParamList } from '../../navigation/types';
import { Screen, Text, Card, IconButton } from '../../components';
import { colors, spacing, radius, shadows, fontFamilies } from '../../theme';
import { useStore } from '../../store/useStore';
import { monthShortUpper, formatBRL } from '../../utils/format';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ConsumerTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ProfileScreen({ navigation }: Props) {
  const consumer = useStore((s) => s.consumer);
  const reservations = useStore((s) => s.reservations);
  const logout = useStore((s) => s.logout);
  const completed = useMemo(
    () =>
      reservations.filter(
        (r) =>
          (!consumer?.id || r.consumerId === consumer.id) && r.status === 'completed',
      ),
    [reservations, consumer?.id],
  );

  const stats = useMemo(() => {
    const kg = completed.reduce((acc, r) => acc + r.weightKg * r.quantity, 0);
    const saved = completed.reduce(
      (acc, r) => acc + (r.originalPrice - r.price) * r.quantity,
      0,
    );
    const co2 = kg * 0.66; // approx 0.66 kg CO2 per kg food saved
    const meals = Math.round(kg / 0.7);
    return { kg, saved, co2, meals };
  }, [completed]);

  const startMonth = useMemo(() => {
    const sorted = [...completed].sort(
      (a, b) =>
        new Date(a.completedAt ?? a.createdAt).getTime() -
        new Date(b.completedAt ?? b.createdAt).getTime(),
    );
    if (!sorted.length) return monthShortUpper(new Date().getMonth());
    return monthShortUpper(new Date(sorted[0].completedAt ?? sorted[0].createdAt).getMonth());
  }, [completed]);

  const initial = consumer?.name?.[0]?.toUpperCase() ?? 'L';

  return (
    <Screen bg={colors.cream}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxxl }} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text variant="displayMd" color={colors.ink}>
              Meu{' '}
              <Text variant="displayMd" italic color={colors.forest}>
                perfil
              </Text>
            </Text>
          </View>
          <IconButton onPress={() => {}}>
            <Settings size={20} color={colors.ink} strokeWidth={2.2} />
          </IconButton>
        </View>

        <LinearGradient
          colors={['#3a5a36', '#1f3520', '#16261a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.7 }}
          style={styles.banner}
        >
          <View style={styles.bannerGlow} />
          <View style={styles.avatar}>
            <Text variant="serifLg" color={colors.cream} style={{ fontSize: 28 }}>
              {initial}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="serifLg" color={colors.cream}>
              {consumer?.name ?? 'Visitante'}
            </Text>
            <Text variant="bodySm" color={colors.cream} style={{ opacity: 0.85, marginTop: 2 }}>
              {consumer?.email}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.sectionRow}>
            <Text variant="serifLg" color={colors.ink}>
              Seu{' '}
              <Text variant="serifLg" italic color={colors.forest}>
                impacto
              </Text>
            </Text>
            <Text variant="label" color={colors.smoke}>
              DESDE {startMonth}
            </Text>
          </View>

          <Card padding={20} bg={colors.amberPale} elevated={false} style={{ marginTop: spacing.md }}>
            <View style={styles.shieldChip}>
              <ShieldCheck size={16} color={colors.amberDeep} strokeWidth={2.4} />
            </View>
            <Text
              style={{
                fontFamily: fontFamilies.serifBold,
                fontSize: 38,
                color: colors.amberDeep,
                marginTop: 6,
              }}
            >
              {stats.kg.toFixed(1)}{' '}
              <Text variant="bodyMedium" italic color={colors.amberDeep}>
                kg resgatados
              </Text>
            </Text>
            <Text variant="bodyMedium" color={colors.amberDeep} style={{ opacity: 0.85, marginTop: 6 }}>
              Equivalente a {stats.meals} refeições salvas do descarte.
            </Text>
          </Card>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: spacing.md }}>
            <Card padding={16} bg={colors.paper} style={{ flex: 1 }}>
              <View style={styles.iconChip}>
                <Wallet size={16} color={colors.forest} strokeWidth={2.4} />
              </View>
              <Text variant="serifLg" color={colors.ink} style={{ marginTop: spacing.sm, fontSize: 26 }}>
                {formatBRL(stats.saved).replace(',00', '')}
              </Text>
              <Text variant="bodySm" color={colors.smoke}>
                economizados
              </Text>
            </Card>
            <Card padding={16} bg={colors.paper} style={{ flex: 1 }}>
              <View style={styles.iconChip}>
                <Sparkles size={16} color={colors.forest} strokeWidth={2.4} />
              </View>
              <Text variant="serifLg" color={colors.ink} style={{ marginTop: spacing.sm, fontSize: 26 }}>
                {stats.co2.toFixed(1)}
                <Text variant="bodyMedium" italic color={colors.ink}>
                  {' '}kg
                </Text>
              </Text>
              <Text variant="bodySm" color={colors.smoke}>
                CO₂ evitado
              </Text>
            </Card>
          </View>

          <View style={{ marginTop: spacing.xl, gap: 4 }}>
            <ListItem icon={<Wallet size={18} color={colors.forest} strokeWidth={2.2} />} label="Formas de pagamento" />
            <ListItem icon={<Bell size={18} color={colors.forest} strokeWidth={2.2} />} label="Notificações" />
            <ListItem icon={<HelpCircle size={18} color={colors.forest} strokeWidth={2.2} />} label="Ajuda e suporte" />
            <ListItem
              icon={<LogOut size={18} color={colors.danger} strokeWidth={2.2} />}
              label="Sair da conta"
              danger
              onPress={logout}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function ListItem({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.listItem, pressed && { opacity: 0.85 }]}>
      <View style={styles.iconChip}>{icon}</View>
      <Text variant="bodyLg" color={danger ? colors.danger : colors.ink} style={{ flex: 1 }}>
        {label}
      </Text>
      <ChevronRight size={18} color={colors.haze} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  banner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    ...shadows.raised,
  },
  bannerGlow: {
    position: 'absolute',
    top: -30,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 200,
    backgroundColor: '#e5a23a',
    opacity: 0.3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0e1b10',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e8d5a8',
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  shieldChip: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.amberSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconChip: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.sageMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.fog,
  },
});
