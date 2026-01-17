import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '../../types';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Key, 
  History, 
  FileText, 
  Settings, 
  X,
  Database,
  Users,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  role: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, role }) => {
  const getNavItems = () => {
    switch (role) {
      case UserRole.CITIZEN:
        return [
          { icon: LayoutDashboard, label: 'Portal Dashboard', path: '/citizen', hasSub: true },
          { icon: AlertCircle, label: 'Verify Requests', path: '/citizen/requests', badge: '1' },
          { icon: Database, label: 'Manage Identity', path: '/citizen/assets' },
          { icon: History, label: 'Access History', path: '/citizen/logs' },
        ];
      case UserRole.COMPANY:
        return [
          { icon: LayoutDashboard, label: 'Provider Console', path: '/company' },
          { icon: FileText, label: 'Data Request', path: '/company/request' },
          { icon: ShieldCheck, label: 'Active Handshakes', path: '/company/sessions' },
        ];
      default:
        return [
          { icon: LayoutDashboard, label: 'Admin Hub', path: '/admin' },
          { icon: AlertCircle, label: 'System Anomalies', path: '/admin/security' },
        ];
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[90] transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`
        fixed inset-y-0 left-0 z-[100] transform sidebar-dark text-white transition-all duration-300 ease-in-out
        ${isOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-0'}
        md:relative md:translate-x-0 h-full flex flex-col overflow-hidden border-r border-white/10
      `}>
        <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-black">
           <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] whitespace-nowrap">National Hub</h2>
           <button 
             onClick={() => setIsOpen(false)}
             className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
           >
             <X size={18} />
           </button>
        </div>

        <nav className="mt-6 px-4 space-y-2 flex-1 overflow-y-auto custom-scrollbar bg-black">
          {getNavItems().map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center justify-between px-4 py-4 text-xs font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap
                ${isActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
              onClick={() => {
                if (window.innerWidth < 768) setIsOpen(false);
              }}
            >
              <div className="flex items-center gap-4">
                 <item.icon size={18} className="shrink-0" />
                 <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && <span className="bg-indigo-600 text-[10px] px-2 py-0.5 rounded-full">{item.badge}</span>}
                {item.hasSub && <ChevronRight size={14} className="rotate-90" />}
                {!item.hasSub && !item.badge && <ChevronRight size={14} className="opacity-20" />}
              </div>
            </NavLink>
          ))}
        </nav>

        <div className="p-8 text-center text-[8px] font-black text-slate-600 uppercase tracking-widest border-t border-white/5 shrink-0 whitespace-nowrap bg-black">
           IDTrust Protocol v2.4.11
        </div>
      </aside>
    </>
  );
};

export default Sidebar;