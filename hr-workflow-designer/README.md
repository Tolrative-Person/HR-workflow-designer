# HR Workflow Designer — Tredence Analytics

A visual HR Workflow Designer module built with React + React Flow.  
Allows HR admins to create, configure, and simulate internal workflows (onboarding, leave approval, document verification, etc.)

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Architecture

```
src/
├── api/
│   └── mockApi.ts          # Mock GET /automations + POST /simulate
├── components/
│   ├── nodes/              # One file per node type (custom React Flow nodes)
│   │   ├── StartNode.tsx
│   │   ├── TaskNode.tsx
│   │   ├── ApprovalNode.tsx
│   │   ├── AutomatedNode.tsx
│   │   └── EndNode.tsx
│   ├── forms/
│   │   └── NodeForm.tsx    # Per-type config panels + KVEditor utility
│   ├── panels/
│   │   ├── Toolbar.tsx     # Top bar: validate, import, run simulation
│   │   └── SimulationPanel.tsx  # Sandbox modal
│   └── sidebar/
│       └── NodeSidebar.tsx # Drag-to-canvas node palette
├── hooks/
│   ├── useAutomations.ts   # Fetches mock automation actions
│   └── useValidation.ts    # Pure graph validation logic
├── store/
│   └── workflowStore.ts    # Zustand: nodes, edges, selection, simulation state
├── styles/                 # Scoped CSS files per concern
├── types/
│   └── index.ts            # All TypeScript types for node data
└── App.tsx                 # Layout composition
```

### Key Separation of Concerns

| Layer | Responsibility |
|-------|---------------|
| `api/` | All mock API calls — can be swapped for real endpoints |
| `store/` | Single source of truth via Zustand |
| `components/nodes/` | Pure display; reads `data` prop from React Flow |
| `components/forms/` | Edit panels; writes via `updateNodeData` from store |
| `hooks/` | Reusable logic decoupled from UI |

---

## Node Types & Forms

| Type | Fields |
|------|--------|
| **Start** | Title, metadata key-value pairs |
| **Task** | Title (required), description, assignee, due date, custom fields |
| **Approval** | Title, approver role (Manager/HRBP/Director/CXO), auto-approve threshold |
| **Automated** | Title, action dropdown (from mock API), dynamic param fields |
| **End** | End message |

The form panel is **polymorphic** — it renders the correct form based on `node.type`. Adding a new node type requires: 1 node component, 1 form component, 1 entry in `defaultDataForType`, and 1 type definition.

---

## Mock API Layer

`src/api/mockApi.ts` simulates async calls with artificial delay:

- **`GET /automations`** — returns 6 mock automation actions with dynamic parameter definitions
- **`POST /simulate`** — accepts full workflow JSON, runs BFS traversal, validates graph structure, returns step-by-step execution log

No external network calls. No server required.

---

## Workflow Simulation

The sandbox panel:
1. Serializes the full graph (nodes + edges) to JSON
2. Sends to mock `/simulate` with optional `summary` flag
3. Validates: start node exists, end node exists, no disconnected nodes, no cycles
4. Displays step-by-step execution log with status (✅ success / ⚠️ warning / ❌ error)

---

## Canvas Features

- Drag nodes from sidebar onto canvas
- Connect nodes by dragging between handles
- Click to select + configure in right panel
- Press `Delete` to remove selected node/edge
- Validate workflow without running simulation
- Export/Import workflow as JSON
- Minimap + zoom controls

---

## Design Decisions

- **Zustand over Redux/Context**: simpler API, no boilerplate, fine-grained subscriptions
- **No external form library**: controlled components give us full flexibility for dynamic param fields
- **CSS modules not used**: scoped CSS files per concern keeps it simple without build overhead
- **BFS for simulation**: deterministic traversal; detects cycles and unreachable nodes
- **Polymorphic form panel**: `NodeForm.tsx` is a single entry point that branches by `node.type`, making it easy to extend

---

## What I'd Add With More Time

- [ ] Undo/Redo with Zustand middleware
- [ ] Conditional edges (e.g., Approved / Rejected branches)
- [ ] Node validation errors shown visually on canvas
- [ ] Auto-layout algorithm (dagre)
- [ ] Real backend persistence (POST /workflows)
- [ ] Node templates / presets
- [ ] Node version history / changelog
- [ ] Keyboard shortcuts

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **@xyflow/react** (React Flow v12)
- **Zustand** (state management)
- **Lucide React** (icons)
- **DM Sans** + **Space Mono** (typography)
