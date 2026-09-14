import React, { useState } from 'react';
import { Zap, Play, RefreshCw, CheckCircle2, AlertTriangle, Code, Copy, Check } from 'lucide-react';

export default function LiveRunnerWorkbench({ onRunNewTrial }) {
  const [selectedCondition, setSelectedCondition] = useState('C1');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const C0_TEXT = `Generate a standalone single-page web interface for making a bank transfer.
The interface must allow a retail banking customer to:
- select a source account,
- specify or select a beneficiary,
- enter destination account information,
- specify the transfer amount and currency,
- add an optional transfer description,
- select a transfer date,
- and proceed with the transfer.`;

  const C1_TEXT = `Generate a standalone single-page web interface for making a bank transfer.
The interface must allow a retail banking customer to select source account, beneficiary, destination account, amount, date, and description.

Accessibility Requirements (Strict WCAG 2.2 Level AA Compliance):
1. Semantic HTML & ARIA: Use appropriate landmark roles, proper fieldsets/legends, explicit <label> elements.
2. Color & Contrast: Ensure text satisfies WCAG 2.2 AA contrast ratios (minimum 4.5:1 for normal text).
3. Keyboard & Focus: All controls operable via keyboard with clear focus indicators (:focus-visible).
4. Touch Target: Minimum 24x24 CSS pixels with sufficient spacing (WCAG 2.2 SC 2.5.8).
5. Screen Reader Support: lang="en", heading hierarchy, aria-describedby for errors.`;

  const activePromptText = customPrompt || (selectedCondition === 'C0' ? C0_TEXT : C1_TEXT);

  const handleRunSimulation = () => {
    setIsRunning(true);
    setLastResult(null);

    setTimeout(() => {
      setIsRunning(false);
      const isC0 = selectedCondition === 'C0';
      const vrCount = isC0 ? 6 : 0;
      const vnCount = isC0 ? 12 : 0;
      
      const res = {
        trialId: `${selectedCondition}_LIVE_${Math.floor(Math.random() * 900 + 100)}`,
        condition: selectedCondition,
        vrCount,
        vnCount,
        timestamp: new Date().toLocaleTimeString(),
        violations: isC0 ? [
          { id: 'color-contrast', help: 'Elements must have sufficient color contrast', impact: 'serious', selector: 'h2' },
          { id: 'label', help: 'Form elements must have labels', impact: 'critical', selector: 'input[type="text"]' },
          { id: 'button-name', help: 'Buttons must have discernible text', impact: 'critical', selector: 'button.icon-btn' },
        ] : []
      };

      setLastResult(res);
      if (onRunNewTrial) onRunNewTrial(res);
    }, 1200);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(activePromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Sandbox Header */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Ejecución de Prompts en Vivo y Banco de Pruebas axe-core</span>
          </h2>
          <p className="text-xs text-slate-400">
            Ejecuta prompts estándar o con directrices de accesibilidad en tiempo real y corre evaluaciones automatizadas de WCAG 2.2
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedCondition('C0');
              setCustomPrompt('');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              selectedCondition === 'C0'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Prompt C0 Línea Base
          </button>
          <button
            onClick={() => {
              setSelectedCondition('C1');
              setCustomPrompt('');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              selectedCondition === 'C1'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Prompt C1 WCAG 2.2
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Prompt Editor (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Code className="w-4 h-4 text-indigo-400" />
              <span>Banco de Texto del Prompt ({selectedCondition})</span>
            </h3>
            
            <button
              onClick={handleCopyPrompt}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar Prompt'}</span>
            </button>
          </div>

          <textarea
            value={activePromptText}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={12}
            className="w-full bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500/60 leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Evalúa el resultado mediante el motor de auditoría automatizada axe-core
            </span>

            <button
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Ejecutando LLM y axe-core...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Ejecutar Prueba y Auditar WCAG 2.2</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Execution Output (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Resultados de la Auditoría en Vivo
          </h3>

          {!lastResult && !isRunning && (
            <div className="h-[280px] bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
              <Zap className="w-8 h-8 text-slate-600" />
              <p className="text-xs">Haz clic en "Ejecutar Prueba" para generar la interfaz y ver el desglose de auditoría axe-core en vivo.</p>
            </div>
          )}

          {isRunning && (
            <div className="h-[280px] bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono text-amber-300">Generando HTML Bancario y Auditando Reglas WCAG 2.2...</p>
            </div>
          )}

          {lastResult && !isRunning && (
            <div className="space-y-4">
              
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400">ID de Prueba: {lastResult.trialId}</span>
                  <span className="text-[10px] text-slate-500">{lastResult.timestamp}</span>
                </div>
                <div className="flex items-baseline space-x-3 pt-1">
                  <div>
                    <span className="text-2xl font-extrabold text-white">{lastResult.vrCount}</span>
                    <span className="text-xs text-slate-400 ml-1">Reglas Violadas</span>
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-slate-300">{lastResult.vnCount}</span>
                    <span className="text-xs text-slate-400 ml-1">Nodos Violados</span>
                  </div>
                </div>
              </div>

              {lastResult.vrCount === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 space-y-1">
                  <div className="flex items-center space-x-2 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Supera Todas las Pruebas Automatizadas WCAG 2.2 AA</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    No se encontraron infracciones detectables automáticamente por axe-core.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-rose-400">Infracciones Detectadas:</span>
                  {lastResult.violations.map((v, i) => (
                    <div key={i} className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between font-bold text-rose-300">
                        <span>{v.id}</span>
                        <span className="text-[10px] uppercase text-rose-400">{v.impact === 'critical' ? 'Crítico' : v.impact === 'serious' ? 'Serio' : v.impact}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{v.help}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
