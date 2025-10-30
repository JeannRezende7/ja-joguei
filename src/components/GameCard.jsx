import React from 'react';
import { Star, Calendar, Edit2, Trash2 } from 'lucide-react';
import { STATUSES } from '../data/constants';

const GameCard = ({ game, onEdit, onDelete }) => {
  const statusInfo = STATUSES.find(s => s.value === game.status);

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl overflow-hidden border border-white border-opacity-20 hover:border-purple-500 transition group">
      {game.coverImage && (
        <div className="w-full h-48 overflow-hidden bg-slate-800">
          <img 
            src={game.coverImage} 
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition break-words pr-2">
            {game.name}
          </h3>
          <div className="flex gap-2 flex-shrink-0">
            <button 
              onClick={() => onEdit(game)} 
              className="text-blue-400 hover:text-blue-300"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(game.id)} 
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-300 text-sm flex-wrap">
            <span className={`${statusInfo.color} px-2 py-1 rounded text-white text-xs`}>
              {statusInfo.label}
            </span>
            <span className="bg-gray-700 px-2 py-1 rounded text-xs">{game.platform}</span>
          </div>
          
          <div className="flex items-center gap-1 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < game.rating ? 'fill-yellow-400' : ''}`} />
            ))}
            <span className="text-white ml-2 text-sm">{game.rating}/5</span>
          </div>
          
          {game.hoursPlayed && (
            <div className="text-gray-300 text-sm flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {game.hoursPlayed}h jogadas
            </div>
          )}
          
          {game.dateFinished && (
            <div className="text-gray-300 text-sm">
              Finalizado: {new Date(game.dateFinished).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>
        
        {game.tags && game.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {game.tags.map(tag => (
              <span key={tag} className="bg-purple-600 bg-opacity-50 text-purple-200 px-2 py-1 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {game.notes && (
          <p className="text-gray-400 text-sm italic line-clamp-2">"{game.notes}"</p>
        )}
      </div>
    </div>
  );
};

export default GameCard;