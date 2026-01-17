
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Menu, LogOut, ShieldCheck, Languages, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  setSidebarOpen: (open: (prev: boolean) => boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 md:px-12 h-24 shrink-0 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-6">
        {/* The requested 3-bar menu button */}
        <button 
          onClick={() => setSidebarOpen(prev => !prev)}
          className="p-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl hover:bg-black dark:hover:bg-slate-600 transition-all shadow-lg shadow-slate-200 dark:shadow-none"
          title="Toggle Hub Menu"
        >
          <Menu size={20} strokeWidth={2.5} />
        </button>
        
        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-2 mb-1">
             <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">UX4G</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded transition-colors">v2.0</span>
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Government Design System</p>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-10">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-100 dark:border-slate-700"
          title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Google Translate Discrete Placement */}
        <div className="hidden xs:flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group">
          <Languages size={14} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
          <div id="google_translate_element"></div>
        </div>

        <div className="hidden lg:flex items-center trustid-shard px-5 py-2.5 rounded-xl gap-3 shadow-inner bg-slate-900 dark:bg-black">
           <ShieldCheck size={14} className="text-orange-400" />
           <span className="text-[9px] font-black uppercase tracking-widest opacity-60 text-white">Sovereign Shard:</span>
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400">Node-Alpha-X</span>
        </div>

        <div className="flex items-center gap-4 border-l border-slate-100 dark:border-slate-800 pl-4 md:pl-10">
           <div className="flex flex-col text-right hidden xs:flex">
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{user?.name}</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{user?.role} ACCESS</span>
           </div>
           <button onClick={logout} className="p-3.5 bg-rose-50 dark:bg-rose-900/20 rounded-xl text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors shadow-sm" title="Log Out">
              <LogOut size={18} />
           </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
