import React from 'react';
import { Search } from 'lucide-react';
import { PLATFORMS, STATUSES } from '../data/constants';

const FilterBar = ({ searchTerm, onSearchChange, filterStatus, onStatusChange, filterPlatform, onPlatformChange }) => {
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
            className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="all">Todos Status</option>
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select
          value={filterPlatform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="all">Todas Plataformas</option>
          {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;