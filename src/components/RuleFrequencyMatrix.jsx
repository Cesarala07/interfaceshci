import React from 'react';
import { ShieldCheck, AlertCircle, ArrowDown, HelpCircle } from 'lucide-react';

export default function RuleFrequencyMatrix({ stats }) {
  if (!stats || !stats.ruleFrequency) return null;

  const rules = stats.ruleFrequency;

  return (
    <div className="space-y-6">
      
      {/* Matrix Header */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>Matriz de Frecuencia e Impacto de Reglas WCAG 2.2 (Análisis RQ2)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Análisis comparativo de reglas axe-core específicas violadas en la Condición C0 (Línea Base) vs. C1 (Accesible)
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
          <span className="text-slate-400">Reglas Únicas Totales:</span>
          <span className="text-indigo-400 font-bold">{rules.length} Reglas</span>
        </div>
      </div>

      {/* Rules Table */}
      <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
              <tr>
                <th className="p-3.5">ID Regla axe-core</th>
                <th className="p-3.5">Criterio de Conformidad WCAG 2.2</th>
                <th className="p-3.5">Severidad</th>
                <th className="p-3.5 text-center">C0 Línea Base (N=20)</th>
                <th className="p-3.5 text-center">C1 Accesible (N=20)</th>
                <th className="p-3.5 text-center">Nodos DOM (C0 vs C1)</th>
                <th className="p-3.5 text-center">% Reducción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              {rules.map((rule, idx) => {
                const totalTrials = rule.c0_count + rule.c1_count;
                const c0Pct = Math.round((rule.c0_count / 20) * 100);
                const c1Pct = Math.round((rule.c1_count / 20) * 100);
                const reduction = rule.c0_count === 0 ? 0 : Math.round(((rule.c0_count - rule.c1_count) / rule.c0_count) * 100);
                const wcagTag = rule.wcagTags ? rule.wcagTags.find(t => t.startsWith('wcag')) : 'wcag2a';

                return (
                  <tr key={idx} className="hover:bg-slate-900/60 transition group">
                    
                    {/* Rule ID & Description */}
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-indigo-300 group-hover:text-indigo-200">
                        {rule.id}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {rule.help}
                      </div>
                    </td>

                    {/* WCAG Tag */}
                    <td className="p-3.5 font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                        {formatWcagTag(wcagTag)}
                      </span>
                    </td>

                    {/* Impact Level */}
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rule.impact === 'critical'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {rule.impact === 'critical' ? 'Crítico' : rule.impact === 'serious' ? 'Serio' : rule.impact === 'moderate' ? 'Moderado' : 'Leve'}
                      </span>
                    </td>

                    {/* C0 Count */}
                    <td className="p-3.5 text-center font-mono">
                      <div className="font-bold text-rose-400">{rule.c0_count} / 20</div>
                      <div className="text-[10px] text-slate-500">{c0Pct}% de pruebas</div>
                    </td>

                    {/* C1 Count */}
                    <td className="p-3.5 text-center font-mono">
                      <div className="font-bold text-emerald-400">{rule.c1_count} / 20</div>
                      <div className="text-[10px] text-slate-500">{c1Pct}% de pruebas</div>
                    </td>

                    {/* DOM Nodes */}
                    <td className="p-3.5 text-center font-mono text-slate-300">
                      <span className="text-rose-400">{rule.c0_nodes}</span> vs <span className="text-emerald-400">{rule.c1_nodes}</span>
                    </td>

                    {/* Reduction % */}
                    <td className="p-3.5 text-center font-mono">
                      <span className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded text-[11px] font-bold ${
                        reduction > 50
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {reduction > 0 && <ArrowDown className="w-3 h-3" />}
                        <span>{reduction}%</span>
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary insights box */}
      <div className="glass-panel p-5 rounded-xl border border-indigo-500/20 bg-indigo-950/20 space-y-2">
        <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
          Hallazgos Clave de RQ2 (Impacto en Frecuencia de Reglas):
        </h4>
        <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
          <li>
            <strong>Controles de Formulario (<code className="text-indigo-300">label</code>):</strong> Solucionado al 100% en C1 (eliminación total de etiquetas explícitas ausentes).
          </li>
          <li>
            <strong>Contraste de Color (<code className="text-indigo-300">color-contrast</code>):</strong> Completamente resuelto en C1 al especificar ratios estrictos de contraste (\(\ge 4.5:1\)).
          </li>
          <li>
            <strong>Elementos Interactivos (<code className="text-indigo-300">button-name</code> y <code className="text-indigo-300">target-size</code>):</strong> Drásticamente reducidos gracias a instrucciones explícitas sobre tamaño táctil y texto accesible en botones.
          </li>
        </ul>
      </div>

    </div>
  );
}

function formatWcagTag(tag) {
  if (!tag) return 'WCAG 2.2 AA';
  if (tag === 'wcag143') return 'WCAG 1.4.3 (AA)';
  if (tag === 'wcag332') return 'WCAG 3.3.2 (A)';
  if (tag === 'wcag311') return 'WCAG 3.1.1 (A)';
  if (tag === 'wcag412') return 'WCAG 4.1.2 (A)';
  if (tag === 'wcag258') return 'WCAG 2.5.8 (AA)';
  if (tag === 'wcag131') return 'WCAG 1.3.1 (A)';
  return tag.toUpperCase();
}
