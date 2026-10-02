import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop, Path } from 'react-native-svg';
import { Colors } from '../theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Very gentle, scattered stars
const STARS_LAYER_1 = [
  { cx: 40, cy: 70, r: 1.8, color: '#F5F3F0' },
  { cx: 170, cy: 90, r: 1.2, color: '#C4BFB8' },
  { cx: 310, cy: 80, r: 1.5, color: '#FFD98A' },
  { cx: 120, cy: 260, r: 1.6, color: '#F5F3F0' },
  { cx: 280, cy: 220, r: 2.0, color: '#FFC86B' },
  { cx: 190, cy: 370, r: 1.5, color: '#C4BFB8' },
  { cx: 70, cy: 520, r: 1.4, color: '#F5F3F0' },
  { cx: 240, cy: 480, r: 1.8, color: '#8DA6FF' },
  { cx: 50, cy: 680, r: 1.6, color: '#FFD98A' },
  { cx: 290, cy: 720, r: 1.4, color: '#F5F3F0' },
];

const STARS_LAYER_2 = [
  { cx: 90, cy: 140, r: 1.5, color: '#C4BFB8' },
  { cx: 240, cy: 130, r: 1.8, color: '#FFC86B' },
  { cx: 60, cy: 240, r: 1.2, color: '#8DA6FF' },
  { cx: 220, cy: 210, r: 1.4, color: '#F5F3F0' },
  { cx: 150, cy: 580, r: 1.6, color: '#FFD98A' },
  { cx: 310, cy: 550, r: 1.5, color: '#C4BFB8' },
  { cx: 210, cy: 660, r: 2.0, color: '#FFC86B' },
  { cx: 80, cy: 820, r: 1.4, color: '#F5F3F0' },
];

/**
 * NightSkyCanvas — Calming, slow-twinkling starry backdrop for Mohakash Jr.
 * Designed like gazing through a window at the night sky.
 * Zero harsh flashes, zero orbital rings, pure serene wonder.
 */
export const NightSkyCanvas: React.FC = () => {
  const twinkleAnimA = useRef(new Animated.Value(0.4)).current;
  const twinkleAnimB = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const loopA = Animated.loop(
      Animated.sequence([
        Animated.timing(twinkleAnimA, {
          toValue: 0.9,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(twinkleAnimA, {
          toValue: 0.35,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const loopB = Animated.loop(
      Animated.sequence([
        Animated.timing(twinkleAnimB, {
          toValue: 0.3,
          duration: 3800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(twinkleAnimB, {
          toValue: 0.85,
          duration: 3800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    loopA.start();
    loopB.start();

    return () => {
      loopA.stop();
      loopB.stop();
    };
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`}>
        <Defs>
          {/* Subtle Warm Indigo Nebula Wash */}
          <RadialGradient id="warmNebula" cx="65%" cy="20%" rx="70%" ry="50%">
            <Stop offset="0%" stopColor="#1E2450" stopOpacity="0.45" />
            <Stop offset="60%" stopColor="#161B3D" stopOpacity="0.20" />
            <Stop offset="100%" stopColor={Colors.void} stopOpacity="0" />
          </RadialGradient>

          {/* Gentle Deep Cosmic Gradient */}
          <RadialGradient id="deepCosmic" cx="25%" cy="75%" rx="60%" ry="45%">
            <Stop offset="0%" stopColor="#1A1E48" stopOpacity="0.30" />
            <Stop offset="70%" stopColor={Colors.void} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Base Void Canvas */}
        <Path d={`M0 0 H${SCREEN_WIDTH} V${SCREEN_HEIGHT} H0 Z`} fill={Colors.void} />
        <Path d={`M0 0 H${SCREEN_WIDTH} V${SCREEN_HEIGHT} H0 Z`} fill="url(#warmNebula)" />
        <Path d={`M0 0 H${SCREEN_WIDTH} V${SCREEN_HEIGHT} H0 Z`} fill="url(#deepCosmic)" />
      </Svg>

      {/* Slow Twinkling Stars Layer A */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: twinkleAnimA }]}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`}>
          {STARS_LAYER_1.map((star, idx) => (
            <Circle key={`star-1-${idx}`} cx={star.cx} cy={star.cy} r={star.r} fill={star.color} opacity={0.85} />
          ))}
        </Svg>
      </Animated.View>

      {/* Slow Twinkling Stars Layer B */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: twinkleAnimB }]}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`}>
          {STARS_LAYER_2.map((star, idx) => (
            <Circle key={`star-2-${idx}`} cx={star.cx} cy={star.cy} r={star.r} fill={star.color} opacity={0.8} />
          ))}
        </Svg>
      </Animated.View>
    </View>
  );
};
