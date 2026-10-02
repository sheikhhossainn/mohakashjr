import React from 'react';
import { View, StyleSheet, Dimensions, StyleProp, ViewStyle } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  Path,
  G,
  Ellipse,
} from 'react-native-svg';
import { LessonMoods } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type IllustrationTopic = 'moon' | 'mars' | 'iss' | 'jwst' | 'earth' | 'sun' | 'stars' | 'rocket';

interface IllustrationHeaderProps {
  topic?: IllustrationTopic;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * IllustrationHeader — Full-width illustrated scene banner for lessons and missions.
 * Replaces generic emoji icons with atmospheric vector storybook scenes.
 */
export const IllustrationHeader: React.FC<IllustrationHeaderProps> = ({
  topic = 'moon',
  height = 180,
  style,
}) => {
  const mood = LessonMoods[topic] || LessonMoods.moon;

  const renderSceneElements = () => {
    switch (topic) {
      case 'moon':
        return (
          <G>
            {/* Cratered Crescent Moon */}
            <Circle cx={SCREEN_WIDTH * 0.72} cy={height * 0.45} r={46} fill="#FFEDD5" opacity={0.95} />
            <Circle cx={SCREEN_WIDTH * 0.76} cy={height * 0.42} r={42} fill={mood.via} />
            {/* Lunar Surface Craters */}
            <Circle cx={SCREEN_WIDTH * 0.67} cy={height * 0.48} r={6} fill="rgba(0,0,0,0.15)" />
            <Circle cx={SCREEN_WIDTH * 0.70} cy={height * 0.36} r={4} fill="rgba(0,0,0,0.12)" />
            {/* Soft Lunar Horizon Curve */}
            <Path
              d={`M -20 ${height} Q ${SCREEN_WIDTH * 0.5} ${height * 0.72} ${SCREEN_WIDTH + 20} ${height} Z`}
              fill="#202652"
              opacity={0.8}
            />
            {/* Apollo Lunar Lander Silhouette */}
            <G transform={`translate(${SCREEN_WIDTH * 0.42}, ${height * 0.72}) scale(0.65)`}>
              <Rect x="10" y="8" width="24" height="18" rx="4" fill="#E2E8F0" />
              <Path d="M 6 26 L 16 38 M 38 26 L 28 38" stroke="#CBD5E1" strokeWidth="3" />
              <Circle cx="22" cy="17" r="4" fill="#6B8AFF" />
            </G>
          </G>
        );

      case 'mars':
        return (
          <G>
            {/* Red Planet Sphere with Atmosphere Halo */}
            <Circle cx={SCREEN_WIDTH * 0.75} cy={height * 0.45} r={52} fill="#FF8A80" opacity={0.9} />
            <Circle cx={SCREEN_WIDTH * 0.72} cy={height * 0.42} r={48} fill="#E05252" />
            <Circle cx={SCREEN_WIDTH * 0.69} cy={height * 0.38} r={14} fill="#FFB4AB" opacity={0.4} />
            {/* Rugged Martian Canyons */}
            <Path
              d={`M -20 ${height} Q ${SCREEN_WIDTH * 0.35} ${height * 0.68} ${SCREEN_WIDTH + 20} ${height} Z`}
              fill="#3A1C24"
              opacity={0.9}
            />
            {/* Rover Silhouette */}
            <G transform={`translate(${SCREEN_WIDTH * 0.28}, ${height * 0.70}) scale(0.6)`}>
              <Rect x="12" y="10" width="28" height="14" rx="3" fill="#E2E8F0" />
              <Circle cx="16" cy="28" r="5" fill="#475569" />
              <Circle cx="36" cy="28" r="5" fill="#475569" />
              <Path d="M 26 10 L 26 2 L 32 4" stroke="#94A3B8" strokeWidth="2" />
            </G>
          </G>
        );

      case 'iss':
        return (
          <G>
            {/* Blue Marble Earth Horizon */}
            <Path
              d={`M -30 ${height} Q ${SCREEN_WIDTH * 0.5} ${height * 0.48} ${SCREEN_WIDTH + 30} ${height} Z`}
              fill="#1E40AF"
              opacity={0.7}
            />
            <Path
              d={`M 20 ${height} Q ${SCREEN_WIDTH * 0.45} ${height * 0.55} ${SCREEN_WIDTH * 0.85} ${height} Z`}
              fill="#10B981"
              opacity={0.4}
            />
            {/* Floating Space Station */}
            <G transform={`translate(${SCREEN_WIDTH * 0.62}, ${height * 0.28}) scale(0.75)`}>
              {/* Central Truss */}
              <Rect x="0" y="14" width="60" height="4" fill="#E2E8F0" rx="1" />
              {/* Solar Panels Left */}
              <Rect x="4" y="0" width="16" height="32" rx="2" fill="#38BDF8" opacity={0.85} />
              {/* Solar Panels Right */}
              <Rect x="40" y="0" width="16" height="32" rx="2" fill="#38BDF8" opacity={0.85} />
              {/* Module Core */}
              <Circle cx="30" cy="16" r="6" fill="#F8FAFC" />
            </G>
          </G>
        );

      case 'jwst':
        return (
          <G>
            {/* Golden Honeycomb Hex Mirror Segment */}
            <G transform={`translate(${SCREEN_WIDTH * 0.68}, ${height * 0.32}) scale(0.8)`}>
              <Circle cx="20" cy="20" r="28" fill="#FFC86B" opacity={0.9} />
              <Circle cx="20" cy="20" r="22" fill="#E0A840" />
              <Path d="M 8 10 L 20 4 L 32 10 L 32 24 L 20 30 L 8 24 Z" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity={0.7} />
            </G>
            {/* Ethereal Deep Space Nebula Dust */}
            <Ellipse cx={SCREEN_WIDTH * 0.3} cy={height * 0.5} rx={80} ry={40} fill="#B48EFF" opacity={0.25} />
          </G>
        );

      default:
        return (
          <G>
            {/* Ascending Rocket Trail */}
            <Path
              d={`M ${SCREEN_WIDTH * 0.5} ${height} Q ${SCREEN_WIDTH * 0.52} ${height * 0.6} ${SCREEN_WIDTH * 0.6} ${height * 0.25}`}
              stroke="rgba(255, 200, 107, 0.4)"
              strokeWidth="4"
              strokeDasharray="4,4"
              fill="none"
            />
            {/* Distant Planet */}
            <Circle cx={SCREEN_WIDTH * 0.78} cy={height * 0.35} r={28} fill="#6B8AFF" opacity={0.7} />
          </G>
        );
    }
  };

  return (
    <View style={[styles.container, { height }, style]}>
      <Svg width="100%" height={height} viewBox={`0 0 ${SCREEN_WIDTH} ${height}`}>
        <Defs>
          <LinearGradient id="headerGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={mood.to} stopOpacity="0.85" />
            <Stop offset="65%" stopColor={mood.via} stopOpacity="0.95" />
            <Stop offset="100%" stopColor={mood.from} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Ambient Gradient Base */}
        <Rect x="0" y="0" width={SCREEN_WIDTH} height={height} fill="url(#headerGrad)" />

        {/* Scene Details */}
        {renderSceneElements()}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
});
