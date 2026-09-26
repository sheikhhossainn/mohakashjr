import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { DoubleBezelCard } from '../../src/components/DoubleBezelCard';
import { TactileButton } from '../../src/components/TactileButton';
import { MascotReaction } from '../../src/components/MascotReaction';
import { MoonLandingMission } from '../../src/components/mission';
import {
  Rocket,
  MapPin,
  PackageCheck,
  Award,
  Sparkles,
  Compass,
  Radio,
  Play,
  ShieldAlert,
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
      <DoubleBezelCard
        glow="cyan"
        tag="চন্দ্রাভিযান কন্ট্রোল 🚀"
        style={styles.heroMargin}
      >
        <View style={styles.tagRow}>
          <View style={styles.missionTag}>
            <Rocket size={13} color={Colors.hudCyan} />
            <Text style={styles.missionTagText}>আর্টেমিস অভিযান ১</Text>
          </View>
          <View style={styles.statusLiveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.statusLiveText}>সিমুলেশন প্রস্তুত</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>চন্দ্রপৃষ্ঠে অবতরণ মিশন 🌕</Text>
        <Text style={styles.heroDescription}>
          একজন জুনিয়র মিশন কমান্ডার হিসেবে তোমার মহাকাশযান নিরাপদে চাঁদের মাটিতে অবতরণ করানো এবং সীমিত ওজনের মধ্যে বৈজ্ঞানিক সরঞ্জাম সাজিয়ে চাঁদের ঘাঁটিতে টিকে থাকাই তোমার মূল অভিযান!
        </Text>

        {/* Astro-Buddy Encouragement Slot */}
        <View style={styles.mascotSlot}>
          <MascotReaction
            state="thinking"
            size={90}
            showSpeechBubble
            bubbleText="কমান্ডার, ল্যান্ডার প্রস্তুত! তুমি কি লুনার চ্যালেঞ্জের জন্য তৈরি?"
          />
        </View>

        {/* Primary Launch Action Button */}
        <View style={styles.primaryLaunchBtnWrapper}>
          <TactileButton
            title="চন্দ্রাভিযান শুরু করো 🚀"
            onPress={() => setIsMissionActive(true)}
            variant="gold"
            size="large"
            icon={<Play size={18} color="#0B0F19" fill="#0B0F19" />}
          />
        </View>
      </DoubleBezelCard>

      {/* 3-Stage Mission Roadmap */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>মিশনের কার্যনির্বাহী ধাপসমূহ</Text>
        <Text style={styles.sectionCode}>৩টি ইন্টারঅ্যাক্টিভ ধাপ</Text>
      </View>

      {/* Stage 1 */}
      <DoubleBezelCard
        glow="gold"
        tag="ধাপ ১: অবতরণ স্থান 📍"
        style={styles.stageMargin}
      >
        <View style={styles.stageContentRow}>
          <View style={[styles.stageIconBox, { backgroundColor: Colors.thermalGoldBg }]}>
            <MapPin size={22} color={Colors.thermalGold} />
          </View>
          <View style={styles.stageDetails}>
            <View style={styles.stageNumberRow}>
              <Text style={styles.stageNumber}>ধাপ ০১</Text>
              <Text style={styles.telemetryTag}>টেলিমেট্রি স্ক্যান</Text>
            </View>
            <Text style={styles.stageTitle}>অবতরণ অঞ্চল নির্বাচন (Site Selection)</Text>
            <Text style={styles.stageDesc}>
              দক্ষিণ মেরুর শ্যাকলটন গহ্বর (প্রচুর বরফ কিন্তু অন্ধকার), শান্ত সাগর (মসৃণ ও নিরাপদ) কিংবা ঝড়ো মহাসাগর—ঝুঁকি ও পুরষ্কার বিবেচনা করে অঞ্চল বেছে নাও।
            </Text>
          </View>
        </View>
      </DoubleBezelCard>

      {/* Stage 2 */}
      <DoubleBezelCard
        glow="cyan"
        tag="ধাপ ২: সরঞ্জাম ব্যালেন্স 📦"
        style={styles.stageMargin}
      >
        <View style={styles.stageContentRow}>
          <View style={[styles.stageIconBox, { backgroundColor: Colors.hudCyanBg }]}>
            <PackageCheck size={22} color={Colors.hudCyan} />
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
      </DoubleBezelCard>

      {/* Stage 3 */}
      <DoubleBezelCard
        glow="emerald"
        tag="ধাপ ৩: মিশন ডিব্রিফ 🏆"
        style={styles.stageMargin}
      >
        <View style={styles.stageContentRow}>
          <View style={[styles.stageIconBox, { backgroundColor: Colors.telemetryGreenBg }]}>
            <Award size={22} color={Colors.telemetryGreen} />
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
      </DoubleBezelCard>

      {/* Secondary Bottom Launch Action */}
      <View style={styles.bottomLaunchSection}>
        <TactileButton
          title="মিশন সিমুলেটরে প্রবেশ করো 🚀"
          onPress={() => setIsMissionActive(true)}
          variant="emerald"
          size="large"
        />
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
    padding: 16,
    paddingBottom: 40,
  },
  heroMargin: {
    marginBottom: 16,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  missionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.hudCyanBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 6,
  },
  missionTagText: {
    color: Colors.hudCyan,
    fontSize: Typography.size.micro,
    fontFamily: Typography.fontSans,
    fontWeight: Typography.weight.bold,
  },
  statusLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.telemetryGreenBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 5,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.telemetryGreen,
  },
  statusLiveText: {
    color: Colors.telemetryGreen,
    fontSize: Typography.size.micro,
    fontFamily: Typography.fontSans,
    fontWeight: Typography.weight.bold,
  },
  heroTitle: {
    color: Colors.text,
    fontSize: Typography.size.h1,
    fontWeight: Typography.weight.heavy,
    marginBottom: 8,
  },
  heroDescription: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    marginBottom: 12,
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
    marginBottom: 12,
  },
  sectionHeading: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    fontWeight: Typography.weight.bold,
  },
  sectionCode: {
    color: Colors.hudCyan,
    fontSize: 11,
    fontFamily: Typography.fontSans,
    letterSpacing: 0.5,
  },
  stageMargin: {
    marginBottom: 12,
  },
  stageContentRow: {
    flexDirection: 'row',
    gap: 14,
  },
  stageIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stageDetails: {
    flex: 1,
  },
  stageNumberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  stageNumber: {
    color: Colors.hudCyan,
    fontSize: Typography.size.caption,
    fontFamily: Typography.fontSans,
    fontWeight: Typography.weight.heavy,
  },
  telemetryTag: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.fontSans,
    fontWeight: Typography.weight.semiBold,
  },
  stageTitle: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    marginBottom: 4,
  },
  stageDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
  },
  bottomLaunchSection: {
    marginTop: 8,
    marginBottom: 16,
  },
});
