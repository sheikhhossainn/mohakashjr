import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { DoubleBezelCard } from '../DoubleBezelCard';
import { LunarSiteSelector } from './LunarSiteSelector';
import { CargoPackingGame } from './CargoPackingGame';
import { MissionDebriefView } from './MissionDebriefView';
import {
  LunarRegion,
  LUNAR_REGIONS,
} from '../../content/missionData';
import { Rocket, Radio, Compass, Sparkles } from 'lucide-react-native';

export type MissionStage = 'select_site' | 'pack_cargo' | 'landing_descent' | 'debrief';

interface MoonLandingMissionProps {
  onExitMission?: () => void;
  onMissionComplete?: (earnedXP: number) => void;
  initialStage?: MissionStage;
}

export const MoonLandingMission: React.FC<MoonLandingMissionProps> = ({
  onExitMission,
  onMissionComplete,
  initialStage = 'select_site',
}) => {
  const [currentStage, setCurrentStage] = useState<MissionStage>(initialStage);
  const [selectedSite, setSelectedSite] = useState<LunarRegion>(LUNAR_REGIONS[0]);
  const [selectedCargoIds, setSelectedCargoIds] = useState<string[]>([
    'primary-oxygen',
    'water-food-rations',
  ]);

  // Landing Descent Countdown & Animation state
  const descentProgressAnim = useRef(new Animated.Value(0)).current;
  const rocketShakeAnim = useRef(new Animated.Value(0)).current;
  const [altitudeKm, setAltitudeKm] = useState(100);

  // Transition into descent
  useEffect(() => {
    if (currentStage === 'landing_descent') {
      // Altitude countdown ticker
      let alt = 100;
      const interval = setInterval(() => {
        alt = Math.max(0, alt - 12);
        setAltitudeKm(alt);
        if (alt <= 0) {
          clearInterval(interval);
          setTimeout(() => {
            setCurrentStage('debrief');
          }, 800);
        }
      }, 350);

      // Rocket flame shake
      Animated.loop(
        Animated.sequence([
          Animated.timing(rocketShakeAnim, {
            toValue: -3,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(rocketShakeAnim, {
            toValue: 3,
            duration: 80,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.timing(descentProgressAnim, {
        toValue: 1,
        duration: 3200,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }).start();

      return () => {
        clearInterval(interval);
      };
    }
  }, [currentStage]);

  // Handlers
  const handleConfirmSite = (site: LunarRegion) => {
    setSelectedSite(site);
    setCurrentStage('pack_cargo');
  };

  const handleConfirmPacking = (cargoIds: string[]) => {
    setSelectedCargoIds(cargoIds);
    setCurrentStage('landing_descent');
  };

  const handlePlayAgain = () => {
    setCurrentStage('select_site');
  };

  const handleExit = () => {
    if (onExitMission) {
      onExitMission();
    }
  };

  // 1. Stage 1: Site Selection
  if (currentStage === 'select_site') {
    return (
      <LunarSiteSelector
        initialSiteId={selectedSite.id}
        onConfirmSite={handleConfirmSite}
      />
    );
  }

  // 2. Stage 2: Cargo Packing Mini-game
  if (currentStage === 'pack_cargo') {
    return (
      <CargoPackingGame
        selectedSite={selectedSite}
        initialSelectedIds={selectedCargoIds}
        onConfirmPacking={handleConfirmPacking}
        onBackToSiteSelect={() => setCurrentStage('select_site')}
      />
    );
  }

  // 3. Stage: Dramatic Landing Descent Animation
  if (currentStage === 'landing_descent') {
    return (
      <View style={styles.descentContainer}>
        <DoubleBezelCard glow="cyan" tag="ল্যান্ডিং সিকোয়েন্স 🚀" style={styles.descentCard}>
          <View style={styles.descentHeader}>
            <Radio size={16} color={Colors.hudCyan} />
            <Text style={styles.descentHeaderText}>
              চন্দ্রপৃষ্ঠে অবতরণ টেলিমেট্রি সক্রিয়
            </Text>
          </View>

          {/* Animated Descending Rocket */}
          <Animated.View
            style={[
              styles.rocketWrapper,
              { transform: [{ translateX: rocketShakeAnim }] },
            ]}
          >
            <View style={styles.rocketIconCircle}>
              <Rocket size={44} color={Colors.thermalGold} style={styles.rocketIcon} />
            </View>
            <View style={styles.thrusterFlame} />
          </Animated.View>

          <Text style={styles.descentTitle}>{selectedSite.name_bn}</Text>
          <Text style={styles.descentTargetCoords}>
            কোঅর্ডিনেটস: {selectedSite.coordinates}
          </Text>

          {/* Altitude & Velocity Telemetry Readouts */}
          <View style={styles.telemetryHUD}>
            <View style={styles.hudStat}>
              <Text style={styles.hudStatLabel}>উচ্চতা (Altitude)</Text>
              <Text style={styles.hudStatVal}>{altitudeKm} কিমি</Text>
            </View>
            <View style={styles.hudStatDivider} />
            <View style={styles.hudStat}>
              <Text style={styles.hudStatLabel}>গতিবেগ (Descent Rate)</Text>
              <Text style={styles.hudStatVal}>
                {altitudeKm > 0 ? `${altitudeKm * 25} মি/সে` : '০ মি/সে (টাচডাউন)'}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: descentProgressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['10%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <View style={styles.descentStatusRow}>
            <Sparkles size={14} color={Colors.telemetryGreen} />
            <Text style={styles.descentStatusText}>
              {altitudeKm > 10 ? 'রেট্রো থ্রাস্টার প্রজ্বলন চলছে...' : 'টাচডাউন নিশ্চিত! ধূলিকণা স্থির হচ্ছে...'}
            </Text>
          </View>
        </DoubleBezelCard>
      </View>
    );
  }

  // 4. Stage 3: Mission Debrief
  return (
    <MissionDebriefView
      selectedSite={selectedSite}
      selectedCargoIds={selectedCargoIds}
      onPlayAgain={handlePlayAgain}
      onExitMission={handleExit}
    />
  );
};

const styles = StyleSheet.create({
  descentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  descentCard: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    paddingVertical: 24,
  },
  descentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.hudCyanBg,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 20,
  },
  descentHeaderText: {
    color: Colors.hudCyan,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
  rocketWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  rocketIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 184, 0, 0.18)',
    borderWidth: 2,
    borderColor: Colors.thermalGold,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.thermalGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 14,
    elevation: 8,
  },
  rocketIcon: {
    transform: [{ rotate: '135deg' }], // Point downwards towards moon surface
  },
  thrusterFlame: {
    width: 14,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#FF6B35',
    marginTop: -4,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
  descentTitle: {
    color: Colors.text,
    fontSize: Typography.size.h2,
    fontWeight: Typography.weight.heavy,
    marginBottom: 4,
    textAlign: 'center',
  },
  descentTargetCoords: {
    color: Colors.hudCyan,
    fontSize: Typography.size.caption,
    fontFamily: Typography.fontSans,
    marginBottom: 20,
  },
  telemetryHUD: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 14,
    padding: 12,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  hudStat: {
    alignItems: 'center',
    flex: 1,
  },
  hudStatLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.size.micro,
    marginBottom: 2,
  },
  hudStatVal: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.heavy,
  },
  hudStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.hudCyan,
    borderRadius: 4,
  },
  descentStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  descentStatusText: {
    color: Colors.telemetryGreen,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
  },
});
