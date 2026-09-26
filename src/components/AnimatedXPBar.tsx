import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Zap, Sparkles, Star } from 'lucide-react-native';

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
function toBengaliNumber(num: number): string {
  return Math.round(num)
    .toString()
    .split('')
    .map((d) => BENGALI_DIGITS[parseInt(d, 10)] || d)
    .join('');
}

interface AnimatedXPBarProps {
  startXP: number;
  earnedXP: number;
  maxXP?: number;
  duration?: number;
  label_bn?: string;
  autoStart?: boolean;
  onAnimationComplete?: () => void;
  compact?: boolean;
}

export const AnimatedXPBar: React.FC<AnimatedXPBarProps> = ({
  startXP,
  earnedXP,
  maxXP = 200,
  duration = 1600,
  label_bn,
  autoStart = true,
  onAnimationComplete,
  compact = false,
}) => {
  const targetXP = startXP + earnedXP;
  const startPercent = Math.min(100, Math.max(5, (startXP / maxXP) * 100));
  const targetPercent = Math.min(100, Math.max(5, (targetXP / maxXP) * 100));

  const fillAnim = useRef(new Animated.Value(startPercent)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sparkAnim = useRef(new Animated.Value(0)).current;

  const [displayXP, setDisplayXP] = useState(startXP);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!autoStart) return;

    // Numerical counter ticking animation
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(startXP + earnedXP * eased);
      setDisplayXP(currentVal);

      if (progress >= 1) {
        clearInterval(interval);
        setDisplayXP(targetXP);
        setIsFinished(true);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    }, 25);

    // Bar width fill animation
    Animated.timing(fillAnim, {
      toValue: targetPercent,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Pulse effects
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 350,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sparks
    Animated.timing(sparkAnim, {
      toValue: 1,
      duration: duration + 400,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    return () => {
      clearInterval(interval);
    };
  }, [autoStart, startXP, earnedXP, targetPercent, duration]);

  const widthInterpolation = fillAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Top Telemetry Row */}
      <View style={styles.topRow}>
        <View style={styles.labelGroup}>
          <Star size={15} color={Colors.gold} fill={Colors.gold} />
          <Text style={styles.labelText}>
            {label_bn || 'অভিযান অভিজ্ঞতা স্তর (XP Telemetry)'}
          </Text>
        </View>

        {earnedXP > 0 && (
          <Animated.View style={[styles.earnedPill, { transform: [{ scale: pulseAnim }] }]}>
            <Zap size={13} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.earnedText}>+{toBengaliNumber(earnedXP)} XP</Text>
          </Animated.View>
        )}
      </View>

      {/* Chunky Capsule Glass Tube */}
      <View style={[styles.capsuleTube, compact && styles.compactTube]}>
        <Animated.View
          style={[
            styles.fillBar,
            {
              width: widthInterpolation,
              backgroundColor: isFinished ? Colors.gold : Colors.hudCyan,
            },
          ]}
        >
          {/* Internal neon laser glow */}
          <View style={styles.laserCore} />
          {/* Top 3D specular highlight */}
          <View style={styles.specularLine} />
        </Animated.View>
      </View>

      {/* Bottom Counter & Milestone Progress */}
      <View style={styles.bottomRow}>
        <Text style={styles.bottomSubtext}>
          সর্বমোট সঞ্চিত:{' '}
          <Text style={styles.highlightNumber}>{toBengaliNumber(displayXP)}</Text> / {toBengaliNumber(maxXP)} XP
        </Text>

        {isFinished ? (
          <View style={styles.completeStatus}>
            <Sparkles size={12} color={Colors.emerald} />
            <Text style={styles.completeText}>সফলভাবে যুক্ত হয়েছে!</Text>
          </View>
        ) : (
          <Text style={styles.syncingText}>টেলিমেট্রি সিঙ্ক হচ্ছে...</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'rgba(14, 18, 60, 0.75)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 184, 0, 0.35)',
    padding: 14,
    marginVertical: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelText: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  earnedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 3,
  },
  earnedText: {
    color: '#0B0F19',
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.heavy,
  },
  capsuleTube: {
    height: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderRadius: 9,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 2,
    justifyContent: 'center',
  },
  compactTube: {
    height: 12,
    borderRadius: 6,
  },
  fillBar: {
    height: '100%',
    borderRadius: 7,
    overflow: 'hidden',
    position: 'relative',
  },
  laserCore: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 4,
  },
  specularLine: {
    position: 'absolute',
    top: 1,
    left: 2,
    right: 2,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  bottomSubtext: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
  },
  highlightNumber: {
    color: Colors.gold,
    fontWeight: Typography.weight.heavy,
  },
  completeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completeText: {
    color: Colors.emerald,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  syncingText: {
    color: Colors.hudCyan,
    fontSize: Typography.size.micro,
  },
});
