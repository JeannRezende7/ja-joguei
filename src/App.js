import React, { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import LoginScreen from './components/LoginScreen';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
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

  const libraryRef = useRef(null);

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
        setLoading(true);
        try {
          const userGames = await getGames(user.uid);
          setGames(userGames);
        } catch (error) {
          console.error('Erro ao carregar jogos:', error);
          alert('Erro ao carregar seus jogos');
        } finally {
          setLoading(false);
        }
      } else {
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

    setLoading(true);
    try {
      const newGame = await addGame(user.uid, formData);
      setGames([newGame, ...games]);
      setShowAddModal(false);
      resetForm();
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

  const scrollToLibrary = () => {
    libraryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredGamesList = filterGames(games, searchTerm, filterStatus, filterPlatform);
  const stats = calculateStats(games);

  const playingNow = games.filter(g => g.status === 'playing').slice(0, 3);
  const platinadosGames = games.filter(g => g.platinado).slice(0, 10);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header
        user={user}
        onLogout={handleLogout}
        onExport={() => setShowExportModal(true)}
      />

      <div className="container mx-auto px-4 py-6 space-y-8 pb-28 md:pb-10">
        {/* Estatísticas principais */}
        <section>
          <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4">
            Suas Estatísticas
          </h2>
          <StatsCards stats={stats} games={games} />
        </section>

        {/* Adicionar Jogo (desktop - no mobile usa o botão flutuante) */}
        <section className="hidden md:block">
          <button
            onClick={() => setShowAddModal(true)}
            disabled={loading}
            className="btn-primary px-6 py-3 flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-5 h-5" /> {loading ? 'Aguarde...' : 'Adicionar Novo Jogo'}
          </button>
        </section>

        {/* Jogando Agora */}
        {playingNow.length > 0 && (
          <section>
            <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4">
              🔥 Jogando Agora
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {playingNow.map(game => (
                <div
                  key={game.id}
                  className="surface overflow-hidden cursor-pointer active:border-slate-700 transition-colors"
                  onClick={() => startEdit(game)}
                >
                  {game.coverImage ? (
                    <div className="w-full aspect-[3/4] md:aspect-[4/3] overflow-hidden bg-slate-800">
                      <img
                        src={game.coverImage}
                        alt={game.name}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[3/4] md:aspect-[4/3] bg-slate-800 flex items-center justify-center text-4xl">
                      🎮
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="text-sm md:text-base font-semibold text-white line-clamp-2 mb-1.5">{game.name}</h3>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="badge bg-blue-500/15 text-blue-400 border border-blue-500/20">Jogando</span>
                      <span className="badge bg-slate-800 text-slate-300 border border-slate-700">{game.platform}</span>
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
            <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4">
              🏆 Jogos Platinados
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin -mx-4 px-4 md:mx-0 md:px-0">
              {platinadosGames.map((game) => (
                <div
                  key={game.id}
                  className="flex-shrink-0 w-32 md:w-40 cursor-pointer"
                  onClick={() => startEdit(game)}
                >
                  <div className="relative">
                    {game.coverImage ? (
                      <img
                        src={game.coverImage}
                        alt={game.name}
                        className="w-full aspect-[3/4] object-cover rounded-lg"
                        onError={(e) => e.target.src = ''}
                      />
                    ) : (
                      <div className="w-full aspect-[3/4] bg-slate-800 rounded-lg flex items-center justify-center text-3xl">
                        🎮
                      </div>
                    )}
                    <div className="absolute top-1.5 right-1.5 bg-amber-500 text-black font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      🏆
                    </div>
                  </div>
                  <div className="mt-1.5">
                    <h4 className="text-white text-xs font-medium truncate">{game.name}</h4>
                    <p className="text-slate-500 text-[11px]">100% completo</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Filtros e Todos os Jogos */}
        <section ref={libraryRef} className="scroll-mt-16">
          <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4">
            Todos os Jogos ({filteredGamesList.length})
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
              <div className="text-slate-400">Carregando jogos...</div>
            </div>
          ) : filteredGamesList.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-sm">
                {games.length === 0
                  ? 'Nenhum jogo adicionado ainda. Comece agora!'
                  : 'Nenhum jogo encontrado com os filtros aplicados.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
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

      {/* Botão flutuante de adicionar jogo (mobile) */}
      <button
        onClick={() => setShowAddModal(true)}
        disabled={loading}
        className="md:hidden fixed bottom-20 right-4 z-30 bg-violet-600 active:bg-violet-500 text-white w-14 h-14 rounded-full shadow-lg shadow-violet-950/50 flex items-center justify-center disabled:opacity-50"
        aria-label="Adicionar jogo"
      >
        <Plus className="w-6 h-6" />
      </button>

      <BottomNav
        user={user}
        onGoHome={scrollToTop}
        onGoLibrary={scrollToLibrary}
        onExport={() => setShowExportModal(true)}
        onLogout={handleLogout}
      />

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
