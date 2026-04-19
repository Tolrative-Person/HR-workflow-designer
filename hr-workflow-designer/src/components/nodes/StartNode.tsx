// src/components/nodes/StartNode.tsx
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { StartNodeData } from '../../types';

export function StartNode({ data, selected }: NodeProps) {
  const d = data as unknown as StartNodeData;
  return (
    <div className={`workflow-node node-start ${selected ? 'selected' : ''}`}>
      <div className="node-badge">START</div>
      <div className="node-title">{d.title || 'Start Workflow'}</div>
      {d.metadata && d.metadata.length > 0 && (
        <div className="node-meta">{d.metadata.length} metadata field(s)</div>
      )}
      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </div>
  );
}
