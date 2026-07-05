import React from 'react';
import { Star, X, Image as ImageIcon, Trophy, Calendar } from 'lucide-react';
import { PLATFORMS, STATUSES, TAG_OPTIONS } from '../data/constants';

const GameForm = ({ formData, onChange, onToggleTag }) => {
  const handleDateChange = (value) => {
    onChange({ ...formData, dateFinished: value });
  };

  return (
    <div className="surface p-4">
      <div className="flex items-center gap-2 text-blue-400 mb-3 text-sm">
        <ImageIcon className="w-4 h-4" />
        <span className="font-semibold">Passo 2: Confirme ou edite as informações</span>
      </div>

      {formData.coverImage && (
        <div className="mb-4">
          <div className="relative group">
            <img
              src={formData.coverImage}
              alt="Capa"
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <button
              type="button"
              onClick={() => onChange({ ...formData, coverImage: '' })}
              className="absolute top-2 right-2 bg-red-600/90 text-white p-2 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 bg-emerald-600 text-white px-2.5 py-1 rounded-md text-xs">
              ✓ Imagem carregada
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-slate-300 mb-1.5 text-sm font-medium">Nome do Jogo *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange({ ...formData, name: e.target.value })}
            className="input-field"
            placeholder="Ex: The Legend of Zelda"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1.5 text-sm font-medium">
            URL da Capa <span className="text-slate-500 font-normal">(opcional, ou busque acima)</span>
          </label>
          <input
            type="url"
            value={formData.coverImage}
            onChange={(e) => onChange({ ...formData, coverImage: e.target.value })}
            className="input-field"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 mb-1.5 text-sm font-medium">Plataforma</label>
            <select
              value={formData.platform}
              onChange={(e) => onChange({ ...formData, platform: e.target.value })}
              className="input-field"
              style={{ colorScheme: 'dark' }}
            >
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1.5 text-sm font-medium">Status</label>
            <select
              value={formData.status}
              onChange={(e) => onChange({ ...formData, status: e.target.value })}
              className="input-field"
              style={{ colorScheme: 'dark' }}
            >
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 mb-1.5 text-sm font-medium">Avaliação: {formData.rating}/5</label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() => onChange({ ...formData, rating })}
                className="transition active:scale-90"
              >
                <Star className={`w-7 h-7 ${rating <= formData.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 mb-1.5 text-sm font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Data de Finalização
            </label>
            <div className="space-y-2">
              <input
                type="date"
                value={formData.dateFinished || ''}
                onChange={(e) => handleDateChange(e.target.value)}
                className="input-field"
                style={{ colorScheme: 'dark' }}
              />
              <button
                type="button"
                onClick={() => handleDateChange('')}
                className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition ${
                  formData.dateFinished === ''
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-300 active:bg-slate-700'
                }`}
              >
                🤷 Não Lembro
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1.5 text-sm font-medium flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              Platinado / 100%
            </label>
            <label className="flex items-center gap-3 p-3 bg-slate-800/70 border border-slate-700 rounded-lg cursor-pointer active:bg-slate-800 transition h-[46px]">
              <input
                type="checkbox"
                checked={formData.platinado || false}
                onChange={(e) => onChange({ ...formData, platinado: e.target.checked })}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
              <span className="text-white text-sm font-medium">
                {formData.platinado ? '🏆 Platinado!' : 'Marcar como platinado'}
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 mb-1.5 text-sm font-medium">Tags/Gêneros</label>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  formData.tags.includes(tag)
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-300 active:bg-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-slate-300 mb-1.5 text-sm font-medium">
            Notas/Comentários <span className="text-slate-500 font-normal">(opcional)</span>
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => onChange({ ...formData, notes: e.target.value })}
            className="input-field resize-none"
            rows="4"
            placeholder="Suas impressões sobre o jogo..."
          />
          <p className="text-blue-400 text-xs mt-1.5">
            💡 Suas notas aparecem no card do jogo na tela inicial
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameForm;
