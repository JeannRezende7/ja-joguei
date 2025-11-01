import React from 'react';
import { Search } from 'lucide-react';
import { PLATFORMS, STATUSES } from '../data/constants';

const FilterBar = ({ 
  searchTerm, 
  onSearchChange, 
  filterStatus, 
  onStatusChange, 
  filterPlatform, 
  onPlatformChange,
  themeData 
}) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 mb-6 border border-white border-opacity-20">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar jogos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-400 outline-none transition"
            style={{
              '--focus-ring': themeData?.primary
            }}
            onFocus={(e) => e.target.style.borderColor = themeData?.primary}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white outline-none transition"
          style={{ colorScheme: 'dark' }}
          onFocus={(e) => e.target.style.borderColor = themeData?.primary}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
        >
          <option value="all" className="bg-gray-800 text-white">Todos Status</option>
          {STATUSES.map(s => (
            <option key={s.value} value={s.value} className="bg-gray-800 text-white">
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={filterPlatform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white outline-none transition"
          style={{ colorScheme: 'dark' }}
          onFocus={(e) => e.target.style.borderColor = themeData?.primary}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
        >
          <option value="all" className="bg-gray-800 text-white">Todas Plataformas</option>
          {PLATFORMS.map(p => (
            <option key={p} value={p} className="bg-gray-800 text-white">
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;