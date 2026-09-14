/**
 * Statistical Analysis Module for AI Accessibility Prompting Study (ICITS 2027)
 * Implements non-parametric statistics: Mann-Whitney U Test, Cliff's Delta, Median, IQR.
 */

export function calculateMedian(arr) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function calculateQuartiles(arr) {
  if (arr.length === 0) return { q1: 0, median: 0, q3: 0, iqr: 0 };
  const sorted = [...arr].sort((a, b) => a - b);
  const median = calculateMedian(sorted);
  const mid = Math.floor(sorted.length / 2);
  const lowerHalf = sorted.length % 2 !== 0 ? sorted.slice(0, mid) : sorted.slice(0, mid);
  const upperHalf = sorted.length % 2 !== 0 ? sorted.slice(mid + 1) : sorted.slice(mid);
  
  const q1 = calculateMedian(lowerHalf);
  const q3 = calculateMedian(upperHalf);
  const iqr = q3 - q1;
  return { q1, median, q3, iqr, min: sorted[0], max: sorted[sorted.length - 1] };
}

/**
 * Calculates Cliff's Delta effect size between group1 (e.g., C0 baseline) and group2 (e.g., C1 accessible)
 */
export function calculateCliffsDelta(group1, group2) {
  let greater = 0;
  let lesser = 0;
  
  for (let i = 0; i < group1.length; i++) {
    for (let j = 0; j < group2.length; j++) {
      if (group1[i] > group2[j]) greater++;
      else if (group1[i] < group2[j]) lesser++;
    }
  }
  
  const delta = (greater - lesser) / (group1.length * group2.length);
  const absDelta = Math.abs(delta);
  
  let magnitude = "Negligible";
  if (absDelta >= 0.474) magnitude = "Large";
  else if (absDelta >= 0.33) magnitude = "Medium";
  else if (absDelta >= 0.147) magnitude = "Small";
  
  return { delta, absDelta, magnitude };
}

/**
 * Mann-Whitney U test (two-sided) with Normal Approximation (suited for sample size N1, N2 >= 10)
 */
export function calculateMannWhitneyU(group1, group2) {
  const n1 = group1.length;
  const n2 = group2.length;
  
  if (n1 === 0 || n2 === 0) return { u1: 0, u2: 0, u: 0, z: 0, pValue: 1, significant: false };

  // Combine and rank
  const combined = [];
  group1.forEach(val => combined.push({ val, group: 1 }));
  group2.forEach(val => combined.push({ val, group: 2 }));
  
  combined.sort((a, b) => a.val - b.val);
  
  // Assign ranks with tie handling
  const ranks = new Array(combined.length);
  let i = 0;
  while (i < combined.length) {
    let j = i;
    while (j < combined.length && combined[j].val === combined[i].val) {
      j++;
    }
    const averageRank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) {
      ranks[k] = averageRank;
    }
    i = j;
  }
  
  let R1 = 0;
  for (let idx = 0; idx < combined.length; idx++) {
    if (combined[idx].group === 1) {
      R1 += ranks[idx];
    }
  }
  
  const U1 = R1 - (n1 * (n1 + 1)) / 2;
  const U2 = n1 * n2 - U1;
  const U = Math.min(U1, U2);
  
  // Normal approximation
  const meanU = (n1 * n2) / 2;
  
  // Check for ties variance correction
  const tieMap = {};
  combined.forEach(c => { tieMap[c.val] = (tieMap[c.val] || 0) + 1; });
  let tieSum = 0;
  Object.values(tieMap).forEach(t => {
    if (t > 1) {
      tieSum += (Math.pow(t, 3) - t);
    }
  });
  
  const N = n1 + n2;
  const stdU = Math.sqrt((n1 * n2 / 12) * ((N + 1) - tieSum / (N * (N - 1))));
  
  const z = stdU === 0 ? 0 : (Math.abs(U1 - meanU) - 0.5) / stdU;
  
  // Two-sided p-value from standard normal CDF approximation (erf function)
  const pValue = z === 0 ? 1 : 2 * (1 - normalCDF(Math.abs(z)));
  
  return {
    u1: U1,
    u2: U2,
    u: U,
    z,
    pValue,
    significant: pValue < 0.05
  };
}

function normalCDF(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z >= 0 ? 1 - prob : prob;
}

/**
 * Analyzes complete benchmark dataset for summary metrics and rule frequencies
 */
export function analyzeStudyData(trials) {
  const c0Trials = trials.filter(t => t.condition === 'C0');
  const c1Trials = trials.filter(t => t.condition === 'C1');
  
  const c0_VR = c0Trials.map(t => t.violatedRulesCount);
  const c1_VR = c1Trials.map(t => t.violatedRulesCount);
  
  const c0_VN = c0Trials.map(t => t.violatingNodesCount);
  const c1_VN = c1Trials.map(t => t.violatingNodesCount);
  
  const vr_c0_stats = calculateQuartiles(c0_VR);
  const vr_c1_stats = calculateQuartiles(c1_VR);
  const vn_c0_stats = calculateQuartiles(c0_VN);
  const vn_c1_stats = calculateQuartiles(c1_VN);
  
  const mwu_VR = calculateMannWhitneyU(c0_VR, c1_VR);
  const mwu_VN = calculateMannWhitneyU(c0_VN, c1_VN);
  
  const cliff_VR = calculateCliffsDelta(c0_VR, c1_VR);
  const cliff_VN = calculateCliffsDelta(c0_VN, c1_VN);
  
  // Aggregate violated rules frequency
  const ruleFrequency = {};
  
  trials.forEach(trial => {
    trial.violations.forEach(v => {
      if (!ruleFrequency[v.id]) {
        ruleFrequency[v.id] = {
          id: v.id,
          help: v.help,
          impact: v.impact,
          wcagTags: v.tags ? v.tags.filter(t => t.includes('wcag')) : [],
          c0_count: 0,
          c1_count: 0,
          c0_nodes: 0,
          c1_nodes: 0
        };
      }
      if (trial.condition === 'C0') {
        ruleFrequency[v.id].c0_count++;
        ruleFrequency[v.id].c0_nodes += v.nodesCount || 1;
      } else {
        ruleFrequency[v.id].c1_count++;
        ruleFrequency[v.id].c1_nodes += v.nodesCount || 1;
      }
    });
  });
  
  const sortedRules = Object.values(ruleFrequency).sort((a, b) => (b.c0_count + b.c1_count) - (a.c0_count + a.c1_count));
  
  const vrReductionPct = vr_c0_stats.median === 0 ? 0 : Math.round(((vr_c0_stats.median - vr_c1_stats.median) / vr_c0_stats.median) * 100);
  const vnReductionPct = vn_c0_stats.median === 0 ? 0 : Math.round(((vn_c0_stats.median - vn_c1_stats.median) / vn_c0_stats.median) * 100);

  return {
    sampleSize: { total: trials.length, c0: c0Trials.length, c1: c1Trials.length },
    vr: {
      c0: vr_c0_stats,
      c1: vr_c1_stats,
      mwu: mwu_VR,
      cliffsDelta: cliff_VR,
      reductionPct: vrReductionPct
    },
    vn: {
      c0: vn_c0_stats,
      c1: vn_c1_stats,
      mwu: mwu_VN,
      cliffsDelta: cliff_VN,
      reductionPct: vnReductionPct
    },
    ruleFrequency: sortedRules
  };
}

// CLI Execution Support
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].includes('stats_analyzer.js')) {
  console.log("Stats Analyzer initialized.");
}
