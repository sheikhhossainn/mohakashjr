import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import Svg, { Circle, Rect, Path, Ellipse, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../theme/colors';

interface AnimatedMascotProps {
  size?: number;
  mood?: 'happy' | 'waving' | 'excited' | 'thinking';
}

export const AnimatedMascot: React.FC<AnimatedMascotProps> = ({
  size = 100,
  mood = 'happy',
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Continuous Zero-G Floating Bobbing
    const floating = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 8,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // 2. Gentle Space Roll / Rotation
    const tilting = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // 3. Waving Arm
    const waving = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    floating.start();
    tilting.start();
    if (mood === 'waving' || mood === 'excited') {
      waving.start();
    }

    return () => {
      floating.stop();
      tilting.stop();
      waving.stop();
    };
  }, [mood]);

  const spin = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-4deg', '4deg'],
  });

  const wave = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-22deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [{ translateY: floatAnim }, { rotate: spin }],
        },
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          {/* Visor Starlight Gradient */}
          <LinearGradient id="visorGold" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFE066" stopOpacity="1" />
            <Stop offset="60%" stopColor="#FFAA00" stopOpacity="1" />
            <Stop offset="100%" stopColor="#FF7700" stopOpacity="1" />
          </LinearGradient>
          {/* Soft White Suit Shadow */}
          <LinearGradient id="suitShade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <Stop offset="100%" stopColor="#D9E2EC" stopOpacity="1" />
          </LinearGradient>
          {/* Aura Glow */}
          <LinearGradient id="cosmicAura" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        {/* Outer Celestial Glow Halo */}
        <Circle cx="60" cy="60" r="54" fill="url(#cosmicAura)" />

        {/* Life Support Backpack */}
        <Rect
          x="35"
          y="42"
          width="50"
          height="45"
          rx="12"
          fill="#94A3B8"
          stroke="#475569"
          strokeWidth="3"
        />

        {/* Cute Chubby Astronaut Body */}
        <Rect
          x="40"
          y="62"
          width="40"
          height="38"
          rx="18"
          fill="url(#suitShade)"
          stroke="#CBD5E1"
          strokeWidth="3.5"
        />

        {/* Chest Mission Badge */}
        <Circle cx="52" cy="74" r="5" fill={Colors.cyan} />
        <Rect x="60" y="72" width="12" height="4" rx="2" fill={Colors.coral} />

        {/* Cute Legs / Boots */}
        <Rect x="42" y="93" width="14" height="15" rx="6" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2.5" />
        <Rect x="64" y="93" width="14" height="15" rx="6" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2.5" />

        {/* Large Round Helmet */}
        <Circle
          cx="60"
          cy="48"
          r="34"
          fill="url(#suitShade)"
          stroke="#E2E8F0"
          strokeWidth="4"
        />

        {/* Shiny Golden Visor */}
        <Ellipse
          cx="60"
          cy="48"
          rx="24"
          ry="19"
          fill="url(#visorGold)"
          stroke="#D97706"
          strokeWidth="3"
        />

        {/* Visor Glare / Sparkle */}
        <Ellipse cx="54" cy="42" rx="9" ry="5" fill="#FFFFFF" opacity="0.65" transform="rotate(-18 54 42)" />
        <Circle cx="68" cy="40" r="2.5" fill="#FFFFFF" opacity="0.8" />

        {/* Cheerful Blushing Cheeks (Seen through visor) */}
        <Circle cx="46" cy="54" r="3.5" fill="#FF4D8B" opacity="0.4" />
        <Circle cx="74" cy="54" r="3.5" fill="#FF4D8B" opacity="0.4" />

        {/* Cute Smiling Face on Visor */}
        {mood !== 'thinking' ? (
          <Path
            d="M 53 53 Q 60 59 67 53"
            stroke="#78350F"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <Path
            d="M 54 55 Q 60 52 66 55"
            stroke="#78350F"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Comms Antenna with Glowing Starlight Tip */}
        <Path d="M 60 14 L 60 6" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
        <Circle cx="60" cy="5" r="4.5" fill={Colors.gold} stroke="#D97706" strokeWidth="1.5" />

        {/* Left Arm / Waving Glove */}
        <Animated.View style={{ transform: [{ rotate: wave }] }}>
          <Ellipse
            cx="28"
            cy="68"
            rx="8"
            ry="11"
            fill="url(#suitShade)"
            stroke="#CBD5E1"
            strokeWidth="3"
            transform="rotate(25 28 68)"
          />
          <Circle cx="24" cy="62" r="5" fill={Colors.cyan} />
        </Animated.View>

        {/* Right Arm */}
        <Ellipse
          cx="92"
          cy="70"
          rx="8"
          ry="11"
          fill="url(#suitShade)"
          stroke="#CBD5E1"
          strokeWidth="3"
          transform="rotate(-25 92 70)"
        />
        <Circle cx="96" cy="65" r="5" fill={Colors.cyan} />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
