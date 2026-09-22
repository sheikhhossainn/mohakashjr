import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Rocket, BookOpen, User, Compass, Sparkles } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.void,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255, 255, 255, 0.08)',
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: Typography.weight.bold,
          fontSize: Typography.size.h3,
          color: Colors.text,
        },
        tabBarStyle: {
          backgroundColor: '#12173E',
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 6,
        },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: Typography.size.micro,
          fontWeight: Typography.weight.bold,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ড্যাশবোর্ড',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconCircle, focused && styles.tabActiveCircle]}>
              <Compass color={color} size={22} />
            </View>
          ),
          headerTitle: 'মহাকাশ জুনিয়র 🚀',
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          title: 'পাঠশালা',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconCircle, focused && styles.tabActiveCircle]}>
              <BookOpen color={color} size={22} />
            </View>
          ),
          headerTitle: 'মহাকাশ পাঠশালা 📚',
        }}
      />
      <Tabs.Screen
        name="mission"
        options={{
          title: 'চন্দ্রাভিযান',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconCircle, focused && styles.tabActiveCircle]}>
              <Rocket color={color} size={22} />
            </View>
          ),
          headerTitle: 'চন্দ্রপৃষ্ঠে অবতরণ মিশন 🌕',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'প্রোফাইল',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconCircle, focused && styles.tabActiveCircle]}>
              <User color={color} size={22} />
            </View>
          ),
          headerTitle: 'আমার নভোচারী প্রোফাইল 👨‍🚀',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActiveCircle: {
    backgroundColor: 'rgba(255, 184, 0, 0.14)',
  },
});
