import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Updates from 'expo-updates';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Rocket, RefreshCw, X, Sparkles } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { useAppStore } from '../state/useAppStore';

export const AutoUpdateBanner: React.FC = () => {
  const [updateReady, setUpdateReady] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const language = useAppStore((state) => state.language);
  const insets = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    // Only check for updates in standalone builds where Updates is enabled
    if (__DEV__ || !Updates.isEnabled) {
      return;
    }

    let isMounted = true;

    async function checkAndDownloadUpdate() {
      try {
        const check = await Updates.checkForUpdateAsync();
        if (check.isAvailable && isMounted) {
          const fetchResult = await Updates.fetchUpdateAsync();
          if (fetchResult.isNew && isMounted) {
            setUpdateReady(true);
            Animated.spring(translateY, {
              toValue: 0,
              friction: 8,
              tension: 40,
              useNativeDriver: true,
            }).start();
          }
        }
      } catch (err) {
        // Silently ignore network or offline errors
      }
    }

    // Check after a gentle 3-second delay on app mount
    const timer = setTimeout(() => {
      checkAndDownloadUpdate();
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handleReload = async () => {
    try {
      setIsReloading(true);
      await Updates.reloadAsync();
    } catch (err) {
      setIsReloading(false);
    }
  };

  const handleDismiss = () => {
    Animated.timing(translateY, {
      toValue: -150,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setIsDismissed(true);
    });
  };

  if (!updateReady || isDismissed) {
    return null;
  }

  const isEn = language === 'en';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + 10,
          transform: [{ translateY }],
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.bannerCard}>
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.badgeRow}>
            <View style={styles.iconCircle}>
              <Rocket size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.badgeText}>
              {isEn ? 'UPDATE AVAILABLE' : 'নতুন মিশন আপডেট'}
            </Text>
          </View>

          <Pressable
            onPress={handleDismiss}
            style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={isEn ? 'Dismiss' : 'বন্ধ করো'}
          >
            <X size={16} color="#94A3B8" />
          </Pressable>
        </View>

        {/* Content */}
        <Text style={styles.title}>
          {isEn
            ? 'New Space Exploration Upgrade Ready!'
            : 'নতুন মহাকাশ অভিযান আপডেট প্রস্তুত!'}
        </Text>
        <Text style={styles.description}>
          {isEn
            ? 'Realistic rocket physics, authentic NASA quizzes, and telemetry fixes have been downloaded.'
            : 'বাস্তবসম্মত রকেট সিমুলেশন, নাসা মিশন কুইজ ও অগ্রগতি আপডেট ডাউনলোড সম্পন্ন হয়েছে।'}
        </Text>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <Pressable
            onPress={handleReload}
            disabled={isReloading}
            style={({ pressed }) => [
              styles.reloadBtn,
              pressed && styles.reloadBtnPressed,
              isReloading && styles.btnDisabled,
            ]}
            accessibilityRole="button"
          >
            {isReloading ? (
              <ActivityIndicator size="small" color="#0B1026" />
            ) : (
              <>
                <RefreshCw size={14} color="#0B1026" />
                <Text style={styles.reloadBtnText}>
                  {isEn ? 'Restart & Apply Update' : 'রিস্টার্ট ও আপডেট কার্যকর করো'}
                </Text>
              </>
            )}
          </Pressable>

          <Pressable
            onPress={handleDismiss}
            style={({ pressed }) => [styles.laterBtn, pressed && styles.pressed]}
            accessibilityRole="button"
          >
            <Text style={styles.laterBtnText}>{isEn ? 'Later' : 'পরে'}</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  bannerCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.heading,
    color: '#38BDF8',
    letterSpacing: 0.6,
  },
  closeBtn: {
    padding: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    fontSize: Typography.size.body,
    fontFamily: Typography.family.headingSemi,
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 22,
  },
  description: {
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
    color: '#CBD5E1',
    lineHeight: 18,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reloadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.gold,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderBottomWidth: 3,
    borderBottomColor: '#D97706',
  },
  reloadBtnPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 1,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  reloadBtnText: {
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.heading,
    color: '#0B1026',
  },
  laterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  laterBtnText: {
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.headingMedium,
    color: '#94A3B8',
  },
});
