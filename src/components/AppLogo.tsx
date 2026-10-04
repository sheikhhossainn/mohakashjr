import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface AppLogoProps {
  size?: number;
  /** Play the intro: helmet pops in, orbit draws itself, a satellite takes a lap and parks. */
  animated?: boolean;
  /** ms before the intro starts (lets a parent finish its own fade-in first). */
  delay?: number;
  /** Loading state: the satellite keeps circling slowly and the helmet breathes until unmounted. */
  loading?: boolean;
}

/**
 * Mohakash Jr. logo mark — a cadet's helmet that is also a planet.
 *
 *  • golden orbit ring circles the helmet, like Saturn's ring
 *  • the visor is deep space and reflects a tiny ringed planet and stars
 *  • a gold satellite rides the orbit and parks top-right when the intro ends
 *  • antenna tip is the guiding star
 *
 * No text: the mark has to read at 34px in the header and at 170px on the splash.
 */

const TILT = (-18 * Math.PI) / 180;
const ORBIT_A = 54; // orbit half-width
const ORBIT_B = 16; // orbit half-height (the tilt makes it look 3D)
const ARC_LENGTH = 132; // length of half the orbit, for the draw-in
const PARK_ANGLE = 2 * Math.PI - 0.62 + 2 * Math.PI; // satellite rests top-right, behind the helmet rim
const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 120,
  animated = false,
  delay = 0,
  loading = false,
}) => {
  const reduced = useReducedMotion();
  const play = (animated || loading) && !reduced;

  const enter = useSharedValue(play ? 0 : 1); // helmet pop-in
  const draw = useSharedValue(play ? 0 : 1); // orbit stroke draw-in
  const lap = useSharedValue(play ? Math.PI : PARK_ANGLE); // satellite angle
  const twinkle = useSharedValue(1); // visor stars
  const breathe = useSharedValue(0); // gentle helmet breathing while loading

  useEffect(() => {
    if (!play) return;

    if (loading) {
      // Loading: no finish line. Show everything at once, then keep circling slowly.
      enter.set(withSpring(1, { duration: 500, dampingRatio: 1 }));
      draw.set(withTiming(1, { duration: 900, easing: EASE_OUT }));
      lap.set(PARK_ANGLE);
      lap.set(
        withRepeat(withTiming(PARK_ANGLE + 2 * Math.PI, { duration: 3800, easing: Easing.linear }), -1, false)
      );
      breathe.set(
        withRepeat(
          withSequence(
            withTiming(1, { duration: 1800, easing: EASE_IN_OUT }),
            withTiming(0, { duration: 1800, easing: EASE_IN_OUT })
          ),
          -1,
          false
        )
      );
      return;
    }

    // Intro: slow on purpose, it is the app's one moment of delight
    enter.set(withDelay(delay, withSpring(1, { duration: 700, dampingRatio: 1 })));
    draw.set(withDelay(delay + 400, withTiming(1, { duration: 1100, easing: EASE_OUT })));
    lap.set(withDelay(delay + 900, withTiming(PARK_ANGLE, { duration: 2600, easing: EASE_IN_OUT })));
    twinkle.set(
      withDelay(
        delay + 800,
        withSequence(
          withTiming(0.25, { duration: 260 }),
          withTiming(1, { duration: 340 }),
          withTiming(0.4, { duration: 260 }),
          withTiming(1, { duration: 420 })
        )
      )
    );
  }, [play, loading, delay, enter, draw, lap, twinkle, breathe]);

  const popStyle = useAnimatedStyle(() => ({
    opacity: enter.get(),
    transform: [{ scale: (0.88 + 0.12 * enter.get()) * (1 + 0.03 * breathe.get()) }],
  }));

  const backArcProps = useAnimatedProps(() => ({ strokeDashoffset: ARC_LENGTH * (1 - draw.get()) }));
  const frontArcProps = useAnimatedProps(() => ({ strokeDashoffset: ARC_LENGTH * (1 - draw.get()) }));

  // Satellite position on the tilted orbit (all on the UI thread)
  const satelliteProps = useAnimatedProps(() => {
    const t = lap.get();
    const dx = ORBIT_A * Math.cos(t);
    const dy = ORBIT_B * Math.sin(t);
    const cos = Math.cos(TILT);
    const sin = Math.sin(TILT);
    // Behind the helmet (back half, over its face) the satellite is hidden
    const hidden = dy < 0 && Math.abs(dx) < 33;
    return {
      cx: 60 + dx * cos - dy * sin,
      cy: 60 + dx * sin + dy * cos,
      opacity: hidden ? 0 : draw.get(),
    };
  });

  const starProps = useAnimatedProps(() => ({ opacity: twinkle.get() }));

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Mohakash Jr"
      style={{ width: size, height: size }}
    >
      <Animated.View style={[{ width: size, height: size }, popStyle]}>
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Defs>
            <RadialGradient id="logoGlow" cx="0.5" cy="0.5" rx="0.5" ry="0.5">
              <Stop offset="0.55" stopColor={Colors.primary} stopOpacity="0.28" />
              <Stop offset="1" stopColor={Colors.primary} stopOpacity="0" />
            </RadialGradient>
            <LinearGradient id="logoShell" x1="0.15" y1="0" x2="0.85" y2="1">
              <Stop offset="0" stopColor="#FFFFFF" />
              <Stop offset="1" stopColor="#B7C6EC" />
            </LinearGradient>
            <LinearGradient id="logoVisor" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#2A2F8C" />
              <Stop offset="1" stopColor="#0A0D2E" />
            </LinearGradient>
            <LinearGradient id="logoOrbit" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={Colors.goldDark} />
              <Stop offset="0.5" stopColor={Colors.gold} />
              <Stop offset="1" stopColor="#FFE9A8" />
            </LinearGradient>
          </Defs>

          {/* Soft halo */}
          <Circle cx="60" cy="60" r="58" fill="url(#logoGlow)" />

          {/* Orbit, back half (behind the helmet) */}
          <G rotation={-18} origin="60, 60">
            <AnimatedPath
              d={`M ${60 - ORBIT_A} 60 A ${ORBIT_A} ${ORBIT_B} 0 0 1 ${60 + ORBIT_A} 60`}
              fill="none"
              stroke="url(#logoOrbit)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray={ARC_LENGTH}
              animatedProps={backArcProps}
              opacity={0.75}
            />
          </G>

          {/* Helmet */}
          <Circle cx="60" cy="58" r="33" fill="url(#logoShell)" stroke="#E6ECFB" strokeWidth="3" />
          {/* Ear caps */}
          <Circle cx="27" cy="60" r="4.5" fill={Colors.gold} />
          <Circle cx="93" cy="60" r="4.5" fill={Colors.gold} />

          {/* Visor = a window onto space */}
          <Ellipse cx="60" cy="58" rx="24" ry="19" fill="url(#logoVisor)" stroke="#6B7BD6" strokeWidth="2.5" />

          {/* Reflected ringed planet */}
          <G rotation={-20} origin="68, 51">
            <Ellipse cx="68" cy="51" rx="9.5" ry="2.6" fill="none" stroke={Colors.gold} strokeWidth="1.6" opacity={0.9} />
          </G>
          <Circle cx="68" cy="51" r="5" fill={Colors.gold} />
          <G rotation={-20} origin="68, 51">
            <Path d="M 58.5 51 A 9.5 2.6 0 0 0 77.5 51" fill="none" stroke="#FFE9A8" strokeWidth="1.6" />
          </G>

          {/* Visor stars */}
          <AnimatedCircle cx="49" cy="48" r="1.8" fill="#FFFFFF" animatedProps={starProps} />
          <AnimatedCircle cx="54" cy="64" r="1.3" fill="#FFFFFF" animatedProps={starProps} />
          <AnimatedCircle cx="75" cy="64" r="1.5" fill="#FFFFFF" animatedProps={starProps} />

          {/* Glare */}
          <Ellipse cx="50" cy="46" rx="7" ry="3.6" fill="#FFFFFF" opacity={0.28} rotation={-25} origin="50, 46" />

          {/* Antenna with guiding star */}
          <Path d="M 60 25 L 60 15" stroke="#B7C6EC" strokeWidth="3" strokeLinecap="round" />
          <Circle cx="60" cy="12" r="4.6" fill={Colors.gold} stroke={Colors.goldDark} strokeWidth="1.2" />

          {/* Orbit, front half (in front of the helmet) */}
          <G rotation={-18} origin="60, 60">
            <AnimatedPath
              d={`M ${60 - ORBIT_A} 60 A ${ORBIT_A} ${ORBIT_B} 0 0 0 ${60 + ORBIT_A} 60`}
              fill="none"
              stroke="url(#logoOrbit)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray={ARC_LENGTH}
              animatedProps={frontArcProps}
            />
          </G>

          {/* Satellite riding the orbit */}
          <AnimatedCircle r="8.5" fill={Colors.gold} fillOpacity={0.28} animatedProps={satelliteProps} />
          <AnimatedCircle r="4.4" fill="#FFF3CC" stroke={Colors.gold} strokeWidth="1.6" animatedProps={satelliteProps} />
        </Svg>
      </Animated.View>
    </View>
  );
};
