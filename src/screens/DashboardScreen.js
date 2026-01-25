import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAnime } from '../context/AnimeContext';
import {
  AnimeCard,
  SearchBar,
  FilterTabs,
  StatsCard,
  EmptyState,
} from '../components';
import { colors } from '../constants/colors';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../constants/theme';

const DashboardScreen = ({ navigation }) => {
  const {
    stats,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    toggleFavorite,
    getFilteredAnimes,
  } = useAnime();

  const filteredAnimes = getFilteredAnimes();

  const handleAnimePress = useCallback((anime) => {
    navigation.navigate('AnimeDetail', { animeId: anime.id });
  }, [navigation]);

  const handleAddPress = useCallback(() => {
    navigation.navigate('AddAnime');
  }, [navigation]);

  const handleMenuPress = useCallback(() => {
    // Hamburger menu - şimdilik boş
  }, []);

  const handleMenu2Press = useCallback(() => {
    // İkinci menü - şimdilik boş
  }, []);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* App Header */}
      <View style={styles.appHeader}>
        <View>
          <Text style={styles.greeting}>Hoş Geldin! 👋</Text>
          <Text style={styles.appTitle}>Animora</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.menuButton} onPress={handleMenu2Press}>
            <Ionicons name="ellipsis-horizontal" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
            <Ionicons name="menu" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Card */}
      <View style={styles.statsSection}>
        <StatsCard stats={stats} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Anime ara..."
        />
      </View>

      {/* Filter Tabs */}
      <FilterTabs
        activeFilter={filterStatus}
        onFilterChange={setFilterStatus}
        counts={stats}
      />

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          {filterStatus === 'all' ? 'Tüm Animeler' : 'Sonuçlar'}
        </Text>
        <Text style={styles.resultsCount}>
          {filteredAnimes.length} anime
        </Text>
      </View>
    </View>
  );

  const renderAnimeItem = useCallback(({ item }) => (
    <View style={styles.cardContainer}>
      <AnimeCard
        anime={item}
        onPress={() => handleAnimePress(item)}
        onFavoritePress={() => toggleFavorite(item.id)}
      />
    </View>
  ), [handleAnimePress, toggleFavorite]);

  const renderEmpty = () => (
    <EmptyState
      icon={searchQuery ? 'search-outline' : 'film-outline'}
      title={searchQuery ? 'Sonuç bulunamadı' : 'Anime listesi boş'}
      subtitle={searchQuery ? 'Farklı bir arama deneyin' : 'Yeni anime ekleyerek başlayın'}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <FlatList
        data={filteredAnimes}
        renderItem={renderAnimeItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddPress}>
        <Ionicons name="add" size={32} color={colors.textPrimary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingTop: spacing.xl,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  appTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.extraBold,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  statsSection: {
    marginBottom: spacing.lg,
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  resultsTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  resultsCount: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  listContent: {
    paddingBottom: 100,
  },
  cardContainer: {
    paddingHorizontal: spacing.lg,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
});

export default DashboardScreen;
