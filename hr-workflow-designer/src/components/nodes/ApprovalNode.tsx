// src/components/nodes/ApprovalNode.tsx
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { ApprovalNodeData } from '../../types';

export function ApprovalNode({ data, selected }: NodeProps) {
  const d = data as unknown as ApprovalNodeData;
  return (
    <div className={`workflow-node node-approval ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="node-handle" />
      <div className="node-badge">APPROVAL</div>
      <div className="node-title">{d.title || 'Approval Step'}</div>
      {d.approverRole && <div className="node-meta">🔑 {d.approverRole}</div>}
      {d.autoApproveThreshold != null && (
        <div className="node-meta">⚡ Auto &gt; {d.autoApproveThreshold} days</div>
      )}
      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </div>
  );
}
