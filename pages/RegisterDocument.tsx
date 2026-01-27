
import React, { useState } from 'react';
import { Save, FileText, User as UserIcon, Link as LinkIcon, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { DOCUMENT_TYPES } from '../constants';
import { DocPriority, DocStatus, DocumentRecord, User } from '../types';
import { addDocument } from '../services/dataService';

const UBICACIONES = {
  "Abancay": ["Abancay", "Chacoche", "Circa", "Curahuasi", "Huanipaca", "Lambrama", "Pichirhua", "San Gabriel", "Tamburco"],
  "Andahuaylas": ["Andahuaylas", "Andarapa", "Chiara", "Huancarama", "Huancaray", "Huayana", "Kishuara", "Pacobamba", "Pacucha", "Pampachiri", "San Antonio de Cachi", "San Jerónimo", "San María de Chicmo", "Talavera", "Tumay Huaraca", "Turpo", "Kaquiabamba"],
  "Antabamba": ["Antabamba", "El Oro", "Huaquirca", "Juan Espinoza Medrano", "Oropesa", "Pachaconas", "Sabaino"],
  "Aymaraes": ["Chalhuanca", "Capaya", "Caraybamba", "Chaccrampa", "Cotaruse", "Huayllo", "Justo Apu Sahuaraura", "Lucre", "Pocohuanca", "San Juan de Chacña", "Sañayca", "Soraya", "Tapairihua", "Tintay", "Toraya", "Yanaca"],
  "Cotabambas": ["Tambobamba", "Cotabambas", "Coyllurqui", "Haquira", "Mara", "Challhuahuacho"],
  "Chincheros": ["Chincheros", "Anco_Huallo", "Cocharcas", "Huaccana", "Ocobamba", "Ongoy", "Uranmarca", "Ranracancha", "Rocchacc", "El Porvenir", "Los Chankas"],
  "Grau": ["Chuquibambilla", "Curasco", "Curpahuasi", "Huayllati", "Mamara", "Mariscal Gamarra", "Progreso", "Pataypampa", "San Antonio", "Santa Rosa", "Turpay", "Vilcabamba", "Virundo"]
};

const RegisterDocument: React.FC<{ currentUser: User | null; onLogout: () => void }> = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredCode, setRegisteredCode] = useState('');

  const [formData, setFormData] = useState({
    type: 'Resolución',
    resolutionNumber: '',
    year: '2026',
    emissionDate: new Date().toISOString().split('T')[0],
    administrado: '',
    ruc: '',
    province: 'Abancay',
    district: 'Abancay',
    content: '',
    pdfUrl: '',
    priority: DocPriority.NORMAL
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.administrado.trim()) newErrors.administrado = "Este campo es obligatorio";
    if (!formData.content.trim()) newErrors.content = "El asunto o contenido es obligatorio";
    if (formData.ruc && !/^\d{11}$/.test(formData.ruc)) newErrors.ruc = "El RUC debe tener exactamente 11 dígitos";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSaving(true);
    const newId = Date.now().toString();
    const docCode = `${formData.type.substring(0,3).toUpperCase()}-${formData.year}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
        await addDocument({
            ...formData,
            id: newId,
            code: docCode,
            registerDate: new Date().toISOString(),
            currentAreaId: 'MESA',
            status: DocStatus.PENDING,
            subject: formData.content,
            movements: [{
                id: `mov-${Date.now()}`,
                documentId: newId,
                fromAreaId: 'EXTERNO', 
                toAreaId: 'MESA',
                date: new Date().toISOString(),
                action: 'Registro en Sistema',
                notes: 'Ingreso inicial por Mesa de Partes.',
                user: currentUser?.name || 'Usuario'
            }]
        } as any);

        setRegisteredCode(docCode);
        setShowSuccess(true);
    } catch (err) {
        alert("Error al guardar en Firebase. Verifique su conexión.");
    } finally {
        setIsSaving(false);
    }
  };

  const labelClass = "text-[11px] font-black text-slate-800 uppercase tracking-widest ml-1 mb-2 block";
  const inputClass = "w-full p-4 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-[#991b1b] focus:ring-4 focus:ring-red-500/5 transition-all shadow-sm placeholder:text-slate-300";

  if (showSuccess) {
      return (
          <div className="flex-1 bg-slate-50 flex items-center justify-center p-4">
              <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-200 text-center max-w-md animate-fade-in">
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                      <CheckCircle2 size={56} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">¡REGISTRO EXITOSO!</h2>
                  <p className="text-slate-500 font-bold mb-8">El expediente <span className="text-[#991b1b] font-black">{registeredCode}</span> ha sido guardado correctamente en la nube.</p>
                  <div className="space-y-3">
                      <button onClick={() => navigate('/inbox')} className="w-full bg-[#991b1b] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-red-800 transition-all">
                          Ver en Bandeja <ArrowRight size={18}/>
                      </button>
                      <button onClick={() => setShowSuccess(false)} className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                          Registrar Otro
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="flex-1 bg-slate-50 w-full">
      <Header title="Registrar Expediente" user={currentUser} onLogout={onLogout} />
      
      <main className="p-4 md:p-8 max-w-6xl mx-auto pb-20">
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50/50 px-10 py-6 border-b border-slate-100">
                    <h3 className="font-black text-slate-900 flex items-center gap-3 uppercase text-xs tracking-[0.2em]">
                        <FileText size={18} className="text-[#991b1b]"/> Identificación del Documento
                    </h3>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                         <label className={labelClass}>Tipo de Documento</label>
                         <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                           {DOCUMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                         </select>
                    </div>
                    <div className="md:col-span-1">
                        <label className={labelClass}>N° Documento</label>
                        <input type="text" name="resolutionNumber" value={formData.resolutionNumber} onChange={handleChange} className={inputClass} placeholder="Ej: 450-2026" />
                    </div>
                    <div className="md:col-span-1">
                        <label className={labelClass}>Año Fiscal</label>
                        <input type="number" name="year" value={formData.year} onChange={handleChange} className={inputClass} />
                    </div>

                    <div className="md:col-span-3">
                        <label className={labelClass}>Administrado / Nombre del Titular</label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                            <input name="administrado" value={formData.administrado} onChange={handleChange} className={`${inputClass} pl-12 ${errors.administrado ? 'border-red-400 bg-red-50/10' : ''}`} placeholder="Apellidos y Nombres o Razón Social" />
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <label className={labelClass}>RUC (Opcional)</label>
                        <input name="ruc" value={formData.ruc} onChange={handleChange} className={`${inputClass} ${errors.ruc ? 'border-red-400 bg-red-50/10' : ''}`} placeholder="20123456789" maxLength={11} />
                    </div>

                    <div className="md:col-span-2">
                        <label className={labelClass}>Provincia</label>
                        <select name="province" value={formData.province} onChange={(e) => setFormData({...formData, province: e.target.value, district: UBICACIONES[e.target.value as keyof typeof UBICACIONES][0]})} className={inputClass}>
                            {Object.keys(UBICACIONES).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Distrito</label>
                        <select name="district" value={formData.district} onChange={handleChange} className={inputClass}>
                            {UBICACIONES[formData.province as keyof typeof UBICACIONES].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50/50 px-10 py-6 border-b border-slate-100">
                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">Asunto y Detalle del Trámite</h3>
                </div>
                <div className="p-10 space-y-8">
                    <div>
                        <label className={labelClass}>Sumilla / Contenido del Documento</label>
                        <textarea name="content" value={formData.content} onChange={handleChange} rows={5} className={`${inputClass} resize-none ${errors.content ? 'border-red-400 bg-red-50/10' : ''}`} placeholder="Resumen del documento..."></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className={labelClass}>Prioridad del Documento</label>
                            <select name="priority" value={formData.priority} onChange={handleChange} className={inputClass}>
                                {Object.values(DocPriority).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Enlace PDF (URL)</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                <input name="pdfUrl" value={formData.pdfUrl} onChange={handleChange} className={`${inputClass} pl-12`} placeholder="https://..." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
                <button type="button" onClick={() => navigate('/')} className="px-10 py-5 rounded-2xl bg-white border-2 border-slate-200 text-slate-500 font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all">Cancelar</button>
                <button type="submit" disabled={isSaving} className="px-12 py-5 rounded-2xl bg-[#991b1b] text-white font-black uppercase text-xs tracking-widest hover:bg-red-800 shadow-xl shadow-red-900/20 transition-all active:scale-95 flex items-center gap-3">
                    {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} 
                    {isSaving ? 'Guardando...' : 'Guardar Registro'}
                </button>
            </div>
        </form>
      </main>
    </div>
  );
};

export default RegisterDocument;
