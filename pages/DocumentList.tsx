
import React, { useState, useEffect } from 'react';
import { FileText, Download, ExternalLink, Search, Calendar, Eye, X, History, MapPin, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import { AREAS } from '../constants';
import { DocStatus, DocumentRecord, User } from '../types';
import { getDocuments } from '../services/dataService';

interface DocumentListProps {
  currentUser: User | null;
  onLogout: () => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ currentUser, onLogout }) => {
  const [filter, setFilter] = useState('');
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    // Fix: Handle promise from getDocuments
    getDocuments().then(setDocuments);
  }, []);

  const filteredDocs = documents.filter(doc => 
    doc.code.toLowerCase().includes(filter.toLowerCase()) ||
    doc.subject.toLowerCase().includes(filter.toLowerCase()) ||
    doc.administrado.toLowerCase().includes(filter.toLowerCase()) ||
    (doc.resolutionNumber && doc.resolutionNumber.toLowerCase().includes(filter.toLowerCase()))
  );

  const getStatusBadge = (status: DocStatus) => {
    switch (status) {
      case DocStatus.IN_PROCESS: return 'bg-blue-50 text-blue-900 border-blue-200';
      case DocStatus.PENDING: return 'bg-yellow-50 text-yellow-900 border-yellow-200';
      case DocStatus.ARCHIVED: return 'bg-emerald-50 text-emerald-900 border-emerald-200';
      case DocStatus.DERIVED: return 'bg-purple-50 text-purple-900 border-purple-200';
      default: return 'bg-slate-50 text-slate-900 border-slate-200';
    }
  };

  const openViewModal = (doc: DocumentRecord) => {
    setSelectedDoc(doc);
    setIsViewModalOpen(true);
  };

  return (
    <div className="flex-1 bg-[#f1f5f9] w-full">
      <Header title="Archivo Central Regional" user={currentUser} onLogout={onLogout} />
      
      <main className="p-4 md:p-8">
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
          
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Repositorio Regional</h2>
              <p className="text-sm text-slate-500 font-bold italic mt-1">Histórico completo de expedientes y resoluciones DREM.</p>
            </div>
            <div className="relative w-full lg:w-[450px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
              <input 
                type="text" 
                placeholder="Buscar por resolución, nombre, RUC..." 
                className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 focus:border-red-700 outline-none text-base font-bold transition-all placeholder:text-slate-300 shadow-inner"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead className="bg-slate-50 text-slate-900 text-[11px] uppercase font-black tracking-[0.2em] border-b border-slate-200">
                <tr>
                  <th className="p-4 pl-10">Expediente</th>
                  <th className="p-4">Registro</th>
                  <th className="p-4">Titular / RUC</th>
                  <th className="p-4 w-1/4">Resumen / Asunto</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-10">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-red-50 rounded-xl text-red-800 border border-red-100 group-hover:bg-red-700 group-hover:text-white transition-all">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm uppercase tracking-tight">{doc.resolutionNumber || doc.code}</p>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                        <Calendar size={14} className="text-slate-400"/>
                        {new Date(doc.registerDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-black text-slate-950 uppercase leading-none">{doc.administrado}</p>
                      {doc.ruc && <p className="text-[10px] font-black text-slate-400 mt-1 uppercase">ID: {doc.ruc}</p>}
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-bold text-slate-600 line-clamp-1 italic" title={doc.subject}>
                        "{doc.subject}"
                      </p>
                    </td>
                    <td className="p-4">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black border uppercase tracking-widest shadow-sm inline-block ${getStatusBadge(doc.status)}`}>
                            {doc.status}
                        </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-1.5">
                         <button onClick={() => openViewModal(doc)} className="p-2 text-slate-400 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100" title="Ver Detalles"><Eye size={22} /></button>
                         {doc.pdfUrl && <a href={doc.pdfUrl} target="_blank" className="p-2 text-slate-400 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"><Download size={22} /></a>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL DETALLES SIMPLIFICADO */}
      {isViewModalOpen && selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col border border-slate-200">
               <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                     <h3 className="font-black text-2xl text-slate-950 flex items-center gap-4 uppercase tracking-tighter">
                       <FileText size={32} className="text-red-900"/> Ficha de Expediente
                     </h3>
                     <p className="text-xs text-slate-500 font-black mt-1 tracking-widest uppercase">{selectedDoc.code} • DREM APURÍMAC</p>
                  </div>
                  <button onClick={() => setIsViewModalOpen(false)} className="text-slate-400 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all border border-transparent hover:border-red-100"><X size={36}/></button>
               </div>

               <div className="flex-1 overflow-y-auto p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                     <div className="space-y-12">
                        <section>
                           <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em] mb-6 border-b-2 border-red-900 w-fit pb-1">Datos Técnicos</h4>
                           <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100 space-y-8 shadow-inner">
                              <div><label className="text-[9px] text-slate-400 uppercase font-black mb-1 block">Titular</label><p className="text-xl font-black text-slate-950 leading-none uppercase">{selectedDoc.administrado}</p></div>
                              <div><label className="text-[9px] text-slate-400 uppercase font-black mb-1 block">Asunto Oficial</label><p className="text-base text-slate-900 leading-relaxed font-bold italic border-l-4 border-red-900 pl-4">"{selectedDoc.subject}"</p></div>
                              <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-6">
                                 <div><label className="text-[9px] text-slate-400 uppercase font-black mb-1 block">Fecha</label><p className="text-sm font-black text-slate-900">{new Date(selectedDoc.emissionDate).toLocaleDateString()}</p></div>
                                 <div><label className="text-[9px] text-slate-400 uppercase font-black mb-1 block">Categoría</label><p className="text-sm font-black text-red-900 uppercase">{selectedDoc.priority}</p></div>
                              </div>
                           </div>
                        </section>
                     </div>
                     <div className="flex flex-col">
                        <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em] mb-6">Visor Regional</h4>
                        <div className="flex-1 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-10 text-center hover:bg-white transition-all shadow-inner group">
                            {selectedDoc.pdfUrl ? (
                                <div className="space-y-8">
                                    <div className="w-24 h-24 bg-red-50 text-red-900 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform"><FileText size={48}/></div>
                                    <h5 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Archivo PDF Listado</h5>
                                    <button onClick={() => window.open(selectedDoc.pdfUrl, '_blank')} className="bg-slate-950 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-red-900 transition-all flex items-center gap-3 mx-auto"><Eye size={20}/> Abrir Visor</button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <AlertCircle size={64} className="text-slate-200 mx-auto"/>
                                    <p className="text-base font-black text-slate-300 uppercase tracking-[0.3em]">Sin Respaldo Digital</p>
                                </div>
                            )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default DocumentList;
