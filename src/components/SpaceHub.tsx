import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ChevronRight, Clock } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Radius, Space } from '../theme/layout';
import { StarField } from './StarField';
import { PlanetImage } from './PlanetImage';
import { SPACE_DESTINATIONS, DestinationId } from '../content/spaceDestinations';
import { getTranslation, AppLanguage } from '../i18n/translations';
import { tapHaptic } from '../utils/haptics';

interface SpaceHubProps {
  language: AppLanguage;
  onOpenDestination: (id: DestinationId) => void;
}

/**
 * SpaceHub — pick where to fly. The Moon is live; every planet is "coming soon".
 */
export const SpaceHub: React.FC<SpaceHubProps> = ({ language, onOpenDestination }) => {
  const t = getTranslation(language).spaceHub;
  const en = language === 'en';

  return (
    <View style={styles.root}>
      <StarField />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        <View style={styles.list}>
          {SPACE_DESTINATIONS.map((d) => {
            const name = en ? d.name_en : d.name_bn;
            const summary = en ? d.summary_en : d.summary_bn;
            const fact = en ? d.fact_en : d.fact_bn;
            const live = !d.comingSoon;

            const card = (
              <View style={[styles.card, live ? styles.cardLive : styles.cardSoon]}>
                <View style={styles.imageTile}>
                  <PlanetImage id={d.id} size={84} />
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.titleRow}>
                    <Text style={styles.name} numberOfLines={1}>
                      {name}
                    </Text>
                    {live ? (
                      <View style={styles.liveBadge}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText} numberOfLines={1}>{t.liveBadge}</Text>
                      </View>
                    ) : (
                      <View style={styles.soonBadge}>
                        <Clock size={11} color={Colors.textMuted} />
                        <Text style={styles.soonText} numberOfLines={1}>{t.comingSoon}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.fact}>{fact}</Text>
                  <Text style={styles.summary}>{summary}</Text>

                  {live && (
                    <View style={styles.ctaRow}>
                      <Text style={styles.ctaText}>{t.startMission}</Text>
                      <ChevronRight size={16} color={Colors.gold} />
                    </View>
                  )}
                </View>
              </View>
            );

            if (!live) {
              return (
                <View
                  key={d.id}
                  accessibilityLabel={`${name}, ${t.comingSoon}`}
                  accessibilityState={{ disabled: true }}
                >
                  {card}
                </View>
              );
            }

            return (
              <Pressable
                key={d.id}
                onPress={() => {
                  tapHaptic();
                  onOpenDestination(d.id);
                }}
                style={({ pressed }) => pressed && styles.pressed}
                accessibilityRole="button"
                accessibilityLabel={`${name}, ${t.startMission}`}
              >
                {card}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
    maxWidth: 620,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    color: Colors.text,
    fontSize: Typography.size.h1,
    lineHeight: Typography.lineHeight.h1,
    fontFamily: Typography.family.notoBold,
    marginTop: 4,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.bodySmall,
    lineHeight: Typography.lineHeight.bodySmall,
    fontFamily: Typography.family.notoRegular,
    marginBottom: Space.lg,
  },
  list: {
    gap: Space.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Space.md,
  },
  cardLive: {
    borderColor: Colors.gold,
    backgroundColor: Colors.surfaceElevated,
  },
  cardSoon: {
    opacity: 0.8,
  },
  imageTile: {
    width: 92,
    height: 92,
    borderRadius: Radius.sm + 4,
    backgroundColor: Colors.spaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
  },
  titleRow: {
    alignItems: 'flex-start',
    gap: Space.xs,
    marginBottom: Space.xs,
  },
  name: {
    flexShrink: 1,
    color: Colors.text,
    fontSize: Typography.size.h3,
    lineHeight: Typography.lineHeight.h3,
    fontFamily: Typography.family.notoBold,
  },
  liveBadge: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(94, 214, 192, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.emerald,
  },
  liveText: {
    flexShrink: 0,
    color: Colors.emerald,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoSemiBold,
  },
  soonBadge: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  soonText: {
    flexShrink: 0,
    color: Colors.textMuted,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoSemiBold,
  },
  fact: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoSemiBold,
    marginBottom: 2,
  },
  summary: {
    color: Colors.textSecondary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoRegular,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: Space.xs,
  },
  ctaText: {
    color: Colors.gold,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontFamily: Typography.family.notoBold,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
