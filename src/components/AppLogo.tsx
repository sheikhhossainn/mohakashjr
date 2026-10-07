import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';

interface AppLogoProps {
  size?: number;
  /** Play the continuous majestic slow celestial orbit animation. */
  animated?: boolean;
  /** ms before the intro starts (lets a parent finish its own fade-in first). */
  delay?: number;
  /** Loading state: keeps circling slowly and helmet breathing until unmounted. */
  loading?: boolean;
}

/**
 * Mohakash Jr. logo mark — a cadet's helmet encircled by Saturn-like orbital rings.
 *
 *  • Golden orbit ring tilted at -18° circles the helmet with true 3D depth.
 *  • A golden satellite probe with solar wings glides in slow celestial motion (~5.5s per loop)
 *    seamlessly dipping behind the helmet and gliding in front with depth scaling.
 *  • Visor reflects deep space, distant ringed planet, and twinkling stars.
 *  • Antenna tip features a pulsing golden guiding beacon star.
 *  • Zero-G gentle helmet floating (~4.4s sinusoidal breathing cycle).
 *  • 100% hardware-accelerated on UI thread using native transforms (zero SVG prop lag on Android APKs).
 */

const TILT_RAD = (-18 * Math.PI) / 180;
const COS_TILT = Math.cos(TILT_RAD);
const SIN_TILT = Math.sin(TILT_RAD);
const ORBIT_A = 54; // Semi-major axis
const ORBIT_B = 16; // Semi-minor axis (perspective depth)

const SatelliteVisual: React.FC = React.memo(() => (
  <Svg width={20} height={20} viewBox="0 0 20 20">
    <Defs>
      <RadialGradient id="logoSatGlow" cx="0.5" cy="0.5" rx="0.5" ry="0.5">
        <Stop offset="0.3" stopColor={Colors.gold} stopOpacity="0.8" />
        <Stop offset="1" stopColor={Colors.gold} stopOpacity="0" />
      </RadialGradient>
    </Defs>
    {/* Soft outer glow */}
    <Circle cx="10" cy="10" r="9" fill="url(#logoSatGlow)" />
    {/* Solar wings */}
    <Rect x="2" y="8.5" width="4" height="3" rx="0.8" fill="#FFE9A8" stroke={Colors.goldDark} strokeWidth="0.7" />
    <Rect x="14" y="8.5" width="4" height="3" rx="0.8" fill="#FFE9A8" stroke={Colors.goldDark} strokeWidth="0.7" />
    {/* Center probe orb */}
    <Circle cx="10" cy="10" r="4.4" fill="#FFF9E6" stroke={Colors.gold} strokeWidth="1.5" />
    <Circle cx="9" cy="9" r="1.3" fill="#FFFFFF" />
  </Svg>
));

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 120,
  animated = false,
  delay = 0,
  loading = false,
}) => {
  const reduced = useReducedMotion();
  const play = (animated || loading) && !reduced;

  // Orbit progress: 0 to 1 represents full 360-degree celestial orbit
  const orbitProgress = useSharedValue(play ? 0 : 0.88);
  // Gentle zero-G floating: oscillates translateY between -2.5 and +2.5
  const floatAnim = useSharedValue(0);
  // Outer cosmic halo pulse
  const glowAnim = useSharedValue(0.6);
  // Antenna guiding beacon star pulse
  const beaconAnim = useSharedValue(1.0);

  useEffect(() => {
    if (!play) {
      orbitProgress.set(0.88); // Parking position top-right along back ring
      floatAnim.set(0);
      glowAnim.set(0.6);
      beaconAnim.set(1.0);
      return;
    }

    // 1. Slow majestic continuous celestial orbit (5.5s cycle so kids can clearly feel the motion)
    orbitProgress.set(
      withRepeat(
        withTiming(1, { duration: 5500, easing: Easing.linear }),
        -1,
        false
      )
    );

    // 2. Gentle zero-G floating of helmet (4.4s sinusoidal rhythm)
    floatAnim.set(
      withRepeat(
        withSequence(
          withTiming(-2.5, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
          withTiming(2.5, { duration: 2200, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );

    // 3. Cosmic nebula halo slow breathing (3.2s cycle)
    glowAnim.set(
      withRepeat(
        withSequence(
          withTiming(0.95, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.45, { duration: 2800, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );

    // 4. Guiding beacon star twinkle/pulse (1.6s cycle)
    beaconAnim.set(
      withRepeat(
        withSequence(
          withTiming(1.25, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.85, { duration: 1600, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
  }, [play, orbitProgress, floatAnim, glowAnim, beaconAnim]);

  // Satellite position calculations on the tilted 3D orbit
  const frontSatStyle = useAnimatedStyle(() => {
    const t = orbitProgress.get() * 2 * Math.PI;
    const sinT = Math.sin(t);
    const cosT = Math.cos(t);
    const xUnrot = ORBIT_A * cosT;
    const yUnrot = ORBIT_B * sinT;

    const satX = 60 + xUnrot * COS_TILT - yUnrot * SIN_TILT;
    const satY = 58 + xUnrot * SIN_TILT + yUnrot * COS_TILT;

    // In front of helmet when sin(t) >= -0.05
    const isFront = sinT >= -0.05;

    return {
      opacity: isFront ? 1 : 0,
      transform: [
        { translateX: satX - 10 },
        { translateY: satY - 10 },
        { scale: isFront ? 1 + 0.12 * sinT : 0.8 },
      ],
    };
  });

  const backSatStyle = useAnimatedStyle(() => {
    const t = orbitProgress.get() * 2 * Math.PI;
    const sinT = Math.sin(t);
    const cosT = Math.cos(t);
    const xUnrot = ORBIT_A * cosT;
    const yUnrot = ORBIT_B * sinT;

    const satX = 60 + xUnrot * COS_TILT - yUnrot * SIN_TILT;
    const satY = 58 + xUnrot * SIN_TILT + yUnrot * COS_TILT;

    // In back when sin(t) < 0.05
    const isBack = sinT < 0.05;

    return {
      opacity: isBack ? 1 : 0,
      transform: [
        { translateX: satX - 10 },
        { translateY: satY - 10 },
        { scale: 0.82 },
      ],
    };
  });

  const helmetFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.get() }],
  }));

  const haloGlowStyle = useAnimatedStyle(() => ({
    opacity: glowAnim.get(),
    transform: [{ scale: 0.94 + 0.08 * glowAnim.get() }],
  }));

  const beaconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: beaconAnim.get() }],
    opacity: 0.75 + 0.25 * ((beaconAnim.get() - 0.85) / 0.4),
  }));

  // Clean uniform scaling to any requested size based on base 120x120 canvas
  const scale = size / 120;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Mohakash Jr"
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
    >
      <View
        style={{
          width: 120,
          height: 120,
          transform: [{ scale }],
          position: 'relative',
        }}
      >
        {/* Layer 0: Cosmic Halo Glow */}
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, haloGlowStyle]}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Defs>
              <RadialGradient id="logoGlow" cx="0.5" cy="0.48" rx="0.5" ry="0.5">
                <Stop offset="0.35" stopColor={Colors.primary} stopOpacity="0.4" />
                <Stop offset="0.75" stopColor={Colors.primary} stopOpacity="0.12" />
                <Stop offset="1" stopColor={Colors.primary} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx="60" cy="58" r="56" fill="url(#logoGlow)" />
          </Svg>
        </Animated.View>

        {/* Layer 1: Back Half of Golden Orbit Ring (behind helmet) */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Defs>
              <LinearGradient id="logoOrbitBack" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={Colors.goldDark} />
                <Stop offset="0.5" stopColor={Colors.gold} />
                <Stop offset="1" stopColor="#FFE9A8" />
              </LinearGradient>
            </Defs>
            <G rotation={-18} origin="60, 58">
              <Path
                d={`M ${60 - ORBIT_A} 58 A ${ORBIT_A} ${ORBIT_B} 0 0 1 ${60 + ORBIT_A} 58`}
                fill="none"
                stroke="url(#logoOrbitBack)"
                strokeWidth="4"
                strokeLinecap="round"
                opacity={0.72}
              />
            </G>
          </Svg>
        </View>

        {/* Layer 2: Satellite when in Back Orbit (occluded when directly behind helmet shell) */}
        <Animated.View pointerEvents="none" style={[styles.satelliteUnit, backSatStyle]}>
          <SatelliteVisual />
        </Animated.View>

        {/* Layer 3: Helmet, Visor, Glare, Antenna and Guiding Beacon */}
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, helmetFloatStyle]}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Defs>
              <LinearGradient id="logoShell" x1="0.15" y1="0" x2="0.85" y2="1">
                <Stop offset="0" stopColor="#FFFFFF" />
                <Stop offset="1" stopColor="#B7C6EC" />
              </LinearGradient>
              <LinearGradient id="logoVisor" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#2A2F8C" />
                <Stop offset="1" stopColor="#0A0D2E" />
              </LinearGradient>
            </Defs>

            {/* White composite helmet shell with polished rim */}
            <Circle cx="60" cy="58" r="33" fill="url(#logoShell)" stroke="#E6ECFB" strokeWidth="3" />

            {/* Gold ear communication caps */}
            <Circle cx="27" cy="58" r="4.5" fill={Colors.gold} />
            <Circle cx="93" cy="58" r="4.5" fill={Colors.gold} />

            {/* Deep space cosmic visor */}
            <Ellipse cx="60" cy="58" rx="24" ry="19" fill="url(#logoVisor)" stroke="#6B7BD6" strokeWidth="2.5" />

            {/* Reflected golden ringed planet inside visor */}
            <G rotation={-20} origin="68, 51">
              <Ellipse cx="68" cy="51" rx="9.5" ry="2.6" fill="none" stroke={Colors.gold} strokeWidth="1.6" opacity={0.9} />
            </G>
            <Circle cx="68" cy="51" r="5" fill={Colors.gold} />
            <G rotation={-20} origin="68, 51">
              <Path d="M 58.5 51 A 9.5 2.6 0 0 0 77.5 51" fill="none" stroke="#FFE9A8" strokeWidth="1.6" />
            </G>

            {/* Visor distant stars */}
            <Circle cx="49" cy="48" r="1.8" fill="#FFFFFF" opacity={0.95} />
            <Circle cx="54" cy="64" r="1.3" fill="#FFFFFF" opacity={0.85} />
            <Circle cx="75" cy="64" r="1.5" fill="#FFFFFF" opacity={0.9} />

            {/* Curved visor glass glare */}
            <Ellipse cx="50" cy="46" rx="7" ry="3.6" fill="#FFFFFF" opacity={0.28} rotation={-25} origin="50, 46" />

            {/* Antenna stem */}
            <Path d="M 60 25 L 60 15" stroke="#B7C6EC" strokeWidth="3" strokeLinecap="round" />
          </Svg>

          {/* Guiding star antenna beacon pulsing at (60, 12) */}
          <Animated.View style={[styles.beaconUnit, beaconStyle]}>
            <Svg width={18} height={18} viewBox="0 0 18 18">
              <Circle cx="9" cy="9" r="8" fill={Colors.gold} opacity={0.3} />
              <Circle cx="9" cy="9" r="4.5" fill={Colors.gold} stroke={Colors.goldDark} strokeWidth="1.2" />
              <Circle cx="8" cy="8" r="1.4" fill="#FFFFFF" />
            </Svg>
          </Animated.View>
        </Animated.View>

        {/* Layer 4: Front Half of Golden Orbit Ring (in front of helmet) */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Defs>
              <LinearGradient id="logoOrbitFront" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={Colors.goldDark} />
                <Stop offset="0.5" stopColor={Colors.gold} />
                <Stop offset="1" stopColor="#FFE9A8" />
              </LinearGradient>
            </Defs>
            <G rotation={-18} origin="60, 58">
              <Path
                d={`M ${60 - ORBIT_A} 58 A ${ORBIT_A} ${ORBIT_B} 0 0 0 ${60 + ORBIT_A} 58`}
                fill="none"
                stroke="url(#logoOrbitFront)"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </G>
          </Svg>
        </View>

        {/* Layer 5: Satellite when in Front Orbit (passes over helmet and front ring) */}
        <Animated.View pointerEvents="none" style={[styles.satelliteUnit, frontSatStyle]}>
          <SatelliteVisual />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  satelliteUnit: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 20,
    height: 20,
  },
  beaconUnit: {
    position: 'absolute',
    left: 51,
    top: 3,
    width: 18,
    height: 18,
  },
});

