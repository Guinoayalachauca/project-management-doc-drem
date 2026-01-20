import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FilePlus, Search, Inbox, Building2, LogOut, Users, Files, Settings, X, ChevronDown, ChevronRight, FolderOpen, BarChart3 } from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';

interface SidebarProps {
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const { isOpen, close } = useSidebar();
  const location = useLocation();
  
  // State for the grouped menu - Default to FALSE (closed) as requested
  const isTramiteActive = ['/register', '/inbox', '/documents', '/search', '/statistics'].includes(location.pathname);
  const [isTramiteOpen, setIsTramiteOpen] = useState(false);

  const navClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 mx-3 rounded-lg transition-colors duration-200 font-medium text-sm ${
      isActive
        ? 'bg-white text-red-900 shadow-sm'
        : 'text-red-100 hover:bg-red-800 hover:text-white'
    }`;
    
  const subNavClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2 mx-3 ml-8 rounded-lg transition-colors duration-200 font-medium text-xs ${
      isActive
        ? 'bg-red-800 text-white shadow-inner'
        : 'text-red-200 hover:bg-red-800/50 hover:text-white'
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={close}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed left-0 top-0 h-screen bg-red-900 z-50 shadow-xl text-white border-r border-red-800 w-64 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-red-800 bg-red-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
              <Building2 className="text-red-900" size={24} strokeWidth={2.5} />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-xl font-bold text-white leading-none tracking-tight">SISGEDO</h1>
              <p className="text-red-300 text-[10px] font-medium tracking-wider mt-1 uppercase truncate">DREM Apurímac</p>
            </div>
          </div>
          <button onClick={close} className="md:hidden text-red-200 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
          <NavLink to="/" className={navClasses} onClick={() => window.innerWidth < 768 && close()}>
            <LayoutDashboard size={18} />
            <span className="flex-1">Inicio</span>
          </NavLink>
          
          <div className="mt-4 mb-2 px-7 text-[10px] font-bold text-red-300 uppercase tracking-widest">
            Módulos
          </div>

          {/* Grouped Module: Trámite Documentario */}
          <div>
            <button 
              onClick={() => setIsTramiteOpen(!isTramiteOpen)}
              className={`flex items-center gap-3 px-4 py-3 mx-3 rounded-lg transition-colors duration-200 font-medium text-sm w-[calc(100%-1.5rem)] text-left hover:bg-red-800 ${isTramiteActive ? 'text-white font-bold' : 'text-red-100'}`}
            >
              <FolderOpen size={18} />
              <span className="flex-1">Trámite Documentario</span>
              {isTramiteOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            <div className={`space-y-1 overflow-hidden transition-all duration-300 ${isTramiteOpen ? 'max-h-96 mt-1' : 'max-h-0'}`}>
              <NavLink to="/register" className={subNavClasses} onClick={() => window.innerWidth < 768 && close()}>
                <FilePlus size={16} />
                <span className="flex-1">Registrar</span>
              </NavLink>
              
              <NavLink to="/inbox" className={subNavClasses} onClick={() => window.innerWidth < 768 && close()}>
                <Inbox size={16} />
                <span className="flex-1">Bandeja</span>
              </NavLink>

              <NavLink to="/documents" className={subNavClasses} onClick={() => window.innerWidth < 768 && close()}>
                <Files size={16} />
                <span className="flex-1">Archivo</span>
              </NavLink>
              
              <NavLink to="/search" className={subNavClasses} onClick={() => window.innerWidth < 768 && close()}>
                <Search size={16} />
                <span className="flex-1">Seguimiento</span>
              </NavLink>

              <NavLink to="/statistics" className={subNavClasses} onClick={() => window.innerWidth < 768 && close()}>
                <BarChart3 size={16} />
                <span className="flex-1">Estadísticas</span>
              </NavLink>
            </div>
          </div>

          <div className="mt-6 mb-2 px-7 text-[10px] font-bold text-red-300 uppercase tracking-widest">
            Administración
          </div>

          <NavLink to="/users" className={navClasses} onClick={() => window.innerWidth < 768 && close()}>
            <Users size={18} />
            <span className="flex-1">Usuarios</span>
          </NavLink>

          <NavLink to="/settings" className={navClasses} onClick={() => window.innerWidth < 768 && close()}>
            <Settings size={18} />
            <span className="flex-1">Ajustes</span>
          </NavLink>
        </nav>

        <div className="p-4 bg-red-950 border-t border-red-800">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-red-200 hover:text-white transition-colors text-sm font-bold"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;