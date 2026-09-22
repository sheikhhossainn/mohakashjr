import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { DoubleBezelCard } from '../../src/components/DoubleBezelCard';
import { TactileButton } from '../../src/components/TactileButton';
import { XPProgressBar } from '../../src/components/XPProgressBar';
import { AstronautAvatar } from '../../src/components/AstronautAvatar';
import { SpaceChoiceBadge } from '../../src/components/SpaceChoiceBadge';
import { AnimatedMascot } from '../../src/components/AnimatedMascot';
import { SpaceTelemetryHUD } from '../../src/components/SpaceTelemetryHUD';
import { useAppStore, ARCHETYPES } from '../../src/state/useAppStore';
import {
  Sparkles,
  BookOpen,
  Rocket,
  ChevronRight,
  Zap,
  HelpCircle,
  Star,
  Compass,
} from 'lucide-react-native';

export default function DashboardScreen() {
  const router = useRouter();
  const { displayName, rank, xp, addXP, completedLessonIds, cadetArchetype } = useAppStore();
  const archetypeInfo = ARCHETYPES[cadetArchetype] || ARCHETYPES.pilot;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Space Status Strip */}
      <SpaceTelemetryHUD />

      {/* Warm Astronaut Greeting Card */}
      <DoubleBezelCard glow="blue" style={styles.sectionMargin}>
        <View style={styles.heroRow}>
          <View style={styles.heroTextCol}>
            <View style={[styles.badgeRow, { borderColor: archetypeInfo.accentColor }]}>
              <SpaceChoiceBadge type={cadetArchetype} size={26} isSelected />
              <Text style={[styles.badgeText, { color: archetypeInfo.accentColor }]}>{archetypeInfo.title_bn}</Text>
            </View>

            <Text style={styles.greetingTitle}>স্বাগতম, {displayName}! 👨‍🚀</Text>
            <Text style={styles.greetingSubtitle}>
              {archetypeInfo.motto_bn}
            </Text>
          </View>

          {/* Student's Earned Rank Avatar */}
          <AstronautAvatar size={72} rank={rank} showHalo />
        </View>

        {/* Quick Booster Button */}
        <View style={styles.boosterRow}>
          <Pressable
            style={styles.boosterBtn}
            onPress={() => addXP(50)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Zap size={14} color={Colors.gold} fill={Colors.gold} />
            <Text style={styles.boosterBtnText}>+৫০ XP টেস্ট বোনাস নাও ⚡</Text>
          </Pressable>
        </View>
      </DoubleBezelCard>

      {/* Astro-Buddy Daily Speech Card */}
      <DoubleBezelCard glow="pink" style={styles.sectionMargin}>
        <View style={styles.buddyCardRow}>
          <AnimatedMascot size={64} mood="waving" />
          <View style={styles.buddySpeechBubble}>
            <View style={styles.buddyHeader}>
              <Sparkles size={13} color={Colors.pink} />
              <Text style={styles.buddyTitle}>অ্যাস্ট্রো-বন্ধুর বিশেষ টিপস</Text>
            </View>
            <Text style={styles.buddySpeechText}>
              "প্রিয় {archetypeInfo.title_bn}! {archetypeInfo.description_bn} আজকের বিশেষ পাঠ পড়ে কুইজ সমাধান করো।"
            </Text>
          </View>
        </View>
      </DoubleBezelCard>

      {/* Gamified XP Progress Card */}
      <DoubleBezelCard glow="gold" style={styles.sectionMargin}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderGroup}>
            <Star size={16} color={Colors.gold} fill={Colors.gold} />
            <Text style={styles.cardTitle}>নভোচারী র‍্যাঙ্ক ও অভিজ্ঞতা</Text>
          </View>
        </View>

        <XPProgressBar compact={false} />
      </DoubleBezelCard>

      {/* Featured Daily Lesson Card */}
      <DoubleBezelCard glow="emerald" style={styles.sectionMargin}>
        <View style={styles.dispatchHeader}>
          <View style={styles.dispatchBadge}>
            <Sparkles size={13} color={Colors.emerald} />
            <Text style={styles.dispatchBadgeText}>আজকের বিশেষ পাঠ</Text>
          </View>
          <View style={styles.xpBonusBadge}>
            <Zap size={12} color={Colors.gold} fill={Colors.gold} />
            <Text style={styles.xpBonusText}>+২০ XP</Text>
          </View>
        </View>

        <Text style={styles.dispatchTitle}>চাঁদের বুকে প্রথম পদক্ষেপ 🌕</Text>
        <Text style={styles.dispatchBrief}>
          ১৯৬৯ সালের অ্যাপোলো ১১ মিশনে মানুষ প্রথম চাঁদে পা রেখেছিল। জেনে নাও কেন সেখানে নভোচারীদের পায়ের ছাপ কোটি বছর ধরে অক্ষত থাকবে!
        </Text>

        <TactileButton
          title="পড়া শুরু করো ➔"
          onPress={() => router.push('/lessons/lesson-1')}
          variant="gold"
          size="normal"
        />
      </DoubleBezelCard>

      {/* Quick Launch Bento Grid */}
      <Text style={styles.sectionHeading}>মিশন সেন্টার নেভিগেশন</Text>

      <View style={styles.bentoGrid}>
        {/* Lessons Hub Card */}
        <Pressable
          style={styles.bentoCard}
          onPress={() => router.push('/(tabs)/lessons')}
        >
          <View style={[styles.bentoIconBadge, { backgroundColor: Colors.primaryBg }]}>
            <BookOpen size={24} color={Colors.cyan} />
          </View>
          <View style={styles.bentoTextCol}>
            <Text style={styles.bentoTitle}>মহাকাশ পাঠাগার 📖</Text>
            <Text style={styles.bentoSubtitle}>
              {completedLessonIds.length}টি পাঠ সম্পন্ন হয়েছে
            </Text>
          </View>
          <ChevronRight size={18} color={Colors.textMuted} />
        </Pressable>

        {/* Flight Deck Quiz Hub Card */}
        <Pressable
          style={styles.bentoCard}
          onPress={() => router.push('/quiz')}
        >
          <View style={[styles.bentoIconBadge, { backgroundColor: Colors.emeraldBg }]}>
            <HelpCircle size={24} color={Colors.emerald} />
          </View>
          <View style={styles.bentoTextCol}>
            <Text style={styles.bentoTitle}>কুইজ ও চ্যালেঞ্জ 🎮</Text>
            <Text style={styles.bentoSubtitle}>জ্ঞান যাচাই করে দ্রুত XP অর্জন</Text>
          </View>
          <ChevronRight size={18} color={Colors.textMuted} />
        </Pressable>

        {/* Lunar Mission Hub Card */}
        <Pressable
          style={styles.bentoCard}
          onPress={() => router.push('/(tabs)/mission')}
        >
          <View style={[styles.bentoIconBadge, { backgroundColor: Colors.purpleBg }]}>
            <Rocket size={24} color={Colors.purple} />
          </View>
          <View style={styles.bentoTextCol}>
            <Text style={styles.bentoTitle}>চন্দ্রাভিযান সিমুলেটর 🌕</Text>
            <Text style={styles.bentoSubtitle}>অবতরণ অঞ্চল নির্বাচন ও রসদ ব্যালেন্স</Text>
          </View>
          <ChevronRight size={18} color={Colors.textMuted} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingTop: 10,
    paddingBottom: 40,
  },
  sectionMargin: {
    marginHorizontal: 16,
    marginBottom: 14,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 5,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
  },
  badgeText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  greetingTitle: {
    color: Colors.text,
    fontSize: Typography.size.h1,
    fontWeight: Typography.weight.heavy,
    lineHeight: Typography.lineHeight.h1,
    marginBottom: 4,
  },
  greetingSubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
  },
  boosterRow: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 10,
  },
  boosterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 184, 0, 0.14)',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 184, 0, 0.35)',
  },
  boosterBtnText: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.heavy,
  },
  buddyCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buddySpeechBubble: {
    flex: 1,
    backgroundColor: 'rgba(255, 77, 139, 0.12)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 77, 139, 0.3)',
  },
  buddyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  buddyTitle: {
    color: Colors.pink,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.heavy,
  },
  buddySpeechText: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontWeight: Typography.weight.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
  },
  dispatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dispatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.emeraldBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 5,
  },
  dispatchBadgeText: {
    color: Colors.emerald,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  xpBonusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  xpBonusText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.heavy,
  },
  dispatchTitle: {
    color: Colors.text,
    fontSize: Typography.size.h2,
    fontWeight: Typography.weight.heavy,
    marginBottom: 6,
  },
  dispatchBrief: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    marginBottom: 14,
  },
  sectionHeading: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    fontWeight: Typography.weight.bold,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  bentoGrid: {
    marginHorizontal: 16,
    gap: 12,
  },
  bentoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    padding: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 3.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.35)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  bentoIconBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bentoTextCol: {
    flex: 1,
  },
  bentoTitle: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    marginBottom: 2,
  },
  bentoSubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
  },
});
