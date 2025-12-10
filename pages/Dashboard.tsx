import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import { getDocuments } from '../services/dataService';
import { DocPriority, DocStatus, DocumentRecord } from '../types';

const Dashboard: React.FC = () => {
  const [docs, setDocs] = useState<DocumentRecord[]>([]);

  useEffect(() => {
    setDocs(getDocuments());
  }, []);

  // Compute Stats
  const totalDocs = docs.length;
  const inProcess = docs.filter(d => d.status === DocStatus.IN_PROCESS).length;
  const archived = docs.filter(d => d.status === DocStatus.ARCHIVED).length;
  const urgent = docs.filter(d => d.priority === DocPriority.URGENT || d.priority === DocPriority.HIGH).length;

  // Chart Data: By Status
  const dataByStatus = [
    { name: 'En Proceso', value: inProcess, color: '#3b82f6' },
    { name: 'Archivados', value: archived, color: '#10b981' },
    { name: 'Derivados', value: docs.filter(d => d.status === DocStatus.DERIVED).length, color: '#8b5cf6' },
    { name: 'Pendientes', value: docs.filter(d => d.status === DocStatus.PENDING).length, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  // Chart Data: By Area (Simplified - in real app, group by ID)
  const areas = ['MINERIA', 'ENERGIA', 'AMBIENTAL', 'LEGAL', 'ADMIN'];
  const dataByArea = areas.map(area => ({
    name: area,
    docs: docs.filter(d => d.currentAreaId === area).length
  }));

  return (
    <div className="flex-1 bg-slate-50/50 w-full">
      <Header title="Panel de Control" />
      
      <main className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
        
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Bienvenido, Administrador</h1>
            <p className="text-slate-500 mt-1">Resumen de la actividad documental en tiempo real.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatsCard 
            title="Total Expedientes" 
            value={totalDocs} 
            icon={<FileText size={28} />} 
            color="blue" 
          />
          <StatsCard 
            title="En Trámite" 
            value={inProcess} 
            icon={<Clock size={28} />} 
            color="yellow" 
          />
          <StatsCard 
            title="Archivados" 
            value={archived} 
            icon={<CheckCircle size={28} />} 
            color="green" 
          />
          <StatsCard 
            title="Prioridad Alta" 
            value={urgent} 
            icon={<AlertCircle size={28} />} 
            color="red" 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-slate-800">Carga por Dirección</h3>
            </div>
            <div className="h-64 md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataByArea}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} allowDecimals={false} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}} 
                  />
                  <Bar dataKey="docs" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Chart */}
          <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Estado Actual</h3>
            <p className="text-sm text-slate-400 mb-8">Distribución global de documentos</p>
            
            <div className="h-64 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataByStatus}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {dataByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center pointer-events-none">
                 <span className="text-3xl font-bold text-slate-800">{totalDocs}</span>
                 <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-4">
                {dataByStatus.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm group cursor-default">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full transition-transform group-hover:scale-125" style={{backgroundColor: item.color}}></div>
                            <span className="text-slate-600 font-medium">{item.name}</span>
                        </div>
                        <span className="font-bold text-slate-800">{item.value}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;