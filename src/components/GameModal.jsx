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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? 'Editar Jogo' : 'Adicionar Jogo'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
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

        <div className="flex gap-3 pt-6 mt-6 border-t border-slate-700">
          <button
            onClick={onSave}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            {isEditing ? 'Salvar Alterações' : 'Adicionar Jogo'}
          </button>
          <button
            onClick={onCancel}
            className="px-6 bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModal;