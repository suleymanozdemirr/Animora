import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAnime } from '../context/AnimeContext';
import { ProgressBar } from '../components';
import { colors, statusConfig } from '../constants/colors';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../constants/theme';

const { width } = Dimensions.get('window');

const AnimeDetailScreen = ({ route, navigation }) => {
  const { animeId } = route.params;
  const {
    getAnimeById,
    toggleFavorite,
    updateProgress,
    updateNotes,
    updateStatus,
    updateRating,
    deleteAnime,
  } = useAnime();

  const anime = getAnimeById(animeId);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(anime?.notes || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [localEpisode, setLocalEpisode] = useState(anime?.currentEpisode || 0);
  const [localSeason, setLocalSeason] = useState(anime?.currentSeason || 1);
  const [localStatus, setLocalStatus] = useState(anime?.status || 'watching');
  const [localRating, setLocalRating] = useState(anime?.rating || 0);
  const [scrollY, setScrollY] = useState(0);

  // Sync local state when anime changes
  useEffect(() => {
    if (anime) {
      setLocalEpisode(anime.currentEpisode || 0);
      setLocalSeason(anime.currentSeason || 1);
      setLocalStatus(anime.status || 'watching');
      setLocalRating(anime.rating || 0);
      setNotesText(anime.notes || '');
      setHasChanges(false);
    }
  }, [anime?.id]);

  if (!anime) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Anime bulunamadı</Text>
      </SafeAreaView>
    );
  }

  const progress = anime.totalEpisodes > 0
    ? (localEpisode / anime.totalEpisodes) * 100
    : 0;
  
  const status = statusConfig[localStatus] || statusConfig.watching;

  // Calculate season based on episodes per season
  const calculateSeasonFromEpisode = (episode, totalEpisodes, totalSeasons) => {
    if (totalSeasons === 1) return 1;
    
    // Calculate episodes per season
    const episodesPerSeason = Math.ceil(totalEpisodes / totalSeasons);
    
    // Calculate which season this episode belongs to
    const calculatedSeason = Math.ceil(episode / episodesPerSeason) || 1;
    return Math.min(calculatedSeason, totalSeasons);
  };

  const handleEpisodeChange = (increment) => {
    const newEpisode = Math.max(0, Math.min(anime.totalEpisodes, localEpisode + increment));
    const newSeason = calculateSeasonFromEpisode(newEpisode, anime.totalEpisodes, anime.totalSeasons);
    
    setLocalEpisode(newEpisode);
    setLocalSeason(newSeason);
    setHasChanges(true);
  };

  const handleSeasonChange = (increment) => {
    const newSeason = Math.max(1, Math.min(anime.totalSeasons, localSeason + increment));
    setLocalSeason(newSeason);
    setHasChanges(true);
  };

  const handleSaveProgress = () => {
    updateProgress(anime.id, localEpisode, localSeason);
  };

  const handleSaveAll = () => {
    // Save all changes at once
    updateProgress(anime.id, localEpisode, localSeason);
    updateStatus(anime.id, localStatus);
    updateRating(anime.id, localRating);
    if (editingNotes) {
      updateNotes(anime.id, notesText);
      setEditingNotes(false);
    }
    setHasChanges(false);
  };

  const handleSaveNotes = () => {
    // Notes will be saved with handleSaveAll
    setEditingNotes(false);
  };

  const handleNotesChange = (text) => {
    setNotesText(text);
    setHasChanges(true);
  };

  const handleStatusChange = (newStatus) => {
    setLocalStatus(newStatus);
    setShowStatusPicker(false);
    setHasChanges(true);
  };


  const handleRatingChange = (rating) => {
    setLocalRating(rating);
    setHasChanges(true);
  };


  const handleDelete = () => {
    Alert.alert(
      'Anime Sil',
      `"${anime.title}" listenden silinsin mi?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            deleteAnime(anime.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const renderRatingStars = () => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleRatingChange(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= localRating ? 'star' : 'star-outline'}
            size={24}
            color={i <= localRating ? colors.starFilled : colors.starEmpty}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[
        styles.header,
        scrollY > 100 && styles.headerScrolled
      ]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[
            styles.backButton,
            scrollY > 100 && styles.headerButtonScrolled
          ]}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => toggleFavorite(anime.id)} 
            style={[
              styles.headerButton,
              scrollY > 100 && styles.headerButtonScrolled
            ]}
          >
            <Ionicons
              name={anime.isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={anime.isFavorite ? colors.accentPink : colors.textPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleDelete} 
            style={[
              styles.headerButton,
              scrollY > 100 && styles.headerButtonScrolled
            ]}
          >
            <Ionicons name="trash-outline" size={24} color={colors.dropped} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={hasChanges ? styles.scrollContentWithButton : styles.scrollContent}
        onScroll={(event) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image source={{ uri: anime.image }} style={styles.coverImage} />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
              <Ionicons name={status.icon} size={14} color={colors.textPrimary} />
              <Text style={styles.statusText}>{status.label}</Text>
            </View>
            <Text style={styles.title}>{anime.title}</Text>
            <Text style={styles.japaneseTitle}>{anime.titleJapanese}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{anime.studio}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{anime.year}</Text>
            </View>
          </View>
        </View>

        {/* Genres */}
        <View style={styles.genresSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(anime.genres || []).map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Status Selector */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Durum</Text>
          <View style={styles.statusGrid}>
            {Object.entries(statusConfig).map(([key, config]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.statusOptionGrid,
                  localStatus === key && styles.statusOptionActiveGrid,
                  localStatus === key && { borderColor: config.color },
                ]}
                onPress={() => handleStatusChange(key)}
              >
                <Ionicons
                  name={config.icon}
                  size={20}
                  color={localStatus === key ? config.color : colors.textMuted}
                />
                <Text
                  style={[
                    styles.statusOptionTextGrid,
                    localStatus === key && { color: config.color },
                  ]}
                >
                  {config.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>İlerleme</Text>
          
          {/* Episode Progress */}
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Bölüm</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => handleEpisodeChange(-1)}
              >
                <Ionicons name="remove" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.counterValue}>
                {localEpisode} / {anime.totalEpisodes}
              </Text>
              <TouchableOpacity
                style={[styles.counterButton, styles.counterButtonPrimary]}
                onPress={() => handleEpisodeChange(1)}
              >
                <Ionicons name="add" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <ProgressBar progress={progress} color={status.color} height={8} />

          {/* Season Progress */}
          <View style={[styles.progressRow, { marginTop: spacing.lg }]}>
            <Text style={styles.progressLabel}>Sezon</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => handleSeasonChange(-1)}
              >
                <Ionicons name="remove" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.counterValue}>
                {localSeason} / {anime.totalSeasons}
              </Text>
              <TouchableOpacity
                style={[styles.counterButton, styles.counterButtonPrimary]}
                onPress={() => handleSeasonChange(1)}
              >
                <Ionicons name="add" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>


        {/* Rating */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Puanla</Text>
            <Text style={styles.ratingValue}>
              {localRating > 0 ? localRating.toFixed(1) : '-'} / 10
            </Text>
          </View>
          <View style={styles.starsContainer}>
            {renderRatingStars()}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Notlarım</Text>
            <TouchableOpacity onPress={() => setEditingNotes(!editingNotes)}>
              <Ionicons
                name={editingNotes ? 'close' : 'create-outline'}
                size={22}
                color={colors.accent}
              />
            </TouchableOpacity>
          </View>
          
          {editingNotes ? (
            <TextInput
              style={styles.notesInput}
              value={notesText}
              onChangeText={handleNotesChange}
              placeholder="Anime hakkında notlarınız..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          ) : (
            <Text style={styles.notesText}>
              {anime.notes || 'Henüz not eklenmedi. Düzenle butonuna tıklayarak not ekleyebilirsin.'}
            </Text>
          )}
        </View>

        {/* Synopsis */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Özet</Text>
          <Text style={styles.synopsisText}>{anime.synopsis}</Text>
        </View>

        {/* Info */}
        <View style={[styles.card, { marginBottom: spacing.xxl }]}>
          <Text style={styles.cardTitle}>Bilgiler</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Stüdyo</Text>
            <Text style={styles.infoValue}>{anime.studio}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Yıl</Text>
            <Text style={styles.infoValue}>{anime.year}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Toplam Bölüm</Text>
            <Text style={styles.infoValue}>{anime.totalEpisodes}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Toplam Sezon</Text>
            <Text style={styles.infoValue}>{anime.totalSeasons}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Eklenme Tarihi</Text>
            <Text style={styles.infoValue}>{anime.addedDate}</Text>
          </View>
          {anime.lastWatched && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Son İzlenme</Text>
              <Text style={styles.infoValue}>{anime.lastWatched}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Save Button - Fixed at bottom */}
      {hasChanges && (
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity style={styles.saveButtonFixed} onPress={handleSaveAll}>
            <Ionicons name="checkmark-circle" size={24} color={colors.textPrimary} />
            <Text style={styles.saveButtonTextFixed}>Değişiklikleri Kaydet</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerScrolled: {
    backgroundColor: colors.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    ...shadows.small,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonScrolled: {
    backgroundColor: colors.backgroundInput,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    height: 350,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  heroContent: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 6,
    marginBottom: spacing.sm,
  },
  statusText: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  japaneseTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  metaText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  metaDot: {
    color: colors.textMuted,
    marginHorizontal: spacing.sm,
  },
  genresSection: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  genreTag: {
    backgroundColor: colors.backgroundCard,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  genreText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundInput,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonPrimary: {
    backgroundColor: colors.primary,
  },
  counterValue: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    minWidth: 80,
    textAlign: 'center',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusOptionGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundCard,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statusOptionActiveGrid: {
    backgroundColor: colors.backgroundInput,
  },
  statusOptionTextGrid: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  ratingValue: {
    color: colors.starFilled,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  starsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  starButton: {
    padding: spacing.xs,
  },
  notesInput: {
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    ...shadows.large,
  },
  saveButtonFixed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.medium,
  },
  saveButtonTextFixed: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  notesText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  synopsisText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
  infoValue: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  errorText: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  scrollContentWithButton: {
    paddingBottom: 100,
  },
});

export default AnimeDetailScreen;
