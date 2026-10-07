import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Easing } from 'react-native';
import Svg, { Rect, Circle, Path, Defs, LinearGradient, Stop, G, Line, Ellipse } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { StoryCard } from '../StoryCard';
import { GentleButton } from '../GentleButton';
import { useAppStore } from '../../state/useAppStore';
import { getTranslation } from '../../i18n/translations';
import {
  LunarRegion,
  LUNAR_REGIONS,
} from '../../content/missionData';
import {
  Rocket,
  Flame,
  BookOpen,
  MapPin,
  Compass,
  CheckCircle2,
  ChevronLeft,
  ShieldAlert,
} from 'lucide-react-native';

interface LunarDescentModuleProps {
  onProceed: (selectedSite: LunarRegion) => void;
  onBackToIgnition?: () => void;
}

export const LunarDescentModule: React.FC<LunarDescentModuleProps> = ({
  onProceed,
  onBackToIgnition,
}) => {
  const language = useAppStore((state) => state.language);
  const t = getTranslation(language).missionGame.descent;
  const commonT = getTranslation(language).common;

  // Selected landing site
  const [selectedSite, setSelectedSite] = useState<LunarRegion>(LUNAR_REGIONS[0]);

  // Descent simulator state
  const [isSimulating, setIsSimulating] = useState(false);
  const [altitudeKm, setAltitudeKm] = useState(100);
  const [velocityMs, setVelocityMs] = useState(85);
  const [isTouchdown, setIsTouchdown] = useState(false);
  const [isThrusterFiring, setIsThrusterFiring] = useState(false);

  // Animations
  const landerVerticalAnim = useRef(new Animated.Value(0)).current;
  const landerRumbleAnim = useRef(new Animated.Value(0)).current;
  const touchdownShakeAnim = useRef(new Animated.Value(0)).current;
  const dustAnim = useRef(new Animated.Value(0)).current;

  // Simulator loop
  useEffect(() => {
    let interval: any = null;

    if (isSimulating && !isTouchdown) {
      interval = setInterval(() => {
        setAltitudeKm((prevAlt) => {
          if (prevAlt <= 2) {
            clearInterval(interval);
            setIsTouchdown(true);
            setIsSimulating(false);
            setVelocityMs(0);

            // Touchdown shake & dust plume
            Animated.sequence([
              Animated.timing(touchdownShakeAnim, { toValue: 5, duration: 60, useNativeDriver: true }),
              Animated.timing(touchdownShakeAnim, { toValue: -5, duration: 60, useNativeDriver: true }),
              Animated.timing(touchdownShakeAnim, { toValue: 2, duration: 60, useNativeDriver: true }),
              Animated.timing(touchdownShakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
            ]).start();
            dustAnim.setValue(0);
            Animated.timing(dustAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();

            return 0;
          }

          // Natural gravity pull accelerates fall
          setVelocityMs((prevVel) => {
            const adjusted = isThrusterFiring ? Math.max(8, prevVel - 14) : Math.min(120, prevVel + 5);
            return adjusted;
          });

          return Math.max(0, prevAlt - 4);
        });
      }, 350);

      // Micro rumble
      Animated.loop(
        Animated.sequence([
          Animated.timing(landerRumbleAnim, {
            toValue: -2,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(landerRumbleAnim, {
            toValue: 2,
            duration: 80,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      landerRumbleAnim.setValue(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating, isTouchdown, isThrusterFiring]);

  const fireBrakes = () => {
    if (isTouchdown) return;
    setIsThrusterFiring(true);
    setVelocityMs((prev) => Math.max(6, prev - 18));
    setTimeout(() => {
      setIsThrusterFiring(false);
    }, 450);
  };

  const handleStartDescent = () => {
    setIsSimulating(true);
    setAltitudeKm(100);
    setVelocityMs(85);
    setIsTouchdown(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Navigation */}
      <View style={styles.topBar}>
        {onBackToIgnition && (
          <Pressable
            onPress={onBackToIgnition}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={commonT.back}
          >
            <ChevronLeft size={20} color={Colors.textSecondary} />
            <Text style={styles.backBtnText}>{commonT.back}</Text>
          </Pressable>
        )}
        <View style={styles.stageTag}>
          <Text style={styles.stageTagText}>ধাপ ৪ / ৫ • STAGE 4</Text>
        </View>
      </View>

      {/* Header Info */}
      <View style={styles.headerBlock}>
        <Text style={styles.title}>{t.heading}</Text>
        <Text style={styles.subtitle}>{t.desc}</Text>
      </View>

      {/* Landing Site Selection Chips */}
      <View style={styles.siteSelectorRow}>
        {LUNAR_REGIONS.map((region) => {
          const isSelected = selectedSite.id === region.id;
          return (
            <Pressable
              key={region.id}
              onPress={() => setSelectedSite(region)}
              style={({ pressed }) => [
                styles.siteChip,
                isSelected && styles.siteChipSelected,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={region.name_bn}
            >
              <MapPin size={16} color={isSelected ? Colors.gold : Colors.textMuted} />
              <View style={styles.siteChipContent}>
                <Text style={[styles.siteChipTitle, isSelected && styles.siteChipTitleSelected]}>
                  {region.name_bn}
                </Text>
                <Text style={styles.siteChipSub}>{region.coordinates}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Illustrated Lunar Descent View */}
      <Animated.View style={{ transform: [{ translateX: Animated.add(landerRumbleAnim, touchdownShakeAnim) }] }}>
        <StoryCard accent={isTouchdown ? 'emerald' : 'gold'} style={styles.sceneCard}>
          <View style={styles.radarWrapper}>
            <Svg width={290} height={200} viewBox="0 0 290 200">
              <Defs>
                <LinearGradient id="lunarSky" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#050716" />
                  <Stop offset="100%" stopColor="#0F1128" />
                </LinearGradient>
                <LinearGradient id="lunarGround" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#64748B" />
                  <Stop offset="40%" stopColor="#475569" />
                  <Stop offset="100%" stopColor="#1E293B" />
                </LinearGradient>
                <LinearGradient id="retroFlame" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#FFB800" />
                  <Stop offset="80%" stopColor="#EA580C" />
                  <Stop offset="100%" stopColor="transparent" />
                </LinearGradient>
              </Defs>

              {/* Space Void Background */}
              <Rect x="0" y="0" width="290" height="200" rx="16" fill="url(#lunarSky)" />

              {/* Twinkling Stars */}
              <Circle cx="20" cy="25" r="1.5" fill="#FFFFFF" opacity={0.6} />
              <Circle cx="70" cy="15" r="1" fill="#FFFFFF" opacity={0.8} />
              <Circle cx="210" cy="30" r="1" fill="#FFFFFF" opacity={0.7} />
              <Circle cx="260" cy="20" r="1.5" fill="#FFFFFF" opacity={0.5} />

              {/* Distant Blue Marble Earth */}
              <Circle cx="240" cy="45" r="14" fill="#0284C7" />
              <Circle cx="240" cy="45" r="13" fill="#0EA5E9" />
              <Path d="M 233 42 Q 242 36 248 44 Q 244 52 236 49 Z" fill="#22C55E" opacity={0.8} />
              <Path d="M 230 45 Q 240 40 245 42" stroke="#FFFFFF" strokeWidth="2" opacity={0.5} />

              {/* Lunar Surface with Impact Craters */}
              <Path d="M 0 160 Q 60 148 120 156 Q 190 168 290 150 L 290 200 L 0 200 Z" fill="url(#lunarGround)" />
              {/* Crater 1 */}
              <Circle cx="50" cy="175" r="16" fill="#334155" />
              <Circle cx="52" cy="177" r="13" fill="#1E293B" />
              {/* Crater 2 (Target Zone) */}
              <Circle cx="160" cy="178" r="22" fill="#334155" />
              <Circle cx="162" cy="180" r="18" fill="#1E293B" />
              {/* Radar Target Rings on selected crater */}
              <Circle cx="162" cy="180" r="26" stroke={Colors.gold} strokeWidth="1.5" strokeDasharray="4 2" fill="none" />

              {/* Descending Lunar Lander */}
              {/* Calculated Lander Y position based on altitude (100km -> y:25, 0km -> y:135) */}
              {(() => {
                const landerY = 25 + ((100 - altitudeKm) / 100) * 110;
                return (
                  <G>
                    {/* Retro-thruster plume firing when braking */}
                    {isThrusterFiring && (
                      <G>
                        <Path d={`M 158 ${landerY + 22} L 162 ${landerY + 44} L 166 ${landerY + 22} Z`} fill="url(#retroFlame)" />
                        <Circle cx="162" cy={landerY + 24} r="4" fill="#FFFFFF" />
                      </G>
                    )}

                    {/* Touchdown Dust Plumes */}
                    {isTouchdown && (
                      <G>
                        <Ellipse cx="132" cy={landerY + 30} rx="16" ry="6" fill="#CBD5E1" opacity={0.65} />
                        <Ellipse cx="192" cy={landerY + 30} rx="16" ry="6" fill="#CBD5E1" opacity={0.65} />
                        <Circle cx="120" cy={landerY + 26} r="4" fill="#94A3B8" opacity={0.7} />
                        <Circle cx="204" cy={landerY + 26} r="4" fill="#94A3B8" opacity={0.7} />
                        <Circle cx="128" cy={landerY + 20} r="2.5" fill="#E2E8F0" opacity={0.8} />
                        <Circle cx="196" cy={landerY + 20} r="2.5" fill="#E2E8F0" opacity={0.8} />
                      </G>
                    )}

                    {/* Lander Octagonal Body */}
                    <Rect x="148" y={landerY} width="28" height="20" rx="4" fill="#FFC86B" stroke="#D97706" strokeWidth="1.5" />
                    {/* Crew Ascent Cabin */}
                    <Circle cx="162" cy={landerY - 4} r="9" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                    <Circle cx="162" cy={landerY - 4} r="4" fill="#0284C7" />

                    {/* 4 Lander Landing Legs */}
                    <Line x1="148" y1={landerY + 16} x2="138" y2={landerY + 28} stroke="#CBD5E1" strokeWidth="2" />
                    <Line x1="176" y1={landerY + 16} x2="186" y2={landerY + 28} stroke="#CBD5E1" strokeWidth="2" />
                    {/* Footpads */}
                    <Circle cx="138" cy={landerY + 28} r="3" fill="#64748B" />
                    <Circle cx="186" cy={landerY + 28} r="3" fill="#64748B" />
                  </G>
                );
              })()}
            </Svg>
          </View>

          {/* Telemetry Readout */}
          <View style={styles.hudRow}>
            <View style={styles.hudItem}>
              <Text style={styles.hudLabel}>{t.altitude}</Text>
              <Text style={styles.hudVal}>{altitudeKm} কিমি</Text>
            </View>
            <View style={styles.hudDivider} />
            <View style={styles.hudItem}>
              <Text style={styles.hudLabel}>{t.velocity}</Text>
              <Text style={[styles.hudVal, velocityMs > 30 ? { color: Colors.gold } : { color: Colors.emerald }]}>
                {velocityMs} মি/সে
              </Text>
            </View>
          </View>

          {/* Status Message */}
          <View style={styles.statusRow}>
            {isTouchdown ? (
              <View style={styles.touchdownBadge}>
                <CheckCircle2 size={16} color={Colors.emerald} />
                <Text style={styles.touchdownText}>{t.touchdownConfirmed}</Text>
              </View>
            ) : isSimulating ? (
              <Text style={styles.simulatingText}>
                {velocityMs > 40 ? 'গতি বেশি! রেট্রো থ্রাস্টার ফায়ার করো!' : 'ল্যান্ডিং গতি নিয়ন্ত্রিত'}
              </Text>
            ) : (
              <Text style={styles.readyText}>অবতরণ শুরু করতে নিচে ট্যাপ করো</Text>
            )}
          </View>
        </StoryCard>
      </Animated.View>

      {/* Thruster Controls */}
      <View style={styles.controlBox}>
        {!isSimulating && !isTouchdown && (
          <GentleButton
            title="অবতরণ সিকোয়েন্স শুরু করো"
            onPress={handleStartDescent}
            variant="gold"
            size="large"
            fullWidth
          />
        )}

        {isSimulating && (
          <Pressable
            onPress={fireBrakes}
            style={({ pressed }) => [
              styles.brakeButton,
              pressed && styles.brakeButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={t.brakeBtn}
          >
            <Flame size={24} color="#FFFFFF" />
            <Text style={styles.brakeButtonText}>{t.brakeBtn}</Text>
          </Pressable>
        )}
      </View>

      {/* NASA Scientific Insight */}
      <StoryCard accent="gold" style={styles.factCard}>
        <View style={styles.factHeader}>
          <BookOpen size={16} color={Colors.gold} />
          <Text style={styles.factTitle}>বৈজ্ঞানিক তথ্য • NASA SCIENCE</Text>
        </View>
        <Text style={styles.factContent}>{t.fact}</Text>
      </StoryCard>

      {/* Next Step */}
      <View style={styles.bottomSection}>
        {isTouchdown ? (
          <GentleButton
            title={t.proceedBtn}
            onPress={() => onProceed(selectedSite)}
            variant="emerald"
            size="large"
            fullWidth
          />
        ) : (
          <GentleButton
            title="স্বয়ংক্রিয় নিখুঁত টাচডাউন করো"
            onPress={() => {
              setAltitudeKm(0);
              setVelocityMs(0);
              setIsTouchdown(true);
              setIsSimulating(false);
            }}
            variant="gold"
            size="normal"
            fullWidth
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 620,
    alignSelf: 'center',
    width: '100%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  backBtnText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
  },
  stageTag: {
    backgroundColor: 'rgba(255, 200, 107, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stageTagText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.heading,
  },
  headerBlock: {
    marginBottom: 14,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.size.hero,
    fontFamily: Typography.family.heading,
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.notoRegular,
  },
  siteSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  siteChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 6,
  },
  siteChipSelected: {
    borderColor: Colors.gold,
    backgroundColor: 'rgba(255, 200, 107, 0.1)',
  },
  siteChipContent: {
    flex: 1,
  },
  siteChipTitle: {
    color: Colors.text,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.heading,
  },
  siteChipTitleSelected: {
    color: Colors.gold,
  },
  siteChipSub: {
    color: Colors.textMuted,
    fontSize: 12,
    fontFamily: Typography.family.notoRegular,
  },
  sceneCard: {
    padding: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  radarWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  hudRow: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  hudItem: {
    flex: 1,
    alignItems: 'center',
  },
  hudLabel: {
    color: '#CBD5E1',
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.headingSemi,
  },
  hudVal: {
    color: '#F8FAFC',
    fontSize: Typography.size.body,
    fontFamily: Typography.family.heading,
  },
  hudDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  statusRow: {
    marginTop: 10,
    alignItems: 'center',
  },
  touchdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(94, 214, 192, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  touchdownText: {
    color: Colors.emerald,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.heading,
  },
  simulatingText: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoSemiBold,
  },
  readyText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
  },
  controlBox: {
    marginBottom: 14,
  },
  brakeButton: {
    backgroundColor: '#EA580C',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderBottomWidth: 4,
    borderBottomColor: '#C2410C',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  brakeButtonPressed: {
    backgroundColor: '#C2410C',
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  brakeButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.size.body,
    fontFamily: Typography.family.heading,
  },
  factCard: {
    marginBottom: 16,
    padding: 14,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  factTitle: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.heading,
  },
  factContent: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoRegular,
  },
  bottomSection: {
    marginTop: 4,
  },
  pressed: {
    opacity: 0.8,
  },
});
