import React, { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAnime } from "../context/AnimeContext"
import * as AnimeAPI from "../services/animeApi"
import { colors, statusConfig } from "../constants/colors"
import { spacing, borderRadius, fontSize, fontWeight } from "../constants/theme"

const DEFAULT_SUBTYPE = "bypopularity"
const SUBTYPE_OPTIONS = [
  { key: "bypopularity", label: "Popüler" },
  { key: "airing", label: "Yayında" },
  { key: "upcoming", label: "Yaklaşan" },
  { key: "tv", label: "TV" },
  { key: "movie", label: "Film" },
  { key: "byfavorites", label: "Favoriler" },
]

const AddAnimeScreen = ({ navigation }) => {
  const { addAnime } = useAnime()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [topAnime, setTopAnime] = useState([])
  const [topSubtype, setTopSubtype] = useState(DEFAULT_SUBTYPE)
  const [topPage, setTopPage] = useState(1)
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingTop, setIsLoadingTop] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedAnime, setSelectedAnime] = useState(null)
  const [currentEpisode, setCurrentEpisode] = useState(1)
  const [currentSeason, setCurrentSeason] = useState(1)
  const [status, setStatus] = useState("planToWatch")
  const [isAdding, setIsAdding] = useState(false)

  const loadTopAnime = useCallback(
    async (page = 1, subtype = topSubtype) => {
      setIsLoadingTop(true)
      try {
        const data = await AnimeAPI.getTopAnime(page, subtype, 25)
        setTopAnime(data || [])
        setTopPage(page)
      } catch (error) {
        Alert.alert("Hata", "Liste yüklenemedi. Lütfen tekrar deneyin.")
        setTopAnime([])
      } finally {
        setIsLoadingTop(false)
      }
    },
    [topSubtype]
  )

  useEffect(() => {
    if (!searchQuery.trim()) loadTopAnime(1, topSubtype)
  }, [searchQuery, topSubtype])

  const onSubtypeChange = (key) => setTopSubtype(key)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    try {
      const data = await AnimeAPI.searchAnime(searchQuery.trim(), 20)
      setSearchResults(data)
    } catch (error) {
      Alert.alert("Hata", "Arama yapılamadı. Lütfen tekrar deneyin.")
    } finally {
      setIsSearching(false)
    }
  }

  const openAddModal = (animeItem) => {
    const converted = AnimeAPI.convertJikanToAppFormat(animeItem)
    const totalEps = converted.totalEpisodes || 12
    setSelectedAnime(converted)
    setCurrentEpisode(0)
    setCurrentSeason(1)
    setStatus("planToWatch")
    setShowModal(true)
  }

  const totalEpisodes = selectedAnime?.totalEpisodes || 12
  const totalSeasons = Math.max(1, Math.ceil(totalEpisodes / 12))
  const seasonOptions = Array.from({ length: totalSeasons }, (_, i) => i + 1)
  const episodeOptions = Array.from({ length: totalEpisodes + 1 }, (_, i) => i)

  const handleAddToList = () => {
    if (!selectedAnime) return
    setIsAdding(true)
    try {
      const totalEps = selectedAnime.totalEpisodes || 12
      const totalSeasonsCalc = Math.max(1, Math.ceil(totalEps / 12))
      const animeToAdd = {
        ...selectedAnime,
        totalSeasons: totalSeasonsCalc,
        currentEpisode: parseInt(currentEpisode) || 0,
        currentSeason: Math.min(currentSeason, totalSeasonsCalc),
        status,
      }
      addAnime(animeToAdd)
      setShowModal(false)
      setSelectedAnime(null)
      Alert.alert("Başarılı", `"${selectedAnime.title}" listenize eklendi!`, [
        { text: "Tamam", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      Alert.alert("Hata", "Anime eklenirken bir hata oluştu.")
    } finally {
      setIsAdding(false)
    }
  }

  const displayList = searchQuery.trim() ? searchResults : topAnime
  const hasResults = displayList.length > 0

  const renderAnimeItem = ({ item }) => {
    const converted = AnimeAPI.convertJikanToAppFormat(item)
    const totalEps = item.totalEpisodes ?? "?"
    return (
      <TouchableOpacity
        style={styles.animeItem}
        onPress={() => openAddModal(item)}
        activeOpacity={0.7}
      >
        {converted.image ? (
          <Image source={{ uri: converted.image }} style={styles.animeImage} />
        ) : (
          <View style={[styles.animeImage, styles.placeholderImage]}>
            <Ionicons name="film-outline" size={40} color={colors.textMuted} />
          </View>
        )}
        <View style={styles.animeInfo}>
          <Text style={styles.animeTitle} numberOfLines={2}>
            {converted.title}
          </Text>
          {converted.genres?.length > 0 && (
            <Text style={styles.animeGenres} numberOfLines={1}>
              {converted.genres.slice(0, 3).join(", ")}
            </Text>
          )}
          <Text style={styles.animeMeta}>
            {totalEps} bölüm {converted.year ? `• ${converted.year}` : ""}
          </Text>
        </View>
        <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Anime Ara & Ekle</Text>
      </View>

      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Anime ara..."
          placeholderTextColor={colors.textMuted}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <ActivityIndicator color={colors.textPrimary} size="small" />
          ) : (
            <Ionicons name="search" size={24} color={colors.textPrimary} />
          )}
        </TouchableOpacity>
      </View>

      {!searchQuery.trim() && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subtypeScroll}
          contentContainerStyle={styles.subtypeScrollContent}
        >
          {SUBTYPE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.subtypeChip,
                topSubtype === opt.key && styles.subtypeChipActive,
              ]}
              onPress={() => onSubtypeChange(opt.key)}
            >
              <Text
                style={[
                  styles.subtypeChipText,
                  topSubtype === opt.key && styles.subtypeChipTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Text style={styles.sectionLabel}>
        {searchQuery.trim()
          ? "Arama Sonuçları"
          : `Top listesi · ${SUBTYPE_OPTIONS.find((o) => o.key === topSubtype)?.label || topSubtype}`}
      </Text>

      {isLoadingTop && !searchQuery.trim() ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      ) : !hasResults ? (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>
            {searchQuery.trim() ? "Sonuç bulunamadı" : "Henüz veri yok"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery.trim()
              ? "Farklı bir anahtar kelime deneyin"
              : "Yukarıdan arama yapın"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayList}
          keyExtractor={(item) =>
            (item.malId ?? item.mal_id)?.toString() || Math.random().toString()
          }
          renderItem={renderAnimeItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Episode/Season Selection Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bölüm & Sezon Seç</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            {selectedAnime && (
              <View style={styles.selectedAnimePreview}>
                {selectedAnime.image && (
                  <Image
                    source={{ uri: selectedAnime.image }}
                    style={styles.previewImage}
                  />
                )}
                <Text style={styles.previewTitle} numberOfLines={2}>
                  {selectedAnime.title}
                </Text>
                <Text style={styles.previewMeta}>
                  Toplam: {selectedAnime.totalEpisodes || "?"} bölüm
                </Text>
              </View>
            )}
            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.pickerRow}>
                <Text style={styles.pickerLabel}>
                  Mevcut Sezon (Toplam {totalSeasons} sezon)
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.pickerOptions}>
                    {seasonOptions.map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[
                          styles.pickerOption,
                          currentSeason === s && styles.pickerOptionActive,
                        ]}
                        onPress={() => setCurrentSeason(s)}
                      >
                        <Text
                          style={[
                            styles.pickerOptionText,
                            currentSeason === s &&
                              styles.pickerOptionTextActive,
                          ]}
                        >
                          Sezon {s}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.pickerRow}>
                <Text style={styles.pickerLabel}>
                  İzlenen Bölüm (0-{totalEpisodes} arası seçin)
                </Text>
                {totalEpisodes <= 50 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.episodeScrollContent}
                  >
                    {episodeOptions.map((ep) => (
                      <TouchableOpacity
                        key={ep}
                        style={[
                          styles.episodeChip,
                          currentEpisode === ep && styles.episodeChipActive,
                        ]}
                        onPress={() => setCurrentEpisode(ep)}
                      >
                        <Text
                          style={[
                            styles.episodeChipText,
                            currentEpisode === ep &&
                              styles.episodeChipTextActive,
                          ]}
                        >
                          {ep === 0 ? "0" : ep}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.episodeInputRow}>
                    <TouchableOpacity
                      style={styles.episodeBtn}
                      onPress={() =>
                        setCurrentEpisode((p) =>
                          Math.max(0, (parseInt(p) || 0) - 1)
                        )
                      }
                    >
                      <Ionicons
                        name="remove"
                        size={24}
                        color={colors.textPrimary}
                      />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.episodeInput}
                      value={String(currentEpisode)}
                      onChangeText={(t) => {
                        const num = parseInt(t) || 0
                        setCurrentEpisode(
                          Math.min(totalEpisodes, Math.max(0, num))
                        )
                      }}
                      keyboardType="number-pad"
                      maxLength={String(totalEpisodes).length + 1}
                    />
                    <Text style={styles.episodeMax}>/ {totalEpisodes}</Text>
                    <TouchableOpacity
                      style={styles.episodeBtn}
                      onPress={() =>
                        setCurrentEpisode((p) =>
                          Math.min(totalEpisodes, (parseInt(p) || 0) + 1)
                        )
                      }
                    >
                      <Ionicons
                        name="add"
                        size={24}
                        color={colors.textPrimary}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.pickerRow}>
                <Text style={styles.pickerLabel}>Durum</Text>
                <View style={styles.statusOptions}>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.statusChip,
                        status === key && {
                          borderColor: config.color,
                          borderWidth: 2,
                        },
                      ]}
                      onPress={() => setStatus(key)}
                    >
                      <Text
                        style={[
                          styles.statusChipText,
                          status === key && { color: config.color },
                        ]}
                      >
                        {config.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.addBtn, isAdding && styles.addBtnDisabled]}
              onPress={handleAddToList}
              disabled={isAdding}
            >
              {isAdding ? (
                <ActivityIndicator color={colors.textPrimary} />
              ) : (
                <>
                  <Ionicons
                    name="add-circle"
                    size={24}
                    color={colors.textPrimary}
                  />
                  <Text style={styles.addBtnText}>Listeye Ekle</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  closeBtn: { padding: spacing.xs },
  headerTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    textAlign: "center",
  },
  searchSection: {
    flexDirection: "row",
    padding: spacing.lg,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.md,
  },
  searchBtn: {
    width: 52,
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  subtypeScroll: {
    maxHeight: 44,
    marginBottom: spacing.sm,
  },
  subtypeScrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  subtypeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundCard,
    marginRight: spacing.sm,
  },
  subtypeChipActive: {
    backgroundColor: colors.primary,
  },
  subtypeChipText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  subtypeChipTextActive: {
    color: colors.textPrimary,
    fontWeight: fontWeight.semiBold,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  loadingText: { color: colors.textMuted },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    marginTop: spacing.md,
  },
  emptySubtitle: { color: colors.textMuted, marginTop: spacing.xs },
  listContent: { paddingBottom: 100 },
  animeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
  },
  animeImage: {
    width: 56,
    height: 80,
    borderRadius: borderRadius.sm,
  },
  placeholderImage: {
    backgroundColor: colors.backgroundInput,
    justifyContent: "center",
    alignItems: "center",
  },
  animeInfo: { flex: 1, marginLeft: spacing.md },
  animeTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
  },
  animeGenres: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },
  animeMeta: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.backgroundLight,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  selectedAnimePreview: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  previewImage: { width: 50, height: 70, borderRadius: borderRadius.sm },
  previewTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
  },
  previewMeta: { color: colors.textMuted, fontSize: fontSize.sm },
  modalBody: { padding: spacing.lg },
  pickerRow: { marginBottom: spacing.lg },
  pickerLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  pickerOptions: { flexDirection: "row", gap: spacing.sm },
  pickerOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundCard,
  },
  pickerOptionActive: {
    backgroundColor: colors.primary + "40",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  pickerOptionText: { color: colors.textMuted },
  pickerOptionTextActive: { color: colors.primary },
  episodeScrollContent: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  episodeChip: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
  },
  episodeChipActive: {
    backgroundColor: colors.primary,
  },
  episodeChipText: { color: colors.textSecondary, fontSize: fontSize.md },
  episodeChipTextActive: {
    color: colors.textPrimary,
    fontWeight: fontWeight.bold,
  },
  episodeInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  episodeBtn: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundCard,
    justifyContent: "center",
    alignItems: "center",
  },
  episodeInput: {
    width: 70,
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    textAlign: "center",
  },
  episodeMax: { color: colors.textMuted, fontSize: fontSize.md },
  statusOptions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  statusChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusChipText: { color: colors.textSecondary, fontSize: fontSize.sm },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    margin: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  addBtnDisabled: { opacity: 0.6 },
  addBtnText: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
})

export default AddAnimeScreen
