import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Defs,
  LinearGradient,
  Stop,
  Polygon,
} from 'react-native-svg';
import { CadetArchetype } from '../state/useAppStore';

interface SpaceChoiceBadgeProps {
  type: CadetArchetype;
  size?: number;
  isSelected?: boolean;
}

export const SpaceChoiceBadge: React.FC<SpaceChoiceBadgeProps> = ({
  type,
  size = 52,
  isSelected = false,
}) => {
  const getBadgeMeta = () => {
    switch (type) {
      case 'pilot':
        return {
          bgColor: isSelected ? 'rgba(255, 107, 53, 0.25)' : 'rgba(255, 107, 53, 0.12)',
          borderColor: isSelected ? '#FF6B35' : 'rgba(255, 107, 53, 0.35)',
          glowColor: '#FF6B35',
        };
      case 'astronomer':
        return {
          bgColor: isSelected ? 'rgba(0, 240, 255, 0.25)' : 'rgba(0, 240, 255, 0.12)',
          borderColor: isSelected ? '#00F0FF' : 'rgba(0, 240, 255, 0.35)',
          glowColor: '#00F0FF',
        };
      case 'engineer':
        return {
          bgColor: isSelected ? 'rgba(255, 184, 0, 0.25)' : 'rgba(255, 184, 0, 0.12)',
          borderColor: isSelected ? '#FFB800' : 'rgba(255, 184, 0, 0.35)',
          glowColor: '#FFB800',
        };
      case 'explorer':
        return {
          bgColor: isSelected ? 'rgba(0, 229, 153, 0.25)' : 'rgba(0, 229, 153, 0.12)',
          borderColor: isSelected ? '#00E599' : 'rgba(0, 229, 153, 0.35)',
          glowColor: '#00E599',
        };
    }
  };

  const meta = getBadgeMeta();

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size * 0.32,
          backgroundColor: meta.bgColor,
          borderColor: meta.borderColor,
          borderWidth: isSelected ? 2 : 1.5,
        },
      ]}
    >
      {type === 'pilot' && (
        <Svg width={size * 0.68} height={size * 0.68} viewBox="0 0 64 64" fill="none">
          <Defs>
            <LinearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="100%" stopColor="#E2E8F0" />
            </LinearGradient>
            <LinearGradient id="flame" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#F59E0B" />
              <Stop offset="60%" stopColor="#EF4444" />
              <Stop offset="100%" stopColor="transparent" />
            </LinearGradient>
            <LinearGradient id="flameCore" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FDE047" />
              <Stop offset="100%" stopColor="#F97316" />
            </LinearGradient>
          </Defs>

          {/* Left & Right Booster Wings */}
          <Path
            d="M18 36 C18 48 10 54 8 54 C16 54 24 50 24 42 Z"
            fill="#FF6B35"
            stroke="#EA580C"
            strokeWidth="1.5"
          />
          <Path
            d="M46 36 C46 48 54 54 56 54 C48 54 40 50 40 42 Z"
            fill="#FF6B35"
            stroke="#EA580C"
            strokeWidth="1.5"
          />

          {/* Main Thruster Flames */}
          <Path
            d="M26 48 Q32 64 38 48 Q32 58 26 48 Z"
            fill="url(#flame)"
          />
          <Path
            d="M28 48 Q32 58 36 48 Q32 54 28 48 Z"
            fill="url(#flameCore)"
          />

          {/* Sleek Central Fuselage */}
          <Path
            d="M32 6 C24 16 22 34 24 46 C28 48 36 48 40 46 C42 34 40 16 32 6 Z"
            fill="url(#rocketBody)"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />

          {/* Nosecone Cap */}
          <Path
            d="M32 6 C28 12 26 18 26 20 C29 21 35 21 38 20 C38 18 36 12 32 6 Z"
            fill="#EF4444"
          />

          {/* Porthole Window with Glass Glint */}
          <Circle cx="32" cy="27" r="5.5" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
          <Circle cx="30.5" cy="25.5" r="1.8" fill="#FFFFFF" opacity={0.85} />

          {/* Speed Stars */}
          <Circle cx="12" cy="18" r="1.5" fill="#FDE047" />
          <Circle cx="52" cy="22" r="1.2" fill="#FDE047" />
          <Path d="M48 10 L50 14 L54 16 L50 18 L48 22 L46 18 L42 16 L46 14 Z" fill="#FBBF24" opacity={0.8} />
        </Svg>
      )}

      {type === 'astronomer' && (
        <Svg width={size * 0.68} height={size * 0.68} viewBox="0 0 64 64" fill="none">
          <Defs>
            <LinearGradient id="teleBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#38BDF8" />
              <Stop offset="100%" stopColor="#0284C7" />
            </LinearGradient>
            <LinearGradient id="lensGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#67E8F9" />
              <Stop offset="100%" stopColor="#00F0FF" />
            </LinearGradient>
          </Defs>

          {/* Tripod Stand */}
          <Path d="M26 38 L14 56" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M30 38 L32 56" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M34 38 L46 56" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
          <Circle cx="30" cy="38" r="3.5" fill="#475569" stroke="#94A3B8" strokeWidth="1" />

          {/* Telescope Barrel */}
          <G transform="rotate(-36 30 36)">
            {/* Dew Shield / Objective Lens Front */}
            <Rect x="16" y="29" width="8" height="14" rx="2" fill="url(#lensGlow)" stroke="#E0F2FE" strokeWidth="1" />
            <Path d="M16 32 C14 36 14 38 16 40" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

            {/* Main Optical Tube */}
            <Rect x="24" y="31" width="22" height="10" rx="1.5" fill="url(#teleBody)" stroke="#0369A1" strokeWidth="1" />
            <Rect x="30" y="30" width="3" height="12" fill="#F59E0B" />

            {/* Eyepiece Holder & Diagonal */}
            <Rect x="46" y="32" width="6" height="8" rx="1" fill="#1E293B" />
            <Rect x="52" y="34" width="4" height="4" rx="0.5" fill="#94A3B8" />
          </G>

          {/* Twinkling Starlight & Crescent Moon */}
          <Path
            d="M48 8 C44 8 41 11 41 15 C41 18 43 20 46 21 C42 21 38 17 38 13 C38 9 41 6 45 6 C46 6 47 6.5 48 8 Z"
            fill="#FDE047"
          />
          <Path d="M16 12 L18 16 L22 17 L18 19 L16 23 L14 19 L10 17 L14 16 Z" fill="#00F0FF" />
          <Circle cx="24" cy="8" r="1.5" fill="#FFFFFF" />
          <Circle cx="54" cy="28" r="1.2" fill="#67E8F9" />
        </Svg>
      )}

      {type === 'engineer' && (
        <Svg width={size * 0.68} height={size * 0.68} viewBox="0 0 64 64" fill="none">
          <Defs>
            <LinearGradient id="roverBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#F59E0B" />
              <Stop offset="100%" stopColor="#D97706" />
            </LinearGradient>
            <LinearGradient id="gearGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FBBF24" />
              <Stop offset="100%" stopColor="#F59E0B" />
            </LinearGradient>
          </Defs>

          {/* High-Tech Gear in upper right */}
          <G transform="translate(38, 8) scale(0.6)">
            <Circle cx="16" cy="16" r="10" fill="url(#gearGold)" stroke="#B45309" strokeWidth="2" />
            <Circle cx="16" cy="16" r="4.5" fill="#0F172A" />
            {/* Gear teeth */}
            <Rect x="14" y="2" width="4" height="4" rx="1" fill="#FBBF24" />
            <Rect x="14" y="26" width="4" height="4" rx="1" fill="#FBBF24" />
            <Rect x="2" y="14" width="4" height="4" rx="1" fill="#FBBF24" />
            <Rect x="26" y="14" width="4" height="4" rx="1" fill="#FBBF24" />
          </G>

          {/* Rover Camera Mast & Sensor Head */}
          <Path d="M22 28 L22 18 L28 18" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          <Rect x="26" y="14" width="8" height="6" rx="1.5" fill="#334155" stroke="#64748B" strokeWidth="1" />
          <Circle cx="30" cy="17" r="1.8" fill="#10B981" />

          {/* Solar Panel & Chassis */}
          <Path d="M12 28 L38 28 L36 38 L14 38 Z" fill="url(#roverBody)" stroke="#B45309" strokeWidth="1.5" />
          <Rect x="15" y="29" width="18" height="3" rx="0.5" fill="#1E293B" opacity={0.6} />

          {/* Suspension Struts */}
          <Path d="M16 38 L14 44" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M25 38 L25 44" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M34 38 L36 44" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />

          {/* Tread Wheels */}
          <Circle cx="13" cy="46" r="5" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <Circle cx="13" cy="46" r="2" fill="#94A3B8" />

          <Circle cx="25" cy="46" r="5" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <Circle cx="25" cy="46" r="2" fill="#94A3B8" />

          <Circle cx="37" cy="46" r="5" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <Circle cx="37" cy="46" r="2" fill="#94A3B8" />

          {/* Spark effect */}
          <Circle cx="46" cy="38" r="1.5" fill="#FBBF24" />
        </Svg>
      )}

      {type === 'explorer' && (
        <Svg width={size * 0.68} height={size * 0.68} viewBox="0 0 64 64" fill="none">
          <Defs>
            <LinearGradient id="planetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#34D399" />
              <Stop offset="70%" stopColor="#059669" />
              <Stop offset="100%" stopColor="#064E3B" />
            </LinearGradient>
            <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#C084FC" />
              <Stop offset="50%" stopColor="#E879F9" />
              <Stop offset="100%" stopColor="#818CF8" />
            </LinearGradient>
          </Defs>

          {/* Background Ring Arc (Behind Planet) */}
          <Path
            d="M10 26 C16 16 48 18 56 32"
            stroke="url(#ringGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity={0.65}
          />

          {/* Alien Planet Sphere */}
          <Circle cx="32" cy="32" r="16" fill="url(#planetGrad)" stroke="#10B981" strokeWidth="1.5" />

          {/* Planet Surface Craters / Atmospheric Swirls */}
          <Path
            d="M20 28 Q28 24 38 29"
            stroke="#A7F3D0"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity={0.7}
          />
          <Circle cx="26" cy="36" r="2.5" fill="#047857" opacity={0.8} />
          <Circle cx="36" cy="38" r="3" fill="#047857" opacity={0.8} />
          <Circle cx="33" cy="22" r="1.5" fill="#A7F3D0" opacity={0.7} />

          {/* Foreground Ring Arc (In front of Planet) */}
          <Path
            d="M6 38 C14 50 46 50 58 26"
            stroke="url(#ringGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Compass Star / Cosmic Sparkle in top left */}
          <Path d="M14 6 L16 12 L22 14 L16 16 L14 22 L12 16 L6 14 L12 12 Z" fill="#FDE047" />
          <Circle cx="50" cy="14" r="1.8" fill="#F472B6" />
          <Circle cx="48" cy="50" r="1.4" fill="#38BDF8" />
        </Svg>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
