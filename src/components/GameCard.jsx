import React, { useState } from 'react';
import { Star, Calendar, Edit2, Trash2, Trophy, MessageCircle } from 'lucide-react';
import { STATUSES } from '../data/constants';

const GameCard = ({ game, onEdit, onDelete }) => {
  const [showNotes, setShowNotes] = useState(false);
  const statusInfo = STATUSES.find(s => s.value === game.status);

  return (
    <div
      className="surface overflow-hidden flex flex-col active:border-slate-700 transition-colors cursor-pointer"
      onClick={() => onEdit(game)}
    >
      <div className="relative">
        {game.coverImage ? (
          <div className="w-full aspect-[4/3] overflow-hidden bg-slate-800">
            <img
              src={game.coverImage}
              alt={game.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        ) : (
          <div className="w-full aspect-[4/3] bg-slate-800 flex items-center justify-center text-4xl">
            🎮
          </div>
        )}

        {game.platinado && (
          <div className="absolute top-2 left-2 bg-amber-500 text-black px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow">
            <Trophy className="w-3.5 h-3.5" />
            100%
          </div>
        )}

        <div className="absolute top-2 right-2 flex gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(game); }}
            className="bg-slate-950/70 hover:bg-slate-800 text-white p-1.5 rounded-lg backdrop-blur-sm transition"
            aria-label="Editar"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(game.id); }}
            className="bg-slate-950/70 hover:bg-red-600 text-white p-1.5 rounded-lg backdrop-blur-sm transition"
            aria-label="Excluir"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-white break-words mb-2 line-clamp-2">
          {game.name}
        </h3>

        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          <span className={`badge ${statusInfo.color}`}>{statusInfo.label}</span>
          <span className="badge bg-slate-800 text-slate-300 border border-slate-700">{game.platform}</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < game.rating ? 'fill-amber-400' : 'text-slate-700'}`} />
            ))}
          </div>
          {game.dateFinished && (
            <div className="flex items-center gap-1 text-slate-500 text-[11px]">
              <Calendar className="w-3 h-3" />
              {new Date(game.dateFinished).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
            </div>
          )}
        </div>

        {game.notes && game.notes.trim() && (
          <div className="mt-2 pt-2 border-t border-slate-800">
            <button
              onClick={(e) => { e.stopPropagation(); setShowNotes(!showNotes); }}
              className="flex items-center gap-1.5 text-violet-400 active:text-violet-300 text-xs font-medium transition w-full"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {showNotes ? 'Esconder comentário' : 'Ver comentário'}
            </button>
            {showNotes && (
              <p className="mt-2 p-2.5 bg-slate-950/60 rounded-lg text-slate-300 text-xs whitespace-pre-wrap break-words">
                {game.notes}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;
