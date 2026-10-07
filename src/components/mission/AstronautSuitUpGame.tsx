import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import Svg, { Circle, Rect, Path, Defs, LinearGradient, Stop, G, Line } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { StoryCard } from '../StoryCard';
import { GentleButton } from '../GentleButton';
import { useAppStore } from '../../state/useAppStore';
import { getTranslation } from '../../i18n/translations';
import {
  CheckCircle2,
  Circle as CircleIcon,
  BookOpen,
  Info,
  Shield,
  Wind,
  Sun,
  Footprints,
  ChevronLeft,
} from 'lucide-react-native';

export type SuitItemId = 'cooling' | 'pressure' | 'plss' | 'helmet' | 'boots';

interface AstronautSuitUpGameProps {
  onProceed: () => void;
  onBackToHub?: () => void;
}

export const AstronautSuitUpGame: React.FC<AstronautSuitUpGameProps> = ({
  onProceed,
  onBackToHub,
}) => {
  const language = useAppStore((state) => state.language);
  const t = getTranslation(language).missionGame.suitUp;
  const commonT = getTranslation(language).common;

  const [equipped, setEquipped] = useState<Record<SuitItemId, boolean>>({
    cooling: false,
    pressure: false,
    plss: false,
    helmet: false,
    boots: false,
  });

  const [activeItemId, setActiveItemId] = useState<SuitItemId>('cooling');
  const [justEquippedName, setJustEquippedName] = useState<string | null>(null);

  // Animation values
  const mirrorScaleAnim = React.useRef(new Animated.Value(1)).current;
  const popupFadeAnim = React.useRef(new Animated.Value(0)).current;
  const popupSlideAnim = React.useRef(new Animated.Value(10)).current;
  const auraGlowAnim = React.useRef(new Animated.Value(0.2)).current;

  const equippedCount = Object.values(equipped).filter(Boolean).length;
  const isAllEquipped = equippedCount === 5;

  const toggleItem = (id: SuitItemId) => {
    setActiveItemId(id);
    const willEquip = !equipped[id];
    setEquipped((prev) => ({
      ...prev,
      [id]: willEquip,
    }));

    if (willEquip) {
      const itemDef = suitItemsList.find((i) => i.id === id);
      setJustEquippedName(itemDef?.title ?? null);

      // 1. Spring bounce on the cadet mirror
      Animated.sequence([
        Animated.timing(mirrorScaleAnim, {
          toValue: 1.06,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.spring(mirrorScaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();

      // 2. Pulse aura glow
      Animated.sequence([
        Animated.timing(auraGlowAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(auraGlowAnim, {
          toValue: 0.25,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // 3. Float-in equipped badge popup
      popupFadeAnim.setValue(0);
      popupSlideAnim.setValue(12);
      Animated.parallel([
        Animated.timing(popupFadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(popupSlideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          Animated.timing(popupFadeAnim, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
          }).start();
        }, 1400);
      });
    }
  };

  const suitItemsList: {
    id: SuitItemId;
    icon: any;
    title: string;
    desc: string;
    fact: string;
    color: string;
  }[] = [
    {
      id: 'cooling',
      icon: Wind,
      title: t.items.cooling.name,
      desc: t.items.cooling.desc,
      fact: t.items.cooling.fact,
      color: Colors.cyan,
    },
    {
      id: 'pressure',
      icon: Shield,
      title: t.items.pressure.name,
      desc: t.items.pressure.desc,
      fact: t.items.pressure.fact,
      color: Colors.primaryLight,
    },
    {
      id: 'plss',
      icon: Info,
      title: t.items.plss.name,
      desc: t.items.plss.desc,
      fact: t.items.plss.fact,
      color: Colors.emerald,
    },
    {
      id: 'helmet',
      icon: Sun,
      title: t.items.helmet.name,
      desc: t.items.helmet.desc,
      fact: t.items.helmet.fact,
      color: Colors.gold,
    },
    {
      id: 'boots',
      icon: Footprints,
      title: t.items.boots.name,
      desc: t.items.boots.desc,
      fact: t.items.boots.fact,
      color: '#E8A0BF',
    },
  ];

  const activeItem = suitItemsList.find((item) => item.id === activeItemId) || suitItemsList[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Navigation & Status */}
      <View style={styles.topBar}>
        {onBackToHub && (
          <Pressable
            onPress={onBackToHub}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={commonT.back}
          >
            <ChevronLeft size={20} color={Colors.textSecondary} />
            <Text style={styles.backBtnText}>{commonT.back}</Text>
          </Pressable>
        )}
        <View style={styles.stageTag}>
          <Text style={styles.stageTagText}>ধাপ ১ / ৫ • STAGE 1</Text>
        </View>
      </View>

      {/* Header Info */}
      <View style={styles.headerBlock}>
        <Text style={styles.title}>{t.heading}</Text>
        <Text style={styles.subtitle}>{t.desc}</Text>
      </View>

      {/* Main Preparation Airlock Stage */}
      <StoryCard accent="primary" style={styles.stageCard}>
        {/* Readiness Meter */}
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>
            {t.progressText} {equippedCount} / 5
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(equippedCount / 5) * 100}%` }]} />
          </View>
          {isAllEquipped && (
            <View style={styles.readyBadge}>
              <CheckCircle2 size={13} color={Colors.gold} />
              <Text style={styles.readyBadgeText}>১০০%</Text>
            </View>
          )}
        </View>

        {/* Animated Equip Toast Popup */}
        {justEquippedName && (
          <Animated.View
            style={[
              styles.equipPopupBadge,
              {
                opacity: popupFadeAnim,
                transform: [{ translateY: popupSlideAnim }],
              },
            ]}
          >
            <CheckCircle2 size={14} color={Colors.gold} />
            <Text style={styles.equipPopupText}>
              {language === 'en' ? `Equipped: ${justEquippedName}!` : `সজ্জিত: ${justEquippedName}!`}
            </Text>
          </Animated.View>
        )}

        {/* Central Illustrated Cadet Dressing Mirror */}
        <Animated.View
          style={[
            styles.cadetMirrorBox,
            { transform: [{ scale: mirrorScaleAnim }] },
          ]}
        >
          <Svg width={180} height={230} viewBox="0 0 180 230">
            <Defs>
              <LinearGradient id="mirrorGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="rgba(107, 138, 255, 0.12)" />
                <Stop offset="100%" stopColor="rgba(15, 17, 40, 0.4)" />
              </LinearGradient>
              <LinearGradient id="goldVisor" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFF275" />
                <Stop offset="60%" stopColor="#FFB800" />
                <Stop offset="100%" stopColor="#E08A00" />
              </LinearGradient>
              <LinearGradient id="suitWhite" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="80%" stopColor="#E2E8F0" />
                <Stop offset="100%" stopColor="#CBD5E1" />
              </LinearGradient>
            </Defs>

            {/* Mirror Frame Background */}
            <Rect
              x="10"
              y="10"
              width="160"
              height="210"
              rx="24"
              fill="url(#mirrorGlow)"
              stroke="rgba(107, 138, 255, 0.25)"
              strokeWidth="2"
            />

            {/* PLSS Backpack (Renders behind shoulders) */}
            {equipped.plss && (
              <G>
                <Rect x="54" y="65" width="72" height="74" rx="8" fill="#334155" stroke="#64748B" strokeWidth="2" />
                <Circle cx="68" cy="85" r="7" fill={Colors.cyan} opacity={0.8} />
                <Circle cx="68" cy="110" r="7" fill={Colors.emerald} opacity={0.8} />
                <Rect x="82" y="80" width="36" height="6" rx="3" fill="#64748B" />
                <Rect x="82" y="94" width="28" height="5" rx="2" fill="#64748B" />
                {/* Oxygen Feeder Hose */}
                <Path d="M 68 78 Q 45 90 60 115" stroke={Colors.cyan} strokeWidth="3" fill="none" strokeDasharray="3 2" />
              </G>
            )}

            {/* Kid Cadet Body / Pressure Suit */}
            {equipped.pressure ? (
              // Full EVA Outer Suit
              <G>
                {/* Torso */}
                <Rect x="60" y="80" width="60" height="68" rx="14" fill="url(#suitWhite)" stroke="#94A3B8" strokeWidth="2" />
                {/* Shoulders */}
                <Circle cx="50" cy="95" r="14" fill="url(#suitWhite)" stroke="#94A3B8" strokeWidth="1.5" />
                <Circle cx="130" cy="95" r="14" fill="url(#suitWhite)" stroke="#94A3B8" strokeWidth="1.5" />
                {/* Arms */}
                <Rect x="42" y="96" width="16" height="42" rx="8" fill="url(#suitWhite)" stroke="#94A3B8" strokeWidth="1.5" />
                <Rect x="122" y="96" width="16" height="42" rx="8" fill="url(#suitWhite)" stroke="#94A3B8" strokeWidth="1.5" />
                {/* Legs */}
                <Rect x="64" y="145" width="22" height="46" rx="8" fill="url(#suitWhite)" stroke="#94A3B8" strokeWidth="1.5" />
                <Rect x="94" y="145" width="22" height="46" rx="8" fill="url(#suitWhite)" stroke="#94A3B8" strokeWidth="1.5" />
                {/* Chest Mission Patch */}
                <Rect x="78" y="92" width="24" height="14" rx="4" fill="rgba(107, 138, 255, 0.25)" stroke={Colors.primary} strokeWidth="1" />
                <Circle cx="86" cy="99" r="3" fill={Colors.gold} />
                <Circle cx="94" cy="99" r="2" fill={Colors.cyan} />
              </G>
            ) : (
              // Base Undersuit / Cadet Clothing
              <G>
                {/* Torso */}
                <Rect x="66" y="84" width="48" height="62" rx="10" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                {/* Arms */}
                <Rect x="50" y="92" width="14" height="40" rx="7" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                <Rect x="116" y="92" width="14" height="40" rx="7" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                {/* Legs */}
                <Rect x="70" y="142" width="18" height="46" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                <Rect x="92" y="142" width="18" height="46" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
              </G>
            )}

            {/* Liquid Cooling Garment Tube Overlay */}
            {equipped.cooling && (
              <G opacity={0.85}>
                <Line x1="72" y1="90" x2="72" y2="135" stroke={Colors.cyan} strokeWidth="2" strokeDasharray="4 2" />
                <Line x1="82" y1="90" x2="82" y2="135" stroke={Colors.cyan} strokeWidth="2" strokeDasharray="4 2" />
                <Line x1="98" y1="90" x2="98" y2="135" stroke={Colors.cyan} strokeWidth="2" strokeDasharray="4 2" />
                <Line x1="108" y1="90" x2="108" y2="135" stroke={Colors.cyan} strokeWidth="2" strokeDasharray="4 2" />
                <Circle cx="90" cy="115" r="4" fill={Colors.cyan} />
              </G>
            )}

            {/* Boots and Gloves */}
            {equipped.boots ? (
              <G>
                {/* Heavy Lunar Boots */}
                <Rect x="60" y="184" width="28" height="18" rx="6" fill="#475569" stroke="#94A3B8" strokeWidth="1.5" />
                <Rect x="92" y="184" width="28" height="18" rx="6" fill="#475569" stroke="#94A3B8" strokeWidth="1.5" />
                {/* Boot Treads */}
                <Line x1="62" y1="198" x2="86" y2="198" stroke={Colors.gold} strokeWidth="2" />
                <Line x1="94" y1="198" x2="118" y2="198" stroke={Colors.gold} strokeWidth="2" />
                {/* EVA Gloves */}
                <Circle cx="50" cy="142" r="9" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
                <Circle cx="130" cy="142" r="9" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
              </G>
            ) : (
              <G>
                {/* Simple Socks */}
                <Rect x="71" y="186" width="16" height="12" rx="4" fill="#0F172A" />
                <Rect x="93" y="186" width="16" height="12" rx="4" fill="#0F172A" />
                {/* Bare Hands */}
                <Circle cx="57" cy="136" r="6" fill="#FBBF24" />
                <Circle cx="123" cy="136" r="6" fill="#FBBF24" />
              </G>
            )}

            {/* Cadet Head / Helmet */}
            {equipped.helmet ? (
              // Golden Visor Astronaut Helmet
              <G>
                {/* Helmet White Shell */}
                <Circle cx="90" cy="50" r="32" fill="url(#suitWhite)" stroke="#94A3B8" strokeWidth="2.5" />
                {/* Neck Ring */}
                <Rect x="70" y="74" width="40" height="8" rx="4" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
                {/* Golden Reflective Visor */}
                <Rect x="68" y="32" width="44" height="34" rx="14" fill="url(#goldVisor)" stroke="#D97706" strokeWidth="1.5" />
                {/* Visor Glare Flare */}
                <Path d="M 74 38 Q 84 36 94 38" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity={0.8} />
              </G>
            ) : (
              // Kid Cadet Face & Hair
              <G>
                {/* Neck */}
                <Rect x="83" y="68" width="14" height="12" fill="#F59E0B" />
                {/* Head */}
                <Circle cx="90" cy="52" r="22" fill="#FBBF24" />
                {/* Cadet Hair */}
                <Path d="M 68 48 C 68 30 80 24 90 24 C 100 24 112 30 112 48 C 105 40 98 42 90 38 C 82 42 75 40 68 48 Z" fill="#451A03" />
                {/* Eyes */}
                <Circle cx="82" cy="52" r="3" fill="#1E293B" />
                <Circle cx="98" cy="52" r="3" fill="#1E293B" />
                <Circle cx="83" cy="51" r="1" fill="#FFFFFF" />
                <Circle cx="99" cy="51" r="1" fill="#FFFFFF" />
                {/* Cheerful Smile */}
                <Path d="M 85 60 Q 90 65 95 60" stroke="#B45309" strokeWidth="2" strokeLinecap="round" fill="none" />
              </G>
            )}
          </Svg>
        </Animated.View>

        {/* Dynamic Status Callout */}
        <View style={styles.statusCallout}>
          <Text style={styles.statusCalloutText}>
            {isAllEquipped
              ? t.allReady
              : `${activeItem.title} ${equipped[activeItemId] ? 'পরিধান করা হয়েছে' : 'পরিধান করতে ট্যাপ করো'}`}
          </Text>
        </View>
      </StoryCard>

      {/* Equipment Selector Chips */}
      <View style={styles.itemsGrid}>
        {suitItemsList.map((item) => {
          const isItemEquipped = equipped[item.id];
          const isSelected = activeItemId === item.id;
          const IconComponent = item.icon;

          return (
            <Pressable
              key={item.id}
              onPress={() => toggleItem(item.id)}
              style={({ pressed }) => [
                styles.itemCard,
                isSelected && styles.itemCardSelected,
                isItemEquipped && styles.itemCardEquipped,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={item.title}
            >
              <View style={[styles.itemIconBox, { backgroundColor: `${item.color}22` }]}>
                <IconComponent size={20} color={item.color} />
              </View>

              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc} numberOfLines={1}>
                  {item.desc}
                </Text>
              </View>

              <View style={styles.checkboxBox}>
                {isItemEquipped ? (
                  <CheckCircle2 size={22} color={Colors.emerald} />
                ) : (
                  <CircleIcon size={22} color={Colors.textMuted} />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Educational NASA Insight Box for the selected gear */}
      <StoryCard accent="gold" style={styles.factCard}>
        <View style={styles.factHeader}>
          <BookOpen size={16} color={Colors.gold} />
          <Text style={styles.factTitle}>বৈজ্ঞানিক তথ্য • NASA SCIENCE</Text>
        </View>
        <Text style={styles.factContent}>{activeItem.fact}</Text>
      </StoryCard>

      {/* Proceed Button */}
      <View style={styles.bottomSection}>
        {isAllEquipped ? (
          <GentleButton
            title={t.proceedBtn}
            onPress={onProceed}
            variant="emerald"
            size="large"
            fullWidth
          />
        ) : (
          <GentleButton
            title={`বাকী ${5 - equippedCount}টি সরঞ্জাম পরিধান করো`}
            onPress={() => {
              // Automatically equip the next unequipped item
              const nextUnequipped = suitItemsList.find((i) => !equipped[i.id]);
              if (nextUnequipped) {
                toggleItem(nextUnequipped.id);
              }
            }}
            variant="gold"
            size="large"
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
    backgroundColor: 'rgba(107, 138, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stageTagText: {
    color: Colors.primaryLight,
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
  stageCard: {
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 12,
    gap: 10,
  },
  progressLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.headingSemi,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.emerald,
    borderRadius: 4,
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 200, 107, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  readyBadgeText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.heading,
  },
  equipPopupBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 159, 0, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(245, 159, 0, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 6,
  },
  equipPopupText: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.heading,
  },
  cadetMirrorBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  statusCallout: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 8,
  },
  statusCalloutText: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoSemiBold,
  },
  itemsGrid: {
    gap: 10,
    marginBottom: 14,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 12,
  },
  itemCardSelected: {
    borderColor: Colors.primaryLight,
    backgroundColor: 'rgba(107, 138, 255, 0.08)',
  },
  itemCardEquipped: {
    borderColor: 'rgba(94, 214, 192, 0.4)',
  },
  itemIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.heading,
    marginBottom: 2,
  },
  itemDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
  },
  checkboxBox: {
    paddingRight: 4,
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
