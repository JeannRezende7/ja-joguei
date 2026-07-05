import React, { useState } from 'react';
import { Home, LayoutGrid, Download, User, LogOut, X } from 'lucide-react';

const NavButton = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition ${
      active ? 'text-violet-400' : 'text-slate-400 active:text-slate-200'
    }`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const BottomNav = ({ user, onGoHome, onGoLibrary, onExport, onLogout }) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-slate-950/95 backdrop-blur border-t border-slate-800 pb-safe">
        <div className="flex items-stretch max-w-md mx-auto">
          <NavButton icon={<Home className="w-5 h-5" />} label="Início" onClick={onGoHome} />
          <NavButton icon={<LayoutGrid className="w-5 h-5" />} label="Biblioteca" onClick={onGoLibrary} />
          <NavButton icon={<Download className="w-5 h-5" />} label="Exportar" onClick={onExport} />
          <NavButton icon={<User className="w-5 h-5" />} label="Perfil" onClick={() => setShowProfile(true)} />
        </div>
      </nav>

      {showProfile && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowProfile(false)} />
          <div className="relative surface-raised w-full rounded-b-none p-5 pb-8 animate-slideUp">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">Perfil</h3>
              <button onClick={() => setShowProfile(false)} className="text-slate-400 active:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 font-bold">
                {user.displayName?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="min-w-0">
                <div className="text-white font-semibold truncate">{user.displayName}</div>
                <div className="text-slate-500 text-xs truncate">{user.email}</div>
              </div>
            </div>

            <button
              onClick={() => { setShowProfile(false); onLogout(); }}
              className="btn-danger w-full py-3 text-sm flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair da conta
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomNav;
