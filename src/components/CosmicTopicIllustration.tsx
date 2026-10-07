import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Path,
  Rect,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
  Line,
  Polygon,
} from 'react-native-svg';
import { CosmicTopic, detectCosmicTopic } from '../utils/cosmicTopics';

export { CosmicTopic, detectCosmicTopic };

interface CosmicTopicIllustrationProps {
  topic?: CosmicTopic;
  textToDetect?: string;
  size?: number;
}

/**
 * CosmicTopicIllustration
 * Offline-first, pure SVG vector illustration that matches lessons and quiz topics.
 */
export const CosmicTopicIllustration: React.FC<CosmicTopicIllustrationProps> = ({
  topic,
  textToDetect,
  size = 72,
}) => {
  const resolvedTopic: CosmicTopic = topic || detectCosmicTopic(textToDetect, 'moon');
  const instanceId = React.useId().replace(/:/g, '_');
  const uid = `cti-${resolvedTopic}-${instanceId}`;

  const renderGraphic = () => {
    switch (resolvedTopic) {
      case 'blackhole':
        return (
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id={`${uid}-disk`} cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor="#000000" />
                <Stop offset="35%" stopColor="#000000" />
                <Stop offset="45%" stopColor="#FF6B00" />
                <Stop offset="65%" stopColor="#FFC837" />
                <Stop offset="85%" stopColor="#FF8008" stopOpacity="0.4" />
                <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </RadialGradient>
              <LinearGradient id={`${uid}-beam`} x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#8A2387" />
                <Stop offset="50%" stopColor="#E94057" />
                <Stop offset="100%" stopColor="#F27121" />
              </LinearGradient>
            </Defs>
            {/* Accretion Disk Swirl */}
            <Circle cx="50" cy="50" r="48" fill={`url(#${uid}-disk)`} />
            <Ellipse
              cx="50"
              cy="50"
              rx="46"
              ry="18"
              fill="none"
              stroke="#FFB300"
              strokeWidth="4"
              opacity={0.85}
              transform="rotate(-25 50 50)"
            />
            <Ellipse
              cx="50"
              cy="50"
              rx="42"
              ry="14"
              fill="none"
              stroke="#FFF275"
              strokeWidth="2.5"
              opacity={0.9}
              transform="rotate(-25 50 50)"
            />
            {/* Gravitational Lensing Arc */}
            <Path
              d="M 18 36 Q 50 8 82 36"
              fill="none"
              stroke="#FFA000"
              strokeWidth="4"
              opacity={0.8}
            />
            <Path
              d="M 22 64 Q 50 92 78 64"
              fill="none"
              stroke="#FF6F00"
              strokeWidth="3.5"
              opacity={0.7}
            />
            {/* Event Horizon (Pure Black Void Center) */}
            <Circle cx="50" cy="50" r="20" fill="#000000" stroke="#FFE082" strokeWidth="1.5" />
            <Circle cx="50" cy="50" r="19" fill="#000000" />
            {/* Photon Ring */}
            <Circle cx="50" cy="50" r="21" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity={0.75} />
          </Svg>
        );

      case 'iss':
        return (
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id={`${uid}-earth`} cx="40%" cy="40%" rx="60%" ry="60%">
                <Stop offset="0%" stopColor="#38BDF8" />
                <Stop offset="50%" stopColor="#0284C7" />
                <Stop offset="100%" stopColor="#0B132B" />
              </RadialGradient>
            </Defs>
            {/* Curved Earth Limb */}
            <Circle cx="50" cy="105" r="70" fill={`url(#${uid}-earth)`} />
            <Path d="M 15 62 Q 35 52 50 58 Q 65 64 85 55" stroke="#FFFFFF" strokeWidth="3" opacity={0.4} fill="none" />
            <Path d="M 25 72 Q 45 68 60 74 Q 75 78 85 70" stroke="#22C55E" strokeWidth="6" opacity={0.7} fill="none" />
            {/* ISS Truss */}
            <Line x1="18" y1="36" x2="82" y2="36" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
            {/* Solar Arrays Left */}
            <Rect x="16" y="22" width="14" height="28" rx="2" fill="#1E40AF" stroke="#60A5FA" strokeWidth="1" />
            <Line x1="23" y1="22" x2="23" y2="50" stroke="#93C5FD" strokeWidth="0.8" />
            {/* Solar Arrays Right */}
            <Rect x="70" y="22" width="14" height="28" rx="2" fill="#1E40AF" stroke="#60A5FA" strokeWidth="1" />
            <Line x1="77" y1="22" x2="77" y2="50" stroke="#93C5FD" strokeWidth="0.8" />
            {/* Pressurized Modules Center */}
            <Rect x="42" y="30" width="16" height="13" rx="3" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
            <Rect x="46" y="24" width="8" height="25" rx="2" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.8" />
            <Circle cx="50" cy="36.5" r="2.5" fill="#0284C7" />
            {/* Cupola Window Glow */}
            <Circle cx="50" cy="46" r="2" fill="#38BDF8" />
          </Svg>
        );

      case 'rocket':
        return (
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Defs>
              <LinearGradient id={`${uid}-flame`} x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="25%" stopColor="#FDE047" />
                <Stop offset="70%" stopColor="#EA580C" />
                <Stop offset="100%" stopColor="transparent" />
              </LinearGradient>
              <LinearGradient id={`${uid}-body`} x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="50%" stopColor="#F1F5F9" />
                <Stop offset="100%" stopColor="#CBD5E1" />
              </LinearGradient>
            </Defs>
            {/* Deep Space Background Circle */}
            <Circle cx="50" cy="50" r="46" fill="#0B132B" />
            <Circle cx="25" cy="25" r="1.5" fill="#FFFFFF" opacity={0.7} />
            <Circle cx="78" cy="28" r="1" fill="#FFFFFF" opacity={0.6} />
            <Circle cx="75" cy="72" r="1.2" fill="#FFFFFF" opacity={0.7} />
            <Circle cx="22" cy="70" r="1" fill="#FFFFFF" opacity={0.5} />
            {/* Fiery Exhaust Plume */}
            <Path d="M 42 66 Q 50 96 58 66 Z" fill={`url(#${uid}-flame)`} />
            <Path d="M 45 66 Q 50 84 55 66 Z" fill="#FFFFFF" opacity={0.9} />
            {/* Left Fin */}
            <Path d="M 38 52 L 30 64 L 38 64 Z" fill="#EF4444" />
            {/* Right Fin */}
            <Path d="M 62 52 L 70 64 L 62 64 Z" fill="#EF4444" />
            {/* Rocket Fuselage */}
            <Rect x="38" y="28" width="24" height="36" rx="4" fill={`url(#${uid}-body)`} />
            {/* Nose Cone */}
            <Path d="M 50 12 L 38 28 L 62 28 Z" fill="#EF4444" />
            {/* Porthole Window */}
            <Circle cx="50" cy="38" r="6" fill="#0284C7" stroke="#E2E8F0" strokeWidth="1.5" />
            <Circle cx="48" cy="36" r="2" fill="#FFFFFF" opacity={0.8} />
            {/* Body Stripes */}
            <Rect x="38" y="48" width="24" height="3" fill="#3B82F6" />
          </Svg>
        );

      case 'spacesuit':
        return (
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Defs>
              <LinearGradient id={`${uid}-visor`} x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFF275" />
                <Stop offset="60%" stopColor="#F59E0B" />
                <Stop offset="100%" stopColor="#B45309" />
              </LinearGradient>
              <LinearGradient id={`${uid}-helmet`} x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="70%" stopColor="#E2E8F0" />
                <Stop offset="100%" stopColor="#94A3B8" />
              </LinearGradient>
            </Defs>
            {/* Cosmos Badge Backdrop */}
            <Circle cx="50" cy="50" r="46" fill="#0C132E" />
            {/* Suit Shoulders & Neck Ring */}
            <Path d="M 24 82 Q 50 72 76 82 L 80 92 L 20 92 Z" fill="#CBD5E1" />
            <Rect x="32" y="66" width="36" height="8" rx="4" fill="#94A3B8" />
            {/* Astronaut Helmet Sphere */}
            <Circle cx="50" cy="46" r="29" fill={`url(#${uid}-helmet)`} stroke="#CBD5E1" strokeWidth="2" />
            {/* Thermal Visor Shield (Reflective Gold) */}
            <Ellipse cx="50" cy="46" rx="20" ry="15" fill={`url(#${uid}-visor)`} stroke="#D97706" strokeWidth="1.5" />
            {/* Visor Glare Glint */}
            <Path d="M 38 38 Q 50 34 58 40" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity={0.75} fill="none" />
            {/* Helmet Comms Earpieces */}
            <Rect x="18" y="43" width="5" height="10" rx="2.5" fill="#64748B" />
            <Rect x="77" y="43" width="5" height="10" rx="2.5" fill="#64748B" />
          </Svg>
        );

      case 'jwst':
        return (
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Defs>
              <LinearGradient id={`${uid}-goldHex`} x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FFE082" />
                <Stop offset="50%" stopColor="#FFB300" />
                <Stop offset="100%" stopColor="#FF8F00" />
              </LinearGradient>
            </Defs>
            {/* Deep Space Canvas */}
            <Circle cx="50" cy="50" r="46" fill="#070A1E" />
            {/* Hexagonal Gold Mirror Array (JWST Primary Mirror) */}
            <G transform="translate(18, 16) scale(0.64)">
              {/* Central Core Mirror & Neighbor Hexagons */}
              <Polygon points="50,15 63,22 63,38 50,45 37,38 37,22" fill={`url(#${uid}-goldHex)`} stroke="#FF6F00" strokeWidth="1" />
              <Polygon points="50,45 63,52 63,68 50,75 37,68 37,52" fill={`url(#${uid}-goldHex)`} stroke="#FF6F00" strokeWidth="1" />
              <Polygon points="50,75 63,82 63,98 50,105 37,98 37,82" fill={`url(#${uid}-goldHex)`} stroke="#FF6F00" strokeWidth="1" />
              <Polygon points="24,30 37,37 37,53 24,60 11,53 11,37" fill={`url(#${uid}-goldHex)`} stroke="#FF6F00" strokeWidth="1" />
              <Polygon points="24,60 37,67 37,83 24,90 11,83 11,67" fill={`url(#${uid}-goldHex)`} stroke="#FF6F00" strokeWidth="1" />
              <Polygon points="76,30 89,37 89,53 76,60 63,53 63,37" fill={`url(#${uid}-goldHex)`} stroke="#FF6F00" strokeWidth="1" />
              <Polygon points="76,60 89,67 89,83 76,90 63,83 63,67" fill={`url(#${uid}-goldHex)`} stroke="#FF6F00" strokeWidth="1" />
            </G>
            {/* Secondary Mirror Support Struts */}
            <Line x1="30" y1="36" x2="50" y2="48" stroke="#94A3B8" strokeWidth="1.5" />
            <Line x1="70" y1="36" x2="50" y2="48" stroke="#94A3B8" strokeWidth="1.5" />
            <Line x1="50" y1="72" x2="50" y2="48" stroke="#94A3B8" strokeWidth="1.5" />
            <Circle cx="50" cy="48" r="4.5" fill="#64748B" stroke="#CBD5E1" strokeWidth="1" />
            {/* Sunshield Layers Below */}
            <Path d="M 12 80 L 50 72 L 88 80 L 50 88 Z" fill="#E2E8F0" opacity={0.8} />
          </Svg>
        );

      case 'mars':
        return (
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id={`${uid}-marsGrad`} cx="35%" cy="35%" rx="65%" ry="65%">
                <Stop offset="0%" stopColor="#F97316" />
                <Stop offset="55%" stopColor="#C2410C" />
                <Stop offset="100%" stopColor="#7C2D12" />
              </RadialGradient>
            </Defs>
            <Circle cx="50" cy="50" r="38" fill={`url(#${uid}-marsGrad)`} />
            {/* North Polar Ice Cap */}
            <Ellipse cx="50" cy="15" rx="16" ry="6" fill="#FFFFFF" opacity={0.92} />
            {/* Valles Marineris Canyon Shadows */}
            <Path d="M 28 46 Q 44 42 54 50 Q 42 58 28 54 Z" fill="#451A03" opacity={0.5} />
            <Path d="M 58 56 Q 70 52 74 62 Q 64 68 58 62 Z" fill="#451A03" opacity={0.45} />
            <Circle cx="64" cy="38" r="4.5" fill="#451A03" opacity={0.4} />
          </Svg>
        );

      case 'jupiter':
        return (
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id={`${uid}-jupGrad`} cx="35%" cy="35%" rx="65%" ry="65%">
                <Stop offset="0%" stopColor="#FED7AA" />
                <Stop offset="60%" stopColor="#D97706" />
                <Stop offset="100%" stopColor="#78350F" />
              </RadialGradient>
            </Defs>
            <Circle cx="50" cy="50" r="38" fill={`url(#${uid}-jupGrad)`} />
            {/* Atmospheric Cloud Belts */}
            <Rect x="13" y="28" width="74" height="6" fill="#B45309" opacity={0.6} />
            <Rect x="12" y="40" width="76" height="8" fill="#92400E" opacity={0.5} />
            <Rect x="12" y="54" width="76" height="6" fill="#FEF3C7" opacity={0.45} />
            <Rect x="13" y="65" width="74" height="7" fill="#B45309" opacity={0.6} />
            {/* Great Red Spot */}
            <Ellipse cx="62" cy="57" rx="8" ry="5.5" fill="#DC2626" opacity={0.9} />
            <Ellipse cx="62" cy="57" rx="5" ry="3" fill="#B91C1C" opacity={0.95} />
          </Svg>
        );

      case 'saturn':
        return (
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id={`${uid}-satGrad`} cx="35%" cy="35%" rx="65%" ry="65%">
                <Stop offset="0%" stopColor="#FEF08A" />
                <Stop offset="60%" stopColor="#CA8A04" />
                <Stop offset="100%" stopColor="#713F12" />
              </RadialGradient>
            </Defs>
            {/* Saturn Ring Back Arc */}
            <G rotation={-20} origin="50, 50">
              <Ellipse cx="50" cy="50" rx="46" ry="12" fill="none" stroke="#D4A373" strokeWidth="4.5" opacity={0.7} />
              <Ellipse cx="50" cy="50" rx="38" ry="9" fill="none" stroke="#B8860B" strokeWidth="2.5" opacity={0.6} />
            </G>
            {/* Saturn Body */}
            <Circle cx="50" cy="50" r="26" fill={`url(#${uid}-satGrad)`} />
            <Rect x="26" y="44" width="48" height="4" fill="#A16207" opacity={0.4} />
            <Rect x="25" y="52" width="50" height="4" fill="#FEF08A" opacity={0.35} />
            {/* Saturn Ring Front Arc */}
            <G rotation={-20} origin="50, 50">
              <Path d="M 4 50 A 46 12 0 0 0 96 50" fill="none" stroke="#E6BE8A" strokeWidth="4.5" />
              <Path d="M 12 50 A 38 9 0 0 0 88 50" fill="none" stroke="#D4A373" strokeWidth="2.5" />
            </G>
          </Svg>
        );

      case 'venus':
        return (
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id={`${uid}-venGrad`} cx="35%" cy="35%" rx="65%" ry="65%">
                <Stop offset="0%" stopColor="#FEF3C7" />
                <Stop offset="55%" stopColor="#F59E0B" />
                <Stop offset="100%" stopColor="#B45309" />
              </RadialGradient>
            </Defs>
            <Circle cx="50" cy="50" r="38" fill={`url(#${uid}-venGrad)`} />
            <Path d="M 14 38 Q 38 28 58 38 T 86 36" stroke="#FFFBEB" strokeWidth="4" fill="none" opacity={0.45} />
            <Path d="M 14 54 Q 38 44 58 54 T 86 52" stroke="#92400E" strokeWidth="4" fill="none" opacity={0.3} />
            <Path d="M 14 68 Q 38 60 58 68 T 86 66" stroke="#FFFBEB" strokeWidth="3" fill="none" opacity={0.35} />
          </Svg>
        );

      case 'mercury':
        return (
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id={`${uid}-mercGrad`} cx="35%" cy="35%" rx="65%" ry="65%">
                <Stop offset="0%" stopColor="#E2E8F0" />
                <Stop offset="60%" stopColor="#64748B" />
                <Stop offset="100%" stopColor="#334155" />
              </RadialGradient>
            </Defs>
            <Circle cx="50" cy="50" r="38" fill={`url(#${uid}-mercGrad)`} />
            {/* Impact Craters */}
            <Circle cx="38" cy="38" r="7" fill="#1E293B" opacity={0.5} />
            <Circle cx="62" cy="54" r="9" fill="#1E293B" opacity={0.45} />
            <Circle cx="46" cy="68" r="5" fill="#1E293B" opacity={0.5} />
            <Circle cx="66" cy="32" r="3.5" fill="#1E293B" opacity={0.4} />
          </Svg>
        );

      case 'sun':
        return (
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id={`${uid}-sunGrad`} cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor="#FEF08A" />
                <Stop offset="50%" stopColor="#F59E0B" />
                <Stop offset="85%" stopColor="#EA580C" />
                <Stop offset="100%" stopColor="transparent" />
              </RadialGradient>
            </Defs>
            {/* Solar Flare Corona */}
            <Circle cx="50" cy="50" r="48" fill={`url(#${uid}-sunGrad)`} opacity={0.5} />
            <Circle cx="50" cy="50" r="34" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
            <Circle cx="50" cy="50" r="30" fill="#FEF08A" />
          </Svg>
        );

      case 'earth':
        return (
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id={`${uid}-earthGrad`} cx="35%" cy="35%" rx="65%" ry="65%">
                <Stop offset="0%" stopColor="#38BDF8" />
                <Stop offset="50%" stopColor="#0284C7" />
                <Stop offset="100%" stopColor="#0B132B" />
              </RadialGradient>
            </Defs>
            <Circle cx="50" cy="50" r="38" fill={`url(#${uid}-earthGrad)`} />
            {/* Continents */}
            <Path d="M 32 36 Q 44 28 54 38 Q 48 52 34 48 Z" fill="#22C55E" opacity={0.8} />
            <Path d="M 58 46 Q 72 40 76 56 Q 64 64 58 52 Z" fill="#16A34A" opacity={0.8} />
            {/* Clouds */}
            <Path d="M 24 42 Q 44 38 60 44" stroke="#FFFFFF" strokeWidth="3" opacity={0.5} fill="none" />
            <Path d="M 34 62 Q 52 58 74 64" stroke="#FFFFFF" strokeWidth="2.5" opacity={0.5} fill="none" />
          </Svg>
        );

      case 'moon':
      default:
        return (
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id={`${uid}-moonGrad`} cx="35%" cy="35%" rx="65%" ry="65%">
                <Stop offset="0%" stopColor="#F8FAFC" />
                <Stop offset="60%" stopColor="#CBD5E1" />
                <Stop offset="100%" stopColor="#64748B" />
              </RadialGradient>
            </Defs>
            <Circle cx="50" cy="50" r="38" fill={`url(#${uid}-moonGrad)`} />
            {/* Maria & Impact Craters */}
            <Circle cx="36" cy="38" r="8" fill="#475569" opacity={0.4} />
            <Circle cx="62" cy="58" r="10" fill="#475569" opacity={0.35} />
            <Circle cx="44" cy="68" r="5" fill="#475569" opacity={0.4} />
            <Circle cx="64" cy="34" r="4" fill="#475569" opacity={0.35} />
            <Circle cx="30" cy="58" r="3.5" fill="#475569" opacity={0.35} />
          </Svg>
        );
    }
  };

  return <View style={[styles.container, { width: size, height: size }]}>{renderGraphic()}</View>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
