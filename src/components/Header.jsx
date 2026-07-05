import React from 'react';
import { LogOut, Download } from 'lucide-react';

const Header = ({ user, onLogout, onExport }) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur border-b border-slate-800">
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-bold text-white flex items-center gap-2">
          <span>🎮</span> Já Joguei
        </h1>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-slate-400 text-sm">Olá, {user.displayName}</span>
          <button
            onClick={onExport}
            className="btn-secondary px-4 py-2 text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button
            onClick={onLogout}
            className="btn-danger px-4 py-2 text-sm flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
