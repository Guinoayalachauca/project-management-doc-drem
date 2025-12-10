import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { AREAS } from '../constants';
import { FileText, AlertCircle, ArrowRight, Send, Clock, CheckCircle, X, Filter, MoreHorizontal } from 'lucide-react';
import { DocPriority, DocumentRecord, DocStatus } from '../types';
import { getDocuments, updateDocument } from '../services/dataService';

const Inbox: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string>('TODOS');
  const [isDeriveModalOpen, setIsDeriveModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [deriveData, setDeriveData] = useState({ toAreaId: '', status: DocStatus.IN_PROCESS, notes: '' });

  // Load Data
  useEffect(() => {
    setDocuments(getDocuments());
  }, []);

  // Filter Logic
  const inboxDocs = documents.filter(doc => {
    // Filter by priority
    if (priorityFilter !== 'TODOS' && doc.priority !== priorityFilter) return false;
    // Don't show archived docs in Inbox (optional logic)
    if (doc.status === DocStatus.ARCHIVED) return false;
    return true;
  });

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case DocPriority.URGENT: return { class: 'bg-red-50 text-red-700 ring-red-600/20', icon: AlertCircle };
      case DocPriority.HIGH: return { class: 'bg-orange-50 text-orange-700 ring-orange-600/20', icon: AlertCircle };
      case DocPriority.NORMAL: return { class: 'bg-blue-50 text-blue-700 ring-blue-600/20', icon: Clock };
      default: return { class: 'bg-slate-50 text-slate-600 ring-slate-500/20', icon: Clock };
    }
  };

  const getDeadlineInfo = (dateStr: string, priority: string) => {
    const registerDate = new Date(dateStr);
    const today = new Date();
    let daysAllowed = 7;
    if (priority === DocPriority.URGENT) daysAllowed = 2;
    if (priority === DocPriority.HIGH) daysAllowed = 4;
    
    const deadline = new Date(registerDate);
    deadline.setDate(registerDate.getDate() + daysAllowed);
    
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `Venció hace ${Math.abs(diffDays)}d`, color: 'text-red-600 bg-red-50', icon: <AlertCircle size={14}/> };
    if (diffDays === 0) return { text: 'Vence hoy', color: 'text-orange-600 bg-orange-50', icon: <Clock size={14}/> };
    return { text: `${diffDays} días restantes`, color: 'text-emerald-600 bg-emerald-50', icon: <CheckCircle size={14}/> };
  };

  const openDeriveModal = (doc: DocumentRecord) => {
    setSelectedDoc(doc);
    setDeriveData({ toAreaId: AREAS[0].id, status: DocStatus.DERIVED, notes: '' });
    setIsDeriveModalOpen(true);
  };

  const handleDeriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;

    // Create Update Object
    const updatedDoc = { ...selectedDoc };
    updatedDoc.status = deriveData.status;
    updatedDoc.currentAreaId = deriveData.toAreaId;
    
    // Add Movement
    updatedDoc.movements.push({
        id: `mov-${Date.now()}`,
        documentId: selectedDoc.id,
        fromAreaId: selectedDoc.currentAreaId,
        toAreaId: deriveData.toAreaId,
        date: new Date().toISOString(),
        action: 'Derivación',
        notes: deriveData.notes,
        user: 'Usuario Actual' // Should come from auth context
    });

    // Save
    updateDocument(updatedDoc);
    
    // Refresh Local State
    setDocuments(getDocuments());
    setIsDeriveModalOpen(false);
    alert('Documento derivado y actualizado exitosamente.');
  };

  return (
    <div className="flex-1 bg-slate-50/50 w-full relative">
      <Header title="Bandeja de Entrada" />
      
      <main className="p-4 md:p-8 max-w-[1600px] mx-auto">
        {/* Filters Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2 md:gap-4 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                <button 
                  onClick={() => setPriorityFilter('TODOS')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${priorityFilter === 'TODOS' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Todos
                </button>
                <div className="hidden md:block w-px h-6 bg-slate-200"></div>
                <button 
                  onClick={() => setPriorityFilter(DocPriority.URGENT)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${priorityFilter === DocPriority.URGENT ? 'bg-red-50 text-red-700 ring-1 ring-red-200' : 'text-slate-600 hover:text-red-600'}`}
                >
                  <AlertCircle size={14} /> Urgentes
                </button>
                 <button 
                  onClick={() => setPriorityFilter(DocPriority.HIGH)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${priorityFilter === DocPriority.HIGH ? 'bg-orange-50 text-orange-700 ring-1 ring-orange-200' : 'text-slate-600 hover:text-orange-600'}`}
                >
                  Alta Prioridad
                </button>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                <Filter size={14} />
                {inboxDocs.length} docs.
            </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                  <th className="p-5 pl-8 w-16">#</th>
                  <th className="p-5">Expediente / Asunto</th>
                  <th className="p-5">Ubicación Actual</th>
                  <th className="p-5">Prioridad</th>
                  <th className="p-5">Plazo</th>
                  <th className="p-5 text-right pr-8">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inboxDocs.map((doc, idx) => {
                  const deadline = getDeadlineInfo(doc.registerDate, doc.priority);
                  const priorityStyle = getPriorityInfo(doc.priority);
                  const PriorityIcon = priorityStyle.icon;

                  return (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="p-5 pl-8 text-slate-400 font-mono text-sm">{idx + 1}</td>
                    <td className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                          <FileText size={20} />
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 text-base group-hover:text-blue-700 transition-colors block mb-1">{doc.code}</span>
                          <p className="font-medium text-slate-600 text-sm line-clamp-1 mb-1 max-w-xs">{doc.subject}</p>
                          <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            {doc.administrado}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wide">
                          {AREAS.find(a => a.id === doc.currentAreaId)?.name || doc.currentAreaId}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ring-inset ${priorityStyle.class}`}>
                        <PriorityIcon size={12} />
                        {doc.priority}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${deadline.color}`}>
                          {deadline.icon}
                          <span>{deadline.text}</span>
                      </div>
                    </td>
                    <td className="p-5 text-right pr-8">
                      <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                              <MoreHorizontal size={20} />
                          </button>
                          <button 
                              onClick={() => openDeriveModal(doc)}
                              className="bg-slate-900 text-white hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                          >
                              Derivar <ArrowRight size={16} />
                          </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
          {inboxDocs.length === 0 && (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-slate-300" />
              </div>
              <p className="text-lg font-medium text-slate-600">Todo al día</p>
              <p className="text-sm">No hay documentos con este filtro.</p>
            </div>
          )}
        </div>
      </main>

      {/* DERIVE MODAL */}
      {isDeriveModalOpen && selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                  <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">Derivar Expediente</h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedDoc.code}</p>
                      </div>
                      <button onClick={() => setIsDeriveModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <form onSubmit={handleDeriveSubmit} className="p-6 space-y-5">
                      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                          <p className="text-xs font-bold text-blue-600 uppercase mb-1">Asunto</p>
                          <p className="text-sm font-medium text-slate-700 leading-relaxed max-h-24 overflow-y-auto">{selectedDoc.subject}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Oficina Destino</label>
                              <select 
                                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                  value={deriveData.toAreaId}
                                  onChange={(e) => setDeriveData({...deriveData, toAreaId: e.target.value})}
                              >
                                  {AREAS.map(area => <option key={area.id} value={area.id}>{area.name}</option>)}
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Estado</label>
                              <select 
                                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                  value={deriveData.status}
                                  onChange={(e) => setDeriveData({...deriveData, status: e.target.value as DocStatus})}
                              >
                                  {Object.values(DocStatus).map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Observaciones</label>
                          <textarea 
                              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none h-28"
                              placeholder="Indique las acciones a realizar..."
                              value={deriveData.notes}
                              onChange={(e) => setDeriveData({...deriveData, notes: e.target.value})}
                          ></textarea>
                      </div>

                      <div className="flex gap-3 pt-2">
                          <button 
                              type="button" 
                              onClick={() => setIsDeriveModalOpen(false)}
                              className="flex-1 py-3 text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-xl font-bold text-sm transition-all"
                          >
                              Cancelar
                          </button>
                          <button 
                              type="submit"
                              className="flex-1 py-3 bg-red-700 text-white rounded-xl font-bold text-sm hover:bg-red-800 shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                          >
                              <Send size={18} />
                              Confirmar Derivación
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