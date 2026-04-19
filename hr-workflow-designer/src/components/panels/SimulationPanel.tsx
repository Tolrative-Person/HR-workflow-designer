// src/components/panels/SimulationPanel.tsx
import { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { simulateWorkflow } from '../../api/mockApi';
import type { SimulationResult } from '../../types';

export function SimulationPanel() {
  const { nodes, edges, simulationOpen, setSimulationOpen, exportWorkflow } = useWorkflowStore(
    (s) => ({
      nodes: s.nodes,
      edges: s.edges,
      simulationOpen: s.simulationOpen,
      setSimulationOpen: s.setSimulationOpen,
      exportWorkflow: s.exportWorkflow,
    })
  );

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(true);
  const [activeTab, setActiveTab] = useState<'simulate' | 'export'>('simulate');
  const [exportJson, setExportJson] = useState('');

  const runSimulation = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await simulateWorkflow({
        nodes: nodes.map((n) => ({
          id: n.id,
          type: n.type || '',
          data: n.data as Record<string, unknown>,
        })),
        edges,
        summary,
      });
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    setExportJson(exportWorkflow());
    setActiveTab('export');
  };

  if (!simulationOpen) return null;

  const statusIcon = (s: string) => (s === 'success' ? '✅' : s === 'warning' ? '⚠️' : '❌');

  return (
    <div className="sim-overlay" onClick={(e) => e.target === e.currentTarget && setSimulationOpen(false)}>
      <div className="sim-panel">
        <div className="sim-header">
          <div className="sim-title">⚡ Workflow Sandbox</div>
          <button className="btn-close" onClick={() => setSimulationOpen(false)}>✕</button>
        </div>

        <div className="sim-tabs">
          <button
            className={`sim-tab ${activeTab === 'simulate' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulate')}
          >
            Run Simulation
          </button>
          <button
            className={`sim-tab ${activeTab === 'export' ? 'active' : ''}`}
            onClick={handleExport}
          >
            Export JSON
          </button>
        </div>

        {activeTab === 'simulate' && (
          <div className="sim-body">
            <div className="sim-controls">
              <div className="sim-stats">
                <span className="stat-chip">{nodes.length} nodes</span>
                <span className="stat-chip">{edges.length} edges</span>
              </div>
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={summary}
                  onChange={(e) => setSummary(e.target.checked)}
                />
                Summary Mode
              </label>
              <button className="btn-primary" onClick={runSimulation} disabled={loading}>
                {loading ? 'Simulating…' : '▶ Run Simulation'}
              </button>
            </div>

            {result && (
              <div className="sim-results">
                <div className={`sim-summary ${result.success ? 'success' : 'error'}`}>
                  {result.success ? '✅' : '❌'} {result.summary}
                </div>

                {result.errors.length > 0 && (
                  <div className="issues-block errors">
                    <div className="issues-title">Errors</div>
                    {result.errors.map((e, i) => <div key={i} className="issue-item">❌ {e}</div>)}
                  </div>
                )}

                {result.warnings.length > 0 && (
                  <div className="issues-block warnings">
                    <div className="issues-title">Warnings</div>
                    {result.warnings.map((w, i) => <div key={i} className="issue-item">⚠️ {w}</div>)}
                  </div>
                )}

                <div className="execution-log">
                  <div className="log-title">Execution Log</div>
                  {result.steps.map((step, i) => (
                    <div key={i} className={`log-step status-${step.status}`}>
                      <div className="log-step-header">
                        <span className="log-icon">{statusIcon(step.status)}</span>
                        <span className="log-step-title">{step.title}</span>
                        <span className="log-type-badge">{step.nodeType.toUpperCase()}</span>
                      </div>
                      <div className="log-message">{step.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'export' && (
          <div className="sim-body">
            <div className="export-actions">
              <button
                className="btn-ghost"
                onClick={() => {
                  navigator.clipboard.writeText(exportJson);
                }}
              >
                📋 Copy to Clipboard
              </button>
            </div>
            <pre className="json-output">{exportJson}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
