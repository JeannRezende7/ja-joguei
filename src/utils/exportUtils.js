export const getTopGamesByHours = (games, limit = 10) => {
  return [...games]
    .filter(g => g.hoursPlayed && parseInt(g.hoursPlayed) > 0)
    .sort((a, b) => parseInt(b.hoursPlayed) - parseInt(a.hoursPlayed))
    .slice(0, limit);
};

export const getTopGamesByRating = (games, limit = 10) => {
  return [...games]
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      // Se mesma nota, ordenar por horas jogadas
      return parseInt(b.hoursPlayed || 0) - parseInt(a.hoursPlayed || 0);
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
  return getTopGamesByHours(gamesFromYear, limit);
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

export const generateRankingHTML = (games, title, stats, includeImages = true) => {
  const totalHours = games.reduce((acc, g) => acc + parseInt(g.hoursPlayed || 0), 0);
  const avgRating = games.length > 0 
    ? (games.reduce((acc, g) => acc + g.rating, 0) / games.length).toFixed(1)
    : 0;

  return `
    <div style="
      width: 1200px;
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
      padding: 60px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: white;
      border-radius: 20px;
      box-sizing: border-box;
    ">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 50px;">
        <div style="font-size: 48px; margin-bottom: 10px;">🎮</div>
        <h1 style="font-size: 42px; margin: 0 0 10px 0; font-weight: bold;">
          ${title}
        </h1>
        <p style="font-size: 20px; color: #a78bfa; margin: 0;">
          Já Joguei - ${new Date().getFullYear()}
        </p>
      </div>

      <!-- Rankings -->
      <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 40px;">
        ${games.map((game, index) => `
          <div style="
            display: flex;
            align-items: center;
            padding: ${index < 3 ? '20px' : '15px'};
            margin-bottom: ${index < 3 ? '20px' : '10px'};
            background: ${index < 3 ? 'rgba(167, 139, 250, 0.2)' : 'rgba(255,255,255,0.05)'};
            border-radius: 12px;
            border-left: 4px solid ${index === 0 ? '#fbbf24' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#a78bfa'};
            gap: 20px;
          ">
            <!-- Position -->
            <div style="
              font-size: ${index < 3 ? '32px' : '24px'};
              font-weight: bold;
              min-width: 50px;
              text-align: center;
              flex-shrink: 0;
            ">
              ${getMedalEmoji(index)}
            </div>

            <!-- Game Image -->
            ${game.coverImage ? `
              <div style="
                width: ${index < 3 ? '100px' : '80px'};
                height: ${index < 3 ? '100px' : '80px'};
                border-radius: 8px;
                overflow: hidden;
                flex-shrink: 0;
                background: rgba(0,0,0,0.3);
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
              </div>
            ` : ''}

            <!-- Game Info -->
            <div style="flex: 1; min-width: 0;">
              <div style="
                font-size: ${index < 3 ? '24px' : '18px'}; 
                font-weight: bold; 
                margin-bottom: 5px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              ">
                ${game.name}
              </div>
              <div style="font-size: 14px; color: #d1d5db;">
                ${game.platform} ${game.tags && game.tags.length > 0 ? '• ' + game.tags.slice(0, 2).join(', ') : ''}
              </div>
            </div>

            <!-- Hours & Rating -->
            <div style="
              text-align: right; 
              flex-shrink: 0;
              min-width: 100px;
            ">
              <div style="font-size: ${index < 3 ? '28px' : '20px'}; font-weight: bold; color: #fbbf24;">
                ${game.hoursPlayed}h
              </div>
              <div style="font-size: 16px; color: #fbbf24;">
                ${'⭐'.repeat(game.rating)}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Footer Stats -->
      <div style="
        margin-top: 40px;
        padding: 30px;
        background: rgba(0,0,0,0.3);
        border-radius: 15px;
        display: flex;
        justify-content: space-around;
        text-align: center;
      ">
        <div>
          <div style="font-size: 36px; font-weight: bold; color: #a78bfa;">
            ${totalHours}h
          </div>
          <div style="font-size: 16px; color: #d1d5db;">
            Total de Horas
          </div>
        </div>
        <div>
          <div style="font-size: 36px; font-weight: bold; color: #fbbf24;">
            ${avgRating}/5
          </div>
          <div style="font-size: 16px; color: #d1d5db;">
            Nota Média
          </div>
        </div>
        <div>
          <div style="font-size: 36px; font-weight: bold; color: #34d399;">
            ${games.length}
          </div>
          <div style="font-size: 16px; color: #d1d5db;">
            Jogos
          </div>
        </div>
      </div>
    </div>
  `;
};