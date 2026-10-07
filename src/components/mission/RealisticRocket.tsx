import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Path,
  Rect,
  Circle,
  Ellipse,
  Polygon,
  G,
  Line,
} from 'react-native-svg';

export interface RealisticRocketProps {
  /** Vertical flight animation offset */
  translateY?: any;
  /** Horizontal shake animation offset (for turbulence, high-G, or crash) */
  translateX?: any;
  /** Whether the thrusters are in supercharged boost mode */
  isBoosting?: boolean;
  /** Whether Solid Rocket Boosters (SRBs) are attached */
  hasSRBs?: boolean;
  /** Whether SRBs are in the separation phase (drifting away) */
  hasSRBSeparation?: boolean;
  /** Left SRB X displacement for separation animation */
  srbLeftX?: any;
  /** Right SRB X displacement for separation animation */
  srbRightX?: any;
  /** Opacity for separating SRBs */
  srbOpacity?: any;
  /** Supersonic Prandtl-Glauert condensation vapor cone at Mach 1 */
  hasShockCone?: boolean;
  /** Dramatic ballooning vacuum exhaust plume in space */
  hasVacuumPlume?: boolean;
  /** Overall scale multiplier (default 1) */
  scale?: number;
}

/**
 * Agency-grade, highly realistic NASA SLS / Saturn V inspired Moon Rocket.
 * Designed with authentic aerospace proportions, 3D cylindrical lighting,
 * NASA black-and-white optical roll tracking patterns, clustered RS-25 engine bells,
 * supersonic shock diamonds, and multi-stage Solid Rocket Boosters.
 */
export const RealisticRocket: React.FC<RealisticRocketProps> = ({
  translateY = new Animated.Value(0),
  translateX = new Animated.Value(0),
  isBoosting = false,
  hasSRBs = false,
  hasSRBSeparation = false,
  srbLeftX = new Animated.Value(0),
  srbRightX = new Animated.Value(0),
  srbOpacity = 1,
  hasShockCone = false,
  hasVacuumPlume = false,
  scale = 1,
}) => {
  const showSRBs = hasSRBs || hasSRBSeparation;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY },
            { translateX },
            { scale },
          ],
        },
      ]}
    >
      {/* ── Supersonic Mach 1 Prandtl-Glauert Condensation Vapor Cone ── */}
      {hasShockCone && (
        <View style={styles.shockwaveOverlay}>
          <Svg width={180} height={70} viewBox="0 0 180 70">
            <Defs>
              <LinearGradient id="vaporConeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.75} />
                <Stop offset="50%" stopColor="#E0F2FE" stopOpacity={0.45} />
                <Stop offset="100%" stopColor="#BAE6FD" stopOpacity={0.0} />
              </LinearGradient>
            </Defs>
            {/* Parabolic vapor shockwave */}
            <Path
              d="M 90 4 Q 45 28 8 62 L 172 62 Q 135 28 90 4 Z"
              fill="url(#vaporConeGrad)"
            />
            {/* Condensation rim ring */}
            <Ellipse cx={90} cy={62} rx={82} ry={6} fill="#FFFFFF" opacity={0.6} />
            <Ellipse cx={90} cy={62} rx={74} ry={4} fill="#38BDF8" opacity={0.4} />
          </Svg>
        </View>
      )}

      {/* ── Main Rocket Vehicle Assembly ── */}
      <View style={styles.assemblyRow}>
        {/* Left Solid Rocket Booster (SRB) */}
        {showSRBs && (
          <Animated.View
            style={[
              styles.srbContainer,
              {
                transform: [
                  { translateX: srbLeftX as any },
                  { rotate: hasSRBSeparation ? '-6deg' : '0deg' },
                ],
                opacity: hasSRBSeparation ? (srbOpacity as any) : 1,
              },
            ]}
          >
            <Svg width={30} height={180} viewBox="0 0 30 180">
              <Defs>
                <LinearGradient id="srbMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#E2E8F0" />
                  <Stop offset="30%" stopColor="#FFFFFF" />
                  <Stop offset="70%" stopColor="#F8FAFC" />
                  <Stop offset="100%" stopColor="#94A3B8" />
                </LinearGradient>
                <LinearGradient id="srbFire" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#FFFFFF" />
                  <Stop offset="25%" stopColor="#FEF08A" />
                  <Stop offset="65%" stopColor="#F97316" />
                  <Stop offset="100%" stopColor="rgba(234, 88, 12, 0)" />
                </LinearGradient>
              </Defs>

              {/* SRB Forward Separation Thruster & Aerodynamic Nose Cone */}
              <Path d="M 15 2 Q 8 20 6 34 L 24 34 Q 22 20 15 2 Z" fill="url(#srbMetal)" stroke="#64748B" strokeWidth={1} />
              <Circle cx={15} cy={16} r={2} fill="#0F172A" />

              {/* Cylindrical Solid Propellant Casing (4 segments) */}
              <Rect x={6} y={34} width={18} height={100} fill="url(#srbMetal)" stroke="#64748B" strokeWidth={1} />
              
              {/* Segment joints & safety markings */}
              <Line x1={6} y1={58} x2={24} y2={58} stroke="#475569" strokeWidth={1.5} />
              <Line x1={6} y1={82} x2={24} y2={82} stroke="#475569" strokeWidth={1.5} />
              <Line x1={6} y1={106} x2={24} y2={106} stroke="#475569" strokeWidth={1.5} />
              {/* NASA Hazard band */}
              <Rect x={6} y={42} width={18} height={4} fill="#EF4444" />
              <Rect x={6} y={120} width={18} height={4} fill="#2563EB" />

              {/* Aft Flared Skirt & TVC Nozzle */}
              <Path d="M 6 134 L 3 148 L 27 148 L 24 134 Z" fill="#334155" stroke="#1E293B" strokeWidth={1} />
              <Rect x={9} y={148} width={12} height={8} fill="#1E293B" rx={1} />

              {/* Solid Booster Exhaust Plume */}
              {!hasSRBSeparation && (
                <G transform="translate(0, 156)">
                  <Path d="M 7 0 Q 15 48 23 0 Q 15 12 7 0 Z" fill="url(#srbFire)" />
                  <Ellipse cx={15} cy={8} rx={4} ry={2} fill="#FFFFFF" opacity={0.9} />
                </G>
              )}
            </Svg>
          </Animated.View>
        )}

        {/* ── Core Moon Rocket (SLS / Saturn V Architecture) ── */}
        <View style={styles.coreRocketWrapper}>
          <Svg width={90} height={240} viewBox="0 0 90 240">
            <Defs>
              {/* Core Body Cylindrical 3D Metallic Gradient */}
              <LinearGradient id="coreCylinder" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#CBD5E1" />
                <Stop offset="25%" stopColor="#FFFFFF" />
                <Stop offset="65%" stopColor="#F8FAFC" />
                <Stop offset="90%" stopColor="#E2E8F0" />
                <Stop offset="100%" stopColor="#94A3B8" />
              </LinearGradient>

              {/* Dark Titanium Alloy Gradient for interstage and engines */}
              <LinearGradient id="titaniumMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#1E293B" />
                <Stop offset="30%" stopColor="#475569" />
                <Stop offset="70%" stopColor="#334155" />
                <Stop offset="100%" stopColor="#0F172A" />
              </LinearGradient>

              {/* Gold Polyimide Thermal Foil for Service Module */}
              <LinearGradient id="thermalFoil" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#92400E" />
                <Stop offset="35%" stopColor="#F59E0B" />
                <Stop offset="70%" stopColor="#FBBF24" />
                <Stop offset="100%" stopColor="#78350F" />
              </LinearGradient>

              {/* Cryogenic Liquid Fuel Flame (White Core -> Cyan -> Amber -> Orange) */}
              <LinearGradient id="coreFlame" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="18%" stopColor="#38BDF8" />
                <Stop offset="45%" stopColor="#FBBF24" />
                <Stop offset="75%" stopColor="#F97316" />
                <Stop offset="100%" stopColor="rgba(220, 38, 38, 0)" />
              </LinearGradient>

              {/* Vacuum Plume Glow Gradient */}
              <RadialGradient id="vacPlume" cx="50%" cy="10%" r="90%">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.9} />
                <Stop offset="25%" stopColor="#38BDF8" stopOpacity={0.7} />
                <Stop offset="60%" stopColor="#F97316" stopOpacity={0.4} />
                <Stop offset="100%" stopColor="#451A03" stopOpacity={0.0} />
              </RadialGradient>
            </Defs>

            {/* 1. Launch Abort System (LAS) Spire Tower */}
            <Line x1={45} y1={2} x2={45} y2={18} stroke="#94A3B8" strokeWidth={2.5} />
            <Circle cx={45} cy={2} r={2} fill="#E2E8F0" />
            <Path d="M 42 18 L 48 18 L 46 10 L 44 10 Z" fill="#64748B" />
            {/* LAS Jettison Nozzle ring */}
            <Ellipse cx={45} cy={18} rx={4} ry={1.5} fill="#334155" />

            {/* 2. Orion Command Module / Crew Capsule Fairing */}
            <Path
              d="M 45 18 L 31 46 Q 31 52 45 52 Q 59 52 59 46 Z"
              fill="url(#coreCylinder)"
              stroke="#64748B"
              strokeWidth={1.2}
            />
            {/* Capsule Panoramic Observation Windows */}
            <Path
              d="M 39 36 L 43 36 L 42 41 L 38 41 Z"
              fill="#0284C7"
              stroke="#38BDF8"
              strokeWidth={0.8}
            />
            <Circle cx={40} cy={38} r={0.8} fill="#FFFFFF" />
            <Path
              d="M 47 36 L 51 36 L 52 41 L 48 41 Z"
              fill="#0284C7"
              stroke="#38BDF8"
              strokeWidth={0.8}
            />
            <Circle cx={49} cy={38} r={0.8} fill="#FFFFFF" />

            {/* 3. European Service Module (Gold Foil & RCS Thruster Quads) */}
            <Rect x={31} y={52} width={28} height={20} fill="url(#thermalFoil)" stroke="#78350F" strokeWidth={1} />
            {/* Radiator and RCS details */}
            <Rect x={34} y={55} width={10} height={14} fill="#FDE68A" opacity={0.4} rx={1} />
            <Rect x={46} y={55} width={10} height={14} fill="#FDE68A" opacity={0.4} rx={1} />
            {/* RCS attitude thruster blocks on left and right */}
            <Rect x={29} y={58} width={2} height={5} fill="#1E293B" />
            <Rect x={59} y={58} width={2} height={5} fill="#1E293B" />

            {/* 4. Interstage Ring with structural vents */}
            <Rect x={31} y={72} width={28} height={12} fill="url(#titaniumMetal)" stroke="#0F172A" strokeWidth={1} />
            <Line x1={31} y1={76} x2={59} y2={76} stroke="#0F172A" strokeWidth={1} />
            <Line x1={31} y1={80} x2={59} y2={80} stroke="#0F172A" strokeWidth={1} />

            {/* 5. Core Cryogenic Fuel Tank Fuselage (LOX / LH2) */}
            <Rect x={31} y={84} width={28} height={88} fill="url(#coreCylinder)" stroke="#64748B" strokeWidth={1.2} />

            {/* Optical Roll-Tracking Patterns (Saturn V / SLS style Black & White quadrants) */}
            <Rect x={31} y={84} width={14} height={18} fill="#0F172A" />
            <Rect x={45} y={102} width={14} height={18} fill="#0F172A" />
            <Rect x={31} y={146} width={14} height={14} fill="#0F172A" />
            <Rect x={45} y={160} width={14} height={12} fill="#0F172A" />

            {/* NASA Mission Stripe & Insignia */}
            <Rect x={31} y={124} width={28} height={5} fill="#2563EB" />
            <Rect x={31} y={129} width={28} height={3} fill="#EF4444" />
            {/* Agency emblem dot */}
            <Circle cx={45} cy={138} r={3} fill="#1D4ED8" />
            <Circle cx={44} cy={137} r={1} fill="#FFFFFF" />

            {/* Vertical Systems Tunnel / Aerodynamic Cable Raceways */}
            <Rect x={33} y={84} width={2} height={88} fill="#94A3B8" opacity={0.6} />
            <Rect x={55} y={84} width={2} height={88} fill="#94A3B8" opacity={0.6} />

            {/* 6. Aerodynamic Delta Stabilizer Fins */}
            {/* Left fin */}
            <Path d="M 31 154 L 20 178 L 31 174 Z" fill="url(#titaniumMetal)" stroke="#1E293B" strokeWidth={1} />
            {/* Right fin */}
            <Path d="M 59 154 L 70 178 L 59 174 Z" fill="url(#titaniumMetal)" stroke="#1E293B" strokeWidth={1} />

            {/* 7. Core Boattail Engine Deck & 4x RS-25 Rocket Nozzles */}
            <Path d="M 31 172 L 34 180 L 56 180 L 59 172 Z" fill="#334155" stroke="#1E293B" strokeWidth={1} />
            {/* Clustered Rocket Bells */}
            <Path d="M 35 180 L 33 190 L 41 190 L 39 180 Z" fill="#1E293B" stroke="#0F172A" strokeWidth={0.8} />
            <Path d="M 43 180 L 41 192 L 49 192 L 47 180 Z" fill="#0F172A" stroke="#000000" strokeWidth={0.8} />
            <Path d="M 51 180 L 49 190 L 57 190 L 55 180 Z" fill="#1E293B" stroke="#0F172A" strokeWidth={0.8} />

            {/* 8. Active Cryogenic Engine Thrust Plume */}
            <G transform="translate(0, 190)">
              {/* Dramatic Vacuum Plume Expansion in Space */}
              {hasVacuumPlume && (
                <Path
                  d="M 32 0 Q 45 75 58 0 Q 78 45 86 85 Q 45 105 4 85 Q 12 45 32 0 Z"
                  fill="url(#vacPlume)"
                />
              )}

              {/* Core Supersonic Plume */}
              {isBoosting ? (
                <Path
                  d="M 34 0 Q 45 68 56 0 Q 45 16 34 0 Z"
                  fill="url(#coreFlame)"
                />
              ) : (
                <Path
                  d="M 36 0 Q 45 50 54 0 Q 45 12 36 0 Z"
                  fill="url(#coreFlame)"
                />
              )}

              {/* Supersonic Mach Shock Diamonds (Compression Waves) */}
              <Polygon points="43,10 45,6 47,10 45,14" fill="#FFFFFF" opacity={0.95} />
              <Polygon points="44,22 45,18 46,22 45,26" fill="#E0F2FE" opacity={0.85} />
              <Polygon points="44.2,34 45,30 45.8,34 45,38" fill="#FACC15" opacity={0.7} />
            </G>
          </Svg>
        </View>

        {/* Right Solid Rocket Booster (SRB) */}
        {showSRBs && (
          <Animated.View
            style={[
              styles.srbContainer,
              {
                transform: [
                  { translateX: srbRightX as any },
                  { rotate: hasSRBSeparation ? '6deg' : '0deg' },
                ],
                opacity: hasSRBSeparation ? (srbOpacity as any) : 1,
              },
            ]}
          >
            <Svg width={30} height={180} viewBox="0 0 30 180">
              <Defs>
                <LinearGradient id="srbMetalR" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#94A3B8" />
                  <Stop offset="30%" stopColor="#F8FAFC" />
                  <Stop offset="70%" stopColor="#FFFFFF" />
                  <Stop offset="100%" stopColor="#CBD5E1" />
                </LinearGradient>
                <LinearGradient id="srbFireR" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#FFFFFF" />
                  <Stop offset="25%" stopColor="#FEF08A" />
                  <Stop offset="65%" stopColor="#F97316" />
                  <Stop offset="100%" stopColor="rgba(234, 88, 12, 0)" />
                </LinearGradient>
              </Defs>

              {/* SRB Forward Separation Thruster & Aerodynamic Nose Cone */}
              <Path d="M 15 2 Q 8 20 6 34 L 24 34 Q 22 20 15 2 Z" fill="url(#srbMetalR)" stroke="#64748B" strokeWidth={1} />
              <Circle cx={15} cy={16} r={2} fill="#0F172A" />

              {/* Cylindrical Solid Propellant Casing (4 segments) */}
              <Rect x={6} y={34} width={18} height={100} fill="url(#srbMetalR)" stroke="#64748B" strokeWidth={1} />
              
              {/* Segment joints & safety markings */}
              <Line x1={6} y1={58} x2={24} y2={58} stroke="#475569" strokeWidth={1.5} />
              <Line x1={6} y1={82} x2={24} y2={82} stroke="#475569" strokeWidth={1.5} />
              <Line x1={6} y1={106} x2={24} y2={106} stroke="#475569" strokeWidth={1.5} />
              {/* NASA Hazard band */}
              <Rect x={6} y={42} width={18} height={4} fill="#EF4444" />
              <Rect x={6} y={120} width={18} height={4} fill="#2563EB" />

              {/* Aft Flared Skirt & TVC Nozzle */}
              <Path d="M 6 134 L 3 148 L 27 148 L 24 134 Z" fill="#334155" stroke="#1E293B" strokeWidth={1} />
              <Rect x={9} y={148} width={12} height={8} fill="#1E293B" rx={1} />

              {/* Solid Booster Exhaust Plume */}
              {!hasSRBSeparation && (
                <G transform="translate(0, 156)">
                  <Path d="M 7 0 Q 15 48 23 0 Q 15 12 7 0 Z" fill="url(#srbFireR)" />
                  <Ellipse cx={15} cy={8} rx={4} ry={2} fill="#FFFFFF" opacity={0.9} />
                </G>
              )}
            </Svg>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shockwaveOverlay: {
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    zIndex: 22,
  },
  assemblyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  srbContainer: {
    marginHorizontal: -8,
    marginTop: 34,
    zIndex: 15,
  },
  coreRocketWrapper: {
    zIndex: 20,
    alignItems: 'center',
  },
});
