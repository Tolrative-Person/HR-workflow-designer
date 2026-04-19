// src/components/forms/NodeForm.tsx
import { useWorkflowStore } from '../../store/workflowStore';
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
  KeyValuePair,
} from '../../types';
import { useAutomations } from '../../hooks/useAutomations';

function KVEditor({
  pairs,
  onChange,
  label,
}: {
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
  label: string;
}) {
  const add = () => onChange([...pairs, { key: '', value: '' }]);
  const remove = (i: number) => onChange(pairs.filter((_, idx) => idx !== i));
  const update = (i: number, field: 'key' | 'value', val: string) => {
    const updated = [...pairs];
    updated[i] = { ...updated[i], [field]: val };
    onChange(updated);
  };

  return (
    <div className="form-section">
      <label className="form-label">{label}</label>
      {pairs.map((pair, i) => (
        <div key={i} className="kv-row">
          <input
            className="form-input kv-input"
            placeholder="key"
            value={pair.key}
            onChange={(e) => update(i, 'key', e.target.value)}
          />
          <input
            className="form-input kv-input"
            placeholder="value"
            value={pair.value}
            onChange={(e) => update(i, 'value', e.target.value)}
          />
          <button className="kv-remove" onClick={() => remove(i)}>✕</button>
        </div>
      ))}
      <button className="btn-ghost" onClick={add}>+ Add {label}</button>
    </div>
  );
}

function StartForm({ nodeId, data }: { nodeId: string; data: StartNodeData }) {
  const update = useWorkflowStore((s) => s.updateNodeData);
  return (
    <div className="node-form">
      <div className="form-section">
        <label className="form-label">Start Title</label>
        <input
          className="form-input"
          value={data.title}
          onChange={(e) => update(nodeId, { title: e.target.value } as Partial<StartNodeData>)}
          placeholder="e.g. Employee Onboarding"
        />
      </div>
      <KVEditor
        pairs={data.metadata}
        label="Metadata"
        onChange={(metadata) => update(nodeId, { metadata } as Partial<StartNodeData>)}
      />
    </div>
  );
}

function TaskForm({ nodeId, data }: { nodeId: string; data: TaskNodeData }) {
  const update = useWorkflowStore((s) => s.updateNodeData);
  return (
    <div className="node-form">
      <div className="form-section">
        <label className="form-label">Title <span className="required">*</span></label>
        <input
          className="form-input"
          value={data.title}
          onChange={(e) => update(nodeId, { title: e.target.value } as Partial<TaskNodeData>)}
          placeholder="Task name"
        />
      </div>
      <div className="form-section">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          value={data.description}
          onChange={(e) => update(nodeId, { description: e.target.value } as Partial<TaskNodeData>)}
          placeholder="Task description"
          rows={3}
        />
      </div>
      <div className="form-section">
        <label className="form-label">Assignee</label>
        <input
          className="form-input"
          value={data.assignee}
          onChange={(e) => update(nodeId, { assignee: e.target.value } as Partial<TaskNodeData>)}
          placeholder="Name or role"
        />
      </div>
      <div className="form-section">
        <label className="form-label">Due Date</label>
        <input
          className="form-input"
          type="date"
          value={data.dueDate}
          onChange={(e) => update(nodeId, { dueDate: e.target.value } as Partial<TaskNodeData>)}
        />
      </div>
      <KVEditor
        pairs={data.customFields}
        label="Custom Fields"
        onChange={(customFields) => update(nodeId, { customFields } as Partial<TaskNodeData>)}
      />
    </div>
  );
}

function ApprovalForm({ nodeId, data }: { nodeId: string; data: ApprovalNodeData }) {
  const update = useWorkflowStore((s) => s.updateNodeData);
  return (
    <div className="node-form">
      <div className="form-section">
        <label className="form-label">Title</label>
        <input
          className="form-input"
          value={data.title}
          onChange={(e) => update(nodeId, { title: e.target.value } as Partial<ApprovalNodeData>)}
          placeholder="Approval step name"
        />
      </div>
      <div className="form-section">
        <label className="form-label">Approver Role</label>
        <select
          className="form-select"
          value={data.approverRole}
          onChange={(e) => update(nodeId, { approverRole: e.target.value } as Partial<ApprovalNodeData>)}
        >
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
          <option value="CXO">CXO</option>
        </select>
      </div>
      <div className="form-section">
        <label className="form-label">Auto-Approve Threshold (days)</label>
        <input
          className="form-input"
          type="number"
          value={data.autoApproveThreshold}
          onChange={(e) =>
            update(nodeId, { autoApproveThreshold: Number(e.target.value) } as Partial<ApprovalNodeData>)
          }
          placeholder="e.g. 3"
          min={0}
        />
      </div>
    </div>
  );
}

function AutomatedForm({ nodeId, data }: { nodeId: string; data: AutomatedNodeData }) {
  const update = useWorkflowStore((s) => s.updateNodeData);
  const { automations, loading } = useAutomations();
  const selectedAction = automations.find((a) => a.id === data.actionId);

  const handleActionChange = (actionId: string) => {
    const action = automations.find((a) => a.id === actionId);
    const actionParams: Record<string, string> = {};
    action?.params.forEach((p) => (actionParams[p] = ''));
    update(nodeId, { actionId, actionParams } as Partial<AutomatedNodeData>);
  };

  return (
    <div className="node-form">
      <div className="form-section">
        <label className="form-label">Title</label>
        <input
          className="form-input"
          value={data.title}
          onChange={(e) => update(nodeId, { title: e.target.value } as Partial<AutomatedNodeData>)}
          placeholder="Step name"
        />
      </div>
      <div className="form-section">
        <label className="form-label">Action</label>
        {loading ? (
          <div className="loading-text">Loading actions…</div>
        ) : (
          <select
            className="form-select"
            value={data.actionId}
            onChange={(e) => handleActionChange(e.target.value)}
          >
            <option value="">— Select Action —</option>
            {automations.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        )}
      </div>
      {selectedAction && selectedAction.params.length > 0 && (
        <div className="form-section">
          <label className="form-label">Action Parameters</label>
          {selectedAction.params.map((param) => (
            <div key={param} className="param-row">
              <label className="param-label">{param}</label>
              <input
                className="form-input"
                value={(data.actionParams || {})[param] || ''}
                onChange={(e) =>
                  update(nodeId, {
                    actionParams: { ...data.actionParams, [param]: e.target.value },
                  } as Partial<AutomatedNodeData>)
                }
                placeholder={param}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EndForm({ nodeId, data }: { nodeId: string; data: EndNodeData }) {
  const update = useWorkflowStore((s) => s.updateNodeData);
  return (
    <div className="node-form">
      <div className="form-section">
        <label className="form-label">End Message</label>
        <input
          className="form-input"
          value={data.endMessage}
          onChange={(e) => update(nodeId, { endMessage: e.target.value } as Partial<EndNodeData>)}
          placeholder="e.g. Onboarding complete!"
        />
      </div>
    </div>
  );
}

export function NodeFormPanel() {
  const { nodes, selectedNodeId, selectNode, deleteNode } = useWorkflowStore((s) => ({
    nodes: s.nodes,
    selectedNodeId: s.selectedNodeId,
    selectNode: s.selectNode,
    deleteNode: s.deleteNode,
  }));

  if (!selectedNodeId) {
    return (
      <div className="form-panel empty">
        <div className="empty-icon">☐</div>
        <div className="empty-text">Select a node to configure it</div>
      </div>
    );
  }

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const nodeTypeLabels: Record<string, string> = {
    start: 'Start Node',
    task: 'Task Node',
    approval: 'Approval Node',
    automated: 'Automated Step',
    end: 'End Node',
  };

  return (
    <div className="form-panel">
      <div className="form-panel-header">
        <div>
          <div className="form-panel-type">{nodeTypeLabels[node.type || ''] || 'Node'}</div>
          <div className="form-panel-id">ID: {node.id}</div>
        </div>
        <button className="btn-close" onClick={() => selectNode(null)}>✕</button>
      </div>

      {node.type === 'start' && <StartForm nodeId={node.id} data={node.data as unknown as StartNodeData} />}
      {node.type === 'task' && <TaskForm nodeId={node.id} data={node.data as unknown as TaskNodeData} />}
      {node.type === 'approval' && <ApprovalForm nodeId={node.id} data={node.data as unknown as ApprovalNodeData} />}
      {node.type === 'automated' && <AutomatedForm nodeId={node.id} data={node.data as unknown as AutomatedNodeData} />}
      {node.type === 'end' && <EndForm nodeId={node.id} data={node.data as unknown as EndNodeData} />}

      <div className="form-panel-footer">
        <button
          className="btn-danger"
          onClick={() => deleteNode(selectedNodeId)}
        >
          🗑 Delete Node
        </button>
      </div>
    </div>
  );
}
