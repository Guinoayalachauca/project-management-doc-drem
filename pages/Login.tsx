
import React, { useState } from 'react';
import { Building2, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff, X, CheckCircle2 } from 'lucide-react';
import { User as UserType } from '../types';
import { authenticateUser, getUsers } from '../services/dataService';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Recovery State
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryStatus, setRecoveryStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [recoveryMsg, setRecoveryMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            onLogin(user);
        } else {
            setError('Credenciales no válidas.');
            setIsLoading(false);
        }
    } catch (err) {
        setError('Error de conexión.');
        setIsLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryStatus('loading');
    setRecoveryMsg('');

    setTimeout(async () => {
        const users = await getUsers();
        const userExists = users.find(u => u.email.toLowerCase() === recoveryEmail.toLowerCase());

        if (userExists) {
            setRecoveryStatus('success');
            setRecoveryMsg(`Enlace enviado a ${recoveryEmail}.`);
        } else {
            setRecoveryStatus('error');
            setRecoveryMsg('Correo no registrado.');
        }
    }, 1200);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-3xl min-h-[450px] rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-200/60 transition-all duration-500">
        
        {/* Panel Lateral - Brand Info */}
        <div className="w-full md:w-[35%] bg-[#991b1b] text-white p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group shrink-0">
          <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-black/10 rounded-full blur-xl"></div>

          <div className="relative z-10 mb-6 transform transition-transform duration-500 group-hover:scale-105">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-xl shadow-xl">
              <Building2 size={32} className="text-white" strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-1 tracking-tighter uppercase">SISGEDO</h1>
            <p className="text-white/50 text-[9px] font-black tracking-[0.3em] mb-4 uppercase">DREM APURÍMAC</p>
            <p className="text-white/80 text-sm font-bold italic px-4 leading-tight">Seguimiento de Expedientes Regionales</p>
          </div>
        </div>

        {/* Panel Formulario */}
        <div className="w-full md:w-[65%] p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Acceso al Sistema</h2>
            <div className="h-1 w-10 bg-[#991b1b] rounded-full"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-[11px] font-black flex items-center gap-2 border border-red-100">
                <AlertCircle size={14} /> {error}
              </div>
            )}
            
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-[#991b1b] transition-colors">Usuario</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 group-focus-within:text-[#991b1b] transition-all z-10 pointer-events-none">
                    <User size={16} />
                </div>
                <input 
                  type="text" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full pl-14 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:border-[#991b1b] focus:ring-4 focus:ring-red-500/5 outline-none font-bold text-slate-800 text-sm bg-white shadow-sm transition-all placeholder:text-slate-300" 
                  placeholder="usuario@drem.gob.pe" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-[#991b1b] transition-colors">Contraseña</label>
                <button 
                  type="button" 
                  onClick={() => { setShowRecovery(true); setRecoveryStatus('idle'); setRecoveryEmail(''); }}
                  className="text-[9px] font-black text-[#991b1b] hover:underline uppercase tracking-wider"
                >
                  Olvidé mi clave
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 group-focus-within:text-[#991b1b] transition-all z-10 pointer-events-none">
                    <Lock size={16} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full pl-14 pr-12 py-3 rounded-xl border-2 border-slate-100 focus:border-[#991b1b] focus:ring-4 focus:ring-red-500/5 outline-none font-bold text-slate-800 text-sm bg-white shadow-sm transition-all placeholder:text-slate-300" 
                  placeholder="••••••••" 
                  required 
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-300 hover:text-[#991b1b] transition-colors rounded-lg z-20"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[#991b1b] hover:bg-red-800 text-white font-black py-4 rounded-xl shadow-lg shadow-red-900/10 transition-all flex items-center justify-center gap-3 mt-4 text-sm active:scale-95 disabled:opacity-70 group uppercase tracking-widest">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Ingresar <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center gap-2">
             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
             <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Sistema Operativo</p>
          </div>
        </div>
      </div>

      {/* RECOVERY MODAL */}
      {showRecovery && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[1.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 pb-2 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900 uppercase">Recuperar</h3>
              <button onClick={() => setShowRecovery(false)} className="text-slate-400 hover:text-red-700 transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 pt-2">
              {recoveryStatus === 'success' ? (
                <div className="text-center py-4 space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-[11px] font-bold text-slate-600">{recoveryMsg}</p>
                  <button onClick={() => setShowRecovery(false)} className="w-full bg-slate-900 text-white font-black py-3 rounded-xl uppercase text-[10px] tracking-widest">Cerrar</button>
                </div>
              ) : (
                <form onSubmit={handleRecovery} className="space-y-4">
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed">Ingrese su correo para restaurar acceso.</p>
                  <input 
                    type="email" 
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="correo@drem.gob.pe"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-none font-bold text-sm bg-white"
                  />
                  <button 
                    type="submit" 
                    disabled={recoveryStatus === 'loading'}
                    className="w-full bg-[#991b1b] text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
                  >
                    {recoveryStatus === 'loading' ? 'Cargando...' : 'Restablecer'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
