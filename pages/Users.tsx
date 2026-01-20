
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { User as UserIcon, Mail, Shield, Building, Plus, Edit, Trash2, X, Save, Search, UserCheck, Lock } from 'lucide-react';
import { AREAS } from '../constants';
import { User as UserType } from '../types';
import { getUsers, saveUser, deleteUser } from '../services/dataService';

interface UsersProps {
  currentUser: UserType | null;
  onLogout: () => void;
}

const Users: React.FC<UsersProps> = ({ currentUser: loggedInUser, onLogout }) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<UserType>>({});

  useEffect(() => {
    getUsers().then(setUsers);
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

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este usuario del sistema?')) {
      await deleteUser(id);
      getUsers().then(setUsers);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userToSave: UserType = {
        id: isEditing && currentUser.id ? currentUser.id : Date.now().toString(),
        name: currentUser.name || '',
        email: currentUser.email || '',
        role: currentUser.role || 'Operador',
        areaId: currentUser.areaId || AREAS[0].id,
        status: currentUser.status || 'Activo',
        password: currentUser.password || 'Drem2026.' 
    };

    await saveUser(userToSave);
    getUsers().then(setUsers);
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getAreaName(user.areaId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-slate-50 w-full min-h-screen">
      <Header title="Gestión de Usuarios" user={loggedInUser} onLogout={onLogout} />
      
      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Personal Registrado</h2>
              <p className="text-sm text-slate-500 font-bold italic">Administre los accesos y roles institucionales.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                <div className="relative w-full sm:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#991b1b] transition-colors" size={20} />
                    <input 
                        type="text"
                        placeholder="Buscar por nombre, correo o cargo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#991b1b] focus:ring-4 focus:ring-red-500/5 transition-all shadow-inner placeholder:text-slate-300 text-slate-700"
                    />
                </div>

                <button 
                  onClick={handleOpenCreate}
                  className="w-full sm:w-auto bg-[#991b1b] hover:bg-red-800 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-red-900/10 transition-all active:scale-95 text-sm uppercase tracking-widest"
                >
                    <Plus size={20} strokeWidth={3} />
                    Nuevo Usuario
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {filteredUsers.length > 0 ? filteredUsers.map(user => (
                <div key={user.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 hover:shadow-xl hover:border-red-100 transition-all relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[3rem] -z-0 opacity-50 group-hover:bg-red-50 transition-colors"></div>
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200 group-hover:bg-[#991b1b] group-hover:text-white transition-all duration-500 shadow-sm">
                            <UserIcon size={32} strokeWidth={1.5} />
                        </div>
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                          user.status === 'Activo' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          user.status === 'Vacaciones' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                            {user.status || 'Activo'}
                        </span>
                    </div>
                    
                    <h3 className="font-black text-xl text-slate-900 mb-2 group-hover:text-[#991b1b] transition-colors leading-tight uppercase tracking-tight">{user.name}</h3>
                    <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-sm text-slate-500 font-bold truncate">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors shrink-0">
                                <Mail size={16} />
                            </div>
                            <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500 font-bold">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors shrink-0">
                                <Building size={16} />
                            </div>
                            <span>{getAreaName(user.areaId || '')}</span>
                        </div>
                         <div className="flex items-center gap-3 text-sm text-slate-500 font-bold">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors shrink-0">
                                <Shield size={16} />
                            </div>
                            <span className="text-[#991b1b]">{user.role}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-6 border-t border-slate-50">
                        <button 
                          onClick={() => handleOpenEdit(user)}
                          className="flex-1 py-3.5 rounded-xl bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-600 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <Edit size={14} /> Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="py-3.5 px-5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-all active:scale-95 border border-rose-100"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            )) : (
                <div className="col-span-full py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                        <Search size={48} />
                    </div>
                    <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Sin coincidencias</h3>
                    <p className="text-slate-400 font-bold italic mt-2">No se encontraron usuarios para "{searchTerm}"</p>
                </div>
            )}
        </div>
      </main>

      {/* Modal Formulario de Usuario Optimizada */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="bg-[#991b1b] px-10 py-10 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg">
                    {isEditing ? <Edit size={28} /> : <Plus size={28} strokeWidth={3} />}
                </div>
                <div>
                    <h3 className="font-black text-2xl tracking-tight uppercase leading-none">
                        {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </h3>
                    <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.25em] mt-1.5">Módulo de Control de Accesos</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-4 rounded-full transition-all text-white/80 hover:text-white"><X size={32}/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-8 overflow-y-auto flex-1">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Identidad del Colaborador</label>
                <div className="relative group">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#991b1b] transition-colors" size={22} />
                    <input 
                      required
                      type="text" 
                      value={currentUser.name || ''}
                      onChange={e => setCurrentUser({...currentUser, name: e.target.value})}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 text-slate-900 border-2 border-slate-100 rounded-2xl text-base font-bold outline-none focus:bg-white focus:border-[#991b1b] transition-all shadow-sm placeholder:text-slate-300"
                      placeholder="Nombre completo"
                    />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Correo Electrónico Institucional</label>
                <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#991b1b] transition-colors" size={22} />
                    <input 
                      required
                      type="email" 
                      value={currentUser.email || ''}
                      onChange={e => setCurrentUser({...currentUser, email: e.target.value})}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 text-slate-900 border-2 border-slate-100 rounded-2xl text-base font-bold outline-none focus:bg-white focus:border-[#991b1b] transition-all shadow-sm placeholder:text-slate-300"
                      placeholder="correo@drem.gob.pe"
                    />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Oficina Asignada</label>
                  <select 
                    value={currentUser.areaId}
                    onChange={e => setCurrentUser({...currentUser, areaId: e.target.value})}
                    className="w-full bg-slate-50 text-slate-900 border-2 border-slate-100 rounded-2xl p-5 text-sm font-black outline-none focus:bg-white focus:border-[#991b1b] transition-all cursor-pointer shadow-sm"
                  >
                    {AREAS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Nivel de Acceso</label>
                  <select 
                    value={currentUser.role}
                    onChange={e => setCurrentUser({...currentUser, role: e.target.value})}
                    className="w-full bg-slate-50 text-slate-900 border-2 border-slate-100 rounded-2xl p-5 text-sm font-black outline-none focus:bg-white focus:border-[#991b1b] transition-all cursor-pointer shadow-sm"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Analista">Analista</option>
                    <option value="Mesa de Partes">Mesa de Partes</option>
                    <option value="Especialista">Especialista</option>
                    <option value="Asesor Legal">Asesor Legal</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Estado Laboral</label>
                <div className="flex gap-4">
                  {['Activo', 'Inactivo', 'Vacaciones'].map(status => (
                    <label key={status} className="flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all hover:bg-slate-50 group border-slate-100 has-[:checked]:border-[#991b1b] has-[:checked]:bg-red-50/50 shadow-sm">
                      <input 
                        type="radio" 
                        name="status"
                        checked={currentUser.status === status}
                        onChange={() => setCurrentUser({...currentUser, status: status as any})}
                        className="sr-only"
                      />
                      <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${currentUser.status === status ? 'text-[#991b1b]' : 'text-slate-400 group-hover:text-slate-600'}`}>{status}</span>
                      {currentUser.status === status && <UserCheck size={16} className="text-[#991b1b]" />}
                    </label>
                  ))}
                </div>
              </div>
              
              {!isEditing && (
                 <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-xl mt-4">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 block">Credenciales Temporales</label>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                           <p className="text-[11px] font-black text-white uppercase opacity-40">Password Genérica</p>
                           <p className="font-mono text-lg font-black text-white tracking-widest">Drem2026.</p>
                        </div>
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/20"><Lock size={24} /></div>
                    </div>
                 </div>
              )}
            </form>

            <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-6 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-8 py-4 text-slate-400 font-black uppercase text-[11px] tracking-[0.2em] hover:text-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  type="submit" 
                  className="bg-[#991b1b] text-white px-12 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.25em] shadow-2xl shadow-red-900/20 hover:bg-red-800 transition-all flex items-center gap-3 active:scale-95"
                >
                   <Save size={20} /> Finalizar Registro
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
