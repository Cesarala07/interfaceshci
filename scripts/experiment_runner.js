import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeStudyData } from './stats_analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runExperimentRunner() {
  console.log("==========================================================");
  console.log(" AI Accessibility Prompting Study (ICITS 2027) Runner");
  console.log(" Scientific Protocol: N=40 (20 C0 Baseline, 20 C1 Accessible)");
  console.log(" Evaluation Engine: Axe-core WCAG 2.2 Level A/AA Audit");
  console.log("==========================================================\n");

  const benchmarkPath = path.join(__dirname, '..', 'dataset', 'benchmark_data.json');

  if (!fs.existsSync(benchmarkPath)) {
    console.log("Benchmark data not found. Running benchmark generator script...");
    const { execSync } = await import('child_process');
    execSync('node scripts/generate_benchmark_data.js', { stdio: 'inherit' });
  }

  const rawData = fs.readFileSync(benchmarkPath, 'utf-8');
  const trials = JSON.parse(rawData);

  console.log(`[+] Loaded ${trials.length} trial records from dataset.`);
  
  const stats = analyzeStudyData(trials);

  console.log("\n----------------------------------------------------------");
  console.log(" STATISTICAL SUMMARY (Primary & Secondary Outcomes)");
  console.log("----------------------------------------------------------");
  console.log(`Sample Size: N = ${stats.sampleSize.total} (${stats.sampleSize.c0} C0 Baseline, ${stats.sampleSize.c1} C1 Accessible)`);
  console.log("\n1. Violated Rules (VR - Primary Outcome):");
  console.log(`   - C0 Baseline Median [IQR]: ${stats.vr.c0.median} [Q1: ${stats.vr.c0.q1}, Q3: ${stats.vr.c0.q3}]`);
  console.log(`   - C1 Accessible Median [IQR]: ${stats.vr.c1.median} [Q1: ${stats.vr.c1.q1}, Q3: ${stats.vr.c1.q3}]`);
  console.log(`   - Violated Rules Reduction: -${stats.vr.reductionPct}%`);
  console.log(`   - Mann-Whitney U Statistic: U = ${stats.vr.mwu.u}, z = ${stats.vr.mwu.z.toFixed(3)}, p-value = ${stats.vr.mwu.pValue < 0.0001 ? '< 0.0001' : stats.vr.mwu.pValue.toFixed(4)} (Statistically Significant: ${stats.vr.mwu.significant})`);
  console.log(`   - Cliff's Delta Effect Size: d = ${stats.vr.cliffsDelta.delta.toFixed(3)} (${stats.vr.cliffsDelta.magnitude})`);

  console.log("\n2. Violating Nodes (VN - Secondary Outcome):");
  console.log(`   - C0 Baseline Median [IQR]: ${stats.vn.c0.median} [Q1: ${stats.vn.c0.q1}, Q3: ${stats.vn.c0.q3}]`);
  console.log(`   - C1 Accessible Median [IQR]: ${stats.vn.c1.median} [Q1: ${stats.vn.c1.q1}, Q3: ${stats.vn.c1.q3}]`);
  console.log(`   - Violating Nodes Reduction: -${stats.vn.reductionPct}%`);
  console.log(`   - Mann-Whitney U Statistic: U = ${stats.vn.mwu.u}, p-value = ${stats.vn.mwu.pValue < 0.0001 ? '< 0.0001' : stats.vn.mwu.pValue.toFixed(4)}`);
  console.log(`   - Cliff's Delta Effect Size: d = ${stats.vn.cliffsDelta.delta.toFixed(3)} (${stats.vn.cliffsDelta.magnitude})`);

  console.log("\n3. Top Violated Axe Rules (C0 vs C1):");
  stats.ruleFrequency.slice(0, 5).forEach((rule, idx) => {
    console.log(`   ${idx + 1}. [${rule.id}] ${rule.help}`);
    console.log(`      C0 Baseline: ${rule.c0_count} trials (${rule.c0_nodes} nodes) | C1 Accessible: ${rule.c1_count} trials (${rule.c1_nodes} nodes)`);
  });

  console.log("\n==========================================================");
  console.log(" Execution finished cleanly. Data ready for Web Dashboard!");
  console.log("==========================================================");
}

runExperimentRunner().catch(err => {
  console.error("Error in experiment runner:", err);
});
