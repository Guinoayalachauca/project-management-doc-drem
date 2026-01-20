
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import { BarChart3, Calendar, Filter, Activity, ArrowUpCircle, ArrowDownCircle, Target, Clock, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import { getDocuments } from '../services/dataService';
import { DocPriority, DocStatus, DocumentRecord, User } from '../types';
import { AREAS } from '../constants';

const Statistics: React.FC<{ currentUser: User | null; onLogout: () => void }> = ({ currentUser, onLogout }) => {
  const [docs, setDocs] = useState<DocumentRecord[]>([]);
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('ALL'); // ALL, 0, 1, ..., 11
  const [selectedDay, setSelectedDay] = useState('ALL'); // ALL, 1, 2, ..., 31
  
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  const months = [
    { id: 'ALL', name: 'Todos los Meses' },
    { id: '0', name: 'Enero' }, { id: '1', name: 'Febrero' }, { id: '2', name: 'Marzo' },
    { id: '3', name: 'Abril' }, { id: '4', name: 'Mayo' }, { id: '5', name: 'Junio' },
    { id: '6', name: 'Julio' }, { id: '7', name: 'Agosto' }, { id: '8', name: 'Septiembre' },
    { id: '9', name: 'Octubre' }, { id: '10', name: 'Noviembre' }, { id: '11', name: 'Diciembre' }
  ];

  useEffect(() => {
    getDocuments().then(data => {
      const years = Array.from(new Set(data.map(d => d.year))).sort((a, b) => b.localeCompare(a));
      setAvailableYears(years);
      setDocs(data);
    });
  }, []);

  // Filtrado Lógico Principal
  const filterByTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const yearMatch = d.getFullYear().toString() === selectedYear;
    const monthMatch = selectedMonth === 'ALL' || d.getMonth().toString() === selectedMonth;
    const dayMatch = selectedDay === 'ALL' || d.getDate().toString() === selectedDay;
    return yearMatch && monthMatch && dayMatch;
  };

  // Cálculo de ENTRADAS (Documentos registrados en el periodo)
  const entries = docs.filter(d => filterByTime(d.registerDate));
  
  // Cálculo de SALIDAS (Movimientos de Derivación o Archivamiento en el periodo)
  const exits = docs.flatMap(d => d.movements).filter(m => 
    (m.action === 'Derivación' || m.action === 'Archivado') && filterByTime(m.date)
  );

  const totalEntries = entries.length;
  const totalExits = exits.length;
  
  // KPIs Derivados
  const inProcess = entries.filter(d => d.status === DocStatus.IN_PROCESS).length;
  const archived = entries.filter(d => d.status === DocStatus.ARCHIVED).length;
  const urgent = entries.filter(d => d.priority === DocPriority.URGENT || d.priority === DocPriority.HIGH).length;

  // Gráfico 1: Comparativa Temporal (Entradas vs Salidas)
  // Generamos datos para el gráfico según el filtro
  let comparisonData: any[] = [];
  if (selectedMonth === 'ALL') {
    // Si todos los meses, agrupar por mes
    comparisonData = months.slice(1).map((m, idx) => ({
        label: m.name.substring(0,3),
        entradas: docs.filter(d => d.year === selectedYear && new Date(d.registerDate).getMonth() === idx).length,
        salidas: docs.flatMap(d => d.movements).filter(mov => 
            new Date(mov.date).getFullYear().toString() === selectedYear && 
            new Date(mov.date).getMonth() === idx && 
            (mov.action === 'Derivación' || mov.action === 'Archivado')
        ).length
    }));
  } else {
    // Si un mes específico, agrupar por días (muestreo de 1 a 31)
    comparisonData = Array.from({length: 31}, (_, i) => ({
        label: (i + 1).toString(),
        entradas: docs.filter(d => {
            const date = new Date(d.registerDate);
            return date.getFullYear().toString() === selectedYear && 
                   date.getMonth().toString() === selectedMonth && 
                   date.getDate() === (i + 1);
        }).length,
        salidas: docs.flatMap(d => d.movements).filter(mov => {
            const date = new Date(mov.date);
            return date.getFullYear().toString() === selectedYear && 
                   date.getMonth().toString() === selectedMonth && 
                   date.getDate() === (i + 1) &&
                   (mov.action === 'Derivación' || mov.action === 'Archivado');
        }).length
    }));
  }

  // Gráfico 2: Carga por Área
  const areaData = AREAS.map(area => ({
    name: area.name.split(' ')[0],
    docs: entries.filter(d => d.currentAreaId === area.id).length
  })).sort((a, b) => b.docs - a.docs);

  const labelStyle = "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-l-4 border-[#991b1b] pl-3 flex items-center gap-2";

  return (
    <div className="flex-1 bg-slate-50 w-full min-h-screen">
      <Header title="Análisis de Tráfico Documentario" user={currentUser} onLogout={onLogout} />
      
      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* PANEL DE FILTROS AVANZADOS */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-3 shrink-0">
                <div className="p-2 bg-red-50 text-red-800 rounded-xl"><Filter size={20} /></div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Filtros Temporales</h2>
            </div>
            
            <div className="flex flex-wrap gap-4 w-full">
                <div className="flex-1 min-w-[120px]">
                    <span className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">Año Fiscal</span>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black outline-none focus:border-red-800">
                        {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                        {availableYears.length === 0 && <option value="2026">2026</option>}
                    </select>
                </div>

                <div className="flex-1 min-w-[160px]">
                    <span className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">Mes de Gestión</span>
                    <select value={selectedMonth} onChange={(e) => {setSelectedMonth(e.target.value); setSelectedDay('ALL');}} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black outline-none focus:border-red-800">
                        {months.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                </div>

                <div className="flex-1 min-w-[120px]">
                    <span className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">Día Específico</span>
                    <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black outline-none focus:border-red-800">
                        <option value="ALL">Todos los Días</option>
                        {Array.from({length: 31}, (_, i) => (
                            <option key={i+1} value={i+1}>Día {i+1}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>

        {/* TOP KPIs RESUMEN */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-red-200 transition-all">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entradas</span>
                    <ArrowUpCircle className="text-blue-500" size={20} />
                </div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{totalEntries}</h4>
                <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-wide">Documentos ingresados</p>
            </div>
            
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-red-200 transition-all">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Salidas</span>
                    <ArrowDownCircle className="text-emerald-500" size={20} />
                </div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{totalExits}</h4>
                <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-wide">Trámites despachados</p>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-red-200 transition-all">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance</span>
                    <Activity className="text-orange-500" size={20} />
                </div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{totalEntries - totalExits}</h4>
                <p className="text-[9px] font-bold text-orange-600 mt-2 uppercase tracking-wide">Pendientes por despachar</p>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-red-200 transition-all">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Urgencia</span>
                    <Target className="text-red-700" size={20} />
                </div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{urgent}</h4>
                <p className="text-[9px] font-bold text-red-600 mt-2 uppercase tracking-wide">Atención Inmediata</p>
            </div>
        </div>

        {/* GRÁFICO PRINCIPAL: ENTRADAS VS SALIDAS */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h5 className={labelStyle}>Flujo de Trabajo: Ingresos vs Egresos ({selectedYear})</h5>
            <div className="h-96 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={comparisonData}>
                        <defs>
                            <linearGradient id="colorEntries" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorExits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                        <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', fontWeight: 'bold'}} />
                        <Legend iconType="circle" />
                        <Area type="monotone" name="Ingresos (Entradas)" dataKey="entradas" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEntries)" />
                        <Area type="monotone" name="Despachos (Salidas)" dataKey="salidas" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorExits)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Carga por Área */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h5 className={labelStyle}>Expedientes Activos por Oficina</h5>
                <div className="h-80 mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={areaData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontStyle: 'bold', fill: '#64748b'}} width={80} />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}} />
                            <Bar name="Cantidad" dataKey="docs" fill="#991b1b" radius={[0, 10, 10, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Eficiencia del Periodo */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-center">
                <h5 className={labelStyle}>Eficacia Operativa</h5>
                <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-100" />
                            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" 
                                strokeDasharray={552.92} 
                                strokeDashoffset={552.92 - (552.92 * (totalEntries > 0 ? (totalExits/totalEntries) : 0))} 
                                className="text-red-800 transition-all duration-1000" 
                            />
                        </svg>
                        <div className="absolute text-center">
                            <span className="text-4xl font-black text-slate-900">{totalEntries > 0 ? Math.round((totalExits/totalEntries)*100) : 0}%</span>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Productividad</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-10 w-full px-4">
                        <div className="text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Días Promedio</p>
                            <p className="text-2xl font-black text-slate-900">4.2</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Tasa Retraso</p>
                            <p className="text-2xl font-black text-red-600">8%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
};

export default Statistics;
