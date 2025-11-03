export const getPlatinadosGames = (games, limit = 10) => {
  return [...games]
    .filter(g => g.platinado)
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return new Date(b.dateFinished || b.createdAt) - new Date(a.dateFinished || a.createdAt);
    })
    .slice(0, limit);
};

export const getTopGamesByRating = (games, limit = 10) => {
  return [...games]
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return new Date(b.dateFinished || b.createdAt) - new Date(a.dateFinished || a.createdAt);
    })
    .slice(0, limit);
};

export const getGamesByYear = (games, year) => {
  return games.filter(game => {
    if (!game.dateFinished) return false;
    const gameYear = new Date(game.dateFinished).getFullYear();
    return gameYear === parseInt(year);
  });
};

export const getTopGamesByYear = (games, year, limit = 10) => {
  const gamesFromYear = getGamesByYear(games, year);
  return getTopGamesByRating(gamesFromYear, limit);
};

export const getRecentGames = (games, limit = 10) => {
  return [...games]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.dateFinished);
      const dateB = new Date(b.createdAt || b.dateFinished);
      return dateB - dateA;
    })
    .slice(0, limit);
};

export const getGamesByStatus = (games, status, limit = 10) => {
  return [...games]
    .filter(g => g.status === status)
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return new Date(b.dateFinished || b.createdAt) - new Date(a.dateFinished || a.createdAt);
    })
    .slice(0, limit);
};

export const getAvailableYears = (games) => {
  const years = games
    .filter(g => g.dateFinished)
    .map(g => new Date(g.dateFinished).getFullYear());
  return [...new Set(years)].sort((a, b) => b - a);
};

export const getMedalEmoji = (position) => {
  switch(position) {
    case 0: return '🥇';
    case 1: return '🥈';
    case 2: return '🥉';
    default: return `${position + 1}.`;
  }
};

export const generateRankingHTML = (games, title) => {
  const avgRating = games.length > 0 
    ? (games.reduce((acc, g) => acc + g.rating, 0) / games.length).toFixed(1)
    : 0;
  
  const platinadosCount = games.filter(g => g.platinado).length;

  return `
    <div style="
      width: 800px;
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
      padding: 40px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: white;
      border-radius: 20px;
      box-sizing: border-box;
    ">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="font-size: 48px; margin-bottom: 10px;">🎮</div>
        <h1 style="font-size: 36px; margin: 0 0 10px 0; font-weight: bold; line-height: 1.2;">
          ${title}
        </h1>
        <p style="font-size: 18px; color: #a78bfa; margin: 0;">
          Já Joguei - ${new Date().getFullYear()}
        </p>
      </div>

      <!-- Rankings -->
      <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 30px;">
        ${games.map((game, index) => `
          <div style="
            display: flex;
            align-items: center;
            padding: ${index < 3 ? '16px' : '12px'};
            margin-bottom: ${index < games.length - 1 ? (index < 3 ? '16px' : '8px') : '0'};
            background: ${index < 3 ? 'rgba(167, 139, 250, 0.2)' : 'rgba(255,255,255,0.05)'};
            border-radius: 12px;
            border-left: 4px solid ${index === 0 ? '#fbbf24' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#a78bfa'};
            gap: 12px;
          ">
            <!-- Position -->
            <div style="
              font-size: ${index < 3 ? '28px' : '20px'};
              font-weight: bold;
              min-width: 40px;
              text-align: center;
              flex-shrink: 0;
            ">
              ${getMedalEmoji(index)}
            </div>

            <!-- Game Image -->
            ${game.coverImage ? `
              <div style="
                width: ${index < 3 ? '80px' : '60px'};
                height: ${index < 3 ? '80px' : '60px'};
                border-radius: 8px;
                overflow: hidden;
                flex-shrink: 0;
                background: rgba(0,0,0,0.3);
                position: relative;
              ">
                <img 
                  src="${game.coverImage}" 
                  alt="${game.name}"
                  style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  "
                />
                ${game.platinado ? `
                  <div style="
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    background: #fbbf24;
                    color: #000;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                  ">🏆</div>
                ` : ''}
              </div>
            ` : `
              <div style="
                width: ${index < 3 ? '80px' : '60px'};
                height: ${index < 3 ? '80px' : '60px'};
                border-radius: 8px;
                flex-shrink: 0;
                background: rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
              ">
                🎮
              </div>
            `}

            <!-- Game Info -->
            <div style="flex: 1; min-width: 0;">
              <div style="
                font-size: ${index < 3 ? '20px' : '16px'}; 
                font-weight: bold; 
                margin-bottom: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                line-height: 1.3;
              ">
                ${game.name}
              </div>
              <div style="font-size: 12px; color: #d1d5db; display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
                <span>${game.platform}</span>
                ${game.platinado ? '<span style="color: #fbbf24;">• 🏆 Platinado</span>' : ''}
                ${game.tags && game.tags.length > 0 ? '<span>• ' + game.tags.slice(0, 2).join(', ') + '</span>' : ''}
              </div>
            </div>

            <!-- Rating -->
            <div style="
              text-align: right; 
              flex-shrink: 0;
              min-width: 60px;
            ">
              <div style="font-size: ${index < 3 ? '24px' : '18px'}; font-weight: bold; color: #fbbf24;">
                ${'⭐'.repeat(game.rating)}
              </div>
              <div style="font-size: 12px; color: #d1d5db;">
                ${game.rating}/5
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Footer Stats -->
      <div style="
        margin-top: 30px;
        padding: 25px;
        background: rgba(0,0,0,0.3);
        border-radius: 15px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        text-align: center;
      ">
        <div>
          <div style="font-size: 32px; font-weight: bold; color: #fbbf24;">
            ${avgRating}/5
          </div>
          <div style="font-size: 14px; color: #d1d5db;">
            Nota Média
          </div>
        </div>
        <div>
          <div style="font-size: 32px; font-weight: bold; color: #fbbf24;">
            ${platinadosCount}
          </div>
          <div style="font-size: 14px; color: #d1d5db;">
            🏆 Platinados
          </div>
        </div>
        <div>
          <div style="font-size: 32px; font-weight: bold; color: #34d399;">
            ${games.length}
          </div>
          <div style="font-size: 14px; color: #d1d5db;">
            Jogos
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="
        margin-top: 20px;
        text-align: center;
        font-size: 12px;
        color: #9ca3af;
      ">
        Criado com Já Joguei 🎮
      </div>
    </div>
  `;
};