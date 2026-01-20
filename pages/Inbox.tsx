
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { AREAS } from '../constants';
import { FileText, AlertCircle, ArrowRight, X, Edit, Trash2, Eye, Save, Check, MapPin, Building, User as UserIcon, Calendar, Hash } from 'lucide-react';
import { DocPriority, DocumentRecord, DocStatus, User } from '../types';
import { getDocuments, updateDocument, deleteDocument } from '../services/dataService';

// Datos geográficos de Apurímac
const UBICACIONES = {
  "Abancay": ["Abancay", "Chacoche", "Circa", "Curahuasi", "Huanipaca", "Lambrama", "Pichirhua", "San Gabriel", "Tamburco"],
  "Andahuaylas": ["Andahuaylas", "Andarapa", "Chiara", "Huancarama", "Huancaray", "Huayana", "Kishuara", "Pacobamba", "Pacucha", "Pampachiri", "San Antonio de Cachi", "San Jerónimo", "San María de Chicmo", "Talavera", "Tumay Huaraca", "Turpo", "Kaquiabamba"],
  "Antabamba": ["Antabamba", "El Oro", "Huaquirca", "Juan Espinoza Medrano", "Oropesa", "Pachaconas", "Sabaino"],
  "Aymaraes": ["Chalhuanca", "Capaya", "Caraybamba", "Chaccrampa", "Cotaruse", "Huayllo", "Justo Apu Sahuaraura", "Lucre", "Pocohuanca", "San Juan de Chacña", "Sañayca", "Soraya", "Tapairihua", "Tintay", "Toraya", "Yanaca"],
  "Cotabambas": ["Tambobamba", "Cotabambas", "Coyllurqui", "Haquira", "Mara", "Challhuahuacho"],
  "Chincheros": ["Chincheros", "Anco_Huallo", "Cocharcas", "Huaccana", "Ocobamba", "Ongoy", "Uranmarca", "Ranracancha", "Rocchacc", "El Porvenir", "Los Chankas"],
  "Grau": ["Chuquibambilla", "Curasco", "Curpahuasi", "Huayllati", "Mamara", "Mariscal Gamarra", "Progreso", "Pataypampa", "San Antonio", "Santa Rosa", "Turpay", "Vilcabamba", "Virundo"]
};

interface InboxProps {
  currentUser: User | null;
  onLogout: () => void;
}

const Inbox: React.FC<InboxProps> = ({ currentUser, onLogout }) => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<string>('TODOS');
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeriveModalOpen, setIsDeriveModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  
  const [editForm, setEditForm] = useState({ 
    administrado: '', 
    subject: '', 
    priority: DocPriority.NORMAL,
    status: DocStatus.PENDING,
    currentAreaId: '',
    ruc: '',
    province: 'Abancay',
    district: 'Abancay'
  });
  const [deriveForm, setDeriveForm] = useState({ toAreaId: AREAS[0].id, notes: '' });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    const data = await getDocuments();
    setDocuments(data);
    setLoading(false);
  };

  const inboxDocs = documents.filter(doc => {
    if (priorityFilter !== 'TODOS' && doc.priority !== priorityFilter) return false;
    if (doc.status === DocStatus.ARCHIVED) return false;
    return true;
  });

  const handleOpenEdit = (doc: DocumentRecord) => {
    setSelectedDoc(doc);
    setEditForm({ 
      administrado: doc.administrado, 
      subject: doc.subject, 
      priority: doc.priority,
      status: doc.status,
      currentAreaId: doc.currentAreaId,
      ruc: doc.ruc || '',
      province: doc.province || 'Abancay',
      district: doc.district || 'Abancay'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;
    const updated = { ...selectedDoc, ...editForm };
    await updateDocument(updated);
    refreshData();
    setIsEditModalOpen(false);
  };

  const handleDeriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;
    const newMovement = {
      id: `mov-${Date.now()}`,
      documentId: selectedDoc.id,
      fromAreaId: selectedDoc.currentAreaId,
      toAreaId: deriveForm.toAreaId,
      date: new Date().toISOString(),
      action: 'Derivación',
      notes: deriveForm.notes,
      user: currentUser?.name || 'Sistema'
    };
    const updatedDoc: DocumentRecord = {
      ...selectedDoc,
      currentAreaId: deriveForm.toAreaId,
      status: DocStatus.DERIVED,
      movements: [...selectedDoc.movements, newMovement]
    };
    await updateDocument(updatedDoc);
    refreshData();
    setIsDeriveModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Eliminar permanentemente este expediente?')) {
      await deleteDocument(id);
      refreshData();
    }
  };

  const getAreaName = (id: string) => AREAS.find(a => a.id === id)?.name || id;

  const labelClass = "text-[11px] font-black text-slate-800 uppercase tracking-widest mb-2 block ml-1";
  const inputClass = "w-full p-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[#991b1b] transition-all placeholder:text-slate-300";

  return (
    <div className="flex-1 bg-[#f8fafc] w-full relative">
      <Header title="Bandeja de Entrada" user={currentUser} onLogout={onLogout} />
      
      <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                <button onClick={() => setPriorityFilter('TODOS')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${priorityFilter === 'TODOS' ? 'bg-[#991b1b] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>Todos</button>
                <button onClick={() => setPriorityFilter(DocPriority.URGENT)} className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${priorityFilter === DocPriority.URGENT ? 'bg-red-50 text-red-700' : 'text-slate-500'}`}><AlertCircle size={14} /> Urgentes</button>
            </div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                {inboxDocs.length} Expedientes en curso
            </div>
        </div>

        {loading ? (
            <div className="p-20 text-center"><div className="w-10 h-10 border-4 border-red-100 border-t-red-800 rounded-full animate-spin mx-auto"></div></div>
        ) : (
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase text-slate-400 font-black tracking-widest">
                        <th className="p-6 pl-10 w-16 text-center">N°</th>
                        <th className="p-6">EXPEDIENTE / ADMINISTRADO</th>
                        <th className="p-6">UBICACIÓN</th>
                        <th className="p-6">PRIORIDAD</th>
                        <th className="p-6 text-right pr-10">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {inboxDocs.map((doc, idx) => (
                        <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="p-6 pl-10 text-slate-300 font-black text-xs text-center">{idx + 1}</td>
                            <td className="p-6">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-black text-slate-800 text-sm uppercase tracking-tight">{doc.code}</span>
                                    {doc.status === DocStatus.PENDING && <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>}
                                </div>
                                <p className="text-[11px] text-slate-500 font-bold uppercase truncate max-w-[300px]">{doc.administrado}</p>
                            </td>
                            <td className="p-6">
                                <span className="text-[10px] font-black text-slate-600 uppercase bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                                    {getAreaName(doc.currentAreaId)}
                                </span>
                            </td>
                            <td className="p-6">
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase border shadow-sm ${doc.priority === DocPriority.URGENT ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                    {doc.priority}
                                </span>
                            </td>
                            <td className="p-6 text-right pr-10">
                                <div className="flex items-center justify-end gap-1">
                                    <button onClick={() => {setSelectedDoc(doc); setIsViewModalOpen(true);}} className="p-2.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all" title="Ver Ficha Técnica"><Eye size={20} /></button>
                                    <button onClick={() => handleOpenEdit(doc)} className="p-2.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all" title="Editar Información"><Edit size={20} /></button>
                                    <button onClick={() => handleDelete(doc.id)} className="p-2.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all" title="Eliminar"><Trash2 size={20} /></button>
                                    <button onClick={() => {setSelectedDoc(doc); setIsDeriveModalOpen(true);}} className="ml-4 bg-[#991b1b] text-white hover:bg-red-800 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-md active:scale-95">DERIVAR <ArrowRight size={14} /></button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        )}
      </main>

      {/* MODAL VER DETALLES (OJO) */}
      {isViewModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
             <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                   <h3 className="font-black text-xl text-slate-800 flex items-center gap-3 uppercase tracking-tight"><FileText size={24} className="text-[#991b1b]"/> Ficha Técnica del Expediente</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{selectedDoc.code} • SISGEDO DREM APURÍMAC</p>
                </div>
                <button onClick={() => setIsViewModalOpen(false)} className="text-slate-400 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-all"><X size={28}/></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <section>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Datos del Administrado</label>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 shadow-inner">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-200"><UserIcon size={20}/></div>
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase">Titular / Empresa</p>
                                        <p className="font-black text-slate-800 uppercase leading-tight mt-1">{selectedDoc.administrado}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-200"><Hash size={20}/></div>
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase">RUC / Documento</p>
                                        <p className="font-black text-slate-800 mt-1">{selectedDoc.ruc || 'No registrado'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-200"><MapPin size={20}/></div>
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase">Lugar de Origen</p>
                                        <p className="font-black text-slate-800 mt-1 uppercase">{selectedDoc.district}, {selectedDoc.province}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Estado Actual</label>
                            <div className="flex items-center gap-4 bg-red-50/50 p-6 rounded-2xl border border-red-100">
                                <div className="w-12 h-12 bg-red-900 text-white rounded-xl flex items-center justify-center shadow-lg"><Building size={24}/></div>
                                <div>
                                    <p className="text-xs font-black text-red-900/50 uppercase">Ubicación Física</p>
                                    <p className="font-black text-red-900 uppercase text-lg leading-none mt-1">{getAreaName(selectedDoc.currentAreaId)}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <section>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Resumen del Asunto</label>
                            <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 italic font-bold text-slate-700 leading-relaxed shadow-sm">
                                "{selectedDoc.subject}"
                            </div>
                        </section>

                        <section>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Línea de Tiempo (Movimientos)</label>
                            <div className="space-y-4 max-h-60 overflow-y-auto pr-4 scrollbar-thin">
                                {selectedDoc.movements.map((m, i) => (
                                    <div key={m.id} className="relative pl-6 border-l-2 border-slate-100 py-1">
                                        <div className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full border-4 border-white shadow-sm ${i === selectedDoc.movements.length - 1 ? 'bg-red-700 animate-pulse' : 'bg-slate-300'}`}></div>
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-[11px] font-black text-slate-800 uppercase">{m.action}</p>
                                            <span className="text-[9px] font-black text-slate-400">{new Date(m.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">{getAreaName(m.toAreaId)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
             </div>
             <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button onClick={() => setIsViewModalOpen(false)} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl">Cerrar Visor</button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL DERIVAR */}
      {isDeriveModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
             <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-black text-sm text-slate-800 flex items-center gap-3 uppercase"><ArrowRight size={20} className="text-[#991b1b]"/> Derivación de Documento</h3>
                <button onClick={() => setIsDeriveModalOpen(false)} className="text-slate-400 hover:text-red-700 p-2 rounded-full"><X size={28}/></button>
             </div>
             <form onSubmit={handleDeriveSubmit} className="p-8 space-y-6">
                <div>
                   <label className={labelClass}>Oficina de Destino</label>
                   <select value={deriveForm.toAreaId} onChange={e => setDeriveForm({...deriveForm, toAreaId: e.target.value})} className={inputClass}>
                      {AREAS.filter(a => a.id !== selectedDoc.currentAreaId).map(area => (
                        <option key={area.id} value={area.id}>{area.name}</option>
                      ))}
                   </select>
                </div>
                <div>
                   <label className={labelClass}>Proveído / Nota de Instrucción</label>
                   <textarea rows={4} value={deriveForm.notes} onChange={e => setDeriveForm({...deriveForm, notes: e.target.value})} placeholder="Instrucciones para la siguiente área..." className={inputClass + " resize-none"} />
                </div>
                <button type="submit" className="w-full bg-[#991b1b] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-800 transition-all shadow-xl shadow-red-900/20 active:scale-95 text-[11px] uppercase tracking-[0.2em]">
                   CONFIRMAR ENVÍO <Check size={18}/>
                </button>
             </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR EXPANDIDO */}
      {isEditModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
             <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                    <h3 className="font-black text-lg text-slate-800 flex items-center gap-3 uppercase"><Edit size={22} className="text-blue-700"/> Modificar Expediente</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{selectedDoc.code}</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-all"><X size={28}/></button>
             </div>
             <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-10 space-y-8">
                
                {/* SECCIÓN 1: ESTADO Y UBICACIÓN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Estado del Trámite</label>
                        <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value as DocStatus})} className={inputClass}>
                            {Object.values(DocStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Ubicación (Oficina)</label>
                        <select value={editForm.currentAreaId} onChange={e => setEditForm({...editForm, currentAreaId: e.target.value})} className={inputClass}>
                            {AREAS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* SECCIÓN 2: ADMINISTRADO */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-3">
                        <label className={labelClass}>Administrado / Titular</label>
                        <input type="text" value={editForm.administrado} onChange={e => setEditForm({...editForm, administrado: e.target.value})} className={inputClass} placeholder="Nombre completo o Razón Social" />
                    </div>
                    <div className="md:col-span-1">
                        <label className={labelClass}>RUC / ID</label>
                        <input type="text" maxLength={11} value={editForm.ruc} onChange={e => setEditForm({...editForm, ruc: e.target.value})} className={inputClass} placeholder="20123456789" />
                    </div>
                </div>

                {/* SECCIÓN 3: LUGAR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Provincia</label>
                        <select 
                            value={editForm.province} 
                            onChange={e => setEditForm({...editForm, province: e.target.value, district: UBICACIONES[e.target.value as keyof typeof UBICACIONES][0]})} 
                            className={inputClass}
                        >
                            {Object.keys(UBICACIONES).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Distrito</label>
                        <select 
                            value={editForm.district} 
                            onChange={e => setEditForm({...editForm, district: e.target.value})} 
                            className={inputClass}
                        >
                            {UBICACIONES[editForm.province as keyof typeof UBICACIONES].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>

                {/* SECCIÓN 4: ASUNTO Y PRIORIDAD */}
                <div>
                    <label className={labelClass}>Asunto / Sumilla</label>
                    <textarea rows={4} value={editForm.subject} onChange={e => setEditForm({...editForm, subject: e.target.value})} className={inputClass + " resize-none"} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Prioridad</label>
                        <select value={editForm.priority} onChange={e => setEditForm({...editForm, priority: e.target.value as DocPriority})} className={inputClass}>
                            {Object.values(DocPriority).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-8 py-4 text-slate-400 font-black uppercase text-[11px] tracking-widest hover:text-slate-600">Cancelar</button>
                    <button type="submit" className="bg-blue-700 text-white font-black px-10 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 active:scale-95 text-[11px] uppercase tracking-[0.2em]">
                        ACTUALIZAR DATOS <Save size={18}/>
                    </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;
