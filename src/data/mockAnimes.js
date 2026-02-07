/**
 * Statik veri kaldırıldı – tüm veriler artık dinamik:
 * - Liste verisi: SQLite veritabanı (AnimeContext)
 * - Keşfet / arama: Jikan API (AddAnimeScreen – getTopAnime, searchAnime)
 *
 * Eski mock listesi kullanılmıyor. Yardımcı fonksiyonlar utils/animeUtils.js'de.
 */

import { getAllGenres as getGenres, getAnimeStats as getStats } from "../utils/animeUtils"

/** @deprecated Statik liste yok; veri API/DB'den gelir. Geriye dönük uyumluluk için boş dizi. */
export const mockAnimes = []

/** Dinamik: herhangi bir anime listesi üzerinden tür listesi (API/DB verisi ile kullanın). */
export const getAllGenres = (animes = []) => getGenres(animes)

/** Dinamik: herhangi bir anime listesi üzerinden istatistik (API/DB verisi ile kullanın). */
export const getAnimeStats = (animes = []) => getStats(animes)

export default mockAnimes
