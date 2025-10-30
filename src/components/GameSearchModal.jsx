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
    <div className="bg-purple-900 bg-opacity-30 border border-purple-500 rounded-lg p-4">
      <div className="flex items-center gap-2 text-purple-300 mb-3">
        <Search className="w-5 h-5" />
        <span className="font-semibold">Passo 1: Busque o jogo</span>
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none"
          placeholder="Digite: God of War, Zelda, Elden Ring..."
        />
        
        {isSearching && (
          <div className="absolute right-3 top-3">
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          </div>
        )}
      </div>

      {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && showResults && (
        <div className="mt-3 text-yellow-300 text-sm bg-yellow-900 bg-opacity-30 p-3 rounded">
          ⚠️ Nenhum jogo encontrado. Tente outro nome ou preencha manualmente abaixo.
        </div>
      )}

      {showResults && searchResults.length > 0 && (
        <div className="mt-3 bg-slate-900 border-2 border-purple-500 rounded-lg max-h-80 overflow-y-auto">
          <div className="p-2 bg-purple-600 text-white text-sm font-semibold sticky top-0">
            ✨ {searchResults.length} jogo(s) encontrado(s) - Clique para selecionar
          </div>
          {searchResults.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="w-full p-3 hover:bg-slate-700 transition flex items-center gap-3 text-left border-b border-slate-700 last:border-0"
            >
              <div className="w-24 h-24 flex-shrink-0 bg-slate-800 rounded overflow-hidden">
                {game.background_image ? (
                  <img 
                    src={game.background_image} 
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🎮
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-lg">{game.name}</div>
                <div className="text-gray-400 text-sm mt-1">
                  {game.released && `📅 ${new Date(game.released).getFullYear()}`}
                  {game.rating && ` • ⭐ ${game.rating.toFixed(1)}`}
                </div>
                <div className="text-purple-300 text-xs mt-1">
                  {game.platforms?.slice(0, 3).map(p => p.platform.name).join(', ')}
                </div>
              </div>
              <div className="text-green-400 flex-shrink-0">
                <Check className="w-6 h-6" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameSearchModal;