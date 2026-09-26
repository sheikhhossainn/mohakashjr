import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { DoubleBezelCard } from '../src/components/DoubleBezelCard';
import { TactileButton } from '../src/components/TactileButton';
import { AstronautAvatar } from '../src/components/AstronautAvatar';
import { AnimatedMascot } from '../src/components/AnimatedMascot';
import { useAppStore } from '../src/state/useAppStore';
import { findOfflineAnswer } from '../src/services/offlineTutorService';
import { AI_TUTOR_CONFIG } from '../src/content/aiTutorPrompt';
import {
  Send,
  Wifi,
  WifiOff,
  Sparkles,
  ArrowLeft,
  Bot,
  User,
  Zap,
  HelpCircle,
  RotateCcw,
} from 'lucide-react-native';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  source: 'online' | 'offline';
  suggestedReplies?: string[];
}

export default function AITutorChatScreen() {
  const router = useRouter();
  const { displayName, rank, cadetArchetype } = useAppStore();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'tutor',
      text: AI_TUTOR_CONFIG.welcome_message_bn,
      timestamp: 'এখন',
      source: 'offline',
      suggestedReplies: [
        'চাঁদে কি সত্যিই পানি আছে?',
        'মহাকাশে নভোচারীরা কীভাবে বাথরুমে যান?',
        'জেমস ওয়েব টেলিস্কোপের বিশেষত্ব কী?',
      ],
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnlineMode, setIsOnlineMode] = useState(false); // Default to offline-first for reliability

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      source: isOnlineMode ? 'online' : 'offline',
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    if (isOnlineMode) {
      // ── Online Mode Handler ──────────────────────────────────────────────
      try {
        // Attempt to call Cloudflare Worker proxy (Mahi's serverless endpoint)
        const response = await fetch('https://mohakashjr-ai-proxy.workers.dev/api/tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: query,
            system_prompt: AI_TUTOR_CONFIG.system_prompt,
            user_context: {
              name: displayName,
              rank,
              archetype: cadetArchetype,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const tutorMsg: ChatMessage = {
            id: `tutor-${Date.now()}`,
            sender: 'tutor',
            text: data.reply || data.answer_bn,
            timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
            source: 'online',
            suggestedReplies: data.quick_replies || [
              'রকেট কীভাবে ওড়ে?',
              'মহাকাশে কীভাবে ঘুমায়?',
            ],
          };
          setMessages((prev) => [...prev, tutorMsg]);
          setIsTyping(false);
          return;
        }
      } catch (err) {
        // Smoothly fall through to offline matcher on network timeout / airplane mode
      }
    }

    // ── Offline Mode Fallback Engine (Humaira's Keyword Matcher) ───────────
    setTimeout(() => {
      const match = findOfflineAnswer(query);
      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: match.answer_bn,
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
        source: 'offline',
        suggestedReplies: match.suggestedQuestions_bn,
      };

      setMessages((prev) => [...prev, tutorMsg]);
      setIsTyping(false);
    }, 450); // Natural 450ms simulated computing latency
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'tutor',
        text: AI_TUTOR_CONFIG.welcome_message_bn,
        timestamp: 'এখন',
        source: 'offline',
        suggestedReplies: AI_TUTOR_CONFIG.suggested_queries_bn.slice(0, 3),
      },
    ]);
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === 'user';

    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.tutorRow]}>
        {!isUser && (
          <View style={styles.tutorAvatarBox}>
            <AnimatedMascot size={38} mood="happy" />
          </View>
        )}

        <View style={styles.messageContentCol}>
          <View
            style={[
              styles.messageBubble,
              isUser ? styles.userBubble : styles.tutorBubble,
            ]}
          >
            {/* Tutor Message Header Tag */}
            {!isUser && (
              <View style={styles.tutorTagRow}>
                <View style={styles.tutorNameTag}>
                  <Sparkles size={11} color={Colors.cyan} />
                  <Text style={styles.tutorNameText}>ক্যাপ্টেন রোভার</Text>
                </View>
                <View
                  style={[
                    styles.modeBadge,
                    item.source === 'online' ? styles.onlineBadge : styles.offlineBadge,
                  ]}
                >
                  <Text style={styles.modeBadgeText}>
                    {item.source === 'online' ? 'অনলাইন' : 'অফলাইন ক্যাশ'}
                  </Text>
                </View>
              </View>
            )}

            <Text style={[styles.messageText, isUser && styles.userMessageText]}>
              {item.text}
            </Text>

            <Text style={[styles.timestampText, isUser && styles.userTimestamp]}>
              {item.timestamp}
            </Text>
          </View>

          {/* Suggested Quick Replies below Tutor message */}
          {!isUser && item.suggestedReplies && item.suggestedReplies.length > 0 && (
            <View style={styles.quickRepliesList}>
              {item.suggestedReplies.map((reply, idx) => (
                <Pressable
                  key={idx}
                  style={({ pressed }) => [
                    styles.replyChip,
                    pressed && styles.replyChipPressed,
                  ]}
                  onPress={() => handleSendMessage(reply)}
                >
                  <HelpCircle size={12} color={Colors.cyan} />
                  <Text style={styles.replyChipText}>{reply}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {isUser && (
          <View style={styles.userAvatarBox}>
            <AstronautAvatar size={34} rank={rank} />
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* ── Chat Header & Mode Toggle ────────────────────────────── */}
      <View style={styles.headerBar}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={20} color={Colors.text} />
        </Pressable>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>ক্যাপ্টেন রোভার এআই 🛰️</Text>
          <Text style={styles.headerSubtitle}>মহাকাশ মেন্টর ও বিজ্ঞান শিক্ষক</Text>
        </View>

        {/* Online / Offline Mode Toggle Pill */}
        <Pressable
          style={[
            styles.networkToggle,
            isOnlineMode ? styles.networkOnline : styles.networkOffline,
          ]}
          onPress={() => setIsOnlineMode(!isOnlineMode)}
        >
          {isOnlineMode ? (
            <>
              <Wifi size={13} color={Colors.emerald} />
              <Text style={styles.networkToggleTextOnline}>অনলাইন</Text>
            </>
          ) : (
            <>
              <WifiOff size={13} color={Colors.gold} />
              <Text style={styles.networkToggleTextOffline}>অফলাইন</Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={styles.clearBtn}
          onPress={handleClearChat}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <RotateCcw size={16} color={Colors.textMuted} />
        </Pressable>
      </View>

      {/* ── Suggested Questions Carousel ──────────────────────────── */}
      <View style={styles.presetTopicsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetTopicsScroll}>
          {AI_TUTOR_CONFIG.suggested_queries_bn.map((q, idx) => (
            <Pressable
              key={idx}
              style={({ pressed }) => [
                styles.presetChip,
                pressed && styles.presetChipPressed,
              ]}
              onPress={() => handleSendMessage(q)}
            >
              <Zap size={11} color={Colors.gold} fill={Colors.gold} />
              <Text style={styles.presetChipText}>{q}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* ── Message Stream ────────────────────────────────────────── */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isTyping ? (
            <View style={styles.typingContainer}>
              <AnimatedMascot size={32} mood="thinking" />
              <View style={styles.typingBubble}>
                <ActivityIndicator size="small" color={Colors.cyan} />
                <Text style={styles.typingText}>ক্যাপ্টেন রোভার উত্তর খুঁজছেন...</Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* ── Sticky Bottom Input Deck ─────────────────────────────── */}
      <View style={styles.inputDeckContainer}>
        <View style={styles.inputOuterBox}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="মহাকাশ নিয়ে যেকোনো কিছু বাংলায় জিজ্ঞেস করো..."
            placeholderTextColor="rgba(255, 255, 255, 0.45)"
            multiline
            maxLength={300}
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendBtn,
              !inputText.trim() && styles.sendBtnDisabled,
              pressed && styles.sendBtnPressed,
            ]}
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim()}
          >
            <Send size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.void,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#0E1236',
    gap: 10,
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
  },
  headerSubtitle: {
    color: Colors.cyan,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.medium,
  },
  networkToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
    borderWidth: 1,
  },
  networkOnline: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    borderColor: Colors.emerald,
  },
  networkOffline: {
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    borderColor: Colors.gold,
  },
  networkToggleTextOnline: {
    color: Colors.emerald,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  networkToggleTextOffline: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  clearBtn: {
    padding: 6,
    borderRadius: 8,
  },
  presetTopicsContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(14, 18, 54, 0.5)',
  },
  presetTopicsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  presetChipPressed: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderColor: Colors.cyan,
  },
  presetChipText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.medium,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 16,
  },
  messageRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  tutorRow: {
    justifyContent: 'flex-start',
  },
  tutorAvatarBox: {
    marginTop: 4,
  },
  userAvatarBox: {
    marginTop: 4,
  },
  messageContentCol: {
    maxWidth: '82%',
    gap: 8,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  userBubble: {
    backgroundColor: '#0052CC',
    borderColor: Colors.cyan,
    borderTopRightRadius: 4,
  },
  tutorBubble: {
    backgroundColor: '#12173E',
    borderColor: 'rgba(0, 240, 255, 0.35)',
    borderTopLeftRadius: 4,
  },
  tutorTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tutorNameTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tutorNameText: {
    color: Colors.cyan,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  modeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  onlineBadge: {
    backgroundColor: 'rgba(0, 230, 118, 0.2)',
  },
  offlineBadge: {
    backgroundColor: 'rgba(255, 184, 0, 0.2)',
  },
  modeBadgeText: {
    color: Colors.textSecondary,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
  },
  messageText: {
    color: Colors.text,
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
    fontFamily: Typography.family.notoRegular,
  },
  userMessageText: {
    color: '#FFFFFF',
    fontWeight: Typography.weight.medium,
  },
  timestampText: {
    color: Colors.textMuted,
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  quickRepliesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  replyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  replyChipPressed: {
    backgroundColor: 'rgba(0, 240, 255, 0.2)',
  },
  replyChipText: {
    color: Colors.cyan,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12173E',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
    gap: 8,
  },
  typingText: {
    color: Colors.cyan,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.medium,
  },
  inputDeckContainer: {
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: '#0E1236',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  inputOuterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161C48',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    gap: 8,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: Typography.size.body,
    maxHeight: 90,
    paddingVertical: 6,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendBtnPressed: {
    transform: [{ scale: 0.94 }],
  },
});
