import React from 'react';
import { Star, Gamepad2 } from 'lucide-react';

const StatsCards = ({ stats, games }) => {
  // Calcular distribuição por plataforma
  const platformDistribution = games.reduce((acc, game) => {
    acc[game.platform] = (acc[game.platform] || 0) + 1;
    return acc;
  }, {});

  const platformColors = {
    'PC': '#8b5cf6',
    'PlayStation': '#3b82f6',
    'Xbox': '#10b981',
    'Nintendo Switch': '#ef4444',
    'Mobile': '#f59e0b',
    'Outro': '#6b7280'
  };

  const total = Object.values(platformDistribution).reduce((a, b) => a + b, 0);
  let currentAngle = 0;

  const createPieSlice = (value, color) => {
    const percentage = (value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      percentage,
      angle,
      startAngle,
      color
    };
  };

  const pieData = Object.entries(platformDistribution).map(([platform, count]) => ({
    platform,
    count,
    ...createPieSlice(count, platformColors[platform] || platformColors['Outro'])
  }));

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Cards de estatísticas */}
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-15 transition">
          <div className="text-purple-300 text-sm mb-2 font-semibold">Total de Jogos</div>
          <div className="text-4xl font-bold text-white">{stats.total}</div>
          <div className="text-gray-400 text-xs mt-1">Na biblioteca</div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-15 transition">
          <div className="text-green-300 text-sm mb-2 font-semibold">Completados</div>
          <div className="text-4xl font-bold text-white">{stats.completed}</div>
          <div className="text-gray-400 text-xs mt-1">
            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% do total
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-15 transition">
          <div className="text-blue-300 text-sm mb-2 font-semibold">Jogando</div>
          <div className="text-4xl font-bold text-white">{stats.playing}</div>
          <div className="text-gray-400 text-xs mt-1">Ativos agora</div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-15 transition">
          <div className="text-yellow-300 text-sm mb-2 font-semibold">Nota Média</div>
          <div className="text-4xl font-bold text-white flex items-center gap-1">
            {stats.avgRating}
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          </div>
          <div className="text-gray-400 text-xs mt-1">De 5 estrelas</div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-15 transition md:col-span-2">
          <div className="text-pink-300 text-sm mb-2 font-semibold">Horas Totais</div>
          <div className="text-4xl font-bold text-white">{stats.totalHours}h</div>
          <div className="text-gray-400 text-xs mt-1">
            {stats.totalHours >= 24 ? `${Math.floor(stats.totalHours / 24)} dias jogados` : 'Continue jogando!'}
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-20 hover:bg-opacity-15 transition md:col-span-2">
          <div className="text-orange-300 text-sm mb-2 font-semibold">Backlog</div>
          <div className="text-4xl font-bold text-white">
            {games.filter(g => g.status === 'backlog').length}
          </div>
          <div className="text-gray-400 text-xs mt-1">Jogos esperando</div>
        </div>
      </div>

      {/* Gráfico de Pizza - Distribuição por Plataforma */}
      <div className="lg:col-span-2 bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-20">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Gamepad2 className="w-5 h-5" />
          Por Plataforma
        </h3>
        
        {total > 0 ? (
          <div className="flex items-center gap-6">
            {/* Pizza Chart */}
            <div className="relative w-40 h-40 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {pieData.map((slice, index) => {
                  const x1 = 50 + 48 * Math.cos((slice.startAngle * Math.PI) / 180);
                  const y1 = 50 + 48 * Math.sin((slice.startAngle * Math.PI) / 180);
                  const x2 = 50 + 48 * Math.cos(((slice.startAngle + slice.angle) * Math.PI) / 180);
                  const y2 = 50 + 48 * Math.sin(((slice.startAngle + slice.angle) * Math.PI) / 180);
                  const largeArc = slice.angle > 180 ? 1 : 0;

                  return (
                    <path
                      key={index}
                      d={`M 50 50 L ${x1} ${y1} A 48 48 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={slice.color}
                      stroke="rgba(0,0,0,0.3)"
                      strokeWidth="0.5"
                      className="hover:opacity-80 transition-opacity"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{total}</div>
                  <div className="text-xs text-gray-300">jogos</div>
                </div>
              </div>
            </div>

            {/* Legenda */}
            <div className="flex-1 space-y-2">
              {pieData.map((slice, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="text-white text-xs">{slice.platform}</span>
                  </div>
                  <div className="text-gray-300 text-xs font-semibold">
                    {slice.count} ({Math.round(slice.percentage)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            Adicione jogos para ver a distribuição
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCards;