import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Easing, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Rect, Path, Polygon, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { GentleButton } from '../src/components/GentleButton';
import { useAppStore } from '../src/state/useAppStore';
import { Rocket, Sparkles } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { hasCompletedOnboarding } = useAppStore();

  // Animations
  const shipProgress = useRef(new Animated.Value(0)).current;
  const flamePulse = useRef(new Animated.Value(1)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Spaceship Cruising from Earth to Mars
    Animated.loop(
      Animated.sequence([
        Animated.timing(shipProgress, {
          toValue: 1,
          duration: 4200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(shipProgress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 2. Pulsing Thruster Flame
    Animated.loop(
      Animated.sequence([
        Animated.timing(flamePulse, {
          toValue: 1.25,
          duration: 220,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(flamePulse, {
          toValue: 0.85,
          duration: 220,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Staggered Text & Button Fade
    Animated.sequence([
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleProceed = () => {
    if (hasCompletedOnboarding) {
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding');
    }
  };

  const shipTranslateX = shipProgress.interpolate({
    inputRange: [0, 0.4, 0.8, 1],
    outputRange: [-30, SCREEN_WIDTH * 0.35, SCREEN_WIDTH * 0.65, SCREEN_WIDTH * 0.78],
  });

  const shipTranslateY = shipProgress.interpolate({
    inputRange: [0, 0.4, 0.8, 1],
    outputRange: [160, 80, 25, 12],
  });

  const shipRotate = shipProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-35deg', '-20deg', '-5deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Interplanetary Travel Scene */}
      <View style={styles.spaceArena}>
        <Svg width={SCREEN_WIDTH} height={320} viewBox={`0 0 ${SCREEN_WIDTH} 320`}>
          <Defs>
            {/* Earth Blue Gradient */}
            <LinearGradient id="earthGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#6B8AFF" />
              <Stop offset="50%" stopColor="#4A6AE0" />
              <Stop offset="100%" stopColor="#1E2A78" />
            </LinearGradient>

            {/* Mars Soft Rust Gradient */}
            <LinearGradient id="marsGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFAA80" />
              <Stop offset="50%" stopColor="#E06860" />
              <Stop offset="100%" stopColor="#78281F" />
            </LinearGradient>

            {/* Mars Glow Aura */}
            <LinearGradient id="marsAura" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFA498" stopOpacity="0.35" />
              <Stop offset="100%" stopColor="#C0392B" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Earth Departure (Bottom-Left) */}
          <G transform="translate(40, 240)">
            <Circle cx="0" cy="0" r="48" fill="url(#earthGrad)" />
            {/* Continents */}
            <Path d="M -25 -20 Q -10 -35 15 -20 Q 25 5 10 25 Q -15 35 -35 10 Z" fill="#5ED6C0" opacity={0.6} />
            <Path d="M 0 10 Q 15 25 35 15 Q 40 30 20 40 Z" fill="#5ED6C0" opacity={0.6} />
            {/* Cloud swirls */}
            <Path d="M -30 -10 Q 0 -22 25 -5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity={0.4} />
          </G>

          {/* Moon En Route */}
          <G transform="translate(130, 160)">
            <Circle cx="0" cy="0" r="13" fill="#E2E8F0" />
            <Circle cx="-3" cy="-3" r="2.5" fill="#CBD5E1" />
            <Circle cx="4" cy="4" r="2" fill="#CBD5E1" />
          </G>

          {/* Gentle Trajectory Line */}
          <Path
            d={`M 50 210 Q ${SCREEN_WIDTH * 0.45} 80 ${SCREEN_WIDTH - 65} 90`}
            stroke="rgba(107, 138, 255, 0.35)"
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
          />

          {/* Mars Arrival (Top-Right) */}
          <G transform={`translate(${SCREEN_WIDTH - 60}, 90)`}>
            <Circle cx="0" cy="0" r="54" fill="url(#marsAura)" />
            <Circle cx="0" cy="0" r="42" fill="url(#marsGrad)" />
            <Circle cx="-12" cy="-14" r="7" fill="#78281F" opacity={0.5} />
            <Circle cx="16" cy="12" r="9" fill="#78281F" opacity={0.4} />
            <Path d="M -20 -34 Q 0 -42 20 -34 Z" fill="#FFFFFF" opacity={0.8} />
          </G>
        </Svg>

        {/* Animated Spaceship */}
        <Animated.View
          style={[
            styles.cruisingShip,
            {
              transform: [
                { translateX: shipTranslateX },
                { translateY: shipTranslateY },
                { rotate: shipRotate },
              ],
            },
          ]}
        >
          <Svg width="68" height="42" viewBox="0 0 68 42">
            <Defs>
              <LinearGradient id="shipBodyGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#CBD5E1" />
                <Stop offset="70%" stopColor="#FFFFFF" />
                <Stop offset="100%" stopColor="#E2E8F0" />
              </LinearGradient>
              <LinearGradient id="shipFlame" x1="1" y1="0" x2="0" y2="0">
                <Stop offset="0%" stopColor="#FFC86B" />
                <Stop offset="60%" stopColor="#6B8AFF" />
                <Stop offset="100%" stopColor="#B48EFF" stopOpacity="0" />
              </LinearGradient>
            </Defs>

            {/* Thruster Jet Flame */}
            <Animated.View style={{ transform: [{ scaleX: flamePulse }] }}>
              <Path d="M 12 21 Q 0 16 0 21 Q 0 26 12 21 Z" fill="url(#shipFlame)" />
            </Animated.View>

            {/* Fins */}
            <Polygon points="15,10 24,17 15,17" fill={Colors.coral} />
            <Polygon points="15,32 24,25 15,25" fill={Colors.coral} />

            {/* Rocket Body */}
            <Path
              d="M 15 15 L 44 15 Q 62 17 66 21 Q 62 25 44 27 L 15 27 Z"
              fill="url(#shipBodyGrad)"
              stroke="#94A3B8"
              strokeWidth="1.5"
            />

            {/* Nose Cone */}
            <Path d="M 50 15 Q 66 21 50 27 Z" fill={Colors.coral} />

            {/* Porthole */}
            <Circle cx="42" cy="21" r="4.5" fill="#6B8AFF" stroke="#4A6AE0" strokeWidth="1.5" />
            <Circle cx="41" cy="20" r="1.5" fill="#FFFFFF" />

            {/* Solar Panels */}
            <Rect x="24" y="8" width="11" height="5" rx="1" fill="#6B8AFF" />
            <Rect x="24" y="29" width="11" height="5" rx="1" fill="#6B8AFF" />
          </Svg>
        </Animated.View>
      </View>

      {/* Route Badge */}
      <View style={styles.routeBadge}>
        <Text style={styles.routeLabel}>উৎক্ষেপণ: পৃথিবী 🌍</Text>
        <Text style={styles.routeArrow}>➔</Text>
        <Text style={[styles.routeLabel, { color: Colors.coralLight }]}>গন্তব্য: মঙ্গল গ্রহ 🔴</Text>
      </View>

      {/* Title & Branding */}
      <Animated.View style={[styles.brandingContainer, { opacity: titleFade }]}>
        <View style={styles.missionTagRow}>
          <Sparkles size={13} color={Colors.gold} />
          <Text style={styles.missionTagText}>মঙ্গল অভিযান ১ • ইন্টারপ্ল্যানেটারি ফ্লাইট</Text>
          <Sparkles size={13} color={Colors.gold} />
        </View>

        <Text style={styles.mainTitle}>মহাকাশ জুনিয়র</Text>
        <Text style={styles.subtitleText}>
          লাল গ্রহ মঙ্গলে তোমার স্পেস একাডেমি অন্বেষণ শুরু হতে যাচ্ছে!
        </Text>
      </Animated.View>

      {/* Action CTA */}
      <Animated.View style={[styles.ctaContainer, { opacity: buttonFade }]}>
        <GentleButton
          title="ক্যাডেট ওরিয়েন্টেশনে চলো ➔"
          onPress={handleProceed}
          variant="gold"
          size="large"
          fullWidth
          icon={<Rocket size={20} color={Colors.textDark} />}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 48,
  },
  spaceArena: {
    width: '100%',
    height: 320,
    position: 'relative',
    justifyContent: 'center',
  },
  cruisingShip: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  routeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 10,
    marginTop: -20,
    marginBottom: 10,
  },
  routeLabel: {
    color: Colors.primaryLight,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindSemiBold,
  },
  routeArrow: {
    color: Colors.gold,
    fontSize: 12,
    fontFamily: Typography.family.hindBold,
  },
  brandingContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  missionTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 200, 107, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 107, 0.25)',
    marginBottom: 10,
  },
  missionTagText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  mainTitle: {
    color: Colors.text,
    fontSize: 34,
    fontFamily: Typography.family.hindBold,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitleText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.notoRegular,
    textAlign: 'center',
    maxWidth: 320,
  },
  ctaContainer: {
    width: '100%',
    maxWidth: 360,
  },
});
