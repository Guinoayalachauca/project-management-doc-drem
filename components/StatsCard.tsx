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
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', gradient: 'from-blue-500/10 to-transparent' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', gradient: 'from-emerald-500/10 to-transparent' },
    yellow: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', gradient: 'from-amber-500/10 to-transparent' },
    red: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', gradient: 'from-rose-500/10 to-transparent' },
  };

  const t = theme[color];

  return (
    <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Decorative gradient blob */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${t.gradient} rounded-bl-full opacity-50 transition-opacity group-hover:opacity-100`}></div>
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3.5 rounded-xl ${t.bg} ${t.text} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="relative mt-4 flex items-center text-sm font-medium">
          <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1">
             {trend}
          </span>
          <span className="text-slate-400 ml-2 text-xs">vs mes anterior</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;