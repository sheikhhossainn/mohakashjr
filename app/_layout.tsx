import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { LevelUpModal } from '../src/components/LevelUpModal';
import { CosmicBackground } from '../src/components/CosmicBackground';
import { useAppStore } from '../src/state/useAppStore';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { hasCompletedOnboarding } = useAppStore();

  useEffect(() => {
    // If user has not completed onboarding and is not already on splash or onboarding, direct them to splash
    const inAuthGroup = segments[0] === 'splash' || segments[0] === 'onboarding';
    if (!hasCompletedOnboarding && !inAuthGroup) {
      router.replace('/splash');
    }
  }, [hasCompletedOnboarding, segments]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.rootContainer}>
        {/* Global Space Starfield Backdrop with Twinkling & Shooting Stars */}
        <CosmicBackground />

        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Colors.surfaceShell },
            headerTintColor: Colors.cyan,
            headerTitleStyle: {
              fontWeight: Typography.weight.bold,
              fontSize: Typography.size.body,
              color: Colors.text,
            },
            contentStyle: { backgroundColor: 'transparent' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="splash" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="lessons/[id]"
            options={{
              title: 'মহাকাশ পাঠাগার 📖',
              headerBackTitle: 'পেছনে',
            }}
          />
          <Stack.Screen
            name="quiz/[id]"
            options={{
              title: 'কুইজ অভিযান 🎮',
              headerBackTitle: 'ফিরে যাও',
            }}
          />
          <Stack.Screen
            name="quiz/index"
            options={{
              title: 'কুইজ হাব 🏆',
              headerBackTitle: 'পেছনে',
            }}
          />
          <Stack.Screen
            name="mission/index"
            options={{
              title: 'চন্দ্রাভিযান মিশন কন্ট্রোল 🌕',
              headerBackTitle: 'পেছনে',
            }}
          />
        </Stack>

        {/* Global Celebratory Promotion Modal on Level-Up */}
        <LevelUpModal />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.void,
  },
});
