import React, { useState } from 'react';
import { Star, Calendar, Edit2, Trash2, Trophy, MessageCircle } from 'lucide-react';
import { STATUSES } from '../data/constants';

const GameCard = ({ game, onEdit, onDelete, themeData }) => {
  const [showNotes, setShowNotes] = useState(false);
  const statusInfo = STATUSES.find(s => s.value === game.status);

  return (
    <div 
      className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl overflow-hidden border border-white border-opacity-20 transition group flex flex-col"
      onMouseEnter={(e) => e.currentTarget.style.borderColor = themeData?.primary}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
    >
      {game.coverImage && (
        <div className="w-full h-56 overflow-hidden bg-slate-800 relative">
          <img 
            src={game.coverImage} 
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {game.platinado && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold flex items-center gap-1 shadow-lg">
              <Trophy className="w-4 h-4" />
              100%
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(game);
              }} 
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg transition"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(game.id);
              }} 
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-3">
          <h3 
            className="text-lg font-bold text-white transition break-words mb-1 line-clamp-2"
            style={{ color: 'white' }}
            onMouseEnter={(e) => e.target.style.color = themeData?.secondary}
            onMouseLeave={(e) => e.target.style.color = 'white'}
          >
            {game.name}
          </h3>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className={`${statusInfo.color} px-2 py-1 rounded text-white text-xs font-semibold`}>
              {statusInfo.label}
            </span>
            <span className="bg-gray-700 px-2 py-1 rounded text-xs text-white">{game.platform}</span>
            {game.platinado && (
              <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                Platinado
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < game.rating ? 'fill-yellow-400' : ''}`} />
            ))}
            <span className="text-white ml-2 text-sm">{game.rating}/5</span>
          </div>
          
          {game.dateFinished && (
            <div className="flex items-center gap-1 text-gray-300 text-xs">
              <Calendar className="w-3 h-3" />
              {new Date(game.dateFinished).toLocaleDateString('pt-BR', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </div>
          )}
        </div>
        
        {game.tags && game.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {game.tags.slice(0, 3).map(tag => (
              <span 
                key={tag} 
                className="px-2 py-0.5 rounded text-xs text-white"
                style={{ 
                  background: `${themeData?.primary}80` 
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Notas/Comentários */}
        {game.notes && game.notes.trim() && (
          <div className="mt-auto pt-2 border-t border-white border-opacity-10">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center gap-2 text-purple-300 hover:text-purple-200 text-sm transition w-full"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="font-semibold">
                {showNotes ? 'Esconder' : 'Ver'} comentários
              </span>
            </button>
            {showNotes && (
              <div className="mt-2 p-3 bg-black bg-opacity-30 rounded-lg text-gray-200 text-sm">
                <p className="whitespace-pre-wrap break-words">{game.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;