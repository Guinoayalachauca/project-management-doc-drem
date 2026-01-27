
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { AREAS } from '../constants';
import { FileText, AlertCircle, ArrowRight, X, Edit, Trash2, Eye, Save, Check, MapPin, Building, User as UserIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { DocPriority, DocumentRecord, DocStatus, User } from '../types';
import { getDocuments, updateDocument, deleteDocument } from '../services/dataService';

const UBICACIONES = {
  "Abancay": ["Abancay", "Chacoche", "Circa", "Curahuasi", "Huanipaca", "Lambrama", "Pichirhua", "San Gabriel", "Tamburco"],
  "Andahuaylas": ["Andahuaylas", "Andarapa", "Chiara", "Huancarama", "Huancaray", "Huayana", "Kishuara", "Pacobamba", "Pacucha", "Pampachiri", "San Antonio de Cachi", "San Jerónimo", "San María de Chicmo", "Talavera", "Tumay Huaraca", "Turpo", "Kaquiabamba"],
  "Antabamba": ["Antabamba", "El Oro", "Huaquirca", "Juan Espinoza Medrano", "Oropesa", "Pachaconas", "Sabaino"],
  "Aymaraes": ["Chalhuanca", "Capaya", "Caraybamba", "Chaccrampa", "Cotaruse", "Huayllo", "Justo Apu Sahuaraura", "Lucre", "Pocohuanca", "San Juan de Chacña", "Sañayca", "Soraya", "Tapairihua", "Tintay", "Toraya", "Yanaca"],
  "Cotabambas": ["Tambobamba", "Cotabambas", "Coyllurqui", "Haquira", "Mara", "Challhuahuacho"],
  "Chincheros": ["Chincheros", "Anco_Huallo", "Cocharcas", "Huaccana", "Ocobamba", "Ongoy", "Uranmarca", "Ranracancha", "Rocchacc", "El Porvenir", "Los Chankas"],
  "Grau": ["Chuquibambilla", "Curasco", "Curpahuasi", "Huayllati", "Mamara", "Mariscal Gamarra", "Progreso", "Pataypampa", "San Antonio", "Santa Rosa", "Turpay", "Vilcabamba", "Virundo"]
};

const Inbox: React.FC<{ currentUser: User | null; onLogout: () => void }> = ({ currentUser, onLogout }) => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string>('TODOS');
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeriveModalOpen, setIsDeriveModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  
  const [editForm, setEditForm] = useState({ 
    administrado: '', subject: '', priority: DocPriority.NORMAL, status: DocStatus.PENDING, currentAreaId: '', ruc: '', province: 'Abancay', district: 'Abancay'
  });
  const [deriveForm, setDeriveForm] = useState({ toAreaId: AREAS[0].id, notes: '' });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
        const data = await getDocuments();
        setDocuments(data);
    } finally {
        setLoading(false);
    }
  };

  const handleOpenEdit = (doc: DocumentRecord) => {
    setSelectedDoc(doc);
    setEditForm({ 
      administrado: doc.administrado, subject: doc.subject, priority: doc.priority, status: doc.status, currentAreaId: doc.currentAreaId, ruc: doc.ruc || '', province: doc.province || 'Abancay', district: doc.district || 'Abancay'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;
    setIsProcessing(true);
    try {
        const updated = { ...selectedDoc, ...editForm };
        await updateDocument(updated);
        await refreshData();
        setIsEditModalOpen(false);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleDeriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;
    setIsProcessing(true);
    try {
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
        await refreshData();
        setIsDeriveModalOpen(false);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Eliminar permanentemente de Firebase?')) {
      setIsProcessing(true);
      try {
          await deleteDocument(id);
          await refreshData();
      } finally {
          setIsProcessing(false);
      }
    }
  };

  const inboxDocs = documents.filter(doc => {
    if (priorityFilter !== 'TODOS' && doc.priority !== priorityFilter) return false;
    if (doc.status === DocStatus.ARCHIVED) return false;
    return true;
  });

  const getAreaName = (id: string) => AREAS.find(a => a.id === id)?.name || id;
  const labelClass = "text-[11px] font-black text-slate-800 uppercase tracking-widest mb-2 block ml-1";
  const inputClass = "w-full p-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[#991b1b] transition-all";

  return (
    <div className="flex-1 bg-slate-50 w-full relative">
      <Header title="Bandeja de Entrada" user={currentUser} onLogout={onLogout} />
      
      {isProcessing && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <Loader2 className="animate-spin text-[#991b1b]" size={48}/>
          </div>
      )}

      <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                <button onClick={() => setPriorityFilter('TODOS')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${priorityFilter === 'TODOS' ? 'bg-[#991b1b] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>Todos</button>
                <button onClick={() => setPriorityFilter(DocPriority.URGENT)} className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${priorityFilter === DocPriority.URGENT ? 'bg-red-50 text-red-700' : 'text-slate-500'}`}><AlertCircle size={14} /> Urgentes</button>
            </div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest uppercase">
                {inboxDocs.length} Expedientes Sincronizados
            </div>
        </div>

        {loading ? (
            <div className="p-20 text-center"><Loader2 className="animate-spin text-[#991b1b] mx-auto" size={40}/></div>
        ) : (
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase text-slate-400 font-black tracking-widest">
                            <th className="p-6 pl-10">EXPEDIENTE / ADMINISTRADO</th>
                            <th className="p-6">UBICACIÓN</th>
                            <th className="p-6">PRIORIDAD</th>
                            <th className="p-6 text-right pr-10">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {inboxDocs.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="p-6 pl-10">
                                <span className="font-black text-slate-800 text-sm uppercase tracking-tight">{doc.code}</span>
                                <p className="text-[11px] text-slate-500 font-bold uppercase mt-0.5">{doc.administrado}</p>
                            </td>
                            <td className="p-6">
                                <span className="text-[10px] font-black text-slate-600 uppercase bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                                    {getAreaName(doc.currentAreaId)}
                                </span>
                            </td>
                            <td className="p-6">
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase border ${doc.priority === DocPriority.URGENT ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                    {doc.priority}
                                </span>
                            </td>
                            <td className="p-6 text-right pr-10">
                                <div className="flex items-center justify-end gap-1">
                                    <button onClick={() => {setSelectedDoc(doc); setIsViewModalOpen(true);}} className="p-2.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all"><Eye size={20} /></button>
                                    <button onClick={() => handleOpenEdit(doc)} className="p-2.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all"><Edit size={20} /></button>
                                    <button onClick={() => handleDelete(doc.id)} className="p-2.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                                    <button onClick={() => {setSelectedDoc(doc); setIsDeriveModalOpen(true);}} className="ml-4 bg-[#991b1b] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-md">DERIVAR <ArrowRight size={14} /></button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </main>

      {/* MODAL DERIVAR */}
      {isDeriveModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
             <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-black text-sm text-slate-800 flex items-center gap-3 uppercase">Derivación Firebase</h3>
                <button onClick={() => setIsDeriveModalOpen(false)} className="text-slate-400 hover:text-red-700 p-2"><X size={28}/></button>
             </div>
             <form onSubmit={handleDeriveSubmit} className="p-8 space-y-6">
                <div>
                   <label className={labelClass}>Oficina Destino</label>
                   <select value={deriveForm.toAreaId} onChange={e => setDeriveForm({...deriveForm, toAreaId: e.target.value})} className={inputClass}>
                      {AREAS.filter(a => a.id !== selectedDoc.currentAreaId).map(area => (
                        <option key={area.id} value={area.id}>{area.name}</option>
                      ))}
                   </select>
                </div>
                <div>
                   <label className={labelClass}>Nota de Instrucción</label>
                   <textarea rows={4} value={deriveForm.notes} onChange={e => setDeriveForm({...deriveForm, notes: e.target.value})} placeholder="Instrucciones..." className={inputClass + " resize-none"} />
                </div>
                <button type="submit" disabled={isProcessing} className="w-full bg-[#991b1b] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl active:scale-95 text-[11px] uppercase tracking-widest">
                   {isProcessing ? <Loader2 className="animate-spin" size={18}/> : <>CONFIRMAR DERIVACIÓN <CheckCircle2 size={18}/></>}
                </button>
             </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {isEditModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
             <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
                <h3 className="font-black text-lg text-slate-800 uppercase">Actualizar en Firebase</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-red-700"><X size={32}/></button>
             </div>
             <form onSubmit={handleSaveEdit} className="p-10 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Estado</label>
                        <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value as DocStatus})} className={inputClass}>
                            {Object.values(DocStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Ubicación</label>
                        <select value={editForm.currentAreaId} onChange={e => setEditForm({...editForm, currentAreaId: e.target.value})} className={inputClass}>
                            {AREAS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                   <label className={labelClass}>Administrado</label>
                   <input type="text" value={editForm.administrado} onChange={e => setEditForm({...editForm, administrado: e.target.value})} className={inputClass} />
                </div>
                <div>
                   <label className={labelClass}>Asunto</label>
                   <textarea rows={4} value={editForm.subject} onChange={e => setEditForm({...editForm, subject: e.target.value})} className={inputClass + " resize-none"} />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-8 py-4 text-slate-400 font-black uppercase text-[11px]">Cancelar</button>
                    <button type="submit" disabled={isProcessing} className="bg-blue-700 text-white font-black px-10 py-4 rounded-2xl flex items-center gap-3 text-[11px] uppercase tracking-widest shadow-xl">
                        {isProcessing ? <Loader2 className="animate-spin" size={18}/> : <>GUARDAR CAMBIOS <Save size={18}/></>}
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
