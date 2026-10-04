import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Home, BookOpen, Rocket, User } from 'lucide-react-native';
import { useAppStore } from '../../src/state/useAppStore';
import { getTranslation } from '../../src/i18n/translations';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const { language } = useAppStore();
  const t = getTranslation(language);
  const insets = useSafeAreaInsets();

  const bottomInset = Math.max(insets.bottom, 8);
  const tabHeight = 64 + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        },
        headerTintColor: Colors.primary,
        headerTitleStyle: {
          fontFamily: Typography.family.heading,
          fontSize: Typography.size.h3,
          color: Colors.text,
        },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: Colors.background },
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: bottomInset + 2,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: Typography.size.micro,
          lineHeight: Typography.lineHeight.micro,
          fontFamily: Typography.family.headingSemi,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.dashboard,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconCircle, focused && styles.tabActiveCircle]}>
              <Home color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
          // The home screen draws its own merged top bar (logo, rank, XP)
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          title: t.tabs.lessons,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconCircle, focused && styles.tabActiveCircle]}>
              <BookOpen color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
          headerTitle: t.tabs.lessonsHeader,
        }}
      />
      <Tabs.Screen
        name="mission"
        options={{
          title: t.tabs.mission,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconCircle, focused && styles.tabActiveCircle]}>
              <Rocket color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
          headerTitle: t.tabs.missionHeader,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.tabs.profile,
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconCircle, focused && styles.tabActiveCircle]}>
              <User color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
          headerTitle: t.tabs.profileHeader,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconCircle: {
    width: 52,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActiveCircle: {
    backgroundColor: Colors.primaryBg,
  },
});
