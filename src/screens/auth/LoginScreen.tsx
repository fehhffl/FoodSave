import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Screen, Text, Button, Input, IconButton, Divider, Card } from '../../components';
import { colors, spacing, radius } from '../../theme';
import { useStore } from '../../store/useStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

type Tab = 'consumer' | 'establishment';

export function LoginScreen({ navigation }: Props) {
  const [tab, setTab] = useState<Tab>('consumer');
  const [email, setEmail] = useState('lucas.andrade@email.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>();

  const { loginConsumer, loginEstablishment } = useStore();

  const onTabChange = (next: Tab) => {
    setTab(next);
    setError(undefined);
    if (next === 'consumer') {
      setEmail('lucas.andrade@email.com');
      setPassword('123456');
    } else {
      setEmail('padaria@foodsave.com');
      setPassword('123456');
    }
  };

  const onSubmit = () => {
    setError(undefined);
    const ok =
      tab === 'consumer'
        ? loginConsumer(email.trim(), password)
        : loginEstablishment(email.trim(), password);
    if (!ok) setError('E-mail ou senha incorretos.');
  };

  const subtitle = useMemo(
    () =>
      tab === 'consumer'
        ? 'Entre para acessar suas reservas, acompanhar ofertas próximas e ver seu impacto.'
        : 'Acesse o painel do seu estabelecimento, cadastre produtos e acompanhe as reservas em tempo real.',
    [tab],
  );

  return (
    <Screen bg={colors.cream}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <IconButton onPress={() => navigation.goBack()}>
            <ChevronLeft size={22} color={colors.ink} strokeWidth={2.2} />
          </IconButton>
        </View>

        <View style={styles.body}>
          <Text variant="displayLg" color={colors.ink}>
            Bem-vindo{' '}
            <Text variant="displayLg" italic color={colors.forest}>
              de volta.
            </Text>
          </Text>
          <Text variant="bodyLg" color={colors.smoke} style={{ marginTop: spacing.md }}>
            {subtitle}
          </Text>

          <View style={styles.toggle}>
            <Pressable
              onPress={() => onTabChange('consumer')}
              style={[styles.toggleItem, tab === 'consumer' && styles.toggleActive]}
            >
              <Text
                variant="bodyMedium"
                color={tab === 'consumer' ? colors.white : colors.ash}
              >
                Consumidor
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onTabChange('establishment')}
              style={[styles.toggleItem, tab === 'establishment' && styles.toggleActive]}
            >
              <Text
                variant="bodyMedium"
                color={tab === 'establishment' ? colors.white : colors.ash}
              >
                Estabelecimento
              </Text>
            </Pressable>
          </View>

          <View style={{ marginTop: spacing.xl, gap: spacing.lg }}>
            <Input
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Input
              label="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              rightSlot={
                <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                  {showPassword ? (
                    <EyeOff size={18} color={colors.smoke} />
                  ) : (
                    <Eye size={18} color={colors.smoke} />
                  )}
                </Pressable>
              }
            />
            <Pressable style={{ alignSelf: 'flex-end' }} onPress={() => {}}>
              <Text variant="bodyMedium" color={colors.forest}>
                Esqueci minha senha
              </Text>
            </Pressable>
          </View>

          {error ? (
            <Text variant="body" color={colors.danger} style={{ marginTop: spacing.md }}>
              {error}
            </Text>
          ) : null}

          <Button label="Entrar" onPress={onSubmit} style={{ marginTop: spacing.xl }} />

          <Divider label="OU CONTINUE COM" />

          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <Button
              label="Google"
              variant="secondary"
              fullWidth={false}
              onPress={() => {}}
              style={{ flex: 1 }}
            />
            <Button
              label="Apple"
              variant="secondary"
              fullWidth={false}
              onPress={() => {}}
              style={{ flex: 1 }}
            />
          </View>

          <Card
            elevated={false}
            bg={colors.sageMuted}
            padding={14}
            style={{ marginTop: spacing.lg }}
          >
            <Text variant="label" color={colors.forest}>
              CREDENCIAIS DE DEMONSTRAÇÃO
            </Text>
            <View style={{ height: 6 }} />
            <Text variant="bodySm" color={colors.ash}>
              Consumidor · lucas.andrade@email.com / 123456
            </Text>
            <Text variant="bodySm" color={colors.ash}>
              Estabelecimento · padaria@foodsave.com / 123456
            </Text>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.sageMuted,
    padding: 4,
    borderRadius: radius.pill,
    marginTop: spacing.xl,
  },
  toggleItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radius.pill,
  },
  toggleActive: {
    backgroundColor: colors.ink,
  },
});
