import { PLATFORM_MAP, GENRE_MAP } from '../data/constants';

export const detectPlatform = (platforms) => {
  const gamePlatform = platforms?.find(p => PLATFORM_MAP[p.platform.name]);
  return gamePlatform ? PLATFORM_MAP[gamePlatform.platform.name] : 'PC';
};

export const mapGenresToTags = (genres) => {
  return genres?.map(g => GENRE_MAP[g.name] || null).filter(Boolean) || [];
};

export const calculateStats = (games) => {
  return {
    total: games.length,
    completed: games.filter(g => g.status === 'completed').length,
    playing: games.filter(g => g.status === 'playing').length,
    avgRating: games.length > 0 
      ? (games.reduce((acc, g) => acc + g.rating, 0) / games.length).toFixed(1) 
      : 0,
    totalHours: games.reduce((acc, g) => acc + (parseInt(g.hoursPlayed) || 0), 0)
  };
};

export const filterGames = (games, searchTerm, filterStatus, filterPlatform) => {
  return games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || game.status === filterStatus;
    const matchesPlatform = filterPlatform === 'all' || game.platform === filterPlatform;
    return matchesSearch && matchesStatus && matchesPlatform;
  });
};