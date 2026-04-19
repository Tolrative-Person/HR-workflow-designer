// src/components/nodes/TaskNode.tsx
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { TaskNodeData } from '../../types';

export function TaskNode({ data, selected }: NodeProps) {
  const d = data as unknown as TaskNodeData;
  return (
    <div className={`workflow-node node-task ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="node-handle" />
      <div className="node-badge">TASK</div>
      <div className="node-title">{d.title || 'Untitled Task'}</div>
      {d.assignee && <div className="node-meta">👤 {d.assignee}</div>}
      {d.dueDate && <div className="node-meta">📅 {d.dueDate}</div>}
      {d.description && (
        <div className="node-desc">{d.description.slice(0, 60)}{d.description.length > 60 ? '…' : ''}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </div>
  );
}
