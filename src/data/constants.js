export const PLATFORMS = [
  'PC', 
  'PlayStation', 
  'Xbox', 
  'Nintendo Switch', 
  'Mobile', 
  'Outro'
];

export const STATUSES = [
  { value: 'completed', label: 'Completo', color: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' },
  { value: 'playing', label: 'Jogando', color: 'bg-blue-500/15 text-blue-400 border border-blue-500/20' },
  { value: 'dropped', label: 'Abandonado', color: 'bg-red-500/15 text-red-400 border border-red-500/20' },
  { value: 'backlog', label: 'Backlog', color: 'bg-slate-500/15 text-slate-400 border border-slate-500/20' }
];

export const TAG_OPTIONS = [
  'RPG', 
  'Ação', 
  'Aventura', 
  'Estratégia', 
  'Indie', 
  'Multiplayer', 
  'História', 
  'Souls-like'
];

export const PLATFORM_MAP = {
  'PC': 'PC',
  'PlayStation': 'PlayStation',
  'PlayStation 5': 'PlayStation',
  'PlayStation 4': 'PlayStation',
  'PlayStation 3': 'PlayStation',
  'Xbox': 'Xbox',
  'Xbox Series S/X': 'Xbox',
  'Xbox One': 'Xbox',
  'Xbox 360': 'Xbox',
  'Nintendo Switch': 'Nintendo Switch',
  'iOS': 'Mobile',
  'Android': 'Mobile',
  'Linux': 'PC',
  'macOS': 'PC'
};

export const GENRE_MAP = {
  'RPG': 'RPG',
  'Role-playing (RPG)': 'RPG',
  'Action': 'Ação',
  'Adventure': 'Aventura',
  'Strategy': 'Estratégia',
  'Indie': 'Indie',
  'Massively Multiplayer': 'Multiplayer',
  'Shooter': 'Ação',
  'Platformer': 'Aventura'
};