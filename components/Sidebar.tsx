import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus, Search, Inbox, Building2, LogOut, Users, Files, Settings } from 'lucide-react';

interface SidebarProps {
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  // Diseño Sobrio y Profesional (Solid Colors)
  const navClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 mx-3 rounded-lg transition-colors duration-200 font-medium text-sm ${
      isActive
        ? 'bg-white text-red-900 shadow-sm'
        : 'text-red-100 hover:bg-red-800 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-red-900 h-screen flex flex-col fixed left-0 top-0 z-30 shadow-xl text-white border-r border-red-800">
      {/* Logo Area */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-red-800 bg-red-950">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
          <Building2 className="text-red-900" size={24} strokeWidth={2.5} />
        </div>
        <div className="overflow-hidden">
          <h1 className="text-xl font-bold text-white leading-none tracking-tight">SISGEDO</h1>
          <p className="text-red-300 text-[10px] font-medium tracking-wider mt-1 uppercase truncate">DREM Apurímac</p>
        </div>
      </div>

      <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
        <NavLink to="/" className={navClasses}>
          <LayoutDashboard size={18} />
          <span className="flex-1">Inicio</span>
        </NavLink>
        
        <div className="mt-6 mb-2 px-7 text-[10px] font-bold text-red-300 uppercase tracking-widest">
          Trámite
        </div>
        
        <NavLink to="/register" className={navClasses}>
          <FilePlus size={18} />
          <span className="flex-1">Registrar</span>
        </NavLink>
        
        <NavLink to="/inbox" className={navClasses}>
          <Inbox size={18} />
          <span className="flex-1">Bandeja</span>
          {/* Badge demo */}
          <span className="bg-red-700 text-white text-[10px] px-1.5 py-0.5 rounded-full">3</span>
        </NavLink>

        <NavLink to="/documents" className={navClasses}>
          <Files size={18} />
          <span className="flex-1">Archivo</span>
        </NavLink>
        
        <NavLink to="/search" className={navClasses}>
          <Search size={18} />
          <span className="flex-1">Seguimiento</span>
        </NavLink>

        <div className="mt-6 mb-2 px-7 text-[10px] font-bold text-red-300 uppercase tracking-widest">
          Administración
        </div>

        <NavLink to="/users" className={navClasses}>
          <Users size={18} />
          <span className="flex-1">Usuarios</span>
        </NavLink>

        <NavLink to="/settings" className={navClasses}>
          <Settings size={18} />
          <span className="flex-1">Ajustes</span>
        </NavLink>
      </nav>

      <div className="p-4 bg-red-950 border-t border-red-800">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2 w-full text-red-200 hover:text-white transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;