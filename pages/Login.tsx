
import React, { useState } from 'react';
import { Building2, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff, X, Send, CheckCircle2 } from 'lucide-react';
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
            setError('Credenciales no válidas. Revise su usuario o contraseña.');
            setIsLoading(false);
        }
    } catch (err) {
        setError('Error de conexión con el servidor regional.');
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
            setRecoveryMsg(`Se ha enviado un enlace de restauración a ${recoveryEmail}. Por favor, revise su bandeja de entrada.`);
        } else {
            setRecoveryStatus('error');
            setRecoveryMsg('El correo electrónico ingresado no está registrado en el sistema SISGEDO.');
        }
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="bg-white w-full max-w-5xl min-h-[600px] rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] flex flex-col md:flex-row overflow-hidden border border-slate-200/60 transition-all duration-500">
        
        {/* Panel Lateral - Brand Info */}
        <div className="w-full md:w-[42%] bg-[#991b1b] text-white p-10 md:p-14 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          {/* Decorative background elements */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>

          <div className="relative z-10 mb-8 transform transition-transform duration-500 group-hover:scale-105">
            <div className="w-24 h-24 md:w-28 md:h-28 bg-white/10 rounded-[2.5rem] flex items-center justify-center border border-white/20 backdrop-blur-xl shadow-2xl">
              <Building2 size={56} className="text-white drop-shadow-lg" strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-black mb-1 tracking-tighter leading-none">SISGEDO</h1>
            <p className="text-white/60 text-[10px] md:text-xs font-black tracking-[0.4em] mb-12 uppercase">DREM APURÍMAC</p>
            <p className="text-white/90 text-lg md:text-xl max-w-[280px] leading-tight font-bold italic">Gestión Documentaria y Seguimiento de Expedientes Regionales.</p>
          </div>

          <div className="absolute bottom-8 text-[10px] text-white/30 font-black uppercase tracking-widest px-8 w-full border-t border-white/5 pt-6 hidden md:block">
            Oficina de Tecnologías de la Información
          </div>
        </div>

        {/* Panel Formulario */}
        <div className="w-full md:w-[58%] p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">Iniciar Sesión</h2>
            <div className="h-1.5 w-12 bg-[#991b1b] rounded-full hidden md:block"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-black flex items-center gap-3 border border-red-100 animate-in slide-in-from-top-2 duration-300">
                <AlertCircle size={18} /> {error}
              </div>
            )}
            
            <div className="space-y-2 group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-[#991b1b] transition-colors">Usuario (Email)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-focus-within:text-[#991b1b] transition-all">
                    <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full pl-16 pr-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#991b1b] focus:ring-4 focus:ring-red-500/5 outline-none font-bold text-slate-800 bg-white shadow-sm transition-all placeholder:text-slate-300" 
                  placeholder="usuario@drem.gob.pe" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-[#991b1b] transition-colors">Contraseña</label>
                <button 
                  type="button" 
                  onClick={() => { setShowRecovery(true); setRecoveryStatus('idle'); setRecoveryEmail(''); }}
                  className="text-[10px] font-black text-[#991b1b] hover:text-red-800 hover:underline uppercase tracking-wider transition-colors"
                >
                  ¿Olvidó su clave?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-focus-within:text-[#991b1b] transition-all">
                    <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full pl-16 pr-14 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#991b1b] focus:ring-4 focus:ring-red-500/5 outline-none font-bold text-slate-800 bg-white shadow-sm transition-all placeholder:text-slate-300" 
                  placeholder="••••••••" 
                  required 
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-300 hover:text-[#991b1b] transition-colors rounded-xl"
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[#991b1b] hover:bg-red-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-red-900/10 transition-all flex items-center justify-center gap-4 mt-6 text-base md:text-lg active:scale-95 disabled:opacity-70 group uppercase tracking-widest">
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Acceder al Sistema <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center gap-2">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Servidor Regional Operativo</p>
          </div>
        </div>
      </div>

      {/* RECOVERY MODAL */}
      {showRecovery && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="p-8 pb-4 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Restaurar Acceso</h3>
              <button onClick={() => setShowRecovery(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-red-700"><X size={24} /></button>
            </div>
            
            <div className="p-8 pt-2">
              {recoveryStatus === 'success' ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 size={44} />
                  </div>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed px-4">{recoveryMsg}</p>
                  <button 
                    onClick={() => setShowRecovery(false)} 
                    className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl uppercase text-[11px] tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
                  >
                    Volver al login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRecovery} className="space-y-6">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wide leading-relaxed">Ingrese su correo institucional registrado para enviar las instrucciones.</p>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="email" 
                        required
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="usuario@drem.gob.pe"
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none font-bold text-slate-700 bg-white transition-all shadow-sm ${recoveryStatus === 'error' ? 'border-red-100 bg-red-50/20' : 'border-slate-100 focus:border-[#991b1b]'}`}
                      />
                    </div>
                  </div>

                  {recoveryStatus === 'error' && (
                    <div className="flex items-start gap-2 text-[11px] text-red-600 font-bold bg-red-50 p-4 rounded-2xl border border-red-100 animate-in slide-in-from-top-1">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{recoveryMsg}</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={recoveryStatus === 'loading'}
                    className="w-full bg-[#991b1b] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-800 shadow-xl shadow-red-900/10 transition-all active:scale-95 disabled:opacity-50 text-[11px] uppercase tracking-widest"
                  >
                    {recoveryStatus === 'loading' ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Send size={16} /> Enviar Instrucciones</>}
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
