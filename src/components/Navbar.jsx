import React from 'react';
import { 
  BarChart3, 
  Layers, 
  Search, 
  FileText, 
  Zap, 
  ShieldCheck,
  CheckCircle2,
  Award
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, trialsCount }) {
  const navItems = [
    { id: 'overview', label: 'Resumen y KPIs', icon: BarChart3 },
    { id: 'stats', label: 'Análisis Estadístico', icon: Layers },
    { id: 'inspector', label: 'Inspector de Interfaces y Axe', icon: Search },
    { id: 'matrix', label: 'Matriz de Reglas', icon: ShieldCheck },
    { id: 'sandbox', label: 'Banco de Pruebas', icon: Zap },
    { id: 'exporter', label: 'Exportador ICITS 2027', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-base tracking-tight text-white">
                  Estudio de Accesibilidad en Prompts de IA
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  ICITS 2027
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Experimento de Factor Único (WCAG 2.2 Nivel AA) • N = {trialsCount} Generaciones
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Status Badge */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px]">Auditoría axe-core v4.8 Aprobada</span>
            </div>
          </div>

        </div>

        {/* Mobile Nav Tabs */}
        <div className="md:hidden flex overflow-x-auto py-2 space-x-1 border-t border-slate-800/60 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
