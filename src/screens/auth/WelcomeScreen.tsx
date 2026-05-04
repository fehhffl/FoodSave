import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import { RootStackParamList } from '../../navigation/types';
import { Screen, Text, Button } from '../../components';
import { colors, spacing, fontFamilies } from '../../theme';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

interface Slide {
  illustration: 'bowl' | 'leaf' | 'package';
  bg: [string, string, string];
  title: { pre: string; italic: string; mid?: string; italic2?: string; post?: string };
  body: string;
}

const slides: Slide[] = [
  {
    illustration: 'bowl',
    bg: ['#3a5a36', '#1f3520', '#16261a'],
    title: {
      pre: 'Economia que ',
      italic: 'alimenta',
      mid: ', consumo que ',
      italic2: 'preserva',
      post: '.',
    },
    body:
      'Encontre ofertas de queima de estoque em padarias, restaurantes e mercados de Sorocaba — economize até 70% e ainda apoia o giro do comércio do seu bairro.',
  },
  {
    illustration: 'leaf',
    bg: ['#3a5a36', '#1f3520', '#16261a'],
    title: { pre: 'Cada reserva ', italic: 'gira', mid: ' o estoque do bairro.' },
    body:
      'Quando você compra uma promoção do dia, o estabelecimento renova o estoque sem prejuízo, recupera capital de giro e segue movimentando o caixa local.',
  },
  {
    illustration: 'package',
    bg: ['#d97540', '#b85e2d', '#8a4f1f'],
    title: { pre: 'Retire em ', italic: 'minutos', mid: ', sem complicação.' },
    body:
      'Reservou, recebeu o QR Code, foi buscar. Sem taxas escondidas, sem cartão de crédito obrigatório, sem espera.',
  },
];

export function WelcomeScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  const next = () => {
    if (index < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <Screen bg={colors.cream} edges={['top']} statusBar="light">
      <View style={styles.heroWrap}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {slides.map((s, i) => (
            <Hero key={i} slide={s} />
          ))}
        </ScrollView>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: i === index ? 28 : 18,
                  backgroundColor: i === index ? colors.forest : colors.fog,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.bottom}>
        <Title slide={slides[index]} />
        <Text variant="bodyLg" color={colors.smoke} style={{ marginTop: spacing.base }}>
          {slides[index].body}
        </Text>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', gap: 12, marginTop: spacing.lg }}>
          <Button
            label="Pular"
            variant="ghost"
            fullWidth={false}
            onPress={() => navigation.navigate('Login')}
            style={{ flex: 1 }}
          />
          <Button
            label={index < slides.length - 1 ? 'Próximo' : 'Começar agora'}
            onPress={next}
            style={{ flex: 1.6 }}
          />
        </View>
      </View>
    </Screen>
  );
}

function Title({ slide }: { slide: Slide }) {
  return (
    <Text variant="displayLg" color={colors.ink}>
      {slide.title.pre}
      <Text variant="displayLg" italic color={colors.forest}>
        {slide.title.italic}
      </Text>
      {slide.title.mid}
      {slide.title.italic2 ? (
        <Text variant="displayLg" italic color={colors.forest}>
          {slide.title.italic2}
        </Text>
      ) : null}
      {slide.title.post}
    </Text>
  );
}

function Hero({ slide }: { slide: Slide }) {
  return (
    <View style={{ width, paddingHorizontal: spacing.lg, paddingTop: spacing.base }}>
      <LinearGradient
        colors={slide.bg}
        style={styles.heroGradient}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
      >
        <View style={styles.glow} />
        <Text variant="displayMd" italic color={colors.amberSoft} style={styles.brand}>
          FoodSave
        </Text>
        <View style={styles.illustration}>
          {slide.illustration === 'bowl' && <BowlIllustration />}
          {slide.illustration === 'leaf' && <LeafIllustration />}
          {slide.illustration === 'package' && <PackageIllustration />}
        </View>
      </LinearGradient>
    </View>
  );
}

function BowlIllustration() {
  return (
    <Svg width={220} height={170} viewBox="0 0 220 170">
      {/* steam */}
      <Path d="M 95 50 Q 100 35 95 20" stroke="#f5efe6" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.85} />
      <Path d="M 110 50 Q 115 30 108 12" stroke="#f5efe6" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.85} />
      <Path d="M 125 50 Q 130 35 124 20" stroke="#f5efe6" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.85} />
      {/* bowl */}
      <Path
        d="M 50 90 Q 110 70 170 90 L 155 145 Q 110 155 65 145 Z"
        fill="#faf6ee"
        stroke="#1f3520"
        strokeWidth={2}
      />
      <Ellipse cx={110} cy={90} rx={60} ry={9} fill="#3a5a36" opacity={0.9} />
      {/* contents */}
      <Circle cx={90} cy={88} r={6} fill="#c44a3d" />
      <Circle cx={110} cy={84} r={5} fill="#e5a23a" />
      <Circle cx={130} cy={88} r={5} fill="#c8d5c0" />
      <Circle cx={100} cy={92} r={4} fill="#e5a23a" />
      <Circle cx={120} cy={92} r={4} fill="#c44a3d" />
      {/* lemon slice on rim */}
      <Circle cx={170} cy={82} r={9} fill="#e5a23a" stroke="#1f3520" strokeWidth={1.5} />
    </Svg>
  );
}

function LeafIllustration() {
  return (
    <Svg width={220} height={170} viewBox="0 0 220 170">
      <Path
        d="M 60 130 Q 60 40 160 40 Q 170 100 100 140 Q 70 142 60 130 Z"
        fill="#c8d5c0"
        stroke="#1f3520"
        strokeWidth={2}
      />
      <Path d="M 65 128 L 150 50" stroke="#1f3520" strokeWidth={2} fill="none" />
      <Circle cx={110} cy={80} r={10} fill="#e5a23a" />
      <Circle cx={140} cy={70} r={6} fill="#c44a3d" />
      <Circle cx={90} cy={110} r={7} fill="#3a5a36" />
    </Svg>
  );
}

function PackageIllustration() {
  return (
    <Svg width={220} height={170} viewBox="0 0 220 170">
      <Path d="M 70 60 L 150 60 L 160 130 L 60 130 Z" fill="#faf6ee" stroke="#1f3520" strokeWidth={2} />
      <Path d="M 70 60 L 110 40 L 150 60" fill="#ede4d3" stroke="#1f3520" strokeWidth={2} />
      <Path d="M 110 40 L 110 130" stroke="#1f3520" strokeWidth={2} />
      <Path d="M 95 95 L 125 95" stroke="#d97540" strokeWidth={4} strokeLinecap="round" />
      <Circle cx={170} cy={50} r={14} fill="#d97540" />
      <Path d="M 165 50 L 168 53 L 175 46" stroke="#fff" strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    paddingTop: spacing.sm,
  },
  heroGradient: {
    height: 380,
    borderRadius: 24,
    overflow: 'hidden',
    padding: spacing.xl,
  },
  glow: {
    position: 'absolute',
    top: 60,
    left: 80,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: '#e5a23a',
    opacity: 0.28,
  },
  brand: {
    marginTop: 8,
    fontSize: 26,
    color: '#f5efe6',
  },
  illustration: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.base,
  },
  dot: {
    height: 4,
    borderRadius: 4,
  },
  bottom: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
