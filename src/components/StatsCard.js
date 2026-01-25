import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../constants/theme';

const StatsCard = ({ stats }) => {
  const statItems = [
    { icon: 'play-circle', label: 'İzleniyor', value: stats.watching, color: colors.watching },
    { icon: 'checkmark-circle', label: 'Tamamlandı', value: stats.completed, color: colors.completed },
    { icon: 'time', label: 'İzlenecek', value: stats.planToWatch, color: colors.planToWatch },
    { icon: 'heart', label: 'Favori', value: stats.favorites, color: colors.accentPink },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>İstatistikler</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalText}>{stats.total} Anime</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {statItems.map((item, index) => (
          <View key={index} style={styles.statItem}>
            <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Total Episodes Watched */}
      <View style={styles.episodesContainer}>
        <Ionicons name="film-outline" size={18} color={colors.accent} />
        <Text style={styles.episodesText}>
          <Text style={styles.episodesHighlight}>{stats.totalEpisodesWatched}</Text> bölüm izledin
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    ...shadows.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  totalBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  totalText: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  episodesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    gap: spacing.sm,
  },
  episodesText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  episodesHighlight: {
    color: colors.accent,
    fontWeight: fontWeight.bold,
  },
});

export default StatsCard;
