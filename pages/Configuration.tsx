import React, { useState } from 'react';
import Header from '../components/Header';
import { Settings, Bell, Shield, Save, Database, RefreshCcw, Lock, Key, DownloadCloud, CheckCircle } from 'lucide-react';

type TabType = 'GENERAL' | 'SECURITY' | 'BACKUP' | 'NOTIFICATIONS';

const Configuration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('GENERAL');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveGeneral = () => {
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        alert('Configuración General Guardada Correctamente');
    }, 1000);
  };

  const handleCreateBackup = () => {
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        alert('Copia de Seguridad generada exitosamente: backup_25_10_2024.sql');
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
    <div className="flex-1 bg-slate-50 ml-64">
      <Header title="Configuración del Sistema" />
      
      <main className="p-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Config Navigation */}
            <div className="lg:col-span-1 space-y-2">
                <TabButton id="GENERAL" icon={Settings} label="General" />
                <TabButton id="SECURITY" icon={Shield} label="Seguridad" />
                <TabButton id="BACKUP" icon={Database} label="Copias de Seguridad" />
                <TabButton id="NOTIFICATIONS" icon={Bell} label="Notificaciones" />
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
                
                {/* GENERAL TAB */}
                {activeTab === 'GENERAL' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-fade-in">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Parámetros Generales</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Institución</label>
                                <input type="text" defaultValue="Dirección Regional de Energía y Minas de Apurímac" className="w-full p-3 rounded-md border border-slate-300 text-sm outline-none focus:border-red-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Año Fiscal Actual</label>
                                <input type="number" defaultValue="2024" className="w-32 p-3 rounded-md border border-slate-300 text-sm outline-none focus:border-red-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Plazo Atención Normal (Días)</label>
                                    <input type="number" defaultValue="7" className="w-full p-3 rounded-md border border-slate-300 text-sm outline-none focus:border-red-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Plazo Atención Urgente (Días)</label>
                                    <input type="number" defaultValue="2" className="w-full p-3 rounded-md border border-slate-300 text-sm outline-none focus:border-red-500" />
                                </div>
                            </div>
                            <div className="pt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500" />
                                    <span className="text-sm text-slate-700">Habilitar numeración automática de expedientes</span>
                                </label>
                            </div>
                            <div className="pt-4 flex justify-end gap-4 border-t border-slate-100 mt-6">
                                <button className="px-6 py-2.5 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center gap-2">
                                    <RefreshCcw size={18} /> Restaurar
                                </button>
                                <button onClick={handleSaveGeneral} disabled={isLoading} className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 flex items-center gap-2 disabled:opacity-50">
                                    <Save size={18} /> {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === 'SECURITY' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-fade-in">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                            <Shield className="text-red-600" /> Seguridad y Accesos
                        </h2>
                        
                        <div className="space-y-8">
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2"><Lock size={18}/> Cambio de Contraseña de Administrador</h3>
                                <div className="space-y-3 mt-3">
                                    <input type="password" placeholder="Contraseña Actual" className="w-full p-2 border border-orange-200 rounded bg-white text-sm" />
                                    <input type="password" placeholder="Nueva Contraseña" className="w-full p-2 border border-orange-200 rounded bg-white text-sm" />
                                    <input type="password" placeholder="Confirmar Nueva Contraseña" className="w-full p-2 border border-orange-200 rounded bg-white text-sm" />
                                    <button className="bg-orange-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-orange-700">Actualizar Contraseña</button>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Key size={18}/> Autenticación de Dos Factores (2FA)</h3>
                                <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <div>
                                        <span className="block font-medium text-slate-700">Requerir 2FA para administradores</span>
                                        <span className="text-xs text-slate-500">Aumenta la seguridad solicitando un código al iniciar sesión.</span>
                                    </div>
                                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300"/>
                                        <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer"></label>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* BACKUP TAB */}
                {activeTab === 'BACKUP' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-fade-in">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Database className="text-blue-600" /> Copias de Seguridad
                            </h2>
                            <button 
                                onClick={handleCreateBackup} 
                                disabled={isLoading}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 flex items-center gap-2 shadow-md"
                            >
                                {isLoading ? <RefreshCcw className="animate-spin" size={16}/> : <DownloadCloud size={16}/>}
                                Generar Nueva Copia
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 mb-4">Historial de copias de seguridad generadas automáticamente por el sistema.</p>
                            
                            <table className="w-full text-left text-sm">
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
                                    <tr>
                                        <td className="p-3 font-mono text-slate-700">backup_2024_10_06.sql</td>
                                        <td className="p-3">06 Oct 2024, 18:00</td>
                                        <td className="p-3">38 MB</td>
                                        <td className="p-3 text-right text-blue-600 font-bold hover:underline cursor-pointer">Descargar</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                 {/* NOTIFICATIONS TAB */}
                 {activeTab === 'NOTIFICATIONS' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-fade-in flex flex-col items-center justify-center h-64">
                         <Bell size={48} className="text-slate-300 mb-4" />
                         <p className="text-slate-500 font-medium">Configuración de notificaciones en desarrollo.</p>
                    </div>
                 )}

            </div>
        </div>
      </main>
    </div>
  );
};

export default Configuration;