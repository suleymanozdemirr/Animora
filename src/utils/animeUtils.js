/**
 * Dinamik anime yardımcıları – veri her zaman API veya veritabanından gelir.
 * Statik liste kullanılmaz.
 */

/**
 * Verilen anime listesinden benzersiz tüm türleri döndürür.
 * @param {Array} animes - Anime listesi (API/DB'den)
 */
export const getAllGenres = (animes = []) => {
  const genresSet = new Set()
  animes.forEach((anime) => {
    (anime.genres || []).forEach((genre) => genresSet.add(genre))
  })
  return Array.from(genresSet).sort()
}

/**
 * Verilen anime listesi için istatistik hesaplar.
 * @param {Array} animes - Anime listesi (API/DB'den)
 */
export const getAnimeStats = (animes = []) => {
  return {
    total: animes.length,
    watching: animes.filter((a) => a.status === "watching").length,
    completed: animes.filter((a) => a.status === "completed").length,
    planToWatch: animes.filter((a) => a.status === "planToWatch").length,
    onHold: animes.filter((a) => a.status === "onHold").length,
    dropped: animes.filter((a) => a.status === "dropped").length,
    favorites: animes.filter((a) => a.isFavorite).length,
    totalEpisodesWatched: animes.reduce(
      (sum, a) => sum + (a.currentEpisode || 0),
      0
    ),
  }
}
