import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, {
  Circle,
  Path,
  Polygon,
  Rect,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
  Text as SvgText,
} from 'react-native-svg';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { GentleButton } from '../src/components/GentleButton';
import { AnimatedMascot } from '../src/components/AnimatedMascot';
import { useAppStore } from '../src/state/useAppStore';
import { Rocket } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Seeded star positions so they don't jump on re-render
const STARS = [
  { x: 0.08, y: 0.10, r: 1.5 }, { x: 0.22, y: 0.06, r: 1.0 }, { x: 0.45, y: 0.14, r: 2.0 },
  { x: 0.60, y: 0.04, r: 1.2 }, { x: 0.75, y: 0.18, r: 1.8 }, { x: 0.88, y: 0.08, r: 1.0 },
  { x: 0.14, y: 0.28, r: 1.3 }, { x: 0.35, y: 0.32, r: 1.0 }, { x: 0.55, y: 0.25, r: 2.2 },
  { x: 0.80, y: 0.30, r: 1.5 }, { x: 0.92, y: 0.22, r: 1.0 }, { x: 0.68, y: 0.38, r: 1.7 },
];

// ── Scene geometry (all in the arena's own coordinate space) ──────────────
const ARENA_H = 300;
const EARTH = { x: 72, y: 208, r: 64 };
const MOON = { x: SCREEN_WIDTH - 56, y: 70, r: 36 };

// Bangladesh border, clockwise from the north-west tip, as [longitude, latitude].
// Traced from the real border: the northern bulge, Sylhet's north-east tongue, the Chittagong
// Hill Tracts, the long Teknaf tail, the Meghna estuary and the Sundarbans.
const BD_OUTLINE: [number, number][] = [
  [88.12, 26.45], [88.35, 26.50], [88.65, 26.43], [88.90, 26.28], [89.05, 26.17], [89.35, 26.02],
  [89.62, 26.20], [89.82, 26.05], [89.80, 25.78], [89.85, 25.45], [89.84, 25.28], [90.10, 25.20],
  [90.45, 25.15], [90.75, 25.15], [91.10, 25.18], [91.45, 25.15], [91.75, 25.18], [92.00, 25.10],
  [92.25, 24.92], [92.05, 24.60], [92.10, 24.38], [91.90, 24.15], [91.75, 24.10], [91.55, 24.10],
  [91.40, 23.95], [91.25, 23.88], [91.35, 23.55], [91.30, 23.20], [91.50, 23.00], [91.65, 23.15],
  [91.80, 23.25], [91.95, 23.50], [92.25, 23.70], [92.35, 23.30], [92.50, 22.95], [92.60, 22.50],
  [92.45, 22.05], [92.35, 21.55], [92.25, 21.15], [92.30, 20.85], [92.30, 20.60], [92.15, 20.90],
  [92.05, 21.20], [91.95, 21.55], [91.90, 21.90], [91.85, 22.25], [91.75, 22.35], [91.60, 22.65],
  [91.30, 22.75], [91.05, 22.55], [90.95, 22.20], [90.65, 22.20], [90.50, 22.00], [90.30, 21.82],
  [90.00, 21.80], [89.70, 21.78], [89.45, 21.85], [89.25, 21.75], [89.05, 21.70], [89.00, 22.00],
  [89.10, 22.25], [88.95, 22.55], [88.90, 22.85], [89.05, 23.05], [88.70, 23.25], [88.75, 23.50],
  [88.60, 23.65], [88.40, 23.90], [88.30, 24.10], [88.45, 24.35], [88.15, 24.45],
  [88.08, 24.75], [88.40, 24.90], [88.45, 25.20], [88.55, 25.32], [88.20, 25.55], [88.10, 25.95],
  [88.30, 26.15],
];
const DEG_Y = 13; // px per degree of latitude
const DEG_X = DEG_Y * Math.cos((23.7 * Math.PI) / 180); // squeeze longitude so the shape is true
const bdX = (lon: number) => (lon - 88.0) * DEG_X;
const bdY = (lat: number) => (26.6 - lat) * DEG_Y;
const BD_W = bdX(92.65);
const BD_H = bdY(20.55);
// Put the map centre on the Earth's centre
const BD_ORIGIN = { x: EARTH.x - BD_W / 2 + 2, y: EARTH.y - BD_H / 2 };
const BD_PATH =
  BD_OUTLINE.map(([lon, lat], i) => `${i === 0 ? 'M' : 'L'} ${bdX(lon).toFixed(1)} ${bdY(lat).toFixed(1)}`).join(' ') + ' Z';
// The three great rivers, as a faint blue ribbon on the land
const BD_RIVER = [
  [89.78, 25.45], [89.72, 24.85], [89.78, 24.30], [90.05, 23.75], [90.50, 23.35], [90.65, 22.95], [90.85, 22.40],
]
  .map(([lon, lat], i) => `${i === 0 ? 'M' : 'L'} ${bdX(lon).toFixed(1)} ${bdY(lat).toFixed(1)}`)
  .join(' ');
// Dhaka: the launch site
const DHAKA = { x: BD_ORIGIN.x + bdX(90.4), y: BD_ORIGIN.y + bdY(23.8) };

// Flight path: Dhaka to the Moon (quadratic curve)
const P0 = DHAKA;
const P2 = { x: MOON.x - MOON.r + 4, y: MOON.y + MOON.r - 6 };
const P1 = { x: SCREEN_WIDTH * 0.34, y: 56 };
const bez = (t: number) => ({
  x: (1 - t) * (1 - t) * P0.x + 2 * (1 - t) * t * P1.x + t * t * P2.x,
  y: (1 - t) * (1 - t) * P0.y + 2 * (1 - t) * t * P1.y + t * t * P2.y,
});
const tangentDeg = (t: number) => {
  const dx = 2 * (1 - t) * (P1.x - P0.x) + 2 * t * (P2.x - P1.x);
  const dy = 2 * (1 - t) * (P1.y - P0.y) + 2 * t * (P2.y - P1.y);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
};
const SAMPLES = Array.from({ length: 9 }, (_, i) => i / 8);
const SHIP_W = 56;
const SHIP_H = 35;

export default function SplashScreen() {
  const router = useRouter();
  const { hasCompletedOnboarding } = useAppStore();

  const bgOpacity = useRef(new Animated.Value(0)).current;
  const starAnims = useRef(STARS.map(() => new Animated.Value(0))).current;
  const sceneOp = useRef(new Animated.Value(0)).current;
  const brandOp = useRef(new Animated.Value(0)).current;
  const brandY = useRef(new Animated.Value(16)).current;
  const buttonOp = useRef(new Animated.Value(0)).current;
  const shipProgress = useRef(new Animated.Value(0)).current;
  const launchPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(bgOpacity, { toValue: 1, duration: 350, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();

    Animated.parallel(
      STARS.map((_, i) =>
        Animated.timing(starAnims[i], {
          toValue: 1, duration: 260, delay: 300 + i * 50, easing: Easing.out(Easing.ease), useNativeDriver: true,
        })
      )
    ).start();

    // The scene (Earth, Bangladesh, Moon) fades in first
    Animated.timing(sceneOp, { toValue: 1, duration: 600, delay: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();

    // Then the logo and tagline, then the button
    Animated.parallel([
      Animated.timing(brandOp, { toValue: 1, duration: 500, delay: 1300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(brandY, { toValue: 0, duration: 500, delay: 1300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    ]).start();
    Animated.timing(buttonOp, { toValue: 1, duration: 400, delay: 3200, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();

    // Launch pulse over Dhaka, then the rocket flies to the Moon on a loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(launchPulse, { toValue: 1, duration: 1200, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(launchPulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(900),
        Animated.timing(shipProgress, { toValue: 1, duration: 4400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(shipProgress, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.delay(600),
      ])
    ).start();
  }, []);

  const handleProceed = () => {
    router.replace(hasCompletedOnboarding ? '/(tabs)' : '/onboarding');
  };

  // Rocket follows the curve: position, heading and a gentle fade at both ends
  const shipX = shipProgress.interpolate({ inputRange: SAMPLES, outputRange: SAMPLES.map((t) => bez(t).x - SHIP_W / 2) });
  const shipY = shipProgress.interpolate({ inputRange: SAMPLES, outputRange: SAMPLES.map((t) => bez(t).y - SHIP_H / 2) });
  const shipRotate = shipProgress.interpolate({
    inputRange: SAMPLES,
    outputRange: SAMPLES.map((t) => `${tangentDeg(t).toFixed(1)}deg`),
  });
  const shipOpacity = shipProgress.interpolate({ inputRange: [0, 0.06, 0.9, 1], outputRange: [0, 1, 1, 0] });
  const shipScale = shipProgress.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.5, 1, 0.75] });

  const pulseScale = launchPulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 2.6] });
  const pulseOpacity = launchPulse.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.spaceBg, { opacity: bgOpacity }]} />

      {STARS.map((star, i) => (
        <Animated.View
          key={i}
          style={[
            styles.star,
            {
              left: star.x * SCREEN_WIDTH,
              top: star.y * SCREEN_HEIGHT * 0.5,
              width: star.r * 2,
              height: star.r * 2,
              borderRadius: star.r,
              opacity: starAnims[i],
              transform: [{ scale: starAnims[i] }],
            },
          ]}
        />
      ))}

      {/* Earth (with Bangladesh) to the Moon */}
      <Animated.View style={[styles.spaceArena, { opacity: sceneOp }]}>
        <Svg width={SCREEN_WIDTH} height={ARENA_H} viewBox={`0 0 ${SCREEN_WIDTH} ${ARENA_H}`}>
          <Defs>
            <LinearGradient id="earthOcean" x1="0.1" y1="0" x2="0.9" y2="1">
              <Stop offset="0" stopColor="#4A90D9" />
              <Stop offset="0.55" stopColor="#2F5FBF" />
              <Stop offset="1" stopColor="#16337A" />
            </LinearGradient>
            <RadialGradient id="earthShade" cx="0.32" cy="0.28" rx="0.9" ry="0.9">
              <Stop offset="0.5" stopColor="#000000" stopOpacity="0" />
              <Stop offset="1" stopColor="#000000" stopOpacity="0.4" />
            </RadialGradient>
            <RadialGradient id="earthAura" cx="0.5" cy="0.5" rx="0.5" ry="0.5">
              <Stop offset="0.7" stopColor="#60A5FA" stopOpacity="0.25" />
              <Stop offset="1" stopColor="#60A5FA" stopOpacity="0" />
            </RadialGradient>
            <LinearGradient id="moonSurface" x1="0.15" y1="0.1" x2="0.85" y2="0.95">
              <Stop offset="0" stopColor="#F1F5F9" />
              <Stop offset="1" stopColor="#8C97A8" />
            </LinearGradient>
            <RadialGradient id="moonAura" cx="0.5" cy="0.5" rx="0.5" ry="0.5">
              <Stop offset="0.65" stopColor="#FFE9A8" stopOpacity="0.28" />
              <Stop offset="1" stopColor="#FFE9A8" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Flight path, Dhaka to the Moon */}
          <Path
            d={`M ${P0.x} ${P0.y} Q ${P1.x} ${P1.y} ${P2.x} ${P2.y}`}
            stroke="rgba(255, 201, 77, 0.5)"
            strokeWidth="2.5"
            strokeDasharray="7 7"
            strokeLinecap="round"
            fill="none"
          />

          {/* Earth */}
          <Circle cx={EARTH.x} cy={EARTH.y} r={EARTH.r} fill="url(#earthOcean)" />
          {/* Bangladesh */}
          <G transform={`translate(${BD_ORIGIN.x}, ${BD_ORIGIN.y})`}>
            <Path d={BD_PATH} fill="#1F9D55" stroke="#0E6B3A" strokeWidth="0.8" strokeLinejoin="round" />
            <Path d={BD_RIVER} fill="none" stroke="#7FB8F5" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
          </G>
          {/* Dhaka launch site (flag red) */}
          <Circle cx={DHAKA.x} cy={DHAKA.y} r="4.4" fill="#F42A41" stroke="#FFFFFF" strokeWidth="1.4" />
          <Circle cx={EARTH.x} cy={EARTH.y} r={EARTH.r} fill="url(#earthShade)" />
          <SvgText x={EARTH.x} y={EARTH.y + EARTH.r + 17} textAnchor="middle" fill="#9CC4FF" fontSize="13" fontFamily={Typography.family.heading}>
            বাংলাদেশ
          </SvgText>

          {/* Moon */}
          <Circle cx={MOON.x} cy={MOON.y} r={MOON.r + 16} fill="url(#moonAura)" />
          <Circle cx={MOON.x} cy={MOON.y} r={MOON.r} fill="url(#moonSurface)" />
          <Circle cx={MOON.x - 11} cy={MOON.y - 9} r="7" fill="#7C8798" opacity={0.42} />
          <Circle cx={MOON.x + 12} cy={MOON.y + 8} r="9" fill="#7C8798" opacity={0.38} />
          <Circle cx={MOON.x - 4} cy={MOON.y + 16} r="4.5" fill="#7C8798" opacity={0.42} />
          <Circle cx={MOON.x + 14} cy={MOON.y - 16} r="3.5" fill="#7C8798" opacity={0.38} />
          <SvgText x={MOON.x} y={MOON.y + MOON.r + 19} textAnchor="middle" fill="#FFE9A8" fontSize="13" fontFamily={Typography.family.heading}>
            চাঁদ
          </SvgText>
        </Svg>

        {/* Launch pulse over Dhaka */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pulse,
            { left: DHAKA.x - 10, top: DHAKA.y - 10, opacity: pulseOpacity, transform: [{ scale: pulseScale }] },
          ]}
        />

        {/* Rocket */}
        <Animated.View
          style={[
            styles.cruisingShip,
            {
              opacity: shipOpacity,
              transform: [{ translateX: shipX }, { translateY: shipY }, { rotate: shipRotate }, { scale: shipScale }],
            },
          ]}
        >
          <Svg width={SHIP_W} height={SHIP_H} viewBox="0 0 70 44">
            <Defs>
              <LinearGradient id="sBody" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#CBD5E1" />
                <Stop offset="0.7" stopColor="#FFFFFF" />
                <Stop offset="1" stopColor="#E2E8F0" />
              </LinearGradient>
              <LinearGradient id="sFlame" x1="1" y1="0" x2="0" y2="0">
                <Stop offset="0" stopColor="#FFC94D" />
                <Stop offset="0.6" stopColor="#FF7A45" />
                <Stop offset="1" stopColor="#FF7A45" stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Path d="M 13 22 Q -6 14 -6 22 Q -6 30 13 22 Z" fill="url(#sFlame)" />
            <Polygon points="15,10 24,17 15,17" fill={Colors.coral} />
            <Polygon points="15,34 24,27 15,27" fill={Colors.coral} />
            <Path d="M 15 15 L 45 15 Q 63 17 67 22 Q 63 27 45 29 L 15 29 Z" fill="url(#sBody)" stroke="#94A3B8" strokeWidth="1.5" />
            <Path d="M 51 15 Q 67 22 51 29 Z" fill={Colors.coral} />
            <Circle cx="43" cy="22" r="4.5" fill={Colors.primaryLight} stroke={Colors.primary} strokeWidth="1.5" />
            <Circle cx="42" cy="21" r="1.5" fill="#FFFFFF" />
            <Rect x="24" y="8" width="12" height="5" rx="1" fill={Colors.primary} />
            <Rect x="24" y="31" width="12" height="5" rx="1" fill={Colors.primary} />
          </Svg>
        </Animated.View>
      </Animated.View>

      {/* Logo and one line of copy */}
      <Animated.View style={[styles.brandingContainer, { opacity: brandOp, transform: [{ translateY: brandY }] }]}>
        <AnimatedMascot size={132} mood="waving" />
        <Text style={styles.subtitleText}>বাংলাদেশ থেকে চাঁদে, তোমার মহাকাশ অভিযান শুরু হোক!</Text>
      </Animated.View>

      {/* One CTA */}
      <Animated.View style={[styles.ctaContainer, { opacity: buttonOp }]}>
        <GentleButton
          title="অভিযান শুরু করো"
          onPress={handleProceed}
          variant="gold"
          size="large"
          fullWidth
          icon={<Rocket size={20} color="#1A1A2E" />}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.spaceDark,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  spaceBg: {
    ...(StyleSheet.absoluteFill as object),
    backgroundColor: Colors.spaceDark,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  spaceArena: {
    width: SCREEN_WIDTH,
    height: ARENA_H,
    marginHorizontal: -20,
    position: 'relative',
  },
  pulse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F42A41',
  },
  cruisingShip: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  brandingContainer: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },
  subtitleText: {
    color: Colors.textOnDarkMuted,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.notoRegular,
    textAlign: 'center',
    maxWidth: 300,
  },
  ctaContainer: {
    width: '100%',
    maxWidth: 360,
  },
});
