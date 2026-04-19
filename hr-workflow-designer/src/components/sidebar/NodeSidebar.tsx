// src/components/sidebar/NodeSidebar.tsx
import type { DragEvent } from 'react';
import type { NodeType } from '../../types';

interface NodeDef {
  type: NodeType;
  label: string;
  description: string;
  icon: string;
  colorClass: string;
}

const NODE_DEFS: NodeDef[] = [
  { type: 'start', label: 'Start', description: 'Workflow entry point', icon: '▶', colorClass: 'chip-start' },
  { type: 'task', label: 'Task', description: 'Human task step', icon: '☑', colorClass: 'chip-task' },
  { type: 'approval', label: 'Approval', description: 'Manager/HR approval', icon: '✓', colorClass: 'chip-approval' },
  { type: 'automated', label: 'Automated', description: 'System-triggered action', icon: '⚙', colorClass: 'chip-automated' },
  { type: 'end', label: 'End', description: 'Workflow completion', icon: '⏹', colorClass: 'chip-end' },
];

export function NodeSidebar() {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow-type', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">HR FLOW</div>
        <div className="sidebar-sub">Workflow Designer</div>
      </div>

      <div className="sidebar-section-label">Node Types</div>
      <div className="sidebar-nodes">
        {NODE_DEFS.map((def) => (
          <div
            key={def.type}
            className={`node-chip ${def.colorClass}`}
            draggable
            onDragStart={(e) => onDragStart(e, def.type)}
          >
            <span className="chip-icon">{def.icon}</span>
            <div className="chip-text">
              <div className="chip-label">{def.label}</div>
              <div className="chip-desc">{def.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-section-label">Instructions</div>
      <div className="sidebar-instructions">
        <div className="instruction-item">⟵ Drag nodes onto canvas</div>
        <div className="instruction-item">● Click to select & configure</div>
        <div className="instruction-item">→ Connect nodes by dragging handles</div>
        <div className="instruction-item">⌫ Select + Delete key to remove</div>
      </div>
    </div>
  );
}
