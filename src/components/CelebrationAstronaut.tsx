import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, {
  Circle,
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop,
  G,
  Polygon,
  Ellipse,
} from 'react-native-svg';
import { Colors } from '../theme/colors';
import { RankTier } from '../content/schema';

interface CelebrationAstronautProps {
  score: number;
  total: number;
  rank?: RankTier;
  size?: number;
}

/**
 * CelebrationAstronaut — Expressive, animated victory mascot for quiz & mission debriefs.
 * The astronaut physically expresses the achievement:
 * - Perfect (3/3): Jubilant victory pose with arms raised high, golden starlight halo, victory laurel & star beacon.
 * - Great (2/3): Cheerful waving arm + thumbs up with enthusiastic curved smiling visor.
 * - Good (1/3): Encouraging explorer pose with friendly wave & cosmic telescope/scanner.
 * - Retry (0/3): Warm friendly companion with star map, motivating the cadet to try again.
 */
export const CelebrationAstronaut: React.FC<CelebrationAstronautProps> = ({
  score,
  total,
  rank = 'Cadet',
  size = 140,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  const ratio = total > 0 ? score / total : 0;
  const isPerfect = ratio === 1;
  const isGreat = ratio >= 0.6 && !isPerfect;
  const isGood = ratio >= 0.3 && ratio < 0.6;
  const isRetry = ratio < 0.3;

  useEffect(() => {
    // 1. Zero-G floating bobbing
    const floating = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: isPerfect ? 1200 : 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 8,
          duration: isPerfect ? 1200 : 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // 2. Aura breathing pulse
    const pulsing = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.96,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // 3. Cheerful waving motion
    const waving = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: isPerfect ? 400 : 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: isPerfect ? 400 : 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    floating.start();
    pulsing.start();
    waving.start();

    return () => {
      floating.stop();
      pulsing.stop();
      waving.stop();
    };
  }, [isPerfect]);

  const waveRotate = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: isPerfect ? ['-8deg', '12deg'] : ['-5deg', '15deg'],
  });

  // Color theme according to achievement tier
  const haloColor = isPerfect
    ? Colors.gold
    : isGreat
      ? Colors.emerald
      : isGood
        ? Colors.primary
        : Colors.cyan;

  const haloBg = isPerfect
    ? 'rgba(255, 201, 77, 0.16)'
    : isGreat
      ? 'rgba(93, 211, 158, 0.14)'
      : 'rgba(140, 155, 255, 0.12)';

  const visorGradStart = isPerfect ? '#FFE259' : isGreat ? '#FFE066' : '#A5F3FC';
  const visorGradEnd = isPerfect ? '#FFA751' : isGreat ? '#F59E0B' : '#0284C7';

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      {/* Outer Breathing Energy Halo */}
      <Animated.View
        style={[
          styles.haloAura,
          {
            width: size * 0.92,
            height: size * 0.92,
            borderRadius: (size * 0.92) / 2,
            backgroundColor: haloBg,
            borderColor: haloColor,
            borderWidth: isPerfect ? 1.5 : 1,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      {/* Floating Animated Astronaut */}
      <Animated.View
        style={[
          styles.characterContainer,
          {
            width: size,
            height: size,
            transform: [{ translateY: floatAnim }],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 140 140">
          <Defs>
            {/* White Composite Suit Gradient */}
            <LinearGradient id="celebSuitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="75%" stopColor="#F1F5F9" />
              <Stop offset="100%" stopColor="#CBD5E1" />
            </LinearGradient>

            {/* Thermal Visor Gradient */}
            <LinearGradient id="celebVisorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={visorGradStart} />
              <Stop offset="60%" stopColor={visorGradEnd} />
              <Stop offset="100%" stopColor="#D97706" />
            </LinearGradient>

            {/* Gold Trophy Star Gradient */}
            <LinearGradient id="trophyStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFF275" />
              <Stop offset="100%" stopColor="#FFAA00" />
            </LinearGradient>
          </Defs>

          {/* ── Background Celebration Accents ── */}
          {isPerfect && (
            <G opacity={0.9}>
              {/* Victory Orbital Rings */}
              <Ellipse
                cx="70"
                cy="70"
                rx="62"
                ry="30"
                fill="none"
                stroke={Colors.gold}
                strokeWidth="1.5"
                strokeDasharray="6 4"
                transform="rotate(-15 70 70)"
              />
              {/* Floating Star Sparkles */}
              <Polygon points="22,25 24,30 29,31 25,34 26,39 22,36 18,39 19,34 15,31 20,30" fill={Colors.gold} />
              <Polygon points="116,22 118,27 123,28 119,31 120,36 116,33 112,36 113,31 109,28 114,27" fill={Colors.gold} />
              <Circle cx="120" cy="55" r="2.5" fill="#FFE08A" />
              <Circle cx="18" cy="60" r="2" fill="#FFE08A" />
            </G>
          )}

          {isGreat && (
            <G opacity={0.85}>
              <Ellipse
                cx="70"
                cy="70"
                rx="58"
                ry="26"
                fill="none"
                stroke={Colors.emerald}
                strokeWidth="1.2"
                strokeDasharray="5 4"
                transform="rotate(12 70 70)"
              />
              <Polygon points="115,26 116.5,30 120,30.5 117.5,33 118,36.5 115,34.5 112,36.5 112.5,33 110,30.5 113.5,30" fill={Colors.emerald} />
              <Circle cx="24" cy="32" r="2.5" fill={Colors.cyan} />
            </G>
          )}

          {/* ── Life Support Backpack ── */}
          <Rect x="44" y="44" width="52" height="54" rx="12" fill="#64748B" stroke="#475569" strokeWidth="2" />
          <Rect x="49" y="48" width="42" height="42" rx="8" fill="#475569" />

          {/* ── Spacesuit Legs & Boots ── */}
          <Rect x="50" y="104" width="16" height="22" rx="7" fill="url(#celebSuitGrad)" stroke="#94A3B8" strokeWidth="2" />
          <Rect x="74" y="104" width="16" height="22" rx="7" fill="url(#celebSuitGrad)" stroke="#94A3B8" strokeWidth="2" />
          {/* Boot Soles */}
          <Rect x="48" y="121" width="20" height="7" rx="3.5" fill="#64748B" />
          <Rect x="72" y="121" width="20" height="7" rx="3.5" fill="#64748B" />

          {/* ── Spacesuit Torso & Chest Pack ── */}
          <Path
            d="M 46 64 Q 70 60 94 64 L 90 106 Q 70 110 50 106 Z"
            fill="url(#celebSuitGrad)"
            stroke="#CBD5E1"
            strokeWidth="2.5"
          />
          {/* Chest Mission Telemetry Pack */}
          <Rect x="56" y="74" width="28" height="20" rx="6" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
          <Circle cx="63" cy="81" r="3" fill={haloColor} />
          <Rect x="69" y="79" width="10" height="4" rx="2" fill="#38BDF8" />
          <Rect x="63" y="87" width="16" height="3" rx="1.5" fill="#64748B" />

          {/* ── ARMS & PROPS (State Dependent) ── */}
          {isPerfect ? (
            /* PERFECT SCORE: Both arms raised high in triumphant victory celebration (\o/) */
            <G>
              {/* Left Arm Raised High */}
              <Path
                d="M 48 68 Q 28 48 30 28"
                fill="none"
                stroke="url(#celebSuitGrad)"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <Circle cx="30" cy="27" r="7" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />

              {/* Right Arm Raised High Holding Golden Star */}
              <Path
                d="M 92 68 Q 112 48 110 28"
                fill="none"
                stroke="url(#celebSuitGrad)"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <Circle cx="110" cy="27" r="7" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />

              {/* Glowing Victory Star Held in Right Hand */}
              <Polygon
                points="110,10 113,18 122,19 115,24 117,32 110,27 103,32 105,24 98,19 107,18"
                fill="url(#trophyStarGrad)"
                stroke="#D97706"
                strokeWidth="1"
              />
            </G>
          ) : isGreat ? (
            /* GREAT SCORE: Waving Left Arm + Thumbs Up Right Hand */
            <G>
              {/* Left Arm Waving Up */}
              <Path
                d="M 48 68 Q 30 52 32 36"
                fill="none"
                stroke="url(#celebSuitGrad)"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <Circle cx="32" cy="35" r="7" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
              {/* Waving sparkle */}
              <Polygon points="26,22 28,26 32,27 29,29 30,33 26,31 22,33 23,29 20,27 24,26" fill={Colors.gold} />

              {/* Right Arm Giving Thumbs Up */}
              <Path
                d="M 92 68 Q 110 76 108 90"
                fill="none"
                stroke="url(#celebSuitGrad)"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <Circle cx="108" cy="91" r="7" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
              {/* Thumbs up thumb */}
              <Rect x="106" y="82" width="5" height="9" rx="2.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
            </G>
          ) : isGood ? (
            /* GOOD SCORE: Waving Arm + Holding Space Scanner */
            <G>
              {/* Left Arm Waving */}
              <Path
                d="M 48 68 Q 32 60 36 46"
                fill="none"
                stroke="url(#celebSuitGrad)"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <Circle cx="36" cy="45" r="7" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />

              {/* Right Arm Holding Scanner */}
              <Path
                d="M 92 68 Q 106 74 100 88"
                fill="none"
                stroke="url(#celebSuitGrad)"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <Circle cx="100" cy="88" r="7" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
              {/* Scanner Tablet */}
              <Rect x="98" y="80" width="14" height="18" rx="3" fill="#1E293B" stroke={Colors.cyan} strokeWidth="1.5" />
              <Circle cx="105" cy="89" r="3" fill={Colors.cyan} />
            </G>
          ) : (
            /* RETRY: Reassuring Open Gestures */
            <G>
              <Path
                d="M 48 68 Q 34 76 36 90"
                fill="none"
                stroke="url(#celebSuitGrad)"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <Circle cx="36" cy="90" r="7" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />

              <Path
                d="M 92 68 Q 106 76 104 90"
                fill="none"
                stroke="url(#celebSuitGrad)"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <Circle cx="104" cy="90" r="7" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
            </G>
          )}

          {/* ── Round Bubble Helmet ── */}
          <Circle
            cx="70"
            cy="46"
            r="32"
            fill="url(#celebSuitGrad)"
            stroke="#CBD5E1"
            strokeWidth="3.5"
          />

          {/* Ear Comms Pods */}
          <Circle cx="38" cy="46" r="6" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
          <Circle cx="102" cy="46" r="6" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />

          {/* Apollo Comms Antenna with Guiding Beacon Star */}
          <Rect x="68" y="9" width="4" height="8" rx="2" fill="#94A3B8" />
          <Circle cx="70" cy="8" r="4.5" fill={haloColor} />

          {/* ── Thermal Reflective Visor ── */}
          <Rect
            x="48"
            y="31"
            width="44"
            height="29"
            rx="14"
            fill="url(#celebVisorGrad)"
            stroke="#B45309"
            strokeWidth="2"
          />

          {/* Visor Sunlight Glare Highlights */}
          <Ellipse cx="58" cy="38" rx="8" ry="4" fill="#FFFFFF" opacity={0.7} transform="rotate(-15 58 38)" />
          <Circle cx="81" cy="37" r="2.5" fill="#FFFFFF" opacity={0.8} />

          {/* ── Expressive Visor Face & Eyes ── */}
          {isPerfect ? (
            /* Triumphant Happy Arcs (^   ^) + Cheerful Smile */
            <G stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none">
              <Path d="M 57 45 Q 61 41 65 45" />
              <Path d="M 75 45 Q 79 41 83 45" />
              <Path d="M 64 51 Q 70 56 76 51" strokeWidth="3" />
            </G>
          ) : isGreat ? (
            /* Joyful Star Eyes + Warm Open Smile */
            <G>
              <Circle cx="61" cy="44" r="3.2" fill="#78350F" />
              <Circle cx="79" cy="44" r="3.2" fill="#78350F" />
              <Circle cx="62" cy="43" r="1.2" fill="#FFFFFF" />
              <Circle cx="80" cy="43" r="1.2" fill="#FFFFFF" />
              <Path d="M 64 50 Q 70 55 76 50" fill="none" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
            </G>
          ) : isGood ? (
            /* Encouraging Friendly Smile */
            <G>
              <Circle cx="61" cy="44" r="3" fill="#78350F" />
              <Circle cx="79" cy="44" r="3" fill="#78350F" />
              <Circle cx="62" cy="43" r="1" fill="#FFFFFF" />
              <Circle cx="80" cy="43" r="1" fill="#FFFFFF" />
              <Path d="M 65 51 Q 70 54 75 51" fill="none" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" />
            </G>
          ) : (
            /* Reassuring Friendly Wink/Smile */
            <G stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" fill="none">
              <Path d="M 58 45 Q 61 43 64 45" />
              <Circle cx="78" cy="44" r="2.8" fill="#78350F" stroke="none" />
              <Path d="M 65 51 Q 70 54 75 51" />
            </G>
          )}

          {/* Cheerful Blushing Pink Cheeks */}
          <Circle cx="55" cy="49" r="3.5" fill="#FF4D8B" opacity={0.4} />
          <Circle cx="85" cy="49" r="3.5" fill="#FF4D8B" opacity={0.4} />

          {/* Commander Laurel Crown on Helmet Top for Perfect Run */}
          {isPerfect && (
            <G>
              <Path
                d="M 56 16 Q 70 12 84 16"
                fill="none"
                stroke={Colors.gold}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <Polygon points="54,14 58,11 60,15 56,17" fill={Colors.gold} />
              <Polygon points="86,14 82,11 80,15 84,17" fill={Colors.gold} />
              <Polygon points="70,9 72,13 75,13 72.5,15.5 73.5,19 70,17 66.5,19 67.5,15.5 65,13 68,13" fill={Colors.gold} />
            </G>
          )}
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  haloAura: {
    position: 'absolute',
    opacity: 0.85,
  },
  characterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
