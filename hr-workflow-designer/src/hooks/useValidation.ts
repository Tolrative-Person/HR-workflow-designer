// src/hooks/useValidation.ts
import type { Edge } from '@xyflow/react';
import type { WorkflowNode } from '../store/workflowStore';
import type { ValidationError } from '../types';

export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: Edge[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  const startNodes = nodes.filter((n) => n.type === 'start');
  const endNodes = nodes.filter((n) => n.type === 'end');

  if (startNodes.length === 0) {
    errors.push({ message: 'Workflow must have at least one Start node.', severity: 'error' });
  }
  if (startNodes.length > 1) {
    errors.push({ message: 'Workflow has multiple Start nodes.', severity: 'warning' });
  }
  if (endNodes.length === 0) {
    errors.push({ message: 'Workflow must have at least one End node.', severity: 'error' });
  }

  nodes.forEach((node) => {
    const data = node.data as Record<string, unknown>;
    if (node.type !== 'end') {
      const hasOut = edges.some((e) => e.source === node.id);
      if (!hasOut) {
        errors.push({
          nodeId: node.id,
          message: `"${(data.title as string) || node.id}" has no outgoing connection.`,
          severity: 'warning',
        });
      }
    }
    if (node.type !== 'start') {
      const hasIn = edges.some((e) => e.target === node.id);
      if (!hasIn) {
        errors.push({
          nodeId: node.id,
          message: `"${(data.title as string) || node.id}" has no incoming connection.`,
          severity: 'warning',
        });
      }
    }
    if (node.type === 'task' && !(data.title as string)) {
      errors.push({
        nodeId: node.id,
        message: 'Task node is missing a required title.',
        severity: 'error',
      });
    }
  });

  return errors;
}
