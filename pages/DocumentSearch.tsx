import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, FileText, Download, ExternalLink, Building, History } from 'lucide-react';
import Header from '../components/Header';
import { AREAS } from '../constants';
import { DocumentRecord } from '../types';
import { getDocuments } from '../services/dataService';

const DocumentSearch: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>(['RES-2024-0892']);
  const [allDocs, setAllDocs] = useState<DocumentRecord[]>([]);

  useEffect(() => {
    // Load fresh data
    setAllDocs(getDocuments());
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Effect to trigger search when allDocs is loaded and we have a query
  useEffect(() => {
    const query = searchParams.get('q');
    if (query && allDocs.length > 0) {
        performSearch(query);
    }
  }, [allDocs, searchParams]);

  const performSearch = (term: string) => {
    // Add to history if unique and not empty
    if (term.trim() && !searchHistory.includes(term)) {
        setSearchHistory([term, ...searchHistory].slice(0, 5));
    }

    const docsToSearch = allDocs.length > 0 ? allDocs : getDocuments(); // Fallback to immediate fetch

    const found = docsToSearch.find(d => 
        d.code.toLowerCase().includes(term.toLowerCase()) || 
        d.resolutionNumber?.toLowerCase().includes(term.toLowerCase()) ||
        d.subject.toLowerCase().includes(term.toLowerCase())
    );
    setSelectedDoc(found || null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    performSearch(searchTerm);
  };

  const handleHistoryClick = (term: string) => {
    setSearchTerm(term);
    performSearch(term);
  };

  const getAreaName = (id: string) => AREAS.find(a => a.id === id)?.name || id;

  return (
    <div className="flex-1 bg-slate-100 w-full">
      <Header title="Seguimiento de Documentos" />
      
      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="bg-white p-6 md:p-10 rounded-xl shadow-md border border-slate-200 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Búsqueda de Expedientes</h2>
            <p className="text-slate-500 text-sm md:text-lg">Ingrese el N° de Resolución, Código o Asunto</p>
          </div>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col md:flex-row gap-2 mb-6 relative">
            <div className="relative flex-1">
                <input
                type="text"
                placeholder="Ej. 0892-2024 o Minera El Dorado"
                className="w-full pl-12 pr-4 py-3 md:py-4 rounded-lg border border-slate-300 text-base md:text-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-3.5 md:top-4.5 text-slate-400" size={24} />
            </div>
            <button type="submit" className="bg-red-700 text-white px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-red-800 transition-colors shadow-md w-full md:w-auto">
              Buscar
            </button>
          </form>

          {/* Search History */}
          {searchHistory.length > 0 && !selectedDoc && (
             <div className="max-w-2xl mx-auto">
                <p className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                    <History size={14} /> Búsquedas Recientes
                </p>
                <div className="flex flex-wrap gap-2">
                    {searchHistory.map((term, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleHistoryClick(term)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full text-sm transition-colors flex items-center gap-2"
                        >
                            {term}
                        </button>
                    ))}
                </div>
             </div>
          )}
        </div>

        {/* Results */}
        {selectedDoc ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Main Document Info & Downloads */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* FOUND DOCUMENT CARD */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <div className="bg-slate-800 text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <FileText size={20} className="text-yellow-400"/>
                        Detalle del Documento
                    </h3>
                    <span className="bg-slate-700 px-3 py-1 rounded text-sm font-mono text-slate-200">{selectedDoc.code}</span>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">{selectedDoc.resolutionNumber || selectedDoc.type}</h2>
                        <p className="text-base md:text-lg text-slate-600 leading-relaxed">{selectedDoc.subject}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Administrado</span>
                            <p className="font-semibold text-slate-800">{selectedDoc.administrado}</p>
                            <p className="text-sm text-slate-500">{selectedDoc.ruc}</p>
                        </div>
                        <div>
                             <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Fecha Registro</span>
                             <p className="font-semibold text-slate-800">{new Date(selectedDoc.registerDate).toLocaleDateString()}</p>
                             <span className="text-xs text-slate-500">{new Date(selectedDoc.registerDate).toLocaleTimeString()}</span>
                        </div>
                    </div>

                    {/* ACTION BUTTONS (Downloads) */}
                    <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-slate-100">
                        {selectedDoc.pdfUrl ? (
                            <a href={selectedDoc.pdfUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-md font-bold hover:bg-red-700 transition-colors shadow hover:shadow-md w-full sm:w-auto">
                                <Download size={20} />
                                Descargar PDF
                            </a>
                        ) : (
                            <button disabled className="flex items-center justify-center gap-2 bg-slate-100 text-slate-400 px-5 py-2.5 rounded-md font-bold cursor-not-allowed w-full sm:w-auto">
                                <Download size={20} /> Sin PDF
                            </button>
                        )}
                         {selectedDoc.externalUrl && (
                            <a href={selectedDoc.externalUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-md font-bold hover:bg-blue-700 transition-colors shadow hover:shadow-md w-full sm:w-auto">
                                <ExternalLink size={20} />
                                Ver Enlace Web
                            </a>
                        )}
                    </div>
                </div>
              </div>

              {/* TIMELINE */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                 <h3 className="font-bold text-lg text-slate-800 mb-6 border-b pb-2">Ubicación y Seguimiento</h3>
                 <div className="relative pl-4 border-l-2 border-slate-200 space-y-8">
                    {selectedDoc.movements.map((move, idx) => (
                        <div key={move.id} className="relative pl-6">
                             <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${idx === selectedDoc.movements.length - 1 ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                             <p className="font-bold text-slate-800">{move.action}</p>
                             <p className="text-sm text-slate-600 mb-1">{new Date(move.date).toLocaleString()}</p>
                             <p className="text-sm bg-slate-50 p-2 rounded border border-slate-100 inline-block">
                                {getAreaName(move.fromAreaId)} <span className="text-slate-400 mx-2">➝</span> <strong>{getAreaName(move.toAreaId)}</strong>
                             </p>
                             {move.notes && <p className="text-xs text-slate-500 mt-1 italic">"{move.notes}"</p>}
                        </div>
                    ))}
                 </div>
              </div>

            </div>

            {/* Sidebar Status */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase mb-1 block">Estado Actual</span>
                <div className={`text-center p-4 rounded-lg font-bold text-lg mb-4 ${
                    selectedDoc.status === 'En Trámite' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                    selectedDoc.status === 'Archivado' ? 'bg-green-50 text-green-700 border border-green-100' :
                    'bg-purple-50 text-purple-700 border border-purple-100'
                }`}>
                    {selectedDoc.status}
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase">Ubicación Física</p>
                        <p className="font-bold text-slate-800">{getAreaName(selectedDoc.currentAreaId)}</p>
                    </div>
                </div>

                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <Building size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase">Entidad</p>
                        <p className="font-bold text-slate-800">DREM Apurímac</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        ) : searchTerm && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No se encontraron resultados</h3>
            <p className="text-slate-500">Verifique el código o número de resolución e intente nuevamente.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DocumentSearch;