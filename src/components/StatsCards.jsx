import React from 'react';
import { Star } from 'lucide-react';

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20">
        <div className="text-purple-300 text-sm mb-1">Total</div>
        <div className="text-3xl font-bold text-white">{stats.total}</div>
      </div>
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20">
        <div className="text-green-300 text-sm mb-1">Completados</div>
        <div className="text-3xl font-bold text-white">{stats.completed}</div>
      </div>
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20">
        <div className="text-blue-300 text-sm mb-1">Jogando</div>
        <div className="text-3xl font-bold text-white">{stats.playing}</div>
      </div>
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20">
        <div className="text-yellow-300 text-sm mb-1">Média</div>
        <div className="text-3xl font-bold text-white flex items-center gap-1">
          {stats.avgRating} <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        </div>
      </div>
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20">
        <div className="text-pink-300 text-sm mb-1">Horas</div>
        <div className="text-3xl font-bold text-white">{stats.totalHours}h</div>
      </div>
    </div>
  );
};

export default StatsCards;