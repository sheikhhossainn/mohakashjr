/**
 * AtmosphericJourney.tsx
 *
 * Full 6-layer atmospheric crossing scene for MohaKash Jr. Moon Mission.
 * The rocket launches from Earth's surface and travels through:
 *   1. Troposphere   (0–12 km)    — sound barrier / Mach 1 condensation cone, clouds
 *   2. Stratosphere  (12–50 km)   — ozone layer, SRB solid booster separation
 *   3. Mesosphere    (50–80 km)   — night sky, shooting stars, engine vacuum plume expansion
 *   4. Thermosphere  (80–700 km)  — auroras, International Space Station (ISS) flyby at 400 km
 *   5. Exosphere     (700+ km)    — Earth as Blue Marble, microgravity zero-G
 *   6. Deep Space    (→ Moon)     — Trans-Lunar Injection (TLI), Moon craters looming ahead
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  Pressable,
} from 'react-native';
import Svg, {
  Circle,
  Rect,
  Path,
  Line,
  G,
  Defs,
  LinearGradient,
  Stop,
  Polygon,
  Ellipse,
} from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { RealisticRocket } from './RealisticRocket';
import { PLANETARY_MISSIONS, PlanetaryMissionStage } from '../../content/planetaryMissionsData';
import { DestinationId } from '../../content/spaceDestinations';
import { AlertTriangle } from 'lucide-react-native';
import { Typography } from '../../theme/typography';
import { GentleButton } from '../GentleButton';
import { useAppStore } from '../../state/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Flame,
  Award,
  Compass,
  Gauge,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react-native';

const { width: W, height: H } = Dimensions.get('window');



interface InterplanetaryJourneyProps {
  destinationId: DestinationId; onMissionComplete: (xp: number) => void;
  onBack?: () => void;
}

export const InterplanetaryJourney: React.FC<InterplanetaryJourneyProps> = ({
  destinationId,
  onMissionComplete,
  onBack,
}) => {
  const language = useAppStore((s) => s.language);
  const insets = useSafeAreaInsets();
  const mission = PLANETARY_MISSIONS[destinationId] || PLANETARY_MISSIONS.mars;
  const LAYERS = mission.stages;

  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizAnsweredCorrectly, setQuizAnsweredCorrectly] = useState(false);
  const [quizFailed, setQuizFailed] = useState(false);

  const [currentLayerIndex, setCurrentLayerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);
  const [journeyComplete, setJourneyComplete] = useState(false);

  // Animation values
  const rocketY = useRef(new Animated.Value(0)).current;
  const rocketShake = useRef(new Animated.Value(0)).current;
  const srbSeparation = useRef(new Animated.Value(0)).current;
  const factSlide = useRef(new Animated.Value(0)).current;
  const factOpacity = useRef(new Animated.Value(1)).current;
  const issTranslate = useRef(new Animated.Value(W + 80)).current;
  const issOpacity = useRef(new Animated.Value(0)).current;
  const moonScale = useRef(new Animated.Value(0.3)).current;
  const moonOpacity = useRef(new Animated.Value(0)).current;
  const starOpacity = useRef(new Animated.Value(0)).current;
  const meteorSlide = useRef(new Animated.Value(-100)).current;

  const currentLayer = LAYERS[currentLayerIndex];

  // Destination-specific color palette for each visual layer
  const DEST_COLORS: Record<string, { launch: string; cruise: string; entry: string; descent: string; surface: string }> = {
    mars:    { launch: '#38BDF8', cruise: '#0A0F1E', entry: '#7C2D12', descent: '#A16207', surface: '#B45309' },
    mercury: { launch: '#38BDF8', cruise: '#050810', entry: '#1C1917', descent: '#44403C', surface: '#57534E' },
    venus:   { launch: '#38BDF8', cruise: '#0A0F1E', entry: '#7C3A00', descent: '#854D0E', surface: '#713F12' },
    jupiter: { launch: '#38BDF8', cruise: '#0C0B1A', entry: '#7C2D12', descent: '#A16207', surface: '#854D0E' },
    saturn:  { launch: '#38BDF8', cruise: '#06081A', entry: '#451A03', descent: '#78350F', surface: '#92400E' },
    uranus:  { launch: '#38BDF8', cruise: '#061A20', entry: '#0E4A52', descent: '#0F4F5C', surface: '#155E75' },
    neptune: { launch: '#38BDF8', cruise: '#060D1A', entry: '#1E3A5F', descent: '#1E40AF', surface: '#1D4ED8' },
    moon:    { launch: '#38BDF8', cruise: '#090D1A', entry: '#1F1F2E', descent: '#2D2D3D', surface: '#374151' },
  };
  const dc = DEST_COLORS[destinationId] || DEST_COLORS.mars;

  const getVisuals = (layerType: string) => {
    switch (layerType) {
      case 'launch_pad':        return { bgFrom: dc.launch,   hasClouds: true,  hasEarthMarble: false, hasStars: false, hasAsteroids: false, isSurface: false };
      case 'transfer_orbit':    return { bgFrom: dc.cruise,   hasClouds: false, hasEarthMarble: true,  hasStars: true,  hasAsteroids: (destinationId === 'mars' || destinationId === 'jupiter'), isSurface: false };
      case 'atmospheric_entry': return { bgFrom: dc.entry,    hasClouds: false, hasEarthMarble: false, hasStars: false, hasAsteroids: false, hasFlames: true, isSurface: false };
      case 'descent_sequence':  return { bgFrom: dc.descent,  hasClouds: false, hasEarthMarble: false, hasStars: false, hasAsteroids: false, isSurface: false };
      case 'surface_operations':return { bgFrom: dc.surface,  hasClouds: false, hasEarthMarble: false, hasStars: false, hasAsteroids: false, isSurface: true  };
      default:                  return { bgFrom: dc.cruise,   hasClouds: false, hasEarthMarble: false, hasStars: true,  hasAsteroids: false, isSurface: false };
    }
  };
  const visuals = getVisuals(currentLayer.visualLayer);

  // Engine exhaust flame loop
  useEffect(() => {
    // Flight rumble
    const shakeAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(rocketShake, { toValue: 2.5, duration: 70, useNativeDriver: true }),
        Animated.timing(rocketShake, { toValue: -2.5, duration: 70, useNativeDriver: true }),
        Animated.timing(rocketShake, { toValue: 1.5, duration: 70, useNativeDriver: true }),
        Animated.timing(rocketShake, { toValue: 0, duration: 70, useNativeDriver: true }),
      ])
    );
    shakeAnim.start();

    return () => {
      shakeAnim.stop();
    };
  }, []);

  // Layer-specific visual events
  useEffect(() => {
    let meteorLoop: Animated.CompositeAnimation | null = null;
    let issAnim: Animated.CompositeAnimation | null = null;

    // 1. SRB booster separation in Stratosphere
    if (currentLayerIndex === 1) {
      Animated.timing(srbSeparation, {
        toValue: 1,
        duration: 2200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }

    // 2. Meteors in Mesosphere
    if (currentLayerIndex === 2) {
      meteorLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(meteorSlide, { toValue: W + 100, duration: 1200, easing: Easing.linear, useNativeDriver: true }),
          Animated.delay(1800),
          Animated.timing(meteorSlide, { toValue: -100, duration: 0, useNativeDriver: true }),
        ])
      );
      meteorLoop.start();
    }

    // 3. ISS flyby in Thermosphere
    if (visuals.hasEarthMarble) {
      issOpacity.setValue(1);
      issTranslate.setValue(W + 80);
      issAnim = Animated.timing(issTranslate, {
        toValue: -220,
        duration: 6500,
        easing: Easing.linear,
        useNativeDriver: true,
      });
      issAnim.start(() => {
        issOpacity.setValue(0);
      });
    }

    // 4. Stars fade in from Mesosphere onward
    if (visuals.hasStars) {
      Animated.timing(starOpacity, {
        toValue: Math.min((currentLayerIndex - 1) / 3, 1),
        duration: 900,
        useNativeDriver: true,
      }).start();
    }

    // 5. Moon grows large in Deep Space
    if (visuals.isSurface) {
      Animated.parallel([
        Animated.spring(moonScale as any, { toValue: 1, friction: 6, tension: 25, useNativeDriver: true }),
        Animated.timing(moonOpacity, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ]).start();
    }

    return () => {
      if (meteorLoop) meteorLoop.stop();
      if (issAnim) issAnim.stop();
      srbSeparation.stopAnimation();
      moonScale.stopAnimation();
      moonOpacity.stopAnimation();
      starOpacity.stopAnimation();
      meteorSlide.stopAnimation();
      issTranslate.stopAnimation();
    };
  }, [currentLayerIndex]);

  // Thruster manual power boost interaction
  const triggerBoost = () => {
    if (isBoosting) return;
    setIsBoosting(true);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(rocketY, { toValue: -24, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(rocketY, { toValue: 0, duration: 500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(rocketShake, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(rocketShake, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(rocketShake, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]),
    ]).start(() => {
      setIsBoosting(false);
    });
  };

  const proceedToNextStage = () => {
    if (isTransitioning) return;

    if (currentLayerIndex >= LAYERS.length - 1) {
      setJourneyComplete(true);
      return;
    }

    setIsTransitioning(true);

    // Rocket ascends upwards into the next layer
    Animated.parallel([
      Animated.timing(factOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(factSlide, { toValue: -24, duration: 220, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(rocketY, { toValue: -55, duration: 400, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.timing(rocketY, { toValue: 0, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
    ]).start(() => {
      setCurrentLayerIndex((prev) => prev + 1);
      factSlide.setValue(24);
      setSelectedQuizOption(null);
      setQuizAnsweredCorrectly(false);
      setQuizFailed(false);

      Animated.parallel([
        Animated.timing(factOpacity, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.spring(factSlide as any, { toValue: 0, friction: 7, tension: 40, useNativeDriver: true }),
      ]).start(() => {
        setIsTransitioning(false);
      });
    });
  };

  const advanceLayer = () => {
    if (isTransitioning) return;

    if (currentLayerIndex >= LAYERS.length - 1) {
      setJourneyComplete(true);
      return;
    }

    // If current layer has a quiz checkpoint and cadet hasn't answered yet
    if (currentLayer.quiz && !quizAnsweredCorrectly) {
      setShowQuiz(true);
      return;
    }

    proceedToNextStage();
  };

  const handleSelectQuizOption = (optIndex: number) => {
    if (!currentLayer.quiz || quizAnsweredCorrectly) return;
    setSelectedQuizOption(optIndex);

    if (optIndex === currentLayer.quiz.correctIndex) {
      setQuizAnsweredCorrectly(true);
      setQuizFailed(false);
      // Small celebratory thrust and proceed
      setTimeout(() => {
        setShowQuiz(false);
        proceedToNextStage();
      }, 750);
    } else {
      setQuizFailed(true);
      // Rocket shake turbulence
      Animated.sequence([
        Animated.timing(rocketShake, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(rocketShake, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(rocketShake, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  };

  // Parallax stars
  const SPACE_STARS = [
    { x: 0.08, y: 0.06, r: 1.5 }, { x: 0.24, y: 0.14, r: 2.0 }, { x: 0.52, y: 0.09, r: 1.0 },
    { x: 0.74, y: 0.20, r: 2.5 }, { x: 0.89, y: 0.07, r: 1.5 }, { x: 0.16, y: 0.25, r: 1.0 },
    { x: 0.38, y: 0.32, r: 2.0 }, { x: 0.64, y: 0.18, r: 1.5 }, { x: 0.82, y: 0.36, r: 2.0 },
    { x: 0.30, y: 0.45, r: 1.5 }, { x: 0.55, y: 0.40, r: 2.2 }, { x: 0.92, y: 0.48, r: 1.2 },
  ];

  const srbLeftX = srbSeparation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -45],
  });
  const srbRightX = srbSeparation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 45],
  });
  const srbOpacity = srbSeparation.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 0.6, 0],
  });

  return (
    <View style={[styles.container, { backgroundColor: visuals.bgFrom }]}>

      {/* ── Space Starfield */}
      <Animated.View style={[styles.starField, { opacity: starOpacity }]}>
        {SPACE_STARS.map((s, i) => (
          <View
            key={i}
            style={[
              styles.spaceStar,
              { left: s.x * W, top: s.y * H * 0.7, width: s.r * 2, height: s.r * 2, borderRadius: s.r },
            ]}
          />
        ))}
      </Animated.View>

      {/* ── Mesosphere Shooting Meteor */}
      {visuals.hasAsteroids && (
        <Animated.View
          style={[
            styles.meteorStreak,
            { transform: [{ translateX: meteorSlide }, { translateY: meteorSlide }] },
          ]}
        >
          <Svg width={80} height={40} viewBox="0 0 80 40">
            <Line x1={10} y1={5} x2={75} y2={35} stroke="#FDE047" strokeWidth={2.5} strokeLinecap="round" />
            <Circle cx={75} cy={35} r={3} fill="#FFFFFF" />
          </Svg>
        </Animated.View>
      )}

      {/* ── Troposphere Atmospheric Clouds & Ground Tower */}
      {visuals.hasClouds && (
        <View style={styles.cloudLayer}>
          <Svg width={W} height={160} viewBox={`0 0 ${W} 160`}>
            {/* Soft billowy clouds */}
            <Circle cx={40} cy={60} r={40} fill="#FFFFFF" opacity={0.8} />
            <Circle cx={85} cy={50} r={48} fill="#FFFFFF" opacity={0.85} />
            <Circle cx={140} cy={65} r={38} fill="#FFFFFF" opacity={0.8} />
            <Circle cx={W - 100} cy={55} r={46} fill="#F0F9FF" opacity={0.75} />
            <Circle cx={W - 50} cy={65} r={36} fill="#F0F9FF" opacity={0.7} />
            {/* Ground launch smoke plume */}
            <Ellipse cx={W * 0.5} cy={160} rx={160} ry={45} fill="#E2E8F0" opacity={0.9} />
          </Svg>
        </View>
      )}

      {/* ── Thermosphere Aurora Borealis Curtains */}
      {false && (
        <View style={styles.auroraLayer}>
          <Svg width={W} height={140} viewBox={`0 0 ${W} 140`}>
            <Defs>
              <LinearGradient id="auroraGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
                <Stop offset="50%" stopColor="#06B6D4" stopOpacity="0.55" />
                <Stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
              </LinearGradient>
            </Defs>
            <Path
              d={`M 0 40 Q ${W * 0.25} 10 ${W * 0.5} 35 Q ${W * 0.75} 60 ${W} 25 L ${W} 90 Q ${W * 0.6} 120 0 80 Z`}
              fill="url(#auroraGreen)"
            />
          </Svg>
        </View>
      )}

      {/* ── ISS Space Station Flyby at 400 km */}
      {visuals.hasEarthMarble && (
        <Animated.View
          style={[
            styles.issContainer,
            { opacity: issOpacity, transform: [{ translateX: issTranslate }] },
          ]}
        >
          <Svg width={140} height={55} viewBox="0 0 140 55">
            {/* Main truss */}
            <Rect x="12" y="24" width="116" height="7" fill="#CBD5E1" rx="2" />
            {/* Center pressurized modules */}
            <Rect x="55" y="16" width="30" height="23" fill="#F1F5F9" rx="4" stroke="#94A3B8" strokeWidth="1" />
            <Circle cx="70" cy="27" r="4" fill="#0284C7" />
            {/* Left Solar Array */}
            <Rect x="0" y="8" width="22" height="38" fill="#1E40AF" rx="2" stroke="#3B82F6" strokeWidth="1" />
            <Line x1="11" y1="8" x2="11" y2="46" stroke="#93C5FD" strokeWidth="1" />
            {/* Right Solar Array */}
            <Rect x="118" y="8" width="22" height="38" fill="#1E40AF" rx="2" stroke="#3B82F6" strokeWidth="1" />
            <Line x1="129" y1="8" x2="129" y2="46" stroke="#93C5FD" strokeWidth="1" />
            {/* Heat Radiators */}
            <Rect x="38" y="2" width="12" height="50" fill="#E2E8F0" opacity={0.7} rx="2" />
            <Rect x="90" y="2" width="12" height="50" fill="#E2E8F0" opacity={0.7} rx="2" />
          </Svg>
          <View style={styles.issBadge}>
            <Text style={styles.issBadgeText}>ISS • ৪০০ কিমি (400 km)</Text>
          </View>
        </Animated.View>
      )}

      {/* ── Exosphere: Earth as the Blue Marble */}
      {visuals.hasEarthMarble && (
        <View style={styles.earthMarbleWrapper}>
          <Svg width={220} height={220} viewBox="0 0 220 220">
            <Defs>
              <LinearGradient id="earthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#0284C7" />
                <Stop offset="60%" stopColor="#0369A1" />
                <Stop offset="100%" stopColor="#0B132B" />
              </LinearGradient>
            </Defs>
            <Circle cx="110" cy="110" r="100" fill="url(#earthGrad)" />
            {/* Continents */}
            <Path d="M 60 70 Q 90 50 115 75 Q 100 110 70 100 Z" fill="#22C55E" opacity={0.8} />
            <Path d="M 125 90 Q 155 80 170 120 Q 135 140 120 110 Z" fill="#16A34A" opacity={0.8} />
            {/* Atmosphere glow ring */}
            <Circle cx="110" cy="110" r="103" stroke="#38BDF8" strokeWidth="3" fill="none" opacity={0.7} />
          </Svg>
        </View>
      )}

      {/* ── Deep Space: Glowing Moon */}
      {visuals.isSurface && (
        <Animated.View
          style={[
            styles.moonContainer,
            { opacity: moonOpacity, transform: [{ scale: moonScale }] },
          ]}
        >
          <Svg width={150} height={150} viewBox="0 0 150 150">
            <Defs>
              <LinearGradient id="moonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#F8FAFC" />
                <Stop offset="60%" stopColor="#E2E8F0" />
                <Stop offset="100%" stopColor="#64748B" />
              </LinearGradient>
            </Defs>
            {/* Atmospheric moonlight halo */}
            <Circle cx="75" cy="75" r="72" fill="#FEF08A" opacity={0.12} />
            {/* Moon sphere */}
            <Circle cx="75" cy="75" r="62" fill="url(#moonGlow)" stroke="#F8FAFC" strokeWidth="1.5" />
            {/* Maria seas & craters */}
            <Circle cx="50" cy="48" r="14" fill="#94A3B8" opacity={0.55} />
            <Circle cx="92" cy="72" r="18" fill="#94A3B8" opacity={0.5} />
            <Circle cx="64" cy="94" r="11" fill="#94A3B8" opacity={0.45} />
            <Circle cx="102" cy="46" r="8" fill="#94A3B8" opacity={0.4} />
            <Circle cx="70" cy="62" r="6" fill="#64748B" opacity={0.6} />
            <Circle cx="44" cy="80" r="5" fill="#64748B" opacity={0.5} />
          </Svg>
        </Animated.View>
      )}

      {/* ── Cockpit Flight Telemetry HUD (Pinned Top) */}
      <View style={[styles.topHUD, { paddingTop: insets.top + 8 }]}>
        <View style={styles.hudCard}>
          {/* Top Row: Mission Stage Title & G-Force */}
          <View style={styles.hudTopRow}>
              {onBack && (
                <Pressable onPress={onBack} style={styles.hudBackBtn} accessibilityRole="button">
                  <Text style={styles.hudBackBtnText}>{language === 'en' ? '← Back' : '← পেছনে'}</Text>
                </Pressable>
              )}
            <View style={styles.hudStageTag}>
              <View style={styles.livePulseDot} />
              <Text style={styles.hudStageText}>
                {language === 'en' ? currentLayer.title_en : currentLayer.title_bn}
              </Text>
            </View>
            <View style={styles.gForcePill}>
              <Text style={styles.gForceText}>TEMP: {(language === 'en' ? currentLayer.telemetry.temperature_en : currentLayer.telemetry.temperature).split(' ')[0]}</Text>
            </View>
          </View>

          {/* Telemetry Stats: Altitude & Velocity */}
          <View style={styles.telemetryStatsRow}>
            <View style={styles.telemetryItem}>
              <Text style={styles.telemetryLabel}>উচ্চতা (ALTITUDE)</Text>
              <Text style={[styles.telemetryValue, { color: Colors.cyanLight }]}>
                {language === 'en' ? currentLayer.telemetry.altitude_en : currentLayer.telemetry.altitude}
              </Text>
            </View>

            <View style={styles.telemetryDivider} />

            <View style={styles.telemetryItem}>
              <Text style={styles.telemetryLabel}>গতিবেগ (VELOCITY)</Text>
              <Text style={[styles.telemetryValue, { color: Colors.goldLight }]}>
                {language === 'en' ? currentLayer.telemetry.velocity_en : currentLayer.telemetry.velocity}
              </Text>
            </View>
          </View>

          {/* Milestone Banner */}
          <View style={styles.milestoneBanner}>
            <Award size={12} color={Colors.goldLight} />
            <Text style={styles.milestoneText} numberOfLines={1}>
              {language === 'en' ? currentLayer.historicEvent_en : currentLayer.historicEvent_bn}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Ultra-Realistic Spacecraft Centerpiece ── */}
      <View style={styles.rocketPositioner}>
        <RealisticRocket
          translateY={rocketY}
          translateX={rocketShake}
          isBoosting={isBoosting}
          hasSRBs={currentLayer.visualLayer === 'launch_pad'}
          hasSRBSeparation={false}
          hasShockCone={currentLayer.visualLayer === 'launch_pad'}
          hasVacuumPlume={currentLayer.visualLayer !== 'launch_pad'}
        />
      </View>

      {/* ── Educational Fact Panel & Navigation */}
      <Animated.View
        style={[
          styles.factPanel,
          {
            paddingBottom: insets.bottom + 12,
            opacity: factOpacity,
            transform: [{ translateY: factSlide }],
          },
        ]}
      >
        <View style={styles.factPanelInner}>
          {/* Header Row */}
          <View style={styles.factLayerHeader}>
            <View style={styles.altitudeBadge}>
              <Text style={styles.altitudeText}>
                {language === 'en' ? currentLayer.telemetry.altitude_en : currentLayer.telemetry.altitude}
              </Text>
            </View>
            <Text style={styles.layerName}>
              {language === 'en' ? currentLayer.title_en : currentLayer.title_bn}
            </Text>
          </View>

          {/* Scientific Fact Content */}
          <Text style={styles.factText}>
            {language === 'en' ? currentLayer.nasaScienceFact_en : currentLayer.nasaScienceFact_bn}
          </Text>

          {/* Action Button: Advance or Touchdown */}
          <View style={styles.factActionRow}>
            {/* Interactive Thruster Boost Button */}
            {!journeyComplete && (
              <Pressable
                onPress={triggerBoost}
                style={({ pressed }) => [
                  styles.boostInlineBtn,
                  pressed && styles.boostInlineBtnPressed,
                  isBoosting && styles.boostInlineBtnActive,
                ]}
                accessibilityRole="button"
                accessibilityLabel="থ্রাস্টার পাওয়ার বুস্ট"
              >
                <Flame size={15} color="#FFFFFF" fill="#FF8A00" />
                <Text style={styles.boostInlineBtnText}>
                  {isBoosting
                    ? (language === 'en' ? 'THRUSTERS FIRING!' : 'থ্রাস্টার জ্বলছে!')
                    : (language === 'en' ? 'TEST THRUST BOOST' : 'থ্রাস্টার পাওয়ার বুস্ট')}
                </Text>
              </Pressable>
            )}

            {journeyComplete ? (
              <GentleButton
                title={language === 'en' ? 'Complete Mission!' : 'মিশন সম্পূর্ণ করো!'}
                onPress={() => onMissionComplete(120)}
                variant="gold"
                size="large"
                fullWidth
              />
            ) : (
              <GentleButton
                title={
                  currentLayerIndex < LAYERS.length - 1
                    ? (language === 'en' ? `Enter ${LAYERS[currentLayerIndex + 1]?.title_en ?? 'Next Stage'} →` : 'পরবর্তী ধাপে প্রবেশ করো')
                    : (language === 'en' ? 'Complete Mission!' : 'মিশন সম্পূর্ণ করো!')
                }
                onPress={advanceLayer}
                disabled={isTransitioning}
                variant="emerald"
                size="large"
                fullWidth
              />
            )}
          </View>
        </View>
      </Animated.View>
      {/* ── Interactive Flight Checkpoint Quiz Modal ── */}
      {showQuiz && currentLayer.quiz && (
        <View style={styles.quizOverlay}>
          <View style={styles.quizCard}>
            <View style={styles.quizHeader}>
              <View style={styles.quizBadge}>
                <AlertTriangle size={14} color={Colors.gold} />
                <Text style={styles.quizBadgeText}>
                  {language === 'en' ? 'FLIGHT CHECKPOINT' : 'ফ্লাইট ডেক চেকিং'}
                </Text>
              </View>
              <Pressable
                onPress={() => setShowQuiz(false)}
                style={styles.quizCloseBtn}
                accessibilityRole="button"
              >
                <Text style={styles.quizCloseText}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.quizQuestion}>
              {language === 'en' ? currentLayer.quiz.question_en : currentLayer.quiz.question_bn}
            </Text>

            <View style={styles.quizOptionsList}>
              {(language === 'en' ? currentLayer.quiz.options_en : currentLayer.quiz.options_bn).map((opt, idx) => {
                const isSelected = selectedQuizOption === idx;
                const isCorrect = idx === currentLayer.quiz?.correctIndex;
                const showSuccess = isSelected && isCorrect;
                const showFailure = isSelected && !isCorrect;

                return (
                  <Pressable
                    key={idx}
                    onPress={() => handleSelectQuizOption(idx)}
                    style={[
                      styles.quizOptionCard,
                      showSuccess && styles.quizOptionCorrect,
                      showFailure && styles.quizOptionWrong,
                    ]}
                    accessibilityRole="button"
                  >
                    <View style={styles.quizOptionIndex}>
                      <Text style={styles.quizOptionIndexText}>{idx + 1}</Text>
                    </View>
                    <Text style={[styles.quizOptionText, showSuccess && styles.quizOptionTextSuccess]}>
                      {opt}
                    </Text>
                    {showSuccess && <CheckCircle2 size={16} color={Colors.emerald} />}
                  </Pressable>
                );
              })}
            </View>

            {quizFailed && (
              <View style={styles.quizFailureNotice}>
                <AlertTriangle size={14} color={Colors.coral} />
                <Text style={styles.quizFailureText}>
                  {language === 'en' ? currentLayer.quiz.failureExplanation_en : currentLayer.quiz.failureExplanation_bn}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  starField: {
    ...(StyleSheet.absoluteFill as object),
    zIndex: 0,
  },
  spaceStar: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  meteorStreak: {
    position: 'absolute',
    top: H * 0.12,
    left: 0,
    zIndex: 2,
  },
  cloudLayer: {
    position: 'absolute',
    top: H * 0.15,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  auroraLayer: {
    position: 'absolute',
    top: H * 0.14,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  issContainer: {
    position: 'absolute',
    top: H * 0.22,
    zIndex: 6,
    alignItems: 'center',
    gap: 6,
  },
  issBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  issBadgeText: {
    color: Colors.cyanLight,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.heading,
  },
  earthMarbleWrapper: {
    position: 'absolute',
    bottom: H * 0.35,
    right: -40,
    zIndex: 2,
    opacity: 0.85,
  },
  moonContainer: {
    position: 'absolute',
    top: H * 0.18,
    right: 24,
    zIndex: 3,
  },
  topHUD: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    paddingHorizontal: 16,
  },
  hudCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  hudBackBtn: { backgroundColor: 'rgba(239, 68, 68, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: Colors.coral }, hudBackBtnText: { color: Colors.coral, fontSize: Typography.size.caption, fontFamily: Typography.family.headingSemi }, hudTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hudStageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.emerald,
  },
  hudStageText: {
    color: '#FFFFFF',
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.heading,
  },
  gForcePill: {
    backgroundColor: 'rgba(245, 159, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  gForceText: {
    color: Colors.goldLight,
    fontSize: 12,
    fontFamily: Typography.family.heading,
  },
  telemetryStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  telemetryItem: {
    flex: 1,
  },
  telemetryLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: Typography.family.headingSemi,
    marginBottom: 2,
  },
  telemetryValue: {
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.heading,
  },
  telemetryDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginHorizontal: 10,
  },
  milestoneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
  },
  milestoneText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontFamily: Typography.family.notoRegular,
    flex: 1,
  },
  boostInlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EA580C',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#9A3412',
  },
  boostInlineBtnPressed: {
    backgroundColor: '#C2410C',
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1,
  },
  boostInlineBtnActive: {
    backgroundColor: '#0284C7',
    borderBottomColor: '#0369A1',
  },
  boostInlineBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.heading,
    letterSpacing: 0.5,
  },
  rocketPositioner: {
    position: 'absolute',
    top: H * 0.36,
    left: 0,
    right: 0,
    zIndex: 20,
    alignItems: 'center',
  },
  shockwaveCone: {
    position: 'absolute',
    top: 6,
    alignSelf: 'center',
    zIndex: 22,
  },
  rocketAssemblyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  srbWrapper: {
    marginHorizontal: -4,
  },
  boostButtonWrapper: {
    position: 'absolute',
    bottom: H * 0.28,
    alignSelf: 'center',
    zIndex: 25,
  },
  boostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EA580C',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderBottomWidth: 3,
    borderBottomColor: '#9A3412',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 6,
  },
  boostButtonPressed: {
    backgroundColor: '#C2410C',
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1,
  },
  boostButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.heading,
  },
  factPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 35,
    paddingHorizontal: 16,
  },
  factPanelInner: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  factLayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  altitudeBadge: {
    backgroundColor: 'rgba(245, 159, 0, 0.15)',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  altitudeText: {
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.heading,
    color: Colors.goldDark,
  },
  layerName: {
    fontSize: Typography.size.body,
    fontFamily: Typography.family.heading,
    color: Colors.text,
    flex: 1,
  },
  factText: {
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.caption * 1.15,
    marginBottom: 12,
  },
  factActionRow: {
    marginTop: 2,
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 40,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.headingSemi,
  },
  actionButtonsInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  boostPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EA580C',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderBottomWidth: 3,
    borderBottomColor: '#9A3412',
  },
  boostPillBtnPressed: {
    backgroundColor: '#C2410C',
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1,
  },
  boostPillBtnActive: {
    backgroundColor: '#0284C7',
    borderBottomColor: '#0369A1',
  },
  boostPillBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.heading,
  },
  quizOverlay: {
    ...(StyleSheet.absoluteFill as object),
    backgroundColor: 'rgba(5, 8, 22, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 100,
  },
  quizCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    width: '100%',
    maxWidth: 440,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quizBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 159, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 159, 0, 0.3)',
  },
  quizBadgeText: {
    color: Colors.goldLight,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.heading,
    letterSpacing: 0.5,
  },
  quizCloseBtn: {
    padding: 6,
  },
  quizCloseText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quizQuestion: {
    color: '#FFFFFF',
    fontSize: Typography.size.body,
    fontFamily: Typography.family.headingSemi,
    lineHeight: 22,
    marginBottom: 14,
  },
  quizOptionsList: {
    gap: 8,
  },
  quizOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 10,
  },
  quizOptionCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderColor: Colors.emerald,
  },
  quizOptionWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
    borderColor: Colors.coral,
  },
  quizOptionIndex: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizOptionIndexText: {
    color: '#FFFFFF',
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.heading,
  },
  quizOptionText: {
    color: '#E2E8F0',
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
    flex: 1,
  },
  quizOptionTextSuccess: {
    color: '#FFFFFF',
    fontFamily: Typography.family.headingSemi,
  },
  quizFailureNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  quizFailureText: {
    color: '#FCA5A5',
    fontSize: 12,
    fontFamily: Typography.family.notoRegular,
    flex: 1,
    lineHeight: 16,
  },
});
