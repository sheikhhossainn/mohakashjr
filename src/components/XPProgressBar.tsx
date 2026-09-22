import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useAppStore } from '../state/useAppStore';
import { Zap, Sparkles, Star } from 'lucide-react-native';

interface XPProgressBarProps {
  showRankLabel?: boolean;
  compact?: boolean;
}

export const XPProgressBar: React.FC<XPProgressBarProps> = ({
  showRankLabel = true,
  compact = false,
}) => {
  const { xp, rank, getRankProgress } = useAppStore();
  const { percentage: progressPercent, max: maxXP } = getRankProgress();

  const animatedPercent = useRef(new Animated.Value(Math.max(5, Math.min(progressPercent, 100)))).current;

  useEffect(() => {
    Animated.timing(animatedPercent, {
      toValue: Math.max(5, Math.min(progressPercent, 100)),
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // width animation requires false
    }).start();
  }, [progressPercent]);

  const getRankDisplayName = (r: string) => {
    switch (r) {
      case 'Cadet':
        return 'স্পেস ক্যাডেট';
      case 'Astronaut':
        return 'মহাকাশচারী';
      case 'Mission Specialist':
        return 'মিশন বিশেষজ্ঞ';
      case 'Commander':
        return 'মহাকাশ কমান্ডার';
      default:
        return r;
    }
  };

  const remainingXP = Math.max(0, maxXP - xp);

  const widthInterpolation = animatedPercent.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Friendly Progress Header */}
      {showRankLabel && (
        <View style={styles.headerRow}>
          <View style={styles.rankPill}>
            <Star size={14} color={Colors.gold} fill={Colors.gold} />
            <Text style={styles.rankTitle}>{getRankDisplayName(rank)}</Text>
          </View>

          <View style={styles.xpPill}>
            <Zap size={14} color={Colors.gold} fill={Colors.gold} />
            <Text style={styles.xpValue}>
              {xp}
              {rank !== 'Commander' ? (
                <Text style={styles.xpTarget}> / {maxXP} XP</Text>
              ) : (
                <Text style={styles.xpTarget}> (সর্বোচ্চ)</Text>
              )}
            </Text>
          </View>
        </View>
      )}

      {/* Chunky Energy Bar Capsule */}
      <View style={[styles.capsuleShell, compact && styles.compactShell]}>
        <Animated.View
          style={[
            styles.capsuleFill,
            {
              width: widthInterpolation,
              backgroundColor: Colors.gold,
            },
          ]}
        >
          {/* Top 3D Gloss Highlight */}
          <View style={styles.glossHighlight} />
        </Animated.View>
      </View>

      {/* Cheerful Milestone Encouragement */}
      {rank !== 'Commander' && !compact && (
        <View style={styles.encouragementRow}>
          <Sparkles size={13} color={Colors.gold} />
          <Text style={styles.encouragementText}>
            পরবর্তী পদমর্যাদা আনলক করতে আর মাত্র{' '}
            <Text style={styles.highlightText}>{remainingXP} XP</Text> দরকার!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
  },
  rankTitle: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpValue: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.heavy,
  },
  xpTarget: {
    color: Colors.textMuted,
    fontWeight: Typography.weight.regular,
  },
  capsuleShell: {
    height: 18,
    backgroundColor: 'rgba(10, 14, 45, 0.85)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  compactShell: {
    height: 12,
    borderRadius: 8,
  },
  capsuleFill: {
    height: '100%',
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  glossHighlight: {
    position: 'absolute',
    top: 1,
    left: 2,
    right: 2,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 3,
  },
  encouragementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.2)',
  },
  encouragementText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.micro,
  },
  highlightText: {
    color: Colors.gold,
    fontWeight: Typography.weight.bold,
  },
});
