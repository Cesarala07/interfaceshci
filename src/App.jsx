import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import OverviewKPIs from './components/OverviewKPIs';
import StatsDashboard from './components/StatsDashboard';
import InterfaceInspector from './components/InterfaceInspector';
import RuleFrequencyMatrix from './components/RuleFrequencyMatrix';
import LiveRunnerWorkbench from './components/LiveRunnerWorkbench';
import PaperExporter from './components/PaperExporter';

import benchmarkData from '../dataset/benchmark_data.json';
import { analyzeStudyData } from '../scripts/stats_analyzer.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [trials, setTrials] = useState(benchmarkData);

  // Compute live study statistics
  const stats = useMemo(() => {
    return analyzeStudyData(trials);
  }, [trials]);

  const handleAddNewTrial = (newTrial) => {
    setTrials(prev => [newTrial, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header & Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        trialsCount={trials.length} 
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {activeTab === 'overview' && (
          <OverviewKPIs stats={stats} setActiveTab={setActiveTab} />
        )}

        {activeTab === 'stats' && (
          <StatsDashboard stats={stats} trials={trials} />
        )}

        {activeTab === 'inspector' && (
          <InterfaceInspector trials={trials} />
        )}

        {activeTab === 'matrix' && (
          <RuleFrequencyMatrix stats={stats} />
        )}

        {activeTab === 'sandbox' && (
          <LiveRunnerWorkbench onRunNewTrial={handleAddNewTrial} />
        )}

        {activeTab === 'exporter' && (
          <PaperExporter stats={stats} trials={trials} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI Accessibility Prompting Study • ICITS 2027 Experimental Framework</span>
          <span>WCAG 2.2 Level AA • axe-core Automated Audit Engine</span>
        </div>
      </footer>

    </div>
  );
}
