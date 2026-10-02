import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { StoryCard } from '../../src/components/StoryCard';
import { Lesson } from '../../src/content/schema';
import { getLessons } from '../../src/services/lessonService';
import { useAppStore } from '../../src/state/useAppStore';
import {
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  ChevronRight,
  BookOpen,
} from 'lucide-react-native';

export default function LessonsScreen() {
  const router = useRouter();
  const { rank, completedLessonIds } = useAppStore();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'Cadet' | 'Astronaut'>('all');

  useEffect(() => {
    getLessons().then((data) => setLessons(data));
  }, []);

  const filteredLessons = lessons.filter((lesson) => {
    if (activeFilter === 'all') return true;
    return lesson.level === activeFilter;
  });

  const isLevelLocked = (level: string) => {
    if (level === 'Astronaut' && rank === 'Cadet') {
      return true;
    }
    return false;
  };

  const renderLessonItem = ({ item, index }: { item: Lesson; index: number }) => {
    const isCompleted = completedLessonIds.includes(item.id);
    const locked = isLevelLocked(item.level);

    return (
      <Pressable
        onPress={() => {
          if (!locked) {
            router.push(`/lessons/${item.id}`);
          }
        }}
        style={styles.cardTouchWrapper}
      >
        <StoryCard
          accent={isCompleted ? 'emerald' : locked ? 'none' : 'primary'}
          style={locked ? styles.lockedCard : undefined}
        >
          {/* Card Top Row */}
          <View style={styles.cardTopRow}>
            <View style={styles.levelTagGroup}>
              <View
                style={[
                  styles.levelBadge,
                  item.level === 'Astronaut' ? styles.astronautTag : styles.cadetTag,
                ]}
              >
                <Text
                  style={[
                    styles.levelTagText,
                    { color: item.level === 'Astronaut' ? Colors.emerald : Colors.primaryLight },
                  ]}
                >
                  {item.level === 'Cadet' ? 'ক্যাডেট স্তর' : 'মহাকাশচারী স্তর'}
                </Text>
              </View>
              <Text style={styles.orderText}>পাঠ #{index + 1}</Text>
            </View>

            {isCompleted ? (
              <View style={styles.completedBadge}>
                <CheckCircle2 size={13} color={Colors.emerald} />
                <Text style={styles.completedText}>সম্পন্ন</Text>
              </View>
            ) : locked ? (
              <View style={styles.lockedBadge}>
                <Lock size={12} color={Colors.textMuted} />
                <Text style={styles.lockedText}>লকড</Text>
              </View>
            ) : (
              <View style={styles.xpBadge}>
                <Sparkles size={12} color={Colors.gold} />
                <Text style={styles.xpBadgeText}>+{item.xp_reward} XP</Text>
              </View>
            )}
          </View>

          {/* Lesson Title & Summary */}
          <Text style={[styles.lessonTitle, locked && styles.textLocked]}>{item.title_bn}</Text>
          <Text style={styles.lessonSummary} numberOfLines={2}>
            {item.summary_bn}
          </Text>

          {/* Card Footer */}
          <View style={styles.cardFooter}>
            <View style={styles.metaTimeGroup}>
              <Clock size={13} color={Colors.textMuted} />
              <Text style={styles.metaTimeText}>{item.read_time_minutes} মিনিট পাঠ</Text>
            </View>

            {!locked ? (
              <View style={styles.readActionGroup}>
                <Text style={styles.readActionText}>পড়া শুরু করো</Text>
                <ChevronRight size={15} color={Colors.primaryLight} />
              </View>
            ) : (
              <Text style={styles.lockHintText}>ক্যাডেট স্তর সম্পন্ন করে আনলক করো</Text>
            )}
          </View>
        </StoryCard>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Category Filter Pills */}
      <View style={styles.filterRow}>
        <Pressable
          style={[styles.pill, activeFilter === 'all' && styles.pillActive]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.pillText, activeFilter === 'all' && styles.pillTextActive]}>
            সকল পাঠ ({lessons.length})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.pill, activeFilter === 'Cadet' && styles.pillActive]}
          onPress={() => setActiveFilter('Cadet')}
        >
          <Text style={[styles.pillText, activeFilter === 'Cadet' && styles.pillTextActive]}>
            ক্যাডেট স্তর
          </Text>
        </Pressable>

        <Pressable
          style={[styles.pill, activeFilter === 'Astronaut' && styles.pillActive]}
          onPress={() => setActiveFilter('Astronaut')}
        >
          <Text style={[styles.pillText, activeFilter === 'Astronaut' && styles.pillTextActive]}>
            মহাকাশচারী স্তর
          </Text>
        </Pressable>
      </View>

      {/* Lesson Cards List */}
      <FlatList
        data={filteredLessons}
        keyExtractor={(item) => item.id}
        renderItem={renderLessonItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: Colors.surface,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  pillActive: {
    backgroundColor: 'rgba(107, 138, 255, 0.18)',
    borderColor: Colors.primaryLight,
  },
  pillText: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindSemiBold,
  },
  pillTextActive: {
    color: Colors.primaryLight,
    fontFamily: Typography.family.hindBold,
  },
  listContent: {
    padding: 18,
    gap: 14,
    paddingBottom: 48,
    maxWidth: 620,
    alignSelf: 'center',
    width: '100%',
  },
  cardTouchWrapper: {
    marginBottom: 2,
  },
  lockedCard: {
    opacity: 0.55,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelTagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cadetTag: {
    backgroundColor: 'rgba(107, 138, 255, 0.15)',
  },
  astronautTag: {
    backgroundColor: 'rgba(94, 214, 192, 0.15)',
  },
  levelTagText: {
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  orderText: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(94, 214, 192, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  completedText: {
    color: Colors.emerald,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  lockedText: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindSemiBold,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 200, 107, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  xpBadgeText: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.hindBold,
  },
  lessonTitle: {
    color: Colors.text,
    fontSize: Typography.size.h3,
    fontFamily: Typography.family.hindBold,
    marginBottom: 6,
  },
  textLocked: {
    color: Colors.textSecondary,
  },
  lessonSummary: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.notoRegular,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 12,
  },
  metaTimeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaTimeText: {
    color: Colors.textMuted,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
  },
  readActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readActionText: {
    color: Colors.primaryLight,
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.hindSemiBold,
  },
  lockHintText: {
    color: Colors.textMuted,
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.notoRegular,
  },
});
