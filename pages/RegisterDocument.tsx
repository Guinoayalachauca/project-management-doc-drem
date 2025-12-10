import React, { useState } from 'react';
import { Sparkles, Save, FileText, Calendar, User, Hash, Link as LinkIcon, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { AREAS, DOCUMENT_TYPES } from '../constants';
import { DocPriority, DocStatus, DocumentRecord } from '../types';
import { analyzeDocument } from '../services/geminiService';
import { addDocument } from '../services/dataService';

const RegisterDocument: React.FC = () => {
  const navigate = useNavigate();
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ reason: string, area: string } | null>(null);

  const [formData, setFormData] = useState({
    type: 'Resolución',
    resolutionNumber: '',
    year: new Date().getFullYear().toString(),
    emissionDate: new Date().toISOString().split('T')[0],
    administrado: '',
    ruc: '',
    content: '',
    pdfUrl: '',
    destinationArea: 'DIRECCION',
    priority: DocPriority.NORMAL
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAIAnalysis = async () => {
    if (!formData.content) return alert("Ingrese el contenido para analizar.");
    setIsLoadingAI(true);
    const routing = await analyzeDocument(`Tipo: ${formData.type}. Asunto: ${formData.content}`, formData.content);
    if (routing) {
      setFormData(prev => ({ ...prev, destinationArea: routing.suggestedAreaId, priority: routing.prioritySuggestion }));
      setAiSuggestion({ area: AREAS.find(a => a.id === routing.suggestedAreaId)?.name || routing.suggestedAreaId, reason: routing.reasoning });
    }
    setIsLoadingAI(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Generate ID and Code
    const newId = Date.now().toString();
    const docCode = formData.resolutionNumber 
        ? formData.resolutionNumber 
        : `${formData.type.substring(0,3).toUpperCase()}-${formData.year}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 2. Create Record
    const newDoc: DocumentRecord = {
        id: newId,
        code: docCode,
        type: formData.type,
        resolutionNumber: formData.resolutionNumber,
        year: formData.year,
        emissionDate: formData.emissionDate,
        administrado: formData.administrado || 'Sin Especificar',
        ruc: formData.ruc,
        subject: formData.content,
        pdfUrl: formData.pdfUrl,
        
        registerDate: new Date().toISOString(),
        currentAreaId: formData.destinationArea,
        status: DocStatus.IN_PROCESS,
        priority: formData.priority,
        
        // Initial Movement
        movements: [
            {
                id: `mov-${Date.now()}`,
                documentId: newId,
                fromAreaId: 'MESA', // Assuming MESA starts it
                toAreaId: formData.destinationArea,
                date: new Date().toISOString(),
                action: 'Registro Inicial',
                notes: 'Ingreso por Mesa de Partes',
                user: 'Mesa de Partes' // Should use current user context ideally
            }
        ]
    };

    // 3. Save
    addDocument(newDoc);
    alert("Documento Registrado Exitosamente");
    navigate('/inbox');
  };

  return (
    <div className="flex-1 bg-gray-50 w-full">
      <Header title="Registro de Documentos" />
      
      <main className="p-4 md:p-8 max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Sección 1: Datos Principales */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <FileText size={18} className="text-red-700"/>
                        Datos del Expediente
                    </h3>
                </div>
                
                <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-2">
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo de Documento</label>
                         <select 
                           name="type" value={formData.type} onChange={handleChange}
                           className="w-full p-2.5 bg-white border border-gray-300 rounded-md text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                         >
                           {DOCUMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                         </select>
                    </div>

                    <div className="lg:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">N° Resolución / Código</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-2.5 text-gray-400" size={16} />
                            <input 
                                type="text" name="resolutionNumber" value={formData.resolutionNumber} onChange={handleChange}
                                className="w-full pl-9 p-2.5 border border-gray-300 rounded-md text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                placeholder="0001-2024 (Opcional)"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Año</label>
                         <input 
                             type="number" name="year" value={formData.year} onChange={handleChange}
                             className="w-full p-2.5 border border-gray-300 rounded-md text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                         />
                    </div>

                    <div className="lg:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Administrado (Persona/Entidad)</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                            <input 
                                required
                                type="text" name="administrado" value={formData.administrado} onChange={handleChange}
                                className="w-full pl-9 p-2.5 border border-gray-300 rounded-md text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                placeholder="Ingrese nombre o razón social"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">RUC (Opcional)</label>
                         <input 
                             type="text" name="ruc" value={formData.ruc} onChange={handleChange}
                             className="w-full p-2.5 border border-gray-300 rounded-md text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                             placeholder="2010..." maxLength={11}
                         />
                    </div>

                     <div className="lg:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha Emisión</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
                            <input 
                                type="date" name="emissionDate" value={formData.emissionDate} onChange={handleChange}
                                className="w-full pl-9 p-2.5 border border-gray-300 rounded-md text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección 2: Contenido y Archivo */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Contenido y Archivo Digital</h3>
                    <button
                        type="button"
                        onClick={handleAIAnalysis}
                        disabled={isLoadingAI}
                        className="text-xs flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded border border-blue-200 hover:bg-blue-100 font-bold"
                    >
                        <Sparkles size={14} className={isLoadingAI ? "animate-spin" : ""} />
                        {isLoadingAI ? 'Analizando...' : 'Asistente IA'}
                    </button>
                </div>
                <div className="p-4 md:p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Asunto / Resuelve</label>
                        <textarea 
                             required
                             name="content" value={formData.content} onChange={handleChange} rows={4}
                             className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
                             placeholder="Describa el contenido del documento..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Enlace del Archivo PDF</label>
                        <div className="flex flex-col md:flex-row gap-2">
                             <div className="relative flex-1">
                                <LinkIcon className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <input 
                                    type="url" 
                                    name="pdfUrl" 
                                    value={formData.pdfUrl} 
                                    onChange={handleChange}
                                    className="w-full pl-9 p-2.5 border border-gray-300 rounded-md text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono text-gray-600"
                                    placeholder="https://drive.google.com/file/d/..."
                                />
                             </div>
                             <div className="bg-gray-100 px-3 py-2 rounded border border-gray-200 text-xs text-gray-500 flex items-center justify-center">
                                 Opcional por espacio
                             </div>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1">URL pública o interna donde se encuentra alojado el documento digital.</p>
                    </div>
                </div>
            </div>

            {/* Sección 3: Derivación Inicial */}
            <div className={`rounded-lg shadow-sm border overflow-hidden transition-all ${aiSuggestion ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                <div className={`px-4 md:px-6 py-4 border-b flex justify-between items-center ${aiSuggestion ? 'bg-blue-100/50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <h3 className={`font-bold ${aiSuggestion ? 'text-blue-800' : 'text-gray-800'} flex items-center gap-2`}>
                        <Building size={18} /> Derivación Inicial
                    </h3>
                    {aiSuggestion && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded uppercase font-bold">Sugerido por IA</span>}
                </div>
                
                <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Área de Destino</label>
                        <select 
                          name="destinationArea" value={formData.destinationArea} onChange={handleChange}
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-md text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        >
                          {AREAS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                        {aiSuggestion && <p className="text-xs text-blue-600 mt-2 p-2 bg-blue-100 rounded">💡 {aiSuggestion.reason}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prioridad</label>
                        <select 
                          name="priority" value={formData.priority} onChange={handleChange}
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-md text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        >
                          {Object.values(DocPriority).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm">
                    Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-lg bg-red-800 text-white font-bold hover:bg-red-900 shadow-sm transition-colors flex items-center gap-2 text-sm"
                >
                    <Save size={18} />
                    Guardar Registro
                </button>
            </div>
        </form>
      </main>
    </div>
  );
};

export default RegisterDocument;