import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { PLATFORMS, STATUSES } from '../data/constants';

const FilterBar = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterPlatform,
  onPlatformChange
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const activeFilterCount = (filterStatus !== 'all' ? 1 : 0) + (filterPlatform !== 'all' ? 1 : 0);

  return (
    <div className="mb-5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar jogos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className={`relative shrink-0 px-3.5 rounded-lg border transition ${
            activeFilterCount > 0
              ? 'bg-violet-600/15 border-violet-500/40 text-violet-300'
              : 'bg-slate-800/70 border-slate-700 text-slate-300'
          }`}
          aria-label="Filtros"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-violet-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowFilters(false)} />
          <div className="relative surface-raised w-full sm:max-w-sm rounded-b-none sm:rounded-b-2xl p-5 animate-slideUp sm:animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Filtros</h3>
              <button onClick={() => setShowFilters(false)} className="text-slate-400 active:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wide">Status</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onStatusChange('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterStatus === 'all' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300'}`}
                  >
                    Todos
                  </button>
                  {STATUSES.map(s => (
                    <button
                      key={s.value}
                      onClick={() => onStatusChange(s.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterStatus === s.value ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wide">Plataforma</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onPlatformChange('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterPlatform === 'all' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300'}`}
                  >
                    Todas
                  </button>
                  {PLATFORMS.map(p => (
                    <button
                      key={p}
                      onClick={() => onPlatformChange(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterPlatform === p ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(false)}
              className="btn-primary w-full py-2.5 mt-5 text-sm"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
