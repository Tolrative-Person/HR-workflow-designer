// src/store/workflowStore.ts
import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react';
import type { WorkflowNodeData, ValidationError } from '../types';

export type WorkflowNode = Node<WorkflowNodeData>;

interface WorkflowStore {
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  validationErrors: ValidationError[];
  simulationOpen: boolean;

  // Node/Edge mutations
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: WorkflowNode) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;

  // Selection
  selectNode: (nodeId: string | null) => void;

  // Validation
  setValidationErrors: (errors: ValidationError[]) => void;

  // Simulation panel
  setSimulationOpen: (open: boolean) => void;

  // Export/Import
  exportWorkflow: () => string;
  importWorkflow: (json: string) => void;
}

const defaultNodes: WorkflowNode[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 300, y: 80 },
    data: { type: 'start', title: 'Start Workflow', metadata: [] },
  },
];

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: defaultNodes,
  edges: [],
  selectedNodeId: null,
  validationErrors: [],
  simulationOpen: false,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as WorkflowNode[],
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  onConnect: (connection) =>
    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          animated: true,
          style: { stroke: '#f97316', strokeWidth: 2 },
        },
        state.edges
      ),
    })),

  addNode: (node) =>
    set((state) => ({ nodes: [...state.nodes, node] })),

  updateNodeData: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n
      ),
    })),

  deleteNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    })),

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  setValidationErrors: (errors) => set({ validationErrors: errors }),

  setSimulationOpen: (open) => set({ simulationOpen: open }),

  exportWorkflow: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ nodes, edges }, null, 2);
  },

  importWorkflow: (json) => {
    try {
      const parsed = JSON.parse(json);
      if (parsed.nodes && parsed.edges) {
        set({ nodes: parsed.nodes, edges: parsed.edges, selectedNodeId: null });
      }
    } catch {
      console.error('Failed to import workflow JSON');
    }
  },
}));
