
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { User as UserIcon, Mail, Shield, Building, Plus, Edit, Trash2, X, Save, Search, UserCheck, Lock, Loader2 } from 'lucide-react';
import { AREAS } from '../constants';
import { User as UserType } from '../types';
import { getUsers, saveUser, deleteUser } from '../services/dataService';

interface UsersProps {
  currentUser: UserType | null;
  onLogout: () => void;
}

const Users: React.FC<UsersProps> = ({ currentUser: loggedInUser, onLogout }) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formUser, setFormUser] = useState<Partial<UserType>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  };

  const getAreaName = (id: string) => AREAS.find(a => a.id === id)?.name || id;

  const handleOpenCreate = () => {
    setFormUser({ 
      status: 'Activo', 
      role: 'Analista', 
      areaId: AREAS[0].id,
      password: '' 
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserType) => {
    setFormUser({ ...user });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Eliminar este usuario de Firebase permanentemente?')) {
      setIsProcessing(true);
      try {
        await deleteUser(id);
        await fetchUsers();
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
        const userToSave: UserType = {
            id: isEditing && formUser.id ? formUser.id : `user-${Date.now()}`,
            name: formUser.name || '',
            email: formUser.email || '',
            role: formUser.role || 'Analista',
            areaId: formUser.areaId || AREAS[0].id,
            status: formUser.status || 'Activo',
            password: formUser.password || (isEditing ? '' : 'Drem2026.') // Mantiene contraseña si es edición
        };

        await saveUser(userToSave);
        await fetchUsers();
        setIsModalOpen(false);
    } catch (err) {
        alert("Error al guardar en Firebase.");
    } finally {
        setIsProcessing(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-slate-50 w-full min-h-screen">
      <Header title="Gestión de Usuarios" user={loggedInUser} onLogout={onLogout} />
      
      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Personal Registrado</h2>
              <p className="text-sm text-slate-500 font-bold italic">Usuarios sincronizados con Firebase Firestore.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                        type="text"
                        placeholder="Buscar usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[#991b1b] transition-all"
                    />
                </div>

                <button 
                  onClick={handleOpenCreate}
                  className="w-full sm:w-auto bg-[#991b1b] text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:bg-red-800 transition-all text-sm uppercase tracking-widest"
                >
                    <Plus size={20} strokeWidth={3} /> Nuevo Usuario
                </button>
            </div>
        </div>

        {loading ? (
            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#991b1b]" size={48}/></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {filteredUsers.map(user => (
                    <div key={user.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 hover:shadow-xl transition-all relative group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200 group-hover:bg-[#991b1b] group-hover:text-white transition-all">
                                <UserIcon size={28} />
                            </div>
                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                            user.status === 'Activo' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                            'bg-rose-50 text-rose-700 border-rose-100'
                            }`}>
                                {user.status || 'Activo'}
                            </span>
                        </div>
                        
                        <h3 className="font-black text-lg text-slate-900 mb-2 uppercase tracking-tight">{user.name}</h3>
                        <div className="space-y-2 mb-8">
                            <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                                <Mail size={14} className="text-slate-400" /> {user.email}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                                <Building size={14} className="text-slate-400" /> {getAreaName(user.areaId || '')}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-[#991b1b] font-black uppercase">
                                <Shield size={14} /> {user.role}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-6 border-t border-slate-50">
                            <button onClick={() => handleOpenEdit(user)} className="flex-1 py-3 rounded-xl bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-600 font-black text-[10px] uppercase tracking-widest transition-all">
                                <Edit size={14} className="inline mr-2" /> Editar
                            </button>
                            <button onClick={() => handleDelete(user.id)} className="p-3 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-all">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>

      {/* Modal Formulario Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in zoom-in-95">
            <div className="bg-[#991b1b] px-8 py-8 flex justify-between items-center text-white">
              <div>
                <h3 className="font-black text-xl uppercase tracking-tight">{isEditing ? 'Actualizar' : 'Registrar'} Usuario</h3>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">Firebase Cloud Storage</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-all"><X size={28}/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Nombre Completo</label>
                <input required type="text" value={formUser.name || ''} onChange={e => setFormUser({...formUser, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[#991b1b]" placeholder="Juan Perez..." />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Email / Usuario</label>
                <input required type="email" value={formUser.email || ''} onChange={e => setFormUser({...formUser, email: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[#991b1b]" placeholder="juan@drem.gob.pe" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Oficina</label>
                  <select value={formUser.areaId} onChange={e => setFormUser({...formUser, areaId: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-xs font-black outline-none">
                    {AREAS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Rol</label>
                  <select value={formUser.role} onChange={e => setFormUser({...formUser, role: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-xs font-black outline-none">
                    <option value="Administrador">Administrador</option>
                    <option value="Analista">Analista</option>
                    <option value="Mesa de Partes">Mesa de Partes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Contraseña {isEditing && '(Dejar vacío para no cambiar)'}</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="password" value={formUser.password || ''} onChange={e => setFormUser({...formUser, password: e.target.value})} className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[#991b1b]" placeholder="••••••••" required={!isEditing} />
                </div>
              </div>

              <div className="flex gap-4">
                {['Activo', 'Inactivo'].map(st => (
                  <button key={st} type="button" onClick={() => setFormUser({...formUser, status: st as any})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${formUser.status === st ? 'border-[#991b1b] bg-red-50 text-[#991b1b]' : 'border-slate-100 text-slate-400'}`}>
                    {st}
                  </button>
                ))}
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isProcessing} className="w-full bg-[#991b1b] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3">
                   {isProcessing ? <Loader2 className="animate-spin" size={18}/> : <><Save size={18} /> Guardar en Firebase</>}
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
