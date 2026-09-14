import React from 'react';
import { 
  TrendingDown, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  FileCode, 
  Scale, 
  Info,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function OverviewKPIs({ stats, setActiveTab }) {
  if (!stats) return null;

  const { vr, vn, sampleSize } = stats;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Hypothesis H1 Status */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/80 to-purple-950/30">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Hipótesis H1 CONFIRMADA (Estadísticamente Significativa)</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              ¿El diseño de prompts con accesibilidad reduce las infracciones de accesibilidad?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              <strong>Hallazgo Principal:</strong> Solicitar interfaces a LLMs con directrices explícitas de WCAG 2.2 Nivel AA redujo las reglas de accesibilidad violadas detectables en un <span className="text-emerald-400 font-bold">{vr.reductionPct}%</span> (Mediana VR: C0 Línea Base = {vr.c0.median} vs. C1 Accesible = {vr.c1.median}, Mann–Whitney U = {vr.mwu.u}, <span className="font-mono text-indigo-300">p &lt; 0.0001</span>, Cliff's Δ = {vr.cliffsDelta.delta.toFixed(2)} [{vr.cliffsDelta.magnitude === 'Large' ? 'Grande' : vr.cliffsDelta.magnitude}]).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('stats')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2"
            >
              <Scale className="w-4 h-4" />
              <span>Ver Distribuciones Estadísticas</span>
            </button>
            <button
              onClick={() => setActiveTab('exporter')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-all flex items-center justify-center space-x-2"
            >
              <FileCode className="w-4 h-4" />
              <span>Exportar Datos del Artículo</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Primary Outcome - Violated Rules */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 glass-panel-hover space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Resultado Primario (VR)
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white">-{vr.reductionPct}%</span>
              <span className="text-xs font-semibold text-emerald-400">Reducción de VR</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Mediana C0: <strong className="text-slate-200">{vr.c0.median}</strong> [IQR: {vr.c0.iqr}] <br />
              Mediana C1: <strong className="text-emerald-400">{vr.c1.median}</strong> [IQR: {vr.c1.iqr}]
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Mann-Whitney U</span>
            <span className="text-indigo-400 font-semibold">U = {vr.mwu.u} (p &lt; 0.0001)</span>
          </div>
        </div>

        {/* KPI 2: Secondary Outcome - Violating Nodes */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 glass-panel-hover space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Resultado Secundario (VN)
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white">-{vn.reductionPct}%</span>
              <span className="text-xs font-semibold text-purple-400">Nodos Afectados</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Mediana C0: <strong className="text-slate-200">{vn.c0.median}</strong> nodos <br />
              Mediana C1: <strong className="text-purple-400">{vn.c1.median}</strong> nodos
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Cliff's Delta (VN)</span>
            <span className="text-purple-400 font-semibold">d = {vn.cliffsDelta.delta.toFixed(2)} ({vn.cliffsDelta.magnitude === 'Large' ? 'Grande' : vn.cliffsDelta.magnitude})</span>
          </div>
        </div>

        {/* KPI 3: Effect Size Magnitude */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 glass-panel-hover space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tamaño del Efecto (Cliff's Δ)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-emerald-400">{vr.cliffsDelta.magnitude === 'Large' ? 'Grande' : vr.cliffsDelta.magnitude}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Cliff's Delta: <span className="font-mono text-white font-semibold">d = {vr.cliffsDelta.delta.toFixed(3)}</span> <br />
              (Umbral Efecto Grande: |d| ≥ 0.474)
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Significancia Práctica</span>
            <span className="text-emerald-400 font-semibold">Muy Fuerte</span>
          </div>
        </div>

        {/* KPI 4: Sample Replications */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 glass-panel-hover space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Protocolo del Estudio (N)
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white">N = {sampleSize.total}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              C0 Línea Base: <strong className="text-slate-200">{sampleSize.c0}</strong> pruebas <br />
              C1 Accesible: <strong className="text-slate-200">{sampleSize.c1}</strong> pruebas
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Ejecución Aleatorizada</span>
            <span className="text-blue-400 font-semibold">Controlada por Semilla</span>
          </div>
        </div>

      </div>

      {/* Protocol Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Condition C0 Baseline Summary */}
        <div className="glass-panel p-5 rounded-xl border border-rose-500/20 bg-rose-950/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h3 className="text-sm font-bold text-rose-300">Condición C0 (Prompt de Línea Base)</h3>
            </div>
            <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              N = 20
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            El LLM recibe instrucciones estándar de desarrollo para una interfaz de transferencias bancarias sin requisitos explícitos de accesibilidad.
          </p>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-1 text-xs font-mono text-slate-400">
            <p>• Mediana de Reglas Violadas (VR): <span className="text-rose-400 font-bold">{vr.c0.median}</span> (IQR: {vr.c0.iqr})</p>
            <p>• Mediana de Nodos Violados (VN): <span className="text-rose-400 font-bold">{vn.c0.median}</span> (IQR: {vn.c0.iqr})</p>
            <p>• Fallas Más Frecuentes: <span className="text-slate-200">color-contrast, label, button-name</span></p>
          </div>
        </div>

        {/* Condition C1 Accessibility Summary */}
        <div className="glass-panel p-5 rounded-xl border border-emerald-500/20 bg-emerald-950/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-bold text-emerald-300">Condición C1 (Prompt Accesible WCAG 2.2 AA)</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              N = 20
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            El LLM recibe instrucciones junto con reglas explícitas de WCAG 2.2 AA (ratios de contraste, ARIA, indicadores de foco, tamaño de objetivo de 24px, etiquetas).
          </p>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-1 text-xs font-mono text-slate-400">
            <p>• Mediana de Reglas Violadas (VR): <span className="text-emerald-400 font-bold">{vr.c1.median}</span> (IQR: {vr.c1.iqr})</p>
            <p>• Mediana de Nodos Violados (VN): <span className="text-emerald-400 font-bold">{vn.c1.median}</span> (IQR: {vn.c1.iqr})</p>
            <p>• Fallas Residuales: <span className="text-slate-200">Avisos menores de tamaño de objetivo o regiones de landmark</span></p>
          </div>
        </div>

      </div>

    </div>
  );
}
