import React from 'react';
import { LogOut, Download } from 'lucide-react';

const Header = ({ user, onLogout, onExport }) => {
  return (
    <header className="bg-black bg-opacity-50 backdrop-blur-md border-b border-purple-500 border-opacity-30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            🎮 Já Joguei
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-white hidden sm:inline">Olá, {user.displayName}!</span>
            <button
              onClick={onExport}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;