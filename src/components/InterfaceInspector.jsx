import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  Code, 
  ExternalLink, 
  Monitor, 
  Smartphone, 
  Tablet,
  FileText
} from 'lucide-react';

export default function InterfaceInspector({ trials }) {
  const [selectedTrialId, setSelectedTrialId] = useState('C0_01');
  const [selectedViolationIndex, setSelectedViolationIndex] = useState(0);
  const [viewportMode, setViewportMode] = useState('desktop'); // desktop, tablet, mobile

  if (!trials || trials.length === 0) return null;

  const currentTrial = trials.find(t => t.id === selectedTrialId) || trials[0];
  const currentViolation = currentTrial.violations[selectedViolationIndex] || currentTrial.violations[0];

  const c0Trials = trials.filter(t => t.condition === 'C0');
  const c1Trials = trials.filter(t => t.condition === 'C1');

  // Viewport width styling
  const getViewportWidthClass = () => {
    if (viewportMode === 'mobile') return 'w-[375px]';
    if (viewportMode === 'tablet') return 'w-[768px]';
    return 'w-full';
  };

  return (
    <div className="space-y-6">
      
      {/* Selector Header Bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Eye className="w-5 h-5 text-indigo-400" />
            <span>Inspector de Interfaces Bancarias y Axe-core</span>
          </h2>
          <p className="text-xs text-slate-400">
            Inspecciona los artefactos HTML generados y las violaciones automatizadas de reglas WCAG 2.2
          </p>
        </div>

        {/* Trial Dropdown Selector */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400">Seleccionar Prueba:</span>
            <select
              value={selectedTrialId}
              onChange={(e) => {
                setSelectedTrialId(e.target.value);
                setSelectedViolationIndex(0);
              }}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold focus:outline-none focus:border-indigo-500"
            >
              <optgroup label="Pruebas C0 Línea Base (N=20)">
                {c0Trials.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.id} — Línea Base ({t.violatedRulesCount} VR / {t.violatingNodesCount} VN)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Pruebas C1 Accesibles WCAG 2.2 AA (N=20)">
                {c1Trials.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.id} — Accesible ({t.violatedRulesCount} VR / {t.violatingNodesCount} VN)
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Condition Badge */}
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
            currentTrial.condition === 'C0'
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            {currentTrial.condition === 'C0' ? 'C0 Línea Base' : 'C1 WCAG 2.2 AA'}
          </span>

        </div>
      </div>

      {/* Main Split Inspector View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Iframe Rendered Interface (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-xl border border-slate-800 overflow-hidden flex flex-col">
          
          {/* Iframe Control Bar */}
          <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">
                {currentTrial.htmlFile}
              </span>
            </div>

            {/* Device Viewport Toggle */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-md border border-slate-800">
              <button
                onClick={() => setViewportMode('desktop')}
                title="Vista Escritorio (Ancho Completo)"
                className={`p-1 rounded ${viewportMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewportMode('tablet')}
                title="Vista Tableta (768px)"
                className={`p-1 rounded ${viewportMode === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewportMode('mobile')}
                title="Vista Móvil (375px)"
                className={`p-1 rounded ${viewportMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Iframe Viewport Container */}
          <div className="bg-slate-950 p-4 min-h-[480px] flex justify-center items-start overflow-auto">
            <div className={`transition-all duration-300 ${getViewportWidthClass()} bg-white rounded-lg shadow-2xl overflow-hidden min-h-[440px]`}>
              <iframe
                key={currentTrial.id}
                srcDoc={getTrialHtml(currentTrial.id)}
                title={`Trial ${currentTrial.id}`}
                className="w-full h-[450px] border-none"
              />
            </div>
          </div>

          {/* Footer note */}
          <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Documento Bancario Independiente de Página Única</span>
            <span className="font-mono text-slate-500">HTML/CSS/JS Autónomo</span>
          </div>

        </div>

        {/* Right Column: Axe-core Violation Audit Report (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Auditoría Automatizada axe-core</span>
            </h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {currentTrial.violatedRulesCount} Reglas Violadas
            </span>
          </div>

          {/* Violations List */}
          {currentTrial.violations.length === 0 ? (
            <div className="p-6 text-center space-y-2 bg-emerald-950/10 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-emerald-300">¡Cero Infracciones de Accesibilidad Detectadas!</p>
              <p className="text-xs text-slate-400">
                Esta interfaz cumplió con todas las reglas automatizadas de axe-core para WCAG 2.2 Nivel A/AA.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              
              {/* Violation selector pills */}
              <div className="flex overflow-x-auto space-x-1.5 pb-1">
                {currentTrial.violations.map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedViolationIndex(idx)}
                    className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition ${
                      selectedViolationIndex === idx
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {v.id}
                  </button>
                ))}
              </div>

              {/* Selected Violation Card */}
              {currentViolation && (
                <div className="bg-slate-900/90 rounded-xl p-4 border border-rose-500/30 space-y-3">
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                        ID de Regla: {currentViolation.id}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        {currentViolation.help}
                      </h4>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                      currentViolation.impact === 'critical' 
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {currentViolation.impact === 'critical' ? 'Crítico' : currentViolation.impact === 'serious' ? 'Serio' : currentViolation.impact === 'moderate' ? 'Moderado' : 'Leve'}
                    </span>
                  </div>

                  {/* WCAG Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {currentViolation.tags && currentViolation.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* DOM Selector */}
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Selector del Elemento Objetivo:</span>
                    <p className="text-xs font-mono text-indigo-300 break-all">
                      {currentViolation.selector}
                    </p>
                  </div>

                  {/* Code Remediation Advice */}
                  <div className="bg-indigo-950/30 p-3 rounded-lg border border-indigo-500/20 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-300">
                      <Code className="w-3.5 h-3.5" />
                      <span>Guía de Remediación WCAG 2.2</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {getRemediationText(currentViolation.id)}
                    </p>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

// Inline HTML getter for iframe preview
function getTrialHtml(trialId) {
  const isC0 = trialId.startsWith('C0');
  const num = trialId.split('_')[1];
  
  if (isC0) {
    return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background: #f4f6f8; margin: 0; padding: 20px; }
    .card { background: #ffffff; width: 380px; margin: 20px auto; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    h2 { color: #888888; font-size: 18px; margin-top: 0; }
    .form-group { margin-bottom: 15px; }
    span.label { display: block; font-weight: bold; margin-bottom: 5px; color: #aaaaaa; }
    input, select { width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
    .btn { background: #4a90e2; color: #ffffff; border: none; padding: 6px 12px; height: 20px; cursor: pointer; border-radius: 4px; font-weight: bold; }
    .icon-btn { background: none; border: none; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Make a Bank Transfer (${trialId})</h2>
    <form>
      <div class="form-group">
        <span class="label">Source Account:</span>
        <select>
          <option>Checking Account (*4829) - $12,450.00</option>
          <option>Savings Account (*9102) - $5,300.00</option>
        </select>
      </div>

      <div class="form-group">
        <span class="label">Beneficiary Name:</span>
        <input type="text" placeholder="Enter beneficiary name" />
      </div>

      <div class="form-group">
        <span class="label">Destination Account / IBAN:</span>
        <input type="text" placeholder="US12 3456 7890 1234" />
      </div>

      <div class="form-group">
        <span class="label">Transfer Amount:</span>
        <input type="number" placeholder="0.00" />
      </div>

      <div class="form-group">
        <span class="label">Execution Date:</span>
        <input type="date" />
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
        <button type="button" class="btn" onclick="alert('Transfer Executed')">Confirm Transfer</button>
        <button type="button" class="icon-btn">ℹ️</button>
      </div>
    </form>
  </div>
</body>
</html>`;
  } else {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Accessible Secure Bank Transfer (${trialId})</title>
  <style>
    :root { --primary: #1e3a8a; --text: #0f172a; --bg: #f8fafc; }
    body { font-family: system-ui, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 2rem; }
    main { max-width: 32rem; margin: 0 auto; background: #ffffff; padding: 2rem; border-radius: 0.75rem; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    h1 { color: var(--primary); font-size: 1.5rem; margin-top: 0; margin-bottom: 1.5rem; font-weight: 700; }
    .form-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
    label { font-weight: 600; color: #1e293b; font-size: 0.95rem; }
    input, select { width: 100%; padding: 0.75rem; border: 1.5px solid #64748b; border-radius: 0.375rem; font-size: 1rem; color: var(--text); min-height: 44px; box-sizing: border-box; }
    input:focus-visible, select:focus-visible, button:focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }
    .btn-primary { background: var(--primary); color: #ffffff; font-weight: 700; border: none; padding: 0.875rem 1.5rem; min-height: 48px; border-radius: 0.375rem; cursor: pointer; font-size: 1rem; width: 100%; }
    .btn-primary:hover { background: #1e40af; }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>Secure Money Transfer (${trialId})</h1>
    </header>
    <form>
      <div class="form-group">
        <label for="src_acc">Source Account</label>
        <select id="src_acc" name="sourceAccount" required>
          <option value="chk">Premier Checking (*4829) - $12,450.00</option>
          <option value="svg">High Yield Savings (*9102) - $5,300.00</option>
        </select>
      </div>

      <div class="form-group">
        <label for="ben_name">Beneficiary Name</label>
        <input type="text" id="ben_name" name="beneficiaryName" required placeholder="e.g. Jane Doe" />
      </div>

      <div class="form-group">
        <label for="dest_iban">Destination Account / IBAN</label>
        <input type="text" id="dest_iban" name="destinationAccount" required placeholder="US12 3456 7890 1234" />
      </div>

      <div class="form-group">
        <label for="amount">Transfer Amount ($)</label>
        <input type="number" id="amount" name="amount" step="0.01" required placeholder="0.00" />
      </div>

      <div class="form-group">
        <label for="date">Execution Date</label>
        <input type="date" id="date" name="transferDate" required />
      </div>

      <div style="margin-top: 1.5rem;">
        <button type="submit" class="btn-primary">Review & Confirm Transfer</button>
      </div>
    </form>
  </main>
</body>
</html>`;
  }
}

function getRemediationText(ruleId) {
  switch (ruleId) {
    case 'color-contrast':
      return 'Aumentar la relación de contraste del color del texto a un mínimo de 4.5:1 respecto al fondo (WCAG 2.1 AA 1.4.3). Utilizar texto oscuro (#1e293b) en lugar de gris claro (#aaaaaa).';
    case 'label':
      return 'Reemplazar los elementos <span> con etiquetas explícitas <label for="elementId"> conectadas mediante el atributo id al control de formulario (WCAG 2.1 A 3.3.2).';
    case 'html-has-lang':
      return 'Declarar el atributo del idioma natural principal en el elemento raíz: <html lang="es"> (WCAG 2.1 A 3.1.1).';
    case 'button-name':
      return 'Proporcionar texto accesible dentro del botón o mediante un atributo aria-label para botones interactivos (WCAG 2.1 A 4.1.2).';
    case 'target-size':
      return 'Garantizar que los botones y controles táctiles tengan dimensiones mínimas de 24x24 píxeles CSS con espaciado adecuado (WCAG 2.2 AA 2.5.8).';
    default:
      return 'Revisar las directrices de WCAG 2.2 AA para asegurar atributos ARIA adecuados, etiquetas semánticas y total operabilidad por teclado.';
  }
}
