import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import LoginScreen from './components/LoginScreen';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import FilterBar from './components/FilterBar';
import GameCard from './components/GameCard';
import GameModal from './components/GameModal';
import ExportModal from './components/ExportModal';
import { useGameSearch } from './hooks/useGameSearch';
import { detectPlatform, mapGenresToTags, calculateStats, filterGames } from './utils/gameUtils';

const JaJoguei = () => {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    platform: 'PC',
    rating: 5,
    status: 'completed',
    dateFinished: new Date().toISOString().split('T')[0],
    hoursPlayed: '',
    notes: '',
    tags: [],
    coverImage: ''
  });

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    showResults,
    setShowResults
  } = useGameSearch();

  // Carregar usuário salvo
  useEffect(() => {
    const savedUser = localStorage.getItem('jaJogueiUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Carregar jogos do usuário
  useEffect(() => {
    if (user) {
      const savedGames = localStorage.getItem('jaJogueiGames');
      if (savedGames) {
        setGames(JSON.parse(savedGames));
      }
    }
  }, [user]);

  const handleLogin = (newUser) => {
    setUser(newUser);
    localStorage.setItem('jaJogueiUser', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    setGames([]);
    localStorage.removeItem('jaJogueiUser');
    localStorage.removeItem('jaJogueiGames');
  };

  const saveGames = (newGames) => {
    setGames(newGames);
    localStorage.setItem('jaJogueiGames', JSON.stringify(newGames));
  };

  const handleSelectGameFromAPI = (game) => {
    const detectedPlatform = detectPlatform(game.platforms);
    const apiTags = mapGenresToTags(game.genres);
    
    const coverImage = game.background_image || 
                      (game.short_screenshots && game.short_screenshots[0]?.image) || 
                      '';

    setFormData({
      ...formData,
      name: game.name,
      coverImage,
      platform: detectedPlatform,
      tags: [...new Set([...apiTags])].slice(0, 5),
      rating: game.rating ? Math.round(game.rating) : 5
    });
    
    setSearchQuery(game.name);
    setShowResults(false);
  };

  const handleAddGame = () => {
    if (!formData.name.trim()) {
      alert('Por favor, preencha o nome do jogo');
      return;
    }
    const newGame = {
      ...formData,
      id: Date.now().toString(),
      userId: user.uid,
      createdAt: new Date().toISOString()
    };
    saveGames([...games, newGame]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditGame = () => {
    if (!formData.name.trim()) {
      alert('Por favor, preencha o nome do jogo');
      return;
    }
    const updatedGames = games.map(g => 
      g.id === editingGame.id 
        ? { ...formData, id: g.id, userId: g.userId, createdAt: g.createdAt } 
        : g
    );
    saveGames(updatedGames);
    setEditingGame(null);
    resetForm();
  };

  const handleDeleteGame = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este jogo?')) {
      saveGames(games.filter(g => g.id !== id));
    }
  };

  const startEdit = (game) => {
    setEditingGame(game);
    setFormData(game);
    setSearchQuery(game.name);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      platform: 'PC',
      rating: 5,
      status: 'completed',
      dateFinished: new Date().toISOString().split('T')[0],
      hoursPlayed: '',
      notes: '',
      tags: [],
      coverImage: ''
    });
    setSearchQuery('');
    setShowResults(false);
  };

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const filteredGamesList = filterGames(games, searchTerm, filterStatus, filterPlatform);
  const stats = calculateStats(games);

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header 
        user={user} 
        onLogout={handleLogout}
        onExport={() => setShowExportModal(true)}
      />

      <div className="container mx-auto px-4 py-8">
        <StatsCards stats={stats} />

        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          filterPlatform={filterPlatform}
          onPlatformChange={setFilterPlatform}
        />

        <button
          onClick={() => setShowAddModal(true)}
          className="mb-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" /> Adicionar Jogo
        </button>

        {filteredGamesList.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">
              {games.length === 0 
                ? 'Nenhum jogo adicionado ainda. Comece agora!' 
                : 'Nenhum jogo encontrado com os filtros aplicados.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGamesList.map(game => (
              <GameCard
                key={game.id}
                game={game}
                onEdit={startEdit}
                onDelete={handleDeleteGame}
              />
            ))}
          </div>
        )}
      </div>

      {(showAddModal || editingGame) && (
        <GameModal
          isEditing={!!editingGame}
          formData={formData}
          searchQuery={searchQuery}
          searchResults={searchResults}
          isSearching={isSearching}
          showSearchResults={showResults}
          onSearchChange={setSearchQuery}
          onSelectGame={handleSelectGameFromAPI}
          onFormChange={setFormData}
          onToggleTag={toggleTag}
          onSave={editingGame ? handleEditGame : handleAddGame}
          onCancel={() => {
            setShowAddModal(false);
            setEditingGame(null);
            resetForm();
          }}
        />
      )}

      {showExportModal && (
        <ExportModal
          games={games}
          onClose={() => setShowExportModal(false)}
        />
      )}
      {showExportModal && (
        <ExportModal
          games={games}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};

export default JaJoguei;