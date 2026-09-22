import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Path, Defs, LinearGradient, Stop, Polygon } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { RankTier } from '../content/schema';

interface AstronautAvatarProps {
  size?: number;
  rank?: RankTier;
  showHalo?: boolean;
}

export const AstronautAvatar: React.FC<AstronautAvatarProps> = ({
  size = 56,
  rank = 'Cadet',
  showHalo = true,
}) => {
  const getSuitTheme = () => {
    switch (rank) {
      case 'Commander':
        return {
          haloColor: Colors.gold,
          visorColor1: '#FFF066',
          visorColor2: '#FFB800',
          suitShoulder: '#D97706',
          suitTrim: Colors.gold,
          badgeColor: Colors.gold,
          title: 'কমান্ডার',
        };
      case 'Mission Specialist':
        return {
          haloColor: Colors.purple,
          visorColor1: '#E9D5FF',
          visorColor2: '#8B5CF6',
          suitShoulder: '#6D28D9',
          suitTrim: '#A78BFA',
          badgeColor: Colors.purple,
          title: 'বিশেষজ্ঞ',
        };
      case 'Astronaut':
        return {
          haloColor: Colors.emerald,
          visorColor1: '#FFE066',
          visorColor2: '#FFB800',
          suitShoulder: '#047857',
          suitTrim: Colors.emerald,
          badgeColor: Colors.emerald,
          title: 'নভোচারী',
        };
      case 'Cadet':
      default:
        return {
          haloColor: Colors.cyan,
          visorColor1: '#A5F3FC',
          visorColor2: '#0284C7',
          suitShoulder: '#1D4ED8',
          suitTrim: Colors.cyan,
          badgeColor: Colors.cyan,
          title: 'ক্যাডেট',
        };
    }
  };

  const theme = getSuitTheme();

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          {/* Dynamic Visor Gradient */}
          <LinearGradient id="rankVisorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={theme.visorColor1} />
            <Stop offset="100%" stopColor={theme.visorColor2} />
          </LinearGradient>
          {/* White Helmet Shadow Gradient */}
          <LinearGradient id="helmetWhiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="80%" stopColor="#F1F5F9" />
            <Stop offset="100%" stopColor="#CBD5E1" />
          </LinearGradient>
        </Defs>

        {/* Dynamic Earned Rank Halo */}
        {showHalo && (
          <Circle
            cx="50"
            cy="50"
            r="45"
            stroke={theme.haloColor}
            strokeWidth="3.5"
            strokeDasharray={rank === 'Commander' ? '0' : '10 4'}
            fill="none"
            opacity={0.85}
          />
        )}

        {/* Commander Crown Stars / Wings */}
        {rank === 'Commander' && (
          <>
            <Polygon points="50,2 53,8 60,8 55,12 57,18 50,14 43,18 45,12 40,8 47,8" fill={Colors.gold} />
            <Polygon points="32,6 34,10 39,10 35,13 36,17 32,14 28,17 29,13 25,10 30,10" fill={Colors.gold} />
            <Polygon points="68,6 70,10 75,10 71,13 72,17 68,14 64,17 65,13 61,10 66,10" fill={Colors.gold} />
          </>
        )}

        {/* Spacesuit Shoulders (Color changes with Rank) */}
        <Path d="M 22 88 Q 50 78 78 88 L 84 100 L 16 100 Z" fill={theme.suitShoulder} />
        {/* Suit Collar Ring */}
        <Rect x="30" y="74" width="40" height="8" rx="4" fill="#E2E8F0" />
        {/* Chest Rank Chevrons */}
        <Circle cx="50" cy="88" r="4" fill={theme.badgeColor} />

        {/* Cute Bubble Helmet Base */}
        <Circle cx="50" cy="48" r="34" fill="url(#helmetWhiteGrad)" stroke="#CBD5E1" strokeWidth="2.5" />

        {/* Side Ear Comms Pods */}
        <Circle cx="16" cy="48" r="6" fill="#94A3B8" />
        <Circle cx="84" cy="48" r="6" fill="#94A3B8" />

        {/* Space Antenna */}
        <Rect x="48" y="8" width="4" height="8" rx="2" fill="#94A3B8" />
        <Circle cx="50" cy="7" r="4" fill={theme.badgeColor} />

        {/* Rank-Colored Visor */}
        <Rect x="26" y="32" width="48" height="32" rx="14" fill="url(#rankVisorGrad)" stroke={theme.badgeColor} strokeWidth="2" />

        {/* Cute Glare Reflection */}
        <Path d="M 32 38 Q 44 34 56 37 Q 52 43 36 43 Z" fill="#FFFFFF" opacity={0.75} />
        <Circle cx="64" cy="40" r="2.5" fill="#FFFFFF" opacity={0.8} />

        {/* Cheek Blushes */}
        <Circle cx="32" cy="56" r="3" fill="#FF4D8B" opacity={0.45} />
        <Circle cx="68" cy="56" r="3" fill="#FF4D8B" opacity={0.45} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
