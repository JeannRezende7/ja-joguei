import React from 'react';
import { Star, X, Image as ImageIcon } from 'lucide-react';
import { PLATFORMS, STATUSES, TAG_OPTIONS } from '../data/constants';

const GameForm = ({ formData, onChange, onToggleTag }) => {
  return (
    <div className="bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg p-4">
      <div className="flex items-center gap-2 text-blue-300 mb-3">
        <ImageIcon className="w-5 h-5" />
        <span className="font-semibold">Passo 2: Confirme ou edite as informações</span>
      </div>

      {formData.coverImage && (
        <div className="mb-4">
          <div className="relative group">
            <img 
              src={formData.coverImage} 
              alt="Capa"
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => onChange({ ...formData, coverImage: '' })}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 bg-green-600 text-white px-3 py-1 rounded text-sm">
              ✓ Imagem carregada
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-white mb-2 font-semibold">Nome do Jogo *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange({ ...formData, name: e.target.value })}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Ex: The Legend of Zelda"
          />
        </div>

        <div>
          <label className="block text-white mb-2 font-semibold">
            URL da Capa (opcional)
            <span className="text-gray-400 text-sm ml-2">ou busque acima</span>
          </label>
          <input
            type="url"
            value={formData.coverImage}
            onChange={(e) => onChange({ ...formData, coverImage: e.target.value })}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2 font-semibold">Plataforma</label>
            <select
              value={formData.platform}
              onChange={(e) => onChange({ ...formData, platform: e.target.value })}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-white mb-2 font-semibold">Status</label>
            <select
              value={formData.status}
              onChange={(e) => onChange({ ...formData, status: e.target.value })}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-white mb-2 font-semibold">Avaliação: {formData.rating}/5</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() => onChange({ ...formData, rating })}
                className="transition hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${rating <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2 font-semibold">Data de Finalização</label>
            <input
              type="date"
              value={formData.dateFinished}
              onChange={(e) => onChange({ ...formData, dateFinished: e.target.value })}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-white mb-2 font-semibold">Horas Jogadas</label>
            <input
              type="number"
              value={formData.hoursPlayed}
              onChange={(e) => onChange({ ...formData, hoursPlayed: e.target.value })}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Ex: 50"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-white mb-2 font-semibold">Tags/Gêneros</label>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleTag(tag)}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  formData.tags.includes(tag)
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-white mb-2 font-semibold">Notas/Comentários</label>
          <textarea
            value={formData.notes}
            onChange={(e) => onChange({ ...formData, notes: e.target.value })}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            rows="3"
            placeholder="Suas impressões sobre o jogo..."
          />
        </div>
      </div>
    </div>
  );
};

export default GameForm;