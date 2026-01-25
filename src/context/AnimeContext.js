import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockAnimes, getAnimeStats } from '../data/mockAnimes';

const AnimeContext = createContext();

export const useAnime = () => {
  const context = useContext(AnimeContext);
  if (!context) {
    throw new Error('useAnime must be used within an AnimeProvider');
  }
  return context;
};

export const AnimeProvider = ({ children }) => {
  const [animes, setAnimes] = useState(mockAnimes);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('lastWatched');

  // Add new anime
  const addAnime = useCallback((newAnime) => {
    const anime = {
      ...newAnime,
      id: Date.now().toString(),
      addedDate: new Date().toISOString().split('T')[0],
      lastWatched: null,
      currentEpisode: 0,
      currentSeason: 1,
      rating: 0,
      isFavorite: false,
    };
    setAnimes(prev => [anime, ...prev]);
    return anime;
  }, []);

  // Update anime
  const updateAnime = useCallback((id, updates) => {
    setAnimes(prev =>
      prev.map(anime =>
        anime.id === id
          ? { ...anime, ...updates, lastWatched: new Date().toISOString().split('T')[0] }
          : anime
      )
    );
  }, []);

  // Delete anime
  const deleteAnime = useCallback((id) => {
    setAnimes(prev => prev.filter(anime => anime.id !== id));
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((id) => {
    setAnimes(prev =>
      prev.map(anime =>
        anime.id === id ? { ...anime, isFavorite: !anime.isFavorite } : anime
      )
    );
  }, []);

  // Update episode progress
  const updateProgress = useCallback((id, currentEpisode, currentSeason) => {
    setAnimes(prev =>
      prev.map(anime => {
        if (anime.id !== id) return anime;
        
        const newStatus = currentEpisode >= anime.totalEpisodes ? 'completed' : anime.status;
        
        return {
          ...anime,
          currentEpisode,
          currentSeason,
          status: newStatus,
          lastWatched: new Date().toISOString().split('T')[0],
        };
      })
    );
  }, []);

  // Update notes
  const updateNotes = useCallback((id, notes) => {
    setAnimes(prev =>
      prev.map(anime =>
        anime.id === id ? { ...anime, notes } : anime
      )
    );
  }, []);

  // Update status
  const updateStatus = useCallback((id, status) => {
    setAnimes(prev =>
      prev.map(anime =>
        anime.id === id
          ? { ...anime, status, lastWatched: new Date().toISOString().split('T')[0] }
          : anime
      )
    );
  }, []);

  // Update rating
  const updateRating = useCallback((id, rating) => {
    setAnimes(prev =>
      prev.map(anime =>
        anime.id === id ? { ...anime, rating } : anime
      )
    );
  }, []);

  // Get filtered and sorted animes
  const getFilteredAnimes = useCallback(() => {
    let filtered = [...animes];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        anime =>
          anime.title.toLowerCase().includes(query) ||
          anime.titleJapanese?.includes(query) ||
          anime.genres.some(g => g.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(anime => anime.status === filterStatus);
    }

    // Apply sorting
    switch (sortBy) {
      case 'lastWatched':
        filtered.sort((a, b) => {
          if (!a.lastWatched) return 1;
          if (!b.lastWatched) return -1;
          return new Date(b.lastWatched) - new Date(a.lastWatched);
        });
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'progress':
        filtered.sort((a, b) => {
          const progressA = a.currentEpisode / a.totalEpisodes;
          const progressB = b.currentEpisode / b.totalEpisodes;
          return progressB - progressA;
        });
        break;
      case 'addedDate':
        filtered.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
        break;
      default:
        break;
    }

    return filtered;
  }, [animes, searchQuery, filterStatus, sortBy]);

  // Get anime by ID
  const getAnimeById = useCallback((id) => {
    return animes.find(anime => anime.id === id);
  }, [animes]);

  // Get statistics
  const stats = getAnimeStats(animes);

  const value = {
    animes,
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
  };

  return (
    <AnimeContext.Provider value={value}>
      {children}
    </AnimeContext.Provider>
  );
};

export default AnimeContext;
