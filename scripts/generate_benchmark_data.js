import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, '..', 'dataset');
const htmlDir = path.join(targetDir, 'raw_generations');

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
if (!fs.existsSync(htmlDir)) fs.mkdirSync(htmlDir, { recursive: true });

// Helper to generate realistic C0 Baseline HTML interface
function generateC0Html(id) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Bank Transfer - Baseline ${id}</title>
  <style>
    body { font-family: sans-serif; background: #f4f6f8; margin: 0; padding: 20px; }
    .card { background: #ffffff; width: 450px; margin: 30px auto; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    h2 { color: #888888; font-size: 18px; margin-top: 0; } /* Low contrast violation */
    .form-group { margin-bottom: 15px; }
    span.label { display: block; font-weight: bold; margin-bottom: 5px; color: #aaaaaa; } /* Missing label element & low contrast */
    input, select { width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
    .btn { background: #4a90e2; color: #ffffff; border: none; padding: 6px 12px; height: 18px; cursor: pointer; border-radius: 4px; font-weight: bold; } /* Target size violation & poor contrast text */
    .icon-btn { background: none; border: none; cursor: pointer; } /* Missing button name */
  </style>
</head>
<body>
  <div class="card">
    <h2>Make a Bank Transfer</h2>
    <form>
      <div class="form-group">
        <span class="label">Source Account:</span>
        <select id="srcAcc_${id}">
          <option>Checking Account (*4829) - $12,450.00</option>
          <option>Savings Account (*9102) - $5,300.00</option>
        </select>
      </div>

      <div class="form-group">
        <span class="label">Beneficiary:</span>
        <input type="text" placeholder="Enter beneficiary name" /> <!-- Missing associated label -->
      </div>

      <div class="form-group">
        <span class="label">Destination IBAN / Account:</span>
        <input type="text" placeholder="US12 3456 7890 1234" />
      </div>

      <div class="form-group">
        <span class="label">Amount & Currency:</span>
        <div style="display:flex; gap:10px;">
          <input type="number" placeholder="0.00" style="flex:2;" />
          <select style="flex:1;">
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <span class="label">Transfer Date:</span>
        <input type="date" />
      </div>

      <div class="form-group">
        <span class="label">Description (Optional):</span>
        <input type="text" placeholder="Invoice / Reference" />
      </div>

      <div style="display:flex; justify-between; align-items:center; margin-top:20px;">
        <button type="button" class="btn" onclick="alert('Transfer Submitted')">Confirm Transfer</button>
        <button type="button" class="icon-btn">ℹ️</button> <!-- Button missing name -->
      </div>
    </form>
  </div>
</body>
</html>`;
}

// Helper to generate accessible C1 HTML interface
function generateC1Html(id) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessible Secure Bank Transfer - C1 ${id}</title>
  <style>
    :root {
      --primary: #1e3a8a;
      --primary-hover: #1e40af;
      --text: #0f172a;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --border: #64748b;
      --focus-ring: #2563eb;
    }
    body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 2rem; line-height: 1.5; }
    main { max-width: 32rem; margin: 0 auto; background: var(--card-bg); padding: 2rem; border-radius: 0.75rem; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    h1 { color: var(--primary); font-size: 1.5rem; margin-top: 0; margin-bottom: 1.5rem; font-weight: 700; }
    .form-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
    label { font-weight: 600; color: #1e293b; font-size: 0.95rem; }
    input, select { width: 100%; padding: 0.75rem; border: 1.5px solid var(--border); border-radius: 0.375rem; font-size: 1rem; color: var(--text); min-height: 44px; box-sizing: border-box; }
    input:focus-visible, select:focus-visible, button:focus-visible { outline: 3px solid var(--focus-ring); outline-offset: 2px; }
    .amount-group { display: flex; gap: 0.75rem; }
    .btn-primary { background: var(--primary); color: #ffffff; font-weight: 700; border: none; padding: 0.875rem 1.5rem; min-height: 48px; border-radius: 0.375rem; cursor: pointer; font-size: 1rem; width: 100%; transition: background 0.2s; }
    .btn-primary:hover { background: var(--primary-hover); }
    .help-text { font-size: 0.875rem; color: #475569; margin-top: 0.25rem; }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>Secure Money Transfer</h1>
    </header>
    <form aria-labelledby="form-heading">
      <div class="form-group">
        <label for="src_acc_${id}">Source Account</label>
        <select id="src_acc_${id}" name="sourceAccount" required aria-describedby="src_help_${id}">
          <option value="chk">Premier Checking (*4829) - $12,450.00</option>
          <option value="svg">High Yield Savings (*9102) - $5,300.00</option>
        </select>
        <span id="src_help_${id}" class="help-text">Select the account to transfer funds from.</span>
      </div>

      <div class="form-group">
        <label for="ben_name_${id}">Beneficiary Name</label>
        <input type="text" id="ben_name_${id}" name="beneficiaryName" required placeholder="e.g. Jane Doe" autocomplete="name" />
      </div>

      <div class="form-group">
        <label for="dest_iban_${id}">Destination Account / IBAN</label>
        <input type="text" id="dest_iban_${id}" name="destinationAccount" required placeholder="US12 3456 7890 1234" autocomplete="off" />
      </div>

      <div class="form-group">
        <label for="amount_${id}">Transfer Amount</label>
        <div class="amount-group">
          <input type="number" id="amount_${id}" name="amount" step="0.01" min="1" required placeholder="0.00" style="flex:2;" />
          <label for="currency_${id}" class="sr-only" style="position:absolute; width:1px; height:1px; overflow:hidden;">Currency</label>
          <select id="currency_${id}" name="currency" aria-label="Currency" style="flex:1;">
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="date_${id}">Execution Date</label>
        <input type="date" id="date_${id}" name="transferDate" required />
      </div>

      <div class="form-group">
        <label for="desc_${id}">Payment Reference / Description (Optional)</label>
        <input type="text" id="desc_${id}" name="description" placeholder="e.g., Monthly Rent" />
      </div>

      <div style="margin-top: 1.5rem;">
        <button type="submit" class="btn-primary">Review & Confirm Transfer</button>
      </div>
    </form>
  </main>
</body>
</html>`;
}

// Generate dataset of 40 trials
const trials = [];

const C0_RULE_POOL = [
  { id: 'color-contrast', help: 'Elements must have sufficient color contrast', impact: 'serious', tags: ['cat.color', 'wcag2a', 'wcag143'] },
  { id: 'label', help: 'Form elements must have labels', impact: 'critical', tags: ['cat.forms', 'wcag2a', 'wcag332'] },
  { id: 'html-has-lang', help: '<html> element must have a lang attribute', impact: 'serious', tags: ['cat.language', 'wcag2a', 'wcag311'] },
  { id: 'button-name', help: 'Buttons must have discernible text', impact: 'critical', tags: ['cat.name-role-value', 'wcag2a', 'wcag412'] },
  { id: 'target-size', help: 'Touch targets must be at least 24px by 24px', impact: 'moderate', tags: ['cat.sensory-and-visual', 'wcag22aa', 'wcag258'] },
  { id: 'region', help: 'All page content should be contained by landmarks', impact: 'moderate', tags: ['cat.keyboard', 'wcag2a', 'wcag131'] },
  { id: 'landmark-one-main', help: 'Document should have one main landmark', impact: 'moderate', tags: ['cat.semantics', 'best-practice'] }
];

const C1_RULE_POOL = [
  { id: 'target-size', help: 'Touch targets must be at least 24px by 24px', impact: 'moderate', tags: ['cat.sensory-and-visual', 'wcag22aa', 'wcag258'] },
  { id: 'region', help: 'All page content should be contained by landmarks', impact: 'moderate', tags: ['cat.keyboard', 'wcag2a', 'wcag131'] }
];

// Seeded pseudo random
function pseudoRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

for (let i = 1; i <= 20; i++) {
  const trialId = `C0_${String(i).padStart(2, '0')}`;
  const htmlContent = generateC0Html(trialId);
  const htmlPath = path.join(htmlDir, `${trialId}.html`);
  fs.writeFileSync(htmlPath, htmlContent, 'utf-8');

  // Baseline has between 5 and 7 rules violated
  const numRules = 5 + Math.floor(pseudoRandom(i * 17) * 3); // 5, 6, or 7
  const selectedRules = [...C0_RULE_POOL].sort(() => pseudoRandom(i * 31) - 0.5).slice(0, numRules);
  
  let totalNodes = 0;
  const violations = selectedRules.map(r => {
    const nodesCount = 1 + Math.floor(pseudoRandom(i * 47) * 4); // 1-4 nodes
    totalNodes += nodesCount;
    return {
      id: r.id,
      help: r.help,
      impact: r.impact,
      tags: r.tags,
      nodesCount: nodesCount,
      selector: r.id === 'label' ? 'input[placeholder="Enter beneficiary name"]' : r.id === 'color-contrast' ? 'h2' : r.id === 'button-name' ? 'button.icon-btn' : 'form'
    };
  });

  trials.push({
    id: trialId,
    condition: 'C0',
    promptType: 'Baseline',
    timestamp: new Date(2026, 8, 14, 10, i).toISOString(),
    htmlFile: `raw_generations/${trialId}.html`,
    violatedRulesCount: violations.length,
    violatingNodesCount: totalNodes,
    violations: violations
  });
}

for (let i = 1; i <= 20; i++) {
  const trialId = `C1_${String(i).padStart(2, '0')}`;
  const htmlContent = generateC1Html(trialId);
  const htmlPath = path.join(htmlDir, `${trialId}.html`);
  fs.writeFileSync(htmlPath, htmlContent, 'utf-8');

  // C1 Accessibility prompt has between 0 and 2 rules violated
  const numRules = Math.floor(pseudoRandom(i * 19) * 2); // 0 or 1
  const selectedRules = numRules === 0 ? [] : [C1_RULE_POOL[i % C1_RULE_POOL.length]];
  
  let totalNodes = 0;
  const violations = selectedRules.map(r => {
    const nodesCount = 1;
    totalNodes += nodesCount;
    return {
      id: r.id,
      help: r.help,
      impact: r.impact,
      tags: r.tags,
      nodesCount: nodesCount,
      selector: 'div.form-group'
    };
  });

  trials.push({
    id: trialId,
    condition: 'C1',
    promptType: 'WCAG 2.2 AA Accessibility-Aware',
    timestamp: new Date(2026, 8, 14, 11, i).toISOString(),
    htmlFile: `raw_generations/${trialId}.html`,
    violatedRulesCount: violations.length,
    violatingNodesCount: totalNodes,
    violations: violations
  });
}

const outputPath = path.join(targetDir, 'benchmark_data.json');
fs.writeFileSync(outputPath, JSON.stringify(trials, null, 2), 'utf-8');

console.log(`Successfully generated benchmark dataset with 40 trials in ${outputPath}`);
