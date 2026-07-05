import React from 'react';
import { X, Check } from 'lucide-react';
import GameSearchModal from './GameSearchModal';
import GameForm from './GameForm';

const GameModal = ({
  isEditing,
  formData,
  searchQuery,
  searchResults,
  isSearching,
  showSearchResults,
  onSearchChange,
  onSelectGame,
  onFormChange,
  onToggleTag,
  onSave,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex sm:items-center sm:justify-center sm:p-4">
      <div className="bg-slate-900 w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl sm:border sm:border-slate-800 overflow-y-auto flex flex-col animate-fadeIn">
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">
            {isEditing ? 'Editar Jogo' : 'Adicionar Jogo'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 active:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-4 space-y-5 flex-1">
          <GameSearchModal
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            searchResults={searchResults}
            isSearching={isSearching}
            showResults={showSearchResults}
            onSelectGame={onSelectGame}
          />

          <GameForm
            formData={formData}
            onChange={onFormChange}
            onToggleTag={onToggleTag}
          />
        </div>

        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-4 py-4 flex gap-3 pb-safe">
          <button
            onClick={onSave}
            className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 text-sm"
          >
            <Check className="w-4 h-4" />
            {isEditing ? 'Salvar Alterações' : 'Adicionar Jogo'}
          </button>
          <button
            onClick={onCancel}
            className="btn-secondary px-6 py-3 text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModal;
