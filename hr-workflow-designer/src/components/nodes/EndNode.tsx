// src/components/nodes/EndNode.tsx
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { EndNodeData } from '../../types';

export function EndNode({ data, selected }: NodeProps) {
  const d = data as unknown as EndNodeData;
  return (
    <div className={`workflow-node node-end ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="node-handle" />
      <div className="node-badge">END</div>
      <div className="node-title">{d.endMessage || 'Workflow Complete'}</div>
    </div>
  );
}
