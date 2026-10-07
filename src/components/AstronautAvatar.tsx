import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, ViewStyle } from 'react-native';
import Svg, {
  Circle,
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop,
  Polygon,
  Ellipse,
  G,
} from 'react-native-svg';
import { Colors } from '../theme/colors';
import { RankTier } from '../content/schema';

export interface AstronautAvatarProps {
  size?: number;
  rank?: RankTier;
  showHalo?: boolean;
  animated?: boolean;
  style?: ViewStyle;
}

/**
 * AstronautAvatar — Premium NASA-inspired vector space suit avatar.
 * Features:
 * - Contoured dual-layer composite helmet with gloss highlights & crown telemetry ridge
 * - Panoramic thermal visor tailored to Rank Tier (Azure Cadet, Apollo Gold, Nebula Specialist, Solar Commander)
 * - Pressurized space suit torso with articulated ribbed arm joints & rank epaulets
 * - Chest Display & Control Module (DCM) with digital telemetry gauges & rank crest
 * - Dual cryogenic umbilical hoses & comms earpiece with microphone boom
 * - 100% native UI-thread zero-G floating physics & pulsating telemetry beacon
 */
export const AstronautAvatar: React.FC<AstronautAvatarProps> = ({
  size = 56,
  rank = 'Cadet',
  showHalo = true,
  animated = true,
  style,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animated) return;

    const floating = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -3,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 3,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const pulsing = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    floating.start();
    pulsing.start();

    return () => {
      floating.stop();
      pulsing.stop();
    };
  }, [animated]);

  const getSuitTheme = (tier: RankTier) => {
    switch (tier) {
      case 'Commander':
        return {
          haloColor: Colors.gold,
          haloGlow: '#FDE047',
          visorGrad1: '#FEF08A',
          visorGrad2: '#F59E0B',
          visorGrad3: '#B45309',
          visorBorder: '#FCD34D',
          shoulderColor: '#D97706',
          shoulderTrim: '#FDE68A',
          dcmColor: '#1E1B4B',
          beaconColor: '#F59E0B',
          ledColor: '#34D399',
          insignia: 'commander',
        };
      case 'Mission Specialist':
        return {
          haloColor: Colors.purple,
          haloGlow: '#C084FC',
          visorGrad1: '#F3E8FF',
          visorGrad2: '#A855F7',
          visorGrad3: '#6B21A8',
          visorBorder: '#C084FC',
          shoulderColor: '#6D28D9',
          shoulderTrim: '#DDD6FE',
          dcmColor: '#1E1B4B',
          beaconColor: '#A855F7',
          ledColor: '#38BDF8',
          insignia: 'specialist',
        };
      case 'Astronaut':
        return {
          haloColor: Colors.emerald,
          haloGlow: '#6EE7B7',
          visorGrad1: '#FEF08A',
          visorGrad2: '#F59E0B',
          visorGrad3: '#D97706',
          visorBorder: '#FDE047',
          shoulderColor: '#059669',
          shoulderTrim: '#A7F3D0',
          dcmColor: '#064E3B',
          beaconColor: '#10B981',
          ledColor: '#34D399',
          insignia: 'astronaut',
        };
      case 'Cadet':
      default:
        return {
          haloColor: Colors.cyan,
          haloGlow: '#67E8F9',
          visorGrad1: '#BAE6FD',
          visorGrad2: '#0284C7',
          visorGrad3: '#0369A1',
          visorBorder: '#38BDF8',
          shoulderColor: '#2563EB',
          shoulderTrim: '#BFDBFE',
          dcmColor: '#1E293B',
          beaconColor: '#06B6D4',
          ledColor: '#34D399',
          insignia: 'cadet',
        };
    }
  };

  const theme = getSuitTheme(rank);

  return (
    <Animated.View
      style={[
        styles.container,
        { width: size, height: size },
        animated && { transform: [{ translateY: floatAnim }] },
        style,
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          {/* Dynamic Rank Visor Gradient */}
          <LinearGradient id={`rankVisorGrad_${rank}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={theme.visorGrad1} />
            <Stop offset="45%" stopColor={theme.visorGrad2} />
            <Stop offset="100%" stopColor={theme.visorGrad3} />
          </LinearGradient>

          {/* Composite Helmet Shading */}
          <LinearGradient id="helmetCompositeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="65%" stopColor="#F1F5F9" />
            <Stop offset="100%" stopColor="#CBD5E1" />
          </LinearGradient>

          {/* Pressurized Suit Fabric */}
          <LinearGradient id="suitFabricGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="55%" stopColor="#E2E8F0" />
            <Stop offset="100%" stopColor="#94A3B8" />
          </LinearGradient>

          {/* Shoulder Epaulet Gradient */}
          <LinearGradient id={`epauletGrad_${rank}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={theme.shoulderTrim} />
            <Stop offset="100%" stopColor={theme.shoulderColor} />
          </LinearGradient>

          {/* Titanium Neck Ring */}
          <LinearGradient id="neckRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#CBD5E1" />
            <Stop offset="50%" stopColor="#94A3B8" />
            <Stop offset="100%" stopColor="#64748B" />
          </LinearGradient>

          {/* Chest DCM Module Gradient */}
          <LinearGradient id="dcmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#1E293B" />
            <Stop offset="100%" stopColor="#0B132B" />
          </LinearGradient>
        </Defs>

        {/* ── 1. Orbital Ring & Cosmic Halo ── */}
        {showHalo && (
          <G>
            {/* Outer Soft Halo Glow */}
            <Circle
              cx="60"
              cy="56"
              r="53"
              stroke={theme.haloGlow}
              strokeWidth="2"
              strokeDasharray={rank === 'Commander' ? '0' : '6 3'}
              fill="none"
              opacity={0.55}
            />

            {/* Dynamic Tilted Celestial Orbit */}
            <Ellipse
              cx="60"
              cy="56"
              rx="52"
              ry="22"
              stroke={theme.haloColor}
              strokeWidth="2.5"
              fill="none"
              opacity={0.8}
              transform="rotate(-12 60 56)"
            />

            {/* Orbiting Stardust Particles */}
            <Circle cx="16" cy="42" r="2.5" fill={theme.haloGlow} opacity={0.9} />
            <Circle cx="106" cy="68" r="2" fill={theme.haloGlow} opacity={0.85} />
            <Circle cx="88" cy="22" r="1.5" fill="#FFFFFF" opacity={0.9} />
            <Circle cx="32" cy="74" r="1.5" fill={theme.haloColor} opacity={0.7} />
          </G>
        )}

        {/* ── 2. Pressurized Spacesuit Torso & Hardware ── */}
        {/* Life Support Backpack (PLSS) visible behind shoulders */}
        <Rect
          x="30"
          y="78"
          width="60"
          height="36"
          rx="8"
          fill="#475569"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Contoured Pressurized Shoulder Shell */}
        <Path
          d="M 18 116 C 18 96 34 84 60 84 C 86 84 102 96 102 116 Z"
          fill="url(#suitFabricGrad)"
          stroke="#94A3B8"
          strokeWidth="2"
        />

        {/* Articulated Shoulder Sleeve Accordion Ribs (Left & Right) */}
        <Path d="M 21 103 C 25 100 31 101 33 105" stroke="#CBD5E1" strokeWidth="2" fill="none" strokeLinecap="round" />
        <Path d="M 20 110 C 24 107 30 108 32 112" stroke="#CBD5E1" strokeWidth="2" fill="none" strokeLinecap="round" />
        <Path d="M 99 103 C 95 100 89 101 87 105" stroke="#CBD5E1" strokeWidth="2" fill="none" strokeLinecap="round" />
        <Path d="M 100 110 C 96 107 90 108 88 112" stroke="#CBD5E1" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Rank Epaulet Straps */}
        <Rect
          x="24"
          y="88"
          width="13"
          height="19"
          rx="4"
          fill={`url(#epauletGrad_${rank})`}
          transform="rotate(10 24 88)"
        />
        <Rect
          x="83"
          y="88"
          width="13"
          height="19"
          rx="4"
          fill={`url(#epauletGrad_${rank})`}
          transform="rotate(-10 83 88)"
        />

        {/* Dual Cryogenic Umbilical Hoses */}
        <Path
          d="M 42 105 C 33 105 27 111 25 116"
          stroke="#0284C7"
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 78 105 C 87 105 93 111 95 116"
          stroke="#38BDF8"
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Chest Display and Control Module (DCM) */}
        <Rect
          x="41"
          y="91"
          width="38"
          height="25"
          rx="5"
          fill="url(#dcmGrad)"
          stroke="#475569"
          strokeWidth="1.5"
        />

        {/* Telemetry Display Screen Bar */}
        <Rect x="45" y="95" width="30" height="7" rx="2" fill="#0B132B" />
        {/* Digital Telemetry Readout Gauges */}
        <Rect x="47" y="97" width="8" height="3" rx="1" fill="#10B981" />
        <Rect x="57" y="97" width="6" height="3" rx="1" fill="#06B6D4" />
        <Rect x="65" y="97" width="8" height="3" rx="1" fill={theme.haloColor} />

        {/* Status Indicator LEDs */}
        <Circle cx="48" cy="108" r="2" fill={theme.ledColor} />
        <Circle cx="55" cy="108" r="2" fill="#F59E0B" />

        {/* Chest Rank Crest / Insignia */}
        {theme.insignia === 'commander' && (
          <G>
            <Circle cx="70" cy="108" r="3.2" fill={Colors.gold} />
            <Path d="M 64 112 C 66 106 74 106 76 112" stroke={Colors.gold} strokeWidth="1.2" fill="none" />
          </G>
        )}
        {theme.insignia === 'astronaut' && (
          <Polygon
            points="70,104 71.5,107.5 75,107.5 72,109.5 73.2,113 70,111 66.8,113 68,109.5 65,107.5 68.5,107.5"
            fill={Colors.gold}
          />
        )}
        {theme.insignia === 'specialist' && (
          <G>
            <Circle cx="70" cy="108" r="3.5" fill={theme.haloColor} />
            <Ellipse cx="70" cy="108" rx="6" ry="2" stroke="#FFFFFF" strokeWidth="1" fill="none" transform="rotate(-20 70 108)" />
          </G>
        )}
        {theme.insignia === 'cadet' && (
          <Path
            d="M 64 105 L 70 108 L 76 105 M 64 109 L 70 112 L 76 109"
            stroke={theme.haloColor}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* ── 3. Titanium Neck Ring Collar ── */}
        <Rect
          x="36"
          y="74"
          width="48"
          height="11"
          rx="5"
          fill="url(#neckRingGrad)"
          stroke="#64748B"
          strokeWidth="1.5"
        />
        {/* Collar Latch Lock Fasteners */}
        <Circle cx="44" cy="79.5" r="2" fill="#E2E8F0" stroke="#475569" strokeWidth="0.8" />
        <Circle cx="60" cy="79.5" r="2" fill="#E2E8F0" stroke="#475569" strokeWidth="0.8" />
        <Circle cx="76" cy="79.5" r="2" fill="#E2E8F0" stroke="#475569" strokeWidth="0.8" />

        {/* ── 4. Aerodynamic Composite Helmet Shell ── */}
        <Circle
          cx="60"
          cy="48"
          r="33"
          fill="url(#helmetCompositeGrad)"
          stroke="#CBD5E1"
          strokeWidth="2.5"
        />

        {/* Specular Dome Rim Light */}
        <Path
          d="M 37 32 C 43 23 54 18 67 18"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
          opacity={0.85}
        />

        {/* Helmet Top Crown Aerodynamic Ridge */}
        <Path
          d="M 55 16 C 58 14 62 14 65 16 L 64 22 C 62 21 58 21 56 22 Z"
          fill="#94A3B8"
        />

        {/* Top Telemetry Beacon Antenna */}
        <Rect x="57" y="11" width="6" height="4" rx="1.5" fill="#64748B" />
        <Rect x="58.5" y="5" width="3" height="6" rx="1.5" fill="#94A3B8" />
        <Circle cx="60" cy="4.5" r="3" fill={theme.beaconColor} />
        <Circle cx="60" cy="4.5" r="5" stroke={theme.beaconColor} strokeWidth="1" fill="none" opacity={0.6} />

        {/* Comms Ear Pods (Left & Right) */}
        <Rect x="23" y="41" width="7" height="16" rx="3.5" fill="#64748B" stroke="#475569" strokeWidth="1" />
        <Rect x="90" y="41" width="7" height="16" rx="3.5" fill="#64748B" stroke="#475569" strokeWidth="1" />
        {/* Right Pod Telemetry Active LED */}
        <Circle cx="93.5" cy="45" r="1.5" fill={theme.ledColor} />

        {/* Flexible Comms Boom Microphone */}
        <Path
          d="M 92 51 C 88 60 80 64 74 64"
          stroke="#475569"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx="73" cy="64" r="2.2" fill="#1E293B" stroke="#64748B" strokeWidth="0.8" />

        {/* ── 5. Panoramic Thermal Sun Visor ── */}
        <Rect
          x="31"
          y="30"
          width="58"
          height="37"
          rx="16"
          fill={`url(#rankVisorGrad_${rank})`}
          stroke={theme.visorBorder}
          strokeWidth="2.5"
        />

        {/* Inner Visor Shadow (Glass Depth) */}
        <Path
          d="M 33 34 C 42 31 78 31 87 34 C 84 39 36 39 33 34 Z"
          fill="#000000"
          opacity={0.25}
        />

        {/* Sweeping Panoramic Glass Reflection Arc */}
        <Path
          d="M 37 38 C 48 33 72 33 83 38 C 79 44 41 44 37 38 Z"
          fill="#FFFFFF"
          opacity={0.75}
        />

        {/* Starlight Glints on Visor Dome */}
        <Circle cx="77" cy="42" r="2.2" fill="#FFFFFF" opacity={0.9} />
        <Circle cx="81" cy="46" r="1.3" fill="#FFFFFF" opacity={0.7} />

        {/* Lower Visor Horizon Reflection */}
        <Path
          d="M 37 57 C 46 61 74 61 83 57 C 80 63 40 63 37 57 Z"
          fill="#FFFFFF"
          opacity={0.15}
        />

        {/* ── 6. Commander Golden Stars / Celestial Laurel Crown ── */}
        {rank === 'Commander' && (
          <G>
            <Polygon
              points="60,1 62.5,5.5 68,5.5 63.5,9 65,14 60,11 55,14 56.5,9 52,5.5 57.5,5.5"
              fill={Colors.gold}
            />
            <Polygon
              points="45,5 46.5,8 50,8 47.2,10 48.2,13 45,11.5 41.8,13 42.8,10 40,8 43.5,8"
              fill={Colors.gold}
              opacity={0.9}
            />
            <Polygon
              points="75,5 76.5,8 80,8 77.2,10 78.2,13 75,11.5 71.8,13 72.8,10 70,8 73.5,8"
              fill={Colors.gold}
              opacity={0.9}
            />
          </G>
        )}
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
