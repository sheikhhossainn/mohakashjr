import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { DoubleBezelCard } from '../src/components/DoubleBezelCard';
import { TactileButton } from '../src/components/TactileButton';
import { AnimatedMascot } from '../src/components/AnimatedMascot';
import { AstronautAvatar } from '../src/components/AstronautAvatar';
import { SpaceChoiceBadge } from '../src/components/SpaceChoiceBadge';
import { useAppStore, ARCHETYPES, CadetArchetype } from '../src/state/useAppStore';
import { authDatabase, UserAccount } from '../src/services/authDatabase';
import {
  User,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Rocket,
  ShieldCheck,
  Compass,
  ArrowRight,
  AlertCircle,
  Users,
  CheckCircle2,
} from 'lucide-react-native';

export default function AuthScreen() {
  const router = useRouter();
  const {
    signUpUser,
    loginUser,
    continueAsGuest,
    isAuthLoading,
    authError,
    cadetArchetype,
  } = useAppStore();

  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'guest'>('signup');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState<CadetArchetype>(cadetArchetype || 'pilot');
  const [localError, setLocalError] = useState<string | null>(null);
  const [savedUsers, setSavedUsers] = useState<UserAccount[]>([]);

  useEffect(() => {
    // Load previously registered users on this device for 1-tap quick pick
    authDatabase.getAllUsers().then((users) => {
      setSavedUsers(users.filter((u) => !u.isGuest));
    });
  }, []);

  const handleSignUp = async () => {
    setLocalError(null);
    if (!username.trim()) {
      setLocalError('ইউজারনেম বা কল-সাইন প্রদান করো।');
      return;
    }
    if (!displayName.trim()) {
      setLocalError('তোমার নাম প্রদান করো।');
      return;
    }
    if (!password.trim() || password.trim().length < 3) {
      setLocalError('পাসওয়ার্ড কমপক্ষে ৩ অক্ষরের হতে হবে।');
      return;
    }

    const res = await signUpUser({
      username,
      displayName,
      password,
      cadetArchetype: selectedArchetype,
    });

    if (res.success) {
      router.replace('/(tabs)');
    } else if (res.error) {
      setLocalError(res.error);
    }
  };

  const handleLogin = async () => {
    setLocalError(null);
    if (!username.trim()) {
      setLocalError('ইউজারনেম প্রদান করো।');
      return;
    }
    if (!password.trim()) {
      setLocalError('পাসওয়ার্ড প্রদান করো।');
      return;
    }

    const res = await loginUser(username, password);
    if (res.success) {
      router.replace('/(tabs)');
    } else if (res.error) {
      setLocalError(res.error);
    }
  };

  const handleGuest = async () => {
    setLocalError(null);
    const guestName = displayName.trim() || 'অতিথি ক্যাডেট';
    await continueAsGuest(guestName, selectedArchetype);
    router.replace('/(tabs)');
  };

  const archetypeMeta = ARCHETYPES[selectedArchetype];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Branding & Mascot */}
        <View style={styles.headerArea}>
          <View style={styles.mascotSlot}>
            <AnimatedMascot size={80} mood={authMode === 'signup' ? 'excited' : 'happy'} />
          </View>
          <Text style={styles.appTitle}>মহাকাশ একাডেমি ক্রেডেনশিয়াল</Text>
          <Text style={styles.appSubtitle}>
            তোমার মহাকাশ অগ্রগতি ও মিশন ব্যাজ ডিভাইসে নিরাপদে সংরক্ষণ করো
          </Text>
        </View>

        {/* 3-Way Segmented Mode Switcher */}
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tabBtn, authMode === 'signup' && styles.tabBtnActive]}
            onPress={() => {
              setAuthMode('signup');
              setLocalError(null);
            }}
          >
            <Rocket size={14} color={authMode === 'signup' ? '#080D27' : Colors.cyan} />
            <Text style={[styles.tabBtnText, authMode === 'signup' && styles.tabBtnTextActive]}>
              সাইন আপ
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, authMode === 'login' && styles.tabBtnActive]}
            onPress={() => {
              setAuthMode('login');
              setLocalError(null);
            }}
          >
            <ShieldCheck size={14} color={authMode === 'login' ? '#080D27' : Colors.gold} />
            <Text style={[styles.tabBtnText, authMode === 'login' && styles.tabBtnTextActive]}>
              লগইন
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabBtn, authMode === 'guest' && styles.tabBtnActive]}
            onPress={() => {
              setAuthMode('guest');
              setLocalError(null);
            }}
          >
            <Compass size={14} color={authMode === 'guest' ? '#080D27' : Colors.emerald} />
            <Text style={[styles.tabBtnText, authMode === 'guest' && styles.tabBtnTextActive]}>
              অতিথি
            </Text>
          </Pressable>
        </View>

        {/* Error Banner */}
        {(localError || authError) && (
          <View style={styles.errorBanner}>
            <AlertCircle size={16} color={Colors.coral} />
            <Text style={styles.errorText}>{localError || authError}</Text>
          </View>
        )}

        {/* ── MODE 1: SIGN UP ─────────────────────────────────── */}
        {authMode === 'signup' && (
          <DoubleBezelCard glow="cyan" style={styles.authCard}>
            <View style={styles.formSectionHeader}>
              <Sparkles size={16} color={Colors.cyan} />
              <Text style={styles.formSectionTitle}>নতুন ক্যাডেট একাউন্ট তৈরি করো</Text>
            </View>

            {/* Archetype Quick Preview */}
            <View style={styles.archetypePreviewRow}>
              <View style={[styles.archetypeBadgeBox, { borderColor: archetypeMeta.accentColor }]}>
                <SpaceChoiceBadge type={selectedArchetype} size={36} isSelected />
              </View>
              <View style={styles.archetypePreviewInfo}>
                <Text style={[styles.archetypePreviewTitle, { color: archetypeMeta.accentColor }]}>
                  {archetypeMeta.title_bn}
                </Text>
                <Text style={styles.archetypePreviewMotto}>"{archetypeMeta.motto_bn}"</Text>
              </View>
            </View>

            {/* Input: Username */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ইউজারনেম / স্পেস কল-সাইন:</Text>
              <View style={styles.inputShell}>
                <User size={16} color={Colors.cyan} />
                <TextInput
                  style={styles.textInput}
                  value={username}
                  onChangeText={(val) => setUsername(val.toLowerCase().replace(/\s+/g, '_'))}
                  placeholder="যেমন: roket_pilot_10"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Input: Display Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>তোমার অফিসিয়াল নাম:</Text>
              <View style={styles.inputShell}>
                <Sparkles size={16} color={Colors.gold} />
                <TextInput
                  style={styles.textInput}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="যেমন: সামিউল হক"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>

            {/* Input: Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>গোপন পাসকোড / পাসওয়ার্ড:</Text>
              <View style={styles.inputShell}>
                <KeyRound size={16} color={Colors.coral} />
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="কমপক্ষে ৩ অক্ষরের পাসকোড"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showPassword}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {showPassword ? (
                    <EyeOff size={16} color={Colors.textMuted} />
                  ) : (
                    <Eye size={16} color={Colors.textMuted} />
                  )}
                </Pressable>
              </View>
            </View>

            <View style={styles.ctaWrapper}>
              <TactileButton
                title={isAuthLoading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি ও মিশন শুরু করো 🚀'}
                onPress={handleSignUp}
                variant="gold"
                size="large"
                disabled={isAuthLoading}
              />
            </View>
          </DoubleBezelCard>
        )}

        {/* ── MODE 2: LOGIN ──────────────────────────────────── */}
        {authMode === 'login' && (
          <DoubleBezelCard glow="gold" style={styles.authCard}>
            <View style={styles.formSectionHeader}>
              <ShieldCheck size={16} color={Colors.gold} />
              <Text style={styles.formSectionTitle}>পূর্ববর্তী অ্যাকাউন্টে লগইন</Text>
            </View>

            {/* Saved Cadets Quick Pick (Local Multi-Cadet Device Support) */}
            {savedUsers.length > 0 && (
              <View style={styles.quickPickSection}>
                <View style={styles.quickPickHeader}>
                  <Users size={13} color={Colors.cyan} />
                  <Text style={styles.quickPickTitle}>সংরক্ষিত ক্যাডেট প্রোফাইল (১-ট্যাপ):</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickPickScroll}>
                  {savedUsers.map((user) => (
                    <Pressable
                      key={user.id}
                      style={[
                        styles.quickPickChip,
                        username === user.username && styles.quickPickChipActive,
                      ]}
                      onPress={() => {
                        setUsername(user.username);
                        setDisplayName(user.displayName);
                        setSelectedArchetype(user.cadetArchetype);
                        setLocalError(null);
                      }}
                    >
                      <AstronautAvatar size={24} rank={user.rank} />
                      <View>
                        <Text style={styles.quickPickName}>{user.displayName}</Text>
                        <Text style={styles.quickPickUsername}>@{user.username}</Text>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Input: Username */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ইউজারনেম / কল-সাইন:</Text>
              <View style={styles.inputShell}>
                <User size={16} color={Colors.cyan} />
                <TextInput
                  style={styles.textInput}
                  value={username}
                  onChangeText={(val) => setUsername(val.toLowerCase())}
                  placeholder="ইউজারনেম লেখো"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Input: Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>পাসওয়ার্ড:</Text>
              <View style={styles.inputShell}>
                <KeyRound size={16} color={Colors.coral} />
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="পাসওয়ার্ড লেখো"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showPassword}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {showPassword ? (
                    <EyeOff size={16} color={Colors.textMuted} />
                  ) : (
                    <Eye size={16} color={Colors.textMuted} />
                  )}
                </Pressable>
              </View>
            </View>

            <View style={styles.ctaWrapper}>
              <TactileButton
                title={isAuthLoading ? 'লগইন হচ্ছে...' : 'কমান্ড ডেকে প্রবেশ করো ➔'}
                onPress={handleLogin}
                variant="primary"
                size="large"
                disabled={isAuthLoading}
              />
            </View>
          </DoubleBezelCard>
        )}

        {/* ── MODE 3: GUEST ──────────────────────────────────── */}
        {authMode === 'guest' && (
          <DoubleBezelCard glow="emerald" style={styles.authCard}>
            <View style={styles.formSectionHeader}>
              <Compass size={16} color={Colors.emerald} />
              <Text style={styles.formSectionTitle}>পাসওয়ার্ড ছাড়া অতিথি হিসেবে প্রবেশ</Text>
            </View>

            <View style={styles.guestNoticeBox}>
              <CheckCircle2 size={16} color={Colors.emerald} />
              <Text style={styles.guestNoticeText}>
                কোনো পাসওয়ার্ড ছাড়াই তুমি অবিলম্বে সব পাঠ, কুইজ এবং চন্দ্রাভিযান খেলতে পারবে। পরবর্তীতে যেকোনো সময় তোমার প্রোফাইল থেকে স্থায়ী অ্যাকাউন্ট তৈরি করে নিতে পারবে।
              </Text>
            </View>

            {/* Optional Nickname */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>তোমার ডাকনাম (ঐচ্ছিক):</Text>
              <View style={styles.inputShell}>
                <User size={16} color={Colors.emerald} />
                <TextInput
                  style={styles.textInput}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="যেমন: খুদে অভিযাত্রী"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.ctaWrapper}>
              <TactileButton
                title={isAuthLoading ? 'শুরু হচ্ছে...' : 'অতিথি হিসেবে অভিযান শুরু করো 🛸'}
                onPress={handleGuest}
                variant="emerald"
                size="large"
                disabled={isAuthLoading}
              />
            </View>
          </DoubleBezelCard>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 36,
    paddingBottom: 40,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 18,
  },
  mascotSlot: {
    marginBottom: 8,
  },
  appTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: Typography.weight.heavy,
    marginBottom: 6,
    textAlign: 'center',
  },
  appSubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },

  // 3-Way Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(14, 18, 60, 0.85)',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabBtnActive: {
    backgroundColor: Colors.cyan,
  },
  tabBtnText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: Typography.weight.bold,
  },
  tabBtnTextActive: {
    color: '#080D27',
    fontWeight: Typography.weight.heavy,
  },

  // Error Banner
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 71, 87, 0.16)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.coral,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  errorText: {
    flex: 1,
    color: Colors.coral,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semiBold,
  },

  // Auth Card
  authCard: {
    marginBottom: 16,
  },
  formSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  formSectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: Typography.weight.bold,
  },

  // Archetype Preview
  archetypePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 14,
  },
  archetypeBadgeBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  archetypePreviewInfo: {
    flex: 1,
  },
  archetypePreviewTitle: {
    fontSize: 14,
    fontWeight: Typography.weight.bold,
    marginBottom: 2,
  },
  archetypePreviewMotto: {
    color: Colors.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
  },

  // Input Fields
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: Typography.weight.semiBold,
    marginBottom: 6,
  },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 12, 38, 0.9)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },

  // Quick Pick
  quickPickSection: {
    marginBottom: 14,
  },
  quickPickHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  quickPickTitle: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: Typography.weight.semiBold,
  },
  quickPickScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  quickPickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginRight: 8,
  },
  quickPickChipActive: {
    borderColor: Colors.cyan,
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
  },
  quickPickName: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: Typography.weight.bold,
  },
  quickPickUsername: {
    color: Colors.textMuted,
    fontSize: 10,
  },

  // Guest Notice
  guestNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    padding: 12,
    marginBottom: 14,
  },
  guestNoticeText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  ctaWrapper: {
    marginTop: 10,
  },
});
