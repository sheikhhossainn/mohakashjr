import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Rect, Path, Polygon, Defs, LinearGradient, Stop, Ellipse, G } from 'react-native-svg';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { TactileButton } from '../src/components/TactileButton';
import { useAppStore } from '../src/state/useAppStore';
import { Rocket, Sparkles, Compass, MapPin } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { hasCompletedOnboarding } = useAppStore();

  // Animations
  const shipProgress = useRef(new Animated.Value(0)).current;
  const flamePulse = useRef(new Animated.Value(1)).current;
  const marsPulse = useRef(new Animated.Value(1)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Spaceship Cruising from Earth to Mars
    Animated.loop(
      Animated.sequence([
        Animated.timing(shipProgress, {
          toValue: 1,
          duration: 3800,
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
          toValue: 1.35,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(flamePulse, {
          toValue: 0.8,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Mars Atmospheric Glow Breathing
    Animated.loop(
      Animated.sequence([
        Animated.timing(marsPulse, {
          toValue: 1.08,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(marsPulse, {
          toValue: 1.0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 4. Staggered Text & Button Fade
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

  // Spaceship trajectory coordinates from Earth (bottom-left) to Mars (top-right)
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
      {/* Interplanetary Travel Arena */}
      <View style={styles.spaceArena}>
        <Svg width={SCREEN_WIDTH} height={320} viewBox={`0 0 ${SCREEN_WIDTH} 320`}>
          <Defs>
            {/* Earth Blue Gradient */}
            <LinearGradient id="earthGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#38BDF8" />
              <Stop offset="50%" stopColor="#0284C7" />
              <Stop offset="100%" stopColor="#0369A1" />
            </LinearGradient>

            {/* Mars Red/Rust Gradient */}
            <LinearGradient id="marsGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFAA80" />
              <Stop offset="40%" stopColor="#FF5733" />
              <Stop offset="80%" stopColor="#C0392B" />
              <Stop offset="100%" stopColor="#78281F" />
            </LinearGradient>

            {/* Mars Glow Atmosphere */}
            <LinearGradient id="marsAura" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FF7675" stopOpacity="0.45" />
              <Stop offset="100%" stopColor="#C0392B" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Earth at Departure (Bottom-Left) */}
          <G transform="translate(40, 240)">
            <Circle cx="0" cy="0" r="50" fill="url(#earthGrad)" />
            {/* Earth Continents (Green swirls) */}
            <Path d="M -25 -20 Q -10 -35 15 -20 Q 25 5 10 25 Q -15 35 -35 10 Z" fill="#2ED573" opacity={0.7} />
            <Path d="M 0 10 Q 15 25 35 15 Q 40 30 20 40 Z" fill="#2ED573" opacity={0.7} />
            {/* Cloud swirls */}
            <Path d="M -35 -10 Q 0 -25 30 -5" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity={0.5} />
            {/* Label */}
            <Circle cx="0" cy="0" r="54" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity={0.6} />
          </G>

          {/* Earth Label Tag */}
          <Path d="M 95 240 L 115 240" stroke="#38BDF8" strokeWidth="1.5" />

          {/* Moon En Route */}
          <G transform="translate(130, 160)">
            <Circle cx="0" cy="0" r="14" fill="#E2E8F0" />
            <Circle cx="-3" cy="-3" r="3" fill="#CBD5E1" />
            <Circle cx="4" cy="4" r="2.5" fill="#CBD5E1" />
            <Circle cx="-2" cy="5" r="2" fill="#CBD5E1" />
          </G>

          {/* Orbital Transfer Path Arc (Dashed Trajectory Line) */}
          <Path
            d={`M 50 210 Q ${SCREEN_WIDTH * 0.45} 80 ${SCREEN_WIDTH - 65} 90`}
            stroke="rgba(0, 240, 255, 0.45)"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            fill="none"
          />

          {/* Mars at Arrival (Top-Right) */}
          <G transform={`translate(${SCREEN_WIDTH - 60}, 90)`}>
            {/* Glowing Atmosphere */}
            <Circle cx="0" cy="0" r="58" fill="url(#marsAura)" />
            {/* Mars Red Planet Body */}
            <Circle cx="0" cy="0" r="44" fill="url(#marsGrad)" />
            {/* Mars Craters & Dunes */}
            <Circle cx="-12" cy="-14" r="8" fill="#922B21" opacity={0.6} />
            <Circle cx="16" cy="12" r="10" fill="#922B21" opacity={0.5} />
            <Circle cx="-8" cy="18" r="5" fill="#78281F" opacity={0.6} />
            <Path d="M -25 5 Q 0 15 28 0" stroke="#78281F" strokeWidth="3" opacity={0.4} fill="none" />
            {/* Mars Polar Ice Cap (North) */}
            <Path d="M -22 -36 Q 0 -44 22 -36 Z" fill="#FFFFFF" opacity={0.85} />
          </G>
        </Svg>

        {/* Animated Spaceship Cruising Towards Mars */}
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
          <Svg width="72" height="44" viewBox="0 0 72 44">
            <Defs>
              <LinearGradient id="shipBodyGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#CBD5E1" />
                <Stop offset="70%" stopColor="#FFFFFF" />
                <Stop offset="100%" stopColor="#E2E8F0" />
              </LinearGradient>
              <LinearGradient id="shipFlame" x1="1" y1="0" x2="0" y2="0">
                <Stop offset="0%" stopColor="#00F0FF" />
                <Stop offset="60%" stopColor="#3B82F6" />
                <Stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
              </LinearGradient>
            </Defs>

            {/* Thruster Jet Flame */}
            <Animated.View style={{ transform: [{ scaleX: flamePulse }] }}>
              <Path d="M 12 22 Q 0 16 0 22 Q 0 28 12 22 Z" fill="url(#shipFlame)" />
            </Animated.View>

            {/* Rocket Tail Wings */}
            <Polygon points="16,10 26,18 16,18" fill={Colors.coral} />
            <Polygon points="16,34 26,26 16,26" fill={Colors.coral} />

            {/* Rocket Body (Flying Horizontally Rightwards) */}
            <Path
              d="M 16 16 L 46 16 Q 66 18 70 22 Q 66 26 46 28 L 16 28 Z"
              fill="url(#shipBodyGrad)"
              stroke="#94A3B8"
              strokeWidth="2"
            />

            {/* Red Nose Cone */}
            <Path d="M 52 16 Q 70 22 52 28 Z" fill={Colors.coral} />

            {/* Porthole Window */}
            <Circle cx="44" cy="22" r="5" fill={Colors.cyan} stroke="#0284C7" strokeWidth="1.5" />
            <Circle cx="43" cy="21" r="1.5" fill="#FFFFFF" />

            {/* Solar Panels on Side */}
            <Rect x="26" y="8" width="12" height="6" rx="1.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
            <Rect x="26" y="30" width="12" height="6" rx="1.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
          </Svg>
        </Animated.View>
      </View>

      {/* Planetary Route Telemetry Badge */}
      <View style={styles.routeBadge}>
        <View style={styles.routeItem}>
          <Text style={styles.routeLabel}>উৎক্ষেপণ: পৃথিবী 🌍</Text>
        </View>
        <Text style={styles.routeArrow}>➔➔</Text>
        <View style={styles.routeItem}>
          <Text style={[styles.routeLabel, { color: '#FF7675' }]}>গন্তব্য: মঙ্গল গ্রহ 🔴</Text>
        </View>
      </View>

      {/* Title & Branding */}
      <Animated.View style={[styles.brandingContainer, { opacity: titleFade }]}>
        <View style={styles.missionTagRow}>
          <Sparkles size={14} color={Colors.gold} />
          <Text style={styles.missionTagText}>মঙ্গল অভিযান ১ • ইন্টারপ্ল্যানেটারি ফ্লাইট</Text>
          <Sparkles size={14} color={Colors.gold} />
        </View>

        <Text style={styles.mainTitle}>মহাকাশ জুনিয়র 🚀</Text>
        <Text style={styles.subtitleText}>
          লাল গ্রহ মঙ্গলে তোমার স্পেস একাডেমি প্রশিক্ষণ মিশন শুরু হতে যাচ্ছে!
        </Text>
      </Animated.View>

      {/* Action CTA */}
      <Animated.View style={[styles.ctaContainer, { opacity: buttonFade }]}>
        <TactileButton
          title="ক্যাডেট ওরিয়েন্টেশনে চলো ➔"
          onPress={handleProceed}
          variant="gold"
          size="large"
          icon={<Rocket size={20} color={Colors.textDark} />}
          style={styles.launchButton}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
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
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.35)',
    gap: 10,
    marginTop: -20,
    marginBottom: 10,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeLabel: {
    color: Colors.cyan,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  routeArrow: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: Typography.weight.heavy,
  },
  brandingContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  missionTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
    marginBottom: 10,
  },
  missionTagText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  mainTitle: {
    color: Colors.text,
    fontSize: 34,
    fontWeight: Typography.weight.black,
    textAlign: 'center',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 240, 255, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitleText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    textAlign: 'center',
    maxWidth: 320,
  },
  ctaContainer: {
    width: '100%',
    maxWidth: 340,
  },
  launchButton: {
    width: '100%',
  },
});
