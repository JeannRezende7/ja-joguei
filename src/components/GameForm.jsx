import React from 'react';
import { Star, X, Image as ImageIcon, Trophy, Calendar } from 'lucide-react';
import { PLATFORMS, STATUSES, TAG_OPTIONS } from '../data/constants';

const GameForm = ({ formData, onChange, onToggleTag }) => {
  const handleDateChange = (value) => {
    onChange({ ...formData, dateFinished: value });
  };

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
            <label className="block text-white mb-2 font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Data de Finalização
            </label>
            <div className="space-y-2">
              <input
                type="date"
                value={formData.dateFinished || ''}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <button
                type="button"
                onClick={() => handleDateChange('')}
                className={`w-full py-2 px-3 rounded-lg text-sm transition ${
                  formData.dateFinished === '' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                🤷 Não Lembro
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-1">
              Se não lembra, deixe em branco ou clique em "Não Lembro"
            </p>
          </div>

          <div>
            <label className="block text-white mb-2 font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Platinado / 100% Completo
            </label>
            <label className="flex items-center gap-3 p-3 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-600 transition">
              <input
                type="checkbox"
                checked={formData.platinado || false}
                onChange={(e) => onChange({ ...formData, platinado: e.target.checked })}
                className="w-6 h-6 accent-yellow-500 cursor-pointer"
              />
              <span className="text-white font-semibold">
                {formData.platinado ? '🏆 Platinado!' : 'Marcar como platinado'}
              </span>
            </label>
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
          <label className="block text-white mb-2 font-semibold">
            📝 Notas/Comentários
            <span className="text-gray-400 text-sm ml-2">(opcional)</span>
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => onChange({ ...formData, notes: e.target.value })}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            rows="4"
            placeholder="Suas impressões sobre o jogo... (opcional, mas será exibido na tela inicial)"
          />
          <p className="text-blue-300 text-xs mt-1">
            💡 Suas notas aparecerão nos cards dos jogos na tela inicial!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameForm;