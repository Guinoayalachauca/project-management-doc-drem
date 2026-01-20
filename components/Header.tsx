
import React, { useState } from 'react';
import { Bell, User, ChevronDown, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User as UserType } from '../types';
import { MOCK_NOTIFICATIONS } from '../constants';
import { useSidebar } from '../contexts/SidebarContext';

interface HeaderProps {
  title: string;
  user?: UserType | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, user, onLogout }) => {
  const navigate = useNavigate();
  const { toggle } = useSidebar();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleLogoutAction = () => {
    if (onLogout) {
      setShowUserMenu(false);
      onLogout();
    }
  };

  return (
    <header className="h-16 md:h-20 px-4 md:px-8 sticky top-0 z-30 flex items-center justify-between bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={toggle}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
        >
          <Menu size={24} />
        </button>

        <h2 className="text-lg md:text-2xl font-bold text-gray-800 truncate max-w-[200px] md:max-w-none tracking-tight">{title}</h2>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            className="relative p-2.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-3 w-72 md:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
               <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-sm text-slate-800">Notificaciones</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-[10px] text-red-600 font-bold hover:underline uppercase tracking-wider">
                      Marcar todo
                    </button>
                  )}
               </div>
               <div className="max-h-80 overflow-y-auto">
                 {notifications.length === 0 ? (
                   <div className="p-8 text-center">
                       <Bell size={32} className="mx-auto text-slate-200 mb-2"/>
                       <p className="text-sm text-slate-400">Sin notificaciones nuevas</p>
                   </div>
                 ) : (
                   notifications.map(notif => (
                     <div 
                        key={notif.id} 
                        className={`px-4 py-3.5 hover:bg-slate-50 border-b border-slate-50 transition-colors cursor-pointer group ${notif.read ? 'opacity-60' : 'bg-red-50/20'}`}
                        onClick={() => markAsRead(notif.id)}
                     >
                        <div className="flex justify-between items-start mb-1">
                           <span className={`text-[11px] font-bold uppercase tracking-wider ${
                             notif.type === 'warning' ? 'text-orange-600' : 
                             notif.type === 'success' ? 'text-emerald-600' : 'text-blue-600'
                           }`}>{notif.title}</span>
                           <span className="text-[10px] text-slate-400 font-medium">{notif.time}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-snug group-hover:text-slate-900 transition-colors">{notif.message}</p>
                     </div>
                   ))
                 )}
               </div>
               <div className="px-4 py-2 text-center bg-slate-50 border-t border-slate-100">
                 <button 
                    onClick={() => { navigate('/notifications'); setShowNotifications(false); }}
                    className="text-[11px] font-bold text-slate-500 hover:text-red-700 transition-colors uppercase"
                 >
                    Ver historial completo
                 </button>
               </div>
            </div>
          )}
        </div>
        
        <div className="hidden md:block h-6 w-px bg-gray-200"></div>

        <div className="relative">
          <button 
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            className={`flex items-center gap-3 pl-2.5 pr-1.5 py-1.5 rounded-xl transition-all focus:outline-none ${showUserMenu ? 'bg-red-50 ring-1 ring-red-100' : 'hover:bg-slate-50'}`}
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-bold text-slate-800 leading-tight">{user?.name || 'Invitado'}</span>
              <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest">{user?.role || 'Invitado'}</span>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 bg-red-100 rounded-xl flex items-center justify-center border border-red-200 text-red-700 shadow-sm overflow-hidden">
              <User size={20} />
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 mb-1 border-b border-slate-50 sm:hidden">
                <p className="font-bold text-sm text-slate-800">{user?.name}</p>
                <p className="text-[10px] text-red-600 font-bold uppercase">{user?.role}</p>
              </div>
              
              <div className="px-2">
                  <button 
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3 font-medium"
                  >
                     <User size={16} className="text-slate-400" /> Mi Perfil
                  </button>
                  <div className="h-px bg-slate-50 my-1 mx-2"></div>
                  <button 
                    onClick={handleLogoutAction}
                    className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center gap-3 font-bold"
                  >
                     <LogOut size={16} /> Cerrar Sesión
                  </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
