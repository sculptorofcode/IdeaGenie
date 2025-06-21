
export interface Position {
  x: number;
  y: number;
}

export interface NodeBase {
  id: string;
  position: Position;
  title: string;
  type: 'root' | 'problem' | 'product' | 'status';
}

export interface RootNode extends NodeBase {
  type: 'root';
  inputValue: string;
}

export interface ProblemNode extends NodeBase {
  type: 'problem';
  context: string;
  url: string;
  painPoint: string;
  emotions: string[];
  parentId: string;
}

export interface ProductNode extends NodeBase {
  type: 'product';
  description: string;
  features: string[];
  parentId: string;
}

export interface StatusNode extends NodeBase {
  type: 'status';
  status: 'active' | 'completed' | 'hidden';
  step: number;
}

export type MindMapNode = RootNode | ProblemNode | ProductNode | StatusNode;

export interface Connection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
}

export interface ViewportState {
  x: number;
  y: number;
  scale: number;
}

export interface ApiSimulationStep {
  id: string;
  message: string;
  duration: number;
}
