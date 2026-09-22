import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Circle, Ellipse, Defs, RadialGradient, Stop, Path, G, LinearGradient } from 'react-native-svg';
import { Colors } from '../theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Star clusters for staggered twinkling
const CLUSTER_A = [
  { cx: 35, cy: 55, r: 2.2, color: '#FFE066' },
  { cx: 160, cy: 75, r: 1.6, color: '#FFFFFF' },
  { cx: 310, cy: 65, r: 2.0, color: '#A5F3FC' },
  { cx: 130, cy: 265, r: 2.4, color: '#FFE066' },
  { cx: 290, cy: 235, r: 2.6, color: '#FFD166' },
  { cx: 185, cy: 355, r: 2.5, color: '#FFE066' },
  { cx: 60, cy: 515, r: 2.0, color: '#FFFFFF' },
  { cx: 220, cy: 495, r: 1.8, color: '#A5F3FC' },
  { cx: 45, cy: 665, r: 2.2, color: '#FFE066' },
  { cx: 280, cy: 695, r: 2.0, color: '#A5F3FC' },
  { cx: 165, cy: 845, r: 2.5, color: '#FFE066' },
];

const CLUSTER_B = [
  { cx: 85, cy: 125, r: 2.5, color: '#FFFFFF' },
  { cx: 245, cy: 115, r: 2.8, color: '#FFE066' },
  { cx: 55, cy: 225, r: 1.8, color: '#A5F3FC' },
  { cx: 215, cy: 195, r: 2.0, color: '#FFFFFF' },
  { cx: 45, cy: 375, r: 2.4, color: '#FFFFFF' },
  { cx: 275, cy: 395, r: 1.8, color: '#FFFFFF' },
  { cx: 145, cy: 565, r: 2.5, color: '#FFE066' },
  { cx: 305, cy: 535, r: 2.3, color: '#FFFFFF' },
  { cx: 205, cy: 655, r: 2.8, color: '#FFE066' },
  { cx: 75, cy: 805, r: 2.0, color: '#FFFFFF' },
  { cx: 325, cy: 835, r: 2.2, color: '#FFFFFF' },
];

export const CosmicBackground: React.FC = () => {
  const twinkleAnimA = useRef(new Animated.Value(0.4)).current;
  const twinkleAnimB = useRef(new Animated.Value(0.8)).current;
  const shootingStarAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Star cluster A twinkling
    const loopA = Animated.loop(
      Animated.sequence([
        Animated.timing(twinkleAnimA, {
          toValue: 1.0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(twinkleAnimA, {
          toValue: 0.3,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // 2. Star cluster B twinkling (counter-phase)
    const loopB = Animated.loop(
      Animated.sequence([
        Animated.timing(twinkleAnimB, {
          toValue: 0.25,
          duration: 2100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(twinkleAnimB, {
          toValue: 1.0,
          duration: 2100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // 3. Periodic Shooting Star
    const loopShootingStar = Animated.loop(
      Animated.sequence([
        Animated.delay(4000),
        Animated.timing(shootingStarAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(shootingStarAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    loopA.start();
    loopB.start();
    loopShootingStar.start();

    return () => {
      loopA.stop();
      loopB.stop();
      loopShootingStar.stop();
    };
  }, []);

  const shootX = shootingStarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_WIDTH + 60, -120],
  });

  const shootY = shootingStarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 320],
  });

  const shootOpacity = shootingStarAnim.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 1, 0.8, 0],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Static Canvas & Nebulae Gradients */}
      <Svg width="100%" height="100%" viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`}>
        <Defs>
          {/* Deep Galaxy Indigo Nebula Glow */}
          <RadialGradient id="galaxyPurpleGlow" cx="70%" cy="18%" rx="75%" ry="50%">
            <Stop offset="0%" stopColor="#2E1B69" stopOpacity="0.75" />
            <Stop offset="55%" stopColor="#1B1652" stopOpacity="0.4" />
            <Stop offset="100%" stopColor={Colors.void} stopOpacity="0" />
          </RadialGradient>

          {/* Cyan Stardust Nebula Glow */}
          <RadialGradient id="cyanNebulaGlow" cx="20%" cy="75%" rx="65%" ry="45%">
            <Stop offset="0%" stopColor="#0E3A5F" stopOpacity="0.5" />
            <Stop offset="60%" stopColor="#12164A" stopOpacity="0.25" />
            <Stop offset="100%" stopColor={Colors.void} stopOpacity="0" />
          </RadialGradient>

          {/* Cute Saturn Planet Gradient */}
          <LinearGradient id="saturnGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFD166" />
            <Stop offset="100%" stopColor="#F78C6C" />
          </LinearGradient>
        </Defs>

        {/* Deep Galactic Canvas */}
        <Path d={`M0 0 H${SCREEN_WIDTH} V${SCREEN_HEIGHT} H0 Z`} fill={Colors.void} />
        <Path d={`M0 0 H${SCREEN_WIDTH} V${SCREEN_HEIGHT} H0 Z`} fill="url(#galaxyPurpleGlow)" />
        <Path d={`M0 0 H${SCREEN_WIDTH} V${SCREEN_HEIGHT} H0 Z`} fill="url(#cyanNebulaGlow)" />

        {/* Cute Distant Cartoon Saturn */}
        <G transform={`translate(${SCREEN_WIDTH * 0.82}, ${SCREEN_HEIGHT * 0.08})`}>
          {/* Saturn Rings Behind */}
          <Ellipse cx="0" cy="0" rx="26" ry="6" stroke="#FFEAA7" strokeWidth="3" fill="none" transform="rotate(-20)" opacity={0.6} />
          {/* Saturn Body */}
          <Circle cx="0" cy="0" r="14" fill="url(#saturnGrad)" opacity={0.7} />
          {/* Saturn Rings Front */}
          <Path d="M -24 9 A 26 6 0 0 0 24 -9" stroke="#FFEAA7" strokeWidth="3" fill="none" opacity={0.8} />
        </G>

        {/* Playful Floating Orbital Arcs */}
        <Ellipse
          cx={SCREEN_WIDTH * 0.75}
          cy={SCREEN_HEIGHT * 0.3}
          rx={SCREEN_WIDTH * 0.75}
          ry={SCREEN_HEIGHT * 0.28}
          stroke="rgba(167, 139, 250, 0.15)"
          strokeWidth="1.5"
          fill="none"
        />

        <Ellipse
          cx={SCREEN_WIDTH * 0.25}
          cy={SCREEN_HEIGHT * 0.82}
          rx={SCREEN_WIDTH * 0.7}
          ry={SCREEN_HEIGHT * 0.25}
          stroke="rgba(56, 189, 248, 0.12)"
          strokeWidth="1.5"
          fill="none"
        />
      </Svg>

      {/* Animated Star Cluster A */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: twinkleAnimA }]}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`}>
          {CLUSTER_A.map((star, idx) => (
            <Circle key={`star-a-${idx}`} cx={star.cx} cy={star.cy} r={star.r} fill={star.color} />
          ))}
        </Svg>
      </Animated.View>

      {/* Animated Star Cluster B */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: twinkleAnimB }]}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`}>
          {CLUSTER_B.map((star, idx) => (
            <Circle key={`star-b-${idx}`} cx={star.cx} cy={star.cy} r={star.r} fill={star.color} />
          ))}
        </Svg>
      </Animated.View>

      {/* Animated Shooting Star / Meteor */}
      <Animated.View
        style={[
          styles.shootingStar,
          {
            transform: [{ translateX: shootX }, { translateY: shootY }, { rotate: '215deg' }],
            opacity: shootOpacity,
          },
        ]}
      >
        <Svg width="90" height="6" viewBox="0 0 90 6">
          <Defs>
            <LinearGradient id="meteorTail" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <Stop offset="40%" stopColor="#38BDF8" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path d="M 0 3 L 90 3" stroke="url(#meteorTail)" strokeWidth="3" strokeLinecap="round" />
          <Circle cx="2" cy="3" r="3" fill="#FFFFFF" />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  shootingStar: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
