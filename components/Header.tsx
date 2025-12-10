import React, { useState } from 'react';
import { Bell, User, Search, ChevronDown, LogOut, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User as UserType } from '../types';
import { MOCK_NOTIFICATIONS } from '../constants';

interface HeaderProps {
  title: string;
  user?: UserType | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, user, onLogout }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleGlobalSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm(''); // Optional: clear after search
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="h-20 px-8 sticky top-0 z-20 flex items-center justify-between bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Global Search Bar */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition-all w-72">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar expediente general..." 
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleGlobalSearch}
          />
        </div>

        <div className="h-6 w-px bg-gray-300"></div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:text-red-700 transition-colors focus:outline-none"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
               <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-sm text-gray-800">Notificaciones</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-[10px] text-red-600 font-bold hover:underline">
                      Marcar leídas
                    </button>
                  )}
               </div>
               <div className="max-h-72 overflow-y-auto">
                 {notifications.length === 0 ? (
                   <p className="p-4 text-center text-sm text-gray-400">No tienes notificaciones.</p>
                 ) : (
                   notifications.map(notif => (
                     <div 
                        key={notif.id} 
                        className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-50 transition-colors cursor-pointer ${notif.read ? 'opacity-60' : 'bg-blue-50/30'}`}
                        onClick={() => markAsRead(notif.id)}
                     >
                        <div className="flex justify-between items-start mb-1">
                           <span className={`text-xs font-bold ${
                             notif.type === 'warning' ? 'text-orange-600' : 
                             notif.type === 'success' ? 'text-green-600' : 'text-blue-600'
                           }`}>{notif.title}</span>
                           <span className="text-[10px] text-gray-400">{notif.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-snug">{notif.message}</p>
                     </div>
                   ))
                 )}
               </div>
               <div className="px-4 py-2 text-center border-t border-gray-100">
                 <button className="text-xs font-bold text-gray-500 hover:text-red-700">Ver todas</button>
               </div>
            </div>
          )}
        </div>
        
        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-bold text-gray-700 leading-tight">{user?.role || 'Invitado'}</span>
              <span className="text-[11px] text-gray-500 font-medium uppercase">{user?.name || 'Iniciar Sesión'}</span>
            </div>
            <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center border border-red-200 text-red-700">
              <User size={18} />
            </div>
            <ChevronDown size={14} className="text-gray-400 mr-1" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                <p className="font-bold text-sm text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
                 <User size={14} /> Mi Perfil
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button 
                onClick={() => {
                  if(onLogout) onLogout();
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
              >
                 <LogOut size={14} /> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;