import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react"
import * as Database from "../services/database"

const AnimeContext = createContext()

export const useAnime = () => {
  const context = useContext(AnimeContext)
  if (!context) {
    throw new Error("useAnime must be used within an AnimeProvider")
  }
  return context
}

const getAnimeStats = (animes) => {
  const safeGenres = (g) => (Array.isArray(g) ? g : [])
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

export const AnimeProvider = ({ children }) => {
  const [animes, setAnimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("lastWatched")

  useEffect(() => {
    const init = async () => {
      try {
        await Database.initDatabase()
        const loaded = await Database.getAllAnimes()
        setAnimes(loaded)
      } catch (e) {
        console.error("DB init error:", e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const addAnime = useCallback(async (newAnime) => {
    const anime = {
      ...newAnime,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      addedDate: new Date().toISOString().split("T")[0],
      lastWatched: null,
      currentEpisode: newAnime.currentEpisode ?? 0,
      currentSeason: newAnime.currentSeason ?? 1,
      rating: newAnime.rating ?? 0,
      isFavorite: false,
    }
    await Database.addAnime(anime)
    setAnimes((prev) => [anime, ...prev])
    return anime
  }, [])

  const updateAnime = useCallback(async (id, updates) => {
    const updateData = {
      ...updates,
      lastWatched: new Date().toISOString().split("T")[0],
    }
    await Database.updateAnime(id, updateData)
    setAnimes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updateData } : a))
    )
  }, [])

  const deleteAnime = useCallback(async (id) => {
    await Database.deleteAnime(id)
    setAnimes((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const toggleFavorite = useCallback(
    async (id) => {
      const anime = animes.find((a) => a.id === id)
      if (!anime) return
      const next = !anime.isFavorite
      await Database.updateAnime(id, { isFavorite: next })
      setAnimes((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isFavorite: next } : a))
      )
    },
    [animes]
  )

  const updateProgress = useCallback(
    async (id, currentEpisode, currentSeason) => {
      const anime = animes.find((a) => a.id === id)
      if (!anime) return
      const newStatus =
        currentEpisode >= (anime.totalEpisodes || 0)
          ? "completed"
          : anime.status
      const updateData = {
        currentEpisode,
        currentSeason,
        status: newStatus,
        lastWatched: new Date().toISOString().split("T")[0],
      }
      await Database.updateAnime(id, updateData)
      setAnimes((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updateData } : a))
      )
    },
    [animes]
  )

  const updateNotes = useCallback(async (id, notes) => {
    await Database.updateAnime(id, { notes })
    setAnimes((prev) => prev.map((a) => (a.id === id ? { ...a, notes } : a)))
  }, [])

  const updateStatus = useCallback(async (id, status) => {
    const updateData = {
      status,
      lastWatched: new Date().toISOString().split("T")[0],
    }
    await Database.updateAnime(id, updateData)
    setAnimes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updateData } : a))
    )
  }, [])

  const updateRating = useCallback(async (id, rating) => {
    await Database.updateAnime(id, { rating })
    setAnimes((prev) => prev.map((a) => (a.id === id ? { ...a, rating } : a)))
  }, [])

  const getFilteredAnimes = useCallback(() => {
    let filtered = [...animes]
    const genres = (a) => (Array.isArray(a.genres) ? a.genres : [])

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (a) =>
          (a.title || "").toLowerCase().includes(q) ||
          (a.titleJapanese || "").includes(q) ||
          genres(a).some((g) => String(g).toLowerCase().includes(q))
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((a) => a.status === filterStatus)
    }

    switch (sortBy) {
      case "lastWatched":
        filtered.sort((a, b) => {
          if (!a.lastWatched) return 1
          if (!b.lastWatched) return -1
          return new Date(b.lastWatched) - new Date(a.lastWatched)
        })
        break
      case "title":
        filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""))
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "progress":
        filtered.sort((a, b) => {
          const pa =
            a.totalEpisodes && a.currentEpisode
              ? a.currentEpisode / a.totalEpisodes
              : 0
          const pb =
            b.totalEpisodes && b.currentEpisode
              ? b.currentEpisode / b.totalEpisodes
              : 0
          return pb - pa
        })
        break
      case "addedDate":
        filtered.sort(
          (a, b) => new Date(b.addedDate || 0) - new Date(a.addedDate || 0)
        )
        break
      default:
        break
    }

    return filtered
  }, [animes, searchQuery, filterStatus, sortBy])

  const getAnimeById = useCallback(
    (id) => animes.find((a) => a.id === id),
    [animes]
  )

  const stats = getAnimeStats(animes)

  const value = {
    animes,
    loading,
    stats,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    addAnime,
    updateAnime,
    deleteAnime,
    toggleFavorite,
    updateProgress,
    updateNotes,
    updateStatus,
    updateRating,
    getFilteredAnimes,
    getAnimeById,
  }

  return <AnimeContext.Provider value={value}>{children}</AnimeContext.Provider>
}

export default AnimeContext
