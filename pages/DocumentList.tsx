import React, { useState, useEffect } from 'react';
import { FileText, Download, ExternalLink, Search, Filter, Calendar } from 'lucide-react';
import Header from '../components/Header';
import { DocStatus, DocumentRecord } from '../types';
import { getDocuments } from '../services/dataService';

const DocumentList: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);

  useEffect(() => {
    setDocuments(getDocuments());
  }, []);

  const filteredDocs = documents.filter(doc => 
    doc.code.toLowerCase().includes(filter.toLowerCase()) ||
    doc.subject.toLowerCase().includes(filter.toLowerCase()) ||
    doc.administrado.toLowerCase().includes(filter.toLowerCase()) ||
    (doc.resolutionNumber && doc.resolutionNumber.toLowerCase().includes(filter.toLowerCase()))
  );

  const getStatusBadge = (status: DocStatus) => {
    switch (status) {
      case DocStatus.IN_PROCESS:
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case DocStatus.PENDING:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case DocStatus.ARCHIVED:
        return 'bg-green-100 text-green-700 border-green-200';
      case DocStatus.DERIVED:
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getAttendedDate = (doc: DocumentRecord) => {
     if(doc.status === DocStatus.ARCHIVED || doc.status === DocStatus.DERIVED) {
        const lastMove = doc.movements[doc.movements.length - 1];
        return new Date(lastMove.date).toLocaleDateString();
     }
     return '-';
  };

  return (
    <div className="flex-1 bg-slate-100 ml-64">
      <Header title="Lista General de Documentos" />
      
      <main className="p-8">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          
          {/* Filters Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Archivo Central</h2>
              <p className="text-sm text-slate-500">Visualice y descargue todos los documentos registrados.</p>
            </div>
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por resolución, administrado o asunto..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold">
                <tr>
                  <th className="p-4 border-b border-slate-200">Documento</th>
                  <th className="p-4 border-b border-slate-200">Fecha Registro</th>
                  <th className="p-4 border-b border-slate-200">Administrado</th>
                  <th className="p-4 border-b border-slate-200 w-1/4">Asunto (Resuelve)</th>
                  <th className="p-4 border-b border-slate-200">Estado / F. Atención</th>
                  <th className="p-4 border-b border-slate-200 text-center">Archivos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.length > 0 ? filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 align-top">
                      <div className="flex items-start gap-2">
                        <div className="mt-1 p-1.5 bg-red-50 rounded text-red-600">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{doc.resolutionNumber || doc.code}</p>
                          <span className="inline-block px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded-full mt-1">
                            {doc.type} {doc.year}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400"/>
                        <span className="text-sm font-medium text-slate-700">
                            {new Date(doc.registerDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 pl-5">{new Date(doc.registerDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </td>
                    <td className="p-4 align-top">
                      <p className="text-sm font-semibold text-slate-700">{doc.administrado}</p>
                      {doc.ruc && <p className="text-xs text-slate-500">RUC: {doc.ruc}</p>}
                    </td>
                    <td className="p-4 align-top">
                      <p className="text-sm text-slate-600 line-clamp-2" title={doc.subject}>
                        {doc.subject}
                      </p>
                    </td>
                    <td className="p-4 align-top">
                        <div className="flex flex-col gap-1 items-start">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(doc.status)}`}>
                                {doc.status}
                            </span>
                            <span className="text-xs text-slate-500 mt-1">
                                Atendido: <strong>{getAttendedDate(doc)}</strong>
                            </span>
                        </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex justify-center gap-2">
                        {doc.pdfUrl ? (
                          <a 
                            href={doc.pdfUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                            title="Descargar PDF"
                          >
                            <Download size={18} />
                          </a>
                        ) : (
                           <span className="p-2 text-slate-300 cursor-not-allowed"><Download size={18} /></span>
                        )}
                        
                        {doc.externalUrl ? (
                          <a 
                            href={doc.externalUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                            title="Ver Enlace"
                          >
                            <ExternalLink size={18} />
                          </a>
                        ) : (
                            <span className="p-2 text-slate-300 cursor-not-allowed"><ExternalLink size={18} /></span>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      <Filter className="mx-auto mb-2 opacity-50" size={32} />
                      No se encontraron documentos que coincidan con su búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
            <span>Mostrando {filteredDocs.length} registro(s)</span>
            <div className="flex gap-2">
                <button className="px-3 py-1 border border-slate-300 rounded bg-white disabled:opacity-50" disabled>Anterior</button>
                <button className="px-3 py-1 border border-slate-300 rounded bg-white hover:bg-slate-50">Siguiente</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DocumentList;