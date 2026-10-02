import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { StoryCard } from '../../src/components/StoryCard';
import { GentleButton } from '../../src/components/GentleButton';
import { MascotReaction } from '../../src/components/MascotReaction';
import { MoonLandingMission } from '../../src/components/mission';
import {
  Rocket,
  MapPin,
  PackageCheck,
  Award,
  Play,
} from 'lucide-react-native';

export default function MissionScreen() {
  const [isMissionActive, setIsMissionActive] = useState(false);

  // If cadet has launched the mission, show the full multi-stage mission engine
  if (isMissionActive) {
    return <MoonLandingMission onExitMission={() => setIsMissionActive(false)} />;
  }

  // Mission Control Hub & Briefing Screen
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Mission Control Briefing Card */}
      <StoryCard accent="primary" style={styles.heroCard}>
        <View style={styles.tagRow}>
          <View style={styles.missionTag}>
            <Rocket size={13} color={Colors.primaryLight} />
            <Text style={styles.missionTagText}>আর্টেমিস অভিযান ১</Text>
          </View>
          <View style={styles.statusLiveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.statusLiveText}>সিমুলেশন প্রস্তুত</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>চন্দ্রপৃষ্ঠে অবতরণ মিশন 🌕</Text>
        <Text style={styles.heroDescription}>
          একজন জুনিয়র মিশন কমান্ডার হিসেবে তোমার মহাকাশযান নিরাপদে চাঁদের মাটিতে অবতরণ করানো এবং সীমিত ওজনের মধ্যে বৈজ্ঞানিক সরঞ্জাম সাজিয়ে চাঁদের ঘাঁটিতে টিকে থাকাই তোমার মূল অভিযান!
        </Text>

        {/* Astro-Buddy Encouragement Slot */}
        <View style={styles.mascotSlot}>
          <MascotReaction
            state="thinking"
            size={84}
            showSpeechBubble
            bubbleText="কমান্ডার, ল্যান্ডার প্রস্তুত! তুমি কি লুনার চ্যালেঞ্জের জন্য তৈরি?"
          />
        </View>

        {/* Primary Launch Action Button */}
        <View style={styles.primaryLaunchBtnWrapper}>
          <GentleButton
            title="চন্দ্রাভিযান শুরু করো 🚀"
            onPress={() => setIsMissionActive(true)}
            variant="gold"
            size="large"
            fullWidth
            icon={<Play size={18} color={Colors.textDark} fill={Colors.textDark} />}
          />
        </View>
      </StoryCard>

      {/* 3-Stage Mission Roadmap */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>মিশনের প্রধান ৩টি ধাপ</Text>
        <Text style={styles.sectionCode}>ইন্টারঅ্যাক্টিভ সিমুলেশন</Text>
      </View>

      {/* Stage 1 */}
      <StoryCard accent="gold" style={styles.stageCard}>
        <View style={styles.stageContentRow}>
          <View style={[styles.stageIconBox, { backgroundColor: 'rgba(255, 200, 107, 0.15)' }]}>
            <MapPin size={22} color={Colors.gold} />
          </View>
          <View style={styles.stageDetails}>
            <View style={styles.stageNumberRow}>
              <Text style={styles.stageNumber}>ধাপ ০১</Text>
              <Text style={styles.telemetryTag}>অবতরণ অঞ্চল নির্বাচন</Text>
            </View>
            <Text style={styles.stageTitle}>অবতরণ অঞ্চল নির্বাচন (Site Selection)</Text>
            <Text style={styles.stageDesc}>
              দক্ষিণ মেরুর শ্যাকলটন গহ্বর (প্রচুর বরফ কিন্তু অন্ধকার), শান্ত সাগর (মসৃণ ও নিরাপদ) কিংবা ঝড়ো মহাসাগর—ঝুঁকি বিবেচনা করে অঞ্চল বেছে নাও।
            </Text>
          </View>
        </View>
      </StoryCard>

      {/* Stage 2 */}
      <StoryCard accent="primary" style={styles.stageCard}>
        <View style={styles.stageContentRow}>
          <View style={[styles.stageIconBox, { backgroundColor: 'rgba(107, 138, 255, 0.15)' }]}>
            <PackageCheck size={22} color={Colors.primaryLight} />
          </View>
          <View style={styles.stageDetails}>
            <View style={styles.stageNumberRow}>
              <Text style={styles.stageNumber}>ধাপ ০২</Text>
              <Text style={styles.telemetryTag}>ওজন ভারসাম্য</Text>
            </View>
            <Text style={styles.stageTitle}>কার্গো প্যাকিং ও সরঞ্জাম ভারসাম্য</Text>
            <Text style={styles.stageDesc}>
              সর্বোচ্চ ৫০০ কেজি ওজন সীমার মধ্যে অক্সিজেন সিলিন্ডার, সোলার প্যানেল, RTG ব্যাটারি এবং আইস ড্রিল ব্যালেন্স করে ল্যান্ডারে সাজাও।
            </Text>
          </View>
        </View>
      </StoryCard>

      {/* Stage 3 */}
      <StoryCard accent="emerald" style={styles.stageCard}>
        <View style={styles.stageContentRow}>
          <View style={[styles.stageIconBox, { backgroundColor: 'rgba(94, 214, 192, 0.15)' }]}>
            <Award size={22} color={Colors.emerald} />
          </View>
          <View style={styles.stageDetails}>
            <View style={styles.stageNumberRow}>
              <Text style={styles.stageNumber}>ধাপ ০৩</Text>
              <Text style={styles.telemetryTag}>ফলাফল রিপোর্ট</Text>
            </View>
            <Text style={styles.stageTitle}>মিশন ডিব্রিফ ও এক্সপি অর্জন</Text>
            <Text style={styles.stageDesc}>
              মিশন কন্ট্রোল কম্পিউটার তোমার ওজন ভারসাম্য ও বেঁচে থাকার সম্ভাবনা বিশ্লেষণ করে স্টার রেটিং এবং সর্বোচ্চ +১১০ XP পদোন্নতি প্রদান করবে!
            </Text>
          </View>
        </View>
      </StoryCard>

      {/* Secondary Bottom Launch Action */}
      <View style={styles.bottomLaunchSection}>
        <GentleButton
          title="মিশন সিমুলেটরে প্রবেশ করো 🚀"
          onPress={() => setIsMissionActive(true)}
          variant="emerald"
          size="large"
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 18,
    paddingBottom: 48,
    maxWidth: 620,
    alignSelf: 'center',
    width: '100%',
  },
  heroCard: {
    marginBottom: 16,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  missionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(107, 138, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  missionTagText: {
    color: Colors.primaryLight,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  statusLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(94, 214, 192, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.emerald,
  },
  statusLiveText: {
    color: Colors.emerald,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindSemiBold,
  },
  heroTitle: {
    color: Colors.text,
    fontSize: Typography.size.hero,
    fontFamily: Typography.family.hindBold,
    marginBottom: 8,
  },
  heroDescription: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.notoRegular,
    marginBottom: 14,
  },
  mascotSlot: {
    marginVertical: 12,
    alignItems: 'center',
  },
  primaryLaunchBtnWrapper: {
    marginTop: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 4,
    marginTop: 8,
    marginBottom: 12,
  },
  sectionHeading: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    fontFamily: Typography.family.hindBold,
  },
  sectionCode: {
    color: Colors.textMuted,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
  },
  stageCard: {
    marginBottom: 12,
  },
  stageContentRow: {
    flexDirection: 'row',
    gap: 14,
  },
  stageIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageDetails: {
    flex: 1,
  },
  stageNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  stageNumber: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  telemetryTag: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
  },
  stageTitle: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.hindBold,
    marginBottom: 4,
  },
  stageDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoRegular,
  },
  bottomLaunchSection: {
    marginTop: 10,
    marginBottom: 20,
  },
});
