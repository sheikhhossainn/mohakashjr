import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { AstronautAvatar } from '../src/components/AstronautAvatar';
import { AnimatedMascot } from '../src/components/AnimatedMascot';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { ScalePressable } from '../src/components/ScalePressable';
import { MessageIn } from '../src/components/MessageIn';
import { useAppStore } from '../src/state/useAppStore';
import { findOfflineAnswer, getAllOfflineQuestions } from '../src/services/offlineTutorService';
import { AI_TUTOR_CONFIG } from '../src/content/aiTutorPrompt';
import {
  Send,
  Sparkles,
  Zap,
  HelpCircle,
  RotateCcw,
} from 'lucide-react-native';

const TUTOR_ENDPOINT = 'https://mohakashjr-ai-proxy.workers.dev/api/tutor';

/** Quick reachability probe: any response at all means the phone is online. */
async function hasInternet(): Promise<boolean> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    await fetch('https://www.gstatic.com/generate_204', { method: 'HEAD', signal: ctrl.signal });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  suggestedReplies?: string[];
}

export default function AITutorChatScreen() {
  const insets = useSafeAreaInsets();
  const { displayName, rank, cadetArchetype } = useAppStore();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'tutor',
      text: AI_TUTOR_CONFIG.welcome_message_bn,
      timestamp: 'এখন',
      suggestedReplies: [
        'চাঁদে কি সত্যিই পানি আছে?',
        'মহাকাশে নভোচারীরা কীভাবে বাথরুমে যান?',
        'জেমস ওয়েব টেলিস্কোপের বিশেষত্ব কী?',
      ],
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // A fresh random handful of the 100+ built-in questions each time the chat is opened or cleared
  const [shuffleKey, setShuffleKey] = useState(0);
  const presetQuestions = useMemo(() => {
    const pool = getAllOfflineQuestions()
      .filter((q) => q.category !== 'about_rover')
      .map((q) => q.question_bn);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 12);
  }, [shuffleKey]);

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
    const stamp = () => new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: query, timestamp: stamp() },
    ]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    const reply = (text: string, suggestedReplies?: string[]) => {
      setMessages((prev) => [
        ...prev,
        { id: `tutor-${Date.now()}`, sender: 'tutor', text, timestamp: stamp(), suggestedReplies },
      ]);
      setIsTyping(false);
    };

    // 1. Saved answers first: instant and works without internet
    const match = findOfflineAnswer(query);
    if (match.item) {
      setTimeout(() => reply(match.answer_bn, match.suggestedQuestions_bn), 450);
      return;
    }

    // 2. Not saved: check the connection, then ask the student to use the internet
    const online = await hasInternet();
    if (!online) {
      reply(
        'এই প্রশ্নের উত্তর আমার সংরক্ষিত তালিকায় নেই। 📡\nউত্তর পেতে মোবাইলের ইন্টারনেট বা ওয়াই-ফাই চালু করে আবার জিজ্ঞেস করো। এর মধ্যে নিচের প্রশ্নগুলো ইন্টারনেট ছাড়াই জানতে পারো।',
        match.suggestedQuestions_bn
      );
      return;
    }

    try {
      const response = await fetch(TUTOR_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          system_prompt: AI_TUTOR_CONFIG.system_prompt,
          user_context: { name: displayName, rank, archetype: cadetArchetype },
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const text = data.reply || data.answer_bn;
        if (text) {
          reply(text, data.quick_replies || match.suggestedQuestions_bn);
          return;
        }
      }
    } catch {
      // fall through to the gentle message below
    }
    reply(
      'ইন্টারনেট আছে, কিন্তু এই প্রশ্নের উত্তর এখন আনতে পারলাম না। 🌐\nএকটু পরে আবার চেষ্টা করো, অথবা ইন্টারনেটে খুঁজে দেখো বা শিক্ষককে জিজ্ঞেস করো।',
      [query, ...match.suggestedQuestions_bn.slice(0, 2)]
    );
  };

  const handleClearChat = () => {
    setShuffleKey((k) => k + 1);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'tutor',
        text: AI_TUTOR_CONFIG.welcome_message_bn,
        timestamp: 'এখন',
          suggestedReplies: AI_TUTOR_CONFIG.suggested_queries_bn.slice(0, 3),
      },
    ]);
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === 'user';

    return (
      <MessageIn style={[styles.messageRow, isUser ? styles.userRow : styles.tutorRow]}>
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
                <ScalePressable
                  key={idx}
                  style={styles.replyChip}
                  onPress={() => handleSendMessage(reply)}
                >
                  <HelpCircle size={12} color={Colors.cyan} />
                  <Text style={styles.replyChipText}>{reply}</Text>
                </ScalePressable>
              ))}
            </View>
          )}
        </View>

        {isUser && (
          <View style={styles.userAvatarBox}>
            <AstronautAvatar size={34} rank={rank} />
          </View>
        )}
      </MessageIn>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ScreenHeader
        title="ক্যাপ্টেন রোভার"
        subtitle="মহাকাশ মেন্টর ও বিজ্ঞান শিক্ষক"
        right={
          <ScalePressable
            style={styles.clearBtn}
            onPress={handleClearChat}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="নতুন করে শুরু করো"
          >
            <RotateCcw size={18} color={Colors.textSecondary} />
          </ScalePressable>
        }
      />

      {/* ── Suggested Questions Carousel ──────────────────────────── */}
      <View style={styles.presetTopicsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetTopicsScroll}>
          {presetQuestions.map((q, idx) => (
            <ScalePressable
              key={idx}
              style={styles.presetChip}
              onPress={() => handleSendMessage(q)}
            >
              <Zap size={11} color={Colors.gold} fill={Colors.gold} />
              <Text style={styles.presetChipText} numberOfLines={2}>{q}</Text>
            </ScalePressable>
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
      <View style={[styles.inputDeckContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.inputOuterBox}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="মহাকাশ নিয়ে যেকোনো কিছু বাংলায় জিজ্ঞেস করো..."
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={300}
          />
          <ScalePressable
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim()}
            accessibilityRole="button"
            accessibilityLabel="পাঠাও"
            scale={0.92}
          >
            <Send size={18} color="#FFFFFF" />
          </ScalePressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  clearBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetTopicsContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surfaceWarm,
  },
  presetTopicsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetChipText: {
    flexShrink: 1,
    maxWidth: 230,
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoRegular,
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
    flexShrink: 1,
    maxWidth: '86%',
    gap: 8,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
    borderTopRightRadius: 4,
  },
  tutorBubble: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderTopLeftRadius: 4,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
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
    color: Colors.primaryLight,
    fontSize: Typography.size.micro,
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
    fontFamily: Typography.family.hindSemiBold,
  },
  timestampText: {
    color: Colors.textMuted,
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
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
    maxWidth: '100%',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  replyChipText: {
    flexShrink: 1,
    color: Colors.primary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.headingSemi,
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
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  typingText: {
    color: Colors.primary,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.medium,
  },
  inputDeckContainer: {
    padding: 12,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputOuterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    gap: 8,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    color: Colors.text,
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.notoRegular,
    maxHeight: 96,
    paddingVertical: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.borderMedium,
  },
});
