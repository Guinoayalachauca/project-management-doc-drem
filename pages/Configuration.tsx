
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Settings, Bell, Shield, Save, Database, RefreshCcw, Lock, Key, DownloadCloud } from 'lucide-react';
import { getSystemConfig, saveSystemConfig, saveUser } from '../services/dataService';
import { SystemConfig, User } from '../types';

type TabType = 'GENERAL' | 'SECURITY' | 'BACKUP' | 'NOTIFICATIONS';

interface ConfigurationProps {
    currentUser: User;
    onLogout: () => void;
}

const DEFAULT_CONFIG: SystemConfig = {
  institutionName: 'DREM Apurímac',
  currentYear: '2025',
  deadlineNormal: 7,
  deadlineUrgent: 2,
  autoNumbering: true,
  enable2FA: false,
  emailNotifications: true,
  systemMaintenanceMode: false
};

const Configuration: React.FC<ConfigurationProps> = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('GENERAL');
  const [isLoading, setIsLoading] = useState(false);
  // Fix: Initialize state with object, not promise
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
  
  // Security Tab State
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [securityMsg, setSecurityMsg] = useState('');

  useEffect(() => {
    // Fix: Handle promise from getSystemConfig
    getSystemConfig().then(setConfig);
  }, []);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setConfig(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
      }));
  };

  const handleSaveGeneral = () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
        saveSystemConfig(config);
        setIsLoading(false);
        alert('Configuración General Guardada Correctamente');
    }, 800);
  };

  const handleChangePassword = (e: React.FormEvent) => {
      e.preventDefault();
      setSecurityMsg('');

      if (passwords.new !== passwords.confirm) {
          setSecurityMsg('Las contraseñas no coinciden.');
          return;
      }
      if (currentUser.password && passwords.current !== currentUser.password) {
          setSecurityMsg('La contraseña actual es incorrecta.');
          return;
      }

      // Update User
      const updatedUser = { ...currentUser, password: passwords.new };
      saveUser(updatedUser); // This updates localStorage
      
      setSecurityMsg('Contraseña actualizada correctamente.');
      setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleCreateBackup = () => {
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        alert(`Copia de Seguridad generada exitosamente: backup_${new Date().toISOString().slice(0,10)}.sql`);
    }, 1500);
  };

  const TabButton = ({ id, icon: Icon, label }: { id: TabType, icon: any, label: string }) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 ${
            activeTab === id 
            ? 'bg-white text-red-700 font-bold shadow-sm border-l-4 border-red-600' 
            : 'hover:bg-white text-slate-600 font-medium'
        }`}
    >
        <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className="flex-1 bg-slate-50 w-full">
      <Header title="Configuración del Sistema" user={currentUser} onLogout={onLogout} />
      
      <main className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Config Navigation */}
            <div className="lg:col-span-1 space-y-2 flex flex-col md:flex-row lg:flex-col gap-2 md:gap-0 overflow-x-auto pb-2 md:pb-0">
                <TabButton id="GENERAL" icon={Settings} label="General" />
                <TabButton id="SECURITY" icon={Shield} label="Seguridad" />
                <TabButton id="BACKUP" icon={Database} label="Copias" />
                <TabButton id="NOTIFICATIONS" icon={Bell} label="Notificaciones" />
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
                
                {/* GENERAL TAB */}
                {activeTab === 'GENERAL' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 animate-fade-in">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Parámetros Generales</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Institución</label>
                                <input 
                                    name="institutionName"
                                    type="text" 
                                    value={config.institutionName} 
                                    onChange={handleConfigChange}
                                    className="w-full p-3 bg-white text-slate-900 rounded-md border border-slate-300 text-sm outline-none focus:border-red-500" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Año Fiscal Actual</label>
                                <input 
                                    name="currentYear"
                                    type="number" 
                                    value={config.currentYear} 
                                    onChange={handleConfigChange}
                                    className="w-32 p-3 bg-white text-slate-900 rounded-md border border-slate-300 text-sm outline-none focus:border-red-500" 
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Plazo Atención Normal (Días)</label>
                                    <input 
                                        name="deadlineNormal"
                                        type="number" 
                                        value={config.deadlineNormal} 
                                        onChange={handleConfigChange}
                                        className="w-full p-3 bg-white text-slate-900 rounded-md border border-slate-300 text-sm outline-none focus:border-red-500" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Plazo Atención Urgente (Días)</label>
                                    <input 
                                        name="deadlineUrgent"
                                        type="number" 
                                        value={config.deadlineUrgent} 
                                        onChange={handleConfigChange}
                                        className="w-full p-3 bg-white text-slate-900 rounded-md border border-slate-300 text-sm outline-none focus:border-red-500" 
                                    />
                                </div>
                            </div>
                            <div className="pt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        name="autoNumbering"
                                        type="checkbox" 
                                        checked={config.autoNumbering} 
                                        onChange={handleConfigChange}
                                        className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 bg-white" 
                                    />
                                    <span className="text-sm text-slate-700">Habilitar numeración automática de expedientes</span>
                                </label>
                            </div>
                            <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4 border-t border-slate-100 mt-6">
                                <button onClick={() => getSystemConfig().then(setConfig)} className="px-6 py-2.5 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center gap-2">
                                    <RefreshCcw size={18} /> Restaurar
                                </button>
                                <button onClick={handleSaveGeneral} disabled={isLoading} className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50">
                                    <Save size={18} /> {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === 'SECURITY' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 animate-fade-in">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                            <Shield className="text-red-600" /> Seguridad y Accesos
                        </h2>
                        
                        <div className="space-y-8">
                            <form onSubmit={handleChangePassword} className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2"><Lock size={18}/> Cambio de Contraseña ({currentUser.name})</h3>
                                {securityMsg && <p className={`text-xs font-bold mb-3 ${securityMsg.includes('correctamente') ? 'text-green-600' : 'text-red-600'}`}>{securityMsg}</p>}
                                
                                <div className="space-y-3 mt-3">
                                    <input 
                                        type="password" placeholder="Contraseña Actual" required
                                        value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})}
                                        className="w-full p-2 border border-orange-200 rounded bg-white text-slate-900 text-sm" 
                                    />
                                    <input 
                                        type="password" placeholder="Nueva Contraseña" required
                                        value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})}
                                        className="w-full p-2 border border-orange-200 rounded bg-white text-slate-900 text-sm" 
                                    />
                                    <input 
                                        type="password" placeholder="Confirmar Nueva Contraseña" required
                                        value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                                        className="w-full p-2 border border-orange-200 rounded bg-white text-slate-900 text-sm" 
                                    />
                                    <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-orange-700 w-full sm:w-auto">Actualizar Contraseña</button>
                                </div>
                            </form>

                            <div>
                                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Key size={18}/> Autenticación de Dos Factores (2FA)</h3>
                                <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <div>
                                        <span className="block font-medium text-slate-700">Habilitar 2FA globalmente</span>
                                        <span className="text-xs text-slate-500">Aumenta la seguridad solicitando verificación extra.</span>
                                    </div>
                                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input 
                                            name="enable2FA"
                                            type="checkbox" 
                                            checked={config.enable2FA}
                                            onChange={(e) => { handleConfigChange(e); handleSaveGeneral(); }} // Save immediately on toggle
                                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300"
                                        />
                                        <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${config.enable2FA ? 'bg-green-400' : 'bg-slate-300'}`}></div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* BACKUP TAB */}
                {activeTab === 'BACKUP' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 animate-fade-in">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-slate-100 gap-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Database className="text-blue-600" /> Copias de Seguridad
                            </h2>
                            <button 
                                onClick={handleCreateBackup} 
                                disabled={isLoading}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 flex items-center gap-2 shadow-md w-full sm:w-auto justify-center"
                            >
                                {isLoading ? <RefreshCcw className="animate-spin" size={16}/> : <DownloadCloud size={16}/>}
                                Generar Nueva Copia
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 mb-4">Historial de copias de seguridad generadas automáticamente por el sistema.</p>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm min-w-[500px]">
                                    <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-xs">
                                        <tr>
                                            <th className="p-3">Nombre del Archivo</th>
                                            <th className="p-3">Fecha</th>
                                            <th className="p-3">Tamaño</th>
                                            <th className="p-3 text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="p-3 font-mono text-slate-700">backup_2024_10_20.sql</td>
                                            <td className="p-3">20 Oct 2024, 18:00</td>
                                            <td className="p-3">45 MB</td>
                                            <td className="p-3 text-right text-blue-600 font-bold hover:underline cursor-pointer">Descargar</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-mono text-slate-700">backup_2024_10_13.sql</td>
                                            <td className="p-3">13 Oct 2024, 18:00</td>
                                            <td className="p-3">42 MB</td>
                                            <td className="p-3 text-right text-blue-600 font-bold hover:underline cursor-pointer">Descargar</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                 {/* NOTIFICATIONS TAB */}
                 {activeTab === 'NOTIFICATIONS' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 animate-fade-in">
                         <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                            <Bell className="text-yellow-600" /> Preferencias de Notificación
                        </h2>
                        
                        <div className="space-y-4">
                             <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                <div>
                                    <span className="block font-medium text-slate-700">Notificaciones por Correo</span>
                                    <span className="text-xs text-slate-500">Recibir alertas de derivaciones al email.</span>
                                </div>
                                <input 
                                    name="emailNotifications"
                                    type="checkbox" 
                                    checked={config.emailNotifications}
                                    onChange={(e) => { handleConfigChange(e); handleSaveGeneral(); }}
                                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500 bg-white"
                                />
                            </label>
                             <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                <div>
                                    <span className="block font-medium text-slate-700">Modo Mantenimiento</span>
                                    <span className="text-xs text-slate-500">Suspender notificaciones temporalmente.</span>
                                </div>
                                <input 
                                    name="systemMaintenanceMode"
                                    type="checkbox" 
                                    checked={config.systemMaintenanceMode}
                                    onChange={(e) => { handleConfigChange(e); handleSaveGeneral(); }}
                                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500 bg-white"
                                />
                            </label>
                        </div>
                    </div>
                 )}

            </div>
        </div>
      </main>
    </div>
  );
};

export default Configuration;
