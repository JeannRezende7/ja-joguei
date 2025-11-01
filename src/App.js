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
    platinado: false,
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
      platinado: false,
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
  
  const playingNow = games.filter(g => g.status === 'playing').slice(0, 3);
  const platinadosGames = games.filter(g => g.platinado).slice(0, 10);

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

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Estatísticas principais */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            📈 Suas Estatísticas
          </h2>
          <StatsCards stats={stats} games={games} />
        </section>

        {/* Adicionar Jogo */}
        <section>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={loading}
            className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 text-lg"
          >
            <Plus className="w-6 h-6" /> {loading ? 'Aguarde...' : 'Adicionar Novo Jogo'}
          </button>
        </section>

        {/* Jogando Agora */}
        {playingNow.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
              🔥 Jogando Agora
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {playingNow.map(game => (
                <div
                  key={game.id}
                  className="group relative bg-white bg-opacity-10 backdrop-blur-md rounded-2xl overflow-hidden border border-white border-opacity-20 hover:border-purple-500 transition-all hover:scale-105 cursor-pointer"
                  onClick={() => startEdit(game)}
                >
                  {game.coverImage ? (
                    <div className="w-full h-80 overflow-hidden bg-slate-800">
                      <img 
                        src={game.coverImage} 
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-80 bg-slate-800 flex items-center justify-center text-6xl">
                      🎮
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="bg-blue-500 px-3 py-1 rounded">Jogando</span>
                      <span>{game.platform}</span>
                      {game.platinado && <span className="bg-yellow-500 text-black px-2 py-1 rounded font-bold">🏆 Platinado</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Jogos Platinados */}
        {platinadosGames.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
              🏆 Jogos Platinados
            </h2>
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                {platinadosGames.map((game, index) => (
                  <div
                    key={game.id}
                    className="flex-shrink-0 w-48 group cursor-pointer"
                    onClick={() => startEdit(game)}
                  >
                    <div className="relative">
                      {game.coverImage ? (
                        <img 
                          src={game.coverImage} 
                          alt={game.name}
                          className="w-full h-72 object-cover rounded-lg group-hover:scale-105 transition"
                          onError={(e) => e.target.src = ''}
                        />
                      ) : (
                        <div className="w-full h-72 bg-slate-800 rounded-lg flex items-center justify-center text-5xl">
                          🎮
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-yellow-500 text-black font-bold w-10 h-10 rounded-full flex items-center justify-center text-xl">
                        🏆
                      </div>
                    </div>
                    <div className="mt-2">
                      <h4 className="text-white font-semibold truncate">{game.name}</h4>
                      <p className="text-purple-300 text-sm">100% Completo</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Filtros e Todos os Jogos */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            📚 Todos os Jogos ({filteredGamesList.length})
          </h2>
          
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onStatusChange={setFilterStatus}
            filterPlatform={filterPlatform}
            onPlatformChange={setFilterPlatform}
          />

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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
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
        </section>
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
