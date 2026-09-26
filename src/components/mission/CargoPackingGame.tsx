import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { TactileButton } from '../TactileButton';
import {
  LunarRegion,
  CargoItem,
  CARGO_ITEMS,
  MAX_PAYLOAD_CAPACITY_KG,
  CargoCategory,
} from '../../content/missionData';
import {
  PackageCheck,
  Scale,
  Wind,
  Zap,
  Activity,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Sun,
  ShieldCheck,
  Compass,
  HeartPulse,
  Plus,
  Minus,
  ArrowLeft,
  Sparkles,
  Info,
  Check,
} from 'lucide-react-native';

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
function toBengaliNumber(num: number): string {
  return num
    .toString()
    .split('')
    .map((d) => BENGALI_DIGITS[parseInt(d, 10)] || d)
    .join('');
}

interface CargoPackingGameProps {
  selectedSite: LunarRegion;
  initialSelectedIds?: string[];
  onConfirmPacking: (selectedCargoIds: string[]) => void;
  onBackToSiteSelect: () => void;
}

export const CargoPackingGame: React.FC<CargoPackingGameProps> = ({
  selectedSite,
  initialSelectedIds = ['primary-oxygen', 'water-food-rations'],
  onConfirmPacking,
  onBackToSiteSelect,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [selectedCategory, setSelectedCategory] = useState<CargoCategory | 'all'>('all');

  // Compute live telemetry
  const selectedItems = CARGO_ITEMS.filter((item) => selectedIds.includes(item.id));
  const totalWeight = selectedItems.reduce((acc, it) => acc + it.weight_kg, 0);
  const isOverweight = totalWeight > MAX_PAYLOAD_CAPACITY_KG;
  const remainingWeight = MAX_PAYLOAD_CAPACITY_KG - totalWeight;
  const weightPercentage = Math.min(100, Math.round((totalWeight / MAX_PAYLOAD_CAPACITY_KG) * 100));

  const hasPrimaryOxygen = selectedIds.includes('primary-oxygen');
  const hasWaterFood = selectedIds.includes('water-food-rations');

  // Estimated Live Gauges
  let liveOxygen = 0;
  if (hasPrimaryOxygen) liveOxygen += 60;
  if (selectedIds.includes('backup-oxygen')) liveOxygen += 30;
  if (selectedIds.includes('lunar-ice-drill') && selectedSite.id === 'shackleton-crater') liveOxygen += 15;
  liveOxygen = Math.min(100, liveOxygen);

  let livePower = 0;
  if (selectedIds.includes('solar-array')) {
    livePower += Math.round(50 * (selectedSite.sunlightPower / 100));
  }
  if (selectedIds.includes('rtg-nuclear-battery')) {
    livePower += 60;
  }
  livePower = Math.min(100, livePower);

  let liveScience = 0;
  if (selectedIds.includes('lunar-ice-drill')) liveScience += 40;
  if (selectedIds.includes('mineral-spectrometer')) liveScience += 35;
  liveScience = Math.min(100, liveScience);

  const toggleItem = (itemId: string) => {
    if (selectedIds.includes(itemId)) {
      setSelectedIds((prev) => prev.filter((id) => id !== itemId));
    } else {
      setSelectedIds((prev) => [...prev, itemId]);
    }
  };

  const categories: { id: CargoCategory | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'সবগুলো', count: CARGO_ITEMS.length },
    {
      id: 'life_support',
      label: 'জীবন রক্ষা',
      count: CARGO_ITEMS.filter((i) => i.category === 'life_support').length,
    },
    {
      id: 'power',
      label: 'বিদ্যুৎ',
      count: CARGO_ITEMS.filter((i) => i.category === 'power').length,
    },
    {
      id: 'science',
      label: 'বিজ্ঞান',
      count: CARGO_ITEMS.filter((i) => i.category === 'science').length,
    },
    {
      id: 'survival',
      label: 'সুরক্ষা',
      count: CARGO_ITEMS.filter((i) => i.category === 'survival').length,
    },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? CARGO_ITEMS
      : CARGO_ITEMS.filter((i) => i.category === selectedCategory);

  const getCargoIcon = (iconName: string, category: CargoCategory) => {
    const iconSize = 20;
    switch (category) {
      case 'life_support':
        return <Wind size={iconSize} color={Colors.cyan} />;
      case 'power':
        return <Zap size={iconSize} color={Colors.gold} />;
      case 'science':
        return <Cpu size={iconSize} color={Colors.purpleLight} />;
      case 'survival':
        return <ShieldCheck size={iconSize} color={Colors.emerald} />;
      default:
        return <PackageCheck size={iconSize} color={Colors.cyan} />;
    }
  };

  const getCategoryThemeColor = (category: CargoCategory) => {
    switch (category) {
      case 'life_support':
        return { bg: 'rgba(0, 240, 255, 0.12)', border: 'rgba(0, 240, 255, 0.35)', color: Colors.cyan };
      case 'power':
        return { bg: 'rgba(255, 184, 0, 0.12)', border: 'rgba(255, 184, 0, 0.35)', color: Colors.gold };
      case 'science':
        return { bg: 'rgba(168, 85, 247, 0.14)', border: 'rgba(168, 85, 247, 0.35)', color: Colors.purpleLight };
      case 'survival':
        return { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.35)', color: Colors.emerald };
      default:
        return { bg: 'rgba(255, 255, 255, 0.08)', border: 'rgba(255, 255, 255, 0.2)', color: Colors.text };
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* ── Top Navigation & Region Breadcrumb ───────────────────────── */}
      <View style={styles.topNavRow}>
        <Pressable onPress={onBackToSiteSelect} style={styles.backPill}>
          <ArrowLeft size={14} color={Colors.cyan} />
          <Text style={styles.backPillText}>অবতরণ স্থান</Text>
        </Pressable>

        <View style={styles.sitePill}>
          <Compass size={13} color={Colors.gold} />
          <Text style={styles.sitePillText}>
            {selectedSite.badge} {selectedSite.name_bn}
          </Text>
        </View>
      </View>

      {/* ── Header Title Block ────────────────────────────────────────── */}
      <View style={styles.headerBlock}>
        <View style={styles.phaseBadge}>
          <PackageCheck size={13} color={Colors.cyan} />
          <Text style={styles.phaseBadgeText}>ধাপ ২ • পেলোড কনফিগারেশন</Text>
        </View>
        <Text style={styles.mainTitle}>কার্গো প্যাকিং ও সরঞ্জাম ব্যালেন্স</Text>
        <Text style={styles.subtitle}>
          সর্বোচ্চ ৫০০ কেজি ওজনের মধ্যে সরঞ্জাম সাজাও। নভোচারীদের জীবন রক্ষা, বিদ্যুৎ শক্তি এবং গবেষণার সঠিক ভারসাম্য নিশ্চিত করাই তোমার মিশন!
        </Text>
      </View>

      {/* ── Mission Control Telemetry HUD ────────────────────────────── */}
      <View style={[styles.hudConsole, isOverweight && styles.hudConsoleOverweight]}>
        {/* Weight Header */}
        <View style={styles.hudWeightRow}>
          <View style={styles.weightLeft}>
            <View style={[styles.weightIconBox, isOverweight && styles.weightIconBoxOverweight]}>
              <Scale size={18} color={isOverweight ? Colors.coral : Colors.cyan} />
            </View>
            <View>
              <Text style={styles.hudLabel}>মোট পেলোড ওজন</Text>
              <View style={styles.weightNumbersRow}>
                <Text style={[styles.weightCurrent, isOverweight && styles.weightCurrentOverweight]}>
                  {toBengaliNumber(totalWeight)}
                </Text>
                <Text style={styles.weightMax}> / {toBengaliNumber(MAX_PAYLOAD_CAPACITY_KG)} কেজি</Text>
              </View>
            </View>
          </View>

          {/* Dynamic Capacity Pill */}
          <View
            style={[
              styles.capacityPill,
              isOverweight
                ? styles.capacityPillOverweight
                : remainingWeight <= 60
                ? styles.capacityPillNearLimit
                : styles.capacityPillOk,
            ]}
          >
            {isOverweight ? (
              <>
                <AlertTriangle size={12} color={Colors.coral} />
                <Text style={styles.capacityTextOverweight}>
                  +{toBengaliNumber(Math.abs(remainingWeight))} কেজি বেশি!
                </Text>
              </>
            ) : (
              <>
                <Check size={12} color={remainingWeight <= 60 ? Colors.gold : Colors.emerald} />
                <Text
                  style={[
                    styles.capacityTextOk,
                    remainingWeight <= 60 && { color: Colors.gold },
                  ]}
                >
                  {toBengaliNumber(remainingWeight)} কেজি বাকি
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Modern Weight Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${weightPercentage}%`,
                backgroundColor: isOverweight
                  ? Colors.coral
                  : totalWeight > 420
                  ? Colors.gold
                  : Colors.cyan,
              },
            ]}
          />
        </View>

        {/* High-Visibility Warning Alerts */}
        {!hasPrimaryOxygen && (
          <View style={styles.alertBanner}>
            <View style={styles.alertIconCircle}>
              <AlertCircle size={15} color={Colors.coral} />
            </View>
            <Text style={styles.alertText}>
              <Text style={styles.alertTextBold}>জরুরি সতর্কতা: </Text>
              প্রাথমিক অক্সিজেন সিলিন্ডার প্যাক করা হয়নি! নভোচারীরা শ্বাস নিতে পারবেন না।
            </Text>
          </View>
        )}

        {isOverweight && (
          <View style={[styles.alertBanner, styles.alertBannerCoral]}>
            <View style={styles.alertIconCircle}>
              <AlertTriangle size={15} color={Colors.coral} />
            </View>
            <Text style={styles.alertText}>
              <Text style={styles.alertTextBold}>ওজন অতিরিক্ত: </Text>
              পেলোড ৫০০ কেজি ছাড়িয়ে গেছে! থ্রাস্টার বিকল হয়ে ল্যান্ডার ক্র্যাশ করার ঝুঁকি রয়েছে।
            </Text>
          </View>
        )}

        {/* Telemetry Resource Gauges (Oxygen, Power, Science) */}
        <View style={styles.gaugesContainer}>
          {/* Oxygen Gauge */}
          <View style={styles.gaugeItem}>
            <View style={styles.gaugeItemTop}>
              <View style={styles.gaugeItemLabelGroup}>
                <Wind size={13} color={liveOxygen >= 70 ? Colors.cyan : Colors.coral} />
                <Text style={styles.gaugeItemName}>অক্সিজেন</Text>
              </View>
              <Text
                style={[
                  styles.gaugeItemValue,
                  { color: liveOxygen >= 70 ? Colors.cyan : Colors.coral },
                ]}
              >
                {toBengaliNumber(liveOxygen)}%
              </Text>
            </View>
            <View style={styles.miniGaugeTrack}>
              <View
                style={[
                  styles.miniGaugeFill,
                  {
                    width: `${liveOxygen}%`,
                    backgroundColor: liveOxygen >= 70 ? Colors.cyan : Colors.coral,
                  },
                ]}
              />
            </View>
          </View>

          {/* Power Gauge */}
          <View style={styles.gaugeItem}>
            <View style={styles.gaugeItemTop}>
              <View style={styles.gaugeItemLabelGroup}>
                <Zap size={13} color={livePower >= 50 ? Colors.gold : Colors.coral} />
                <Text style={styles.gaugeItemName}>বিদ্যুৎ</Text>
              </View>
              <Text
                style={[
                  styles.gaugeItemValue,
                  { color: livePower >= 50 ? Colors.gold : Colors.coral },
                ]}
              >
                {toBengaliNumber(livePower)}%
              </Text>
            </View>
            <View style={styles.miniGaugeTrack}>
              <View
                style={[
                  styles.miniGaugeFill,
                  {
                    width: `${livePower}%`,
                    backgroundColor: livePower >= 50 ? Colors.gold : Colors.coral,
                  },
                ]}
              />
            </View>
          </View>

          {/* Science Gauge */}
          <View style={styles.gaugeItem}>
            <View style={styles.gaugeItemTop}>
              <View style={styles.gaugeItemLabelGroup}>
                <Cpu size={13} color={Colors.purpleLight} />
                <Text style={styles.gaugeItemName}>বিজ্ঞান</Text>
              </View>
              <Text style={[styles.gaugeItemValue, { color: Colors.purpleLight }]}>
                {toBengaliNumber(liveScience)}%
              </Text>
            </View>
            <View style={styles.miniGaugeTrack}>
              <View
                style={[
                  styles.miniGaugeFill,
                  {
                    width: `${liveScience}%`,
                    backgroundColor: Colors.purpleLight,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* ── Modern Category Segmented Tabs ───────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScrollContent}
        style={styles.categoryScroll}
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={({ pressed }) => [
                styles.categoryTab,
                isActive && styles.categoryTabActive,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={[styles.categoryTabText, isActive && styles.categoryTabTextActive]}>
                {cat.label}
              </Text>
              <View style={[styles.categoryCountBadge, isActive && styles.categoryCountBadgeActive]}>
                <Text style={[styles.categoryCountText, isActive && styles.categoryCountTextActive]}>
                  {toBengaliNumber(cat.count)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── Cargo Items List ─────────────────────────────────────────── */}
      <View style={styles.itemsList}>
        {filteredItems.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          const theme = getCategoryThemeColor(item.category);

          return (
            <Pressable
              key={item.id}
              onPress={() => toggleItem(item.id)}
              style={({ pressed }) => [
                styles.cargoCard,
                isSelected && styles.cargoCardSelected,
                pressed && styles.cargoCardPressed,
              ]}
            >
              {/* Card Header Row: Icon + Title/English + Status Badge */}
              <View style={styles.cardHeaderRow}>
                <View style={[styles.itemIconSquircle, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                  {getCargoIcon(item.icon_name, item.category)}
                </View>

                <View style={styles.itemTitleBlock}>
                  <Text style={[styles.itemName, isSelected && styles.itemNameSelected]}>
                    {item.name_bn}
                  </Text>
                  <Text style={styles.itemSubtitle}>{item.englishName}</Text>
                </View>

                {/* Right Essential Badge (Always has its own dedicated column, never overlaps buttons!) */}
                {item.is_essential ? (
                  <View style={styles.essentialBadge}>
                    <AlertCircle size={10} color={Colors.coral} />
                    <Text style={styles.essentialBadgeText}>আবশ্যক</Text>
                  </View>
                ) : (
                  <View style={styles.optionalBadge}>
                    <Text style={styles.optionalBadgeText}>{item.category_bn}</Text>
                  </View>
                )}
              </View>

              {/* Description Body */}
              <Text style={styles.itemDescription}>{item.description_bn}</Text>

              {/* Dedicated Card Footer: Stats on Left, Modern Button on Right */}
              <View style={styles.cardFooterRow}>
                {/* Stats Chips */}
                <View style={styles.statsLeft}>
                  {/* Weight Pill */}
                  <View style={styles.weightPill}>
                    <Scale size={11} color={Colors.gold} />
                    <Text style={styles.weightPillText}>{toBengaliNumber(item.weight_kg)} কেজি</Text>
                  </View>

                  {/* Impact / Bonus Pill */}
                  {item.oxygen_bonus > 0 && (
                    <View style={styles.bonusPill}>
                      <Wind size={11} color={Colors.cyan} />
                      <Text style={[styles.bonusPillText, { color: Colors.cyan }]}>
                        +{toBengaliNumber(item.oxygen_bonus)}% O₂
                      </Text>
                    </View>
                  )}

                  {item.power_bonus > 0 && (
                    <View style={styles.bonusPill}>
                      <Zap size={11} color={Colors.gold} />
                      <Text style={[styles.bonusPillText, { color: Colors.gold }]}>
                        +{toBengaliNumber(item.power_bonus)}% বিদ্যুৎ
                      </Text>
                    </View>
                  )}

                  {item.science_bonus > 0 && (
                    <View style={styles.bonusPill}>
                      <Cpu size={11} color={Colors.purpleLight} />
                      <Text style={[styles.bonusPillText, { color: Colors.purpleLight }]}>
                        +{toBengaliNumber(item.science_bonus)}% বিজ্ঞান
                      </Text>
                    </View>
                  )}
                </View>

                {/* Dedicated Action Button (Pill with clean border & touch target) */}
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation?.();
                    toggleItem(item.id);
                  }}
                  style={({ pressed }) => [
                    styles.actionBtn,
                    isSelected ? styles.actionBtnSelected : styles.actionBtnUnselected,
                    pressed && styles.actionBtnPressed,
                  ]}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 size={13} color="#0B0E2B" strokeWidth={2.6} />
                      <Text style={styles.actionBtnTextSelected}>প্যাকড ✓</Text>
                    </>
                  ) : (
                    <>
                      <Plus size={13} color={Colors.cyan} strokeWidth={2.4} />
                      <Text style={styles.actionBtnTextUnselected}>প্যাক করো</Text>
                    </>
                  )}
                </Pressable>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* ── Regional Advice Callout ──────────────────────────────────── */}
      {selectedSite.id === 'shackleton-crater' && (
        <View style={styles.tipCard}>
          <View style={styles.tipHeaderRow}>
            <Sparkles size={16} color={Colors.gold} />
            <Text style={styles.tipTitle}>মিশন কন্ট্রোল অন্তর্দৃষ্টি • দক্ষিণ মেরু</Text>
          </View>
          <Text style={styles.tipDescription}>
            শ্যাকলটন গহ্বরে সূর্যের আলো পৌঁছায় না। তাই সোলার প্যানেলের বদলে পারমাণবিক RTG ব্যাটারি শক্তি জোগাতে শতভাগ কার্যকর!
          </Text>
        </View>
      )}

      {/* ── Floating / Pinned Bottom Launch Console ──────────────────── */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomSummaryRow}>
          <Text style={styles.bottomSummaryCount}>
            {toBengaliNumber(selectedIds.length)}টি সরঞ্জাম প্যাক করা হয়েছে
          </Text>
          <Text style={[styles.bottomSummaryWeight, isOverweight && { color: Colors.coral }]}>
            {toBengaliNumber(totalWeight)} / ৫০০ কেজি
          </Text>
        </View>

        <TactileButton
          title={
            isOverweight
              ? 'ওজন অতিরিক্ত (সর্বোচ্চ ৫০০ কেজি)'
              : !hasPrimaryOxygen
              ? 'অক্সিজেন সিলিন্ডার নির্বাচন করো'
              : 'অবতরণ সিমুলেশন শুরু করো 🚀'
          }
          onPress={() => onConfirmPacking(selectedIds)}
          disabled={isOverweight || !hasPrimaryOxygen}
          variant={isOverweight || !hasPrimaryOxygen ? 'primary' : 'emerald'}
          size="large"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },

  // Top Nav Row
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
  },
  backPillText: {
    color: Colors.cyan,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  sitePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
  },
  sitePillText: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },

  // Header Block
  headerBlock: {
    marginBottom: 16,
  },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
  },
  phaseBadgeText: {
    color: Colors.cyan,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  mainTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: Typography.weight.heavy,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },

  // Cockpit Telemetry HUD
  hudConsole: {
    backgroundColor: 'rgba(13, 18, 48, 0.94)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.28)',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  hudConsoleOverweight: {
    borderColor: 'rgba(255, 71, 87, 0.7)',
    backgroundColor: 'rgba(38, 14, 28, 0.94)',
  },
  hudWeightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  weightIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
  },
  weightIconBoxOverweight: {
    backgroundColor: 'rgba(255, 71, 87, 0.15)',
    borderColor: Colors.coral,
  },
  hudLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: Typography.weight.semiBold,
    marginBottom: 2,
  },
  weightNumbersRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  weightCurrent: {
    color: Colors.cyan,
    fontSize: 20,
    fontWeight: Typography.weight.heavy,
  },
  weightCurrentOverweight: {
    color: Colors.coral,
  },
  weightMax: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: Typography.weight.bold,
  },
  capacityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  capacityPillOk: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  capacityPillNearLimit: {
    backgroundColor: 'rgba(255, 184, 0, 0.12)',
    borderColor: 'rgba(255, 184, 0, 0.35)',
  },
  capacityPillOverweight: {
    backgroundColor: 'rgba(255, 71, 87, 0.15)',
    borderColor: Colors.coral,
  },
  capacityTextOk: {
    color: Colors.emerald,
    fontSize: 11,
    fontWeight: Typography.weight.bold,
  },
  capacityTextOverweight: {
    color: Colors.coral,
    fontSize: 11,
    fontWeight: Typography.weight.bold,
  },

  // Progress Bar
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Alert Banners
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 71, 87, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.45)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 12,
  },
  alertBannerCoral: {
    borderColor: Colors.coral,
  },
  alertIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 71, 87, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertText: {
    flex: 1,
    color: Colors.coralLight,
    fontSize: 12,
    lineHeight: 16,
  },
  alertTextBold: {
    fontWeight: Typography.weight.heavy,
    color: Colors.coral,
  },

  // Gauges Container
  gaugesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  gaugeItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  gaugeItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  gaugeItemLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gaugeItemName: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: Typography.weight.semiBold,
  },
  gaugeItemValue: {
    fontSize: 12,
    fontWeight: Typography.weight.heavy,
  },
  miniGaugeTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniGaugeFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Category Tabs
  categoryScroll: {
    marginBottom: 14,
  },
  categoryScrollContent: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryTabActive: {
    backgroundColor: Colors.cyan,
    borderColor: Colors.cyan,
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryTabText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: Typography.weight.bold,
  },
  categoryTabTextActive: {
    color: '#080D27',
    fontWeight: Typography.weight.heavy,
  },
  categoryCountBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  categoryCountBadgeActive: {
    backgroundColor: 'rgba(8, 13, 39, 0.18)',
  },
  categoryCountText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: Typography.weight.bold,
  },
  categoryCountTextActive: {
    color: '#080D27',
    fontWeight: Typography.weight.heavy,
  },

  // Cargo Items
  itemsList: {
    marginBottom: 16,
    gap: 12,
  },
  cargoCard: {
    backgroundColor: 'rgba(15, 20, 54, 0.88)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.09)',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
  },
  cargoCardSelected: {
    borderColor: Colors.cyan,
    backgroundColor: 'rgba(18, 26, 70, 0.96)',
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  cargoCardPressed: {
    transform: [{ scale: 0.995 }],
    opacity: 0.96,
  },

  // Card Header Row: Icon + Title + Status Badge
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  itemIconSquircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  itemTitleBlock: {
    flex: 1,
  },
  itemName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: Typography.weight.bold,
    lineHeight: 20,
    marginBottom: 2,
  },
  itemNameSelected: {
    color: Colors.cyan,
  },
  itemSubtitle: {
    color: Colors.textMuted,
    fontSize: 11,
    lineHeight: 14,
  },

  // Status Badges (Top Right)
  essentialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 71, 87, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.4)',
    flexShrink: 0,
  },
  essentialBadgeText: {
    color: Colors.coral,
    fontSize: 10,
    fontWeight: Typography.weight.heavy,
  },
  optionalBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    flexShrink: 0,
  },
  optionalBadgeText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: Typography.weight.semiBold,
  },

  // Item Description
  itemDescription: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },

  // Card Footer Row: Stats Left, Modern Action Button Right
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    gap: 8,
  },
  statsLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  weightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.25)',
  },
  weightPillText: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: Typography.weight.bold,
  },
  bonusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  bonusPillText: {
    fontSize: 11,
    fontWeight: Typography.weight.bold,
  },

  // Dedicated Modern Action Button
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    flexShrink: 0,
  },
  actionBtnUnselected: {
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderWidth: 1.2,
    borderColor: 'rgba(0, 240, 255, 0.4)',
  },
  actionBtnSelected: {
    backgroundColor: Colors.cyan,
    borderWidth: 1.2,
    borderColor: Colors.cyan,
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnPressed: {
    transform: [{ scale: 0.94 }],
  },
  actionBtnTextUnselected: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: Typography.weight.bold,
  },
  actionBtnTextSelected: {
    color: '#080D27',
    fontSize: 12,
    fontWeight: Typography.weight.heavy,
  },

  // Regional Advice Tip Card
  tipCard: {
    backgroundColor: 'rgba(255, 184, 0, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
    padding: 14,
    marginBottom: 16,
  },
  tipHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  tipTitle: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: Typography.weight.bold,
  },
  tipDescription: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  // Bottom Floating Bar
  bottomBar: {
    marginTop: 4,
    gap: 10,
  },
  bottomSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  bottomSummaryCount: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: Typography.weight.semiBold,
  },
  bottomSummaryWeight: {
    color: Colors.cyan,
    fontSize: 13,
    fontWeight: Typography.weight.bold,
  },
});
