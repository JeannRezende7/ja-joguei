import React from 'react';
import { Star, Gamepad2, Trophy } from 'lucide-react';

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

    return { percentage, angle, startAngle, color };
  };

  const pieData = Object.entries(platformDistribution).map(([platform, count]) => ({
    platform,
    count,
    ...createPieSlice(count, platformColors[platform] || platformColors['Outro'])
  }));

  const platinadosCount = games.filter(g => g.platinado).length;

  const tiles = [
    { label: 'Total', value: stats.total, sub: 'na biblioteca', color: 'text-white' },
    { label: 'Completos', value: stats.completed, sub: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`, color: 'text-emerald-400' },
    { label: 'Jogando', value: stats.playing, sub: 'ativos agora', color: 'text-blue-400' },
    { label: 'Nota média', value: stats.avgRating, sub: '/ 5', color: 'text-amber-400', icon: <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline ml-1" /> },
    { label: 'Platinados', value: platinadosCount, sub: `${stats.total > 0 ? Math.round((platinadosCount / stats.total) * 100) : 0}%`, color: 'text-amber-400', icon: <Trophy className="w-3.5 h-3.5 inline ml-1" /> },
    { label: 'Backlog', value: games.filter(g => g.status === 'backlog').length, sub: 'esperando', color: 'text-orange-400' },
  ];

  return (
    <div className="grid lg:grid-cols-5 gap-4">
      <div className="lg:col-span-3 grid grid-cols-3 gap-3">
        {tiles.map((tile) => (
          <div key={tile.label} className="surface p-3">
            <div className="text-slate-400 text-[11px] font-medium mb-1 truncate">{tile.label}</div>
            <div className={`text-xl sm:text-2xl font-bold ${tile.color} flex items-center`}>
              {tile.value}{tile.icon}
            </div>
            <div className="text-slate-500 text-[10px] mt-0.5">{tile.sub}</div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-2 surface p-4">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
          <Gamepad2 className="w-4 h-4 text-violet-400" />
          Por Plataforma
        </h3>

        {total > 0 ? (
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 flex-shrink-0">
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
                      stroke="#0f172a"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{total}</div>
                  <div className="text-[9px] text-slate-400">jogos</div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-1.5 min-w-0">
              {pieData.map((slice, index) => (
                <div key={index} className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
                    <span className="text-slate-300 truncate">{slice.platform}</span>
                  </div>
                  <div className="text-slate-500 flex-shrink-0">
                    {slice.count} ({Math.round(slice.percentage)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-sm">
            Adicione jogos para ver a distribuição
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCards;
