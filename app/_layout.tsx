import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  BalooDa2_500Medium,
  BalooDa2_600SemiBold,
  BalooDa2_700Bold,
} from '@expo-google-fonts/baloo-da-2';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { LevelUpModal } from '../src/components/LevelUpModal';
import { AutoUpdateBanner } from '../src/components/AutoUpdateBanner';
import { AppLogo } from '../src/components/AppLogo';
import { useAppStore } from '../src/state/useAppStore';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { hasCompletedOnboarding, isHydrated, loadSavedProgress } = useAppStore();

  const [fontsLoaded] = useFonts({
    'NotoSansBengali-Regular': require('../assets/fonts/NotoSansBengali-Regular.ttf'),
    'NotoSansBengali-SemiBold': require('../assets/fonts/NotoSansBengali-SemiBold.ttf'),
    'NotoSansBengali-Bold': require('../assets/fonts/NotoSansBengali-Bold.ttf'),
    'HindSiliguri-Regular': require('../assets/fonts/HindSiliguri-Regular.ttf'),
    'HindSiliguri-SemiBold': require('../assets/fonts/HindSiliguri-SemiBold.ttf'),
    'HindSiliguri-Bold': require('../assets/fonts/HindSiliguri-Bold.ttf'),
    'BalooDa2-Medium': BalooDa2_500Medium,
    'BalooDa2-SemiBold': BalooDa2_600SemiBold,
    'BalooDa2-Bold': BalooDa2_700Bold,
  });

  useEffect(() => {
    // Restore saved progress from this device on app launch
    loadSavedProgress();
  }, []);

  useEffect(() => {
    // Wait for saved progress to load, then send first-time students to splash
    if (!isHydrated) return;
    const firstSeg = segments[0] as string | undefined;
    const inIntroFlow = firstSeg === 'splash' || firstSeg === 'onboarding';
    if (!hasCompletedOnboarding && !inIntroFlow) {
      router.replace('/splash');
    }
  }, [hasCompletedOnboarding, isHydrated, segments]);

  if (!fontsLoaded || !isHydrated) {
    // Loading screen = the logo, circling slowly until fonts and saved progress are ready
    return (
      <View style={[styles.rootContainer, styles.loadingScreen]}>
        <StatusBar style="light" />
        <AppLogo size={150} loading />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {/* Whole app is dark space — light status bar icons */}
      <StatusBar style="light" />
      <View style={styles.rootContainer}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Colors.surface },
            headerTintColor: Colors.primary,
            headerTitleStyle: {
              fontWeight: Typography.weight.bold,
              fontSize: Typography.size.body,
              color: Colors.text,
              fontFamily: Typography.family.heading,
            },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: Colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="splash" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="lessons/[id]"
            options={{
              headerShown: false,
              title: 'মহাকাশ পাঠাগার',
              headerBackTitle: 'পেছনে',
            }}
          />
          <Stack.Screen
            name="quiz/[id]"
            options={{
              headerShown: false,
              title: 'কুইজ অভিযান',
              headerBackTitle: 'ফিরে যাও',
            }}
          />
          <Stack.Screen
            name="quiz/index"
            options={{
              headerShown: false,
              title: 'কুইজ হাব',
              headerBackTitle: 'পেছনে',
            }}
          />
          <Stack.Screen
            name="mission/index"
            options={{
              title: 'চন্দ্রাভিযান মিশন',
              headerBackTitle: 'পেছনে',
              headerStyle: { backgroundColor: Colors.background },
              headerTintColor: Colors.text,
            }}
          />
          <Stack.Screen
            name="tutor"
            options={{
              headerShown: false,
              title: 'ক্যাপ্টেন রোভার এআই',
              headerBackTitle: 'পেছনে',
            }}
          />
        </Stack>

        {/* Global Celebratory Promotion Modal on Level-Up */}
        <LevelUpModal />

        {/* In-App Automatic OTA Update Notification & Reload Banner */}
        <AutoUpdateBanner />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingScreen: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
