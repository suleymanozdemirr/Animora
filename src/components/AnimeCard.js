import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, statusConfig } from '../constants/colors';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../constants/theme';
import ProgressBar from './ProgressBar';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.lg * 2;

const AnimeCard = ({ anime, onPress, onFavoritePress }) => {
  const progress = anime.totalEpisodes > 0 
    ? (anime.currentEpisode / anime.totalEpisodes) * 100 
    : 0;
  
  const status = statusConfig[anime.status] || statusConfig.watching;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Background Gradient Overlay */}
      <View style={styles.card}>
        {/* Anime Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: anime.image }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
            <Ionicons name={status.icon} size={12} color={colors.textPrimary} />
            <Text style={styles.statusText}>{status.label}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Row */}
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {anime.title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {anime.titleJapanese}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onFavoritePress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={anime.isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={anime.isFavorite ? colors.accentPink : colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Genres */}
          <View style={styles.genreContainer}>
            {anime.genres.slice(0, 3).map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>İlerleme</Text>
              <Text style={styles.progressValue}>
                <Text style={styles.progressHighlight}>{anime.currentEpisode}</Text>
                /{anime.totalEpisodes} Bölüm
              </Text>
            </View>
            <View style={styles.seasonInfo}>
              <Ionicons name="layers-outline" size={14} color={colors.textMuted} />
              <Text style={styles.seasonText}>
                Sezon {anime.currentSeason}/{anime.totalSeasons}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <ProgressBar progress={progress} color={status.color} />

          {/* Bottom Row */}
          <View style={styles.bottomRow}>
            {anime.rating > 0 && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color={colors.starFilled} />
                <Text style={styles.ratingText}>{anime.rating.toFixed(1)}</Text>
              </View>
            )}
            {anime.notes && (
              <View style={styles.notesIndicator}>
                <Ionicons name="document-text-outline" size={14} color={colors.accent} />
                <Text style={styles.notesText}>Not var</Text>
              </View>
            )}
            {anime.lastWatched && (
              <Text style={styles.lastWatched}>
                Son: {anime.lastWatched}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  imageContainer: {
    width: 120,
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  statusText: {
    color: colors.textPrimary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semiBold,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  genreTag: {
    backgroundColor: colors.backgroundInput,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  genreText: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  progressValue: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  progressHighlight: {
    color: colors.accent,
    fontWeight: fontWeight.bold,
  },
  seasonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seasonText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: colors.starFilled,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
  },
  notesIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  notesText: {
    color: colors.accent,
    fontSize: fontSize.xs,
  },
  lastWatched: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginLeft: 'auto',
  },
});

export default AnimeCard;
