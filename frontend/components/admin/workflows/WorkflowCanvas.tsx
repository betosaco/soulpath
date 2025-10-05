'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { WorkflowNode, WorkflowConnection } from './VisualWorkflowBuilder';
import { WorkflowNode as NodeComponent } from './WorkflowNode';

interface WorkflowCanvasProps {
  workflow: {
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
  };
  onNodeSelect: (node: WorkflowNode | null) => void;
  onNodeUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  onConnectionCreate: (connection: Omit<WorkflowConnection, 'id'>) => void;
  onConnectionDelete: (connectionId: string) => void;
  onAddNode: (type: string, position?: { x: number; y: number }) => void;
  zoom: number;
  isDragging: boolean;
}

export function WorkflowCanvas({
  workflow,
  onNodeSelect,
  onNodeUpdate,
  onConnectionCreate,
  onConnectionDelete,
  onAddNode,
  zoom,
  isDragging
}: WorkflowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [connecting, setConnecting] = useState<{
    source: string;
    sourceHandle: string;
    startPos: { x: number; y: number };
    currentPos: { x: number; y: number };
  } | null>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedNodes(new Set());
      onNodeSelect(null);
    }
  }, [onNodeSelect]);

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('application/node-type');

    if (nodeType && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: (e.clientX - rect.left - canvasOffset.x) / zoom,
        y: (e.clientY - rect.top - canvasOffset.y) / zoom
      };

      onAddNode(nodeType, position);
    }
  }, [canvasOffset, zoom, onAddNode]);

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current && e.button === 1) { // Middle mouse button
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
    }
  }, [canvasOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setCanvasOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }

    if (connecting) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setConnecting(prev => prev ? {
          ...prev,
          currentPos: {
            x: (e.clientX - rect.left - canvasOffset.x) / zoom,
            y: (e.clientY - rect.top - canvasOffset.y) / zoom
          }
        } : null);
      }
    }
  }, [isPanning, panStart, connecting, canvasOffset, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleConnectionStart = useCallback((nodeId: string, handleId: string, position: { x: number; y: number }) => {
    setConnecting({
      source: nodeId,
      sourceHandle: handleId,
      startPos: position,
      currentPos: position
    });
  }, []);

  const handleConnectionEnd = useCallback((targetNodeId: string, targetHandleId: string) => {
    if (connecting) {
      const sourceNode = workflow.nodes.find(n => n.id === connecting.source);
      let label: string | undefined;
      let condition: string | undefined;

      // Add labels for conditional routing
      if (sourceNode) {
        switch (sourceNode.type) {
          case 'condition':
            if (connecting.sourceHandle === 'true') {
              label = 'True';
              condition = 'result === true';
            } else if (connecting.sourceHandle === 'false') {
              label = 'False';
              condition = 'result === false';
            }
            break;
          case 'switch':
            if (connecting.sourceHandle.startsWith('case')) {
              const caseIndex = parseInt(connecting.sourceHandle.replace('case', ''));
              const switchCase = sourceNode.data.cases?.[caseIndex - 1];
              if (switchCase) {
                label = switchCase.label || switchCase.case;
                condition = `value === '${switchCase.case}'`;
              }
            } else if (connecting.sourceHandle === 'default') {
              label = 'Default';
              condition = 'default_case';
            }
            break;
          case 'loop':
            if (connecting.sourceHandle === 'loop') {
              label = 'Loop';
              condition = 'should_continue';
            } else if (connecting.sourceHandle === 'complete') {
              label = 'Complete';
              condition = 'loop_finished';
            }
            break;
          case 'retry':
            if (connecting.sourceHandle === 'success') {
              label = 'Success';
              condition = 'retry_successful';
            } else if (connecting.sourceHandle === 'error') {
              label = 'Failed';
              condition = 'max_retries_exceeded';
            }
            break;
          case 'error_handler':
            if (connecting.sourceHandle === 'success') {
              label = 'Handled';
              condition = 'error_handled';
            } else if (connecting.sourceHandle === 'error') {
              label = 'Unhandled';
              condition = 'error_unhandled';
            }
            break;
        }
      }

      const connection: Omit<WorkflowConnection, 'id'> = {
        source: connecting.source,
        target: targetNodeId,
        sourceHandle: connecting.sourceHandle,
        targetHandle: targetHandleId,
        label,
        condition
      };

      onConnectionCreate(connection);
      setConnecting(null);
    }
  }, [connecting, onConnectionCreate, workflow.nodes]);

  const handleConnectionCancel = useCallback(() => {
    setConnecting(null);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedNodes.size > 0) {
        // Delete selected nodes and their connections
        selectedNodes.forEach(nodeId => {
          onNodeUpdate(nodeId, { /* mark for deletion */ });
        });
        setSelectedNodes(new Set());
      }

      if (e.key === 'Escape') {
        setSelectedNodes(new Set());
        setConnecting(null);
        onNodeSelect(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodes, onNodeUpdate, onNodeSelect]);

  return (
    <div
      ref={canvasRef}
      className={`relative w-full h-full overflow-hidden bg-gray-100 ${isDragging ? 'cursor-move' : ''}`}
      onClick={handleCanvasClick}
      onDrop={handleCanvasDrop}
      onDragOver={handleCanvasDragOver}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Canvas Transform */}
      <div
        className="relative w-full h-full"
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle, #ddd 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Connections */}
        <svg className="absolute inset-0 pointer-events-none overflow-visible">
          {workflow.connections.map((connection) => {
            const sourceNode = workflow.nodes.find(n => n.id === connection.source);
            const targetNode = workflow.nodes.find(n => n.id === connection.target);

            if (!sourceNode || !targetNode) return null;

            const sourceHandle = sourceNode.outputs.find(o => o.id === connection.sourceHandle);
            const targetHandle = targetNode.inputs.find(i => i.id === connection.targetHandle);

            if (!sourceHandle || !targetHandle) return null;

            const sourcePos = {
              x: sourceNode.position.x + 120, // Node width approximation
              y: sourceNode.position.y + 30  // Node height approximation
            };

            const targetPos = {
              x: targetNode.position.x,
              y: targetNode.position.y + 30
            };

            // Calculate control points for curved connection
            const dx = targetPos.x - sourcePos.x;
            const dy = targetPos.y - sourcePos.y;
            const controlPoint1 = {
              x: sourcePos.x + dx * 0.5,
              y: sourcePos.y
            };
            const controlPoint2 = {
              x: targetPos.x - dx * 0.5,
              y: targetPos.y
            };

            return (
              <g key={connection.id}>
                {/* Connection path with curve */}
                <path
                  d={`M ${sourcePos.x} ${sourcePos.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${targetPos.x} ${targetPos.y}`}
                  stroke="#4a7c2e"
                  strokeWidth="3"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className="pointer-events-auto cursor-pointer hover:stroke-blue-500 transition-colors duration-200"
                  onClick={() => onConnectionDelete(connection.id)}
                />
                
                {/* Connection label */}
                {connection.label && (
                  <text
                    x={(sourcePos.x + targetPos.x) / 2}
                    y={(sourcePos.y + targetPos.y) / 2 - 5}
                    textAnchor="middle"
                    className="text-xs fill-gray-600 pointer-events-none"
                  >
                    {connection.label}
                  </text>
                )}
                
                {/* Connection control point */}
                <circle
                  cx={(sourcePos.x + targetPos.x) / 2}
                  cy={(sourcePos.y + targetPos.y) / 2}
                  r="6"
                  fill="#4a7c2e"
                  className="pointer-events-auto cursor-pointer hover:fill-blue-500 transition-colors duration-200"
                  onClick={() => onConnectionDelete(connection.id)}
                />
                <circle
                  cx={(sourcePos.x + targetPos.x) / 2}
                  cy={(sourcePos.y + targetPos.y) / 2}
                  r="3"
                  fill="white"
                  className="pointer-events-none"
                />
              </g>
            );
          })}

          {/* Temporary connection during creation */}
          {connecting && (
            <path
              d={`M ${connecting.startPos.x} ${connecting.startPos.y} Q ${(connecting.startPos.x + connecting.currentPos.x) / 2} ${connecting.startPos.y - 20} ${connecting.currentPos.x} ${connecting.currentPos.y}`}
              stroke="#4a7c2e"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
              markerEnd="url(#arrowhead)"
              className="animate-pulse"
            />
          )}

          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#4a7c2e"
              />
            </marker>
          </defs>
        </svg>

        {/* Nodes */}
        {workflow.nodes.map((node) => (
          <NodeComponent
            key={node.id}
            node={node}
            isSelected={selectedNodes.has(node.id)}
            onSelect={() => {
              const newSelection = new Set([node.id]);
              setSelectedNodes(newSelection);
              onNodeSelect(node);
            }}
            onUpdate={(updates) => onNodeUpdate(node.id, updates)}
            onConnectionStart={handleConnectionStart}
            onConnectionEnd={handleConnectionEnd}
            onConnectionCancel={handleConnectionCancel}
            zoom={zoom}
          />
        ))}
      </div>

      {/* Canvas Info */}
      <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded shadow-sm text-sm text-gray-600">
        <div>Nodes: {workflow.nodes.length}</div>
        <div>Connections: {workflow.connections.length}</div>
        <div>Zoom: {Math.round(zoom * 100)}%</div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded shadow-sm text-sm text-gray-600 max-w-xs">
        <div className="font-medium mb-1">Instructions:</div>
        <div>• Drag nodes from sidebar</div>
        <div>• Click and drag connection handles to connect</div>
        <div>• Middle-click to pan canvas</div>
        <div>• Delete key to remove selected</div>
        <div>• Click connections to delete them</div>
        <div>• Use zoom controls in header</div>
      </div>

      {/* Connection Help */}
      <div className="absolute bottom-4 right-4 bg-blue-50 px-3 py-2 rounded shadow-sm text-sm text-blue-700 max-w-xs">
        <div className="font-medium mb-1">Connection Tips:</div>
        <div>• Blue handles = Input connections</div>
        <div>• Green handles = Output connections</div>
        <div>• Hover handles to see connection info</div>
        <div>• Curved lines show data flow</div>
      </div>
    </div>
  );
}
