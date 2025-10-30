const CORS_PROXY = 'https://corsproxy.io/?';
const API_BASE = 'https://api.rawg.io/api';
const API_KEY = '7e8e7d50b20c43de87a6fc585d963a3d'

export const searchGames = async (query) => {
  if (query.length < 2) {
    return [];
  }

  try {
    // Remover palavras comuns que a API ignora
    const cleanQuery = query
      .toLowerCase()
      .replace(/\b(of|the|a|an|and|in|on|at|to)\b/g, '')
      .trim()
      .replace(/\s+/g, ' ');
    
    // Se a query ficou vazia após limpar, usar a original
    const searchQuery = cleanQuery || query;
    
    const apiUrl = `${API_BASE}/games?key=${API_KEY}&search=${encodeURIComponent(searchQuery)}&page_size=30&ordering=-relevance`;
    const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
    
    console.log('Buscando:', searchQuery, '(original:', query + ')');
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const results = data.results || [];
    
    // Filtrar e pontuar resultados pela relevância
    const queryLower = query.toLowerCase().trim();
    const queryWords = queryLower.split(/\s+/);
    
    const scored = results.map(game => {
      const nameLower = game.name.toLowerCase();
      let score = 0;
      
      // Pontuação: nome exato ou muito próximo
      if (nameLower === queryLower) score += 1000;
      if (nameLower.includes(queryLower)) score += 500;
      
      // Pontuação: começa com a busca
      if (nameLower.startsWith(queryLower)) score += 300;
      
      // Pontuação: contém todas as palavras da busca
      const allWordsMatch = queryWords.every(word => 
        word.length > 2 && nameLower.includes(word)
      );
      if (allWordsMatch) score += 200;
      
      // Pontuação: popularidade do jogo (rating)
      score += (game.rating || 0) * 10;
      
      return { ...game, relevanceScore: score };
    });
    
    // Filtrar apenas jogos com pontuação mínima
    const filtered = scored.filter(game => game.relevanceScore > 0);
    
    // Ordenar por relevância
    const sorted = filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    console.log('Resultados encontrados:', sorted.length);
    
    return sorted.slice(0, 10);
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    return [];
  }
};