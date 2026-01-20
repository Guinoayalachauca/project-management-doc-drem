import React, { useState } from 'react';
import Header from '../components/Header';
import { Bell, Check, Trash2, Filter, AlertTriangle, Info, CheckCircle, ArrowLeft } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../constants';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

interface NotificationHistoryProps {
    currentUser: User | null;
    onLogout: () => void;
}

const NotificationHistory: React.FC<NotificationHistoryProps> = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'ALL') return true;
    return n.type === filterType.toLowerCase();
  });

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={18} className="text-orange-500" />;
      case 'success': return <CheckCircle size={18} className="text-emerald-500" />;
      default: return <Info size={18} className="text-blue-500" />;
    }
  };

  return (
    <div className="flex-1 bg-slate-50 w-full min-h-screen">
      <Header title="Historial de Notificaciones" user={currentUser} onLogout={onLogout} />
      
      <main className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold text-sm"
        >
          <ArrowLeft size={16} /> Volver
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                <button 
                  onClick={() => setFilterType('ALL')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${filterType === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  Todas
                </button>
                <button 
                  onClick={() => setFilterType('INFO')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${filterType === 'INFO' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'}`}
                >
                  Información
                </button>
                <button 
                  onClick={() => setFilterType('WARNING')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${filterType === 'WARNING' ? 'bg-orange-500 text-white' : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600'}`}
                >
                  Alertas
                </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                <button onClick={markAllAsRead} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                    <Check size={16}/> Marcar todo leído
                </button>
            </div>
        </div>

        <div className="space-y-3">
            {filteredNotifications.length > 0 ? filteredNotifications.map((notif) => (
                <div key={notif.id} className={`bg-white p-5 rounded-2xl border transition-all flex gap-4 items-start shadow-sm group ${notif.read ? 'border-slate-100 opacity-75' : 'border-slate-200 shadow-md ring-1 ring-red-50'}`}>
                    <div className={`mt-1 p-2 rounded-xl shrink-0 ${notif.read ? 'bg-slate-50' : 'bg-red-50 animate-pulse'}`}>
                        {getTypeIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className={`text-sm font-bold uppercase tracking-wide ${notif.read ? 'text-slate-500' : 'text-slate-800'}`}>
                                {notif.title}
                            </h4>
                            <span className="text-[10px] font-bold text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-3">{notif.message}</p>
                        {!notif.read && <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase">Nuevo</span>}
                    </div>
                    <button 
                        onClick={() => deleteNotification(notif.id)}
                        className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell size={32} className="text-slate-300" />
                    </div>
                    <h3 className="font-bold text-slate-800">Sin notificaciones</h3>
                    <p className="text-sm text-slate-400">No hay registros que coincidan con el filtro.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default NotificationHistory;