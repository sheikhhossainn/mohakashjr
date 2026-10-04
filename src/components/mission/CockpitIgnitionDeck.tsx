import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Easing } from 'react-native';
import Svg, { Rect, Circle, Path, Defs, LinearGradient, Stop, G, Line, Polygon, Text as SvgText } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { StoryCard } from '../StoryCard';
import { GentleButton } from '../GentleButton';
import { useAppStore } from '../../state/useAppStore';
import { getTranslation } from '../../i18n/translations';
import {
  Flame,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Radio,
  Compass,
  CheckCircle2,
  ChevronLeft,
  AlertTriangle,
} from 'lucide-react-native';

interface CockpitIgnitionDeckProps {
  onProceed: () => void;
  onBackToFueling?: () => void;
}

export const CockpitIgnitionDeck: React.FC<CockpitIgnitionDeckProps> = ({
  onProceed,
  onBackToFueling,
}) => {
  const language = useAppStore((state) => state.language);
  const t = getTranslation(language).missionGame.ignition;
  const commonT = getTranslation(language).common;

  // 3 Safety Switches
  const [switches, setSwitches] = useState({
    gyro: false,
    lifeSupport: false,
    telemetry: false,
  });

  const allSwitchesOn = switches.gyro && switches.lifeSupport && switches.telemetry;

  // Ignition & Liftoff Sequence State
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isLaunched, setIsLaunched] = useState(false);
  const [isIgniting, setIsIgniting] = useState(false);

  // Animations
  const cockpitShakeAnim = useRef(new Animated.Value(0)).current;
  const rocketAltitudeAnim = useRef(new Animated.Value(0)).current;
  const buttonPulseAnim = useRef(new Animated.Value(1)).current;

  // Pulsing ignition button when armed
  useEffect(() => {
    if (allSwitchesOn && !isLaunched && !isIgniting) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonPulseAnim, {
            toValue: 1.04,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(buttonPulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      buttonPulseAnim.setValue(1);
    }
  }, [allSwitchesOn, isLaunched, isIgniting]);

  const toggleSwitch = (key: 'gyro' | 'lifeSupport' | 'telemetry') => {
    if (isIgniting || isLaunched) return;
    setSwitches((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleStartIgnition = () => {
    if (!allSwitchesOn || isIgniting || isLaunched) return;

    setIsIgniting(true);
    setCountdown(3);

    // Rumble Cockpit Shake
    Animated.loop(
      Animated.sequence([
        Animated.timing(cockpitShakeAnim, {
          toValue: -3,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(cockpitShakeAnim, {
          toValue: 3,
          duration: 60,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Countdown 3, 2, 1, 0 Liftoff
    const countTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countTimer);
          setIsLaunched(true);
          setIsIgniting(false);

          // Rocket ascending animation into orbit
          Animated.timing(rocketAltitudeAnim, {
            toValue: 1,
            duration: 2500,
            easing: Easing.in(Easing.quad),
            useNativeDriver: false,
          }).start();

          // Stop cockpit shake after liftoff
          setTimeout(() => {
            cockpitShakeAnim.setValue(0);
          }, 2000);

          return 0;
        }
        return prev - 1;
      });
    }, 900);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Navigation */}
      <View style={styles.topBar}>
        {onBackToFueling && (
          <Pressable
            onPress={onBackToFueling}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={commonT.back}
          >
            <ChevronLeft size={20} color={Colors.textSecondary} />
            <Text style={styles.backBtnText}>{commonT.back}</Text>
          </Pressable>
        )}
        <View style={styles.stageTag}>
          <Text style={styles.stageTagText}>ধাপ ৩ / ৫ • STAGE 3</Text>
        </View>
      </View>

      {/* Header Info */}
      <View style={styles.headerBlock}>
        <Text style={styles.title}>{t.heading}</Text>
        <Text style={styles.subtitle}>{t.desc}</Text>
      </View>

      {/* Illustrated Cockpit Viewscreen */}
      <Animated.View style={{ transform: [{ translateX: cockpitShakeAnim }] }}>
        <StoryCard accent={isLaunched ? 'emerald' : allSwitchesOn ? 'gold' : 'primary'} style={styles.cockpitCard}>
          <View style={styles.windshieldWrapper}>
            <Svg width={290} height={190} viewBox="0 0 290 190">
              <Defs>
                {/* Pre-launch blue sky gradient */}
                <LinearGradient id="cockpitSky" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor={isLaunched ? '#050716' : '#0369A1'} />
                  <Stop offset="60%" stopColor={isLaunched ? '#0B0F2A' : '#38BDF8'} />
                  <Stop offset="100%" stopColor={isLaunched ? '#1A2045' : '#BAE6FD'} />
                </LinearGradient>
                <LinearGradient id="thrustFlame" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#FFFFFF" />
                  <Stop offset="30%" stopColor="#FACC15" />
                  <Stop offset="70%" stopColor="#EA580C" />
                  <Stop offset="100%" stopColor="rgba(234, 88, 12, 0)" />
                </LinearGradient>
              </Defs>

              {/* Windshield Glass Frame */}
              <Rect x="0" y="0" width="290" height="190" rx="18" fill="url(#cockpitSky)" />

              {/* Stars visible when launched */}
              {isLaunched && (
                <G>
                  <Circle cx="35" cy="30" r="1.5" fill="#FFFFFF" />
                  <Circle cx="85" cy="20" r="1" fill="#FFFFFF" />
                  <Circle cx="160" cy="35" r="1.5" fill="#FFFFFF" />
                  <Circle cx="240" cy="25" r="1.5" fill="#FFFFFF" />
                  <Circle cx="210" cy="70" r="1" fill="#FFFFFF" />
                  <Circle cx="50" cy="85" r="1" fill="#FFFFFF" />
                  {/* Distant Earth curve */}
                  <Path d="M 0 160 Q 145 130 290 160 L 290 190 L 0 190 Z" fill="#0284C7" opacity={0.6} />
                  <Path d="M 0 160 Q 145 130 290 160" stroke="#38BDF8" strokeWidth="2" fill="none" opacity={0.8} />
                </G>
              )}

              {/* Clouds if on ground or taking off */}
              {!isLaunched && (
                <G opacity={0.7}>
                  <Circle cx="50" cy="140" r="30" fill="#FFFFFF" />
                  <Circle cx="80" cy="130" r="25" fill="#FFFFFF" />
                  <Circle cx="120" cy="145" r="30" fill="#FFFFFF" />
                  <Circle cx="200" cy="140" r="35" fill="#FFFFFF" />
                  <Circle cx="240" cy="135" r="25" fill="#FFFFFF" />
                </G>
              )}

              {/* Windshield Struts / Dashboard Horizon */}
              <Line x1="145" y1="0" x2="145" y2="190" stroke="#334155" strokeWidth="3" opacity={0.8} />
              <Path d="M 0 145 L 290 145" stroke="#334155" strokeWidth="4" />
              <Rect x="0" y="145" width="290" height="45" fill="#1E293B" />

              {/* Pilot Telemetry Crosshair / HUD Overlay */}
              <G opacity={0.75}>
                <Circle cx="145" cy="85" r="28" stroke={Colors.cyan} strokeWidth="1" fill="none" strokeDasharray="4 2" />
                <Line x1="105" y1="85" x2="125" y2="85" stroke={Colors.cyan} strokeWidth="1.5" />
                <Line x1="165" y1="85" x2="185" y2="85" stroke={Colors.cyan} strokeWidth="1.5" />
                <Line x1="145" y1="45" x2="145" y2="65" stroke={Colors.cyan} strokeWidth="1.5" />
                <Line x1="145" y1="105" x2="145" y2="125" stroke={Colors.cyan} strokeWidth="1.5" />
              </G>

              {/* Dashboard Gauges */}
              <G>
                {/* Speed Gauge */}
                <Circle cx="50" cy="168" r="14" fill="#0F172A" stroke="#475569" strokeWidth="1" />
                <SvgText x="40" y="172" fill={Colors.gold} fontSize="9" fontWeight="bold">
                  {isLaunched ? '11.2k' : '0.0'}
                </SvgText>
                {/* Altitude Gauge */}
                <Circle cx="240" cy="168" r="14" fill="#0F172A" stroke="#475569" strokeWidth="1" />
                <SvgText x="230" y="172" fill={Colors.cyan} fontSize="9" fontWeight="bold">
                  {isLaunched ? '180k' : '0.1k'}
                </SvgText>
              </G>

              {/* Liftoff Plume effect underneath when launching */}
              {(isIgniting || (isLaunched && countdown === 0)) && (
                <G>
                  <Path d="M 125 145 Q 145 185 165 145 Z" fill="url(#thrustFlame)" />
                  <Circle cx="145" cy="148" r="12" fill="#FFFFFF" opacity={0.9} />
                </G>
              )}
            </Svg>
          </View>

          {/* Status Bar */}
          <View style={styles.cockpitStatus}>
            {isLaunched ? (
              <View style={styles.launchConfirmedRow}>
                <Sparkles size={16} color={Colors.emerald} />
                <Text style={styles.launchConfirmedText}>{t.liftoff}</Text>
              </View>
            ) : isIgniting ? (
              <View style={styles.countdownRow}>
                <Flame size={18} color="#FF6B35" />
                <Text style={styles.countdownText}>
                  টি-মাইনাস {countdown} সেকেন্ড...
                </Text>
              </View>
            ) : (
              <Text style={styles.hudStatusText}>
                {allSwitchesOn ? 'সব সিস্টেম সক্রিয় • ইগনিশনের জন্য প্রস্তুত' : t.needSwitches}
              </Text>
            )}
          </View>
        </StoryCard>
      </Animated.View>

      {/* 3 Pre-Flight Safety Switches */}
      <View style={styles.switchesContainer}>
        {/* Switch 1: Gyro */}
        <Pressable
          onPress={() => toggleSwitch('gyro')}
          style={({ pressed }) => [
            styles.switchCard,
            switches.gyro && styles.switchCardOn,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t.switch1}
        >
          <View style={styles.switchIconBox}>
            <Compass size={20} color={switches.gyro ? Colors.cyan : Colors.textMuted} />
          </View>
          <View style={styles.switchDetails}>
            <Text style={styles.switchTitle}>{t.switch1}</Text>
            <Text style={styles.switchSub}>{switches.gyro ? 'সক্রিয়' : 'অফ'}</Text>
          </View>
          {switches.gyro ? (
            <ToggleRight size={28} color={Colors.cyan} />
          ) : (
            <ToggleLeft size={28} color={Colors.textMuted} />
          )}
        </Pressable>

        {/* Switch 2: Life Support */}
        <Pressable
          onPress={() => toggleSwitch('lifeSupport')}
          style={({ pressed }) => [
            styles.switchCard,
            switches.lifeSupport && styles.switchCardOn,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t.switch2}
        >
          <View style={styles.switchIconBox}>
            <ShieldCheck size={20} color={switches.lifeSupport ? Colors.emerald : Colors.textMuted} />
          </View>
          <View style={styles.switchDetails}>
            <Text style={styles.switchTitle}>{t.switch2}</Text>
            <Text style={styles.switchSub}>{switches.lifeSupport ? 'কেবিন প্রেশারাইজড' : 'অফ'}</Text>
          </View>
          {switches.lifeSupport ? (
            <ToggleRight size={28} color={Colors.emerald} />
          ) : (
            <ToggleLeft size={28} color={Colors.textMuted} />
          )}
        </Pressable>

        {/* Switch 3: Telemetry Radio */}
        <Pressable
          onPress={() => toggleSwitch('telemetry')}
          style={({ pressed }) => [
            styles.switchCard,
            switches.telemetry && styles.switchCardOn,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t.switch3}
        >
          <View style={styles.switchIconBox}>
            <Radio size={20} color={switches.telemetry ? Colors.gold : Colors.textMuted} />
          </View>
          <View style={styles.switchDetails}>
            <Text style={styles.switchTitle}>{t.switch3}</Text>
            <Text style={styles.switchSub}>{switches.telemetry ? 'সিগন্যাল লিঙ্কড' : 'অফ'}</Text>
          </View>
          {switches.telemetry ? (
            <ToggleRight size={28} color={Colors.gold} />
          ) : (
            <ToggleLeft size={28} color={Colors.textMuted} />
          )}
        </Pressable>
      </View>

      {/* Big Tactile Red Ignition Button */}
      {!isLaunched && (
        <View style={styles.ignitionWrapper}>
          <Animated.View style={{ transform: [{ scale: buttonPulseAnim }], width: '100%' }}>
            <Pressable
              onPress={handleStartIgnition}
              disabled={!allSwitchesOn || isIgniting}
              style={({ pressed }) => [
                styles.ignitionButton,
                !allSwitchesOn && styles.ignitionButtonDisabled,
                allSwitchesOn && styles.ignitionButtonArmed,
                pressed && allSwitchesOn && styles.ignitionButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={t.ignitionBtn}
            >
              <Flame size={28} color="#FFFFFF" />
              <Text style={styles.ignitionButtonText}>
                {isIgniting ? 'ইগনিশন চালু হচ্ছে...' : allSwitchesOn ? t.ignitionBtn : 'সুইচ ৩টি অন করো'}
              </Text>
              <Text style={styles.ignitionButtonSub}>
                {allSwitchesOn ? 'মেইন থ্রাস্টার ফায়ার করো' : 'লক অন'}
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      )}

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
        {isLaunched ? (
          <GentleButton
            title={t.proceedBtn}
            onPress={onProceed}
            variant="emerald"
            size="large"
            fullWidth
          />
        ) : (
          <GentleButton
            title="সব সুইচ স্বয়ংক্রিয়ভাবে অন করো"
            onPress={() => setSwitches({ gyro: true, lifeSupport: true, telemetry: true })}
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
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stageTagText: {
    color: '#FF6B35',
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
  cockpitCard: {
    padding: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  windshieldWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  cockpitStatus: {
    marginTop: 10,
    alignItems: 'center',
  },
  hudStatusText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoSemiBold,
  },
  launchConfirmedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  launchConfirmedText: {
    color: Colors.emerald,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.heading,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countdownText: {
    color: '#FF6B35',
    fontSize: Typography.size.body,
    fontFamily: Typography.family.heading,
  },
  switchesContainer: {
    gap: 10,
    marginBottom: 14,
  },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 12,
  },
  switchCardOn: {
    borderColor: 'rgba(94, 214, 192, 0.4)',
    backgroundColor: 'rgba(94, 214, 192, 0.05)',
  },
  switchIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchDetails: {
    flex: 1,
  },
  switchTitle: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.heading,
    marginBottom: 2,
  },
  switchSub: {
    color: Colors.textSecondary,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
  },
  ignitionWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 14,
  },
  ignitionButton: {
    backgroundColor: '#DC2626',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderBottomWidth: 4,
    borderBottomColor: '#991B1B',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  ignitionButtonArmed: {
    backgroundColor: '#E11D48',
    borderBottomColor: '#9F1239',
  },
  ignitionButtonPressed: {
    backgroundColor: '#9F1239',
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  ignitionButtonDisabled: {
    backgroundColor: '#334155',
    borderBottomColor: '#1E293B',
    shadowOpacity: 0,
    elevation: 0,
  },
  ignitionButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.size.body,
    fontFamily: Typography.family.heading,
    marginTop: 6,
  },
  ignitionButtonSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
    marginTop: 2,
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
