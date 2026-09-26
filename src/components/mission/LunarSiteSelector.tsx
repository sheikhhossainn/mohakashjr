import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Easing } from 'react-native';
import Svg, { Circle, Line, Path, Rect, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { DoubleBezelCard } from '../DoubleBezelCard';
import { TactileButton } from '../TactileButton';
import {
  LunarRegion,
  LunarRegionId,
  LUNAR_REGIONS,
} from '../../content/missionData';
import {
  Compass,
  MapPin,
  Sun,
  Droplets,
  AlertTriangle,
  Award,
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

interface LunarSiteSelectorProps {
  initialSiteId?: LunarRegionId;
  onConfirmSite: (site: LunarRegion) => void;
}

export const LunarSiteSelector: React.FC<LunarSiteSelectorProps> = ({
  initialSiteId = 'shackleton-crater',
  onConfirmSite,
}) => {
  const [selectedId, setSelectedId] = useState<LunarRegionId>(initialSiteId);

  // Radar sweep animation
  const radarSweepAnim = useRef(new Animated.Value(0)).current;
  const pulseRingAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 360 degree continuous radar scan sweep
    Animated.loop(
      Animated.timing(radarSweepAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Beacon ping pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseRingAnim, {
          toValue: 1.4,
          duration: 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseRingAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const sweepRotation = radarSweepAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const selectedRegion = LUNAR_REGIONS.find((r) => r.id === selectedId) || LUNAR_REGIONS[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header Briefing */}
      <View style={styles.headerBlock}>
        <View style={styles.stepPill}>
          <Compass size={13} color={Colors.hudCyan} />
          <Text style={styles.stepPillText}>ধাপ ১/৩ : টেলিমেট্রি সাইট স্ক্যান</Text>
        </View>
        <Text style={styles.mainTitle}>চন্দ্রপৃষ্ঠে অবতরণ অঞ্চল নির্বাচন</Text>
        <Text style={styles.subtitle}>
          চাঁদের তিনটি ঐতিহাসিক অঞ্চলের মধ্যে একটি বেছে নাও। প্রতিটি অঞ্চলের সূর্যালোক, পানির বরফ এবং অবতরণের ঝুঁকি ভিন্ন!
        </Text>
      </View>

      {/* Interactive Lunar Radar Scanner */}
      <View style={styles.radarCard}>
        <View style={styles.radarHeader}>
          <View style={styles.liveIndicator}>
            <View style={styles.dot} />
            <Text style={styles.liveText}>LRO অরবিটার লাইভ ফিড</Text>
          </View>
          <Text style={styles.coordsText}>{selectedRegion.coordinates}</Text>
        </View>

        <View style={styles.radarViewBox}>
          {/* Radar Circles & Moon Surface Graphic */}
          <Svg width="260" height="220" viewBox="0 0 260 220">
            <Defs>
              <RadialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#334155" stopOpacity="0.8" />
                <Stop offset="80%" stopColor="#1E293B" stopOpacity="0.9" />
                <Stop offset="100%" stopColor="#0B132B" stopOpacity="1" />
              </RadialGradient>
            </Defs>

            {/* Moon Globe Base */}
            <Circle cx="130" cy="110" r="95" fill="url(#moonGlow)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />

            {/* Lunar Craters / Maria Patterns */}
            <Circle cx="95" cy="85" r="28" fill="#141E33" opacity="0.8" />
            <Circle cx="155" cy="80" r="34" fill="#141E33" opacity="0.85" />
            <Circle cx="130" cy="175" r="22" fill="#0E172A" opacity="0.9" />
            <Circle cx="170" cy="140" r="14" fill="#1A2744" opacity="0.7" />
            <Circle cx="80" cy="145" r="16" fill="#1A2744" opacity="0.7" />

            {/* Radar Range Rings */}
            <Circle cx="130" cy="110" r="70" fill="none" stroke="rgba(0, 240, 255, 0.2)" strokeDasharray="3 3" />
            <Circle cx="130" cy="110" r="45" fill="none" stroke="rgba(0, 240, 255, 0.25)" strokeDasharray="4 4" />
            <Circle cx="130" cy="110" r="20" fill="none" stroke="rgba(0, 240, 255, 0.3)" />

            {/* Grid crosshairs */}
            <Line x1="130" y1="15" x2="130" y2="205" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="35" y1="110" x2="225" y2="110" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
          </Svg>

          {/* Animated Radar Sweep Line */}
          <Animated.View
            style={[
              styles.radarSweepLine,
              { transform: [{ rotate: sweepRotation }] },
            ]}
          >
            <View style={styles.sweepBeam} />
          </Animated.View>

          {/* Region 1 Pin: Shackleton Crater (South Pole) */}
          <Pressable
            style={[styles.beaconPin, { top: 165, left: 118 }]}
            onPress={() => setSelectedId('shackleton-crater')}
          >
            <View style={[styles.pinInner, selectedId === 'shackleton-crater' && styles.pinActive]}>
              <Text style={styles.pinIcon}>🧊</Text>
            </View>
            <Text style={[styles.pinLabel, selectedId === 'shackleton-crater' && styles.pinLabelActive]}>
              শ্যাকলটন
            </Text>
          </Pressable>

          {/* Region 2 Pin: Mare Tranquillitatis (Apollo 11) */}
          <Pressable
            style={[styles.beaconPin, { top: 72, left: 146 }]}
            onPress={() => setSelectedId('mare-tranquillitatis')}
          >
            <View style={[styles.pinInner, selectedId === 'mare-tranquillitatis' && styles.pinActive]}>
              <Text style={styles.pinIcon}>🚀</Text>
            </View>
            <Text style={[styles.pinLabel, selectedId === 'mare-tranquillitatis' && styles.pinLabelActive]}>
              শান্ত সাগর
            </Text>
          </Pressable>

          {/* Region 3 Pin: Oceanus Procellarum */}
          <Pressable
            style={[styles.beaconPin, { top: 76, left: 74 }]}
            onPress={() => setSelectedId('oceanus-procellarum')}
          >
            <View style={[styles.pinInner, selectedId === 'oceanus-procellarum' && styles.pinActive]}>
              <Text style={styles.pinIcon}>🌋</Text>
            </View>
            <Text style={[styles.pinLabel, selectedId === 'oceanus-procellarum' && styles.pinLabelActive]}>
              ঝড়ো মহাসাগর
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 3 Interactive Region Selection Cards */}
      <View style={styles.regionListSection}>
        <Text style={styles.sectionHeading}>উপলব্ধ অবতরণ সাইটসমূহ (৩টি অঞ্চল)</Text>

        {LUNAR_REGIONS.map((region) => {
          const isSelected = region.id === selectedId;

          return (
            <Pressable
              key={region.id}
              onPress={() => setSelectedId(region.id)}
              style={[
                styles.regionCard,
                isSelected && { borderColor: region.accentColor, backgroundColor: 'rgba(20, 26, 75, 0.95)' },
              ]}
            >
              {/* Card Header */}
              <View style={styles.regionCardTop}>
                <View style={styles.regionTitleGroup}>
                  <View style={[styles.badgeCircle, { backgroundColor: `${region.accentColor}25` }]}>
                    <Text style={styles.badgeEmoji}>{region.badge}</Text>
                  </View>
                  <View style={styles.titleCol}>
                    <Text style={[styles.regionName, isSelected && { color: region.accentColor }]}>
                      {region.name_bn}
                    </Text>
                    <Text style={styles.regionEnglish}>{region.englishName}</Text>
                  </View>
                </View>

                {isSelected ? (
                  <View style={[styles.selectedCheck, { backgroundColor: region.accentColor }]}>
                    <Check size={14} color="#0B0F19" strokeWidth={3} />
                  </View>
                ) : (
                  <View style={styles.unselectedRing} />
                )}
              </View>

              <Text style={styles.regionDesc}>{region.description_bn}</Text>

              {/* Telemetry Stats Bars */}
              <View style={styles.statsGrid}>
                {/* Sunlight */}
                <View style={styles.statItem}>
                  <View style={styles.statLabelRow}>
                    <View style={styles.statIconName}>
                      <Sun size={12} color={Colors.thermalGold} />
                      <Text style={styles.statName}>সূর্যালোক</Text>
                    </View>
                    <Text style={styles.statValue}>{toBengaliNumber(region.sunlightPower)}%</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${region.sunlightPower}%`, backgroundColor: Colors.thermalGold },
                      ]}
                    />
                  </View>
                </View>

                {/* Water Ice */}
                <View style={styles.statItem}>
                  <View style={styles.statLabelRow}>
                    <View style={styles.statIconName}>
                      <Droplets size={12} color={Colors.hudCyan} />
                      <Text style={styles.statName}>পানির বরফ</Text>
                    </View>
                    <Text style={styles.statValue}>{toBengaliNumber(region.waterIce)}%</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${region.waterIce}%`, backgroundColor: Colors.hudCyan },
                      ]}
                    />
                  </View>
                </View>

                {/* Terrain Risk */}
                <View style={styles.statItem}>
                  <View style={styles.statLabelRow}>
                    <View style={styles.statIconName}>
                      <AlertTriangle
                        size={12}
                        color={region.terrainRisk > 50 ? Colors.coral : Colors.telemetryGreen}
                      />
                      <Text style={styles.statName}>অবতরণ ঝুঁকি</Text>
                    </View>
                    <Text
                      style={[
                        styles.statValue,
                        { color: region.terrainRisk > 50 ? Colors.coral : Colors.telemetryGreen },
                      ]}
                    >
                      {toBengaliNumber(region.terrainRisk)}%
                    </Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${region.terrainRisk}%`,
                          backgroundColor: region.terrainRisk > 50 ? Colors.coral : Colors.telemetryGreen,
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* Science Yield */}
                <View style={styles.statItem}>
                  <View style={styles.statLabelRow}>
                    <View style={styles.statIconName}>
                      <Award size={12} color={Colors.plasmaViolet} />
                      <Text style={styles.statName}>বিজ্ঞান স্কোর</Text>
                    </View>
                    <Text style={styles.statValue}>{toBengaliNumber(region.scienceYield)}%</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${region.scienceYield}%`, backgroundColor: Colors.plasmaViolet },
                      ]}
                    />
                  </View>
                </View>
              </View>

              {/* Optimal Gear Hint */}
              <View style={styles.hintSnippet}>
                <Sparkles size={12} color={region.accentColor} />
                <Text style={styles.hintSnippetText}>{region.optimalEquipmentHint_bn}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Selected Briefing Callout */}
      <DoubleBezelCard glow="cyan" tag="মিশন কন্ট্রোল নির্দেশনা 📡" style={styles.briefingCard}>
        <View style={styles.calloutRow}>
          <Info size={18} color={Colors.hudCyan} />
          <Text style={styles.calloutText}>{selectedRegion.scientificSignificance_bn}</Text>
        </View>
      </DoubleBezelCard>

      {/* Bottom Sticky Confirmation Action */}
      <View style={styles.bottomBar}>
        <TactileButton
          title={`${selectedRegion.name_bn} নিশ্চিত করো ➔`}
          onPress={() => onConfirmSite(selectedRegion)}
          variant="gold"
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
  headerBlock: {
    marginBottom: 16,
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.hudCyanBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
  },
  stepPillText: {
    color: Colors.hudCyan,
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
  radarCard: {
    backgroundColor: 'rgba(10, 15, 45, 0.9)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.35)',
    padding: 14,
    marginBottom: 20,
    alignItems: 'center',
  },
  radarHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.telemetryGreen,
  },
  liveText: {
    color: Colors.telemetryGreen,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  coordsText: {
    color: Colors.hudCyan,
    fontSize: Typography.size.micro,
    fontFamily: Typography.fontSans,
  },
  radarViewBox: {
    width: 260,
    height: 220,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarSweepLine: {
    position: 'absolute',
    top: 15,
    left: 35,
    width: 190,
    height: 190,
    borderRadius: 95,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sweepBeam: {
    width: 2,
    height: 95,
    backgroundColor: 'rgba(0, 240, 255, 0.7)',
    shadowColor: Colors.hudCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  beaconPin: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinActive: {
    borderColor: Colors.thermalGold,
    backgroundColor: 'rgba(255, 184, 0, 0.3)',
    transform: [{ scale: 1.2 }],
    shadowColor: Colors.thermalGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 6,
  },
  pinIcon: {
    fontSize: 14,
  },
  pinLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: Typography.weight.bold,
    marginTop: 2,
    textShadowColor: '#000',
    textShadowRadius: 4,
  },
  pinLabelActive: {
    color: Colors.thermalGold,
    fontWeight: Typography.weight.heavy,
  },
  regionListSection: {
    marginBottom: 16,
  },
  sectionHeading: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    marginBottom: 12,
  },
  regionCard: {
    backgroundColor: 'rgba(14, 18, 60, 0.82)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 14,
    marginBottom: 14,
  },
  regionCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  regionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  badgeCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeEmoji: {
    fontSize: 18,
  },
  titleCol: {
    flex: 1,
  },
  regionName: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.heavy,
  },
  regionEnglish: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
  },
  selectedCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  regionDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statItem: {
    width: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 10,
    padding: 8,
  },
  statLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statIconName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statName: {
    color: Colors.textSecondary,
    fontSize: Typography.size.micro,
  },
  statValue: {
    color: Colors.text,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  barTrack: {
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  hintSnippet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  hintSnippetText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.micro,
    flex: 1,
  },
  briefingCard: {
    marginBottom: 20,
  },
  calloutRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  calloutText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
  },
  bottomBar: {
    marginTop: 4,
  },
});
