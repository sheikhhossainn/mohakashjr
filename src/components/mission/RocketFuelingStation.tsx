import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import Svg, { Rect, Circle, Path, Defs, LinearGradient, Stop, G, Line, Text as SvgText } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { StoryCard } from '../StoryCard';
import { GentleButton } from '../GentleButton';
import { useAppStore } from '../../state/useAppStore';
import { getTranslation } from '../../i18n/translations';
import {
  Fuel,
  Sparkles,
  Droplets,
  Gauge,
  Thermometer,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react-native';

interface RocketFuelingStationProps {
  onProceed: () => void;
  onBackToSuitUp?: () => void;
}

export const RocketFuelingStation: React.FC<RocketFuelingStationProps> = ({
  onProceed,
  onBackToSuitUp,
}) => {
  const language = useAppStore((state) => state.language);
  const t = getTranslation(language).missionGame.fueling;
  const commonT = getTranslation(language).common;

  const [fuelPercentage, setFuelPercentage] = useState(0);
  const [isPumping, setIsPumping] = useState(false);
  const pumpIntervalRef = useRef<any>(null);

  // Animated pulse for pumping
  const pumpPulseAnim = useRef(new Animated.Value(1)).current;

  const isFuelFull = fuelPercentage >= 100;

  useEffect(() => {
    if (isPumping && !isFuelFull) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pumpPulseAnim, {
            toValue: 1.05,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(pumpPulseAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pumpPulseAnim.setValue(1);
    }
  }, [isPumping, isFuelFull]);

  const startPumping = () => {
    if (isFuelFull) return;
    setIsPumping(true);

    if (pumpIntervalRef.current) clearInterval(pumpIntervalRef.current);

    pumpIntervalRef.current = setInterval(() => {
      setFuelPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(pumpIntervalRef.current);
          setIsPumping(false);
          return 100;
        }
        return Math.min(100, prev + 3);
      });
    }, 120);
  };

  const stopPumping = () => {
    setIsPumping(false);
    if (pumpIntervalRef.current) {
      clearInterval(pumpIntervalRef.current);
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (pumpIntervalRef.current) clearInterval(pumpIntervalRef.current);
    };
  }, []);

  const loxFillHeight = (fuelPercentage / 100) * 110;
  const lh2FillHeight = (fuelPercentage / 100) * 110;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Navigation */}
      <View style={styles.topBar}>
        {onBackToSuitUp && (
          <Pressable
            onPress={onBackToSuitUp}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={commonT.back}
          >
            <ChevronLeft size={20} color={Colors.textSecondary} />
            <Text style={styles.backBtnText}>{commonT.back}</Text>
          </Pressable>
        )}
        <View style={styles.stageTag}>
          <Text style={styles.stageTagText}>ধাপ ২ / ৫ • STAGE 2</Text>
        </View>
      </View>

      {/* Header Info */}
      <View style={styles.headerBlock}>
        <Text style={styles.title}>{t.heading}</Text>
        <Text style={styles.subtitle}>{t.desc}</Text>
      </View>

      {/* Illustrated Launchpad Tower & Rocket Fueling Tank */}
      <StoryCard accent="cyan" style={styles.sceneCard}>
        <View style={styles.sceneWrapper}>
          <Svg width={280} height={210} viewBox="0 0 280 210">
            <Defs>
              <LinearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#0B0D1F" />
                <Stop offset="100%" stopColor="#1A2045" />
              </LinearGradient>
              <LinearGradient id="loxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#00F0FF" />
                <Stop offset="100%" stopColor="#0284C7" />
              </LinearGradient>
              <LinearGradient id="lh2Grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFB800" />
                <Stop offset="100%" stopColor="#EA580C" />
              </LinearGradient>
              <LinearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#F8FAFC" />
                <Stop offset="50%" stopColor="#E2E8F0" />
                <Stop offset="100%" stopColor="#94A3B8" />
              </LinearGradient>
            </Defs>

            {/* Launchpad Sky Background */}
            <Rect x="0" y="0" width="280" height="210" rx="16" fill="url(#skyGrad)" />

            {/* Distant Stars */}
            <Circle cx="30" cy="25" r="1.5" fill="#FFFFFF" opacity={0.6} />
            <Circle cx="80" cy="18" r="1" fill="#FFFFFF" opacity={0.8} />
            <Circle cx="210" cy="30" r="1.5" fill="#FFFFFF" opacity={0.7} />
            <Circle cx="250" cy="15" r="1" fill="#FFFFFF" opacity={0.5} />

            {/* Launchpad Ground Concrete */}
            <Rect x="0" y="185" width="280" height="25" fill="#1E293B" />
            <Line x1="0" y1="185" x2="280" y2="185" stroke="#475569" strokeWidth="2" />

            {/* Launch Gantry Tower (Left Structure) */}
            <G>
              {/* Main Vertical Truss Columns */}
              <Line x1="45" y1="35" x2="45" y2="185" stroke="#E11D48" strokeWidth="3" />
              <Line x1="75" y1="35" x2="75" y2="185" stroke="#E11D48" strokeWidth="3" />
              {/* Lattice Cross Braces */}
              <Line x1="45" y1="45" x2="75" y2="70" stroke="#9F1239" strokeWidth="1.5" />
              <Line x1="75" y1="45" x2="45" y2="70" stroke="#9F1239" strokeWidth="1.5" />
              <Line x1="45" y1="70" x2="75" y2="95" stroke="#9F1239" strokeWidth="1.5" />
              <Line x1="75" y1="70" x2="45" y2="95" stroke="#9F1239" strokeWidth="1.5" />
              <Line x1="45" y1="95" x2="75" y2="120" stroke="#9F1239" strokeWidth="1.5" />
              <Line x1="75" y1="95" x2="45" y2="120" stroke="#9F1239" strokeWidth="1.5" />
              <Line x1="45" y1="120" x2="75" y2="145" stroke="#9F1239" strokeWidth="1.5" />
              <Line x1="75" y1="120" x2="45" y2="145" stroke="#9F1239" strokeWidth="1.5" />
              <Line x1="45" y1="145" x2="75" y2="170" stroke="#9F1239" strokeWidth="1.5" />
              <Line x1="75" y1="145" x2="45" y2="170" stroke="#9F1239" strokeWidth="1.5" />

              {/* Fuel Feeding Umbilical Swing Arms */}
              <Path d="M 75 75 L 125 75" stroke="#64748B" strokeWidth="3" />
              <Circle cx="125" cy="75" r="3" fill={Colors.cyan} />
              <Path d="M 75 130 L 125 130" stroke="#64748B" strokeWidth="3" />
              <Circle cx="125" cy="130" r="3" fill={Colors.gold} />
            </G>

            {/* Giant Moon Rocket Centerpiece */}
            <G>
              {/* Rocket Nose Cone (Orion Capsule) */}
              <Path d="M 145 25 L 132 55 L 158 55 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
              <Line x1="145" y1="15" x2="145" y2="25" stroke="#94A3B8" strokeWidth="2" />

              {/* Rocket Core Stage Body */}
              <Rect x="132" y="55" width="26" height="110" rx="3" fill="url(#rocketBody)" stroke="#475569" strokeWidth="1.5" />

              {/* Transparent Tank Windows showing fluid fill inside core */}
              {/* LOX Tank Section (Upper) */}
              <Rect x="135" y="60" width="20" height="45" rx="2" fill="rgba(0,0,0,0.5)" />
              <Rect
                x="135"
                y={60 + (45 - (fuelPercentage / 100) * 45)}
                width="20"
                height={(fuelPercentage / 100) * 45}
                rx="2"
                fill="url(#loxGrad)"
                opacity={0.9}
              />

              {/* LH2 Tank Section (Lower) */}
              <Rect x="135" y="112" width="20" height="48" rx="2" fill="rgba(0,0,0,0.5)" />
              <Rect
                x="135"
                y={112 + (48 - (fuelPercentage / 100) * 48)}
                width="20"
                height={(fuelPercentage / 100) * 48}
                rx="2"
                fill="url(#lh2Grad)"
                opacity={0.9}
              />

              {/* Solid Rocket Boosters (Left & Right) */}
              <Rect x="120" y="70" width="10" height="85" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
              <Path d="M 125 58 L 120 70 L 130 70 Z" fill="#CBD5E1" />
              <Rect x="160" y="70" width="10" height="85" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
              <Path d="M 165 58 L 160 70 L 170 70 Z" fill="#CBD5E1" />

              {/* Rocket Engine Nozzles */}
              <Path d="M 134 165 L 131 178 L 140 178 L 137 165 Z" fill="#475569" />
              <Path d="M 143 165 L 140 178 L 149 178 L 146 165 Z" fill="#475569" />
              <Path d="M 152 165 L 149 178 L 158 178 L 155 165 Z" fill="#475569" />
            </G>

            {/* Right Side: Cryogenic Feed Pipeline & Bubbling Station */}
            <G>
              {/* Storage Cryo Tank */}
              <Rect x="205" y="95" width="55" height="88" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="2" />
              <SvgText x="212" y="110" fill="#94A3B8" fontSize="8" fontWeight="bold">CRYO TANK</SvgText>

              {/* LOX Gauge Bar */}
              <Rect x="212" y="120" width="18" height="52" rx="4" fill="#0F172A" />
              <Rect
                x="212"
                y={120 + (52 - (fuelPercentage / 100) * 52)}
                width="18"
                height={(fuelPercentage / 100) * 52}
                rx="4"
                fill="url(#loxGrad)"
              />

              {/* LH2 Gauge Bar */}
              <Rect x="236" y="120" width="18" height="52" rx="4" fill="#0F172A" />
              <Rect
                x="236"
                y={120 + (52 - (fuelPercentage / 100) * 52)}
                width="18"
                height={(fuelPercentage / 100) * 52}
                rx="4"
                fill="url(#lh2Grad)"
              />

              {/* Pipeline connecting Cryo Tank to Rocket */}
              <Path d="M 205 140 L 158 140" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray={isPumping ? '4 2' : 'none'} />
            </G>
          </Svg>
        </View>

        {/* Live Pressure Readout */}
        <View style={styles.pressureHUD}>
          <View style={styles.hudStat}>
            <View style={styles.hudLabelRow}>
              <Droplets size={14} color={Colors.cyan} />
              <Text style={styles.hudLabel}>{t.loxLabel}</Text>
            </View>
            <Text style={[styles.hudValue, { color: Colors.cyan }]}>{fuelPercentage}%</Text>
            <Text style={styles.hudSub}>{t.loxTemp}</Text>
          </View>

          <View style={styles.hudDivider} />

          <View style={styles.hudStat}>
            <View style={styles.hudLabelRow}>
              <Droplets size={14} color={Colors.gold} />
              <Text style={styles.hudLabel}>{t.lh2Label}</Text>
            </View>
            <Text style={[styles.hudValue, { color: Colors.gold }]}>{fuelPercentage}%</Text>
            <Text style={styles.hudSub}>{t.lh2Temp}</Text>
          </View>
        </View>
      </StoryCard>

      {/* Interactive Pump Control */}
      <StoryCard accent={isFuelFull ? 'emerald' : 'primary'} style={styles.controlCard}>
        <View style={styles.statusHeader}>
          {isFuelFull ? (
            <CheckCircle2 size={20} color={Colors.emerald} />
          ) : (
            <Gauge size={20} color={isPumping ? Colors.gold : Colors.primaryLight} />
          )}
          <Text style={[styles.statusTitle, isFuelFull && { color: Colors.emerald }]}>
            {isFuelFull ? t.pumpComplete : isPumping ? t.pumping : t.holdToPump}
          </Text>
        </View>

        {/* Big Tactile Hold-To-Pump Pad */}
        <View style={styles.pumpButtonWrapper}>
          <Animated.View style={{ transform: [{ scale: pumpPulseAnim }], width: '100%' }}>
            <Pressable
              onPressIn={startPumping}
              onPressOut={stopPumping}
              disabled={isFuelFull}
              style={({ pressed }) => [
                styles.pumpButton,
                isFuelFull && styles.pumpButtonDisabled,
                pressed && !isFuelFull && styles.pumpButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={t.holdToPump}
            >
              <Fuel size={28} color={isFuelFull ? Colors.emeraldDark : '#FFFFFF'} />
              <Text style={[styles.pumpButtonText, isFuelFull && styles.pumpButtonTextFull]}>
                {isFuelFull ? 'জ্বালানি ভরার কাজ সম্পন্ন' : isPumping ? 'পাম্প হচ্ছে... ধরে রাখো!' : 'চেপে ধরে জ্বালানি পাম্প করো'}
              </Text>
              <Text style={[styles.pumpButtonSub, isFuelFull && styles.pumpButtonSubFull]}>
                {isFuelFull ? 'প্রেশার ব্যালেন্স ১০০%' : `${fuelPercentage}% / ১০০%`}
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </StoryCard>

      {/* NASA Scientific Insight */}
      <StoryCard accent="gold" style={styles.factCard}>
        <View style={styles.factHeader}>
          <Sparkles size={16} color={Colors.gold} />
          <Text style={styles.factTitle}>বৈজ্ঞানিক তথ্য • NASA SCIENCE</Text>
        </View>
        <Text style={styles.factContent}>{t.fact}</Text>
      </StoryCard>

      {/* Action Next Step */}
      <View style={styles.bottomSection}>
        {isFuelFull ? (
          <GentleButton
            title={t.proceedBtn}
            onPress={onProceed}
            variant="emerald"
            size="large"
            fullWidth
          />
        ) : (
          <GentleButton
            title="দ্রুত ১০০% জ্বালানি পূর্ণ করো"
            onPress={() => setFuelPercentage(100)}
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
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stageTagText: {
    color: Colors.cyan,
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
  sceneCard: {
    padding: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  sceneWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
  },
  pressureHUD: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  hudStat: {
    flex: 1,
    alignItems: 'center',
  },
  hudLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  hudLabel: {
    color: '#CBD5E1',
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.headingSemi,
  },
  hudValue: {
    fontSize: Typography.size.h2,
    fontFamily: Typography.family.heading,
  },
  hudSub: {
    color: '#94A3B8',
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
  },
  hudDivider: {
    width: 1,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  controlCard: {
    padding: 14,
    marginBottom: 14,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statusTitle: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.heading,
  },
  pumpButtonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  pumpButton: {
    backgroundColor: '#0284C7',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderBottomWidth: 4,
    borderBottomColor: '#0369A1',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  pumpButtonPressed: {
    backgroundColor: '#0369A1',
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  pumpButtonDisabled: {
    backgroundColor: Colors.emeraldBg,
    borderBottomColor: Colors.emeraldDark,
    borderBottomWidth: 3,
    borderWidth: 2,
    borderColor: Colors.emerald,
  },
  pumpButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.size.body,
    fontFamily: Typography.family.heading,
    marginTop: 6,
  },
  pumpButtonTextFull: {
    color: Colors.emeraldDark,
  },
  pumpButtonSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.headingSemi,
    marginTop: 2,
  },
  pumpButtonSubFull: {
    color: Colors.emerald,
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
