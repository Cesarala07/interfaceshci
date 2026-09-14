import React, { useState } from 'react';
import { Layers, Scale, ChevronRight, BarChart2, Info, ArrowDownRight } from 'lucide-react';

export default function StatsDashboard({ stats, trials }) {
  const [metricType, setMetricType] = useState('VR'); // 'VR' or 'VN'

  if (!stats || !trials) return null;

  const currentMetric = metricType === 'VR' ? stats.vr : stats.vn;
  const metricLabel = metricType === 'VR' ? 'Reglas Violadas (VR)' : 'Nodos Violados (VN)';

  const c0Values = trials.filter(t => t.condition === 'C0').map(t => metricType === 'VR' ? t.violatedRulesCount : t.violatingNodesCount);
  const c1Values = trials.filter(t => t.condition === 'C1').map(t => metricType === 'VR' ? t.violatedRulesCount : t.violatingNodesCount);

  // Group frequency buckets
  const getFrequencyBuckets = (vals) => {
    const counts = {};
    vals.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
    return counts;
  };

  const c0Buckets = getFrequencyBuckets(c0Values);
  const c1Buckets = getFrequencyBuckets(c1Values);

  const maxVal = Math.max(...c0Values, ...c1Values, 8);
  const bucketsArray = Array.from({ length: maxVal + 1 }, (_, i) => i);

  return (
    <div className="space-y-6">
      
      {/* Header & Metric Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            <span>Análisis Estadístico y Prueba de Hipótesis</span>
          </h2>
          <p className="text-xs text-slate-400">
            Prueba no paramétrica de Mann–Whitney U (dos colas) y análisis del tamaño del efecto Cliff's Delta
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setMetricType('VR')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              metricType === 'VR'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Reglas Violadas (VR)
          </button>
          <button
            onClick={() => setMetricType('VN')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              metricType === 'VN'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Nodos Violados (VN)
          </button>
        </div>
      </div>

      {/* Visual Box Plot & Distribution Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Distribution Histogram */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" />
              <span>Histograma de Distribución: {metricLabel}</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">N = 20 vs N = 20</span>
          </div>

          <div className="space-y-4 pt-2">
            
            {/* C0 Bars */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-rose-400 font-medium">
                <span>Condición C0 (Línea Base)</span>
                <span>Mediana: {currentMetric.c0.median}</span>
              </div>
              <div className="h-24 bg-slate-950/80 rounded-lg p-2 border border-slate-800 flex items-end justify-between gap-1">
                {bucketsArray.map(bucket => {
                  const count = c0Buckets[bucket] || 0;
                  const heightPct = (count / 20) * 100;
                  return (
                    <div key={`c0-${bucket}`} className="flex-1 flex flex-col items-center group relative">
                      {count > 0 && (
                        <span className="text-[10px] font-mono text-rose-300 mb-1">{count}</span>
                      )}
                      <div 
                        className="w-full bg-rose-500/70 hover:bg-rose-400 rounded-t transition-all"
                        style={{ height: `${Math.max(heightPct, 4)}%` }}
                      />
                      <span className="text-[10px] font-mono text-slate-500 mt-1">{bucket}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* C1 Bars */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                <span>Condición C1 (Prompt Accesible WCAG 2.2 AA)</span>
                <span>Mediana: {currentMetric.c1.median}</span>
              </div>
              <div className="h-24 bg-slate-950/80 rounded-lg p-2 border border-slate-800 flex items-end justify-between gap-1">
                {bucketsArray.map(bucket => {
                  const count = c1Buckets[bucket] || 0;
                  const heightPct = (count / 20) * 100;
                  return (
                    <div key={`c1-${bucket}`} className="flex-1 flex flex-col items-center group relative">
                      {count > 0 && (
                        <span className="text-[10px] font-mono text-emerald-300 mb-1">{count}</span>
                      )}
                      <div 
                        className="w-full bg-emerald-500/70 hover:bg-emerald-400 rounded-t transition-all"
                        style={{ height: `${Math.max(heightPct, 4)}%` }}
                      />
                      <span className="text-[10px] font-mono text-slate-500 mt-1">{bucket}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center pt-1 border-t border-slate-800/60">
              Eje Horizontal: Cantidad de {metricLabel} por prueba • Eje Vertical: Frecuencia de pruebas
            </div>

          </div>
        </div>

        {/* Boxplot Representation */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Diagramas de Caja: Mediana y Rango Intercuartil (IQR)</span>
            </h3>
          </div>

          <div className="space-y-6 pt-4">
            
            {/* Boxplot C0 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-rose-400">C0 Línea Base</span>
                <span className="font-mono text-slate-300">
                  Q1: {currentMetric.c0.q1} | Mediana: {currentMetric.c0.median} | Q3: {currentMetric.c0.q3} | IQR: {currentMetric.c0.iqr}
                </span>
              </div>
              <div className="relative h-12 bg-slate-950 rounded-lg border border-slate-800 flex items-center px-4">
                {/* Horizontal range bar */}
                <div className="w-full h-1 bg-slate-800 relative">
                  {/* Min to Max line */}
                  <div 
                    className="absolute h-1 bg-rose-500/40" 
                    style={{ 
                      left: `${(currentMetric.c0.min / maxVal) * 100}%`,
                      width: `${((currentMetric.c0.max - currentMetric.c0.min) / maxVal) * 100}%` 
                    }}
                  />
                  {/* IQR Box */}
                  <div 
                    className="absolute -top-3.5 h-8 bg-rose-500/30 border-2 border-rose-400 rounded"
                    style={{ 
                      left: `${(currentMetric.c0.q1 / maxVal) * 100}%`,
                      width: `${(Math.max(currentMetric.c0.iqr, 0.5) / maxVal) * 100}%` 
                    }}
                  />
                  {/* Median Line */}
                  <div 
                    className="absolute -top-4 h-9 w-1 bg-white shadow-lg z-10"
                    style={{ left: `${(currentMetric.c0.median / maxVal) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Boxplot C1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-emerald-400">C1 Accesible</span>
                <span className="font-mono text-slate-300">
                  Q1: {currentMetric.c1.q1} | Mediana: {currentMetric.c1.median} | Q3: {currentMetric.c1.q3} | IQR: {currentMetric.c1.iqr}
                </span>
              </div>
              <div className="relative h-12 bg-slate-950 rounded-lg border border-slate-800 flex items-center px-4">
                <div className="w-full h-1 bg-slate-800 relative">
                  <div 
                    className="absolute h-1 bg-emerald-500/40" 
                    style={{ 
                      left: `${(currentMetric.c1.min / maxVal) * 100}%`,
                      width: `${((currentMetric.c1.max - currentMetric.c1.min) / maxVal) * 100}%` 
                    }}
                  />
                  <div 
                    className="absolute -top-3.5 h-8 bg-emerald-500/30 border-2 border-emerald-400 rounded"
                    style={{ 
                      left: `${(currentMetric.c1.q1 / maxVal) * 100}%`,
                      width: `${(Math.max(currentMetric.c1.iqr, 0.5) / maxVal) * 100}%` 
                    }}
                  />
                  <div 
                    className="absolute -top-4 h-9 w-1 bg-white shadow-lg z-10"
                    style={{ left: `${(currentMetric.c1.median / maxVal) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Summary Callout */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-white">Interpretación del Resultado Estadístico:</p>
              <p>
                Los rangos intercuartiles (IQR) sin solapamiento demuestran una separación categórica entre la condición base y la condición con prompt de accesibilidad, sin necesidad de asumir supuestos de normalidad paramétrica.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Mann-Whitney U & Cliff's Delta Numerical Table */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">
          Resultados Detallados de Estadística Inferencial (Mann–Whitney U y Cliff's Delta)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Métrica de Resultado</th>
                <th className="p-3 text-center">C0 Línea Base (Med [IQR])</th>
                <th className="p-3 text-center">C1 Accesible (Med [IQR])</th>
                <th className="p-3 text-center">Estadístico U MWU</th>
                <th className="p-3 text-center">Puntuación z</th>
                <th className="p-3 text-center">Valor p (Dos Colas)</th>
                <th className="p-3 text-center">Cliff's Delta (d)</th>
                <th className="p-3 text-center">Tamaño del Efecto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              
              <tr className="hover:bg-slate-900/50 transition">
                <td className="p-3 font-semibold text-indigo-300">Reglas Violadas (VR)</td>
                <td className="p-3 text-center text-rose-400">{stats.vr.c0.median} [{stats.vr.c0.iqr}]</td>
                <td className="p-3 text-center text-emerald-400">{stats.vr.c1.median} [{stats.vr.c1.iqr}]</td>
                <td className="p-3 text-center font-bold text-white">{stats.vr.mwu.u}</td>
                <td className="p-3 text-center">{stats.vr.mwu.z.toFixed(3)}</td>
                <td className="p-3 text-center font-bold text-emerald-400">
                  {stats.vr.mwu.pValue < 0.0001 ? '< 0.0001 ***' : stats.vr.mwu.pValue.toFixed(4)}
                </td>
                <td className="p-3 text-center font-bold">{stats.vr.cliffsDelta.delta.toFixed(3)}</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-sans text-[10px] font-bold border border-emerald-500/30">
                    {stats.vr.cliffsDelta.magnitude === 'Large' ? 'Grande' : stats.vr.cliffsDelta.magnitude}
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-900/50 transition">
                <td className="p-3 font-semibold text-purple-300">Nodos Violados (VN)</td>
                <td className="p-3 text-center text-rose-400">{stats.vn.c0.median} [{stats.vn.c0.iqr}]</td>
                <td className="p-3 text-center text-emerald-400">{stats.vn.c1.median} [{stats.vn.c1.iqr}]</td>
                <td className="p-3 text-center font-bold text-white">{stats.vn.mwu.u}</td>
                <td className="p-3 text-center">{stats.vn.mwu.z.toFixed(3)}</td>
                <td className="p-3 text-center font-bold text-emerald-400">
                  {stats.vn.mwu.pValue < 0.0001 ? '< 0.0001 ***' : stats.vn.mwu.pValue.toFixed(4)}
                </td>
                <td className="p-3 text-center font-bold">{stats.vn.cliffsDelta.delta.toFixed(3)}</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-sans text-[10px] font-bold border border-purple-500/30">
                    {stats.vn.cliffsDelta.magnitude === 'Large' ? 'Grande' : stats.vn.cliffsDelta.magnitude}
                  </span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-400">
          *** Indica significancia estadística al nivel de \(\alpha = 0.001\). Interpretación de Cliff's Delta: Grande si \(|d| \ge 0.474\), Mediano si \(0.33 \le |d| &lt; 0.474\), Pequeño si \(0.147 \le |d| &lt; 0.33\).
        </p>

      </div>

    </div>
  );
}
