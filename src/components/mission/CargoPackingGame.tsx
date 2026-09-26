import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { DoubleBezelCard } from '../DoubleBezelCard';
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

  const categories: { id: CargoCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'সবগুলো' },
    { id: 'life_support', label: 'জীবন রক্ষা' },
    { id: 'power', label: 'বিদ্যুৎ' },
    { id: 'science', label: 'বিজ্ঞান' },
    { id: 'survival', label: 'সুরক্ষা' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? CARGO_ITEMS
    : CARGO_ITEMS.filter((i) => i.category === selectedCategory);

  const getCargoIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wind':
        return <Wind size={18} color={Colors.hudCyan} />;
      case 'Activity':
        return <Activity size={18} color={Colors.emerald} />;
      case 'Sun':
        return <Sun size={18} color={Colors.thermalGold} />;
      case 'Zap':
        return <Zap size={18} color={Colors.thermalGold} />;
      case 'Cpu':
        return <Cpu size={18} color={Colors.plasmaViolet} />;
      case 'Compass':
        return <Compass size={18} color={Colors.hudCyan} />;
      case 'ShieldCheck':
        return <ShieldCheck size={18} color={Colors.telemetryGreen} />;
      case 'HeartPulse':
        return <HeartPulse size={18} color={Colors.coral} />;
      default:
        return <PackageCheck size={18} color={Colors.text} />;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Top Navigation & Step Indicator */}
      <View style={styles.topNavRow}>
        <Pressable onPress={onBackToSiteSelect} style={styles.backBtn}>
          <ArrowLeft size={16} color={Colors.hudCyan} />
          <Text style={styles.backBtnText}>সাইট নির্বাচন</Text>
        </Pressable>
        <View style={styles.siteBadge}>
          <Text style={styles.siteBadgeText}>{selectedSite.badge} {selectedSite.name_bn}</Text>
        </View>
      </View>

      <View style={styles.headerBlock}>
        <View style={styles.stepPill}>
          <PackageCheck size={13} color={Colors.thermalGold} />
          <Text style={styles.stepPillText}>ধাপ ২/৩ : ল্যান্ডার কার্গো ব্যালেন্স</Text>
        </View>
        <Text style={styles.mainTitle}>কার্গো প্যাকিং ও ওজন ভারসাম্য</Text>
        <Text style={styles.subtitle}>
          সর্বোচ্চ ৫০০ কেজি ওজনের মধ্যে সরঞ্জাম বাছাই করো। জীবন রক্ষা, শক্তি এবং বৈজ্ঞানিক গবেষণার ভারসাম্য রাখাই আসল চ্যালেঞ্জ!
        </Text>
      </View>

      {/* Live Payload Weight HUD Dashboard */}
      <View
        style={[
          styles.hudConsole,
          isOverweight && styles.hudConsoleOverweight,
        ]}
      >
        <View style={styles.hudTopRow}>
          <View style={styles.weightLabelGroup}>
            <Scale size={18} color={isOverweight ? Colors.coral : Colors.hudCyan} />
            <Text style={styles.hudSectionTitle}>ল্যান্ডার পেলোড ওজন</Text>
          </View>
          <Text
            style={[
              styles.weightNumber,
              isOverweight && { color: Colors.coral },
            ]}
          >
            {toBengaliNumber(totalWeight)} / {toBengaliNumber(MAX_PAYLOAD_CAPACITY_KG)} কেজি
          </Text>
        </View>

        {/* Dynamic Weight Bar */}
        <View style={styles.weightBarShell}>
          <View
            style={[
              styles.weightBarFill,
              {
                width: `${weightPercentage}%`,
                backgroundColor: isOverweight
                  ? Colors.coral
                  : totalWeight > 420
                  ? Colors.thermalGold
                  : Colors.hudCyan,
              },
            ]}
          />
        </View>

        {/* Critical Warnings */}
        {isOverweight && (
          <View style={styles.warningBox}>
            <AlertCircle size={15} color={Colors.coral} />
            <Text style={styles.warningText}>
              সতর্কতা: ওজন ৫০০ কেজি অতিক্রম করেছে! অতিরিক্ত ওজনের কারণে থ্রাস্টার বিকল হয়ে ল্যান্ডার বিধ্বস্ত হতে পারে।
            </Text>
          </View>
        )}

        {!hasPrimaryOxygen && (
          <View style={styles.warningBox}>
            <AlertCircle size={15} color={Colors.coral} />
            <Text style={styles.warningText}>
              জরুরি সতর্কতা: প্রাথমিক অক্সিজেন সিলিন্ডার অনুপস্থিত! নভোচারীরা শ্বাস নিতে পারবেন না!
            </Text>
          </View>
        )}

        {/* Telemetry Resource Gauges (Oxygen, Power, Science) */}
        <View style={styles.gaugesRow}>
          {/* Oxygen Gauge */}
          <View style={styles.gaugePill}>
            <View style={styles.gaugePillHeader}>
              <Wind size={13} color={liveOxygen >= 70 ? Colors.emerald : Colors.coral} />
              <Text style={styles.gaugeLabel}>অক্সিজেন</Text>
            </View>
            <Text
              style={[
                styles.gaugeVal,
                { color: liveOxygen >= 70 ? Colors.emerald : Colors.coral },
              ]}
            >
              {toBengaliNumber(liveOxygen)}%
            </Text>
          </View>

          {/* Power Gauge */}
          <View style={styles.gaugePill}>
            <View style={styles.gaugePillHeader}>
              <Zap size={13} color={livePower >= 50 ? Colors.thermalGold : Colors.coral} />
              <Text style={styles.gaugeLabel}>বিদ্যুৎ</Text>
            </View>
            <Text
              style={[
                styles.gaugeVal,
                { color: livePower >= 50 ? Colors.thermalGold : Colors.coral },
              ]}
            >
              {toBengaliNumber(livePower)}%
            </Text>
          </View>

          {/* Science Gauge */}
          <View style={styles.gaugePill}>
            <View style={styles.gaugePillHeader}>
              <Cpu size={13} color={Colors.plasmaViolet} />
              <Text style={styles.gaugeLabel}>বিজ্ঞান</Text>
            </View>
            <Text style={[styles.gaugeVal, { color: Colors.plasmaViolet }]}>
              {toBengaliNumber(liveScience)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Category Pills Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[styles.catBtn, isActive && styles.catBtnActive]}
            >
              <Text style={[styles.catBtnText, isActive && styles.catBtnTextActive]}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Cargo Items List */}
      <View style={styles.itemsList}>
        {filteredItems.map((item) => {
          const isSelected = selectedIds.includes(item.id);

          return (
            <Pressable
              key={item.id}
              onPress={() => toggleItem(item.id)}
              style={[
                styles.cargoCard,
                isSelected && styles.cargoCardSelected,
              ]}
            >
              <View style={styles.cargoCardTop}>
                <View style={styles.cargoTitleRow}>
                  <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                    {getCargoIcon(item.icon_name)}
                  </View>
                  <View style={styles.cargoNameCol}>
                    <View style={styles.nameAndTag}>
                      <Text style={[styles.cargoName, isSelected && { color: Colors.hudCyan }]}>
                        {item.name_bn}
                      </Text>
                      {item.is_essential && (
                        <View style={styles.essentialTag}>
                          <Text style={styles.essentialTagText}>আবশ্যক</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.cargoEng}>{item.englishName}</Text>
                  </View>
                </View>

                {/* Tactile 3D Action Pill */}
                <View style={[styles.toggleBtn, isSelected ? styles.toggleBtnActive : styles.toggleBtnInactive]}>
                  {isSelected ? (
                    <>
                      <Minus size={14} color="#0B0F19" strokeWidth={2.5} />
                      <Text style={styles.toggleBtnActiveText}>বাতিল</Text>
                    </>
                  ) : (
                    <>
                      <Plus size={14} color="#FFFFFF" strokeWidth={2.5} />
                      <Text style={styles.toggleBtnText}>প্যাক করো</Text>
                    </>
                  )}
                </View>
              </View>

              <Text style={styles.cargoDesc}>{item.description_bn}</Text>

              {/* Specs & Weight Footnote */}
              <View style={styles.specsRow}>
                <View style={styles.weightBadge}>
                  <Scale size={12} color={Colors.thermalGold} />
                  <Text style={styles.weightBadgeText}>{toBengaliNumber(item.weight_kg)} কেজি</Text>
                </View>

                <View style={styles.benefitBadges}>
                  {item.oxygen_bonus > 0 && (
                    <View style={styles.benefitPill}>
                      <Wind size={10} color={Colors.hudCyan} />
                      <Text style={styles.benefitText}>+{toBengaliNumber(item.oxygen_bonus)}% অক্সিজেন</Text>
                    </View>
                  )}
                  {item.power_bonus > 0 && (
                    <View style={styles.benefitPill}>
                      <Zap size={10} color={Colors.thermalGold} />
                      <Text style={styles.benefitText}>+{toBengaliNumber(item.power_bonus)}% বিদ্যুৎ</Text>
                    </View>
                  )}
                  {item.science_bonus > 0 && (
                    <View style={styles.benefitPill}>
                      <Cpu size={10} color={Colors.plasmaViolet} />
                      <Text style={styles.benefitText}>+{toBengaliNumber(item.science_bonus)}% বিজ্ঞান</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Regional Advice Callout */}
      {selectedSite.id === 'shackleton-crater' && (
        <DoubleBezelCard glow="cyan" tag="মিশন কন্ট্রোল টিপস 💡" style={styles.tipMargin}>
          <View style={styles.tipRow}>
            <Sparkles size={16} color={Colors.hudCyan} />
            <Text style={styles.tipText}>
              শ্যাকলটন গহ্বরে সূর্যের আলো পৌঁছায় না। তাই সোলার প্যানেলের চেয়ে পারমাণবিক RTG ব্যাটারি বিদ্যুৎ জোগাতে বেশি কার্যকর!
            </Text>
          </View>
        </DoubleBezelCard>
      )}

      {/* Bottom Launch Button */}
      <View style={styles.bottomBar}>
        <TactileButton
          title={
            isOverweight
              ? 'ওজন কমাও (সীমা ৫০০ কেজি)'
              : !hasPrimaryOxygen
              ? 'অক্সিজেন সিলেক্ট করো'
              : 'ল্যান্ডার উৎক্ষেপণ ও অবতরণ শুরু করো 🚀'
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
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backBtnText: {
    color: Colors.hudCyan,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  siteBadge: {
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.35)',
  },
  siteBadgeText: {
    color: Colors.thermalGold,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  headerBlock: {
    marginBottom: 16,
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.thermalGoldBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
  },
  stepPillText: {
    color: Colors.thermalGold,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  mainTitle: {
    color: Colors.text,
    fontSize: Typography.size.h1,
    fontWeight: Typography.weight.heavy,
    marginBottom: 6,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
  },
  hudConsole: {
    backgroundColor: 'rgba(12, 16, 52, 0.92)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.35)',
    padding: 14,
    marginBottom: 16,
  },
  hudConsoleOverweight: {
    borderColor: Colors.coral,
    backgroundColor: 'rgba(44, 15, 30, 0.92)',
  },
  hudTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weightLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hudSectionTitle: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  weightNumber: {
    color: Colors.hudCyan,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.heavy,
  },
  weightBarShell: {
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  weightBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderWidth: 1,
    borderColor: Colors.coral,
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
  },
  warningText: {
    flex: 1,
    color: Colors.coral,
    fontSize: Typography.size.micro,
    lineHeight: 14,
  },
  gaugesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  gaugePill: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
  },
  gaugePillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  gaugeLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.size.micro,
  },
  gaugeVal: {
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.heavy,
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  catBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  catBtnActive: {
    backgroundColor: Colors.hudCyanBg,
    borderColor: Colors.hudCyan,
  },
  catBtnText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
  },
  catBtnTextActive: {
    color: Colors.hudCyan,
    fontWeight: Typography.weight.bold,
  },
  itemsList: {
    marginBottom: 16,
  },
  cargoCard: {
    backgroundColor: 'rgba(14, 18, 60, 0.82)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    marginBottom: 10,
  },
  cargoCardSelected: {
    borderColor: Colors.hudCyan,
    backgroundColor: 'rgba(18, 24, 78, 0.95)',
  },
  cargoCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cargoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxSelected: {
    backgroundColor: Colors.hudCyanBg,
  },
  cargoNameCol: {
    flex: 1,
  },
  nameAndTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cargoName: {
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    fontWeight: Typography.weight.bold,
  },
  essentialTag: {
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  essentialTagText: {
    color: Colors.coral,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
  },
  cargoEng: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: Colors.hudCyan,
  },
  toggleBtnInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  toggleBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  toggleBtnActiveText: {
    color: '#0B0F19',
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.heavy,
  },
  cargoDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    marginBottom: 8,
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 184, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  weightBadgeText: {
    color: Colors.thermalGold,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  benefitBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  benefitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  benefitText: {
    color: Colors.textSecondary,
    fontSize: 10,
  },
  tipMargin: {
    marginBottom: 16,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
  },
  bottomBar: {
    marginTop: 8,
  },
});
