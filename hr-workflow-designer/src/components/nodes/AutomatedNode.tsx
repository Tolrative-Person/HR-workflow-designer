// src/components/nodes/AutomatedNode.tsx
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { AutomatedNodeData } from '../../types';

export function AutomatedNode({ data, selected }: NodeProps) {
  const d = data as unknown as AutomatedNodeData;
  return (
    <div className={`workflow-node node-automated ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="node-handle" />
      <div className="node-badge">AUTOMATED</div>
      <div className="node-title">{d.title || 'Automated Step'}</div>
      {d.actionId && <div className="node-meta">⚙️ {d.actionId}</div>}
      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </div>
  );
}
