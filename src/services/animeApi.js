/**
 * Yerel anime API – veri src/data/animeData.js'den (20 anime).
 * Ağ isteği yok; arama ve liste bu veri üzerinden.
 */

import { ANIME_LIST } from "../data/animeData"

export const TOP_SUBTYPES = {
  bypopularity: "En Popüler",
  byfavorites: "Favoriler",
  airing: "Yayında",
  upcoming: "Yaklaşan",
  tv: "TV",
  movie: "Film",
  ova: "OVA",
  ona: "ONA",
  special: "Özel",
}

/**
 * Top / liste – tüm animeleri döner (sayfa/limit ile dilimlenir).
 */
export const getTopAnime = async (page = 1, subtype = "bypopularity", limit = 25) => {
  const start = (page - 1) * limit
  return ANIME_LIST.slice(start, start + limit)
}

/**
 * Arama – başlık veya Japonca başlıkta arama.
 */
export const searchAnime = async (query, limit = 20, page = 1) => {
  const q = (query || "").toLowerCase().trim()
  if (!q) return ANIME_LIST.slice(0, limit)
  const filtered = ANIME_LIST.filter(
    (a) =>
      (a.title && a.title.toLowerCase().includes(q)) ||
      (a.titleJapanese && a.titleJapanese.toLowerCase().includes(q)) ||
      (a.genres && a.genres.some((g) => String(g).toLowerCase().includes(q)))
  )
  const start = (page - 1) * limit
  return filtered.slice(start, start + limit)
}

/**
 * ID ile tek anime (malId ile).
 */
export const getAnimeById = async (malId) => {
  const id = Number(malId)
  return ANIME_LIST.find((a) => a.malId === id) || null
}

/**
 * Veri zaten uygulama formatında; aynen döndür.
 */
export const convertJikanToAppFormat = (item) => {
  if (!item) return null
  return item
}
