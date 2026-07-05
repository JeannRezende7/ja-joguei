import React from 'react';
import { Search, Loader2, Check } from 'lucide-react';

const GameSearchModal = ({
  searchQuery,
  onSearchChange,
  searchResults,
  isSearching,
  showResults,
  onSelectGame
}) => {
  return (
    <div className="surface p-4">
      <div className="flex items-center gap-2 text-violet-400 mb-3 text-sm">
        <Search className="w-4 h-4" />
        <span className="font-semibold">Passo 1: Busque o jogo</span>
      </div>

      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-field"
          placeholder="Digite: God of War, Zelda, Elden Ring..."
        />

        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
          </div>
        )}
      </div>

      {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && showResults && (
        <div className="mt-3 text-amber-300 text-xs bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
          Nenhum jogo encontrado. Tente outro nome ou preencha manualmente abaixo.
        </div>
      )}

      {showResults && searchResults.length > 0 && (
        <div className="mt-3 bg-slate-950 border border-slate-800 rounded-lg max-h-72 overflow-y-auto">
          <div className="p-2 bg-violet-600 text-white text-xs font-semibold sticky top-0">
            {searchResults.length} jogo(s) encontrado(s)
          </div>
          {searchResults.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="w-full p-3 active:bg-slate-800 transition flex items-center gap-3 text-left border-b border-slate-800 last:border-0"
            >
              <div className="w-14 h-14 flex-shrink-0 bg-slate-800 rounded-md overflow-hidden">
                {game.background_image ? (
                  <img src={game.background_image} alt={game.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🎮</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm truncate">{game.name}</div>
                <div className="text-slate-500 text-xs mt-0.5">
                  {game.released && `${new Date(game.released).getFullYear()}`}
                  {game.rating ? ` • ⭐ ${game.rating.toFixed(1)}` : ''}
                </div>
                <div className="text-violet-400 text-xs mt-0.5 truncate">
                  {game.platforms?.slice(0, 3).map(p => p.platform.name).join(', ')}
                </div>
              </div>
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameSearchModal;
