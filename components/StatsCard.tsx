
import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  color: 'blue' | 'green' | 'yellow' | 'red';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, color }) => {
  const theme = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', gradient: 'from-blue-500/10 to-transparent' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', gradient: 'from-emerald-500/10 to-transparent' },
    yellow: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', gradient: 'from-amber-500/10 to-transparent' },
    red: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', gradient: 'from-rose-500/10 to-transparent' },
  };

  const t = theme[color];

  return (
    <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${t.gradient} rounded-bl-full opacity-50 transition-opacity group-hover:opacity-100`}></div>
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.1em]">{title}</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
        </div>
        <div className={`p-4 rounded-2xl ${t.bg} ${t.text} shadow-sm group-hover:scale-110 transition-transform duration-300 border border-current/10`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="relative mt-5 flex items-center text-sm font-black">
          <span className="text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-lg flex items-center gap-1">
             {trend}
          </span>
          <span className="text-slate-500 ml-3 text-xs font-bold uppercase tracking-tight">Crecimiento mensual</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
