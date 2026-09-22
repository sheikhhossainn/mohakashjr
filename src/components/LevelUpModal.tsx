import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useAppStore } from '../state/useAppStore';
import { TactileButton } from './TactileButton';
import { AstronautAvatar } from './AstronautAvatar';
import { ConfettiEffect } from './ConfettiEffect';
import { Sparkles, ArrowRight, Zap, Star } from 'lucide-react-native';

export const LevelUpModal: React.FC = () => {
  const { activeLevelUp, dismissLevelUp } = useAppStore();

  if (!activeLevelUp) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={Boolean(activeLevelUp)}
      onRequestClose={dismissLevelUp}
    >
      <View style={styles.overlay}>
        <ConfettiEffect active />
        <View style={styles.dialogCard}>
          {/* Top Cosmic Confetti Header */}
          <View style={styles.sparkleHeader}>
            <Sparkles size={20} color={Colors.gold} />
            <Text style={styles.eyebrow}>অভিনন্দন! পদোন্নতি বার্তা 🚀</Text>
            <Sparkles size={20} color={Colors.gold} />
          </View>

          {/* Cute Astronaut Avatar with Halo */}
          <View style={styles.avatarWrapper}>
            <AstronautAvatar size={88} rank="Astronaut" showHalo />
          </View>

          {/* Promotion Title */}
          <Text style={styles.title}>তুমি এখন একজন মহাকাশচারী!</Text>
          <Text style={styles.subtitle}>
            সাবাশ! সফলভাবে ২০০ XP অর্জন করে তুমি পরবর্তী ধাপে পদোন্নতি পেয়েছো।
          </Text>

          {/* Rank Transition Capsule */}
          <View style={styles.capsule}>
            <View style={styles.rankPillOld}>
              <Text style={styles.rankPillTextOld}>ক্যাডেট</Text>
            </View>
            <ArrowRight size={16} color={Colors.gold} />
            <View style={styles.rankPillNew}>
              <Star size={14} color={Colors.gold} fill={Colors.gold} />
              <Text style={styles.rankPillTextNew}>মহাকাশচারী</Text>
            </View>
          </View>

          {/* Rewards Unlocked */}
          <View style={styles.rewardBox}>
            <View style={styles.rewardRow}>
              <Zap size={15} color={Colors.gold} fill={Colors.gold} />
              <Text style={styles.rewardText}>নতুন আনলক: চন্দ্রাভিযান সিমুলেটর অ্যাক্সেস</Text>
            </View>
            <View style={styles.rewardRow}>
              <Star size={15} color={Colors.emerald} fill={Colors.emerald} />
              <Text style={styles.rewardText}>লেভেল ২ এর আকর্ষণীয় মহাকাশ পাঠসমূহ উন্মুক্ত</Text>
            </View>
          </View>

          {/* Action CTA */}
          <TactileButton
            title="মিশন চালিয়ে যাও ➔"
            onPress={dismissLevelUp}
            variant="gold"
            size="large"
            style={styles.ctaButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 13, 36, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#161D4C',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255, 184, 0, 0.5)',
    padding: 24,
    alignItems: 'center',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  sparkleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  eyebrow: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  avatarWrapper: {
    marginVertical: 8,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.size.h1,
    fontWeight: Typography.weight.heavy,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    textAlign: 'center',
    marginBottom: 16,
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 15, 45, 0.6)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  rankPillOld: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  rankPillTextOld: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
  },
  rankPillNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 184, 0, 0.18)',
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  rankPillTextNew: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  rewardBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 14,
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rewardText: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semiBold,
    flex: 1,
  },
  ctaButton: {
    width: '100%',
  },
});
