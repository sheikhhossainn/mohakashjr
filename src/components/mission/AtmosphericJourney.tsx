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

// 6 Atmospheric layers with authentic NASA scientific data and telemetry
const LAYERS = [
  {
    id: 'troposphere',
    altitudeRange: '০–১২ কিমি',
    altitudeRangeEn: '0–12 km',
    bgFrom: '#38BDF8',
    bgTo: '#0284C7',
    titleEn: 'Troposphere',
    titleBn: 'ট্রপোস্ফিয়ার',
    factEn: "We're in the Troposphere — where weather happens! As we punch through Mach 1, aerodynamic pressure creates a visible supersonic condensation vapor cone around the rocket nose! 🌧️💨",
    factBn: 'আমরা এখন ট্রপোস্ফিয়ারে! এখানেই মেঘ ও ঝড়-বৃষ্টি হয়। রকেট যখন শব্দের চেয়ে দ্রুত (ম্যাক ১) ছোটে, তখন নাকের চারপাশে মেঘের মতো ট্রানসনিক শকওয়েভ রিং তৈরি হয়! 🌧️💨',
    hasClouds: true,
    hasSRBs: true,
    hasShockCone: true,
    speed: 'ম্যাক ১.২ (১,৪৮০ কিমি/ঘণ্টা)',
    speedEn: 'Mach 1.2 (1,480 km/h)',
    altitude: '৮.৫ কিমি',
    altitudeEn: '8.5 km',
    gForce: '২.৮ G',
    pressure: '০.৬৫ atm',
    milestoneBn: 'সাউন্ড ব্যারিয়ার ব্রেক! ট্রানসনিক কনডেনসেশন রিং!',
    milestoneEn: 'Sound Barrier Broken! Transonic Vapor Cone!',
  },
  {
    id: 'stratosphere',
    altitudeRange: '১২–৫০ কিমি',
    altitudeRangeEn: '12–50 km',
    bgFrom: '#1E40AF',
    bgTo: '#172554',
    titleEn: 'Stratosphere',
    titleBn: 'স্ট্র্যাটোস্ফিয়ার',
    factEn: "The Ozone Layer lives here, protecting Earth from harsh solar radiation. Both Solid Rocket Boosters (SRBs) have emptied their fuel and now separate, drifting away as the core stage fires! ☀️🚀",
    factBn: 'এখানেই আছে ওজোন স্তর যা সূর্যের ক্ষতিকর রশ্মি আটকায়। সলিড রকেট বুস্টার দুটির (SRB) জ্বালানি শেষ হয়ে গেছে — এখন সফলভাবে মূল রকেট থেকে আলাদা হয়ে খসে পড়ছে! ☀️🚀',
    hasClouds: false,
    hasSRBSeparation: true,
    speed: 'ম্যাক ৫.৪ (৬,৬০০ কিমি/ঘণ্টা)',
    speedEn: 'Mach 5.4 (6,600 km/h)',
    altitude: '৩৫ কিমি',
    altitudeEn: '35 km',
    gForce: '৩.৬ G',
    pressure: '০.০২ atm',
    milestoneBn: 'বুস্টার সেপারেশন (SRB)! কোর স্টেজ একাকী জ্বলছে!',
    milestoneEn: 'Booster Separation! Core stage powering into orbit!',
  },
  {
    id: 'mesosphere',
    altitudeRange: '৫০–৮০ কিমি',
    altitudeRangeEn: '50–80 km',
    bgFrom: '#0F172A',
    bgTo: '#090D1A',
    titleEn: 'Mesosphere',
    titleBn: 'মেসোস্ফিয়ার',
    factEn: "Meteors burn up here from intense atmospheric friction, appearing as shooting stars! Because air is so thin, the rocket engine plume expands widely into a luminous bell! 🌠🔥",
    factBn: 'এখানেই উল্কাপিণ্ড বাতাসের ঘর্ষণে পুড়ে ছাই হয়ে যায় — যা আমরা তারা খসা বলি! বাতাস খুব পাতলা হওয়ায় রকেটের ইঞ্জিনের অগ্নিশিখা ভ্যাকুয়ামে বিশাল ফুলের মতো ছড়িয়ে পড়ছে! 🌠🔥',
    hasMeteors: true,
    hasVacuumPlume: true,
    speed: 'ম্যাক ১২.০ (১৪,৮০০ কিমি/ঘণ্টা)',
    speedEn: 'Mach 12.0 (14,800 km/h)',
    altitude: '৭০ কিমি',
    altitudeEn: '70 km',
    gForce: '২.১ G',
    pressure: '০.০০০১ atm',
    milestoneBn: 'ভ্যাকুয়াম এক্সপানশন! ইঞ্জিন প্লাজমা বিস্তৃত হচ্ছে!',
    milestoneEn: 'Vacuum Plume Expansion! Engines flare widely!',
  },
  {
    id: 'thermosphere',
    altitudeRange: '৮০–৭০০ কিমি',
    altitudeRangeEn: '80–700 km',
    bgFrom: '#090D1A',
    bgTo: '#030712',
    titleEn: 'Thermosphere + ISS',
    titleBn: 'থার্মোস্ফিয়ার + আইএসএস',
    factEn: "The International Space Station orbits right here at 400 km altitude, flying at an incredible 28,000 km/h! Shimmering auroras dance below us in the upper atmosphere! 🛸",
    factBn: 'আন্তর্জাতিক মহাকাশ স্টেশন (ISS) মাত্র ৪০০ কিমি উচ্চতায় ঘণ্টায় ২৮,০০০ কিমি গতিতে আমাদের সামনে দিয়ে যাচ্ছে! নিচে দেখা যাচ্ছে মেরুজ্যোতি (Aurora)! 🛸',
    hasISS: true,
    hasAuroras: true,
    hasVacuumPlume: true,
    speed: '২৮,০০০ কিমি/ঘণ্টা (অরবিটাল বেগ)',
    speedEn: '28,000 km/h (Orbital Speed)',
    altitude: '৪০০ কিমি',
    altitudeEn: '400 km',
    gForce: '০.০ G (জিরো-গ্র্যাভিটি)',
    pressure: '১০⁻⁷ atm',
    milestoneBn: 'আন্তর্জাতিক মহাকাশ স্টেশন (ISS) দৃশ্যমান! পৃথিবী প্রদক্ষিণ!',
    milestoneEn: 'ISS in Sight! Orbital Trajectory Active!',
  },
  {
    id: 'exosphere',
    altitudeRange: '৭০০–১০,০০০ কিমি',
    altitudeRangeEn: '700–10,000 km',
    bgFrom: '#030712',
    bgTo: '#000000',
    titleEn: 'Exosphere',
    titleBn: 'এক্সোস্ফিয়ার',
    factEn: "Space officially begins! Earth now appears as a breathtaking Blue Marble sphere below us. All aerodynamic drag is gone as we coast in pure microgravity! 🌍🌌",
    factBn: 'এখান থেকে নিখাদ মহাশূন্য শুরু! নিচে পুরো পৃথিবীকে একটি নীল মার্বেল গোলকের মতো অপূর্ব দেখাচ্ছে। বায়ুমণ্ডলের বাধা শেষ, এখন আমরা মহাকর্ষীয় ভারসাম্যে উড়ছি! 🌍🌌',
    hasEarthMarble: true,
    hasVacuumPlume: true,
    speed: '৩২,০০০ কিমি/ঘণ্টা',
    speedEn: '32,000 km/h',
    altitude: '১,২০০ কিমি',
    altitudeEn: '1,200 km',
    gForce: '০.০ G (মাইক্রোগ্র্যাভিটি)',
    pressure: 'মহাশূন্য',
    milestoneBn: 'অরবিট ইনজেকশন সম্পন্ন! চাঁদের ট্র্যাজেক্টরি লকড!',
    milestoneEn: 'Orbital Injection Complete! Trajectory locked on Moon!',
  },
  {
    id: 'deepspace',
    altitudeRange: '→ ৩,৮৪,৪০০ কিমি',
    altitudeRangeEn: '→ 384,400 km',
    bgFrom: '#000000',
    bgTo: '#000000',
    titleEn: 'Deep Space — Moon Ahead!',
    titleBn: 'গভীর মহাকাশ — চাঁদ সামনে!',
    factEn: "Trans-Lunar Injection fired! We are traveling across 384,400 km to the Moon. The Moon's giant craters and ancient lava seas (Maria) are filling the viewport! 🌕🚀",
    factBn: 'ট্রান্স-লুনার বার্ন সফল! আমরা ৩,৮৪,৪০০ কিলোমিটার পথ পাড়ি দিয়ে চাঁদের দিকে ধেয়ে চলেছি। চাঁদের রহস্যময় গর্ত ও শান্ত সাগর এখন উইন্ডশীল্ডে জ্বলজ্বল করছে! 🌕🚀',
    hasMoon: true,
    hasVacuumPlume: true,
    speed: '৩৯,০০০ কিমি/ঘণ্টা (এসকেপ স্পিড)',
    speedEn: '39,000 km/h (Escape Speed)',
    altitude: '৩,৮৪,৪০০ কিমি',
    altitudeEn: '384,400 km',
    gForce: '০.০ G (চন্দ্রাভিযান)',
    pressure: 'মহাজাগতিক শূন্যতা',
    milestoneBn: 'চাঁদের মহাকর্ষ টান শুরু! অবতরণ মডিউল সক্রিয়!',
    milestoneEn: 'Moon Gravity Capture! Landing Module Armed!',
  },
];

interface AtmosphericJourneyProps {
  onMissionComplete: () => void;
  onBack?: () => void;
}

export const AtmosphericJourney: React.FC<AtmosphericJourneyProps> = ({
  onMissionComplete,
  onBack,
}) => {
  const language = useAppStore((s) => s.language);
  const insets = useSafeAreaInsets();

  const [currentLayerIndex, setCurrentLayerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);
  const [journeyComplete, setJourneyComplete] = useState(false);

  // Animation values
  const rocketY = useRef(new Animated.Value(0)).current;
  const rocketShake = useRef(new Animated.Value(0)).current;
  const srbSeparation = useRef(new Animated.Value(0)).current;
  const exhaustScale = useRef(new Animated.Value(1)).current;
  const boostFlare = useRef(new Animated.Value(1)).current;
  const factSlide = useRef(new Animated.Value(0)).current;
  const factOpacity = useRef(new Animated.Value(1)).current;
  const issTranslate = useRef(new Animated.Value(W + 80)).current;
  const issOpacity = useRef(new Animated.Value(0)).current;
  const moonScale = useRef(new Animated.Value(0.3)).current;
  const moonOpacity = useRef(new Animated.Value(0)).current;
  const starOpacity = useRef(new Animated.Value(0)).current;
  const meteorSlide = useRef(new Animated.Value(-100)).current;

  const currentLayer = LAYERS[currentLayerIndex];

  // Engine exhaust flame loop
  useEffect(() => {
    const flameAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(exhaustScale, { toValue: 1.25, duration: 140, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(exhaustScale, { toValue: 0.85, duration: 140, easing: Easing.linear, useNativeDriver: true }),
      ])
    );
    flameAnim.start();

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
      flameAnim.stop();
      shakeAnim.stop();
    };
  }, []);

  // Layer-specific visual events
  useEffect(() => {
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
      Animated.loop(
        Animated.sequence([
          Animated.timing(meteorSlide, { toValue: W + 100, duration: 1200, easing: Easing.linear, useNativeDriver: true }),
          Animated.delay(1800),
          Animated.timing(meteorSlide, { toValue: -100, duration: 0, useNativeDriver: true }),
        ])
      ).start();
    }

    // 3. ISS flyby in Thermosphere
    if (currentLayer.hasISS) {
      issOpacity.setValue(1);
      issTranslate.setValue(W + 80);
      Animated.timing(issTranslate, {
        toValue: -220,
        duration: 6500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        issOpacity.setValue(0);
      });
    }

    // 4. Stars fade in from Mesosphere onward
    if (currentLayerIndex >= 2) {
      Animated.timing(starOpacity, {
        toValue: Math.min((currentLayerIndex - 1) / 3, 1),
        duration: 900,
        useNativeDriver: true,
      }).start();
    }

    // 5. Moon grows large in Deep Space
    if (currentLayer.hasMoon) {
      Animated.parallel([
        Animated.spring(moonScale as any, { toValue: 1, friction: 6, tension: 25, useNativeDriver: true }),
        Animated.timing(moonOpacity, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ]).start();
    }
  }, [currentLayerIndex]);

  // Thruster manual power boost interaction
  const triggerBoost = () => {
    if (isBoosting) return;
    setIsBoosting(true);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(boostFlare, { toValue: 1.6, duration: 200, useNativeDriver: true }),
        Animated.timing(boostFlare, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
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

  const advanceLayer = () => {
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

      Animated.parallel([
        Animated.timing(factOpacity, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.spring(factSlide as any, { toValue: 0, friction: 7, tension: 40, useNativeDriver: true }),
      ]).start(() => {
        setIsTransitioning(false);
      });
    });
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
    <View style={[styles.container, { backgroundColor: currentLayer.bgFrom }]}>
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
      {currentLayer.hasMeteors && (
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
      {currentLayer.hasClouds && (
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
      {currentLayer.hasAuroras && (
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
      {currentLayer.hasISS && (
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
      {currentLayer.hasEarthMarble && (
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
      {currentLayer.hasMoon && (
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
            <View style={styles.hudStageTag}>
              <View style={styles.livePulseDot} />
              <Text style={styles.hudStageText}>
                {language === 'en' ? currentLayer.titleEn : currentLayer.titleBn}
              </Text>
            </View>
            <View style={styles.gForcePill}>
              <Text style={styles.gForceText}>G-FORCE: {currentLayer.gForce}</Text>
            </View>
          </View>

          {/* Telemetry Stats: Altitude & Velocity */}
          <View style={styles.telemetryStatsRow}>
            <View style={styles.telemetryItem}>
              <Text style={styles.telemetryLabel}>উচ্চতা (ALTITUDE)</Text>
              <Text style={[styles.telemetryValue, { color: Colors.cyanLight }]}>
                {language === 'en' ? currentLayer.altitudeEn : currentLayer.altitude}
              </Text>
            </View>

            <View style={styles.telemetryDivider} />

            <View style={styles.telemetryItem}>
              <Text style={styles.telemetryLabel}>গতিবেগ (VELOCITY)</Text>
              <Text style={[styles.telemetryValue, { color: Colors.goldLight }]}>
                {language === 'en' ? currentLayer.speedEn : currentLayer.speed}
              </Text>
            </View>
          </View>

          {/* Milestone Banner */}
          <View style={styles.milestoneBanner}>
            <Award size={12} color={Colors.goldLight} />
            <Text style={styles.milestoneText} numberOfLines={1}>
              {language === 'en' ? currentLayer.milestoneEn : currentLayer.milestoneBn}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Realistic Moon Rocket Centerpiece */}
      <Animated.View
        style={[
          styles.rocketPositioner,
          {
            transform: [{ translateY: rocketY }, { translateX: rocketShake }],
          },
        ]}
      >
        {/* Supersonic Prandtl-Glauert Vapor Cone (Transonic Shockwave) */}
        {currentLayer.hasShockCone && (
          <View style={styles.shockwaveCone}>
            <Svg width={120} height={50} viewBox="0 0 120 50">
              <Path
                d="M 60 5 Q 30 25 10 45 L 110 45 Q 90 25 60 5 Z"
                fill="#FFFFFF"
                opacity={0.65}
              />
              <Ellipse cx={60} cy={45} rx={50} ry={6} fill="#E0F2FE" opacity={0.8} />
            </Svg>
          </View>
        )}

        <View style={styles.rocketAssemblyRow}>
          {/* Left Solid Rocket Booster (SRB) */}
          {(currentLayer.hasSRBs || currentLayer.hasSRBSeparation) && (
            <Animated.View
              style={[
                styles.srbWrapper,
                {
                  transform: [{ translateX: srbLeftX }],
                  opacity: currentLayer.hasSRBSeparation ? srbOpacity : 1,
                },
              ]}
            >
              <Svg width={20} height={100} viewBox="0 0 20 100">
                {/* SRB Nose cone */}
                <Path d="M 10 0 L 2 18 L 18 18 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
                {/* SRB Body */}
                <Rect x="2" y="18" width="16" height="70" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
                {/* SRB Engine Plume */}
                <Path d="M 4 88 Q 10 115 16 88 Z" fill="#FF8A00" />
              </Svg>
            </Animated.View>
          )}

          {/* Core Central Moon Rocket (Saturn V / SLS Architecture) */}
          <Svg width={64} height={150} viewBox="0 0 64 150">
            <Defs>
              <LinearGradient id="coreRocketBody" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="55%" stopColor="#F1F5F9" />
                <Stop offset="100%" stopColor="#94A3B8" />
              </LinearGradient>
              <LinearGradient id="engineFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="25%" stopColor="#00F0FF" />
                <Stop offset="55%" stopColor="#FACC15" />
                <Stop offset="85%" stopColor="#EA580C" />
                <Stop offset="100%" stopColor="rgba(234, 88, 12, 0)" />
              </LinearGradient>
            </Defs>

            {/* Launch Escape Tower / Orion Nosecone */}
            <Path d="M 32 4 L 20 32 L 44 32 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
            <Line x1="32" y1="0" x2="32" y2="4" stroke="#94A3B8" strokeWidth="2" />

            {/* Orion Crew Capsule (Visor Windows) */}
            <Circle cx="32" cy="24" r="5" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
            <Circle cx="30" cy="22" r="1.5" fill="#FFFFFF" />

            {/* Core Propellant Tank Body */}
            <Rect x="20" y="32" width="24" height="74" rx="4" fill="url(#coreRocketBody)" stroke="#64748B" strokeWidth="1.5" />
            {/* NASA Mission Stripe */}
            <Rect x="20" y="54" width="24" height="6" fill="#3B82F6" />
            <Rect x="20" y="76" width="24" height="3" fill="#E11D48" />

            {/* Core Engine Thrust Nozzles */}
            <Path d="M 23 106 L 19 118 L 45 118 L 41 106 Z" fill="#475569" stroke="#334155" strokeWidth="1.5" />

            {/* Active Cryogenic Engine Thrust Flame */}
            <G transform="translate(0, 118)">
              {/* Core Mach diamond flame */}
              <Path d="M 24 0 Q 32 50 40 0 Z" fill="url(#engineFlameGrad)" />
              {/* Mach diamond shock rings */}
              <Ellipse cx={32} cy={12} rx={4} ry={2} fill="#FFFFFF" opacity={0.8} />
              <Ellipse cx={32} cy={24} rx={3} ry={1.5} fill="#38BDF8" opacity={0.7} />

              {/* Vacuum Plume Expansion in Space (Mesosphere to Deep Space) */}
              {currentLayer.hasVacuumPlume && (
                <Path
                  d="M 22 0 Q 32 65 42 0 Q 55 45 62 70 Q 32 85 2 70 Q 9 45 22 0 Z"
                  fill="url(#engineFlameGrad)"
                  opacity={0.65}
                />
              )}
            </G>
          </Svg>

          {/* Right Solid Rocket Booster (SRB) */}
          {(currentLayer.hasSRBs || currentLayer.hasSRBSeparation) && (
            <Animated.View
              style={[
                styles.srbWrapper,
                {
                  transform: [{ translateX: srbRightX }],
                  opacity: currentLayer.hasSRBSeparation ? srbOpacity : 1,
                },
              ]}
            >
              <Svg width={20} height={100} viewBox="0 0 20 100">
                {/* SRB Nose cone */}
                <Path d="M 10 0 L 2 18 L 18 18 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
                {/* SRB Body */}
                <Rect x="2" y="18" width="16" height="70" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
                {/* SRB Engine Plume */}
                <Path d="M 4 88 Q 10 115 16 88 Z" fill="#FF8A00" />
              </Svg>
            </Animated.View>
          )}
        </View>
      </Animated.View>

      {/* ── Interactive Thruster Boost Button */}
      <View style={styles.boostButtonWrapper}>
        <Pressable
          onPress={triggerBoost}
          style={({ pressed }) => [
            styles.boostButton,
            pressed && styles.boostButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="থ্রাস্টার পাওয়ার বুস্ট"
        >
          <Flame size={20} color="#FFFFFF" fill="#FF8A00" />
          <Text style={styles.boostButtonText}>
            {language === 'en' ? 'FIRE THRUSTERS' : 'থ্রাস্টার পাওয়ার বুস্ট'}
          </Text>
        </Pressable>
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
                {language === 'en' ? currentLayer.altitudeRangeEn : currentLayer.altitudeRange}
              </Text>
            </View>
            <Text style={styles.layerName}>
              {language === 'en' ? currentLayer.titleEn : currentLayer.titleBn}
            </Text>
          </View>

          {/* Scientific Fact Content */}
          <Text style={styles.factText}>
            {language === 'en' ? currentLayer.factEn : currentLayer.factBn}
          </Text>

          {/* Action Button: Advance or Touchdown */}
          <View style={styles.factActionRow}>
            {journeyComplete ? (
              <GentleButton
                title={language === 'en' ? 'Begin Lunar Descent!' : 'চন্দ্রে অবতরণ শুরু করো!'}
                onPress={onMissionComplete}
                variant="gold"
                size="large"
                fullWidth
              />
            ) : (
              <GentleButton
                title={
                  currentLayerIndex < LAYERS.length - 1
                    ? (language === 'en' ? `Enter ${LAYERS[currentLayerIndex + 1]?.titleEn ?? 'Next Layer'} →` : `পরবর্তী স্তরে প্রবেশ করো`)
                    : (language === 'en' ? 'Begin Lunar Descent!' : 'চন্দ্রে অবতরণ শুরু করো!')
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

      {/* ── Top Back Button */}
      {onBack && (
        <Pressable
          style={[styles.backBtn, { top: insets.top + 10 }]}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="পেছনে"
        >
          <Text style={styles.backBtnText}>← {language === 'en' ? 'Back' : 'পেছনে'}</Text>
        </Pressable>
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
  hudTopRow: {
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
  rocketPositioner: {
    position: 'absolute',
    top: H * 0.40,
    left: W * 0.5 - 45,
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
});
