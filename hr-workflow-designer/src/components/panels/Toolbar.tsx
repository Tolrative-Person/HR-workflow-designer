// src/components/panels/Toolbar.tsx
import { useWorkflowStore } from '../../store/workflowStore';
import { validateWorkflow } from '../../hooks/useValidation';

export function Toolbar() {
  const { nodes, edges, setSimulationOpen, setValidationErrors, validationErrors, importWorkflow } =
    useWorkflowStore((s) => ({
      nodes: s.nodes,
      edges: s.edges,
      setSimulationOpen: s.setSimulationOpen,
      setValidationErrors: s.setValidationErrors,
      validationErrors: s.validationErrors,
      importWorkflow: s.importWorkflow,
    }));

  const handleValidate = () => {
    const errors = validateWorkflow(nodes, edges);
    setValidationErrors(errors);
    if (errors.length === 0) alert('✅ Workflow is valid!');
  };

  const handleImport = () => {
    const json = prompt('Paste workflow JSON:');
    if (json) importWorkflow(json);
  };

  const errorCount = validationErrors.filter((e) => e.severity === 'error').length;
  const warnCount = validationErrors.filter((e) => e.severity === 'warning').length;

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <span className="toolbar-title">HR Workflow Designer</span>
        <span className="toolbar-divider">|</span>
        <span className="toolbar-meta">{nodes.length} nodes · {edges.length} edges</span>
      </div>
      <div className="toolbar-right">
        {(errorCount > 0 || warnCount > 0) && (
          <div className="validation-badge">
            {errorCount > 0 && <span className="badge-error">{errorCount} error{errorCount > 1 ? 's' : ''}</span>}
            {warnCount > 0 && <span className="badge-warn">{warnCount} warning{warnCount > 1 ? 's' : ''}</span>}
          </div>
        )}
        <button className="toolbar-btn" onClick={handleValidate}>✓ Validate</button>
        <button className="toolbar-btn" onClick={handleImport}>↑ Import</button>
        <button className="toolbar-btn primary" onClick={() => setSimulationOpen(true)}>⚡ Run Simulation</button>
      </div>
    </div>
  );
}
