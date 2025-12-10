import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { User, Mail, Shield, Building, Plus, Edit, Trash2, X, Check, Save } from 'lucide-react';
import { AREAS } from '../constants';
import { User as UserType } from '../types';
import { getUsers, saveUser, deleteUser } from '../services/dataService';

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<UserType>>({});

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const getAreaName = (id: string) => AREAS.find(a => a.id === id)?.name || id;

  const handleOpenCreate = () => {
    setCurrentUser({ status: 'Activo', role: 'Operador', areaId: AREAS[0].id });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserType) => {
    setCurrentUser({ ...user });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este usuario del sistema?')) {
      deleteUser(id);
      setUsers(getUsers()); // Refresh list
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userToSave: UserType = {
        id: isEditing && currentUser.id ? currentUser.id : Date.now().toString(),
        name: currentUser.name || '',
        email: currentUser.email || '',
        role: currentUser.role || 'Operador',
        areaId: currentUser.areaId || AREAS[0].id,
        status: currentUser.status || 'Activo',
        // In a real app, don't hardcode password like this, but for demo:
        password: currentUser.password || 'Drem2024.' 
    };

    saveUser(userToSave);
    setUsers(getUsers()); // Refresh list
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 bg-slate-50 w-full">
      <Header title="Gestión de Usuarios" />
      
      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Personal Registrado</h2>
              <p className="text-sm text-slate-500">Administre los accesos y roles del personal.</p>
            </div>
            <button 
              onClick={handleOpenCreate}
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-md transition-colors text-sm md:text-base"
            >
                <Plus size={20} />
                <span className="hidden sm:inline">Nuevo Usuario</span>
                <span className="sm:hidden">Nuevo</span>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
                <div key={user.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow relative group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                            <User size={24} />
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          user.status === 'Activo' ? 'bg-green-100 text-green-700' : 
                          user.status === 'Vacaciones' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {user.status || 'Activo'}
                        </span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-slate-800 mb-1">{user.name}</h3>
                    <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600 truncate">
                            <Mail size={14} className="shrink-0" />
                            <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Building size={14} className="shrink-0" />
                            <span>{getAreaName(user.areaId || '')}</span>
                        </div>
                         <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Shield size={14} className="shrink-0" />
                            <span>{user.role}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-slate-100">
                        <button 
                          onClick={() => handleOpenEdit(user)}
                          className="flex-1 py-2 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-sm flex items-center justify-center gap-1 transition-colors"
                        >
                            <Edit size={14} /> Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="py-2 px-3 rounded bg-red-50 hover:bg-red-100 text-red-700 font-medium text-sm transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </main>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-red-800 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                {isEditing ? <Edit size={18} /> : <Plus size={18} />}
                {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-red-700 p-1 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nombre Completo</label>
                <input 
                  required
                  type="text" 
                  value={currentUser.name || ''}
                  onChange={e => setCurrentUser({...currentUser, name: e.target.value})}
                  className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Correo Institucional</label>
                <input 
                  required
                  type="email" 
                  value={currentUser.email || ''}
                  onChange={e => setCurrentUser({...currentUser, email: e.target.value})}
                  className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Área / Oficina</label>
                  <select 
                    value={currentUser.areaId}
                    onChange={e => setCurrentUser({...currentUser, areaId: e.target.value})}
                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    {AREAS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Rol</label>
                  <select 
                    value={currentUser.role}
                    onChange={e => setCurrentUser({...currentUser, role: e.target.value})}
                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Mesa de Partes">Mesa de Partes</option>
                    <option value="Especialista">Especialista</option>
                    <option value="Asesor Legal">Asesor Legal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Estado</label>
                <div className="flex gap-4">
                  {['Activo', 'Inactivo', 'Vacaciones'].map(status => (
                    <label key={status} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="status"
                        checked={currentUser.status === status}
                        onChange={() => setCurrentUser({...currentUser, status: status as any})}
                        className="text-red-600 focus:ring-red-500"
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>
              
              {!isEditing && (
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña Temporal</label>
                    <input type="password" disabled value="Drem2024." className="w-full bg-slate-100 border border-slate-300 rounded-md p-2 text-sm text-slate-500" />
                    <p className="text-xs text-slate-400 mt-1">Por defecto: Drem2024.</p>
                 </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-red-700 text-white rounded-md font-bold hover:bg-red-800 flex items-center gap-2">
                   <Save size={16} /> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;