import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Modal, Pressable } from 'react-native';
import Svg, { Circle, Rect, Path, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Sparkles, CheckCircle2, AlertCircle, HelpCircle, X } from 'lucide-react-native';
import { TactileButton } from './TactileButton';

// Safe dynamic check for Lottie in case Jim provides assets later
let LottieViewComponent: any = null;
try {
  LottieViewComponent = require('lottie-react-native').default || require('lottie-react-native');
} catch (e) {
  LottieViewComponent = null;
}

export type MascotReactionState = 'correct' | 'incorrect' | 'celebrate' | 'thinking' | 'neutral';

interface MascotReactionProps {
  state?: MascotReactionState;
  size?: number;
  lottieSource?: any; // Optional Lottie animation provided by Jim later
  showSpeechBubble?: boolean;
  bubbleText?: string;
}

export const MascotReaction: React.FC<MascotReactionProps> = ({
  state = 'neutral',
  size = 110,
  lottieSource,
  showSpeechBubble = false,
  bubbleText,
}) => {
  // Continuous Animation Values
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const wiggleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const armWaveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Vertical Floating / Bouncing
    const bounceSequence = state === 'celebrate'
      ? Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: -14,
              duration: 400,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 400,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ])
        )
      : Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: -8,
              duration: 1600,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 8,
              duration: 1600,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ])
        );

    // 2. Wiggle / Head tilt
    const wiggleSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(wiggleAnim, {
          toValue: state === 'celebrate' ? 4 : 2,
          duration: state === 'celebrate' ? 500 : 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(wiggleAnim, {
          toValue: state === 'celebrate' ? -4 : -2,
          duration: state === 'celebrate' ? 500 : 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // 3. Arm wave / action
    const armSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(armWaveAnim, {
          toValue: 1,
          duration: state === 'celebrate' ? 300 : 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(armWaveAnim, {
          toValue: 0,
          duration: state === 'celebrate' ? 300 : 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // 4. Glow pulse for celebrate / correct
    const pulseSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.96,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    bounceSequence.start();
    wiggleSequence.start();
    armSequence.start();
    if (state === 'celebrate' || state === 'correct') {
      pulseSequence.start();
    }

    return () => {
      bounceSequence.stop();
      wiggleSequence.stop();
      armSequence.stop();
      pulseSequence.stop();
    };
  }, [state]);

  const rotateInterpolation = wiggleAnim.interpolate({
    inputRange: [-4, 4],
    outputRange: ['-6deg', '6deg'],
  });

  const armRotation = armWaveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', state === 'celebrate' ? '-35deg' : '-18deg'],
  });

  // State theme configuration
  const stateConfig = {
    celebrate: {
      glow: Colors.gold,
      visorColor: '#FFD700',
      visorReflect: '#FFF9D2',
      defaultSpeech: 'অবিশ্বাস্য সাফল্য! তুমি অনন্য নভোচারী! 🏆',
      bgHalo: 'rgba(255, 184, 0, 0.22)',
    },
    correct: {
      glow: Colors.emerald,
      visorColor: '#10B981',
      visorReflect: '#A7F3D0',
      defaultSpeech: 'একদম নিখুঁত! চন্দ্রাভিযান এগিয়ে চলেছে! 🚀',
      bgHalo: 'rgba(16, 185, 129, 0.20)',
    },
    incorrect: {
      glow: Colors.coral,
      visorColor: '#F43F5E',
      visorReflect: '#FECDD3',
      defaultSpeech: 'একটু সাবধান! আবার চেষ্টা করে সফল হও! 🛰️',
      bgHalo: 'rgba(244, 63, 94, 0.18)',
    },
    thinking: {
      glow: Colors.hudCyan,
      visorColor: '#00F0FF',
      visorReflect: '#CFFAFE',
      defaultSpeech: 'টেলিমেট্রি স্ক্যান করছি... সিদ্ধান্ত নাও! 📡',
      bgHalo: 'rgba(0, 240, 255, 0.16)',
    },
    neutral: {
      glow: Colors.cyan,
      visorColor: '#38BDF8',
      visorReflect: '#E0F2FE',
      defaultSpeech: 'আমি অ্যাস্ট্রো-বন্ধু, তোমার সাথে সবসময়! 👨‍🚀',
      bgHalo: 'rgba(56, 189, 248, 0.12)',
    },
  }[state];

  // If Jim provides a valid Lottie animation file, render it
  if (lottieSource && LottieViewComponent) {
    return (
      <View style={[styles.lottieContainer, { width: size, height: size }]}>
        <LottieViewComponent
          source={lottieSource}
          autoPlay
          loop
          style={{ width: size, height: size }}
        />
      </View>
    );
  }

  // Graceful high-fidelity SVG Reanimated Astro-Buddy vector fallback
  return (
    <View style={styles.rootWrapper}>
      {/* Optional Speech Bubble */}
      {showSpeechBubble && (
        <View style={[styles.bubbleBox, { borderColor: stateConfig.glow }]}>
          <Text style={styles.bubbleText}>
            {bubbleText || stateConfig.defaultSpeech}
          </Text>
          <View style={[styles.bubbleTail, { borderTopColor: stateConfig.glow }]} />
        </View>
      )}

      <Animated.View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            transform: [
              { translateY: bounceAnim },
              { rotate: rotateInterpolation },
              { scale: pulseAnim },
            ],
          },
        ]}
      >
        {/* Glowing Background Aura */}
        <View
          style={[
            styles.glowAura,
            {
              width: size * 0.9,
              height: size * 0.9,
              borderRadius: (size * 0.9) / 2,
              backgroundColor: stateConfig.bgHalo,
            },
          ]}
        />

        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="70%" stopColor="#E2E8F0" />
              <Stop offset="100%" stopColor="#94A3B8" />
            </LinearGradient>

            <LinearGradient id="helmetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="100%" stopColor="#CBD5E1" />
            </LinearGradient>

            <LinearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={stateConfig.visorReflect} />
              <Stop offset="45%" stopColor={stateConfig.visorColor} />
              <Stop offset="100%" stopColor="#0B132B" />
            </LinearGradient>
          </Defs>

          {/* Life Support Backpack */}
          <Rect x="26" y="24" width="48" height="42" rx="8" fill="#64748B" />
          <Rect x="30" y="28" width="40" height="34" rx="6" fill="#475569" />

          {/* Waving Arm (Left) */}
          <G transform="translate(24, 46)">
            <Animated.View style={{ transform: [{ rotate: armRotation }] }}>
              <Svg width="25" height="30" viewBox="0 0 25 30">
                <Path
                  d="M18,4 Q6,12 8,24"
                  fill="none"
                  stroke="url(#suitGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <Circle cx="8" cy="24" r="5.5" fill={stateConfig.glow} />
              </Svg>
            </Animated.View>
          </G>

          {/* Right Arm */}
          <Path
            d="M74,48 Q86,56 82,68"
            fill="none"
            stroke="url(#suitGrad)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <Circle cx="82" cy="68" r="5.5" fill="#64748B" />

          {/* Astronaut Body / Torso */}
          <Path
            d="M32,48 Q50,44 68,48 L64,78 Q50,82 36,78 Z"
            fill="url(#suitGrad)"
          />
          {/* Mission Patch / Chest Indicator */}
          <Rect x="42" y="54" width="16" height="10" rx="3" fill="#1E293B" />
          <Circle cx="46" cy="59" r="2" fill={stateConfig.glow} />
          <Rect x="50" y="57.5" width="6" height="3" rx="1.5" fill="#38BDF8" />

          {/* Big Cartoon Helmet */}
          <Circle cx="50" cy="34" r="25" fill="url(#helmetGrad)" />
          {/* Antenna */}
          <Path d="M50,9 L50,4" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          <Circle cx="50" cy="3" r="3" fill={stateConfig.glow} />

          {/* Thermal Golden/Neon Visor with Emotional Glow */}
          <Rect
            x="32"
            y="22"
            width="36"
            height="24"
            rx="12"
            fill="url(#visorGrad)"
            stroke="#1E293B"
            strokeWidth="2"
          />

          {/* Cute Face Expressions Inside Visor */}
          {state === 'celebrate' ? (
            // Star Eyes for Celebrate
            <G fill="#FFFFFF">
              <Path d="M40,31 L41,33 L43,34 L41,35 L40,37 L39,35 L37,34 L39,33 Z" />
              <Path d="M60,31 L61,33 L63,34 L61,35 L60,37 L59,35 L57,34 L59,33 Z" />
              <Path
                d="M45,38 Q50,43 55,38"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </G>
          ) : state === 'incorrect' ? (
            // Surprised / Concerned Eyes
            <G fill="#FFFFFF">
              <Circle cx="40" cy="32" r="3" />
              <Circle cx="60" cy="32" r="3" />
              <Path
                d="M46,40 Q50,37 54,40"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </G>
          ) : (
            // Happy Normal Blinking Eyes
            <G fill="#FFFFFF">
              <Circle cx="41" cy="32" r="2.8" />
              <Circle cx="59" cy="32" r="2.8" />
              <Circle cx="42" cy="31" r="1" fill="#38BDF8" />
              <Circle cx="60" cy="31" r="1" fill="#38BDF8" />
              <Path
                d="M46,37 Q50,41 54,37"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </G>
          )}

          {/* Visor Specular Reflection */}
          <Path
            d="M36,25 Q48,23 58,27"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

// ==========================================
// Reusable Animated Feedback Modal / Popup
// ==========================================

interface MascotFeedbackPopupProps {
  visible: boolean;
  state: MascotReactionState;
  title: string;
  message: string;
  hint?: string;
  earnedXP?: number;
  onDismiss: () => void;
  actionButtonText?: string;
}

export const MascotFeedbackPopup: React.FC<MascotFeedbackPopupProps> = ({
  visible,
  state,
  title,
  message,
  hint,
  earnedXP,
  onDismiss,
  actionButtonText = 'চালিয়ে যাও ➔',
}) => {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const isPositive = state === 'correct' || state === 'celebrate';
  const themeColor = state === 'celebrate'
    ? Colors.gold
    : state === 'correct'
    ? Colors.emerald
    : Colors.coral;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onDismiss}>
      <View style={styles.modalBackdrop}>
        <Animated.View
          style={[
            styles.popupCard,
            {
              borderColor: themeColor,
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header Banner */}
          <View style={[styles.popupHeader, { backgroundColor: `${themeColor}22` }]}>
            <View style={styles.popupHeaderRow}>
              {isPositive ? (
                <CheckCircle2 size={22} color={themeColor} />
              ) : (
                <AlertCircle size={22} color={themeColor} />
              )}
              <Text style={[styles.popupTitle, { color: themeColor }]}>{title}</Text>
            </View>
            <Pressable onPress={onDismiss} hitSlop={12} style={styles.closeBtn}>
              <X size={18} color={Colors.textMuted} />
            </Pressable>
          </View>

          {/* Animated Mascot Presentation */}
          <View style={styles.popupMascotRow}>
            <MascotReaction state={state} size={100} />
          </View>

          {/* Message Content */}
          <Text style={styles.popupMessage}>{message}</Text>

          {/* Pedagogical Scientific Hint */}
          {hint && (
            <View style={styles.hintBox}>
              <HelpCircle size={16} color={Colors.hudCyan} />
              <Text style={styles.hintText}>{hint}</Text>
            </View>
          )}

          {/* Optional XP Badge */}
          {earnedXP !== undefined && earnedXP > 0 && (
            <View style={styles.xpBadgeRow}>
              <Sparkles size={16} color={Colors.gold} />
              <Text style={styles.xpBadgeText}>+{earnedXP} XP অর্জিত হয়েছে!</Text>
            </View>
          )}

          {/* Bottom Action Button */}
          <View style={styles.actionBtnWrapper}>
            <TactileButton
              title={actionButtonText}
              onPress={onDismiss}
              variant={isPositive ? 'emerald' : 'primary'}
              size="large"
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  rootWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowAura: {
    position: 'absolute',
    opacity: 0.8,
  },
  bubbleBox: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    maxWidth: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  bubbleText: {
    color: Colors.text,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semiBold,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.caption,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 18, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popupCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#0E123C',
    borderRadius: 24,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  popupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  popupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  popupTitle: {
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.heavy,
  },
  closeBtn: {
    padding: 4,
  },
  popupMascotRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  popupMessage: {
    color: Colors.text,
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    borderRadius: 12,
    marginHorizontal: 18,
    padding: 12,
    gap: 8,
    marginBottom: 12,
  },
  hintText: {
    flex: 1,
    color: Colors.hudCyan,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
  },
  xpBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 20,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
  },
  xpBadgeText: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.heavy,
  },
  actionBtnWrapper: {
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
});
