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
import { useAuth } from './hooks/useAuth';
import { addGame, updateGame, deleteGame, getGames, logout } from './services/firebase';
import { detectPlatform, mapGenresToTags, calculateStats, filterGames } from './utils/gameUtils';

const JaJoguei = () => {
  const { user, loading: authLoading } = useAuth();
  const [games, setGames] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [loading, setLoading] = useState(false);
  
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

  // Carregar jogos do Firebase quando usuário logar
  useEffect(() => {
    const loadGames = async () => {
      if (user) {
        console.log('Carregando jogos do usuário:', user.uid);
        setLoading(true);
        try {
          const userGames = await getGames(user.uid);
          console.log('Jogos carregados:', userGames.length);
          setGames(userGames);
        } catch (error) {
          console.error('Erro ao carregar jogos:', error);
          alert('Erro ao carregar seus jogos');
        } finally {
          setLoading(false);
        }
      } else {
        console.log('Usuário não logado');
        setGames([]);
      }
    };

    loadGames();
  }, [user]);

  const handleLogin = (newUser) => {
    // O useAuth já gerencia o estado do usuário
  };

  const handleLogout = async () => {
    try {
      await logout();
      setGames([]);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
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

  const handleAddGame = async () => {
    if (!formData.name.trim()) {
      alert('Por favor, preencha o nome do jogo');
      return;
    }
    
    console.log('Adicionando jogo para usuário:', user.uid);
    setLoading(true);
    try {
      const newGame = await addGame(user.uid, formData);
      console.log('Jogo adicionado com ID:', newGame.id);
      setGames([newGame, ...games]);
      setShowAddModal(false);
      resetForm();
      alert('✅ Jogo adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar jogo:', error);
      alert('Erro ao adicionar jogo. Tente novamente');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGame = async () => {
    if (!formData.name.trim()) {
      alert('Por favor, preencha o nome do jogo');
      return;
    }
    
    setLoading(true);
    try {
      await updateGame(user.uid, editingGame.id, formData);
      const updatedGames = games.map(g => 
        g.id === editingGame.id ? { ...formData, id: g.id } : g
      );
      setGames(updatedGames);
      setEditingGame(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao atualizar jogo:', error);
      alert('Erro ao atualizar jogo. Tente novamente');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGame = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este jogo?')) {
      setLoading(true);
      try {
        await deleteGame(user.uid, id);
        setGames(games.filter(g => g.id !== id));
      } catch (error) {
        console.error('Erro ao deletar jogo:', error);
        alert('Erro ao deletar jogo. Tente novamente');
      } finally {
        setLoading(false);
      }
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Carregando...</div>
      </div>
    );
  }

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
          disabled={loading}
          className="mb-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-lg disabled:opacity-50"
        >
          <Plus className="w-5 h-5" /> {loading ? 'Aguarde...' : 'Adicionar Jogo'}
        </button>

        {loading && !showAddModal && !editingGame ? (
          <div className="text-center py-16">
            <div className="text-white text-xl">Carregando jogos...</div>
          </div>
        ) : filteredGamesList.length === 0 ? (
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
    </div>
  );
};

export default JaJoguei;