import React, { useState, useCallback, useEffect } from 'react';
import InfiniteCanvas from './InfiniteCanvas';
import NodeCard from './NodeCard';
import ConnectionLine from './ConnectionLine';
import ControlPanel from './controls/ControlPanel';
import SimulationStatus from './controls/SimulationStatus';
import { MindMapNode, ViewportState, Position, Connection, ApiSimulationStep, StatusNode, ProblemNode, ProductNode } from '../../types/mindmap';
import { useToast } from '../../hooks/use-toast';

const MindMapScene: React.FC = () => {
  const { toast } = useToast();
  const [viewport, setViewport] = useState<ViewportState>({
    x: 100,
    y: 100,
    scale: 1,
  });

  const [nodes, setNodes] = useState<MindMapNode[]>([
    {
      id: 'root-1',
      type: 'root',
      position: { x: 400, y: 200 },
      title: 'IdeaGenie Root',
      inputValue: 'Enter your main topic...',
    }
  ]);

  const [connections, setConnections] = useState<Connection[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const simulationSteps: ApiSimulationStep[] = [
    { id: 'step-1', message: 'Selecting sub-keywords...', duration: 2000 },
    { id: 'step-2', message: 'Fetching from X.com...', duration: 3000 },
    { id: 'step-3', message: 'Performing backend analysis...', duration: 2500 },
    { id: 'step-4', message: 'Generating response with Gemini...', duration: 4000 },
  ];

  const handleViewportChange = useCallback((newViewport: ViewportState) => {
    setViewport(newViewport);
  }, []);

  const handleNodePositionChange = useCallback((nodeId: string, position: Position) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, position } : node
    ));
  }, []);

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<MindMapNode>) => {
    setNodes(prev => prev.map(node => {
      if (node.id !== nodeId) return node;
      
      switch (node.type) {
        case 'root':
          return {
            ...node,
            ...Object.fromEntries(
              Object.entries(updates).filter(([key]) => 
                ['title', 'inputValue', 'position'].includes(key)
              )
            )
          };
        case 'problem':
          return {
            ...node,
            ...Object.fromEntries(
              Object.entries(updates).filter(([key]) => 
                ['title', 'context', 'url', 'painPoint', 'emotions', 'position'].includes(key)
              )
            )
          };
        case 'product':
          return {
            ...node,
            ...Object.fromEntries(
              Object.entries(updates).filter(([key]) => 
                ['title', 'description', 'features', 'position'].includes(key)
              )
            )
          };
        case 'status':
          return {
            ...node,
            ...Object.fromEntries(
              Object.entries(updates).filter(([key]) => 
                ['title', 'status', 'step', 'position'].includes(key)
              )
            )
          };
        default:
          return node;
      }
    }));
  }, []);

  const handleAddChild = useCallback((parentNodeId: string) => {
    const parentNode = nodes.find(node => node.id === parentNodeId);
    if (!parentNode) return;

    const childNode: MindMapNode = {
      id: `child-${Date.now()}`,
      type: 'root',
      position: {
        x: parentNode.position.x + 350,
        y: parentNode.position.y,
      },
      title: 'Child Node',
      inputValue: 'Enter text...',
    };

    const newConnection: Connection = {
      id: `conn-${parentNodeId}-${childNode.id}`,
      fromNodeId: parentNodeId,
      toNodeId: childNode.id,
    };

    setNodes(prev => [...prev, childNode]);
    setConnections(prev => [...prev, newConnection]);

    toast({
      title: "Child node added",
      description: "A new child node has been created and connected.",
    });
  }, [nodes, toast]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.fromNodeId !== nodeId && conn.toNodeId !== nodeId
    ));
    toast({
      title: "Node deleted",
      description: "The node and its connections have been removed.",
    });
  }, [toast]);

  const startApiSimulation = useCallback(async () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    setCurrentStep(0);

    const statusNodes: StatusNode[] = simulationSteps.map((step, index) => ({
      id: `status-${step.id}`,
      type: 'status' as const,
      position: { x: 700 + (index * 120), y: 100 },
      title: step.message,
      status: 'hidden' as const,
      step: index + 1,
    }));

    setNodes(prev => [...prev, ...statusNodes]);

    for (let i = 0; i < simulationSteps.length; i++) {
      setCurrentStep(i);
      
      setNodes(prev => prev.map(node => {
        if (node.id === `status-step-${i + 1}`) {
          return { ...node, status: 'active' as const } as StatusNode;
        }
        return node;
      }));

      await new Promise(resolve => setTimeout(resolve, simulationSteps[i].duration));

      setNodes(prev => prev.map(node => {
        if (node.id === `status-step-${i + 1}`) {
          return { ...node, status: 'completed' as const } as StatusNode;
        }
        return node;
      }));
    }

    setTimeout(() => {
      setNodes(prev => prev.filter(node => node.type !== 'status'));
      generateProblemNodes();
      setIsSimulating(false);
    }, 1000);

  }, [isSimulating]);

  const generateProblemNodes = useCallback(() => {
    const rootNode = nodes.find(node => node.type === 'root');
    if (!rootNode) return;

    const problemData = [
      {
        title: 'Social Media Overwhelm',
        context: 'Users struggle with information overload on social platforms',
        url: 'https://x.com/example1',
        painPoint: 'Too many irrelevant posts and ads cluttering feeds',
        emotions: ['frustrated', 'overwhelmed', 'distracted'],
      },
      {
        title: 'Content Discovery Issues',
        context: 'Difficulty finding relevant content in crowded feeds',
        url: 'https://x.com/example2', 
        painPoint: 'Important content gets buried under viral posts',
        emotions: ['confused', 'annoyed', 'disconnected'],
      },
      {
        title: 'Engagement Fatigue',
        context: 'Users feel pressured to constantly engage with content',
        url: 'https://x.com/example3',
        painPoint: 'Endless scrolling without meaningful interactions',
        emotions: ['tired', 'unfulfilled', 'addicted'],
      },
    ];

    const newProblemNodes: ProblemNode[] = problemData.map((data, index) => ({
      id: `problem-${Date.now()}-${index}`,
      type: 'problem' as const,
      position: { 
        x: rootNode.position.x + (index - 1) * 400, 
        y: rootNode.position.y + 300 
      },
      title: data.title,
      context: data.context,
      url: data.url,
      painPoint: data.painPoint,
      emotions: data.emotions,
      parentId: rootNode.id,
    }));

    const newConnections: Connection[] = newProblemNodes.map(node => ({
      id: `conn-${rootNode.id}-${node.id}`,
      fromNodeId: rootNode.id,
      toNodeId: node.id,
    }));

    setNodes(prev => [...prev, ...newProblemNodes]);
    setConnections(prev => [...prev, ...newConnections]);

    toast({
      title: "Analysis Complete!",
      description: "Generated 3 problem nodes based on your topic.",
    });
  }, [nodes, toast]);

  const handleGenerateProductIdea = useCallback((problemNodeId: string) => {
    const problemNode = nodes.find(node => node.id === problemNodeId);
    if (!problemNode || problemNode.type !== 'problem') return;

    const productIdeas = {
      'Social Media Overwhelm': {
        title: 'Smart Fee Curator',
        description: 'AI-powered social media assistant that filters and prioritizes content based on user preferences and behavior patterns.',
        features: [
          'Intelligent content filtering',
          'Personalized priority scoring',
          'Distraction-free reading mode',
          'Weekly digest summaries',
        ],
      },
      'Content Discovery Issues': {
        title: 'Content Compass',
        description: 'Advanced discovery engine that surfaces relevant content using semantic analysis and user interest mapping.',
        features: [
          'Semantic content matching',
          'Interest graph analysis', 
          'Cross-platform content aggregation',
          'Smart recommendation engine',
        ],
      },
      'Engagement Fatigue': {
        title: 'Mindful Social',
        description: 'Wellness-focused social platform that promotes meaningful interactions and healthy digital habits.',
        features: [
          'Interaction quality metrics',
          'Digital wellness dashboard',
          'Mindful notification system',
          'Meaningful conversation prompts',
        ],
      },
    };

    const ideaData = productIdeas[problemNode.title as keyof typeof productIdeas] || {
      title: 'Custom Solution',
      description: 'A tailored solution addressing the identified problem.',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
    };

    const productNode: ProductNode = {
      id: `product-${Date.now()}`,
      type: 'product' as const,
      position: {
        x: problemNode.position.x + 100,
        y: problemNode.position.y + 200,
      },
      title: ideaData.title,
      description: ideaData.description,
      features: ideaData.features,
      parentId: problemNodeId,
    };

    const newConnection: Connection = {
      id: `conn-${problemNodeId}-${productNode.id}`,
      fromNodeId: problemNodeId,
      toNodeId: productNode.id,
    };

    setNodes(prev => [...prev, productNode]);
    setConnections(prev => [...prev, newConnection]);

    toast({
      title: "Product Idea Generated!",
      description: `Created "${ideaData.title}" solution for the identified problem.`,
    });
  }, [nodes, toast]);

  useEffect(() => {
    const rootNode = nodes.find(node => node.type === 'root');
    if (rootNode && rootNode.inputValue && rootNode.inputValue !== 'Enter your main topic...') {
      console.log('Root topic updated:', rootNode.inputValue);
    }
  }, [nodes]);

  return (
    <div className="w-full h-screen">
      <InfiniteCanvas
        viewport={viewport}
        onViewportChange={handleViewportChange}
      >
        {connections.map(connection => {
          const fromNode = nodes.find(n => n.id === connection.fromNodeId);
          const toNode = nodes.find(n => n.id === connection.toNodeId);
          
          if (!fromNode || !toNode) return null;
          
          let color = '#94a3b8';
          if (toNode.type === 'problem') color = '#ef4444';
          if (toNode.type === 'product') color = '#22c55e';
          
          return (
            <ConnectionLine
              key={connection.id}
              fromNode={fromNode}
              toNode={toNode}
              color={color}
            />
          );
        })}

        {nodes.map(node => (
          <NodeCard
            key={node.id}
            node={node}
            onPositionChange={handleNodePositionChange}
            onNodeUpdate={handleNodeUpdate}
            onAddChild={handleAddChild}
            onGenerateProductIdea={handleGenerateProductIdea}
            onDeleteNode={handleDeleteNode}
            viewport={viewport}
          />
        ))}
      </InfiniteCanvas>

      <ControlPanel
        onStartSimulation={startApiSimulation}
        isSimulating={isSimulating}
      />

      <SimulationStatus
        isSimulating={isSimulating}
        currentStep={currentStep}
        simulationSteps={simulationSteps}
      />
    </div>
  );
};

export default MindMapScene;
