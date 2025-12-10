import React, { useState } from 'react';
import { Building2, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';
import { authenticateUser } from '../services/dataService';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for effect
    setTimeout(() => {
      const user = authenticateUser(email, password);

      if (user) {
        onLogin(user);
      } else {
        setError('Credenciales incorrectas. Intente nuevamente.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-red-900 z-0"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-800 rounded-full blur-3xl opacity-20 z-0"></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden z-10 relative">
        
        {/* Left Side: Brand */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-red-900 to-red-800 text-white p-12 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-6 border border-white/20">
            <Building2 size={40} />
          </div>
          <h1 className="text-3xl font-bold mb-2">SISGEDO</h1>
          <h2 className="text-sm font-medium tracking-widest uppercase text-red-200 mb-8">DREM Apurímac</h2>
          <p className="text-red-100 text-sm leading-relaxed">
            Sistema de Gestión Documentaria Inteligente.<br/>
            Optimice el seguimiento, control y flujo de expedientes administrativos.
          </p>
          
          <div className="mt-12 text-xs text-red-300">
            &copy; 2024 Dirección Regional de Energía y Minas
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-800">Iniciar Sesión</h2>
            <p className="text-slate-500 text-sm mt-1">Ingrese sus credenciales para acceder al sistema.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center gap-2 border border-red-100">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase">Usuario / Correo</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
                  placeholder="admin@drem.gob.pe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input type="checkbox" className="rounded text-red-600 focus:ring-red-500 border-slate-300" />
                Recordarme
              </label>
              <a href="#" className="text-red-700 font-bold hover:underline">¿Olvidó su contraseña?</a>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="animate-pulse">Ingresando...</span>
              ) : (
                <>
                  Acceder al Sistema
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Login Helpers for Demo */}
          <div className="mt-8 pt-6 border-t border-slate-100">
             <p className="text-xs text-slate-400 mb-2 text-center">Accesos Rápidos (Demo):</p>
             <div className="flex gap-2 justify-center">
                <button type="button" onClick={() => {setEmail('admin@drem.gob.pe'); setPassword('admin');}} className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600">Admin</button>
                <button type="button" onClick={() => {setEmail('mesa@drem.gob.pe'); setPassword('mesa');}} className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600">Mesa</button>
                <button type="button" onClick={() => {setEmail('minas@drem.gob.pe'); setPassword('minas');}} className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600">Minas</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;