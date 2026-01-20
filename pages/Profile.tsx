import React, { useState } from 'react';
import Header from '../components/Header';
import { User, Mail, Building, Lock, Save, ArrowLeft, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User as UserType } from '../types';
import { saveUser } from '../services/dataService';
import { AREAS } from '../constants';

interface ProfileProps {
  currentUser: UserType;
  onUpdateUser: (user: UserType) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ currentUser, onUpdateUser, onLogout }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    password: currentUser.password || '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const getAreaName = (id?: string) => AREAS.find(a => a.id === id)?.name || id || 'No asignado';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Basic validation
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
        return;
    }

    // Create updated user object
    const updatedUser: UserType = {
        ...currentUser,
        name: formData.name,
        email: formData.email,
        password: formData.newPassword ? formData.newPassword : currentUser.password // Update password only if new one provided
    };

    try {
        saveUser(updatedUser); // Persist to local storage
        onUpdateUser(updatedUser); // Update app state
        setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' });
        
        // Clear password fields
        setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
    } catch (error) {
        setMessage({ type: 'error', text: 'Error al guardar los cambios.' });
    }
  };

  return (
    <div className="flex-1 bg-slate-50 w-full">
      {/* Pasamos onLogout al Header para que el menú desplegable funcione */}
      <Header title="Mi Perfil" user={currentUser} onLogout={onLogout} />
      
      <main className="p-4 md:p-8 max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} /> Volver
        </button>

        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar / Info Card */}
            <div className="w-full md:w-1/3">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-700 mb-4 border-4 border-white shadow-sm">
                        <User size={48} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{currentUser.name}</h2>
                    <p className="text-slate-500 font-medium">{currentUser.role}</p>
                    
                    <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-3 text-left">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Building size={16} className="text-slate-400" />
                            <span>{getAreaName(currentUser.areaId)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Mail size={16} className="text-slate-400" />
                            <span className="truncate">{currentUser.email}</span>
                        </div>
                    </div>

                    <div className="w-full mt-6">
                        <button 
                            onClick={onLogout}
                            className="w-full py-2.5 px-4 rounded-lg bg-red-50 text-red-700 font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-100"
                        >
                            <LogOut size={16} /> Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Form */}
            <div className="w-full md:w-2/3">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <User size={20} className="text-red-700" /> Editar Información
                    </h3>

                    {message && (
                        <div className={`p-4 rounded-lg mb-6 text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message.type === 'success' ? '✓' : '!'} {message.text}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="grid grid-cols-1 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100">
                             <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Lock size={16} className="text-slate-400" /> Cambiar Contraseña
                             </h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nueva Contraseña</label>
                                    <input 
                                        type="password" 
                                        placeholder="Dejar en blanco para no cambiar"
                                        value={formData.newPassword}
                                        onChange={e => setFormData({...formData, newPassword: e.target.value})}
                                        className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confirmar Contraseña</label>
                                    <input 
                                        type="password" 
                                        placeholder="Repetir nueva contraseña"
                                        value={formData.confirmPassword}
                                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                        className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                                    />
                                </div>
                             </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button 
                                type="submit" 
                                className="bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 shadow-md shadow-red-900/10 flex items-center gap-2 transition-all active:scale-95"
                            >
                                <Save size={18} /> Guardar Cambios
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;