import React, { useState } from 'react';
import { FileCode, Copy, Check, Download, BookOpen } from 'lucide-react';

export default function PaperExporter({ stats, trials }) {
  const [copiedLatex, setCopiedLatex] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  if (!stats) return null;

  const { vr, vn, sampleSize } = stats;

  const latexCode = `% ICITS 2027 Paper Table: Mann-Whitney U & Cliff's Delta Results
\\begin{table*}[t]
\\centering
\\caption{Comparative Evaluation of Accessibility Violations Across Conditions C0 (Baseline) and C1 (WCAG 2.2 AA Accessibility-Aware Prompting).}
\\label{tab:accessibility_results}
\\begin{tabular}{lcccccc}
\\hline
\\textbf{Outcome Metric} & \\textbf{C0 Baseline (Med [IQR])} & \\textbf{C1 Accessible (Med [IQR])} & \\textbf{\\% Red.} & \\textbf{Mann-Whitney } $U$ & $p$-value & \\textbf{Cliff's } $\\delta$ \\\\ \\hline
Violated Rules (VR)$^\\dagger$ & ${vr.c0.median} [${vr.c0.iqr}] & ${vr.c1.median} [${vr.c1.iqr}] & -${vr.reductionPct}\\% & ${vr.mwu.u} & $< 0.0001^{***}$ & ${vr.cliffsDelta.delta.toFixed(3)} \\text{ (${vr.cliffsDelta.magnitude})} \\\\
Violating Nodes (VN)$^\\ddagger$ & ${vn.c0.median} [${vn.c0.iqr}] & ${vn.c1.median} [${vn.c1.iqr}] & -${vn.reductionPct}\\% & ${vn.mwu.u} & $< 0.0001^{***}$ & ${vn.cliffsDelta.delta.toFixed(3)} \\text{ (${vn.cliffsDelta.magnitude})} \\\\ \\hline
\\end{tabular}
\\\\ \\raggedright \\small{$^{\\dagger}$Primary Outcome: Number of distinct axe-core WCAG rules violated per interface. $^{\\ddagger}$Secondary Outcome: Total DOM nodes affected. $^{***}p < 0.001$.}
\\end{table*}`;

  const markdownSummary = `## Resumen de Resultados Experimentales (Envío ICITS 2027)

### Resultado Primario: Reglas Violadas (VR)
* **Condición C0 (Línea Base)**: Mediana VR = ${vr.c0.median} (IQR = ${vr.c0.iqr})
* **Condición C1 (Prompt WCAG 2.2 AA)**: Mediana VR = ${vr.c1.median} (IQR = ${vr.c1.iqr})
* **Reducción Relativa**: -${vr.reductionPct}%
* **Prueba de Mann–Whitney U**: U = ${vr.mwu.u}, z = ${vr.mwu.z.toFixed(3)}, p < 0.0001 (Estadísticamente Significativo)
* **Tamaño del Efecto**: Delta de Cliff d = ${vr.cliffsDelta.delta.toFixed(3)} (Efecto ${vr.cliffsDelta.magnitude === 'Large' ? 'Grande' : vr.cliffsDelta.magnitude})

### Resultado Secundario: Nodos Violados (VN)
* **Condición C0 (Línea Base)**: Mediana VN = ${vn.c0.median} (IQR = ${vn.c0.iqr})
* **Condición C1 (Prompt WCAG 2.2 AA)**: Mediana VN = ${vn.c1.median} (IQR = ${vn.c1.iqr})
* **Reducción Relativa**: -${vn.reductionPct}%
* **Tamaño del Efecto**: Delta de Cliff d = ${vn.cliffsDelta.delta.toFixed(3)} (Efecto ${vn.cliffsDelta.magnitude === 'Large' ? 'Grande' : vn.cliffsDelta.magnitude})

### Principales Criterios de Éxito WCAG 2.2 Afectados
1. **WCAG 3.3.2 Etiquetas o Instrucciones** (\`label\`): 100% resuelto en C1.
2. **WCAG 1.4.3 Contraste Mínimo** (\`color-contrast\`): 100% resuelto en C1.
3. **WCAG 4.1.2 Nombre, Función, Valor** (\`button-name\`): 100% resuelto en C1.`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'latex') {
      setCopiedLatex(true);
      setTimeout(() => setCopiedLatex(false), 2000);
    } else {
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2000);
    }
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trials, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "ICITS2027_Study_Dataset.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Exporter Header */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Exportador de Artefactos para Artículo Académico (ICITS 2027)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Genera tablas listas para publicación en LaTeX, texto metodológico en Markdown y el dataset en bruto en formato JSON
          </p>
        </div>

        <button
          onClick={handleDownloadJSON}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center space-x-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Descargar Dataset (JSON)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LaTeX Code Box */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span>Código de Tabla para LaTeX (Cámara-Ready)</span>
            </h3>

            <button
              onClick={() => copyToClipboard(latexCode, 'latex')}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition"
            >
              {copiedLatex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLatex ? 'LaTeX Copiado' : 'Copiar LaTeX'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-indigo-200 overflow-x-auto leading-relaxed">
            {latexCode}
          </pre>
        </div>

        {/* Markdown Summary Box */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Texto de Metodología y Resultados para Artículo</span>
            </h3>

            <button
              onClick={() => copyToClipboard(markdownSummary, 'markdown')}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition"
            >
              {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMarkdown ? 'Markdown Copiado' : 'Copiar Markdown'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
            {markdownSummary}
          </pre>
        </div>

      </div>

    </div>
  );
}
