// src/api/mockApi.ts
import type { MockAction, SimulationResult, SimulationStep } from '../types';

// Simulated network delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const MOCK_ACTIONS: MockAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'send_slack', label: 'Send Slack Notification', params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create JIRA Ticket', params: ['project', 'summary', 'assignee'] },
  { id: 'update_hris', label: 'Update HRIS Record', params: ['employeeId', 'field', 'value'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['participants', 'duration', 'subject'] },
];

// GET /automations
export async function getAutomations(): Promise<MockAction[]> {
  await delay(300);
  return MOCK_ACTIONS;
}

// POST /simulate
export async function simulateWorkflow(workflowJson: {
  nodes: Array<{ id: string; type: string; data: Record<string, unknown> }>;
  edges: Array<{ id: string; source: string; target: string }>;
  summary?: boolean;
}): Promise<SimulationResult> {
  await delay(800);

  const { nodes, edges } = workflowJson;
  const steps: SimulationStep[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate: must have a start node
  const startNodes = nodes.filter((n) => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push('Workflow must have a Start node.');
  }
  if (startNodes.length > 1) {
    warnings.push('Multiple Start nodes detected — only the first will be used.');
  }

  // Validate: must have an end node
  const endNodes = nodes.filter((n) => n.type === 'end');
  if (endNodes.length === 0) {
    errors.push('Workflow must have an End node.');
  }

  // Validate: every non-end node must have at least one outgoing edge
  nodes.forEach((node) => {
    if (node.type !== 'end') {
      const hasOutgoing = edges.some((e) => e.source === node.id);
      if (!hasOutgoing) {
        warnings.push(
          `Node "${(node.data.title as string) || node.id}" has no outgoing connection.`
        );
      }
    }
  });

  // Topological traversal simulation
  const adjList: Record<string, string[]> = {};
  nodes.forEach((n) => (adjList[n.id] = []));
  edges.forEach((e) => {
    if (adjList[e.source]) adjList[e.source].push(e.target);
  });

  // BFS from start node
  const visited = new Set<string>();
  const queue: string[] = startNodes.length > 0 ? [startNodes[0].id] : [];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    if (visited.has(nodeId)) {
      errors.push('Cycle detected in workflow graph!');
      break;
    }
    visited.add(nodeId);

    const node = nodes.find((n) => n.id === nodeId);
    if (!node) continue;

    const nodeType = node.type as string;
    const title = (node.data.title as string) || (node.data.endMessage as string) || nodeType;

    let status: SimulationStep['status'] = 'success';
    let message = '';

    switch (nodeType) {
      case 'start':
        message = `Workflow initiated: "${title}"`;
        break;
      case 'task':
        if (!node.data.title) {
          status = 'warning';
          message = 'Task node is missing a title.';
        } else {
          message = `Task assigned to ${(node.data.assignee as string) || 'Unassigned'} — due ${
            (node.data.dueDate as string) || 'No date set'
          }`;
        }
        break;
      case 'approval':
        message = `Approval requested from ${(node.data.approverRole as string) || 'Manager'}. Auto-approve threshold: ${
          (node.data.autoApproveThreshold as number) ?? 'N/A'
        } days`;
        break;
      case 'automated':
        if (!node.data.actionId) {
          status = 'warning';
          message = 'Automated step has no action configured.';
        } else {
          message = `Executing automation: "${node.data.actionId}"`;
        }
        break;
      case 'end':
        message = `Workflow complete: "${(node.data.endMessage as string) || 'Done'}"`;
        break;
      default:
        message = `Unknown node type: ${nodeType}`;
        status = 'error';
    }

    steps.push({
      nodeId,
      nodeType: nodeType as SimulationStep['nodeType'],
      title,
      status,
      message,
      timestamp: new Date().toISOString(),
    });

    // Enqueue neighbors
    (adjList[nodeId] || []).forEach((neighbor) => {
      if (!visited.has(neighbor)) queue.push(neighbor);
    });
  }

  // Unvisited nodes
  nodes.forEach((n) => {
    if (!visited.has(n.id)) {
      warnings.push(
        `Node "${(n.data.title as string) || n.id}" is unreachable from the Start node.`
      );
    }
  });

  const success = errors.length === 0;
  const summary = success
    ? `Workflow simulated successfully across ${steps.length} step(s).`
    : `Simulation failed with ${errors.length} error(s) and ${warnings.length} warning(s).`;

  return { success, summary, steps, errors, warnings };
}
