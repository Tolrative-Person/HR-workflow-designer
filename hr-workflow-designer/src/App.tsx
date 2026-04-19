// src/App.tsx
import { NodeSidebar } from './components/sidebar/NodeSidebar';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { NodeFormPanel } from './components/forms/NodeForm';
import { SimulationPanel } from './components/panels/SimulationPanel';
import { Toolbar } from './components/panels/Toolbar';
import './styles/global.css';
import './styles/nodes.css';
import './styles/sidebar.css';
import './styles/forms.css';
import './styles/simulation.css';
import './styles/toolbar.css';

export default function App() {
  return (
    <div className="app-layout">
      <NodeSidebar />
      <div className="main-area">
        <Toolbar />
        <WorkflowCanvas />
      </div>
      <NodeFormPanel />
      <SimulationPanel />
    </div>
  );
}
