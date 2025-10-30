export const PLATFORMS = [
  'PC', 
  'PlayStation', 
  'Xbox', 
  'Nintendo Switch', 
  'Mobile', 
  'Outro'
];

export const STATUSES = [
  { value: 'completed', label: 'Completado', color: 'bg-green-500' },
  { value: 'playing', label: 'Jogando', color: 'bg-blue-500' },
  { value: 'dropped', label: 'Abandonado', color: 'bg-red-500' },
  { value: 'backlog', label: 'Backlog', color: 'bg-gray-500' }
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