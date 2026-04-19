// src/components/WorkflowCanvas.tsx
import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type OnConnect,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflowStore } from '../store/workflowStore';
import { StartNode } from './nodes/StartNode';
import { TaskNode } from './nodes/TaskNode';
import { ApprovalNode } from './nodes/ApprovalNode';
import { AutomatedNode } from './nodes/AutomatedNode';
import { EndNode } from './nodes/EndNode';
import type { NodeType, WorkflowNodeData } from '../types';

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

const defaultDataForType = (type: NodeType): WorkflowNodeData => {
  switch (type) {
    case 'start': return { type: 'start', title: 'Start Workflow', metadata: [] };
    case 'task': return { type: 'task', title: '', description: '', assignee: '', dueDate: '', customFields: [] };
    case 'approval': return { type: 'approval', title: 'Approval Step', approverRole: 'Manager', autoApproveThreshold: 3 };
    case 'automated': return { type: 'automated', title: 'Automated Step', actionId: '', actionParams: {} };
    case 'end': return { type: 'end', endMessage: 'Workflow Complete' };
  }
};

let nodeCounter = 100;

export function WorkflowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes, edges,
    onNodesChange, onEdgesChange, onConnect,
    addNode, selectNode, selectedNodeId,
  } = useWorkflowStore((s) => ({
    nodes: s.nodes,
    edges: s.edges,
    onNodesChange: s.onNodesChange,
    onEdgesChange: s.onEdgesChange,
    onConnect: s.onConnect,
    addNode: s.addNode,
    selectNode: s.selectNode,
    selectedNodeId: s.selectedNodeId,
  }));

  const handleConnect: OnConnect = useCallback(
    (connection) => onConnect(connection),
    [onConnect]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => selectNode(node.id),
    [selectNode]
  );

  const onPaneClick = useCallback(() => selectNode(null), [selectNode]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow-type') as NodeType;
      if (!type) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;

      // Get position relative to canvas
      const x = event.clientX - bounds.left - 100;
      const y = event.clientY - bounds.top - 40;

      const id = `${type}-${++nodeCounter}`;
      const newNode = {
        id,
        type,
        position: { x, y },
        data: defaultDataForType(type),
      };

      addNode(newNode);
      selectNode(id);
    },
    [addNode, selectNode]
  );

  return (
    <div className="canvas-wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes.map((n) => ({ ...n, selected: n.id === selectedNodeId }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode="Delete"
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#f97316', strokeWidth: 2 },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#334155"
        />
        <Controls className="flow-controls" />
        <MiniMap
          className="flow-minimap"
          nodeColor={(n) => {
            switch (n.type) {
              case 'start': return '#22c55e';
              case 'task': return '#3b82f6';
              case 'approval': return '#a855f7';
              case 'automated': return '#f97316';
              case 'end': return '#ef4444';
              default: return '#64748b';
            }
          }}
          maskColor="rgba(15,23,42,0.7)"
        />
      </ReactFlow>
    </div>
  );
}
