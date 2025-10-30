const CORS_PROXY = 'https://corsproxy.io/?';
const API_BASE = 'https://api.rawg.io/api';
const API_KEY = '7e8e7d50b20c43de87a6fc585d963a3d'

export const searchGames = async (query) => {
  if (query.length < 2) {
    return [];
  }

  try {
    const apiUrl = `${API_BASE}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=10&ordering=-rating`;
    const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    return [];
  }
};