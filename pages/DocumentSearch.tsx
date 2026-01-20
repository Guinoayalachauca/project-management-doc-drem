
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, FileText, Download, ExternalLink, Building, ArrowRight, Filter, Calendar } from 'lucide-react';
import Header from '../components/Header';
import { AREAS } from '../constants';
import { DocumentRecord, DocStatus, User } from '../types';
import { getDocuments } from '../services/dataService';

interface DocumentSearchProps {
  currentUser: User | null;
  onLogout: () => void;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({ currentUser, onLogout }) => {
  const [searchParams] = useSearchParams();
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>(['RES-2024-0892']);
  const [allDocs, setAllDocs] = useState<DocumentRecord[]>([]);
  const [searchResults, setSearchResults] = useState<DocumentRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Filters State - Simplified
  const [filters, setFilters] = useState({
    global: '',
    status: '',
    year: ''
  });

  useEffect(() => {
    // Fix: Handle promise from getDocuments
    getDocuments().then(setAllDocs);
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setFilters(prev => ({ ...prev, global: query }));
      // Trigger search automatically if coming from URL
      if (allDocs.length > 0) {
        performSearch({ ...filters, global: query });
      }
    }
  }, [searchParams, allDocs]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const performSearch = (currentFilters = filters) => {
    setHasSearched(true);
    setSelectedDoc(null); // Clear selection on new search

    // Add to history if unique and global search present
    if (currentFilters.global.trim() && !searchHistory.includes(currentFilters.global)) {
        setSearchHistory([currentFilters.global, ...searchHistory].slice(0, 5));
    }

    const results = allDocs.filter(doc => {
        const term = currentFilters.global.toLowerCase().trim();
        
        // Smart Global Search: Checks ALL relevant fields
        const globalMatch = !term || 
            doc.code.toLowerCase().includes(term) || 
            (doc.resolutionNumber && doc.resolutionNumber.toLowerCase().includes(term)) ||
            doc.subject.toLowerCase().includes(term) ||
            doc.administrado.toLowerCase().includes(term) ||
            (doc.ruc && doc.ruc.includes(term)) ||
            (doc.province && doc.province.toLowerCase().includes(term)) ||
            (doc.district && doc.district.toLowerCase().includes(term)) ||
            doc.type.toLowerCase().includes(term);

        // Specific Filters
        const statusMatch = !currentFilters.status || doc.status === currentFilters.status;
        const yearMatch = !currentFilters.year || doc.year === currentFilters.year;

        return globalMatch && statusMatch && yearMatch;
    });

    setSearchResults(results);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const clearFilters = () => {
      setFilters({
        global: '',
        status: '',
        year: ''
      });
      setSearchResults([]);
      setHasSearched(false);
      setSelectedDoc(null);
  };

  const getAreaName = (id: string) => AREAS.find(a => a.id === id)?.name || id;

  const getStatusColor = (status: DocStatus) => {
      switch(status) {
          case DocStatus.IN_PROCESS: return 'bg-blue-100 text-blue-700';
          case DocStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
          case DocStatus.ARCHIVED: return 'bg-green-100 text-green-700';
          default: return 'bg-slate-100 text-slate-700';
      }
  };

  return (
    <div className="flex-1 bg-slate-100 w-full">
      <Header title="Seguimiento de Documentos" user={currentUser} onLogout={onLogout} />
      
      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        {/* Search Panel */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 mb-8 overflow-hidden">
          <div className="p-6 md:p-8">
             <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Búsqueda de Expedientes</h2>
                <p className="text-slate-500 text-sm md:text-lg">Ingrese cualquier dato del documento (Código, Administrado, RUC, Lugar, etc.)</p>
             </div>

             <form onSubmit={handleSearchSubmit}>
                {/* Main Search Bar */}
                <div className="max-w-3xl mx-auto flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-2 relative">
                        <div className="relative flex-1">
                            <input
                            name="global"
                            type="text"
                            placeholder="Ej: Res 0892, Juan Perez, Abancay..."
                            className="w-full pl-12 pr-4 py-3 md:py-4 rounded-lg border border-slate-300 bg-white text-slate-900 text-base md:text-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-slate-400"
                            value={filters.global}
                            onChange={handleFilterChange}
                            />
                            <Search className="absolute left-4 top-3.5 md:top-4.5 text-slate-400" size={24} />
                        </div>
                        <button type="submit" className="bg-red-700 text-white px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-red-800 transition-colors shadow-md w-full md:w-auto flex justify-center items-center gap-2">
                             <Search size={20}/> Buscar
                        </button>
                    </div>

                    {/* Quick Filters Row */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Filter size={16} className="text-slate-500"/>
                            <span className="text-sm font-bold text-slate-600">Filtrar por:</span>
                        </div>
                        
                        <div className="flex gap-2 w-full sm:w-auto">
                             <select 
                                name="status" 
                                value={filters.status} 
                                onChange={handleFilterChange} 
                                className="flex-1 sm:w-48 p-2.5 bg-white text-slate-900 border border-slate-300 rounded-md text-sm outline-none focus:border-red-500 cursor-pointer hover:border-red-300 transition-colors"
                             >
                                <option value="">Todos los Estados</option>
                                {Object.values(DocStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>

                            <div className="relative flex-1 sm:w-32">
                                <Calendar className="absolute left-2.5 top-2.5 text-slate-400" size={16} />
                                <input 
                                    name="year" 
                                    type="number" 
                                    value={filters.year} 
                                    onChange={handleFilterChange} 
                                    placeholder="Año" 
                                    className="w-full pl-9 p-2.5 bg-white text-slate-900 border border-slate-300 rounded-md text-sm outline-none focus:border-red-500 hover:border-red-300 transition-colors" 
                                />
                            </div>
                        </div>

                        {(filters.year || filters.status || filters.global) && (
                            <button type="button" onClick={clearFilters} className="text-xs text-red-600 hover:underline font-bold ml-2">
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>
             </form>
          </div>
        </div>

        {/* RESULTS AREA */}
        
        {/* Case 1: Search performed but no document selected yet */}
        {hasSearched && !selectedDoc && (
             <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800">Resultados ({searchResults.length})</h3>
                </div>

                {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {searchResults.map(doc => (
                            <div 
                                key={doc.id}
                                onClick={() => setSelectedDoc(doc)}
                                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-red-200 cursor-pointer transition-all group"
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-sm">{doc.code}</span>
                                            {doc.resolutionNumber && <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">{doc.resolutionNumber}</span>}
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getStatusColor(doc.status)}`}>{doc.status}</span>
                                            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{doc.year}</span>
                                        </div>
                                        <h4 className="font-bold text-slate-700 mb-1 group-hover:text-red-700 transition-colors">{doc.subject}</h4>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                            <span className="flex items-center gap-1"><Building size={14}/> {doc.administrado}</span>
                                            {doc.ruc && <span className="flex items-center gap-1 text-xs bg-slate-50 px-1 rounded">RUC: {doc.ruc}</span>}
                                            {(doc.province || doc.district) && <span className="flex items-center gap-1"><MapPin size={14}/> {doc.district}{doc.province ? `, ${doc.province}` : ''}</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No se encontraron resultados</h3>
                        <p className="text-slate-500">Intente con otros términos o verifique los filtros de año/estado.</p>
                    </div>
                )}
             </div>
        )}

        {/* Case 2: Document Selected (Detail View) */}
        {selectedDoc && (
          <div className="animate-fade-in">
             <button onClick={() => setSelectedDoc(null)} className="mb-4 text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2">
                 <ArrowRight size={16} className="rotate-180" /> Volver a resultados
             </button>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                {selectedDoc.ruc && <p className="text-sm text-slate-500">RUC: {selectedDoc.ruc}</p>}
                                {(selectedDoc.province || selectedDoc.district) && (
                                    <p className="text-sm text-slate-600 mt-1 flex items-center gap-1"><MapPin size={12}/> {selectedDoc.district}, {selectedDoc.province}</p>
                                )}
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
          </div>
        )}
      </main>
    </div>
  );
};

export default DocumentSearch;
