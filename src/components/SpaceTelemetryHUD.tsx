import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Sparkles, ShieldCheck, Heart, Star } from 'lucide-react-native';
import { useAppStore, RANK_THRESHOLDS } from '../state/useAppStore';
import { getTranslation } from '../i18n/translations';

export const SpaceTelemetryHUD: React.FC = () => {
  const { rank, xp, language } = useAppStore();
  const t = getTranslation(language);

  const rankLabel = language === 'en' 
    ? (RANK_THRESHOLDS[rank]?.label_en || rank) 
    : (RANK_THRESHOLDS[rank]?.label_bn || rank);

  return (
    <View style={styles.container}>
      <View style={styles.badgeItem}>
        <View style={styles.liveDot} />
        <Text style={styles.badgeText}>{t.common.missionActive}</Text>
      </View>

      <View style={styles.badgeItem}>
        <Heart size={12} color={Colors.coral} fill={Colors.coral} />
        <Text style={styles.badgeValue}>{t.common.lifeSupport}</Text>
      </View>

      <View style={styles.badgeItem}>
        <Star size={12} color={Colors.gold} fill={Colors.gold} />
        <Text style={styles.badgeRank}>{rankLabel} • {xp} XP</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(22, 29, 76, 0.75)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.emerald,
  },
  badgeText: {
    color: Colors.emerald,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  badgeValue: {
    color: Colors.textSecondary,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.semiBold,
  },
  badgeRank: {
    color: Colors.gold,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
});
