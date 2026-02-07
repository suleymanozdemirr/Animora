import * as SQLite from "expo-sqlite"

const dbName = "animora.db"
let db = null

const getDatabase = () => {
  if (!db) {
    db = SQLite.openDatabaseSync(dbName)
  }
  return db
}

export const initDatabase = async () => {
  const database = getDatabase()
  database.execSync(`
    CREATE TABLE IF NOT EXISTS animes (
      id TEXT PRIMARY KEY,
      malId INTEGER,
      title TEXT NOT NULL,
      titleJapanese TEXT,
      image TEXT,
      coverImage TEXT,
      totalSeasons INTEGER DEFAULT 1,
      currentSeason INTEGER DEFAULT 1,
      totalEpisodes INTEGER DEFAULT 0,
      currentEpisode INTEGER DEFAULT 0,
      status TEXT DEFAULT 'planToWatch',
      rating REAL DEFAULT 0,
      genres TEXT,
      studio TEXT,
      year INTEGER,
      synopsis TEXT,
      notes TEXT,
      isFavorite INTEGER DEFAULT 0,
      addedDate TEXT,
      lastWatched TEXT
    );
  `)
  return database
}

export const getAllAnimes = async () => {
  const database = getDatabase()
  const result = database.getAllSync(
    "SELECT * FROM animes ORDER BY addedDate DESC;"
  )
  return result.map((row) => ({
    ...row,
    isFavorite: row.isFavorite === 1,
    genres: row.genres ? JSON.parse(row.genres) : [],
  }))
}

export const getAnimeById = async (id) => {
  const database = getDatabase()
  const result = database.getFirstSync("SELECT * FROM animes WHERE id = ?;", [
    id,
  ])
  if (result) {
    return {
      ...result,
      isFavorite: result.isFavorite === 1,
      genres: result.genres ? JSON.parse(result.genres) : [],
    }
  }
  return null
}

export const addAnime = async (anime) => {
  const database = getDatabase()
  database.runSync(
    `INSERT INTO animes (
      id, malId, title, titleJapanese, image, coverImage,
      totalSeasons, currentSeason, totalEpisodes, currentEpisode,
      status, rating, genres, studio, year, synopsis, notes,
      isFavorite, addedDate, lastWatched
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      anime.id,
      anime.malId || null,
      anime.title,
      anime.titleJapanese || null,
      anime.image || null,
      anime.coverImage || null,
      anime.totalSeasons || 1,
      anime.currentSeason || 1,
      anime.totalEpisodes || 0,
      anime.currentEpisode || 0,
      anime.status || "planToWatch",
      anime.rating || 0,
      JSON.stringify(anime.genres || []),
      anime.studio || null,
      anime.year || null,
      anime.synopsis || null,
      anime.notes || null,
      anime.isFavorite ? 1 : 0,
      anime.addedDate || new Date().toISOString().split("T")[0],
      anime.lastWatched || null,
    ]
  )
  return anime
}

export const updateAnime = async (id, updates) => {
  const database = getDatabase()
  const fields = []
  const values = []
  Object.keys(updates).forEach((key) => {
    let value = updates[key]
    if (key === "genres" && Array.isArray(value)) value = JSON.stringify(value)
    else if (key === "isFavorite" && typeof value === "boolean")
      value = value ? 1 : 0
    fields.push(`${key} = ?`)
    values.push(value)
  })
  if (fields.length === 0) return
  values.push(id)
  database.runSync(
    `UPDATE animes SET ${fields.join(", ")} WHERE id = ?;`,
    values
  )
}

export const deleteAnime = async (id) => {
  const database = getDatabase()
  database.runSync("DELETE FROM animes WHERE id = ?;", [id])
}
