
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, CheckCircle, Clock, AlertCircle, ArrowRight, History } from 'lucide-react';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import { getDocuments } from '../services/dataService';
import { DocPriority, DocStatus, DocumentRecord, User } from '../types';
import { AREAS } from '../constants';

interface DashboardProps {
    currentUser: User | null;
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onLogout }) => {
  const [docs, setDocs] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocuments().then(data => {
        setDocs(data);
        setLoading(false);
    });
  }, []);

  const totalDocs = docs.length;
  const inProcess = docs.filter(d => d.status === DocStatus.IN_PROCESS).length;
  const archived = docs.filter(d => d.status === DocStatus.ARCHIVED).length;
  const urgent = docs.filter(d => d.priority === DocPriority.URGENT || d.priority === DocPriority.HIGH).length;

  const dataByStatus = [
    { name: 'En Proceso', value: inProcess, color: '#3b82f6' },
    { name: 'Archivados', value: archived, color: '#10b981' },
    { name: 'Derivados', value: docs.filter(d => d.status === DocStatus.DERIVED).length, color: '#8b5cf6' },
    { name: 'Pendientes', value: docs.filter(d => d.status === DocStatus.PENDING).length, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  const areas = ['MINERIA', 'ENERGIA', 'AMBIENTAL', 'LEGAL', 'ADMIN'];
  const dataByArea = areas.map(area => ({
    name: area,
    docs: docs.filter(d => d.currentAreaId === area).length
  }));

  // Obtener los últimos movimientos de todos los documentos para mostrar el "Flujo"
  const recentMovements = docs
    .flatMap(d => d.movements.map(m => ({ ...m, docCode: d.code, docSubject: d.subject })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getAreaName = (id: string) => AREAS.find(a => a.id === id)?.name || id;

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-white min-h-screen">
        <div className="w-12 h-12 border-4 border-red-100 border-t-red-800 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex-1 bg-slate-50/50 w-full">
      <Header title="Panel de Control" user={currentUser} onLogout={onLogout} />
      
      <main className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
        <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight uppercase">Bienvenido, {currentUser?.name}</h1>
            <p className="text-slate-500 mt-1 font-bold italic">SISGEDO - Dirección Regional de Energía y Minas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatsCard title="Total Expedientes" value={totalDocs} icon={<FileText size={28} />} color="blue" />
          <StatsCard title="En Trámite" value={inProcess} icon={<Clock size={28} />} color="yellow" />
          <StatsCard title="Archivados" value={archived} icon={<CheckCircle size={28} />} color="green" />
          <StatsCard title="Prioridad Alta" value={urgent} icon={<AlertCircle size={28} />} color="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gráfico de Barras */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-800 mb-8 uppercase border-l-4 border-red-800 pl-4 tracking-tight">Carga por Oficina</h3>
            <div className="h-64 md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataByArea}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} allowDecimals={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="docs" fill="#991b1b" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Flujo Reciente de Documentos */}
          <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-xl font-black text-slate-800 mb-6 uppercase border-l-4 border-red-800 pl-4 tracking-tight flex items-center gap-2">
                <History size={20} className="text-red-800"/> Flujo Reciente
            </h3>
            <div className="space-y-6 flex-1">
                {recentMovements.length > 0 ? recentMovements.map((move, i) => (
                    <div key={move.id} className="relative pl-6 border-l-2 border-slate-100">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-800 border-4 border-white shadow-sm"></div>
                        <div className="mb-1 flex justify-between items-start">
                            <span className="text-[10px] font-black text-red-800 uppercase tracking-widest">{move.docCode}</span>
                            <span className="text-[9px] text-slate-400 font-bold">{new Date(move.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-700 leading-tight mb-1">{move.action}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                            <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{getAreaName(move.fromAreaId)}</span>
                            <ArrowRight size={10} />
                            <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100 font-bold text-slate-800">{getAreaName(move.toAreaId)}</span>
                        </div>
                    </div>
                )) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                        <History size={48} className="mb-4 text-slate-300" />
                        <p className="text-sm font-bold text-slate-400">No hay movimientos registrados</p>
                    </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
