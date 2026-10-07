import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ChevronRight, Clock, Rocket, BookOpen } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Radius, Space, Gutter } from '../theme/layout';
import { StarField } from './StarField';
import { PlanetImage } from './PlanetImage';
import { ScalePressable } from './ScalePressable';
import { SPACE_DESTINATIONS, DestinationId } from '../content/spaceDestinations';
import { getTranslation, AppLanguage } from '../i18n/translations';
import { tapHaptic } from '../utils/haptics';
import { useAppStore } from '../state/useAppStore';
import { Lock } from 'lucide-react-native';

interface SpaceHubProps {
  language: AppLanguage;
  onOpenDestination: (id: DestinationId) => void;
  onLaunchMoon?: () => void;
  onLaunchMission?: (id: DestinationId) => void;
}

/**
 * SpaceHub — pick where to fly or explore.
 * Moon landing simulation is live; all 8 worlds feature rich interactive Planetary Missions & Dossiers!
 */
export const SpaceHub: React.FC<SpaceHubProps> = ({
  language,
  onOpenDestination,
  onLaunchMoon,
  onLaunchMission,
}) => {
  const t = getTranslation(language).spaceHub;
  const en = language === 'en';
  const completedMissions = useAppStore((s) => s.completedMissions);
  const xp = useAppStore((s) => s.xp);

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
          {SPACE_DESTINATIONS.map((d, index) => {
            const name = en ? d.name_en : d.name_bn;
            const summary = en ? d.summary_en : d.summary_bn;
            const fact = en ? d.fact_en : d.fact_bn;
            const live = true; // All are live now

            // Determine if destination is unlocked
            // It's unlocked if it's the Moon (index 0) OR the immediately previous destination is completed
            let isUnlocked = true;
            if (index > 0) {
              const previousDestId = SPACE_DESTINATIONS[index - 1].id;
              const isPrevCompleted =
                completedMissions.includes(previousDestId) ||
                (previousDestId === 'moon' && (completedMissions.includes('moon') || xp >= 120));
              isUnlocked = isPrevCompleted;
            }

            return (
              <ScalePressable
                key={d.id}
                onPress={() => {
                  tapHaptic();
                  if (isUnlocked) {
                    onOpenDestination(d.id);
                  }
                }}
                style={[styles.card, isUnlocked ? styles.cardLive : styles.cardLocked]}
                accessibilityRole="button"
                accessibilityLabel={`${name}, ${isUnlocked ? 'Unlocked' : 'Locked'}`}
              >
                <View style={[styles.imageTile, !isUnlocked && styles.imageTileLocked]}>
                  <PlanetImage id={d.id} size={84} />
                  {!isUnlocked && (
                    <View style={styles.lockOverlay}>
                      <Lock size={32} color="rgba(255,255,255,0.8)" />
                    </View>
                  )}
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.name, !isUnlocked && styles.textLocked]} numberOfLines={1}>
                      {name}
                    </Text>
                  </View>

                  <Text style={[styles.fact, !isUnlocked && styles.textLocked]}>{fact}</Text>
                  <Text style={[styles.summary, !isUnlocked && styles.textLocked]} numberOfLines={2}>
                    {isUnlocked ? summary : (en ? `Complete ${SPACE_DESTINATIONS[index - 1].name_en} mission to unlock.` : `আগের মিশন (${SPACE_DESTINATIONS[index - 1].name_bn}) শেষ করে এটি আনলক করো।`)}
                  </Text>

                  {/* Actions Row */}
                  <View style={styles.ctaRow}>
                    <View style={styles.moonActionsRow}>
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          tapHaptic();
                          if (!isUnlocked) return;
                          
                          if (onLaunchMission) {
                            onLaunchMission(d.id);
                          } else if (d.id === 'moon' && onLaunchMoon) {
                            onLaunchMoon();
                          } else {
                            onOpenDestination(d.id);
                          }
                        }}
                        style={[styles.launchBtn, !isUnlocked && styles.launchBtnLocked]}
                        disabled={!isUnlocked}
                      >
                        {isUnlocked ? <Rocket size={13} color={Colors.textDark} /> : <Lock size={13} color={Colors.textSecondary} />}
                        <Text style={[styles.launchBtnText, !isUnlocked && styles.launchBtnTextLocked]}>
                          {isUnlocked ? (en ? 'Fly Mission' : 'অভিযান শুরু') : (en ? 'Locked' : 'লক করা')}
                        </Text>
                      </Pressable>

                    </View>
                  </View>
                </View>
              </ScalePressable>
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
    paddingHorizontal: Gutter,
    paddingTop: Space.lg,
    paddingBottom: Space.xxl + 24,
  },
  title: {
    fontSize: Typography.size.h2,
    fontFamily: Typography.family.heading,
    color: Colors.text,
    marginBottom: Space.xs,
  },
  subtitle: {
    fontSize: Typography.size.bodySmall,
    fontFamily: Typography.family.notoRegular,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Space.lg,
  },
  list: {
    gap: Space.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Space.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: Space.md,
  },
  cardLive: {
    borderColor: Colors.gold,
    backgroundColor: Colors.surface,
  },
  cardExplorable: {
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  imageTile: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceWarm,
    borderRadius: Radius.md,
  },
  cardBody: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  name: {
    fontSize: Typography.size.h3,
    fontFamily: Typography.family.heading,
    color: Colors.text,
    flex: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.gold,
  },
  liveText: {
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.headingSemi,
    color: Colors.gold,
  },
  dossierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  dossierBadgeText: {
    fontSize: Typography.size.micro,
    fontFamily: Typography.family.headingMedium,
    color: Colors.primary,
  },
  fact: {
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.headingMedium,
    color: Colors.gold,
    marginBottom: 2,
  },
  summary: {
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.notoRegular,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 2,
  },
  moonActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },
  launchBtnPlanet: {
    backgroundColor: Colors.primaryBg,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  launchBtnText: {
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.headingSemi,
    color: Colors.textDark,
  },
  launchBtnTextPlanet: {
    color: Colors.primaryDark,
  },
  dossierLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  dossierLinkText: {
    fontSize: Typography.size.caption,
    fontFamily: Typography.family.headingMedium,
    color: Colors.primary,
  },
  cardLocked: {
    borderColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    opacity: 0.6,
  },
  imageTileLocked: {
    opacity: 0.4,
  },
  lockOverlay: {
    ...(StyleSheet.absoluteFill as any),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: Radius.md,
  },
  textLocked: {
    color: Colors.textSecondary,
  },
  launchBtnLocked: {
    backgroundColor: Colors.surfaceWarm,
    opacity: 0.8,
  },
  launchBtnTextLocked: {
    color: Colors.textSecondary,
  },
});
